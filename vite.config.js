import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // Alle Requests an /notion-api werden an api.notion.com weitergeleitet.
      // So umgeht der Dev-Server das CORS-Problem im Browser.
      '/notion-api': {
        target: 'https://api.notion.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/notion-api/, ''),
      },
    },
  },
})