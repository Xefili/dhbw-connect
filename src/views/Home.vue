<script setup>
import CanteenTable from '@/components/CanteenTable.vue';
import TimeTable from '@/components/TimeTable.vue';

</script>

<template class="text-text-bg-l dark:text-text-bg-d flex flex-col items-center">
    <div class="flex justify-center mt-8 m-2">
        <main class="w-full flex flex-col lg:grid gap-8 m-2 lg:m-0 lg:grid-cols-2">
            <div class="card">
                <h1>DHBW-Connect</h1>
                <section>
                    Willkommen bei DHBW-Connect! Diese Seite ist noch in der Entwicklungsphase.
                </section>
                <div class="lg:grid lg:grid-cols-2 flex flex-col gap-4 mt-4 big-card">
                    <div class="card-floating">
                        <h2>Moodle</h2>
                        <a href="https://moodle.dhbw.de/" target="_blank" rel="noopener noreferrer">Moodle in einem neuen Fenster öffnen</a>
                    </div>

                    <div class="card-floating">
                        <h2>Dualis</h2>
                        <a href="https://dualis.dhbw.de/" target="_blank" rel="noopener noreferrer">Dualis in einem neuen Fenster öffnen</a>
                    </div>

                    <div class="card-floating">
                        <h2>DHBW Webseite</h2>
                        <a href="https://dhbw.de/" target="_blank" rel="noopener noreferrer">DHBW Seite in einem neuen Fenster öffnen</a>
                    </div>
                </div>
            </div>
            <div class="card">
                <Suspense>
                    <CanteenTable />
                </Suspense>
            </div>
            
            <div class="card lg:col-span-2" id="planSkip">
                <TimeTable />
            </div>
        </main>
    </div>
</template>
