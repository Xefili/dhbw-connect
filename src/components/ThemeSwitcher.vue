<script setup>
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { useTheme } from '@/composables/useTheme'

const { theme, themes, currentLabel, setTheme } = useTheme()

const isOpen = ref(false)
const root = ref(null)

function select(id) {
  setTheme(id)
  isOpen.value = false
}

// Close when focus leaves the switcher (click elsewhere or tab away).
function onFocusOut(event) {
  if (!root.value?.contains(event.relatedTarget)) isOpen.value = false
}
</script>

<template>
  <!-- Rendered in the top bar for both desktop and mobile layouts. -->
  <div ref="root" class="relative" @focusout="onFocusOut" @keydown.esc="isOpen = false">
    <button
      type="button"
      class="nav-btn p-3 md:px-4 md:py-2"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      aria-label="Design wählen"
      @click="isOpen = !isOpen"
    >
      <AppIcon name="palette" size="w-5 h-5" />
      <span class="hidden md:inline">{{ currentLabel }}</span>
    </button>

    <div
      v-show="isOpen"
      class="absolute right-0 top-full mt-2 z-50 min-w-44 p-1.5 flex flex-col gap-1 rounded-xl bg-s-surface-l dark:bg-s-surface-d text-text-ss-l dark:text-text-ss-d shadow-lg"
    >
      <button
        v-for="item in themes"
        :key="item.id"
        type="button"
        class="nav-btn w-full justify-start"
        :aria-pressed="theme === item.id"
        :class="theme === item.id ? 'font-bold' : ''"
        @click="select(item.id)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
