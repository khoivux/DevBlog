import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173, // Chỉ chạy trên cổng 5173
    strictPort: true // Ngăn Vite đổi sang cổng khác nếu bị chiếm
  },
  plugins: [react()],
})
