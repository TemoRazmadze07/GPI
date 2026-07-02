import { useEffect, useRef, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import Avatar from '../components/Avatar.jsx'
import { kaB2B } from './strings.js'

/* ContactLauncher — floating service-manager contact button (bottom-right).
   Replaces the always-on sidebar card: chrome stays clean, the human stays
   one click away. Popover offers call + email; closes on Esc / outside click.
   Indigo on purpose — pink is reserved for the primary "new request" CTA. */

export default function ContactLauncher() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const t = kaB2B.launcher

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  return (
    <div className="b2b-launcher" ref={rootRef}>
      {open && (
        <div className="b2b-launcher__popover" role="dialog" aria-label={t.title}>
          <div className="b2b-launcher__head">
            <Avatar name={t.name} size={40} />
            <div>
              <div className="b2b-launcher__name">{t.name}</div>
              <div className="b2b-launcher__role">{t.title}</div>
            </div>
          </div>
          <a className="b2b-launcher__row" href={t.phoneHref}>
            <Icon name="phone" size={16} />
            <span>{t.phone}</span>
          </a>
          <a className="b2b-launcher__row" href={`mailto:${t.email}`}>
            <Icon name="mail" size={16} />
            <span>{t.email}</span>
          </a>
        </div>
      )}
      <button
        className="b2b-launcher__fab"
        aria-label={t.open}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? 'x' : 'headphones'} size={22} />
      </button>
    </div>
  )
}
