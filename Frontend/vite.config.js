import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      // Proxy all /api requests to the Spring Boot backend during development.
      // This means the browser always talks to the same origin (localhost:5173),
      // so CORS preflight issues are completely eliminated in dev.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})