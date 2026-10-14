<script setup>
import CanteenTable from '@/components/CanteenTable.vue';

</script>

<template class="bg-background-l dark:bg-background-d text-text-bg-l dark:text-text-bg-d flex flex-col items-center">
    <div class="flex w-full justify-center mt-8">
        <main class="w-full flex flex-col lg:grid lg:gap-8 lg:grid-cols-2">
            <div class="card">
                <h1>DHBW-Connect</h1>
                <section>
                    Willkommen bei DHBW-Connect! Diese Seite ist noch in der Entwicklungsphase.
                </section>
                <div class="lg:grid lg:grid-cols-2 flex flex-col gap-4 mt-4">
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

            <div class="card" id="planSkip">
                <a href="#moodleSkip" class="opacity-0 focus:opacity-100">Studenplan überspringen?</a>
                <h2>Stundenplan</h2>
                <iframe src="https://dhbw.app/c/KA-TINF25B3" frameborder="0" class="w-full min-h-250 mt-8 rounded-xl"></iframe>
            </div>

            <div class="card">
                <Suspense>
                    <CanteenTable />
                </Suspense>
            </div>
        </main>
    </div>
</template>
