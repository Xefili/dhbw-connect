<script setup>
defineProps({
  name: { type: String, default: '' },
  lines: { type: Array, required: true },
})

const COLUMNS = ['Variante', 'Essensbeschreibung', 'Preis']
const priceFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })

function formatStudentPrice(price) {
  if (!price || price.student === 0) {
    return 'Inklusiv'
  }

  return priceFormatter.format(price.student / 100)
}
</script>

<template>
  <table class="my-2 w-full border-collapse text-left">
    <caption>
      {{
        name || 'Mensa Erzbergerstraße'
      }}
    </caption>

    <thead>
      <tr>
        <th
          v-for="column in COLUMNS"
          :key="column"
          scope="col"
          class="border-border-l border-b-2 p-3 dark:border-border-d"
        >
          {{ column }}
        </th>
      </tr>
    </thead>

    <tbody>
      <template v-for="line in lines" :key="line.id">
        <tr
          v-for="(meal, index) in line.meals"
          :key="meal.id"
          class="border-border-l border-b dark:border-border-d"
        >
          <th v-if="index === 0" :rowspan="line.meals.length" scope="rowgroup" class="p-3">
            {{ line.name }}
          </th>
          <td class="p-3">{{ meal.name }}</td>
          <td class="p-3 whitespace-nowrap">{{ formatStudentPrice(meal.price) }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
