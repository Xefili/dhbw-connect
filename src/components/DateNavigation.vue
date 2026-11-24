<script setup>
defineProps({
  title: { type: String, required: true },
  label: { type: String, required: true },
  previousLabel: { type: String, required: true },
  nextLabel: { type: String, required: true },
})

const emit = defineEmits(['previous', 'next'])
</script>

<template>
  <div class="date-navigation-header">
    <h2>{{ title }}</h2>
    <div class="date-navigation">
      <button type="button" class="nav-btn" :aria-label="previousLabel" @click="emit('previous')">
        &larr;
      </button>
      <h3>{{ label }}</h3>
      <button type="button" class="nav-btn" :aria-label="nextLabel" @click="emit('next')">
        &rarr;
      </button>
    </div>
  </div>
</template>
