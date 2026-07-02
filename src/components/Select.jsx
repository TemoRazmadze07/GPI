import { useState, useRef, useEffect } from 'react'
import Icon from '../lib/Icon.jsx'

/* Select — lightweight filter dropdown (trigger + menu of options).
   Closes on outside-click / Escape. Composes our Menu Item visual. */
export default function Select({ value, placeholder, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
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
    <div className="gpi-fsel" ref={ref}>
      <button
        type="button"
        className={`gpi-fsel__btn ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? '' : 'gpi-fsel__ph'}>{selected ? selected.label : placeholder}</span>
        <Icon name="chevron-down" size={16} />
      </button>
      {open && (
        <div className="gpi-fsel__menu" role="listbox">
          {options.map((o) => (
            <button
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={`gpi-fsel__opt ${o.value === value ? 'is-sel' : ''}`}
              onClick={() => {
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
