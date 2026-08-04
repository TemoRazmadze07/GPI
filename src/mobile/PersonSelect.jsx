/* PersonSelect — insured-person dropdown for the V2 კურაციო tab. Reuses the
   booking-flow PersonCard anatomy (avatar · name + policy № · radio) in mga
   tokens. No relation labels by design — the system only knows policyholder
   vs additional members (policyholder sorts first = default selection; name +
   surname is enough for the user to recognise family).
   `alerts` maps personId → short tag ("დღეს ვიზიტი"); an alert on any
   NON-selected person also surfaces as a dot on the collapsed trigger so it
   stays visible before the dropdown is opened. */

import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'

export default function PersonSelect({ persons, selectedId, onSelect, alerts = {} }) {
  const [open, setOpen] = useState(false)
  const sel = persons.find((p) => p.id === selectedId) || persons[0]
  const hasAlert = persons.some((p) => p.id !== selectedId && alerts[p.id])

  return (
    <div className="mga-pselect">
      <button
        className="mga-pselect__btn"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={M.dash2.personAria}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="mga-pselect__ava" aria-hidden="true">{sel.initial}</span>
        <span className="mga-pselect__meta">
          <span className="mga-pselect__name">{sel.name}</span>
          <span className="mga-pselect__id">{sel.ocin}</span>
        </span>
        <span className="mga-pselect__chev">
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
          {hasAlert && !open && <span className="mga-pselect__dot" aria-label={M.dash2.todayVisit} />}
        </span>
      </button>

      {open && (
        <>
          <button className="mga-pselect__scrim" aria-label={M.dash2.close} onClick={() => setOpen(false)} />
          <div className="mga-pselect__panel" role="listbox" aria-label={M.dash2.personAria}>
            {persons.map((p) => {
              const on = p.id === selectedId
              return (
                <button
                  key={p.id}
                  className={'mga-pselect__row' + (on ? ' mga-pselect__row--on' : '')}
                  role="option"
                  aria-selected={on}
                  onClick={() => {
                    onSelect(p.id)
                    setOpen(false)
                  }}
                >
                  <span className="mga-pselect__ava" aria-hidden="true">
                    {p.initial}
                    {!on && alerts[p.id] && <span className="mga-pselect__dot mga-pselect__dot--ava" />}
                  </span>
                  <span className="mga-pselect__meta">
                    <span className="mga-pselect__name">{p.name}</span>
                    <span className="mga-pselect__id">{p.ocin}</span>
                  </span>
                  {!on && alerts[p.id] ? (
                    <span className="mga-pselect__tag">{alerts[p.id]}</span>
                  ) : (
                    <span className={'mga-pselect__radio' + (on ? ' mga-pselect__radio--on' : '')} aria-hidden="true">
                      {on && <span className="mga-pselect__radiodot" />}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
