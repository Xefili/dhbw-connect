import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Impressum from '@/views/Impressum.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "Home",
      path: '/',
      component: Home,
      meta: {
        footerEnabled: true
      }
    },
    {
      name: "Impressum",
      path: "/legal",
      component: Impressum,
      meta: {
        footerEnabled: false
      }
    }
  ],
})

export default router
