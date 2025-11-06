<script setup>
import { onMounted, watch } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { useMovies } from './composables/useMovies.js';
import { useAuth } from './composables/useAuth.js';
import { useRoute } from 'vue-router';

const title = "Charlies Campus Filmclub";
const { nextMovie, fetchNextMovie } = useMovies();
const { user } = useAuth();
const route = useRoute();

onMounted(() => {
  fetchNextMovie();
});

</script>

<template>
  <Header :title="title" :nextEvent="nextMovie" :user="user"></Header>
  <main>
    <router-view />
  </main>
  <Footer></Footer>
</template>

<style>
/* Globale Styles, um Browser-Standardwerte zurückzusetzen */
html, body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #111; /* Verhindert weiße Ränder/Blitzer */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Stellt sicher, dass die App die volle Höhe einnimmt, damit der Footer korrekt positioniert werden kann */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1; /* Stellt sicher, dass der Hauptinhalt den verfügbaren Platz einnimmt */
}
</style>
