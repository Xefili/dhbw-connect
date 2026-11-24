<script setup>
import AppIcon from './AppIcon.vue'
import { useTheme } from '@/composables/useTheme'

const { isAlt, toggleTheme } = useTheme()
</script>

<template>
  <!-- Rendered in the top bar for both desktop and mobile layouts. -->
  <button
    type="button"
    class="nav-btn p-3"
    :aria-pressed="isAlt"
    :title="isAlt ? 'Standard-Design verwenden' : 'Alternatives Design verwenden'"
    aria-label="Design wechseln"
    @click="toggleTheme"
  >
    <AppIcon name="palette" size="w-5 h-5" />
  </button>
</template>
