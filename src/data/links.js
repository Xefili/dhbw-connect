export const MOODLE_URL = 'https://moodle.dhbw.de/'
export const DUALIS_URL = 'https://dualis.dhbw.de/'
export const DHBW_URL = 'https://dhbw.de/'

/** Items shown in the header navigation (icon names match AppIcon). */
export const NAV_ITEMS = [
  { label: 'Startseite', to: '/', icon: 'home' },
  { label: 'Moodle', href: MOODLE_URL, icon: 'moodle' },
  { label: 'Stundenplan', to: '/#planSkip', icon: 'calendar' },
  { label: 'Dualis', href: DUALIS_URL, icon: 'document' },
]

/** Cards on the home page. */
export const SERVICE_LINKS = [
  {
    title: 'Moodle',
    description: 'Moodle in einem neuen Fenster öffnen',
    href: MOODLE_URL,
  },
  {
    title: 'Dualis',
    description: 'Dualis in einem neuen Fenster öffnen',
    href: DUALIS_URL,
  },
  {
    title: 'DHBW Webseite',
    description: 'DHBW Seite in einem neuen Fenster öffnen',
    href: DHBW_URL,
  },
]
