<script setup>
import AppLink from './AppLink.vue'

defineProps({
  href: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <AppLink :href="href" class="card-floating block no-underline">
    <h2>{{ title }}</h2>
    <span>{{ description }}</span>
  </AppLink>
</template>
