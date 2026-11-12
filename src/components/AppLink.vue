<script setup>
import { RouterLink } from 'vue-router'

// Internal route when `to` is set, otherwise an external link in a new tab.
defineProps({
  to: { type: String, default: undefined },
  href: { type: String, default: undefined },
})
</script>

<template>
  <RouterLink v-if="to" :to="to">
    <slot />
  </RouterLink>
  <a v-else :href="href" target="_blank" rel="noopener noreferrer">
    <slot />
  </a>
</template>
