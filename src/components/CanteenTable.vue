<script setup>
import { ref, onMounted } from 'vue'

// 1. Erstelle eine reaktive Ref für canteen
const canteen = ref(null)
const loaded = ref(false)


async function fetchDhbwTodayMenu() {
  const ENDPOINT = `https://api.dhbw.app/mensa/KA/`

  try {
    const response = await fetch(ENDPOINT, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    canteen.value  = await response.json();
    loaded.value = true;

  } catch (err) {
    console.info("API dead :(");
  }
}

// 3. Beim Laden der Komponente ausführen
onMounted(() => {
  fetchDhbwTodayMenu();
})
</script>

<template>
  <div v-if="loaded">
    <div class="canteen-menu">
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
          <div v-for="line in canteen.lines" :key="line.name">
            <!-- When meals are available for this line -->
            <div v-if="line.meals && line.meals.length > 0">
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
            </div>

            <!-- Fallback when line has no meals (e.g. Wahlessen 3) -->
            <tr v-else class="empty-line">
              <th scope="row" class="line-header">{{ line.name }}</th>
              <td colspan="2" class="no-meals">Keine Daten vorhanden</td>
            </tr>
          </div>
        </tbody>
      </table>
    </div>
  </div>

  <div v-else>
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