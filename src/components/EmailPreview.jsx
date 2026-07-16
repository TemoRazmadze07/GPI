import { useState } from 'react'
import { ASSETS } from '../lib/assets.js'
import Modal from './Modal.jsx'
import Icon from '../lib/Icon.jsx'
import { ka } from '../i18n/strings.js'

/* EmailPreview — RESEARCH ARTIFACT, prototype-only (not a design-system component).
   Replicates GPI's CURRENT-STATE booking-confirmation email (real Gmail screenshot,
   2026-07-09) so usability-test participants can judge whether the message is
   understandable/informative AS IT IS TODAY. Content is deliberately faithful to
   the live email — do NOT "improve" the copy here; only the booking data (patient,
   doctor, date, time, clinic) is dynamic, filled from the just-confirmed rows.
   The Gmail chrome (sender row, calendar prompt, event card) is presentation
   scaffolding mimicking an external surface — intentionally NOT GPI tokens. */

const pad2 = (n) => String(n).padStart(2, '0')
const fmtDMY = (iso) => {
  const d = new Date(iso + 'T00:00:00')
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`
}
/* "15:00" → Gmail-style "3pm – 3:20pm" (visits are 20-minute slots). */
const fmt12 = (h, m) => {
  const ap = h >= 12 ? 'pm' : 'am'
  const hh = h % 12 || 12
  return m ? `${hh}:${pad2(m)}${ap}` : `${hh}${ap}`
}
const gmailWhen = (iso, slot) => {
  const d = new Date(iso + 'T00:00:00')
  const day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  // Slots may be a single time ("15:00") or a range ("11:30 - 12:00") — take
  // the range's own end when present, else assume the 20-minute visit length.
  const times = [...slot.matchAll(/(\d{1,2}):(\d{2})/g)].map((m) => [+m[1], +m[2]])
  const [h, m] = times[0]
  const end = times[1] ? times[1][0] * 60 + times[1][1] : h * 60 + m + 20
  return `${day} ${fmt12(h, m)} – ${fmt12(Math.floor(end / 60), end % 60)} (GMT+4)`
}

export default function EmailPreview({ bookings, onClose }) {
  const [idx, setIdx] = useState(0)
  const r = bookings[idx]
  const em = ka.wizard.success.email
  const d = new Date(r.dateKey + 'T00:00:00')
  const remote = r.clinic.isPhone

  return (
    <Modal title={em.modalTitle} onClose={onClose} className="gpi-modal--email">
      {bookings.length > 1 && (
        <div className="gpi-email__tabs" role="tablist">
          {bookings.map((b, i) => (
            <button key={b.id} role="tab" aria-selected={i === idx}
              className={`gpi-email__tab${i === idx ? ' is-active' : ''}`} onClick={() => setIdx(i)}>
              {em.letter} {i + 1} · {b.doctor.name.split(' ')[0]}
            </button>
          ))}
        </div>
      )}
      <p className="gpi-email__hint">{em.hint}</p>

      {/* ── Gmail chrome (external surface — scaffolding, EN like real Gmail) ── */}
      <div className="gpi-email">
        <div className="gpi-email__subject">
          {em.subject} <span className="gpi-email__label">Inbox</span>
        </div>
        <div className="gpi-email__sender">
          <span className="gpi-email__avatar" aria-hidden="true">G</span>
          <div>
            <div><strong>GPI Holding</strong> <span className="gpi-email__addr">&lt;noreply@gpih.ge&gt;</span></div>
            <div className="gpi-email__addr">to me</div>
          </div>
          <span className="gpi-email__date">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, 6:52 PM</span>
        </div>

        <div className="gpi-email__calbar">
          <div><strong>This event isn't in your calendar yet</strong> You haven't interacted with noreply@gpih.ge before. Do you want to automatically add this and future invitations from them to your calendar?</div>
          <div className="gpi-email__calbtns">
            <button type="button">Add to calendar</button>
            <button type="button">Report spam</button>
          </div>
        </div>

        <div className="gpi-email__event">
          <div className="gpi-email__tile">
            <span className="gpi-email__tile-mo">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
            <span className="gpi-email__tile-day">{d.getDate()}</span>
            <span className="gpi-email__tile-wk">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
          </div>
          <div className="gpi-email__event-meta">
            <div className="gpi-email__event-title">{em.subject}</div>
            <a className="gpi-email__gcal" href="#" onClick={(e) => e.preventDefault()}>View on Google Calendar</a>
            <div className="gpi-email__event-row"><span>When</span>{gmailWhen(r.dateKey, r.time)}</div>
            {!remote && <div className="gpi-email__event-row"><span>Where</span>{r.clinic.address}</div>}
            <div className="gpi-email__event-row"><span>Who</span>{remote ? r.doctor.name : r.clinic.name} *</div>
          </div>
        </div>

        {/* ── The GPI email body (faithful to the live template) ── */}
        <div className="gpi-email__hero">
          <img src={ASSETS.logo} alt="GPI" />
        </div>
        <div className="gpi-email__body">
          {/* Deviation from the live template (which says a bare "გამარჯობა,"):
              the insured's name is injected so family bookings show WHOSE visit
              it is — a deliberate research probe, easy to strip back. */}
          <p><strong>{em.hello} {r.patient.name},</strong></p>
          <p>{remote ? em.introRemote : em.intro}</p>
          <p className="gpi-email__h">{em.detailsTitle}</p>
          <span className="gpi-email__chip">{em.specialty}: {r.doctor.specialty}</span>
          <div className="gpi-email__rows">
            <p>{em.doctor}: <strong>{r.doctor.name}</strong></p>
            <p>{em.date}: <strong>{fmtDMY(r.dateKey)}</strong></p>
            <p>{em.time}: <strong>{r.time}</strong></p>
            {!remote && <p>{em.clinicName}: <strong>{r.clinic.name}</strong></p>}
            {!remote && <p>{em.clinicAddress}: <strong>{r.clinic.address}</strong></p>}
          </div>
        </div>
        <div className="gpi-email__footer">
          <img src={ASSETS.logo} alt="" aria-hidden="true" />
          <a href="#" onClick={(e) => e.preventDefault()}>www.gpih.ge</a>
          <span>/ 032 2 505 111</span>
        </div>

        <div className="gpi-email__attach">
          <div className="gpi-email__attach-hd"><strong>One attachment</strong> · Scanned by Gmail</div>
          <div className="gpi-email__attach-row">
            <Icon name="file-text" size={16} />
            <span>calendar1.ics</span>
            <a href="#" onClick={(e) => e.preventDefault()}>Download</a>
          </div>
        </div>
      </div>
    </Modal>
  )
}
