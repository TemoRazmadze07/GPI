import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// GPI My-Cabinet prototype (desktop-first). Token-driven from the GPI design system.
// SINGLEFILE=1 (npm run build:share) emits ONE self-contained dist-share/index.html —
// JS/CSS/images inlined — that opens straight from file:// (send it in chat/email).
// B2B_SHARE=1 (npm run build:share:b2b) does the same but the file opens DIRECTLY on
// the B2B app (#/b2b/contracts) instead of the internal gate — for the B2B handoff.
// SHARE_ROUTE='#/accounts' (npm run build:share:accounts) is the general form of that:
// any module can get its own double-clickable single file by naming its hash route.
// Fonts still load from Google Fonts, so fully-offline viewing falls back to system sans.
const b2bShare = !!process.env.B2B_SHARE
const shareRoute = process.env.SHARE_ROUTE || (b2bShare ? '#/b2b/contracts' : '')
const single = !!process.env.SINGLEFILE || !!shareRoute

// Opened as a bare file (no hash), the app resolves view=map and — off localhost —
// shows the "use your shared link" gate. For a module share, seed the hash before the
// bundle runs so it lands on that module. Build-only; never touches the Pages build.
const shareDefaultRoute = {
  name: 'share-default-route',
  transformIndexHtml(html) {
    return html.replace(
      '</head>',
      `<script>if(!location.hash)location.hash='${shareRoute}'</script></head>`,
    )
  },
}

export default defineConfig({
  // GitHub Pages serves the site under /GPI/; the deploy workflow sets VITE_BASE=/GPI/.
  // Local dev, preview, and the cloudflared tunnel stay at root ('/').
  base: single ? './' : process.env.VITE_BASE || '/',
  plugins: [react(), ...(single ? [viteSingleFile()] : []), ...(shareRoute ? [shareDefaultRoute] : [])],
  build: single ? { outDir: 'dist-share', assetsInlineLimit: 100000000, copyPublicDir: false } : {},
  server: { port: Number(process.env.PORT) || 5173, open: false },
})
