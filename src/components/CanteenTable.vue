<script setup>
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'https://mensa.xefili.app/graphql'
const ERZBERGER_UUID = '0a53351a-62f8-4ac4-a860-099817e5cf91'
const MENU_QUERY = `
  query GetCanteenMenu($canteenId: UUID!, $date: NaiveDate!) {
    getCanteen(canteenId: $canteenId) {
      name
      lines {
        id
        name
        meals(date: $date) {
          id
          name
          price {
            student
          }
        }
      }
    }
  }
`
const TIME_ZONE = 'Europe/Berlin'
const canteen = ref(null)
const loaded = ref(false)
const error = ref(false)
const selectedDayOffset = ref(0)
const requestedDayOffset = ref(0)
let activeRequest = 0

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const dayFormatter = new Intl.DateTimeFormat('de-DE', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

function getDateKey(date) {
  const parts = Object.fromEntries(
    dateFormatter.formatToParts(date).map(({ type, value }) => [type, value]),
  )

  return `${parts.year}-${parts.month}-${parts.day}`
}

function addDays(dateKey, amount) {
  const date = new Date(`${dateKey}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + amount)
  return date.toISOString().slice(0, 10)
}

const todayKey = getDateKey(new Date())
const selectedDate = computed(() => addDays(todayKey, selectedDayOffset.value))
const selectedDayLabel = computed(() =>
  dayFormatter.format(new Date(`${selectedDate.value}T12:00:00Z`)),
)

const studentPriceFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
})

async function fetchMenu(date, direction = 1, startingOffset = selectedDayOffset.value) {
  const requestId = ++activeRequest
  loaded.value = false
  error.value = false
  canteen.value = null

  try {
    let requestedDate = date
    let skippedDays = 0

    while (requestId === activeRequest) {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: MENU_QUERY,
          variables: { canteenId: ERZBERGER_UUID, date: requestedDate },
        }),
      })

      if (requestId !== activeRequest) {
        return
      }

      if (!response.ok) {
        throw new Error(`Mensa request failed with status ${response.status}`)
      }

      const result = await response.json()
      if (requestId !== activeRequest) {
        return
      }

      const menu = result.data?.getCanteen
      if (!menu) {
        throw new Error('Mensa response does not contain a canteen')
      }

      const lines = menu.lines.map((line) => ({
        id: line.id,
        name: line.name,
        meals: line.meals || [],
      }))
      const hasMeals = lines.some((line) => line.meals.length > 0)

      if (!hasMeals) {
        skippedDays += direction
        requestedDate = addDays(requestedDate, direction)
        continue
      }

      selectedDayOffset.value = startingOffset + skippedDays
      requestedDayOffset.value = selectedDayOffset.value
      canteen.value = {
        canteen: menu.name,
        lines,
      }

      return
    }
  } catch (err) {
    if (requestId === activeRequest) {
      console.error('Could not load the canteen menu:', err)
      error.value = true
      requestedDayOffset.value = selectedDayOffset.value
    }
  } finally {
    if (requestId === activeRequest) {
      loaded.value = true
    }
  }
}

function changeDay(amount) {
  const startingOffset = loaded.value
    ? selectedDayOffset.value + amount
    : requestedDayOffset.value + amount
  requestedDayOffset.value = startingOffset
  fetchMenu(addDays(todayKey, startingOffset), amount, startingOffset)
}

function formatStudentPrice(price) {
  if (!price || price.student === 0) {
    return 'Inklusiv'
  }

  return studentPriceFormatter.format(price.student / 100)
}

onMounted(() => {
  fetchMenu(selectedDate.value)
})
</script>

<template>
  <section>
    <div class="date-navigation-header">
      <h2>Mensaplan</h2>
      <div class="date-navigation">
        <button type="button" class="nav-btn" aria-label="Vorheriger Tag" @click="changeDay(-1)">
          &larr;
        </button>
        <h3>{{ selectedDayLabel }}</h3>
        <button type="button" class="nav-btn" aria-label="Nächster Tag" @click="changeDay(1)">
          &rarr;
        </button>
      </div>
    </div>

    <p v-if="error" class="mt-4" role="alert">Der Mensaplan konnte nicht geladen werden.</p>

    <div
      v-else-if="!loaded"
      class="mt-4 grid gap-2"
      role="status"
      aria-live="polite"
      aria-label="Mensaplan wird geladen"
    >
      <div
        v-for="_ in 3"
        class="h-12 w-full animate-pulse rounded-md bg-s-surface-l dark:bg-s-surface-d"
      ></div>
    </div>

    <template v-else-if="canteen">
      <table class="my-2 w-full border-collapse text-left">
        <caption>
          {{
            canteen.canteen || 'Mensa Erzbergerstraße'
          }}
        </caption>

        <thead>
          <tr>
            <th scope="col" class="border-border-l border-b-2 p-3 dark:border-border-d">
              Variante
            </th>
            <th scope="col" class="border-border-l border-b-2 p-3 dark:border-border-d">
              Essensbeschreibung
            </th>
            <th scope="col" class="price-col border-border-l border-b-2 p-3 dark:border-border-d">
              Preis
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-for="line in canteen.lines" :key="line.id">
            <template v-for="(meal, index) in line.meals" :key="meal.id">
              <tr class="border-border-l border-b dark:border-border-d">
                <th
                  v-if="index === 0"
                  :rowspan="line.meals.length"
                  scope="rowgroup"
                  class="line-header p-3"
                >
                  {{ line.name }}
                </th>
                <td class="p-3">{{ meal.name }}</td>
                <td class="price-col p-3">{{ formatStudentPrice(meal.price) }}</td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </template>
  </section>
</template>
