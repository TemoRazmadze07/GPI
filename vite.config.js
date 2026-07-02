import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GPI My-Cabinet prototype (desktop-first). Token-driven from the GPI design system.
export default defineConfig({
  plugins: [react()],
  server: { port: Number(process.env.PORT) || 5173, open: false },
})
