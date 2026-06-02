import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/image-preview/img/',
  plugins: [vue()],
  server: {
    port: 5173,
    host: true
  }
})
