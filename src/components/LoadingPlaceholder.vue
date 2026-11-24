<script setup>
defineProps({
  rows: { type: Number, default: 3 },
  label: { type: String, default: 'Wird geladen' },
})
</script>

<template>
  <div class="mt-4 grid gap-2" role="status" aria-live="polite" :aria-label="label">
    <div
      v-for="row in rows"
      :key="row"
      class="h-12 w-full animate-pulse rounded-md bg-s-surface-l dark:bg-s-surface-d"
    ></div>
  </div>
</template>
