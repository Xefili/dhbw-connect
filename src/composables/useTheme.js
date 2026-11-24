import { computed, ref, watch } from 'vue'

/**
 * Theme state shared across the app. Each theme id is written to `data-theme`
 * on <html>; the palettes live in styles/input.css under matching selectors.
 *
 * index.html applies the saved theme before first paint and must know the same
 * ids and storage key, so keep them in sync.
 */
export const THEME_STORAGE_KEY = 'dhbw-connect-theme'

export const THEMES = [
  { id: 'standard', label: 'Standard' },
  { id: 'alt', label: 'Neon Sunset' },
  { id: 'leibniz', label: 'Leibniz-Keks' },
]

const DEFAULT_THEME = 'standard'

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return THEMES.some((t) => t.id === stored) ? stored : DEFAULT_THEME
  } catch {
    // Storage can be blocked (private mode, disabled site data).
    return DEFAULT_THEME
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
  const currentLabel = computed(
    () => THEMES.find((t) => t.id === theme.value)?.label ?? '',
  )

  function setTheme(id) {
    if (THEMES.some((t) => t.id === id)) theme.value = id
  }

  return { theme, themes: THEMES, currentLabel, setTheme }
}
