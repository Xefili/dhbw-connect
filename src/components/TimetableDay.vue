<script setup>
import { formatTimeRange } from '@/utils/dates'

defineProps({
  label: { type: String, required: true },
  events: { type: Array, required: true },
})
</script>

<template>
  <div>
    <h3 class="my-4 font-semibold">{{ label }}</h3>

    <ul v-if="events.length" class="space-y-3">
      <li
        v-for="event in events"
        :key="event.id"
        class="event flex flex-col gap-1 p-4"
        :class="{ 'opacity-60': event.cancelled }"
      >
        <p class="text-sm font-medium opacity-80">
          {{ formatTimeRange(event.startTime, event.endTime) }}
        </p>
        <p class="text-base font-semibold" :class="{ 'line-through': event.cancelled }">
          {{ event.name }}
        </p>
        <p v-if="event.rooms?.length" class="text-sm opacity-75">
          {{ event.rooms.join(', ') }}
        </p>
        <p
          v-if="event.cancelled"
          class="mt-1 w-max rounded-full bg-text-accent-l px-2 py-0.5 text-xs font-semibold text-background-l dark:bg-text-accent-d dark:text-background-d"
        >
          Fällt aus
        </p>
      </li>
    </ul>

    <p v-else class="card-floating p-4">An diesem Tag finden keine Vorlesungen statt.</p>
  </div>
</template>
