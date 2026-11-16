import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Alternativa a CORS en desarrollo: si VITE_API_URL queda vacío, las
    // llamadas a /api se reenvían al backend desde el mismo origen.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
