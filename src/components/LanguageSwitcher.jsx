import { useEffect, useRef, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { FLAGS } from '../lib/assets.js'

/* LanguageSwitcher — flag + code trigger opening a single-select popover
   (design anchor: the SHIPPED mobile menu, user export 2026-08-10).

   Shared across platforms on purpose (Rule 6): the accounts console mounts it
   in the mobile menu footer today, and the desktop top bar's dead „ENG" pill
   is the next consumer.

   · `direction="up"` flips the panel above the trigger — the mobile menu pins
     the switcher to the bottom of the screen, so a downward panel would open
     off-viewport. The chevron still reports STATE (down = closed, up = open)
     rather than panel direction — that is what the shipped screens do, and it
     matches the account chip's chevron on the desktop bar.
   · Language names are NEVER translated. „GEO"/„ENG" read the same in both
     locales, which is the whole point of a language switcher: you have to be
     able to find your language while the UI is in one you can't read.
   · ARIA: menuitemradio + aria-checked, not menuitem — this is a single-select
     among mutually exclusive options, and screen readers should say which one
     is active. */

export const LANGS = [
  { code: 'ka', label: 'GEO' },
  { code: 'en', label: 'ENG' },
]

export default function LanguageSwitcher({
  value = 'ka',
  onChange,
  direction = 'down',
  label = 'Language',
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const active = LANGS.find((l) => l.code === value) || LANGS[0]

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = (code) => {
    setOpen(false)
    if (code !== value) onChange?.(code)
  }

  return (
    <div className={`gpi-langsw gpi-langsw--${direction}${className ? ` ${className}` : ''}`} ref={ref}>
      <button
        type="button"
        className="gpi-langsw__btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${label}: ${active.label}`}
        onClick={() => setOpen((v) => !v)}
      >
        <img className="gpi-langsw__flag" src={FLAGS[active.code]} alt="" />
        <span className="gpi-langsw__lbl">{active.label}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} className="gpi-langsw__chev" />
      </button>

      {open && (
        <div className="gpi-langsw__panel" role="menu" aria-label={label}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              role="menuitemradio"
              aria-checked={l.code === value}
              className="gpi-langsw__item"
              onClick={() => pick(l.code)}
            >
              <img className="gpi-langsw__flag" src={FLAGS[l.code]} alt="" />
              <span className="gpi-langsw__lbl">{l.label}</span>
              {l.code === value && <Icon name="check-circle" size={20} className="gpi-langsw__on" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
