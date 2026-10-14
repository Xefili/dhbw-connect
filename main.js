import { createServer } from 'node:http'
import { fetchMensa } from 'ka-mensa-fetch'

const port = Number(process.env.PORT ?? 3000)
const canteenId = 'erzberger'
const refreshIntervalMs = 30 * 60 * 1000

let cachedPlan
let isRefreshing = false

function getKarlsruheDate() {
  const dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const parts = Object.fromEntries(dateParts.map(({ type, value }) => [type, value]))
  return `${parts.year}-${parts.month}-${parts.day}`
}

async function refreshPlan() {
  if (isRefreshing) return
  isRefreshing = true

  try {
    const date = getKarlsruheDate()
    const [year, month, day] = date.split('-').map(Number)
    const plans = await fetchMensa('simplesite', {
      canteens: [canteenId],
      dates: [date],
    })
    const plan = plans.find(
      (candidate) =>
        candidate.id === canteenId &&
        candidate.date.year === year &&
        candidate.date.month === month - 1 &&
        candidate.date.day === day,
    )

    if (!plan) {
      throw new Error(`No canteen plan returned for ${date}`)
    }

    cachedPlan = plan
    console.info(`Updated ${canteenId} menu for ${date}`)
  } finally {
    isRefreshing = false
  }
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(data))
}

const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    response.end()
    return
  }

  if (request.method !== 'GET') {
    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  if (pathname === '/health') {
    sendJson(response, 200, { status: 'ok', menuAvailable: Boolean(cachedPlan) })
    return
  }

  if (pathname !== '/') {
    sendJson(response, 404, { error: 'Not found' })
    return
  }

  if (!cachedPlan) {
    sendJson(response, 503, { error: 'Menu is not available yet' })
    return
  }

  sendJson(response, 200, cachedPlan)
})

server.listen(port, '0.0.0.0', () => {
  console.info(`Mensa API listening on port ${port}`)
})

void refreshPlan().catch((error) => {
  console.error('Initial menu fetch failed:', error)
})

setInterval(() => {
  void refreshPlan().catch((error) => {
    console.error('Menu refresh failed:', error)
  })
}, refreshIntervalMs)
