<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <header class="fixed top-2 left-2 right-2 dark:border-border-d border-border-l rounded-lg border-2 bg-surface-l/50 dark:bg-surface-d/50 backdrop-blur-xl">
        <nav class="w-full grid grid-cols-2 text-text-s-l dark:text-text-s-d p-4">
            <div class="flex flex-row justify-start items-center gap-4">
                <img src="/logo.svg" alt="Logo" class="h-4 w-4">
                <span class="">DHBW-Connect</span>
            </div>

            <div class="justify-self-end flex flex-row gap-4">
                <RouterLink to="/">Startseite</RouterLink>
                <a href="https://moodle.dhbw.de/">Moodle</a>
                <RouterLink to="/#planSkip">Stundenplan</RouterLink>
                <a href="https://dualis.dhbw.de/">Dualis</a>
            </div>
        </nav>
    </header>
</template>