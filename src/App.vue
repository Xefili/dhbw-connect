<script setup>
import { useRoute } from 'vue-router'
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'

const route = useRoute()
</script>

<template>
  <div id="app">
    <main>
      <Header />
      <RouterView />
      <Footer v-if="route.meta.footerEnabled" />
    </main>
  </div>
</template>
