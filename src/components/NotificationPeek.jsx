import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import EmailPreview from './EmailPreview.jsx'
import SmsPreview from './SmsPreview.jsx'
import { t as strings } from '../i18n/index.js'

/* NotificationPeek — RESEARCH ARTIFACT, prototype-only. A floating launcher pinned
   bottom-right of the booking success page that opens the CURRENT-STATE email / SMS
   the insured would receive, for usability-test participants to react to.
   Deliberately styled OFF-system (an unbranded violet, not a GPI token) so it reads
   as a demo/research overlay sitting ON TOP of the product — NOT part of the UI.
   Kept out of the page's main content for exactly that reason. */
export default function NotificationPeek({ bookings }) {
  const [open, setOpen] = useState(null) // 'email' | 'sms' | null
  const t = strings.wizard.success.peek

  return (
    <>
      <div className="gpi-peek" role="group" aria-label={t.aria}>
        <span className="gpi-peek__tag">{t.tag}</span>
        <button type="button" className="gpi-peek__btn" onClick={() => setOpen('email')}>
          <Icon name="mail" size={20} />
          {t.email}
        </button>
        <button type="button" className="gpi-peek__btn" onClick={() => setOpen('sms')}>
          <Icon name="smartphone" size={20} />
          {t.sms}
        </button>
      </div>
      {open === 'email' && <EmailPreview bookings={bookings} onClose={() => setOpen(null)} />}
      {open === 'sms' && <SmsPreview bookings={bookings} onClose={() => setOpen(null)} />}
    </>
  )
}
