import { useState, useEffect, useRef } from 'react'
import Icon from '../lib/Icon.jsx'
import { Button } from './Button.jsx'
import { ka } from '../i18n/strings.js'

/* ReservationCountdown — the doctor's slot is held server-side for 15 minutes
   once the first appointment is added. This is an EXCEPTION handler, not chrome:
   it shows NOTHING for the first 10 minutes (the common, fast path), then surfaces
   only for the final 5, escalating calm → warning → error, and on 0:00 forces a
   release dialog whose only exit is restarting (the insured person is kept).

   Timing is real by default but overridable for demos / usability sessions:
     ?hold=<sec>  total hold window          (default 900 = 15 min)
     ?show=<sec>  reminder appears this long before expiry (default 300 = 5 min)
   e.g. ?hold=60&show=20 → silent for 40s, then a 20s escalating countdown. */
const P = new URLSearchParams(window.location.search)
const HOLD_S = Math.max(10, Number(P.get('hold')) || 900)
const SHOW_S = Math.max(5, Number(P.get('show')) || Math.min(300, HOLD_S))
const WARN_S = SHOW_S * 0.4 // remaining ≤ → amber warning   (default 2:00)
const URGENT_S = SHOW_S * 0.2 // remaining ≤ → red final push (default 1:00)

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export default function ReservationCountdown({ startedAt, onRestart }) {
  const [now, setNow] = useState(() => Date.now())
  const [liveMsg, setLiveMsg] = useState('')
  const [open, setOpen] = useState(false) // click-to-explain popover
  const announced = useRef(null)
  const dockRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // Close the explanation popover on outside-click or Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (!dockRef.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const remaining = Math.max(0, Math.ceil((startedAt + HOLD_S * 1000 - now) / 1000))
  const visible = remaining <= SHOW_S && remaining > 0
  const tone = remaining > WARN_S ? 'calm' : remaining > URGENT_S ? 'warning' : 'urgent'
  // Screen-reader: announce at thresholds only (tone change + a 30-second cue),
  // never every tick — the visual pill itself is aria-hidden.
  const bucket = visible ? tone + (remaining <= 30 ? '-30' : '') : null

  useEffect(() => {
    if (!bucket || announced.current === bucket) return
    announced.current = bucket
    setLiveMsg(ka.wizard.countdown.aria(fmt(remaining)))
  }, [bucket]) // eslint-disable-line react-hooks/exhaustive-deps -- announce once per threshold

  const c = ka.wizard.countdown

  // The common case: plenty of time left → render nothing at all.
  if (remaining > SHOW_S) return null

  // Expired → forced, non-dismissible release dialog (no ×, no backdrop-close).
  if (remaining <= 0) {
    return (
      <div className="gpi-modal-overlay gpi-cdexpire-overlay">
        <div className="gpi-cdexpire" role="alertdialog" aria-modal="true" aria-labelledby="gpi-cdexp-t" aria-describedby="gpi-cdexp-b">
          <span className="gpi-cdexpire__icon"><Icon name="alert-circle" size={24} /></span>
          <h3 className="gpi-cdexpire__title t-h4" id="gpi-cdexp-t">{c.expired.title}</h3>
          <p className="gpi-cdexpire__body t-body" id="gpi-cdexp-b">{c.expired.body}</p>
          <Button variant="primary" size="md" leadingIcon="rotate-ccw" onClick={onRestart}>
            {c.expired.restart}
          </Button>
        </div>
      </div>
    )
  }

  const icon = tone === 'calm' ? 'clock' : tone === 'warning' ? 'alert-triangle' : 'alert-circle'
  return (
    <>
      <div className="gpi-countdown-dock" ref={dockRef}>
        <button
          type="button"
          className={`gpi-countdown gpi-countdown--${tone}`}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={`${c[tone]}, ${c.aria(fmt(remaining))}`}
        >
          <span className="gpi-countdown__frame"><Icon name={icon} size={20} /></span>
          <span className="gpi-countdown__text">
            <span className="gpi-countdown__label t-label">{c[tone]}</span>
            <span className="gpi-countdown__time">{fmt(remaining)}</span>
          </span>
        </button>
        {open && (
          <div className="gpi-countdown-pop" role="dialog" aria-label={c.info.title}>
            <p className="gpi-countdown-pop__title t-label">{c.info.title}</p>
            <p className="gpi-countdown-pop__body t-body-sm">{c.info.body}</p>
          </div>
        )}
      </div>
      <span className="gpi-sr-only" role="status" aria-live="polite">{liveMsg}</span>
    </>
  )
}
