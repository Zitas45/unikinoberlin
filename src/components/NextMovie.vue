<template>
  <div class="next-movie">
    <h2>Nächste Vorstellung</h2>
    
    <div v-if="loading" class="loading">
      Lädt...
    </div>

    <div v-else-if="error" class="error">
      Fehler: {{ error }}
    </div>

    <div v-else-if="nextMovie" class="movie-card">
      <div class="movie-info">
        <h3>{{ nextMovie.title }}</h3>
        <p class="meta">{{ nextMovie.length }} Min.</p>
        
        <div class="showtime">
          <strong>Wann:</strong> {{ formatDate(nextMovie.eventDate) }}
        </div>
      </div>
    </div>

    <div v-else class="no-movies">
      Aktuell keine kommenden Vorstellungen geplant.
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMovies } from '../composables/useMovies'

const { nextMovie, loading, error, fetchNextMovie } = useMovies()

onMounted(() => {
  fetchNextMovie()
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.next-movie {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.movie-card {
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.movie-card img {
  width: 100%;
  height: auto;
  display: block;
}

.movie-info {
  padding: 1.5rem;
}

.movie-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.8rem;
}

.director, .meta {
  color: #666;
  margin: 0.25rem 0;
}

.showtime, .location {
  margin: 1rem 0;
  padding: 0.75rem;
  background: white;
  border-radius: 4px;
}

.description {
  margin-top: 1rem;
  line-height: 1.6;
}

.loading, .error, .no-movies {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #d32f2f;
}
</style>