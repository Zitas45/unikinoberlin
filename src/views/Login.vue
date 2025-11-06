<script setup>
import { ref } from 'vue';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

async function handleLogin() {
  try {
    loading.value = true;
    errorMessage.value = '';
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    // Bei Erfolg zum Admin-Dashboard weiterleiten
    router.push('/admin');
  } catch (error) {
    errorMessage.value = error.message || 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Admin Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">E-Mail</label>
          <input type="email" id="email" v-model="email" required placeholder="deine@email.de">
        </div>
        <div class="input-group">
          <label for="password">Passwort</label>
          <input type="password" id="password" v-model="password" required placeholder="••••••••">
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Melde an...' : 'Anmelden' }}
        </button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px); /* Höhe von Header und Footer abziehen */
  padding: 2rem;
}
.login-card {
  background-color: #1a1a1a;
  padding: 2rem 3rem;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
  width: 100%;
  max-width: 400px;
  color: #fff;
}
h2 {
  text-align: center;
  color: #ffcc00;
  margin-bottom: 2rem;
}
.input-group {
  margin-bottom: 1.5rem;
}
/* Weitere Styles für Formular, Inputs, Button, etc. können hier hinzugefügt werden */
.error-message {
  color: #e53e3e;
  text-align: center;
  margin-top: 1rem;
}
</style>