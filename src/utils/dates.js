import { TIME_ZONE } from '@/config'

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const timeFormatter = new Intl.DateTimeFormat('de-DE', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

const dayFormatter = new Intl.DateTimeFormat('de-DE', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const rangeFormatter = new Intl.DateTimeFormat('de-DE', {
  timeZone: TIME_ZONE,
  day: 'numeric',
  month: 'long',
})

// Dates are handled as "YYYY-MM-DD" keys. Noon UTC avoids day shifts across time zones.
const noon = (dateKey) => new Date(`${dateKey}T12:00:00Z`)

function partsOf(formatter, date) {
  return Object.fromEntries(formatter.formatToParts(date).map(({ type, value }) => [type, value]))
}

/** "YYYY-MM-DD" of a date in the campus time zone. */
export function getDateKey(date) {
  const { year, month, day } = partsOf(dateFormatter, date)
  return `${year}-${month}-${day}`
}

/** Shifts a "YYYY-MM-DD" key by a number of days. */
export function addDays(dateKey, amount) {
  const date = noon(dateKey)
  date.setUTCDate(date.getUTCDate() + amount)
  return date.toISOString().slice(0, 10)
}

/** Monday = 0 … Sunday = 6. */
export function weekdayIndex(dateKey) {
  return (noon(dateKey).getUTCDay() + 6) % 7
}

/** "YYYY-MM-DD" of an ISO timestamp. */
export function dateKeyOf(isoString) {
  return getDateKey(new Date(isoString))
}

/** e.g. "Montag 3. März" */
export function formatDayLabel(dateKey) {
  return dayFormatter.format(noon(dateKey))
}

/** e.g. "3. – 7. März" */
export function formatDateRange(startKey, endKey) {
  return `${rangeFormatter.format(noon(startKey))} - ${rangeFormatter.format(noon(endKey))}`
}

/** e.g. "08:15" */
export function formatTime(isoString) {
  return timeFormatter.format(new Date(isoString))
}

/** e.g. "08:15–09:45" */
export function formatTimeRange(startIso, endIso) {
  return `${formatTime(startIso)}-${formatTime(endIso)}`
}

/** Minutes after midnight in the campus time zone. */
export function minutesOfDay(isoString) {
  const { hour, minute } = partsOf(timeFormatter, new Date(isoString))
  return Number(hour) * 60 + Number(minute)
}
