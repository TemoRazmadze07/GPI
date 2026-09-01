import { useEffect, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { Button } from '../components/Button.jsx'
import Badge from '../components/Badge.jsx'
import Checkbox from '../components/Checkbox.jsx'
import Radio from '../components/Radio.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import { P } from './strings.js'
import { getPolicy, getCards, getVisaTier, setVisaTier, visaPoints, fmt, hashQuery } from './data.js'
import { AppleMark, GPayMark, VisaMark, McMark } from './marks.jsx'
import visaCards from '../assets/visa-cards.svg'

/* PaymentScreen — the redesigned /Policy/ReviewPayment. One screen, two states:
   A (no saved cards) pays via the bank page; B (saved cards) charges the
   selected card directly. Ordering follows the express-checkout convention:
   wallets first, then the card path, one primary CTA with the amount in it,
   consent line at the point of commitment.

   ROW ANATOMY (revised 2026-08-31 after reviewing GPI's current card list):
   radio · brand mark · [number+expiry / bank·type] · trailing campaign badge.
   The mark LEADS rather than trails — it is an identifier, so it belongs where
   scanning starts, it forms one alignable column, and it leaves the right edge
   free for the Visa badge (and, later, row actions). The brand is also written
   in TEXT, because a logo alone tells a screen-reader user nothing — and the
   Visa campaign makes "which network is this?" load-bearing. Because the brand
   is visible, the number shows `•••• 1234` only: the leading BIN added width
   and truncation pressure without adding recognition. */
function CardRow({ checked, onSelect, children }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      className={`pay-cardrow${checked ? ' pay-cardrow--on' : ''}`}
      onClick={onSelect}
    >
      <span className="pay-cardrow__radio" aria-hidden="true" />
      {children}
    </button>
  )
}

/* Visa campaign banner — rebuilt 2026-09-01 from GPI's own exported design
   (Figma "Frame 1321316779"). Copy, structure and artwork are the client's;
   what this version adds is that the control actually works and that the
   promise it makes gets settled on the receipt.

   Adopted from the export: white surface (NOT the pink I had — pink fought
   with Visa's own identity), navy title, two-line body, the confirmation
   checkbox, the campaign-terms link, and the isometric card stack bleeding off
   the right edge. Colours map onto existing tokens rather than the export's
   literals — the foundation already locks that navy pairing (indigo/800 title,
   indigo/500 body) and the export's link blue #1000F6 IS our `--text-link`.

   The artwork is extracted from the export and its card textures downscaled
   (17.5 MB → 616 KB); production should re-export it properly optimised.
   ⚠️ Campaign creative normally needs Visa's sign-off before it ships. */
/* Tier choice (user's mock, 2026-09-01): the yes/no checkbox became a 3-way
   radio — სხვა ბარათი (default) / VISA Signature / VISA Infinite — because the
   campaign is per-TIER (Signature 6% / Infinite 7% of the paid premium) and
   the requirement is to show each tier's computed POINT AMOUNT, never the %.
   A side effect worth keeping: „სხვა ბარათი" honestly covers non-premium Visas
   too, which the old blanket "pay with VISA" checkbox over-promised.
   Layout: intro copy beside the artwork, radios FULL-WIDTH below — tier rows
   carry a points sub-line, and on a phone they cannot share a row with art. */
/* `compact` (user, 2026-09-01): the RETURNING user gets the same banner but
   informational only — intro copy + artwork, no tier radios, no terms line.
   The card choice already happens in the saved-card rows below, so the banner
   just explains why the Visa row carries its badge. */
