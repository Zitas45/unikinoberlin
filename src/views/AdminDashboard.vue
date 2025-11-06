<template>
  <div class="admin-dashboard">
    <header class="admin-header">
      <h1>Unikino Admin</h1>
      <button @click="handleSignOut" class="btn-logout">Abmelden</button>
    </header>

    <div class="admin-content">
      <div class="actions-bar">
        <button @click="showMovieForm = true" class="btn-add">
          ➕ Neuer Film
        </button>
      </div>

      <!-- Movie Form Modal -->
      <div v-if="showMovieForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal-content">
          <h2>{{ editingMovie ? 'Film bearbeiten' : 'Neuer Film' }}</h2>
          
          <form @submit.prevent="handleSubmit">
            <div class="form-grid">
              <div class="form-group">
                <label>Titel *</label>
                <input v-model="formData.title" required />
              </div>

              <div class="form-group">
                <label>Regie</label>
                <input v-model="formData.director" />
              </div>

              <div class="form-group">
                <label>Jahr</label>
                <input v-model.number="formData.year" type="number" />
              </div>

              <div class="form-group">
                <label>Dauer (Min.)</label>
                <input v-model.number="formData.duration" type="number" />
              </div>

              <div class="form-group full-width">
                <label>Spielzeit *</label>
                <input v-model="formData.showtime" type="datetime-local" required />
              </div>

              <div class="form-group full-width">
                <label>Ort</label>
                <input v-model="formData.location" placeholder="z.B. Hörsaal A" />
              </div>

              <div class="form-group full-width">
                <label>Bild-URL</label>
                <input v-model="formData.image_url" type="url" placeholder="https://..." />
              </div>

              <div class="form-group full-width">
                <label>Beschreibung</label>
                <textarea v-model="formData.description" rows="4"></textarea>
              </div>
            </div>

            <div v-if="error" class="error-message">{{ error }}</div>

            <div class="form-actions">
              <button type="button" @click="closeForm" class="btn-secondary">
                Abbrechen
              </button>
              <button type="submit" :disabled="loading" class="btn-primary">
                {{ loading ? 'Speichert...' : 'Speichern' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Movies List -->
      <div class="movies-list">
        <h2>Alle Filme</h2>
        
        <div v-if="loadingMovies" class="loading">Lädt...</div>
        
        <div v-else-if="movies.length === 0" class="no-movies">
          Noch keine Filme vorhanden.
        </div>

        <div v-else class="movie-cards">
          <div v-for="movie in movies" :key="movie.id" class="movie-card">
            <img v-if="movie.image_url" :src="movie.image_url" :alt="movie.title" />
            
            <div class="movie-details">
              <h3>{{ movie.title }}</h3>
              <p class="movie-meta">
                {{ movie.director }} • {{ movie.year }} • {{ movie.duration }} Min.
              </p>
              <p class="movie-showtime">
                📅 {{ formatDate(movie.showtime) }}
              </p>
              <p v-if="movie.location" class="movie-location">
                📍 {{ movie.location }}
              </p>
            </div>

            <div class="movie-actions">
              <button @click="editMovie(movie)" class="btn-edit">
                ✏️ Bearbeiten
              </button>
              <button @click="confirmDelete(movie)" class="btn-delete">
                🗑️ Löschen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useMovieAdmin } from '@/composables/useMovieAdmin'
import { useRouter } from 'vue-router'

const router = useRouter()
const { signOut } = useAuth()
const { loading, error, createMovie, updateMovie, deleteMovie, getAllMovies } = useMovieAdmin()

const movies = ref([])
const loadingMovies = ref(false)
const showMovieForm = ref(false)
const editingMovie = ref(null)

const formData = ref({
  title: '',
  director: '',
  year: null,
  duration: null,
  showtime: '',
  location: '',
  description: '',
  image_url: ''
})

onMounted(async () => {
  await loadMovies()
})

async function loadMovies() {
  loadingMovies.value = true
  const { data } = await getAllMovies()
  if (data) {
    movies.value = data
  }
  loadingMovies.value = false
}

function editMovie(movie) {
  editingMovie.value = movie
  formData.value = {
    title: movie.title,
    director: movie.director || '',
    year: movie.year,
    duration: movie.duration,
    showtime: formatDateTimeLocal(movie.showtime),
    location: movie.location || '',
    description: movie.description || '',
    image_url: movie.image_url || ''
  }
  showMovieForm.value = true
}

async function handleSubmit() {
  const data = {
    ...formData.value,
    showtime: new Date(formData.value.showtime).toISOString()
  }

  let result
  if (editingMovie.value) {
    result = await updateMovie(editingMovie.value.id, data)
  } else {
    result = await createMovie(data)
  }

  if (!result.error) {
    closeForm()
    await loadMovies()
  }
}

function confirmDelete(movie) {
  if (confirm(`Film "${movie.title}" wirklich löschen?`)) {
    handleDelete(movie.id)
  }
}

async function handleDelete(id) {
  const result = await deleteMovie(id)
  if (!result.error) {
    await loadMovies()
  }
}

function closeForm() {
  showMovieForm.value = false
  editingMovie.value = null
  formData.value = {
    title: '',
    director: '',
    year: null,
    duration: null,
    showtime: '',
    location: '',
    description: '',
    image_url: ''
  }
}

async function handleSignOut() {
  await signOut()
  router.push('/admin/login')
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDateTimeLocal(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

.admin-header {
  background: white;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-logout:hover {
  background: #d32f2f;
}

.admin-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.actions-bar {
  margin-bottom: 2rem;
}

.btn-add {
  padding: 0.75rem 1.5rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
}

.btn-add:hover {
  background: #45a049;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin: 0 0 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

/* Movies List */
.movies-list h2 {
  margin-bottom: 1.5rem;
}

.movie-cards {
  display: grid;
  gap: 1.5rem;
}

.movie-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 1.5rem;
  align-items: start;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.movie-card img {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
}

.movie-details h3 {
  margin: 0 0 0.5rem;
}

.movie-meta {
  color: #666;
  margin: 0.25rem 0;
}

.movie-showtime, .movie-location {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.movie-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
}

.btn-edit {
  background: #2196f3;
  color: white;
}

.btn-edit:hover {
  background: #1976d2;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-delete:hover {
  background: #d32f2f;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 6px;
  margin: 1rem 0;
}

.loading, .no-movies {
  text-align: center;
  padding: 2rem;
  color: #666;
}

@media (max-width: 768px) {
  .movie-card {
    grid-template-columns: 1fr;
  }
  
  .movie-actions {
    flex-direction: row;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>