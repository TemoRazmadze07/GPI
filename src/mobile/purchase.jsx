/* #14 — UNINSURED MODE + purchase triggers (stakeholder comments, 2026-08-18).

   Business-confirmed premise: the Curatio module also serves people WITHOUT GPI
   health cover, as a standalone health record. So the module splits in two:

     · a person's OWN DATA is never gated — medical history, analyses, uploads,
       prescriptions, the personal-doctor card. It is theirs; withholding it to sell
       a policy would be both hostile and wrong.
     · INSURANCE-FUNDED ACTIONS are — booking a Curatio appointment, the phone
       consultation, renewal-by-visit, preventive screenings.

   The gate is honest rather than blank: the CTA stays visible and carries the lock
   glyph the OTP gate already uses in this module, and tapping it explains what cover
   pays for instead of failing silently. Same shape as useOtpGate() on purpose —
   `guard(fn)` runs the action when insured and opens the sheet when not.

   OPEN PRODUCT QUESTIONS (do not guess in copy):
     · can an uninsured user book and pay out of pocket? If yes this becomes a
       PRICE + a nudge, not a gate, and the sheet needs a second action.
     · what does health cover actually pay for at Curatio, in what words, and does
       the phone consultation carry a fee? The bullet list below is a placeholder
       shaped from the MVP1 spec, NOT confirmed product copy. */

import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { isInsured } from './nav.js'

export function usePurchaseGate() {
  const [open, setOpen] = useState(false)
  const gated = !isInsured()

  /* Wrap any insured-only action: insured → runs it, uninsured → explains. */
  const guard = (fn) => () => (gated ? setOpen(true) : fn())

  const sheet = open ? <PurchaseSheet onClose={() => setOpen(false)} /> : null
  return { gated, guard, sheet }
}

/* The lock that marks a gated CTA — same glyph the OTP gate uses, so „you cannot do
   this yet" reads the same way throughout the module. */
export function GateLock({ gated }) {
  return gated ? <Icon name="lock" size={12} /> : null
}

export function PurchaseSheet({ onClose }) {
  return (
    <div className="mga-sheetwrap" role="dialog" aria-modal="true" aria-label={M.ins.sheetTitle}>
      <button className="mga-sheetwrap__scrim" aria-label={M.otp.close} onClick={onClose} />
      <div className="mga-sheet">
        <div className="mga-sheet__grab" aria-hidden="true" />
        <div className="mga-sheet__head">
          <h2 className="mga-sheet__title">{M.ins.sheetTitle}</h2>
        </div>
        <p className="mga-docd__body">{M.ins.sheetBody}</p>
        <ul className="mga-ins__list">
          {M.ins.covers.map((c) => (
            <li key={c}>
              <Icon name="check" size={13} /> {c}
            </li>
          ))}
        </ul>
        <div className="mga-trf__btns mga-trf__btns--stack">
          {/* Dead end: the purchase flow is another platform's (Rule 5). */}
          <button className="mga-cta">{M.ins.cta}</button>
          <button className="mga-obtn" onClick={onClose}>
            {M.ins.later}
          </button>
        </div>
      </div>
    </div>
  )
}

/* Dashboard-level banner: states the situation ONCE at the top, so every locked CTA
   below reads as a consequence the user already understands. */
export function UninsuredBanner({ onOpen }) {
  return (
    <button className="mga-ins__banner" onClick={onOpen}>
      <span className="mga-itile">
        <Icon name="shield-check" size={17} />
      </span>
      <span className="mga-ins__bnrtxt">
        <span className="mga-meta__val" style={{ fontSize: 12.5 }}>{M.ins.bannerTitle}</span>
        <span className="mga-meta__lbl">{M.ins.bannerBody}</span>
      </span>
      <span className="mga-prow__chv">
        <Icon name="chevron-right" size={16} />
      </span>
    </button>
  )
}
