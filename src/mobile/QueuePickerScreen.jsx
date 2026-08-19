/* A3 — digital queue-ticket activation (F-01: "ჯავშნების სია და ელ. ბილეთის
   აღება — დღეს, ხვალ, ახლო მომავალი"). V2 only, person-scoped via ?p=.
   Today's booking is activatable (→ person-scoped e-ticket) ONLY in visit-day
   mode; every other booking stays visible but locked until 09:00 of its own
   visit day (stakeholder rule, kept verbatim).
   DELIBERATE FIX vs the stakeholder file: only the queue-activation card on
   the dash routes here. Their prototype also aims every booking CTA
   (ჯავშანი / ჩაეწერე) at this screen — wrong IA, activation ≠ booking;
   real (re)booking is F-04 and will be its own flow. */

import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { V2_PERSONS, V2_BOOKINGS } from './data.js'
import { go, isVisitDay, personParam } from './nav.js'

export default function QueuePickerScreen() {
  const visitDay = isVisitDay()
  const person = V2_PERSONS.find((p) => p.id === personParam()) || V2_PERSONS[0]
  const bookings = V2_BOOKINGS[person.id] || []

  return (
    <>
      <div className="mga-hdr">
        <button className="mga-iconbtn" aria-label="უკან" onClick={() => go('curatio')}>
          <Icon name="chevron-left" size={16} />
        </button>
        <div>
          <h1 className="mga-hdr__title">{M.qpick.title}</h1>
          <div className="mga-hdr__sub">{person.name}</div>
        </div>
      </div>

      <div className="mga-body">
        {bookings.length === 0 && (
          <div className="mga-qpk__empty">
            <Icon name="calendar" size={22} />
            <div className="mga-meta__val" style={{ marginTop: 8 }}>{M.qpick.empty}</div>
            <div className="mga-meta__lbl" style={{ marginTop: 2 }}>{M.qpick.emptyHint}</div>
          </div>
        )}

        {bookings.map((b) => {
          const active = b.when === 'today' && visitDay
          return (
            <div key={b.proc + b.time} className={'mga-card mga-qpk' + (active ? ' mga-qpk--on' : '')}>
              <div className="mga-qpk__row">
                <div>
                  <div className={'mga-qpk__kicker' + (active ? ' mga-qpk__kicker--on' : '')}>
                    {/* Three cases, not two: it is today (visit day) · it is the visit day
                        but that day is not today · it is tomorrow. Collapsing the middle
                        one into either neighbour contradicted the lock note below. */}
                    {active
                      ? M.qpick.today
                      : b.when === 'today'
                        ? M.qpick.onVisitDay
                        : M.qpick.tomorrow}{' '}
                    · {b.date}
                  </div>
                  <div className="mga-qpk__proc">{b.proc}</div>
                  <div className="mga-meta__lbl">{b.place}</div>
                </div>
                <div className="mga-qpk__side">
                  <div className="mga-qpk__time">{b.time}</div>
                  {active && <span className="mga-badge mga-badge--green">{M.qpick.queueOpen}</span>}
                </div>
              </div>
              {active ? (
                <button className="mga-btn mga-btn--primary mga-btn--md mga-btn--block" style={{ marginTop: 12 }} onClick={() => go('ticket', { p: person.id })}>
                  {M.qpick.activate}
                </button>
              ) : (
                <div className="mga-note">
                  <Icon name="clock" size={13} />
                  {b.when === 'today' ? M.qpick.lockedFuture : M.qpick.lockedTomorrow}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
