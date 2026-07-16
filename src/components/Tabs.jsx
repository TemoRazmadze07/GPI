import { useRef } from 'react'

/* Tabs — underline page-content switcher (design-system Tabs v1, 2026-07-15).
   Switches DATASETS on one page (vs Segmented Control = view-mode toggle).
   items: [{ id, label, count? }] · value · onChange · label (aria).
   Roving tabindex; ←/→ move AND activate (tabs switch content instantly). */
export default function Tabs({ items, value, onChange, label }) {
  const refs = useRef({})
  const idx = items.findIndex((i) => i.id === value)

  const onKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const step = e.key === 'ArrowRight' ? 1 : items.length - 1
    const next = items[(idx + step) % items.length]
    onChange(next.id)
    refs.current[next.id]?.focus()
  }

  return (
    <div className="gpi-tabs" role="tablist" aria-label={label}>
      {items.map((it) => {
        const active = it.id === value
        return (
          <button
            key={it.id}
            ref={(el) => (refs.current[it.id] = el)}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            className={`gpi-tab${active ? ' is-active' : ''}`}
            onClick={() => onChange(it.id)}
            onKeyDown={onKey}
          >
            {it.label}
            {it.count != null && <span className="gpi-tab__count">{it.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
