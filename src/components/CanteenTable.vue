<script setup>
import { ref, onMounted } from 'vue'

const canteen = ref(null)
const loaded = ref(false)

const studentPriceFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR'
})

async function fetchDhbwTodayMenu() {
  const ENDPOINT = `https://mensa.xefili.app/today/`

  try {
    const response = await fetch(ENDPOINT, {
      method: 'GET'
    })

    canteen.value = await response.json()
    loaded.value = true
  } catch (err) {
    console.info('Could not load the canteen menu:', err)
  }
}

function formatStudentPrice(price) {
  if (!price || price.student === 0) {
    return 'Inklusiv'
  }

  return studentPriceFormatter.format(price.student / 100)
}

onMounted(() => {
  fetchDhbwTodayMenu()
})
</script>

<template>
  <div v-if="loaded && canteen">
    <div class="canteen-menu">
      <h2>Mensaplan</h2>

      <table class="my-2 w-full text-left border-collapse">
        <caption>
          {{ canteen.canteen || 'Mensa Erzbergerstraße' }}
        </caption>

        <thead class="">
          <tr>
            <th scope="col" class="border-border-l border-b-2 p-3 dark:border-border-d">Variante</th>
            <th scope="col" class="border-border-l border-b-2 p-3 dark:border-border-d">
              Essensbeschreibung
            </th>
            <th scope="col" class="price-col border-border-l border-b-2 p-3 dark:border-border-d">
              Preis
            </th>
          </tr>
        </thead>

        <tbody class="p-2">
          <template v-for="line in canteen.lines" :key="line.id">
            <template v-if="line.meals?.length">
              <tr
                v-for="(meal, index) in line.meals"
                :key="meal.id"
                class="border-border-l border-b dark:border-border-d"
              >
                <th
                  v-if="index === 0"
                  :rowspan="line.meals.length"
                  scope="rowgroup"
                  class="line-header p-3"
                >
                  {{ line.name }}
                </th>

                <td class="p-3">{{ meal.name }}</td>

                <td class="price-col p-3">
                  {{ formatStudentPrice(meal.price) }}
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>

  <div v-else-if="!loaded">
    <div role="status" aria-live="polite" aria-label="Loader. Please wait for this content.">
      <h2 class="mb-4">Mensaplan</h2>

      <div class="grid grid-cols-[2fr_3fr_1fr] gap-2">
        <div v-for="_ in 3" class="rounded-md bg-s-surface-l dark:bg-s-surface-d animate-pulse w-full h-12"></div>
        <div v-for="_ in 3" class="grid grid-cols-1 gap-2">
          <div v-for="_ in 3" class="rounded-md bg-s-surface-l dark:bg-s-surface-d animate-pulse w-full h-8"></div>
        </div>
      </div>
    </div>
  </div>
</template>