<script setup>
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'https://mensa.xefili.app/events'
const TIME_ZONE = 'Europe/Berlin'
const DAY_START = 6
const DAY_END = 20
const DAYS_IN_WEEK = 5

const events = ref([])
const loaded = ref(false)
const error = ref(false)

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
})

const timeFormatter = new Intl.DateTimeFormat('de-DE', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23'
})

const dayFormatter = new Intl.DateTimeFormat('de-DE', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  day: 'numeric',
  month: 'long'
})

function getDateKey(date) {
  const parts = Object.fromEntries(
    dateFormatter.formatToParts(date).map(({ type, value }) => [type, value])
  )

  return `${parts.year}-${parts.month}-${parts.day}`
}

function addDays(dateKey, amount) {
  const date = new Date(`${dateKey}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + amount)
  return date.toISOString().slice(0, 10)
}

function getTimeParts(date) {
  const parts = Object.fromEntries(
    timeFormatter.formatToParts(date).map(({ type, value }) => [type, value])
  )

  return { hour: Number(parts.hour), minute: Number(parts.minute) }
}

function eventDateKey(event) {
  return getDateKey(new Date(event.startTime))
}

function formatTime(dateString) {
  return timeFormatter.format(new Date(dateString))
}

const todayKey = getDateKey(new Date())
const today = new Date(`${todayKey}T12:00:00Z`)
const mondayOffset = (today.getUTCDay() + 6) % 7
const mondayKey = addDays(todayKey, -mondayOffset)

const weekDays = computed(() =>
  Array.from({ length: DAYS_IN_WEEK }, (_, index) => {
    const key = addDays(mondayKey, index)
    return {
      key,
      label: dayFormatter.format(new Date(`${key}T12:00:00Z`)),
      isToday: key === todayKey,
      events: sortedEvents.value.filter((event) => eventDateKey(event) === key)
    }
  })
)

const sortedEvents = computed(() =>
  [...events.value].sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
)

const todayEvents = computed(() =>
  sortedEvents.value.filter((event) => eventDateKey(event) === todayKey)
)

const hourLabels = Array.from({ length: DAY_END - DAY_START }, (_, index) => DAY_START + index)

const weekRange = computed(() => {
  const endKey = addDays(mondayKey, DAYS_IN_WEEK - 1)
  const start = new Date(`${mondayKey}T12:00:00Z`)
  const end = new Date(`${endKey}T12:00:00Z`)
  const rangeFormatter = new Intl.DateTimeFormat('de-DE', {
    timeZone: TIME_ZONE,
    day: 'numeric',
    month: 'long'
  })

  return `${rangeFormatter.format(start)} – ${rangeFormatter.format(end)}`
})

function eventStyle(event) {
  const start = getTimeParts(new Date(event.startTime))
  const end = getTimeParts(new Date(event.endTime))
  const startMinutes = Math.max(start.hour * 60 + start.minute, DAY_START * 60)
  const endMinutes = Math.min(end.hour * 60 + end.minute, DAY_END * 60)
  const top = ((startMinutes - DAY_START * 60) / 60) * 3
  const height = Math.max(((endMinutes - startMinutes) / 60) * 3, 2.5)

  return { top: `${top}rem`, height: `${height}rem` }
}

async function fetchEvents() {
  try {
    const response = await fetch(ENDPOINT)
    if (!response.ok) {
      throw new Error(`Timetable request failed with status ${response.status}`)
    }

    const data = await response.json()
    if (!Array.isArray(data)) {
      throw new Error('Timetable response is not an event list')
    }

    events.value = data.filter((event) => event.startTime && event.endTime)
  } catch (err) {
    console.error('Could not load the timetable:', err)
    error.value = true
  } finally {
    loaded.value = true
  }
}

onMounted(fetchEvents)
</script>

<template>
  <section>
    <h2>Stundenplan</h2>

    <div v-if="!loaded" class="mt-4 grid gap-2" role="status" aria-live="polite">
      <div
        v-for="_ in 4"
        :key="_"
        class="h-12 w-full animate-pulse rounded-md bg-s-surface-l dark:bg-s-surface-d"
      ></div>
    </div>

    <p v-else-if="error" class="mt-4" role="alert">
      Der Stundenplan konnte nicht geladen werden.
    </p>

    <template v-else>
      <h3 class="my-4 hidden text-text-s-l dark:text-text-s-d lg:block">{{ weekRange }}</h3>

      <div class="lg:hidden">
        <h3 class="my-4 font-semibold">
          {{ dayFormatter.format(new Date(`${todayKey}T12:00:00Z`)) }}
        </h3>

        <ul v-if="todayEvents.length" class="space-y-3">
          <li
            v-for="event in todayEvents"
            :key="event.id"
            class="card-floating border-l-4 border-text-accent-l p-4 dark:border-text-accent-d"
            :class="{ 'opacity-60': event.cancelled }"
          >
            <div class="flex flex-col gap-1">
              <p class="font-semibold">
                {{ formatTime(event.startTime) }}–{{ formatTime(event.endTime) }}
              </p>
              <p>{{ event.name }}</p>
              <p v-if="event.rooms?.length" class="text-sm text-text-s-l dark:text-text-s-d">
                {{ event.rooms.join(', ') }}
              </p>
              <p v-if="event.cancelled" class="font-semibold text-text-accent-l dark:text-text-accent-d">
                Fällt aus
              </p>
            </div>
          </li>
        </ul>
        <p v-else class="card-floating p-4">Heute finden keine Vorlesungen statt.</p>
      </div>

      <div class="hidden overflow-x-auto lg:block">
        <div class="min-w-[700px]">
          <div class="grid grid-cols-[4rem_repeat(5,minmax(0,1fr))]">
            <div class="border-b border-border-l p-2 dark:border-border-d"></div>
            <div
              v-for="day in weekDays"
              :key="day.key"
              class="border-b border-l border-border-l p-2 text-center text-sm font-semibold dark:border-border-d"
              :class="day.isToday ? 'bg-s-surface-l dark:bg-s-surface-d' : ''"
            >
              {{ day.label }}
            </div>

            <div class="text-sm">
              <div
                v-for="hour in hourLabels"
                :key="hour"
                class="h-12 border-b border-border-l pr-2 pt-1 text-right dark:border-border-d"
              >
                {{ `${String(hour).padStart(2, '0')}:00` }}
              </div>
            </div>

            <div
              v-for="day in weekDays"
              :key="`${day.key}-schedule`"
              class="relative"
              :class="day.isToday ? 'bg-s-surface-l/30 dark:bg-s-surface-d/30' : ''"
            >
              <div
                v-for="hour in hourLabels"
                :key="hour"
                class="h-12 border-b border-l border-border-l dark:border-border-d"
              ></div>

              <p
                v-if="!day.events.length"
                class="absolute inset-x-1 top-2 text-center text-xs text-text-s-l dark:text-text-s-d"
              >
                Keine Vorlesungen
              </p>

              <article
                v-for="event in day.events"
                :key="event.id"
                class="absolute inset-x-1 z-10 overflow-hidden rounded-md border-l-4 border-text-accent-l bg-s-surface-l/80 p-1 text-xs dark:border-text-accent-d dark:bg-s-surface-d/80"
                :class="{ 'opacity-60': event.cancelled }"
                :style="eventStyle(event)"
                :title="`${event.name} (${formatTime(event.startTime)}–${formatTime(event.endTime)})`"
              >
                <p class="font-semibold">
                  {{ formatTime(event.startTime) }}–{{ formatTime(event.endTime) }}
                </p>
                <p class="line-clamp-2">{{ event.name }}</p>
                <p v-if="event.rooms?.length" class="truncate">
                  {{ event.rooms.join(', ') }}
                </p>
                <p v-if="event.cancelled" class="font-semibold">Fällt aus</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>