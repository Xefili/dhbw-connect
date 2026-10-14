<script setup>
import { ref, onMounted } from 'vue'

// 1. Erstelle eine reaktive Ref für canteen
const canteen = ref(null)

async function fetchDhbwTodayMenu() {
  try {
    const response = await fetch('https://foodapi.xefili.app/')
    if (!response.ok) {
      throw new Error(`Menu API returned HTTP ${response.status}`)
    }

    canteen.value = await response.json()
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
        Mensa Erzbergerstraße
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
                {{ meal.price || 'Inklusiv' }}
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