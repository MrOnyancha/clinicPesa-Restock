import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    host: true,
    origin: 'http://localhost:5000',
    allowedHosts: [
      'localhost',
      '4464ac9c-b978-4ad6-b692-1a9cb80f4557-00-2e6egi93yz7l2.riker.replit.dev'
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
