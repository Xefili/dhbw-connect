<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import LoadingPlaceholder from './LoadingPlaceholder.vue'
import StatusMessage from './StatusMessage.vue'
import {
  DB_URL,
  DHBW_ADDRESS,
  GOOGLE_MAPS_DIRECTIONS_URL,
  KVV_DEPARTURE_COUNT,
  KVV_ENDPOINT,
  KVV_FETCH_LIMIT,
  KVV_STOP_ID,
} from '@/config'

const mapsUrl = `${GOOGLE_MAPS_DIRECTIONS_URL}?api=1&origin=${encodeURIComponent(DHBW_ADDRESS)}&travelmode=transit`

const REFRESH_INTERVAL_MS = 30_000

const tracks = ref([])
const loaded = ref(false)
const error = ref(false)
let activeRequest = 0
let timer = null

function toMinutes(dateTime) {
  return Number(dateTime.hour) * 60 + Number(dateTime.minute)
}

function formatTime(dateTime) {
  return `${dateTime.hour.padStart(2, '0')}:${dateTime.minute.padStart(2, '0')}`
}

function mapEntry(entry, index) {
  const planned = entry.dateTime
  const real = entry.realDateTime || planned

  return {
    id: `${entry.servingLine.stateless}-${formatTime(planned)}-${index}`,
    direction: entry.servingLine.direction,
    countdown: Number(entry.countdown),
    time: formatTime(real),
    delay: Math.max(0, toMinutes(real) - toMinutes(planned)),
  }
}

// Groups departures by track and keeps the next few of each.
function groupByTrack(list) {
  const groups = new Map()

  list.forEach((entry, index) => {
    const name = entry.platformName || 'Gleis'
    if (!groups.has(name)) {
      groups.set(name, [])
    }
    const departures = groups.get(name)
    if (departures.length < KVV_DEPARTURE_COUNT) {
      departures.push(mapEntry(entry, index))
    }
  })

  return [...groups]
    .map(([name, departures]) => ({ name, departures }))
    .sort((a, b) => a.name.localeCompare(b.name, 'de', { numeric: true }))
}

async function fetchDepartures() {
  const requestId = ++activeRequest

  try {
    const params = new URLSearchParams({
      outputFormat: 'JSON',
      depType: 'stopEvents',
      mode: 'direct',
      type_dm: 'stop',
      name_dm: KVV_STOP_ID,
      useRealtime: '1',
      limit: String(KVV_FETCH_LIMIT),
    })
    const response = await fetch(`${KVV_ENDPOINT}?${params}`)
    if (!response.ok) {
      throw new Error(`KVV request failed with status ${response.status}`)
    }

    const result = await response.json()
    if (requestId !== activeRequest) {
      return
    }

    tracks.value = groupByTrack(result.departureList || [])
    error.value = false
  } catch (err) {
    if (requestId === activeRequest) {
      console.error('Could not load the departures:', err)
      error.value = true
    }
  } finally {
    if (requestId === activeRequest) {
      loaded.value = true
    }
  }
}

function stopPolling() {
  clearInterval(timer)
  timer = null
}

function startPolling() {
  stopPolling()
  timer = setInterval(fetchDepartures, REFRESH_INTERVAL_MS)
}

function onVisibilityChange() {
  if (document.hidden) {
    stopPolling()
  } else {
    fetchDepartures()
    startPolling()
  }
}

onMounted(() => {
  fetchDepartures()
  startPolling()
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  stopPolling()
  activeRequest++
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <section>
    <div class="departure-header">
      <h2>Abfahrten Duale Hochschule</h2>
      <div class="departure-links">
        <a :href="mapsUrl" target="_blank" rel="noopener noreferrer">Google Maps Route</a>
        <a :href="DB_URL" target="_blank" rel="noopener noreferrer">Bahn</a>
      </div>
    </div>

    <LoadingPlaceholder v-if="!loaded" :rows="3" label="Abfahrten werden geladen" />

    <template v-else>
      <!-- Keep showing the last successful data if a refresh fails -->
      <StatusMessage v-if="error">
        {{
          tracks.length
            ? 'Die Abfahrten konnten nicht aktualisiert werden.'
            : 'Die Abfahrten konnten nicht geladen werden.'
        }}
      </StatusMessage>

      <div v-if="tracks.length" class="grid gap-x-6 sm:grid-cols-2">
        <table
          v-for="track in tracks"
          :key="track.name"
          class="my-1 w-full border-collapse text-left text-sm"
        >
          <caption>
            {{
              track.name
            }}
          </caption>

          <thead>
            <tr>
              <th
                v-for="column in ['Richtung', 'Abfahrt']"
                :key="column"
                scope="col"
                class="border-border-l border-b-2 px-2 py-1 dark:border-border-d"
              >
                {{ column }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="departure in track.departures"
              :key="departure.id"
              class="border-border-l border-b dark:border-border-d"
            >
              <th scope="row" class="px-2 py-1 font-normal">{{ departure.direction }}</th>
              <td class="px-2 py-1 whitespace-nowrap">
                {{ departure.countdown <= 0 ? 'jetzt' : `${departure.countdown} min` }}
                <span class="opacity-70">({{ departure.time }})</span>
                <span v-if="departure.delay > 0" class="text-red-600 dark:text-red-400">
                  +{{ departure.delay }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else-if="!error" class="my-2">Keine Abfahrten gefunden.</p>
    </template>
  </section>
</template>

<style scoped>
.departure-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}

.departure-links {
  display: flex;
  gap: 0.5rem;
}

.departure-links a {
  padding: 0.25rem 0.75rem;
  border: 1px solid currentColor;
  border-radius: 0.25rem;
  text-decoration: none;
}
</style>
