import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient.js'

export function useMovies() {
  const nextMovie = ref(null)
  const upcomingMovies = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Nächsten Film abrufen
  async function fetchNextMovie() {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('movies')
        .select('*')
        .gte('eventDate', new Date().toISOString()) // <-- Temporär auskommentiert
        .order('eventDate', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (supabaseError) throw supabaseError
      nextMovie.value = data
    } catch (e) {
      error.value = e.message
      console.error('Fehler beim Laden des Films:', e)
    } finally {
      loading.value = false
    }
  }

  // Alle kommenden Filme abrufen
  async function fetchUpcomingMovies(limit = 10) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('movies')
        .select('*')
        .gte('eventDate', new Date().toISOString())
        .order('eventDate', { ascending: true })
        .limit(limit)

      if (supabaseError) throw supabaseError
      upcomingMovies.value = data
    } catch (e) {
      error.value = e.message
      console.error('Fehler beim Laden der Filme:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    nextMovie,
    upcomingMovies,
    loading,
    error,
    fetchNextMovie,
    fetchUpcomingMovies
  }
}