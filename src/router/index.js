import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Impressum from '@/views/Impressum.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "Home",
      path: '/',
      component: Home,
    },
    {
      name: "Impressum",
      path: "/legal",
      component: Impressum
    }
  ],
})

export default router
