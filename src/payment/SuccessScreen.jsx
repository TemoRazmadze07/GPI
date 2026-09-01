import Icon from '../lib/Icon.jsx'
import { Button } from '../components/Button.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import { P } from './strings.js'
import { getPolicy, getCards, getVisaTier, visaPoints, NEW_CARD, fmt, hashQuery } from './data.js'

/* SuccessScreen — the payment receipt. The auto-pay activation is stated
   EXPLICITLY here (info alert): whatever the final enrollment mechanics turn
   out to be, the user must leave this screen knowing a recurring charge now
   exists. Method label resolves from the ?m= hash param: wallet ids, 'new'
   (the bank-stub card), or a saved-card id. */
const WALLET_LABELS = { apple: 'Apple Pay', google: 'Google Pay' }

/* Static Georgian short months — Intl('ka-GE') silently falls back to English
   month names in some Chrome builds, and the locked date convention is
   `D MMM YYYY` in the surface's own language. */
const KA_MONTHS = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ']

/* Did the payment actually run on a Visa? Returns true / false / null, and the
   null matters: a wallet token can wrap any network, so claiming the campaign
   applied would be a guess. Each case gets its own honest message. */
function paidWithVisa(m) {
  if (WALLET_LABELS[m]) return null
  if (m === 'new') return NEW_CARD.brand === 'visa'
  const card = getCards().find((c) => c.id === m)
  return card ? card.brand === 'visa' : null
}

function methodLabel(m) {
  if (WALLET_LABELS[m]) return WALLET_LABELS[m]
  if (m === 'new') return P.done.newCardMethod
  const card = getCards().find((c) => c.id === m)
  if (card) return `${card.brand === 'visa' ? 'Visa' : 'Mastercard'} •••• ${card.last4}`
  return '—'
}

export default function SuccessScreen() {
  const m = hashQuery().get('m') || ''
  const POLICY = getPolicy()
  /* Campaign settlement: a tier chosen on the payment screen is a promise the
     receipt must answer. Points recompute from the SAME rate + amount the
     banner showed — one source of truth (visaPoints), no stored copy to drift. */
  const visaTier = getVisaTier()
  const optedIn = visaTier !== 'other'
  const pts = visaPoints(visaTier, POLICY.due)
  const onVisa = paidWithVisa(m)
  const now = new Date()
  const today = `${now.getDate()} ${KA_MONTHS[now.getMonth()]} ${now.getFullYear()}`

  return (
    <div className="pay-done">
      <div className="pay-done__icon" aria-hidden="true">
        <Icon name="check" size={28} />
      </div>
      <h1 className="pay-done__title">{P.done.title}</h1>
      <dl className="pay-done__rows">
        <div>
          <dt>{P.done.amount}</dt>
          <dd className="pay-num">{fmt(POLICY.due)}</dd>
        </div>
        <div>
          <dt>{P.done.policy}</dt>
          <dd>
            {POLICY.name} · {POLICY.number}
          </dd>
        </div>
        <div>
          <dt>{P.done.method}</dt>
          <dd>{methodLabel(m)}</dd>
        </div>
        <div>
          <dt>{P.done.date}</dt>
          <dd>{today}</dd>
        </div>
      </dl>
      <InlineAlert tone="info" title={P.done.autopayTitle}>
        {P.done.autopayBody}
      </InlineAlert>

      {/* Settles the campaign opt-in taken on the payment screen. Only shown to
          people who actually opted in — nobody else has a promise outstanding. */}
      {optedIn && onVisa === true && (
        <InlineAlert tone="success" title={P.done.visaOkTitle}>
          {P.done.visaOkBody(pts)}
        </InlineAlert>
      )}
      {optedIn && onVisa === false && (
        <InlineAlert tone="warning" title={P.done.visaMissTitle}>
          {P.done.visaMissBody}
        </InlineAlert>
      )}
      {optedIn && onVisa === null && (
        <InlineAlert tone="info" title={P.done.visaWalletTitle}>
          {P.done.visaWalletBody}
        </InlineAlert>
      )}
      <p className="pay-done__receipt">{P.done.receipt}</p>
      <Button
        size="lg"
        className="pay-block"
        onClick={() => {
          window.location.hash = '#/pay'
        }}
      >
        {P.done.cta}
      </Button>
    </div>
  )
}
