import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from '../lib/Icon.jsx'

/* ActionMenu — kebab (⋮) row-actions dropdown (design-system Action Menu v1).
   items: [{ id, label, destructive?, onSelect? } | { divider: true }]
   Closes on select, Esc, outside mousedown, and ANY scroll.
   The panel is position:FIXED (viewport coords) AND rendered through a PORTAL
   to document.body (2026-07-16): pinned table columns are sticky with a
   z-index, which traps a fixed descendant inside that cell's stacking context
   — later rows' kebabs then paint over the open menu. Portaling to body lifts
   the panel out of every table stacking context so it sits above all rows. */
export default function ActionMenu({ items, label }) {
  const [pos, setPos] = useState(null) // null = closed
  const ref = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!pos) return
    const close = () => setPos(null)
    const onDown = (e) => {
      /* the panel lives in a portal (outside `ref`), so check it explicitly —
         otherwise a mousedown on a menu item would read as "outside" and close
         before the item's click fires. */
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        (!panelRef.current || !panelRef.current.contains(e.target))
      ) {
        close()
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    document.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [pos])

  const toggle = (e) => {
    if (pos) return setPos(null)
    const r = e.currentTarget.getBoundingClientRect()
    const flipUp = r.bottom + 220 > window.innerHeight
    setPos({
      right: window.innerWidth - r.right,
      ...(flipUp ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 }),
    })
  }

  return (
    <div className="gpi-actmenu" ref={ref}>
      <button
        type="button"
        className="gpi-iconbtn gpi-iconbtn--neutral gpi-iconbtn--ghost"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={!!pos}
        onClick={(e) => {
          /* Don't bubble into a clickable row (onRowClick) — opening the menu
             must not also open the row's detail drawer. Menu ITEM clicks are
             portaled to <body>, so they never reach the row anyway. */
          e.stopPropagation()
          toggle(e)
        }}
      >
        <Icon name="more-vertical" size={16} />
      </button>
      {pos &&
        createPortal(
          <div className="gpi-actmenu__panel" role="menu" ref={panelRef} style={{ position: 'fixed', ...pos }}>
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
                    setPos(null)
                    it.onSelect?.()
                  }}
                >
                  {it.label}
                </button>
              ),
            )}
          </div>,
          document.body,
        )}
    </div>
  )
}
