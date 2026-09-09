import { useState } from 'react'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import Card from '../components/Card.jsx'
import Checkbox from '../components/Checkbox.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import DemoBar from '../components/DemoBar.jsx'
import Field from '../components/Field.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import Modal from '../components/Modal.jsx'
import { Button } from '../components/Button.jsx'
import Icon from '../lib/Icon.jsx'
import { VisaMark } from './marks.jsx'
import { D } from './strings.js'
import { VISA_PAYMENT } from './data.js'

/* VisaBenefitScreen (v2) — #/dash/visa-benefit.

   Where a car-insurance purchase lands after a card payment that qualifies for
   the Visa campaign. v1 (parked at ?v=1) led with a full receipt and put the
   claim form third; the user's read: "it's a bit hidden underneath the page …
   I might skip this consent form". v2 inverts the weight:

     1. one-line purchase confirmation — a success InlineAlert, no receipt
        table (the full receipt survives only in the not-eligible state, where
        it IS the page).
     2. one dominant card — warning „not active yet", the ONE reward on a single
        row (points OR perks, never both — user 2026-09-08), then the two
        things the partner needs: wallet number + consent, and the CTA.
        No „later" button: a skip affordance beside the form advertises
        skipping, which is the behaviour this page exists to prevent. The
        navigation still lets people leave.

   v2.1 (user, same day: "very noisy"): the numbered steps are gone — the
   warning line IS the instruction („enter the wallet number and give your
   consent"), the field label carries an info trigger (Tooltip on hover/focus,
   the how-to Modal on click), the consent is a plain Checkbox, and the
   purchase strip became the shared CtaBanner — the banner the designs use.

   v2.4 (user, 2026-09-09): the card breathes at 24, the wallet input hugs a
   short-token measure instead of the full 592, and the how-to help left the
   label for a .gpi-link button on the input's right (the „დეტალურად" idiom; an
   outlined Button there read as clunky). The icon-only trigger and its Tooltip
   are gone with it.

   v2.3 (user, 2026-09-09: "hide stepper"): the Stepper tracker is gone too.
   It restated what the banner and the warning already say — paid ✓, eligible ✓,
   one thing left — and a 3-step chrome above a single short form read as a
   longer journey than this is. The page is now banner → card.

   Eligibility and the reward type are settled by the transaction (server-side);
   the demo bar and ?eligible=0 / ?reward=perks only flip the demo data.

   ⚠️ DRAFTS awaiting GPI/partner input (see project_visa_benefit_landing.md):
   consent wording (legal), wallet-number format (validation is required-only),
   the modal's how-to steps, whether the benefit can be claimed later — the
   warning copy is deliberately neutral until that is known. */

const go = (hash) => () => {
  window.location.hash = hash
}
const hashHas = (re) => re.test(window.location.hash)

/* Not-eligible state only: the receipt is the whole page for other cards. */
function ReceiptCard({ pay }) {
  const V = D.visa
  return (
    <Card className="dash-visa__card" aria-labelledby="dash-visa-success">
      <div className="dash-visa__hero">
        <span className="dash-visa__icon" aria-hidden="true">
          <Icon name="check" size={24} />
        </span>
        <h3 className="dash-visa__h3" id="dash-visa-success">
          {V.success.title}
        </h3>
      </div>
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
      <p className="dash-visa__note">{V.success.receipt}</p>
      <div className="dash-visa__actions">
        <Button size="lg" onClick={go('#/dash')}>
          {V.done.home}
        </Button>
      </div>
    </Card>
  )
}

function rewardText(reward, pay) {
  const V = D.visa
  return reward === 'perks' ? V.reward.perks : V.reward.points(pay.points)
}

function RewardRow({ pay, reward }) {
  const V = D.visa
  return (
    <div className="dash-visa__reward">
      <div className="dash-visa__reward-main">
        <VisaMark />
        <span>
          {V.reward.label}: <strong>{rewardText(reward, pay)}</strong>
        </span>
      </div>
      {/* Campaign terms live on gpih.ge — URL not supplied yet, so the link is inert. */}
      <button type="button" className="gpi-link" onClick={() => {}}>
        {V.offer.terms}
        <Icon name="arrow-right" size={14} />
      </button>
    </div>
  )
}

