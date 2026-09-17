import { useState, useRef, useEffect } from 'react'
import Icon from '../lib/Icon.jsx'

/* Select — lightweight dropdown (trigger + menu of options), mirroring the
   Figma Select component (node 69:148). Closes on outside-click / Escape.
   Composes our Menu Item visual. `error` = red stroke (Figma Error variant). */
/* `renderValue` (additive, 2026-08-26): how the CLOSED trigger prints the
   selection. Filter selects need "ფილტრი: მნიშვნელობა" on the trigger — three
   bare "ყველა" side by side name nothing — but baking the prefix into option
   labels made the OPEN menu read "კლინიკა: კურაციო" per row. Options stay
   plain; the trigger alone gets the context. */
/* `lead` / `sub` on an option (additive, 2026-09-04): a rich row — a leading
   node (an Avatar) and a secondary line (a policy №) under the label, on the
   trigger AND in the menu. Ports the mobile PersonSelect anatomy (avatar · name
   + OCIN) onto the desktop Select instead of forking a second dropdown; options
   without them render exactly as before. */
/* `prefix` (additive, 2026-09-17, user: „make the value bolder … it should not
   jump"): a FILTER trigger — „კატეგორია: ყველა" — as two parts, the filter's
   name muted + regular and the VALUE at 600, so the eye lands on what is set.
   It also makes the trigger STABLE-WIDTH: every option is rendered once more,
   invisibly, stacked in the same grid cell as the visible one, so the trigger is
   as wide as its LONGEST option from the start and never grows or shrinks when
   the value changes (the search field beside it stopped resizing). No hard-coded
   px, so ka/en and per-section option sets size themselves. Supersedes
   `renderValue` for the „name: value" case; `renderValue` stays for anything else. */
export default function Select({ value, placeholder, options, onChange, disabled = false, error = false, className = '', ariaLabel, renderValue, prefix }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open || disabled) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selected = options.find((o) => o.value === value)
  const rich = options.some((o) => o.lead || o.sub)
  /* How the closed trigger prints an option (plain rows). */
  const print = (o) =>
    prefix ? (
      <>
        <span className="gpi-fsel__prefix">{prefix}: </span>
        <span className="gpi-fsel__value">{o.label}</span>
      </>
    ) : renderValue ? renderValue(o) : o.label
  const Row = ({ o, label }) => (
    <>
      {o.lead && <span className="gpi-fsel__lead" aria-hidden="true">{o.lead}</span>}
      <span className="gpi-fsel__meta">
        <span className="gpi-fsel__label">{label}</span>
        {o.sub && <span className="gpi-fsel__sub">{o.sub}</span>}
      </span>
    </>
  )

  return (
    <div className={`gpi-fsel${className ? ` ${className}` : ''}`} ref={ref}>
      <button
        type="button"
        className={`gpi-fsel__btn ${rich ? 'gpi-fsel__btn--rich' : ''} ${open ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${error ? 'is-error' : ''}`}
        onClick={() => { if (!disabled) setOpen((o) => !o) }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        disabled={disabled}
      >
        {selected && rich ? (
          <Row o={selected} label={renderValue ? renderValue(selected) : selected.label} />
        ) : prefix && selected ? (
          <span className="gpi-fsel__sized">
            <span className="gpi-fsel__cur">{print(selected)}</span>
            {/* the ghost stack: sizes the trigger to the longest option, never read */}
            {options.map((o) => (
              <span key={o.value} className="gpi-fsel__ghost" aria-hidden="true">{print(o)}</span>
            ))}
          </span>
        ) : (
          <span className={selected ? '' : 'gpi-fsel__ph'}>
            {selected ? print(selected) : placeholder}
          </span>
        )}
        <Icon name={disabled ? 'lock' : 'chevron-down'} size={16} />
      </button>
      {open && !disabled && (
        <div className="gpi-fsel__menu" role="listbox">
          {options.map((o) => (
            <button
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              aria-disabled={o.disabled || undefined}
              className={`gpi-fsel__opt ${rich ? 'gpi-fsel__opt--rich' : ''} ${o.value === value ? 'is-sel' : ''} ${o.disabled ? 'is-disabled' : ''}`}
              title={o.disabled ? o.disabledReason : undefined}
              onClick={() => {
                if (o.disabled) return
                onChange(o.value)
                setOpen(false)
              }}
            >
              {rich ? <Row o={o} label={o.label} /> : o.label}
              {o.value === value && <Icon name="check" size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
