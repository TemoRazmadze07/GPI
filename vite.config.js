import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// GPI My-Cabinet prototype (desktop-first). Token-driven from the GPI design system.
// SINGLEFILE=1 (npm run build:share) emits ONE self-contained dist-share/index.html —
// JS/CSS/images inlined — that opens straight from file:// (send it in chat/email).
// Fonts still load from Google Fonts, so fully-offline viewing falls back to system sans.
const single = !!process.env.SINGLEFILE

export default defineConfig({
  // GitHub Pages serves the site under /GPI/; the deploy workflow sets VITE_BASE=/GPI/.
  // Local dev, preview, and the cloudflared tunnel stay at root ('/').
  base: single ? './' : process.env.VITE_BASE || '/',
  plugins: [react(), ...(single ? [viteSingleFile()] : [])],
  build: single ? { outDir: 'dist-share', assetsInlineLimit: 100000000, copyPublicDir: false } : {},
  server: { port: Number(process.env.PORT) || 5173, open: false },
})
