import { useState } from 'react'
import Badge from '../components/Badge.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Card from '../components/Card.jsx'
import Checkbox from '../components/Checkbox.jsx'
import DemoBar from '../components/DemoBar.jsx'
import Field from '../components/Field.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import Modal from '../components/Modal.jsx'
import { Button } from '../components/Button.jsx'
import Icon from '../lib/Icon.jsx'
import { VisaMark } from './marks.jsx'
import { D } from './strings.js'
import { VISA_PAYMENT } from './data.js'

/* VisaBenefitScreenV1 — PARKED at #/dash/visa-benefit?v=1 (2026-09-08, later the same day).
   Receipt-first version; superseded by VisaBenefitScreen (v2: tracker → one-line
   strip → one dominant claim card) after the user found the form "hidden
   underneath the page". Kept only for side-by-side comparison — retire when v2 is
   accepted.

   Original notes:

   Where a car-insurance purchase lands after the card payment. Three things,
   top-down: the payment went through (receipt) → this card qualifies for the
   Visa campaign (offer) → two things the PARTNER needs before it can activate
   the benefit (claim): a wallet number from the partner's app, and consent to
   check the customer's personal number.

   Eligibility is settled by the transaction itself, never by anything the
   customer declared on the payment screen (the 2026-09-08 removal of the tier
   radios): the server knows the paid card's network + tier, so this page is
   the honest place to settle the campaign. A payer whose card does NOT qualify
   gets the same page minus the offer + claim — one route, two states, so the
   receipt never depends on the campaign.

   Everything on screen is an existing component: Card, Badge, InlineAlert,
   Field + .gpi-input, Checkbox (boxed), Modal, Button, Breadcrumbs, Icon. The
   only new pieces are composition (.dash-visa*) and the partner-side copy.

   ⚠️ DRAFTS awaiting GPI/partner input (see project_visa_benefit_landing.md):
   the consent wording (legal), the wallet-number format (validation is
   required-only), the modal's how-to steps, and the "later" path — the
   button returns home and promises nothing, because whether a customer can
   come back to claim is undecided. */

const go = (hash) => () => {
  window.location.hash = hash
}

function ReceiptRows({ pay }) {
  const V = D.visa
  return (
    <dl className="dash-visa__rows">
      <div>
        <dt>{V.success.policy}</dt>
        <dd>
          {pay.policy} · {pay.no}
        </dd>
      </div>
      <div>
        <dt>{V.success.vehicle}</dt>
        <dd>{pay.plate}</dd>
      </div>
      <div>
        <dt>{V.success.amount}</dt>
        <dd>{pay.amount}</dd>
      </div>
      <div>
        <dt>{V.success.method}</dt>
        <dd>{pay.method}</dd>
      </div>
      <div>
        <dt>{V.success.date}</dt>
        <dd>{pay.date}</dd>
      </div>
    </dl>
  )
}

function OfferCard({ pay }) {
  const V = D.visa
  return (
    <Card className="dash-visa__card" aria-labelledby="dash-visa-offer">
      {/* Mark + status badge share a line; the TITLE gets its own (title/badge rule). */}
      <div className="dash-visa__offerhead">
        <VisaMark />
        <Badge color="success" dot>
          {V.offer.badge}
        </Badge>
      </div>
      <h3 className="dash-visa__h3" id="dash-visa-offer">
        {V.offer.title}
      </h3>
      <p className="dash-visa__p">{V.offer.body(pay.tierLabel)}</p>
      <div className="dash-visa__listtitle">{V.offer.listTitle}</div>
      <ul className="dash-visa__benefits">
        <li>
          <Icon name="coins" size={20} />
          <span>{V.offer.points}</span>
          <strong>{V.offer.pointsVal(pay.points)}</strong>
        </li>
        <li>
          <Icon name="droplets" size={20} />
          <span>{V.offer.wash}</span>
        </li>
        <li>
          <Icon name="wrench" size={20} />
          <span>{V.offer.inspection}</span>
        </li>
        <li>
          <Icon name="car" size={20} />
          <span>{V.offer.fuel}</span>
        </li>
      </ul>
      {/* Campaign terms live on gpih.ge — URL not supplied yet, so the link is inert. */}
      <button type="button" className="gpi-link" onClick={() => {}}>
        {V.offer.terms}
        <Icon name="arrow-right" size={14} />
      </button>
    </Card>
  )
}

