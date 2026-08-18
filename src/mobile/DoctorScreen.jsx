/* A4 — personal doctor detail (F-03: photo, name, spec, next visit +
   history-transfer CTA). The Online badge is MVP2 — see ONLINE_STATUS_ENABLED
   (#4, 2026-08-18); სამუშაო დღეები/საათები below carry availability honestly. V2 only, reached from the dash doctor card's
   „სრული ინფო". Scope filter applied (Curatio_MVP1_Feature_Spec_v1):
     KEPT — profile header, basic-info grid, next visit, TWO booking entries
       (#3, 2026-08-18 — clinic visit + phone consultation), history transfer.
     CUT (do not re-add without the user) — WhatsApp direct contact (dropped by
       the stakeholder in #3), in-app ჩატი, „დატოვე შეტყობინება" (messaging, MVP2).
   #3 reverses the earlier spec-driven cut of „სატელ. კონსულტაცია": phone consult
   is IN scope. Both CTAs are the SAME booking flow with the doctor preselected —
   only its „ვიზიტის ტიპი" radio differs (inclinic | remote), so nothing new gets
   built here. Dead ends until that flow exists in the prototype.
   The transfer action moves medical history → history-class data, so it sits
   behind the OTP gate: locked = lock glyph + sheet on tap; unlocked = dead
   end until A5 (transfer screen) exists. */

import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { DOCTOR, getPickedDoctor, ONLINE_STATUS_ENABLED } from './data.js'
import { go } from './nav.js'
import { useOtpGate } from './otp.jsx'

const noop = () => {}

export default function DoctorScreen() {
  const { unlocked, request, gate } = useOtpGate()
  /* #1 (2026-08-18): a doctor picked via docselect overrides the default;
     cabinet/hours keep DOCTOR values, nextVisit is honestly empty. */
  const doc = { ...DOCTOR, ...(getPickedDoctor() || {}) }

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
            <span className="mga-doc__ava mga-docd__ava" aria-hidden="true">
              {doc.photo ? <img src={doc.photo} alt="" /> : doc.initial}
            </span>
            <div className="mga-meta" style={{ flex: 1 }}>
              <div className="mga-docd__name">{doc.name}</div>
              <div className="mga-meta__lbl">{doc.role}</div>
              {ONLINE_STATUS_ENABLED && <div className="mga-docd__online">● {M.doc.onlineNow}</div>}
            </div>
          </div>
          {/* #3 — the two bookings sit in the doctor's OWN section (user, 2026-08-18),
              not in a block of their own: they act on THIS doctor, so they belong
              under the identity. Same pair, same order, same styling as the dash card. */}
          <div className="mga-doc__btns mga-doc__btns--stack mga-doc__btns--sep">
            <button className="mga-obtn mga-obtn--pink" onClick={noop}>
              {M.doc.bookClinic}
            </button>
            <button className="mga-obtn" onClick={noop}>
              {M.doc.bookPhone}
            </button>
          </div>
        </div>

        <div className="mga-card">
          <div className="mga-meta__lbl" style={{ marginBottom: 8 }}>{M.doc.basicInfo}</div>
          <div className="mga-docd__grid">
            <div className="mga-docd__cell">
              <div className="mga-docd__lbl">{M.doc.clinic}</div>
              <div className="mga-docd__val">{doc.clinic}</div>
            </div>
            <div className="mga-docd__cell">
              <div className="mga-docd__lbl">{M.doc.cabinet}</div>
              <div className="mga-docd__val">{doc.cabinet}</div>
            </div>
            <div className="mga-docd__cell">
              <div className="mga-docd__lbl">{M.doc.workDays}</div>
              <div className="mga-docd__val">{doc.workDays}</div>
            </div>
            <div className="mga-docd__cell">
              <div className="mga-docd__lbl">{M.doc.workHours}</div>
              <div className="mga-docd__val">{doc.workHours}</div>
            </div>
          </div>
          <div className="mga-docd__cell mga-docd__cell--wide">
            <span className="mga-docd__lbl">{M.doc.nextVisit}</span>
            <span className="mga-docd__val">{doc.nextVisit || '—'}</span>
          </div>
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
