/* Electronic queue ticket (F-01) — opened from ბილეთის ნახვა on the health home
   or (in production) the visit-day SMS deep link. Live Qmatic stats, clinic info
   with map entry, and the "remind me 1 patient earlier" opt-in toggle.
   Remote payment is deliberately absent — out of MVP1 scope per the spec. */

import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { BOOKING, QUEUE, CLINIC } from './data.js'
import { go } from './nav.js'

export default function TicketScreen() {
  const [remind, setRemind] = useState(true)

  return (
    <>
      <div className="mga-hdr">
        <button className="mga-back" aria-label="უკან" onClick={() => go('health')}>
          <Icon name="chevron-left" size={16} />
        </button>
        <h1 className="mga-hdr__title">{M.ticket.title}</h1>
      </div>
      <div className="mga-body">
        <div className="mga-card mga-thero">
          <div className="mga-meta__lbl">{M.ticket.yourTicket}</div>
          <div className="mga-thero__num">{QUEUE.number}</div>
          <div style={{ fontSize: 12, color: 'var(--mga-muted)' }}>
            {BOOKING.specialty} · {BOOKING.doctor}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>
            {CLINIC.cabinet} · {BOOKING.timeShort}
          </div>
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

        <div className="mga-card mga-irow" style={{ padding: 12 }}>
          <span className="mga-itile" style={{ background: 'var(--mga-pink-soft)', color: 'var(--mga-pink-fg)' }}>
            <Icon name="bell" size={17} />
          </span>
          <div className="mga-meta" style={{ flex: 1 }}>
            <div className="mga-meta__val" style={{ fontSize: 12.5 }}>{M.ticket.remindTitle}</div>
            <div className="mga-meta__lbl">{M.ticket.remindSub}</div>
          </div>
          <button
            className={'mga-swbtn' + (remind ? ' mga-swbtn--on' : '')}
            role="switch"
            aria-checked={remind}
            aria-label={M.ticket.remindTitle}
            onClick={() => setRemind(!remind)}
          />
        </div>
      </div>
    </>
  )
}