function ClaimCard({ onDone, onHelp }) {
  const V = D.visa
  const [wallet, setWallet] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState({})

  /* Validate on submit; each control clears its OWN error the moment it is
     edited (form-validation pattern, 2026-07-06) — no stale red. */
  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!wallet.trim()) next.wallet = V.errors.required
    if (!consent) next.consent = V.errors.consent
    setErrors(next)
    if (Object.keys(next).length) return
    onDone(wallet.trim())
  }

  return (
    <Card className="dash-visa__card" aria-labelledby="dash-visa-claim">
      <h3 className="dash-visa__h3" id="dash-visa-claim">
        {V.claim.title}
      </h3>
      <p className="dash-visa__p">{V.claim.intro}</p>
      <form className="dash-visa__form" onSubmit={submit} noValidate>
        <ol className="dash-visa__steps">
          <li className="dash-visa__step">
            <span className="dash-visa__num" aria-hidden="true">
              1
            </span>
            <div className="dash-visa__stepbody">
              <div className="dash-visa__steptitle">{V.claim.step1}</div>
              <Field label={V.claim.walletLabel} required hint={V.claim.walletHint} errorMsg={errors.wallet}>
                <input
                  className={`gpi-input${errors.wallet ? ' is-error' : ''}`}
                  value={wallet}
                  placeholder={V.claim.walletPh}
                  inputMode="numeric"
                  autoComplete="off"
                  aria-label={V.claim.walletLabel}
                  aria-invalid={errors.wallet ? true : undefined}
                  onChange={(e) => {
                    setWallet(e.target.value)
                    if (errors.wallet) setErrors(({ wallet: _w, ...rest }) => rest)
                  }}
                />
              </Field>
              <button type="button" className="gpi-link" onClick={onHelp}>
                <Icon name="info" size={16} />
                {V.claim.howTo}
              </button>
            </div>
          </li>
          <li className="dash-visa__step">
            <span className="dash-visa__num" aria-hidden="true">
              2
            </span>
            <div className="dash-visa__stepbody">
              <div className="dash-visa__steptitle">{V.claim.step2}</div>
              <Checkbox
                boxed
                name="visa-consent"
                checked={consent}
                label={V.claim.consent}
                help={V.claim.consentHelp}
                onChange={(v) => {
                  setConsent(v)
                  if (errors.consent) setErrors(({ consent: _c, ...rest }) => rest)
                }}
              />
              {errors.consent && (
                <span className="gpi-field__hint gpi-field__hint--err" role="alert">
                  {errors.consent}
                </span>
              )}
            </div>
          </li>
        </ol>
        <div className="dash-visa__actions">
          <Button type="submit" size="lg">
            {V.claim.submit}
          </Button>
          <Button type="button" variant="tertiary" size="lg" onClick={go('#/dash')}>
            {V.claim.later}
          </Button>
        </div>
      </form>
    </Card>
  )
}

function DoneCard({ pay, wallet }) {
  const V = D.visa
  return (
    <Card className="dash-visa__card">
      <InlineAlert tone="success" title={V.done.title}>
        {V.done.body}
      </InlineAlert>
      <dl className="dash-visa__rows">
        <div>
          <dt>{V.done.wallet}</dt>
          <dd>{wallet}</dd>
        </div>
        <div>
          <dt>{V.done.benefit}</dt>
          <dd>{pay.tierLabel}</dd>
        </div>
      </dl>
      <div className="dash-visa__actions">
        <Button size="lg" onClick={go('#/dash')}>
          {V.done.home}
        </Button>
      </div>
    </Card>
  )
}

function HelpModal({ onClose }) {
  const V = D.visa
  return (
    <Modal
      title={V.modal.title}
      onClose={onClose}
      closeLabel={V.modal.close}
      footer={
        <Button onClick={onClose}>{V.modal.close}</Button>
      }
    >
      <p className="dash-visa__p">{V.modal.intro}</p>
      <ol className="dash-visa__howto">
        {V.modal.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      {/* Placeholder until the partner's own instructions arrive. */}
      <InlineAlert tone="info">{V.modal.note}</InlineAlert>
    </Modal>
  )
}

export default function VisaBenefitScreenV1() {
  const V = D.visa
  const pay = VISA_PAYMENT
  /* ?eligible=0 deep-links the not-eligible state (flow map + demo bar). */
  const [eligible, setEligible] = useState(() => !/[?&]eligible=0(?:&|$)/.test(window.location.hash))
  const [claimed, setClaimed] = useState(null)
  const [help, setHelp] = useState(false)

  const reset = () => setClaimed(null)

  return (
    <>
      <DemoBar
        actions={[
          {
            label: eligible ? 'not eligible (other card)' : 'eligible (Visa Signature)',
            onClick: () => {
              setEligible((v) => !v)
              reset()
            },
          },
          { label: 'v2', ghost: true, onClick: go('#/dash/visa-benefit') },
          { label: 'reset', ghost: true, onClick: reset },
        ]}
      />

      <header className="dash-pagehead">
        <Breadcrumbs items={[{ label: D.cur.crumbHome, href: '#/dash' }]} current={V.title} label={V.title} />
        <div className="dash-sechead">
          <h2 className="dash-sechead__title">{V.title}</h2>
        </div>
      </header>

      <div className="dash-visa">
        <Card className="dash-visa__card" aria-labelledby="dash-visa-success">
          <div className="dash-visa__hero">
            <span className="dash-visa__icon" aria-hidden="true">
              <Icon name="check" size={28} />
            </span>
            <h3 className="dash-visa__h3" id="dash-visa-success">
              {V.success.title}
            </h3>
          </div>
          <ReceiptRows pay={pay} />
          <p className="dash-visa__note">{V.success.receipt}</p>
          {!eligible && (
            <div className="dash-visa__actions">
              <Button size="lg" onClick={go('#/dash')}>
                {V.done.home}
              </Button>
            </div>
          )}
        </Card>

        {eligible && <OfferCard pay={pay} />}
        {eligible && !claimed && (
          <ClaimCard
            onHelp={() => setHelp(true)}
            onDone={(w) => {
              setClaimed(w)
              window.scrollTo({ top: 0 })
            }}
          />
        )}
        {eligible && claimed && <DoneCard pay={pay} wallet={claimed} />}
      </div>

      {help && <HelpModal onClose={() => setHelp(false)} />}
    </>
  )
}
