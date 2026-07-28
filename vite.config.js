import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// GPI My-Cabinet prototype (desktop-first). Token-driven from the GPI design system.
// SINGLEFILE=1 (npm run build:share) emits ONE self-contained dist-share/index.html —
// JS/CSS/images inlined — that opens straight from file:// (send it in chat/email).
// B2B_SHARE=1 (npm run build:share:b2b) does the same but the file opens DIRECTLY on
// the B2B app (#/b2b/contracts) instead of the internal gate — for the B2B handoff.
// Fonts still load from Google Fonts, so fully-offline viewing falls back to system sans.
const b2bShare = !!process.env.B2B_SHARE
const single = !!process.env.SINGLEFILE || b2bShare

// Opened as a bare file (no hash), the app resolves view=map and — off localhost —
// shows the "use your shared link" gate. For the B2B share, seed the hash before the
// bundle runs so it lands on the B2B app. Build-only; never touches the Pages build.
const b2bDefaultRoute = {
  name: 'b2b-share-default-route',
  transformIndexHtml(html) {
    return html.replace(
      '</head>',
      `<script>if(!location.hash)location.hash='#/b2b/contracts'</script></head>`,
    )
  },
}

export default defineConfig({
  // GitHub Pages serves the site under /GPI/; the deploy workflow sets VITE_BASE=/GPI/.
  // Local dev, preview, and the cloudflared tunnel stay at root ('/').
  base: single ? './' : process.env.VITE_BASE || '/',
  plugins: [react(), ...(single ? [viteSingleFile()] : []), ...(b2bShare ? [b2bDefaultRoute] : [])],
  build: single ? { outDir: 'dist-share', assetsInlineLimit: 100000000, copyPublicDir: false } : {},
  server: { port: Number(process.env.PORT) || 5173, open: false },
})
