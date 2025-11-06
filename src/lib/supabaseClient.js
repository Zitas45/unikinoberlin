import { createClient } from '@supabase/supabase-js'

// Falsch (verursacht "process is not defined" im Browser):
// const supabaseUrl = process.env.VITE_SUPABASE_URL
// const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

// Richtig (für Vite-Projekte):
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)