import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Set base to repo name for GitHub Pages deployment
export default defineConfig({
  plugins: [react()],
  base: '/multi-file-uploader',
  server: {
    port: 3000
  },
})
