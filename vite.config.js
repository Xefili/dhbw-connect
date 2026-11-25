import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { THEMES } from './src/themes.js'

// Injects the theme ids from src/themes.js into the pre-paint script in index.html.
function themeIdsInHtml() {
  return {
    name: 'dhbw-connect-theme-ids',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replaceAll('%THEME_IDS%', JSON.stringify(THEMES.map((t) => t.id)))
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    tailwindcss(),
    themeIdsInHtml(),
    // Vue DevTools integration is only needed while developing.
    command === 'serve' && vueDevTools(),
  ],
  // GitHub Pages serves the app from /dhbw-connect/. Use import.meta.env.BASE_URL for asset URLs.
  base: '/dhbw-connect/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
