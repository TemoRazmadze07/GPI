import { useEffect, useRef, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import SearchField from './SearchField.jsx'
import { Button } from './Button.jsx'
import FilterPopover, { activeValueCount, fmtDate } from './FilterPopover.jsx'

/* FilterBar — the common table toolbar (design-system Filter Bar v1, agreed
   2026-07-15): [ფილტრი ▾ +count] [search] [CSV export] over an applied-filters
   chips row. Export must always act on the FILTERED rows (screen's concern).
   Popover selections stage until Apply; removing an applied chip below the
   toolbar commits immediately. Closes on Esc / outside click (draft discarded). */

export default function FilterBar({ categories, value, onChange, countRows, search, onExport, t }) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target)) setOpen(false)
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

  const activeCount = activeValueCount(categories, value)

  /* One removable chip per applied value (range → one chip for the period). */
  const chips = []
  for (const c of categories) {
    const v = value[c.id]
    if (c.type === 'range') {
      if (v) {
        chips.push({
          key: c.id,
          label: `${c.label}: ${fmtDate(v.from)} — ${fmtDate(v.to)}`,
          remove: () => onChange({ ...value, [c.id]: null }),
        })
      }
    } else {
      for (const id of v || []) {
        const opt = c.options.find((o) => o.id === id)
        chips.push({
          key: `${c.id}-${id}`,
          label: `${c.label}: ${opt?.label ?? id}`,
          remove: () => onChange({ ...value, [c.id]: v.filter((x) => x !== id) }),
        })
      }
    }
  }

  const clearAll = () => {
    const next = {}
    for (const c of categories) next[c.id] = c.type === 'range' ? null : []
    onChange(next)
  }

  return (
    <div className="gpi-filterbar">
      <div className="gpi-filterbar__row">
        <div className="gpi-filterbar__anchor" ref={anchorRef}>
          <button
            type="button"
            className={`gpi-btn gpi-btn--secondary gpi-btn--md gpi-filterbar__btn${activeCount ? ' has-active' : ''}`}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name="filter" size={20} />
            <span>{t.filter}</span>
            {activeCount > 0 && <span className="gpi-filterbar__count">{activeCount}</span>}
            <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} />
          </button>
          {open && (
            <FilterPopover
              categories={categories}
              applied={value}
              countRows={countRows}
              onApply={(next) => {
                onChange(next)
                setOpen(false)
              }}
              t={t}
            />
          )}
        </div>
        <div className="gpi-filterbar__search">
          <SearchField value={search.value} onChange={search.onChange} placeholder={search.placeholder} />
        </div>
        <Button variant="secondary" size="md" leadingIcon="download" onClick={onExport}>
          {t.export}
        </Button>
      </div>
      {chips.length > 0 && (
        <div className="gpi-filterbar__applied" aria-label={t.appliedLabel}>
          {chips.map((ch) => (
            <span key={ch.key} className="gpi-fchip">
              {ch.label}
              <button
                type="button"
                className="gpi-fchip__x"
                aria-label={`${t.remove} — ${ch.label}`}
                onClick={ch.remove}
              >
                <Icon name="x" size={16} />
              </button>
            </span>
          ))}
          <button type="button" className="gpi-filterbar__clear" onClick={clearAll}>
            {t.clear}
          </button>
        </div>
      )}
    </div>
  )
}
