import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Admin from '../views/Admin.vue';
import { supabase } from '../lib/supabaseClient';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    // Diese Route erfordert eine Authentifizierung
    meta: { requiresAuth: true } 
  },
];

const router = createRouter({
   history: createWebHistory('/unikinoberlin/'),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // Prüft, ob die aufgerufene Route eine Authentifizierung erfordert
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth) {
    // Holt den aktuellen Benutzer von Supabase
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Wenn kein Benutzer eingeloggt ist, leite zum Login weiter
      next({ name: 'Login' });
    } else {
      // Wenn ein Benutzer eingeloggt ist, erlaube den Zugriff
      next();
    }
  } else {
    // Wenn keine Authentifizierung nötig ist, erlaube den Zugriff immer
    next();
  }
});

export default router;