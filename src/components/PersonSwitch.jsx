import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Avatar from './Avatar.jsx'
import Badge from './Badge.jsx'
import Icon from '../lib/Icon.jsx'

/* PersonSwitch — the WEB twin of the mobile PersonSelect (2026-09-04, user):
   a compact scope selector for „whose record am I looking at". Trigger =
   avatar + name + chevron; panel = one row per person, NAME ONLY (the user
   dropped the policy/OCIN line — the avatar already disambiguates), with an
   alert tag on any OTHER person that has something waiting (e.g. „დღეს
   ვიზიტი"), and a dot on the trigger while such an alert is hidden behind it.

   persons: [{ id, name, photo?, seed? }] · alerts: { [id]: label }
   Panel surface + close behaviour reuse the Action Menu's (portal to body,
   fixed coords, closes on select / Esc / outside mousedown / any scroll). */
export default function PersonSwitch({ persons, value, onChange, alerts = {}, label }) {
  const [pos, setPos] = useState(null)
  const ref = useRef(null)
  const panelRef = useRef(null)
  const sel = persons.find((p) => p.id === value) || persons[0]
  const hidden = persons.some((p) => p.id !== sel.id && alerts[p.id])

  useEffect(() => {
    if (!pos) return
    const close = () => setPos(null)
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target) && (!panelRef.current || !panelRef.current.contains(e.target))) close()
    }
    const onKey = (e) => e.key === 'Escape' && close()
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
    /* Carry the trigger's WIDTH, not just its corner (2026-09-07): the panel and the
       button are meant to read as one object, so the panel takes the button's measured
       width. A CSS min-width alone drifts the moment a long name grows the button. */
    setPos({ left: r.left, top: r.bottom + 4, width: r.width })
  }

  return (
    <div className="gpi-pswitch" ref={ref}>
      <button
        type="button"
        className="gpi-pswitch__btn"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={!!pos}
        onClick={toggle}
      >
        <span className="gpi-pswitch__ava">
          {/* 32, up from 24 (2026-09-07): the app's trigger avatar fills its cap
              (34 in a 51px pill) — at 24 in a bordered 40px pill it floated. */}
          <Avatar name={sel.name} src={sel.photo} seed={sel.seed} size={32} />
          {hidden && !pos && <span className="gpi-pswitch__dot" />}
        </span>
        <span className="gpi-pswitch__name">{sel.name}</span>
        <Icon name={pos ? 'chevron-up' : 'chevron-down'} size={16} />
      </button>
      {pos &&
        createPortal(
          <div className="gpi-actmenu__panel gpi-pswitch__panel" role="listbox" aria-label={label} ref={panelRef} style={{ position: 'fixed', ...pos }}>
            {persons.map((p) => {
              const on = p.id === sel.id
              return (
                <button
                  key={p.id}
                  type="button"
                  role="option"
                  aria-selected={on}
                  className={`gpi-actmenu__item gpi-pswitch__row${on ? ' is-on' : ''}`}
                  onClick={() => {
                    setPos(null)
                    if (!on) onChange?.(p.id)
                  }}
                >
                  <Avatar name={p.name} src={p.photo} seed={p.seed} size={32} />
                  <span className="gpi-pswitch__rowname">{p.name}</span>
                  {!on && alerts[p.id] ? (
                    <Badge color="brand" size="sm">{alerts[p.id]}</Badge>
                  ) : (
                    on && <Icon name="check" size={16} />
                  )}
                </button>
              )
            })}
          </div>,
          document.body,
        )}
    </div>
  )
}