function VisaPromo({ tier, onTier, amount, compact }) {
  const tierLabel = (name, pts) => (
    <span className="pay-promo__tier">
      <span className="pay-promo__tiername">{name}</span>
      <span className="pay-promo__tierpts pay-num">{P.pay.promoTierDesc(pts)}</span>
    </span>
  )
  return (
    <div
      className={`pay-promo${compact ? ' pay-promo--compact' : ''}${!compact && tier !== 'other' ? ' pay-promo--on' : ''}`}
    >
      {/* Order per the user's 2026-09-01 mock: copy → tier choice → ARTWORK →
          terms (compact: copy → artwork). The art is a normal full-width block,
          not a side column — no overflow clipping anywhere. */}
      <div className="pay-promo__body">
        <p className="pay-promo__title">{P.pay.promoTitle}</p>
        <p className="pay-promo__text">{P.pay.promoBody}</p>
      </div>
      {!compact && (
        <div className="pay-promo__choice" role="radiogroup" aria-label={P.pay.promoChoose}>
          <p className="pay-promo__chooselbl">{P.pay.promoChoose}</p>
          <Radio
            name="pay-visa-tier"
            value="other"
            checked={tier === 'other'}
            onChange={onTier}
            label={<span className="pay-promo__tiername">{P.pay.promoOther}</span>}
          />
          <Radio
            name="pay-visa-tier"
            value="signature"
            checked={tier === 'signature'}
            onChange={onTier}
            label={tierLabel('VISA Signature', visaPoints('signature', amount))}
          />
          <Radio
            name="pay-visa-tier"
            value="infinite"
            checked={tier === 'infinite'}
            onChange={onTier}
            label={tierLabel('VISA Infinite', visaPoints('infinite', amount))}
          />
        </div>
      )}
      {/* Wrapper carries the VERTICAL fade mask, the img the HORIZONTAL one —
          multiplied they fade all four edges to zero (one ellipse could not
          cover every edge without eating the cards). */}
      <span className="pay-promo__artbox" aria-hidden="true">
        <img className="pay-promo__art" src={visaCards} alt="" />
      </span>
      {!compact && (
        <p className="pay-promo__terms">
          {P.pay.promoTerms}{' '}
          <a className="pay-promo__link" href="#/pay" onClick={(e) => e.preventDefault()}>
            {P.pay.promoTermsLink}
          </a>
        </p>
      )}
    </div>
  )
}

/* „დაიმახსოვრე ბარათი" — rendered as a SIBLING under the new-card row, never
   inside it: a control nested in a control is invalid, and the locked rule
   (2026-08-03) forbids a second tap target inside a card that is itself one.
   Indentation + the connector rule carry the relationship instead.
   Unchecked by default — storing a card for future merchant-initiated charges
   is consent, not a default. ⚠️ If GPI confirms every payment MUST store the
   card (merchant is "GPI ONLY RECCURING"), replace this with a plain statement:
   a checkbox that cannot change the outcome is worse than none. */
function SaveCard({ checked, onChange, nested }) {
  return (
    <div className={nested ? 'pay-saverow' : undefined}>
      <Checkbox
        name="pay-savecard"
        checked={checked}
        onChange={onChange}
        label={P.pay.saveCard}
        help={P.pay.saveCardHint}
      />
    </div>
  )
}

