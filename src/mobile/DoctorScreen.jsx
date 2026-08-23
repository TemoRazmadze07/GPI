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
import { usePurchaseGate, GateLock } from './purchase.jsx'

const noop = () => {}

export default function DoctorScreen() {
  const { unlocked, request, gate } = useOtpGate()
  /* #14 — booking and the phone consult are insurance-funded; the profile itself is not. */
  const { gated, guard, sheet } = usePurchaseGate()
  /* #1 (2026-08-18): a doctor picked via docselect overrides the default;
     cabinet/hours keep DOCTOR values, nextVisit is honestly empty. */
  const doc = { ...DOCTOR, ...(getPickedDoctor() || {}) }

  return (
    <>
      <div className="mga-hdr">
        <button className="mga-iconbtn" aria-label="უკან" onClick={() => go('curatio')}>
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
              {ONLINE_STATUS_ENABLED && <div className="mga-docd__online">{M.doc.onlineNow}</div>}
            </div>
          </div>
          {/* #3 — the two bookings sit in the doctor's OWN section (user, 2026-08-18),
              not in a block of their own: they act on THIS doctor, so they belong
              under the identity. Same pair, same order, same styling as the dash card. */}
          <div className="mga-doc__btns mga-doc__btns--stack mga-doc__btns--sep">
            <button className={'mga-btn mga-btn--secondary-brand mga-btn--md mga-btn--block' + (gated ? ' mga-btn--locked' : '')} onClick={guard(noop)}>
              {M.doc.bookClinic}
              <GateLock gated={gated} />
            </button>
            <button className={'mga-btn mga-btn--secondary mga-btn--md mga-btn--block' + (gated ? ' mga-btn--locked' : '')} onClick={guard(noop)}>
              {M.doc.bookPhone}
              <GateLock gated={gated} />
            </button>
          </div>
        </div>

        <div className="mga-card">
          <div className="mga-meta__lbl mga-cardlbl">{M.doc.basicInfo}</div>
          {/* One table, not a 2×2 grid (user, 2026-08-20): every fact reads
              label-left / value-right, and შემდეგი ვიზიტი stops being a special
              full-width row — it is just the last row. */}
          <div className="mga-kv">
            <div className="mga-kv__row">
              <span className="mga-kv__lbl">{M.doc.clinic}</span>
              <span className="mga-kv__val">{doc.clinic}</span>
            </div>
            {/* „—" for anything unknown: a blank value beside a label reads as a
                broken screen, and these are legitimately unknown for a just-picked doctor. */}
            <div className="mga-kv__row">
              <span className="mga-kv__lbl">{M.doc.cabinet}</span>
              <span className="mga-kv__val">{doc.cabinet || '—'}</span>
            </div>
            <div className="mga-kv__row">
              <span className="mga-kv__lbl">{M.doc.workDays}</span>
              <span className="mga-kv__val">{doc.workDays || '—'}</span>
            </div>
            <div className="mga-kv__row">
              <span className="mga-kv__lbl">{M.doc.workHours}</span>
              <span className="mga-kv__val">{doc.workHours || '—'}</span>
            </div>
            <div className="mga-kv__row">
              <span className="mga-kv__lbl">{M.doc.nextVisit}</span>
              <span className="mga-kv__val">{doc.nextVisit || '—'}</span>
            </div>
          </div>
        </div>

        <div className="mga-card">
          <div className="mga-meta__lbl mga-cardlbl">{M.doc.transferTitle}</div>
          <p className="mga-docd__body">{M.doc.transferBody}</p>
          <button className="mga-btn mga-btn--secondary mga-btn--md mga-btn--block" onClick={() => (unlocked ? go('transfer') : request())}>
            {M.doc.transferCta}
            {!unlocked && <Icon name="lock" size={12} />}
          </button>
        </div>
      </div>

      {gate}
      {sheet}
    </>
  )
}
