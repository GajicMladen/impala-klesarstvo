import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `vite build --mode pages` builds for GitHub Pages (https://<user>.github.io/impala-klesarstvo/)
export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/impala-klesarstvo/' : '/',
  plugins: [react(), tailwindcss()],
}))