export default function PaymentScreen() {
  const [cards, setCardsState] = useState(getCards)
  const [selected, setSelected] = useState(() => getCards()[0]?.id || 'new')
  const [save, setSave] = useState(false)
  const [visaTier, setVisaTierState] = useState(getVisaTier)
  const linked = hashQuery().get('linked') === '1'
  const returning = cards.length > 0
  const POLICY = getPolicy()

  const chooseTier = (t) => {
    setVisaTierState(t)
    setVisaTier(t)
  }

  /* The returning state shows the banner WITHOUT the tier radios (user,
     2026-09-01), so no campaign promise is taken here — clear any tier left
     over from an earlier new-user run, else the receipt would settle a choice
     this screen never offered. */
  useEffect(() => {
    if (returning) {
      setVisaTierState('other')
      setVisaTier('other')
    }
  }, [returning])

  const payWallet = (wallet) => {
    window.location.hash = '#/pay/done?m=' + wallet
  }

  const payCard = () => {
    if (!returning || selected === 'new') {
      window.location.hash = '#/pay/bank?mode=pay'
    } else {
      window.location.hash = '#/pay/done?m=' + selected
    }
  }

  return (
    <>
      {/* One step = one sheet (2026-09-01). The policy block inside demotes to
          border grammar (see .pay-policy) — one elevated surface per screen. */}
      <section className="pay-card pay-stack" aria-label={P.pay.title}>
      <div className="pay-head">
        <button
          type="button"
          className="pay-back"
          aria-label={P.pay.back}
          onClick={() => {
            window.location.hash = '#/pay/policies'
          }}
        >
          <Icon name="arrow-left" size={20} />
        </button>
        <h1 className="pay-title">{P.pay.title}</h1>
      </div>

      {linked && <InlineAlert tone="success">{P.pay.linkedAlert}</InlineAlert>}

      <section className="pay-policy" aria-label={POLICY.name}>
        <div className="pay-policy__toprow">
          <h2 className="pay-policy__name">{POLICY.name}</h2>
          <Badge color="success" size="sm" dot>
            {P.pay.active}
          </Badge>
        </div>
        <p className="pay-policy__meta">
          {POLICY.person} · {POLICY.number}
        </p>
        <div className="pay-policy__due">
          <span className="pay-policy__duelabel">{P.pay.dueLabel}</span>
          <span className="pay-amount">{fmt(POLICY.due)}</span>
        </div>
      </section>

      <div className="pay-wallets">
        <button type="button" className="pay-wallet" aria-label={P.pay.walletAria.apple} onClick={() => payWallet('apple')}>
          <AppleMark />
        </button>
        <button type="button" className="pay-wallet" aria-label={P.pay.walletAria.google} onClick={() => payWallet('google')}>
          <GPayMark />
        </button>
      </div>

      <div className="pay-divider" role="separator">
        {P.pay.orCard}
      </div>

      {/* New user: full banner with the tier choice. Returning: same banner,
          informational only — the saved-card rows below carry the choice. */}
      {returning ? (
        <VisaPromo compact />
      ) : (
        <VisaPromo tier={visaTier} onTier={chooseTier} amount={POLICY.due} />
      )}

      {returning ? (
        <div className="pay-methods" role="radiogroup" aria-label={P.pay.methodsLabel}>
          <p className="pay-sectionlabel">{P.pay.methodsLabel}</p>
          {cards.map((c) => (
            <CardRow key={c.id} checked={selected === c.id} onSelect={() => setSelected(c.id)}>
              <span className="pay-cardrow__brand">{c.brand === 'visa' ? <VisaMark /> : <McMark />}</span>
              <span className="pay-cardrow__col">
                <span className="pay-cardrow__num">
                  {c.brand === 'visa' ? 'Visa' : 'Mastercard'} •••• {c.last4}
                  <span className="pay-cardrow__exp"> {c.exp}</span>
                </span>
                <span className="pay-cardrow__sub">
                  {c.bank} · {c.type}
                </span>
              </span>
              {c.benefit && (
                <span className="pay-cardrow__trail">
                  <Badge color="brand" size="sm">
                    {P.pay.benefitBadge}
                  </Badge>
                </span>
              )}
            </CardRow>
          ))}
          <CardRow checked={selected === 'new'} onSelect={() => setSelected('new')}>
            <span className="pay-cardrow__brand pay-cardrow__brand--new">
              <Icon name="plus" size={16} />
            </span>
            <span className="pay-cardrow__col">
              <span className="pay-cardrow__num">{P.pay.newCard}</span>
              <span className="pay-cardrow__sub pay-cardrow__sub--wrap">{P.pay.newCardSub}</span>
            </span>
          </CardRow>
          {selected === 'new' && <SaveCard checked={save} onChange={setSave} nested />}
        </div>
      ) : (
        <>
          <InlineAlert tone="info">{P.pay.newUserInfo}</InlineAlert>
          {/* First-time payer: the card IS new, so the same choice applies —
              offered here un-nested since there is no row to hang it under. */}
          <SaveCard checked={save} onChange={setSave} />
        </>
      )}

      <Button size="lg" className="pay-block" onClick={payCard}>
        {(returning && selected !== 'new' ? P.pay.ctaPay : P.pay.ctaPayCard) + ' · ' + fmt(POLICY.due)}
      </Button>
      <p className="pay-consent">{P.pay.consent}</p>

      {!returning && (
        <div className="pay-linkline">
          <Button
            variant="tertiary"
            size="md"
            onClick={() => {
              window.location.hash = '#/pay/bank?mode=link'
            }}
          >
            {P.pay.linkCard}
          </Button>
        </div>
      )}

      </section>

      <p className="pay-trust">
        <Icon name="lock" size={16} />
        <span>{P.pay.trust}</span>
      </p>
    </>
  )
}
