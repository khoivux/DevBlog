import { defineConfig } from 'vite'
import { resolve } from 'path';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      buffer: resolve(__dirname, 'node_modules/buffer/'),
      process: resolve(__dirname, 'node_modules/process/browser'),
      global: resolve(__dirname, 'node_modules/global/'),
    },
  },
  define: {
    'global': 'window',
    'process.env': process.env
  }
});