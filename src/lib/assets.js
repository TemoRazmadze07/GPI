/* Central asset imports (2026-07-16). Assets referenced from JS were moved
   public/ → src/assets/ and imported, so Vite bundles them: the normal build
   emits hashed files, and the SINGLEFILE share build inlines them as data URIs
   (public/ files can't be inlined — their URLs are built at runtime, so a
   shared single index.html would point at files that aren't there). public/
   keeps only the downloads/ snapshots (and the old copies until pruned). */
import logo from '../assets/logo.png'
import clientLogo from '../assets/client-logo.svg'
import bookingEmpty from '../assets/illustrations/booking-empty.svg'
import productHealth from '../assets/products/health.png'
import productAuto from '../assets/products/auto.png'
import productTravel from '../assets/products/travel.png'
import productProperty from '../assets/products/property.png'

export const ASSETS = { logo, clientLogo, bookingEmpty }

/* Keyed by the `img` filename in PRODUCTS (data/contracts.js). */
export const PRODUCT_IMG = {
  'health.png': productHealth,
  'auto.png': productAuto,
  'travel.png': productTravel,
  'property.png': productProperty,
}
