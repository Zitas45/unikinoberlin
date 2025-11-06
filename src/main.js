import { createApp } from 'vue'
import './style.css' // Annahme, dass du eine globale style.css hast
import App from './App.vue'
import router from './router' // Importiere den Router

const app = createApp(App)
app.use(router) // Binde den Router in die App ein
app.mount('#app')