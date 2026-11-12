<script setup>
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'
import AppLink from './AppLink.vue'
import { NAV_ITEMS } from '@/data/links'

const isMenuOpen = ref(false)

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="header">
    <nav
      class="w-full flex flex-wrap justify-between items-center p-4 text-text-s-l dark:text-text-s-d"
    >
      <div class="flex items-center gap-4">
        <img src="/logo.svg" alt="Logo" class="h-7 w-7" />
        <span>DHBW-Connect</span>
      </div>

      <div class="flex items-center gap-6 md:gap-10">
        <!-- Desktop navigation -->
        <div class="hidden md:flex gap-x-8">
          <AppLink
            v-for="item in NAV_ITEMS"
            :key="item.label"
            :to="item.to"
            :href="item.href"
            class="nav-btn flex items-center gap-2"
          >
            <AppIcon :name="item.icon" />
            <span>{{ item.label }}</span>
          </AppLink>
        </div>

        <!-- Mobile menu toggle -->
        <!-- Wrapper hides the toggle: .nav-btn sets display itself, which would override md:hidden -->
        <div class="md:hidden">
          <button
            type="button"
            class="nav-btn p-3"
            :aria-expanded="isMenuOpen"
            aria-label="Menü öffnen"
            @click="isMenuOpen = !isMenuOpen"
          >
            <AppIcon :name="isMenuOpen ? 'close' : 'menu'" size="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile navigation -->
      <div
        v-show="isMenuOpen"
        class="md:hidden w-full flex flex-col gap-3 pt-4 mt-4 border-t border-border-l dark:border-border-d"
      >
        <AppLink
          v-for="item in NAV_ITEMS"
          :key="item.label"
          :to="item.to"
          :href="item.href"
          class="nav-btn py-2 w-full justify-start flex items-center gap-3"
          @click="closeMenu"
        >
          <AppIcon :name="item.icon" size="w-5 h-5" />
          <span>{{ item.label }}</span>
        </AppLink>
      </div>
    </nav>
  </header>
</template>
