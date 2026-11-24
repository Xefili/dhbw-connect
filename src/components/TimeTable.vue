<script setup>
import { computed, onMounted, ref } from 'vue'
import DateNavigation from './DateNavigation.vue'
import LoadingPlaceholder from './LoadingPlaceholder.vue'
import StatusMessage from './StatusMessage.vue'
import TimetableDay from './TimetableDay.vue'
import TimetableWeek from './TimetableWeek.vue'
import { TIMETABLE_ENDPOINT } from '@/config'
import {
  addDays,
  dateKeyOf,
  formatDateRange,
  formatDayLabel,
  getDateKey,
  weekdayIndex,
} from '@/utils/dates'

const DAYS_DISPLAYED = 5
const DAYS_PER_WEEK = 7

const events = ref([])
const loaded = ref(false)
const error = ref(false)
const weekOffset = ref(0)

const todayKey = getDateKey(new Date())
const mondayKey = computed(() =>
  addDays(todayKey, -weekdayIndex(todayKey) + weekOffset.value * DAYS_PER_WEEK),
)

// Events grouped by day, each day sorted by start time.
const eventsByDay = computed(() => {
  const groups = {}
  const sorted = [...events.value].sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

  for (const event of sorted) {
    const key = dateKeyOf(event.startTime)
    groups[key] = groups[key] || []
    groups[key].push(event)
  }

  return groups
})

const weekDays = computed(() =>
  Array.from({ length: DAYS_DISPLAYED }, (_, index) => {
    const key = addDays(mondayKey.value, index)
    return {
      key,
      label: formatDayLabel(key),
      isToday: key === todayKey,
      events: eventsByDay.value[key] || [],
    }
  }),
)

// Mobile view shows a single day: today's weekday within the selected week.
const mobileDay = computed(() => {
  const key = addDays(mondayKey.value, weekdayIndex(todayKey))
  return {
    label: formatDayLabel(key),
    events: eventsByDay.value[key] || [],
  }
})

const weekRange = computed(() =>
  formatDateRange(mondayKey.value, addDays(mondayKey.value, DAYS_DISPLAYED - 1)),
)

async function fetchEvents() {
  try {
    const response = await fetch(TIMETABLE_ENDPOINT)
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
    <DateNavigation
      title="Stundenplan"
      :label="weekRange"
      previous-label="Vorherige Woche"
      next-label="Nächste Woche"
      @previous="weekOffset--"
      @next="weekOffset++"
    />

    <LoadingPlaceholder v-if="!loaded" :rows="4" label="Stundenplan wird geladen" />

    <StatusMessage v-else-if="error">Der Stundenplan konnte nicht geladen werden.</StatusMessage>

    <template v-else>
      <TimetableDay class="lg:hidden" :label="mobileDay.label" :events="mobileDay.events" />
      <TimetableWeek class="hidden lg:block" :days="weekDays" />
    </template>
  </section>
</template>
