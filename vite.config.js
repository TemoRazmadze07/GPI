import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GPI My-Cabinet prototype (desktop-first). Token-driven from the GPI design system.
export default defineConfig({
  // GitHub Pages serves the site under /GPI/; the deploy workflow sets VITE_BASE=/GPI/.
  // Local dev, preview, and the cloudflared tunnel stay at root ('/').
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: { port: Number(process.env.PORT) || 5173, open: false },
})
