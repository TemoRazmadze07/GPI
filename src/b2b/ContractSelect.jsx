import { useEffect, useRef, useState } from 'react'
import Badge from '../components/Badge.jsx'
import Icon from '../lib/Icon.jsx'
import ProductTile from './ProductTile.jsx'
import { kaB2B } from './strings.js'
import { eligibleContracts } from './data/addInsured.js'

const t = kaB2B.addIns

/* ContractSelect — the quiet inline contract selector (Option 1, locked
   2026-08-06). The chip row stays; the contract VALUE is the dropdown trigger
   when >1 eligible contract exists, plain text otherwise. The menu reuses the
   shared Select's panel grammar (.gpi-fsel__menu/__opt — Menu Item visuals).
   `readOnly` renders the plain chip (review step: context, not a control). */
export default function ContractSelect({ contract, onSelect, readOnly = false }) {
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const canSwitch = !readOnly && eligibleContracts.length > 1

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="b2b-wiz__contract">
      {/* Same product-tile language as the Contracts table rows (user, 2026-08-06) —
          smaller cut via the size class; decorative, the label carries the name. */}
      <ProductTile product={contract.product} className="b2b-wiz__contract-tile" />
      <span className="b2b-wiz__contract-lbl">{t.contractLabel}:</span>
      {canSwitch ? (
        <span className="b2b-wiz__contract-sel" ref={boxRef}>
          <button
            type="button"
            className="b2b-wiz__contract-trigger"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={t.contractSelect}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="b2b-wiz__contract-val">{contract.label} · {contract.id}</span>
            <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
          </button>
          {open && (
            <div className="gpi-fsel__menu b2b-wiz__contract-menu" role="listbox" aria-label={t.contractSelect}>
              {eligibleContracts.map((c) => (
                <button
                  key={c.id}
                  role="option"
                  aria-selected={c.id === contract.id}
                  className={`gpi-fsel__opt ${c.id === contract.id ? 'is-sel' : ''}`}
                  onClick={() => {
                    setOpen(false)
                    if (c.id !== contract.id) onSelect(c.id)
                  }}
                >
                  <ProductTile product={c.product} className="b2b-wiz__contract-tile b2b-wiz__contract-tile--sm" />
                  <span className="b2b-wiz__contract-opt">
                    <span>{c.label} · {c.id}</span>
                    <span className="b2b-wiz__contract-meta">{t.contractInsured(c.insured)}</span>
                  </span>
                  {c.id === contract.id && <Icon name="check" size={16} />}
                </button>
              ))}
            </div>
          )}
        </span>
      ) : (
        <span className="b2b-wiz__contract-val" title={!readOnly ? t.contractSingle : undefined}>
          {contract.label} · {contract.id}
        </span>
      )}
      <Badge color="success" size="sm">
        {contract.status}
      </Badge>
    </div>
  )
}
