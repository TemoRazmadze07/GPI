import Icon from '../lib/Icon.jsx'
import { PRODUCT_IMG } from '../lib/assets.js'
import { PRODUCTS } from './data/contracts.js'

/* ProductTile — 48px lavender tile with the product illustration (raster from
   Figma 136:4952; icon fallback while an asset is missing). Extracted from
   ContractsScreen 2026-07-16 so the contract-details drawer reuses the same
   tile. Decorative (aria-hidden) — the product name always accompanies it. */
export default function ProductTile({ product, className = 'gpi-table__media' }) {
  const p = PRODUCTS[product]
  return (
    <span className={className} aria-hidden="true">
      {p.img ? (
        <img src={PRODUCT_IMG[p.img]} alt="" />
      ) : (
        <Icon name="shield-check" size={24} />
      )}
    </span>
  )
}
