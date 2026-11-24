<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { formatTimeRange, minutesOfDay } from '@/utils/dates'

// Grid geometry: one hour is one row of h-12 (3rem).
const DAY_START = 6
const DAY_END = 20
const REM_PER_HOUR = 3
const MIN_EVENT_REM = 2.5
const LINE = 'border-text-bg-l/10 dark:border-text-bg-d/10'

const hours = Array.from({ length: DAY_END - DAY_START }, (_, index) => DAY_START + index)

defineProps({
  days: { type: Array, required: true },
})

const now = ref(new Date())
let clock = null

onMounted(() => {
  clock = setInterval(() => {
    now.value = new Date()
  }, 60_000)
})

onUnmounted(() => clearInterval(clock))

function offsetRem(minutes) {
  return ((minutes - DAY_START * 60) / 60) * REM_PER_HOUR
}

// Position of the "now" marker, or null outside the visible hours.
const nowTop = computed(() => {
  const minutes = minutesOfDay(now.value)
  if (minutes < DAY_START * 60 || minutes > DAY_END * 60) {
    return null
  }
  return `${offsetRem(minutes)}rem`
})

function eventStyle(event) {
  const startMinutes = Math.max(minutesOfDay(event.startTime), DAY_START * 60)
  const endMinutes = Math.min(minutesOfDay(event.endTime), DAY_END * 60)
  const height = Math.max(((endMinutes - startMinutes) / 60) * REM_PER_HOUR, MIN_EVENT_REM)

  return { top: `${offsetRem(startMinutes)}rem`, height: `${height}rem` }
}
</script>

<template>
  <div class="overflow-x-auto">
    <div class="min-w-[700px]">
      <div class="grid grid-cols-[3.5rem_repeat(5,minmax(0,1fr))]">
        <!-- Header row -->
        <div :class="['border-b p-2', LINE]"></div>
        <div
          v-for="day in days"
          :key="day.key"
          :class="[
            'border-b border-l p-2 text-center text-sm font-semibold',
            LINE,
            day.isToday ? 'text-text-accent-l dark:text-text-accent-d' : '',
          ]"
        >
          {{ day.label }}
        </div>

        <!-- Hour labels -->
        <div class="text-xs opacity-70">
          <div
            v-for="hour in hours"
            :key="hour"
            :class="['h-12 border-b pr-2 pt-1 text-right', LINE]"
          >
            {{ `${String(hour).padStart(2, '0')}:00` }}
          </div>
        </div>

        <!-- One column per day -->
        <div
          v-for="day in days"
          :key="`${day.key}-schedule`"
          class="relative"
          :class="day.isToday ? 'bg-s-surface-l/30 dark:bg-s-surface-d/30' : ''"
        >
          <div v-for="hour in hours" :key="hour" :class="['h-12 border-b border-l', LINE]"></div>

          <p
            v-if="!day.events.length"
            class="absolute inset-x-2 top-1/2 -translate-y-1/2 text-center text-xs opacity-60"
          >
            Keine Vorlesungen
          </p>

          <article
            v-for="event in day.events"
            :key="event.id"
            class="event absolute inset-x-1 z-10 flex flex-col gap-0.5 p-2 text-xs"
            :class="{ 'opacity-60': event.cancelled }"
            :style="eventStyle(event)"
            :title="`${event.name} (${formatTimeRange(event.startTime, event.endTime)})`"
          >
            <p class="font-medium opacity-80">
              {{ formatTimeRange(event.startTime, event.endTime) }}
            </p>
            <p
              class="line-clamp-3 font-semibold leading-snug"
              :class="{ 'line-through': event.cancelled }"
            >
              {{ event.name }}
            </p>
            <p v-if="event.rooms?.length" class="mt-auto truncate opacity-75">
              {{ event.rooms.join(', ') }}
            </p>
            <p v-if="event.cancelled" class="font-semibold">Fällt aus</p>
          </article>

          <!-- Current time marker on today's column -->
          <div
            v-if="day.isToday && nowTop"
            class="pointer-events-none absolute inset-x-0 z-20 flex -translate-y-1/2 items-center"
            :style="{ top: nowTop }"
          >
            <span class="-ml-1 size-2.5 rounded-full bg-text-accent-l dark:bg-text-accent-d"></span>
            <span class="h-0.5 flex-1 bg-text-accent-l dark:bg-text-accent-d"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
