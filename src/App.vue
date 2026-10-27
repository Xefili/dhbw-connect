<script setup lang="ts">
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';

import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
  <div id="app">
    <main>
      <Header />
      <div class="block w-0 h-12"></div>
      <RouterView></RouterView>
      <Footer v-if="route.meta.footerEnabled" />
    </main>
  </div>
</template>

<style lang="css" scoped>
#app {
  background: linear-gradient(to bottom right, #1e3a8a, #581c87, #312e81, #1e40af);
}
</style>