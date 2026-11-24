import { computed, ref, watch } from 'vue'

/**
 * Theme state shared across the app.
 * - "standard": the default palette (follows the OS light/dark setting)
 * - "alt":      the alternative palette, defined in styles/input.css
 *
 * The active theme is written to `data-theme` on <html>. index.html sets it
 * before first paint using the same storage key, so keep them in sync.
 */
export const THEME_STORAGE_KEY = 'dhbw-connect-theme'
const THEMES = ['standard', 'alt']

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return THEMES.includes(stored) ? stored : 'standard'
  } catch {
    // Storage can be blocked (private mode, disabled site data).
    return 'standard'
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Not persisted; the choice still applies for this page view.
  }
}

const theme = ref(readStoredTheme())

watch(
  theme,
  (value) => {
    document.documentElement.dataset.theme = value
    storeTheme(value)
  },
  { immediate: true },
)

export function useTheme() {
  const isAlt = computed(() => theme.value === 'alt')

  function toggleTheme() {
    theme.value = isAlt.value ? 'standard' : 'alt'
  }

  return { theme, isAlt, toggleTheme }
}
