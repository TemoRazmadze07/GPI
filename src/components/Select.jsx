import { useState, useRef, useEffect } from 'react'
import Icon from '../lib/Icon.jsx'

/* Select — lightweight dropdown (trigger + menu of options), mirroring the
   Figma Select component (node 69:148). Closes on outside-click / Escape.
   Composes our Menu Item visual. `error` = red stroke (Figma Error variant). */
export default function Select({ value, placeholder, options, onChange, disabled = false, error = false, className = '', ariaLabel }) {
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

  return (
    <div className={`gpi-fsel${className ? ` ${className}` : ''}`} ref={ref}>
      <button
        type="button"
        className={`gpi-fsel__btn ${open ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${error ? 'is-error' : ''}`}
        onClick={() => { if (!disabled) setOpen((o) => !o) }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        disabled={disabled}
      >
        <span className={selected ? '' : 'gpi-fsel__ph'}>{selected ? selected.label : placeholder}</span>
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
              className={`gpi-fsel__opt ${o.value === value ? 'is-sel' : ''} ${o.disabled ? 'is-disabled' : ''}`}
              title={o.disabled ? o.disabledReason : undefined}
              onClick={() => {
                if (o.disabled) return
                onChange(o.value)
                setOpen(false)
              }}
            >
              {o.label}
              {o.value === value && <Icon name="check" size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
