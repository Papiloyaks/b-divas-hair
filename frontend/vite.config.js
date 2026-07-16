import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    // Don't search parent folders for a postcss.config.js — this project
    // uses the @tailwindcss/vite plugin above and needs no PostCSS config.
    postcss: {},
  },
  server: {
    port: 5173,
  },
})
