<script setup>
import { onMounted } from 'vue';
import Body from '../components/Body.vue';
import NextMovie from '../components/NextMovie.vue';
import { useMovies } from '../composables/useMovies.js';

const { upcomingMovies, fetchUpcomingMovies } = useMovies();

onMounted(() => {
  fetchUpcomingMovies();
});
</script>
<template>
  <Body :movies="upcomingMovies"></Body>
  <!-- <NextMovie></NextMovie>-->
</template>