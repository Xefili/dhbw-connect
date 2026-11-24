<script setup>
import { computed, onMounted, ref } from 'vue'
import DateNavigation from './DateNavigation.vue'
import LoadingPlaceholder from './LoadingPlaceholder.vue'
import MealTable from './MealTable.vue'
import StatusMessage from './StatusMessage.vue'
import { CANTEEN_ENDPOINT, CANTEEN_ID } from '@/config'
import { addDays, formatDayLabel, getDateKey } from '@/utils/dates'

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

const canteen = ref(null)
const loaded = ref(false)
const error = ref(false)
const selectedDayOffset = ref(0)
const requestedDayOffset = ref(0)
let activeRequest = 0

const todayKey = getDateKey(new Date())
const selectedDate = computed(() => addDays(todayKey, selectedDayOffset.value))
const selectedDayLabel = computed(() => formatDayLabel(selectedDate.value))

// Loads the menu for `date`. Days without meals are skipped in `direction`.
async function fetchMenu(date, direction = 1, startingOffset = selectedDayOffset.value) {
  const requestId = ++activeRequest
  loaded.value = false
  error.value = false
  canteen.value = null

  try {
    let requestedDate = date
    let skippedDays = 0

    while (requestId === activeRequest) {
      const response = await fetch(CANTEEN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: MENU_QUERY,
          variables: { canteenId: CANTEEN_ID, date: requestedDate },
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
      canteen.value = { name: menu.name, lines }
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

onMounted(() => {
  fetchMenu(selectedDate.value)
})
</script>

<template>
  <section>
    <DateNavigation
      title="Mensaplan"
      :label="selectedDayLabel"
      previous-label="Vorheriger Tag"
      next-label="Nächster Tag"
      @previous="changeDay(-1)"
      @next="changeDay(1)"
    />

    <StatusMessage v-if="error">Der Mensaplan konnte nicht geladen werden.</StatusMessage>

    <LoadingPlaceholder v-else-if="!loaded" :rows="3" label="Mensaplan wird geladen" />

    <MealTable v-else-if="canteen" :name="canteen.name" :lines="canteen.lines" />
  </section>
</template>
