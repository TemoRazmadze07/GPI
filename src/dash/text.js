import { lang } from '../i18n/index.js'

/* Georgian „uppercase" = Mtavruli (user, 2026-09-10). CSS `text-transform:
   uppercase` deliberately leaves Mkhedruli alone (CSS Text 3), so the design's
   Mtavruli section labels never rendered on web — the legacy Casco page had the
   same fix (public/legacy-casco-step4). JS `toUpperCase()` maps Mkhedruli
   U+10D0–10FF → Mtavruli U+1C90–1CBF (Unicode 11), and Noto Sans Georgian — the
   loaded face — covers the block (document.fonts.check verified, 400–700).
   ka ONLY: in English the DOM keeps sentence case and the CSS uppercases it, so
   the accessible name stays natural. Use on labels that carry
   `text-transform: uppercase` (the 15px section heads), never on body copy. */
export const uc = (s) => (lang === 'ka' && typeof s === 'string' ? s.toUpperCase() : s)
