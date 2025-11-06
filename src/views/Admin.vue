<template>
  <div class="admin-container">
    <div class="admin-header">
      <h1>Admin Dashboard</h1>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>

    <!-- Formular zum Hinzufügen eines neuen Films -->
    <section class="admin-section">
      <h2>{{ editingMovieId ? 'Film bearbeiten' : 'Neuen Film hinzufügen' }}</h2>
      <form @submit.prevent="addMovie" class="movie-form">
        <div class="form-group">
          <label for="title">Titel</label>
          <input id="title" v-model="newMovie.title" type="text" required>
        </div>
        <div class="form-group">
          <label for="eventDate">Datum und Uhrzeit</label>
          <input id="eventDate" v-model="newMovie.eventDate" type="datetime-local" required>
        </div>
        <div class="form-group">
          <label for="length">Länge (in Min.)</label>
          <input id="length" v-model.number="newMovie.length" type="number" required>
        </div>
        <div class="form-group">
          <label for="image_url">Bild-URL</label>
          <input id="image_url" v-model="newMovie.image_url" type="url">
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Speichert...' : (editingMovieId ? 'Film aktualisieren' : 'Film hinzufügen') }}
        </button>
        <button v-if="editingMovieId" @click="cancelEdit" type="button" class="cancel-button">
          Abbrechen
        </button>
        <p v-if="formError" class="error-message">{{ formError }}</p>
      </form>
    </section>

    <!-- Liste der bestehenden Filme -->
    <section class="admin-section">
      <h2>Kommende Filme</h2>
      <ul class="movie-list">
        <li v-for="movie in upcomingMovies" :key="movie.id">
          <span class="movie-details"><strong>{{ movie.title }}</strong> - {{ formatSimpleDate(movie.eventDate) }}</span>
          <div class="movie-actions">
            <button @click="editMovie(movie)" class="edit-button">Bearbeiten</button>
            <button @click="confirmDelete(movie.id)" class="delete-button">Löschen</button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'vue-router';
import { useMovies } from '../composables/useMovies.js';

const router = useRouter();
const { upcomingMovies, fetchUpcomingMovies, loading } = useMovies();
const formError = ref('');
const editingMovieId = ref(null);

// Datenmodell für das Formular
const newMovie = ref({
  title: '',
  eventDate: '',
  length: null,
  image_url: ''
});

// Filme beim Laden der Komponente abrufen
onMounted(() => {
  fetchUpcomingMovies();
});

// Funktion zum Hinzufügen eines Films
async function addMovie() {
  formError.value = '';
  if (!newMovie.value.title || !newMovie.value.eventDate || !newMovie.value.length) {
    formError.value = 'Bitte fülle alle Pflichtfelder aus.';
    return;
  }

  let error;

  if (editingMovieId.value) {
    // UPDATE-Logik
    const { error: updateError } = await supabase
      .from('movies')
      .update(newMovie.value)
      .eq('id', editingMovieId.value);
    error = updateError;
  } else {
    // INSERT-Logik
    const { error: insertError } = await supabase.from('movies').insert([newMovie.value]);
    error = insertError;
  }

  if (error) {
    formError.value = `Fehler beim Speichern: ${error.message}`;
  } else {
    // Formular und Bearbeitungsmodus zurücksetzen
    cancelEdit();
    // Filmliste neu laden, um den neuen Film anzuzeigen
    await fetchUpcomingMovies();
  }
}

// Funktion, um einen Film zu löschen
async function confirmDelete(movieId) {
  if (window.confirm('Möchtest du diesen Film wirklich löschen?')) {
    const { error } = await supabase.from('movies').delete().eq('id', movieId);
    if (error) {
      formError.value = `Fehler beim Löschen: ${error.message}`;
    } else {
      // Liste neu laden, um den gelöschten Film zu entfernen
      await fetchUpcomingMovies();
    }
  }
}

// Funktion, um den Bearbeitungsmodus zu starten
function editMovie(movie) {
  editingMovieId.value = movie.id;
  // Konvertiere das Datum für das datetime-local Input-Feld
  const date = new Date(movie.eventDate);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const localIsoDate = date.toISOString().slice(0, 16);

  newMovie.value = { ...movie, eventDate: localIsoDate };
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Zum Formular scrollen
}

// Funktion, um den Bearbeitungsmodus abzubrechen
function cancelEdit() {
  editingMovieId.value = null;
  newMovie.value = { title: '', eventDate: '', length: null, image_url: '' };
  formError.value = '';
}

// Logout-Funktion
async function handleLogout() {
  await supabase.auth.signOut();
  router.push('/');
}

// Hilfsfunktion zur Datumsformatierung
function formatSimpleDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleString('de-DE', options);
}
</script>

<style scoped>
.admin-container { max-width: 800px; margin: 2rem auto; padding: 2rem; color: #fff; }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.admin-header h1 { color: #ffcc00; }
.logout-button { background-color: #e53e3e; color: white; }
.admin-section { background-color: #1a1a1a; padding: 2rem; border-radius: 8px; margin-bottom: 2rem; }
.admin-section h2 { color: #ffcc00; margin-top: 0; }
.movie-form .form-group { margin-bottom: 1rem; }
.movie-form label { display: block; margin-bottom: 0.5rem; }
.movie-form input { width: 100%; padding: 0.5rem; background-color: #333; border: 1px solid #555; color: #fff; border-radius: 4px; }
.movie-form button { margin-right: 1rem; }
.movie-list { list-style: none; padding: 0; }
.movie-list li { display: flex; justify-content: space-between; align-items: center; background-color: #222; padding: 1rem; border-radius: 4px; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 1rem; }
.movie-actions button { margin-left: 0.5rem; }
.edit-button { background-color: #2196f3; color: white; }
.delete-button { background-color: #f44336; color: white; }
.cancel-button { background-color: #666; color: white; }
.error-message { color: #e53e3e; margin-top: 1rem; }
button { padding: 0.7rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
button[type="submit"] { background-color: #ffcc00; color: #111; }
</style>