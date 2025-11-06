import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'

export function useMovieAdmin() {
  const loading = ref(false)
  const error = ref(null)

  async function createMovie(movieData) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('movies')
        .insert([movieData])
        .select()
        .single()

      if (supabaseError) throw supabaseError
      return { data, error: null }
    } catch (e) {
      error.value = e.message
      return { data: null, error: e.message }
    } finally {
      loading.value = false
    }
  }

  async function updateMovie(id, movieData) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('movies')
        .update(movieData)
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) throw supabaseError
      return { data, error: null }
    } catch (e) {
      error.value = e.message
      return { data: null, error: e.message }
    } finally {
      loading.value = false
    }
  }

  async function deleteMovie(id) {
    loading.value = true
    error.value = null
    
    try {
      const { error: supabaseError } = await supabase
        .from('movies')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError
      return { error: null }
    } catch (e) {
      error.value = e.message
      return { error: e.message }
    } finally {
      loading.value = false
    }
  }

  async function getAllMovies() {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('movies')
        .select('*')
        .order('showtime', { ascending: true })

      if (supabaseError) throw supabaseError
      return { data, error: null }
    } catch (e) {
      error.value = e.message
      return { data: null, error: e.message }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createMovie,
    updateMovie,
    deleteMovie,
    getAllMovies
  }
}