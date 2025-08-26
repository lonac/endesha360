import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:8087', // keep this for test-service or user-management-service
      '/questions-service': 'http://localhost:8765', // for gateway/service discovery
    },
  },
})
