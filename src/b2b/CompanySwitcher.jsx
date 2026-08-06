import { useEffect, useRef, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import ClientMark from './ClientMark.jsx'
import { kaB2B } from './strings.js'

/* CompanySwitcher — the topbar client chip (concept locked in chat, 2026-08-06).
   One administrator can act for several legal entities of a holding: with 2+
   companies the chip becomes a dropdown trigger (chevron + hover + pointer);
   with exactly one it renders as the same static chip — identical geometry,
   zero affordance. The GPI logo next to it stays a separate home link; only
   the chip switches context.

   Switching always lands on the portal home: deep states (an open drawer, a
   filtered table) refer to records that may not exist in the other company,
   so "same page, re-scoped" would produce empty tables and dead links. */

function CompanyRow({ company, active, meta, onPick }) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={active}
      className={`b2b-switch__row ${active ? 'is-active' : ''}`}
      onClick={onPick}
    >
      <ClientMark name={company.name} logo={company.logo} fallback={company.mark} />
      <span className="b2b-switch__info">
        <span className="b2b-switch__name">{company.name}</span>
        <span className="b2b-switch__meta">{meta}</span>
      </span>
      {active && <Icon name="check" size={16} className="b2b-switch__check" />}
    </button>
  )
}

export default function CompanySwitcher({ companies, activeId, onSwitch }) {
  const t = kaB2B.switcher
  const active = companies.find((c) => c.id === activeId) || companies[0]
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      btnRef.current?.focus()
    }
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [open])

  /* Menu semantics: focus starts on the checked company, arrows rove. */
  useEffect(() => {
    if (open) menuRef.current?.querySelector('[aria-checked="true"]')?.focus()
  }, [open])

  const onMenuKey = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const rows = [...(menuRef.current?.querySelectorAll('.b2b-switch__row') || [])]
    if (!rows.length) return
    e.preventDefault()
    const i = rows.indexOf(document.activeElement)
    const next = e.key === 'ArrowDown' ? Math.min(i + 1, rows.length - 1) : Math.max(i - 1, 0)
    rows[next].focus()
  }

  const pick = (c) => {
    setOpen(false)
    btnRef.current?.focus()
    if (c.id !== active.id) onSwitch?.(c.id)
  }

  /* Single company: same chip, no affordance — not a button, no chevron. */
  if (companies.length <= 1) {
    return (
      <span className="b2b-client" title={active.name}>
        <ClientMark name={active.name} logo={active.logo} fallback={active.mark} />
        <span className="b2b-client__name">{active.short}</span>
      </span>
    )
  }

  return (
    <span className="b2b-switch" ref={rootRef}>
      <button
        ref={btnRef}
        type="button"
        className="b2b-client b2b-client--btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.trigger(active.name)}
        onClick={() => setOpen((v) => !v)}
      >
        <ClientMark name={active.name} logo={active.logo} fallback={active.mark} />
        <span className="b2b-client__name">{active.short}</span>
        <span className="b2b-client__chev" aria-hidden="true">
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
        </span>
      </button>
      {open && (
        <div
          className="b2b-switch__popover"
          role="menu"
          aria-label={t.heading}
          ref={menuRef}
          onKeyDown={onMenuKey}
        >
          <div className="b2b-switch__heading">{t.heading}</div>
          {companies.map((c) => (
            <CompanyRow
              key={c.id}
              company={c}
              active={c.id === active.id}
              meta={t.meta(c.taxId, c.insured)}
              onPick={() => pick(c)}
            />
          ))}
        </div>
      )}
    </span>
  )
}
