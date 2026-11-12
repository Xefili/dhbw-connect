<script setup>
import BaseCard from '@/components/BaseCard.vue'
import CanteenTable from '@/components/CanteenTable.vue'
import LinkCard from '@/components/LinkCard.vue'
import TimeTable from '@/components/TimeTable.vue'
import { SERVICE_LINKS } from '@/data/links'
</script>

<template>
  <div class="w-full flex justify-center mt-8">
    <div class="w-full m-2! lg:m-0 flex flex-col gap-8 lg:grid lg:grid-cols-2">
      <BaseCard>
        <h1>DHBW-Connect</h1>
        <section>
          Willkommen bei DHBW-Connect! Diese Seite ist noch in der Entwicklungsphase.
        </section>

        <div class="lg:grid lg:grid-cols-2 flex flex-col gap-4 mt-4">
          <LinkCard v-for="link in SERVICE_LINKS" :key="link.href" v-bind="link" />
        </div>
      </BaseCard>

      <BaseCard>
        <CanteenTable />
      </BaseCard>

      <BaseCard id="planSkip" class="lg:col-span-2">
        <TimeTable />
      </BaseCard>
    </div>
  </div>
</template>
