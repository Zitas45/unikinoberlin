import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient'; 

// reaktive Variable für den Benutzerstatus
const user = ref(null);

/**
 * Composable für die Benutzerauthentifizierung mit Supabase.
 */
export function useAuth() {

  // Funktion, um den aktuellen Benutzer zu prüfen
  async function checkUser() {
    const { data } = await supabase.auth.getUser();
    user.value = data.user;
  }

  // Beim Laden der Komponente und bei Auth-Änderungen den Benutzerstatus aktualisieren
  onMounted(() => {
    checkUser();
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user ?? null;
    });
  });

  // Gib den Benutzerstatus und die Funktion zurück
  return { user, checkUser };
}