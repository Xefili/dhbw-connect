<script setup>
import { ref, onMounted } from 'vue'

// 1. Erstelle eine reaktive Ref für canteen
const canteen = ref(null)

async function fetchDhbwTodayMenu() {
  const ENDPOINT = '/mensa-api' // Oder deine Proxy-URL
  const today = new Date().toISOString().split('T')[0]

  const query = `
    query GetDhbwFood($canteenId: ID!, $date: NaiveDate!) {
      getCanteen(canteenId: $canteenId) {
        name
        lines {
          name
          meals(date: $date) {
            name
            price {
              student
            }
          }
        }
      }
    }
  `

  const variables = {
    canteenId: "0a53351a-62f8-4ac4-a860-099817e5cf91",
    date: today
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    })

    const { data } = await response.json()
    
    // 2. Weise die Daten der .value-Eigenschaft von ref zu
    if (data?.getCanteen) {
      canteen.value = data.getCanteen
    }
  } catch (err) {
    console.error('Fehler beim Laden der Speisekarte:', err)
  }
}

// 3. Beim Laden der Komponente ausführen
onMounted(() => {
  fetchDhbwTodayMenu()
})
</script>

<template>
  <div v-if="canteen" class="canteen-menu">
    <h2>Mensaplan</h2>

    <table class="w-full text-left border-collapse">
      <caption>
        Mensaria Erzbergerstraße
      </caption>

      <thead class="bg-s-surface-l dark:bg-s-surface-d">
        <tr>
          <th scope="col" class="p-2">Variante</th>
          <th scope="col" class="p-2">Essensbeschreibung</th>
          <th scope="col" class="price-col p-2">Preis</th>
        </tr>
      </thead>

      <tbody class="p-2">
        <template v-for="line in canteen.lines" :key="line.name">
          <!-- When meals are available for this line -->
          <template v-if="line.meals && line.meals.length > 0">
            <tr class="my-4" v-for="(meal, index) in line.meals" :key="index">
              <!-- Show line name only on the first row of each group using rowSpan -->
              <th 
                v-if="index === 0" 
                :rowspan="line.meals.length" 
                scope="rowgroup" 
                class="line-header"
              >
                {{ line.name }}
              </th>
              
              <td>{{ meal.name }}</td>
              
              <td class="price-col">
                {{ meal.price?.student ? (meal.price.student / 100).toFixed(2) + ' €' : 'Inklusiv' }}
              </td>
            </tr>
          </template>

          <!-- Fallback when line has no meals (e.g. Wahlessen 3) -->
          <tr v-else class="empty-line">
            <th scope="row" class="line-header">{{ line.name }}</th>
            <td colspan="2" class="no-meals">Keine Daten vorhanden</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>