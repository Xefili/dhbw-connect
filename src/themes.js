/**
 * Single source of truth for the color themes. Each id is written to `data-theme`
 * on <html>; the palettes live in styles/input.css under matching selectors.
 *
 * This file has no imports on purpose: vite.config.js reads it to inject the
 * theme ids into index.html, which applies the saved theme before first paint.
 */
export const THEME_STORAGE_KEY = 'dhbw-connect-theme'
export const DEFAULT_THEME = 'standard'

export const THEMES = [
  { id: 'standard', label: 'Standard' },
  { id: 'alt', label: 'Neon Sunset' },
  { id: 'leibniz', label: 'Leibniz-Keks' },
  { id: 'cocoa', label: 'Schoko-Keks' },
  { id: 'cake', label: 'Erdbeertorte' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'oled', label: 'OLED' },
  { id: 'blocky', label: 'Blockwelt' },
]
