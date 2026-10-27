<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <header class="header">
        <nav class="w-full grid grid-cols-2 text-text-s-l dark:text-text-s-d p-4">
            <div class="flex flex-row justify-start items-center gap-4">
                <img src="/logo.svg" alt="Logo" class="h-7 w-7">
                <span class="">DHBW-Connect</span>
            </div>

            <div class="nav-elements">
                <RouterLink to="/" class="nav-btn">
                    <svg class="w-4 h-4" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span>Startseite</span>
                </RouterLink>

                <!-- Moodle-Button mit Graduierungshut-Icon -->
                <a href="https://dhbw.de" target="_blank" class="nav-btn">
                    <svg class="w-4 h-4" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.174L10.74 14.15a2 2 0 002.52 0l6.48-3.976m-16.2 0A2 2 0 012.25 8.584V8a2 2 0 011.233-1.84l7.5-3.214a2 2 0 011.534 0l7.5 3.214A2 2 0 0121.75 8v.584a2 2 0 01-1.033 1.75l-6.48 3.976a6 6 0 01-5.974 0l-4.003-2.456zM21.75 12.5v5.5a2 2 0 01-2 2h-15.5a2 2 0 01-2-2v-5.5" />
                    </svg>
                    <span>Moodle</span>
                </a>

                <!-- Stundenplan-Button mit Kalender-Icon (wie im Bild) -->
                <RouterLink to="/#planSkip" class="nav-btn">
                    <svg class="w-4 h-4" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <span>Stundenplan</span>
                </RouterLink>

                <!-- Dualis-Button mit Dokument-Icon -->
                <a href="https://dhbw.de" target="_blank" class="nav-btn">
                    <svg class="w-4 h-4" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span>Dualis</span>
                </a>
            </div>
        </nav>
    </header>
</template>