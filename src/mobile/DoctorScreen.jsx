/* A4 — personal doctor detail (F-03: photo, name, spec, Online badge, next
   visit + history-transfer CTA). V2 only, reached from the dash doctor card's
   „სრული ინფო". Scope filter applied (Curatio_MVP1_Feature_Spec_v1):
     KEPT — profile header, basic-info grid, next visit, WhatsApp direct
       contact (named in the F-03 solution narrative), booking CTA (dead end
       until F-04), history-transfer entry.
     CUT (do not re-add without the user) — in-app ჩატი, „დატოვე შეტყობინება"
       (both = messaging, MVP2), „სატელ. კონსულტაცია" (absent from the spec).
   The transfer action moves medical history → history-class data, so it sits
   behind the OTP gate: locked = lock glyph + sheet on tap; unlocked = dead
   end until A5 (transfer screen) exists. */

import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { DOCTOR } from './data.js'
import { go } from './nav.js'
import { useOtpGate } from './otp.jsx'

const noop = () => {}

export default function DoctorScreen() {
  const { unlocked, request, gate } = useOtpGate()

  return (
    <>
      <div className="mga-hdr">
        <button className="mga-back" aria-label="უკან" onClick={() => go('curatio')}>
          <Icon name="chevron-left" size={16} />
        </button>
        <h1 className="mga-hdr__title">{M.doc.title}</h1>
      </div>

      <div className="mga-body">
        <div className="mga-card">
          <div className="mga-irow" style={{ padding: 0 }}>
            <span className="mga-doc__ava mga-docd__ava" aria-hidden="true">{DOCTOR.initial}</span>
            <div className="mga-meta" style={{ flex: 1 }}>
              <div className="mga-docd__name">{DOCTOR.name}</div>
              <div className="mga-meta__lbl">{DOCTOR.role}</div>
              <div className="mga-docd__online">● {M.doc.onlineNow}</div>
            </div>
          </div>
        </div>

        <div className="mga-card">
          <div className="mga-meta__lbl" style={{ marginBottom: 8 }}>{M.doc.basicInfo}</div>
          <div className="mga-docd__grid">
            <div className="mga-docd__cell">
              <div className="mga-docd__lbl">{M.doc.clinic}</div>
              <div className="mga-docd__val">{DOCTOR.clinic}</div>
            </div>
            <div className="mga-docd__cell">
              <div className="mga-docd__lbl">{M.doc.cabinet}</div>
              <div className="mga-docd__val">{DOCTOR.cabinet}</div>
            </div>
            <div className="mga-docd__cell">
              <div className="mga-docd__lbl">{M.doc.workDays}</div>
              <div className="mga-docd__val">{DOCTOR.workDays}</div>
            </div>
            <div className="mga-docd__cell">
              <div className="mga-docd__lbl">{M.doc.workHours}</div>
              <div className="mga-docd__val">{DOCTOR.workHours}</div>
            </div>
          </div>
          <div className="mga-docd__cell mga-docd__cell--wide">
            <span className="mga-docd__lbl">{M.doc.nextVisit}</span>
            <span className="mga-docd__val">{DOCTOR.nextVisit}</span>
          </div>
        </div>

        <div className="mga-card">
          <div className="mga-meta__lbl" style={{ marginBottom: 10 }}>{M.doc.contact}</div>
          <button className="mga-docd__act mga-docd__act--wa" onClick={noop}>
            <span className="mga-docd__actico">
              <Icon name="message-circle" size={17} />
            </span>
            <span className="mga-docd__actmeta">
              <span className="mga-docd__acttitle">{M.doc.whatsapp}</span>
              <span className="mga-docd__acthint">{M.doc.whatsappHint}</span>
            </span>
          </button>
          <button className="mga-docd__act" onClick={noop}>
            <span className="mga-docd__actico">
              <Icon name="calendar" size={17} />
            </span>
            <span className="mga-docd__actmeta">
              <span className="mga-docd__acttitle">{M.doc.bookVisit}</span>
              <span className="mga-docd__acthint">{DOCTOR.nextVisit}</span>
            </span>
          </button>
        </div>

        <div className="mga-card">
          <div className="mga-meta__lbl" style={{ marginBottom: 6 }}>{M.doc.transferTitle}</div>
          <p className="mga-docd__body">{M.doc.transferBody}</p>
          <button className="mga-obtn" style={{ width: '100%' }} onClick={() => (unlocked ? go('transfer') : request())}>
            {M.doc.transferCta}
            {!unlocked && <Icon name="lock" size={12} />}
          </button>
        </div>
      </div>

      {gate}
    </>
  )
}
