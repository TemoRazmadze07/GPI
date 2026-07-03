import { useEffect, useRef, useState } from 'react'
import Icon from '../lib/Icon.jsx'

/* ActionMenu — kebab (⋮) row-actions dropdown (design-system Action Menu v1).
   items: [{ id, label, destructive?, onSelect? } | { divider: true }]
   Closes on select, Esc, and outside mousedown. */
export default function ActionMenu({ items, label }) {
  const [open, setOpen] = useState(false)
  const [flipUp, setFlipUp] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="gpi-actmenu" ref={ref}>
      <button
        type="button"
        className="gpi-iconbtn gpi-iconbtn--neutral gpi-iconbtn--ghost"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          if (!open && ref.current) {
            const r = ref.current.getBoundingClientRect()
            setFlipUp(r.bottom + 220 > window.innerHeight)
          }
          setOpen((v) => !v)
        }}
      >
        <Icon name="more-vertical" size={16} />
      </button>
      {open && (
        <div className={`gpi-actmenu__panel${flipUp ? ' gpi-actmenu__panel--up' : ''}`} role="menu">
          {items.map((it, i) =>
            it.divider ? (
              <div key={`div-${i}`} className="gpi-actmenu__divider" role="separator" />
            ) : (
              <button
                key={it.id}
                type="button"
                role="menuitem"
                className={`gpi-actmenu__item${it.destructive ? ' is-destructive' : ''}`}
                onClick={() => {
                  setOpen(false)
                  it.onSelect?.()
                }}
              >
                {it.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
