<script setup>
import Footer from "@/components/Footer.vue";
import Header from "../components/Header.vue";
</script>

<template class="bg-background-l dark:bg-background-d text-text-bg-l dark:text-text-bg-d flex flex-col items-center">
    <Header />

    <div class="flex w-full justify-center mt-8">
        <main class="lg:w-1/2 bg-surface-l dark:bg-surface-d text-text-s-l dark:text-text-s-d p-4 rounded-2xl">
            <div>
                <h1>DHBW-Connect</h1>
                <section>
                    Willkommen bei DHBW-Connect! Diese Seite ist noch in der Entwicklungsphase.
                </section>
            </div>

            <div class="flex mb-12 w-full"><a href="#moodleSkip" class="opacity-0 focus:opacity-100">Studenplan überspringen?</a></div>

            <div id="planSkip">
                <h2>Stundenplan</h2>
                <iframe src="https://dhbw.app/c/KA-TINF25B3" frameborder="0" class="w-full min-h-250 mt-8 rounded-xl"></iframe>
            </div>

            <a href="#planSkip" class="opacity-0 focus:opacity-100 inline-block m-2">Studenplan überspringen?</a>

            <div id="moodleSkip">
                <h2>Moodle</h2>
                <a href="https://moodle.dhbw.de/" target="_blank" rel="noopener noreferrer">Moodle in einem neuen Fenster öffnen</a>
            </div>

            <div>
                <h2>Dualis</h2>
                <a href="https://dualis.dhbw.de/" target="_blank" rel="noopener noreferrer">Dualis in einem neuen Fenster öffnen</a>
            </div>
        </main>
    </div>

    <Footer />
</template>
