<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <header class="w-full">
        <nav class="w-full grid grid-cols-2 bg-surface-l dark:bg-surface-d text-text-s-l dark:text-text-s-d p-4">
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