function ClaimForm({ onDone, onHelp }) {
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
    <form className="dash-visa__form" onSubmit={submit} noValidate>
      <Field label={V.claim.walletLabel} required errorMsg={errors.wallet}>
        {/* The help sits BESIDE the input, not on the label, as the same link
            button the reward row uses for „დეტალურად" (user, 2026-09-09: an
            outlined Button here "seems clunky"). It says out loud what the
            icon-only trigger needed a tooltip to say. */}
        <div className="dash-visa__walletrow">
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
          <button type="button" className="gpi-link" onClick={onHelp}>
            <Icon name="info" size={16} />
            {V.claim.howTo}
          </button>
        </div>
      </Field>
      <div className="dash-visa__consent">
        <Checkbox
          name="visa-consent"
          checked={consent}
          label={V.claim.consent}
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
      <div className="dash-visa__actions">
        <Button type="submit" size="lg">
          {V.claim.submit}
        </Button>
        <p className="dash-visa__note">{V.strip.receipt}</p>
      </div>
    </form>
  )
}

function DoneBody({ pay, reward, wallet }) {
  const V = D.visa
  return (
    <>
      <dl className="dash-visa__rows">
        <div>
          <dt>{V.done.wallet}</dt>
          <dd>{wallet}</dd>
        </div>
        <div>
          <dt>{V.done.benefit}</dt>
          <dd>{rewardText(reward, pay)}</dd>
        </div>
      </dl>
      <div className="dash-visa__actions">
        <Button size="lg" onClick={go('#/dash')}>
          {V.done.home}
        </Button>
      </div>
    </>
  )
}

function HelpModal({ onClose }) {
  const V = D.visa
  return (
    <Modal
      title={V.modal.title}
      onClose={onClose}
      closeLabel={V.modal.close}
      footer={<Button onClick={onClose}>{V.modal.close}</Button>}
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

export default function VisaBenefitScreen() {
  const V = D.visa
  const pay = VISA_PAYMENT
  const [eligible, setEligible] = useState(() => !hashHas(/[?&]eligible=0(?:&|$)/))
  const [reward, setReward] = useState(() => (hashHas(/[?&]reward=perks(?:&|$)/) ? 'perks' : 'points'))
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
          {
            label: reward === 'points' ? 'reward: perks' : 'reward: points',
            onClick: () => setReward((r) => (r === 'points' ? 'perks' : 'points')),
          },
          { label: 'v1', ghost: true, onClick: go('#/dash/visa-benefit?v=1') },
          { label: 'reset', ghost: true, onClick: reset },
        ]}
      />

      <header className="dash-pagehead">
        <Breadcrumbs
          items={[{ label: D.cur.crumbHome, href: '#/dash' }]}
          current={eligible ? V.crumb : V.title}
          label={eligible ? V.claimTitle : V.title}
        />
        <div className="dash-sechead">
          <h2 className="dash-sechead__title">{eligible ? V.claimTitle : V.title}</h2>
        </div>
      </header>

      <div className="dash-visa">
        {!eligible && <ReceiptCard pay={pay} />}

        {eligible && (
          <>
            {/* The purchase, on the design's banner — one glance, one action. */}
            {/* No action (user, 2026-09-08): „View policy" had no defined destination
                from here, and dropping it lets the subtitle hold ONE line that stays
                aligned with the check tile. The SMS note moved under the CTA. */}
            <CtaBanner
              as="h3"
              icon="check"
              tone="success"
              title={V.strip.bought(pay.policy)}
              subtitle={`${pay.amount} · ${pay.method}`}
              cta={null}
            />

            <Card className="dash-visa__card" aria-label={claimed ? V.done.title : V.claim.title}>
              {claimed ? (
                <InlineAlert tone="success" title={V.done.title}>
                  {V.done.body}
                </InlineAlert>
              ) : (
                <InlineAlert tone="warning">{V.pending}</InlineAlert>
              )}
              <RewardRow pay={pay} reward={reward} />
              {claimed ? (
                <DoneBody pay={pay} reward={reward} wallet={claimed} />
              ) : (
                <ClaimForm
                  onHelp={() => setHelp(true)}
                  onDone={(w) => {
                    setClaimed(w)
                    window.scrollTo({ top: 0 })
                  }}
                />
              )}
            </Card>
          </>
        )}
      </div>

      {help && <HelpModal onClose={() => setHelp(false)} />}
    </>
  )
}
