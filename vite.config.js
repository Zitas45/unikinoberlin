import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/unikinoberlin/', // Passe dies an den Namen deines GitHub-Repositorys an
  build: {
    outDir: 'dist', // Dies sollte bereits der Standard sein
  }
})
