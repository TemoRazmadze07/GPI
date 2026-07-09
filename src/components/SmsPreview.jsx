import Modal from './Modal.jsx'
import { ka } from '../i18n/strings.js'

/* SmsPreview — RESEARCH ARTIFACT, prototype-only (not a design-system component).
   Replicates GPI's CURRENT-STATE booking SMS (real screenshot, 2026-06-17). The
   live SMS is written in TRANSLITERATED Georgian (Latin letters); per the user we
   render the same words in proper Georgian script. Copy stays faithful — the study
   question is whether the message is understood as-is, not a rewrite. Only the
   booking data (doctor, date, time, clinic address) is dynamic.
   The dark phone-thread chrome mimics a native Messages app — external surface,
   intentionally NOT GPI tokens. */

const pad2 = (n) => String(n).padStart(2, '0')
const fmtDMY = (iso) => {
  const d = new Date(iso + 'T00:00:00')
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`
}
const startTime = (slot) => (slot.match(/\d{1,2}:\d{2}/) || ['15:00'])[0]

/* Build the SMS body from the booking, mirroring the live template:
   "მოგესალმებით, ვიზიტი ექიმთან {doctor} დაჯავშნილია {dd.mm.yyyy}, {time} საათზე.
    შემოსასვლელი {clinic address}." (entrance line dropped for remote visits). */
function smsBody(r) {
  const s = ka.wizard.success.sms
  const head = `${s.hello} ${r.clinic.isPhone ? s.leadRemote : s.lead} ${r.doctor.name} ${s.booked} ${fmtDMY(r.dateKey)}, ${startTime(r.time)} ${s.at}`
  return r.clinic.isPhone ? head : `${head} ${s.entrance} ${r.clinic.address}.`
}

export default function SmsPreview({ bookings, onClose }) {
  const s = ka.wizard.success.sms
  return (
    <Modal title={s.modalTitle} onClose={onClose} className="gpi-modal--sms">
      <p className="gpi-sms__hint">{s.hint}</p>
      <div className="gpi-phone">
        <div className="gpi-phone__hd">GPI</div>
        <div className="gpi-phone__thread">
          <div className="gpi-phone__ts">{s.received}</div>
          {bookings.map((r) => (
            <div className="gpi-phone__bubble" key={r.id}>{smsBody(r)}</div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
