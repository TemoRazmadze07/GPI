/* Electronic queue ticket (F-01) — opened from ბილეთის ნახვა on the health home
   / V2 კურაციო tab hero, or (in production) the visit-day SMS deep link. Live
   Qmatic stats + clinic info with map entry.
   V2 (stakeholder parity, 2026-08-04): the ticket is scoped to the person whose
   hero was tapped (?p= in the hash query, default = policyholder). V1 keeps the
   original BOOKING/QUEUE data.
   Remote payment and the "remind me 1 patient earlier" opt-in are BOTH absent
   BY THE USER'S CALL (2026-08-04, A2 review) — the stakeholder file shows them,
   but they were removed from this screen. Do not reintroduce without the user. */

import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { BOOKING, QUEUE, CLINIC, V2_PERSONS, V2_TODAY } from './data.js'
import { go, isV2, personParam } from './nav.js'

export default function TicketScreen() {
  const v2 = isV2()
  /* V2: person-scoped visit; fall back to the policyholder's ticket. */
  const today = v2 ? V2_TODAY[personParam()] || V2_TODAY[V2_PERSONS[0].id] : null

  const num = today ? today.queue : QUEUE.number
  const line1 = today ? today.proc : `${BOOKING.specialty} · ${BOOKING.doctor}`
  const line2 = today ? `${today.place} · ${today.time}` : `${CLINIC.cabinet} · ${BOOKING.timeShort}`

  return (
    <>
      <div className="mga-hdr">
        {/* V2: the ticket "belongs" to the კურაციო tab, so back returns there. */}
        <button className="mga-back" aria-label="უკან" onClick={() => go(v2 ? 'curatio' : 'health')}>
          <Icon name="chevron-left" size={16} />
        </button>
        <h1 className="mga-hdr__title">{M.ticket.title}</h1>
      </div>
      <div className="mga-body">
        <div className="mga-card mga-thero">
          <div className="mga-meta__lbl">{M.ticket.yourTicket}</div>
          <div className="mga-thero__num">{num}</div>
          <div style={{ fontSize: 12, color: 'var(--mga-muted)' }}>{line1}</div>
          <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{line2}</div>
        </div>

        <div className="mga-card">
          <div className="mga-tstats">
            <div className="mga-tstats__cell">
              <div className="mga-meta__lbl">{M.ticket.wait}</div>
              <div className="mga-tstats__val">
                ~{QUEUE.waitMin} {M.bookings.minutes}
              </div>
            </div>
            <div className="mga-tstats__cell">
              <div className="mga-meta__lbl">{M.ticket.ahead}</div>
              <div className="mga-tstats__val">
                {QUEUE.ahead} {M.bookings.queuePatients}
              </div>
            </div>
            <div className="mga-tstats__cell">
              <div className="mga-meta__lbl">{M.ticket.status}</div>
              <div className="mga-tstats__live">● {M.ticket.live}</div>
            </div>
          </div>
        </div>

        <div className="mga-card">
          <div className="mga-irow" style={{ padding: 0 }}>
            <span className="mga-itile">
              <Icon name="building-2" size={17} />
            </span>
            <div className="mga-meta">
              <div className="mga-meta__lbl">{CLINIC.name}</div>
              <div className="mga-meta__val">{CLINIC.address}</div>
            </div>
          </div>
          <button className="mga-obtn" style={{ marginTop: 10 }}>
            <Icon name="map-pin" size={13} />
            {M.ticket.map}
          </button>
        </div>

      </div>
    </>
  )
}
