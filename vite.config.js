import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Usa process.env para leer las variables de entorno en vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.VITE_APP_HOST || 'localhost',
    port: parseInt(process.env.VITE_APP_PORT, 10) || 4000,
  },
});
