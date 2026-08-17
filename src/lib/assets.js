/* Central asset imports (2026-07-16). Assets referenced from JS were moved
   public/ → src/assets/ and imported, so Vite bundles them: the normal build
   emits hashed files, and the SINGLEFILE share build inlines them as data URIs
   (public/ files can't be inlined — their URLs are built at runtime, so a
   shared single index.html would point at files that aren't there). public/
   keeps only the downloads/ snapshots (and the old copies until pruned). */
import logo from '../assets/logo.png'
/* Square emblem cut from the official GPI lockup — the compact mark for avatars,
   where the full horizontal logo is illegible. See the SVG's own header. */
import gpiMark from '../assets/gpi-mark.svg'
import clientLogo from '../assets/client-logo.svg'
import flagKa from '../assets/flags/GE.svg'
import flagEn from '../assets/flags/GB.svg'
import bookingEmpty from '../assets/illustrations/booking-empty.svg'
import productHealth from '../assets/products/health.png'
import productAuto from '../assets/products/auto.png'
import productTravel from '../assets/products/travel.png'
import productProperty from '../assets/products/property.png'

export const ASSETS = { logo, gpiMark, clientLogo, bookingEmpty }

/* Country flags for the language switcher (user export, 2026-08-10), keyed by
   locale code. Both were normalised to the same 28×20 box with a 1.75 corner
   radius; GB's Figma drop shadow was stripped (a 20px flag needs no elevation,
   and the export's shadow was black-tinted). Render them in a fixed box with
   object-fit: contain so the two intrinsic sizes can never diverge. */
export const FLAGS = { ka: flagKa, en: flagEn }

/* Keyed by the `img` filename in PRODUCTS (data/contracts.js). */
export const PRODUCT_IMG = {
  'health.png': productHealth,
  'auto.png': productAuto,
  'travel.png': productTravel,
  'property.png': productProperty,
}
