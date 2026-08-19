/* Electronic queue ticket (F-01) — opened from ბილეთის ნახვა on the health home
   / V2 კურაციო tab hero, or (in production) the visit-day SMS deep link. Live
   Qmatic stats + clinic info. (Review 2026-08-18: „რუკაზე ნახვა" REMOVED — maps are
   a known dev pain point, so it is deferred; the address stays, which is what a
   patient actually needs to read out to a taxi.)
   V2 (stakeholder parity, 2026-08-04): the ticket is scoped to the person whose
   hero was tapped (?p= in the hash query, default = policyholder). V1 keeps the
   original BOOKING/QUEUE data.
   Remote payment and the "remind me 1 patient earlier" opt-in are BOTH absent
   BY THE USER'S CALL (2026-08-04, A2 review) — the stakeholder file shows them,
   but they were removed from this screen. Do not reintroduce without the user.
   #5 (2026-08-18): ARRIVAL CHECK-IN („მე მოვედი"). Activating a ticket remotely
   is not the same event as reaching the clinic — Qmatic needs the arrival
   signal before the patient can be called. Placed ABOVE the clinic card:
   the address answers „how do I get there", check-in answers „I'm here", so the
   screen reads in the order the visit actually happens. Confirmed state stays
   on screen (rather than collapsing) so the patient keeps proof + next step. */

import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { BOOKING, QUEUE, CLINIC, V2_PERSONS, V2_TODAY, arrivedAtFor, setArrived } from './data.js'
import { go, isV2, personParam } from './nav.js'

/* Local time of the check-in tap — the confirmation is evidence, so it carries
   a real timestamp rather than a canned one. */
function nowHHMM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function TicketScreen() {
  const v2 = isV2()
  /* V2: person-scoped visit; fall back to the policyholder's ticket. */
  const today = v2 ? V2_TODAY[personParam()] || V2_TODAY[V2_PERSONS[0].id] : null

  /* Arrival is per person — each family member checks in for their own visit.
     The screen stays MOUNTED when ?p= changes, so the state must be re-derived
     on key change (React's "adjust state during render" pattern) — a useState
     initializer alone would leak one person's check-in onto the next. */
  const arrivalKey = v2 ? personParam() || V2_PERSONS[0].id : 'v1'
  const [arrival, setArrival] = useState({ key: arrivalKey, at: arrivedAtFor(arrivalKey) })
  if (arrival.key !== arrivalKey) setArrival({ key: arrivalKey, at: arrivedAtFor(arrivalKey) })
  const arrivedAt = arrival.key === arrivalKey ? arrival.at : arrivedAtFor(arrivalKey)
  const checkIn = () => {
    const at = nowHHMM()
    setArrived(arrivalKey, at)
    setArrival({ key: arrivalKey, at })
  }

  /* Cabinet only — the hero above already carries the address, so repeating it
     here would just be noise. */
  const cabinet = today ? today.place.split(' · ').slice(1).join(' · ') : CLINIC.cabinet
  const num = today ? today.queue : QUEUE.number
  const line1 = today ? today.proc : `${BOOKING.specialty} · ${BOOKING.doctor}`
  const line2 = today ? `${today.place} · ${today.time}` : `${CLINIC.cabinet} · ${BOOKING.timeShort}`

  return (
    <>
      <div className="mga-hdr">
        {/* V2: the ticket "belongs" to the კურაციო tab, so back returns there. */}
        <button className="mga-iconbtn" aria-label="უკან" onClick={() => go(v2 ? 'curatio' : 'health')}>
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

        {/* #5 — arrival check-in: action before wayfinding, see header note. */}
        {arrivedAt === null ? (
          <section className="mga-card" aria-label={M.ticket.arriveTitle}>
            <div className="mga-irow" style={{ padding: 0 }}>
              <span className="mga-itile" style={{ background: 'var(--mga-pink-soft)', color: 'var(--mga-pink-fg)' }}>
                <Icon name="map-pin" size={17} />
              </span>
              <div className="mga-meta" style={{ flex: 1 }}>
                <div className="mga-meta__val">{M.ticket.arriveTitle}</div>
                <div className="mga-meta__lbl">{M.ticket.arriveHint}</div>
              </div>
            </div>
            <button className="mga-btn mga-btn--primary mga-btn--lg mga-btn--block mga-arr__cta" onClick={checkIn}>
              {M.ticket.arriveCta}
            </button>
            <div className="mga-arr__note">
              <Icon name="bell" size={12} />
              {M.ticket.arriveGeo}
            </div>
          </section>
        ) : (
          <section className="mga-card mga-arr--done" aria-label={M.ticket.arrivedTitle}>
            <div className="mga-irow" style={{ padding: 0 }}>
              <span className="mga-itile mga-arr__ico--ok">
                <Icon name="check" size={17} />
              </span>
              <div className="mga-meta" style={{ flex: 1 }}>
                <div className="mga-meta__val">{M.ticket.arrivedTitle}</div>
                <div className="mga-meta__lbl">{M.ticket.arrivedAt(arrivedAt)}</div>
              </div>
              <span className="mga-badge mga-badge--green">{M.ticket.arrivedBadge}</span>
            </div>
            <div className="mga-arr__next">{M.ticket.arrivedNext(cabinet)}</div>
          </section>
        )}

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
        </div>

      </div>
    </>
  )
}
