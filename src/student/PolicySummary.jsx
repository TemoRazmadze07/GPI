import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import Avatar from '../components/Avatar.jsx'
import { PLANS, COUNTRIES, labelOf } from './data.js'
import { en as t } from './strings.js'

/* PolicySummary — the sticky right rail of the purchase flow (all three steps).

   Priced layout aligned 2026-08-10 to the shipped travel review step the user
   gave as the style reference: navy heading, dates + duration row, divider-
   separated groups (insured price row → total → limit/deductible), and a promo-
   code affordance at the bottom. The unpriced step-1 rail keeps the person
   block — it is the only thing the rail can say before a plan exists.

   Composes shared parts only: gpi-card surface, Avatar, Icon, t-* styles. */

const money = (n) => `${n.toFixed(2)} ₾`

function Row({ label, children, person = false }) {
  return (
    <div className={`stu-sum__row ${person ? 'stu-sum__row--person' : ''}`}>
      <span className="t-body-sm stu-sum__lbl">{label}</span>
      <span className="t-body-sm stu-sum__val">{children}</span>
    </div>
  )
}

export default function PolicySummary({ insured, priced = false, planId, term, fromDate, toDate }) {
  const plan = PLANS.find((p) => p.id === planId)
  const months = term === '12' ? 12 : 6
  const premium = plan ? (term === '12' ? plan.price12 : plan.price6) : 0
  const name = `${insured.firstName} ${insured.lastName}`.trim()
  // Promo entry is demo-only: the link swaps to an input, nothing is validated.
  const [promoOpen, setPromoOpen] = useState(false)

  return (
    <aside className="gpi-card stu-sum" aria-label={t.a11y.summary}>
      <h3 className="t-h4 stu-sum__title">{t.sidebar.head}</h3>

      {priced && plan ? (
        <>
          <div className="stu-sum__period">
            <span className="t-body-sm stu-sum__dates">{fromDate} — {toDate}</span>
            <span className="t-body-sm stu-sum__dur">{t.sidebar.months(months)}</span>
          </div>

          <div className="stu-sum__rows">
            <Row person label={name}>{money(premium)}</Row>
          </div>

          <div className="stu-sum__total">
            <div>
              <div className="t-label stu-sum__totallbl">{t.sidebar.total}</div>
              <div className="t-caption stu-sum__totalnote">{t.sidebar.totalNote}</div>
            </div>
            <span className="t-h4 stu-sum__amount">{money(premium)}</span>
          </div>

          <div className="stu-sum__rows stu-sum__rows--specs">
            <Row label={t.sidebar.plan}>{plan.name} ({plan.id})</Row>
            <Row label={t.sidebar.coverage}>{plan.limit}</Row>
            <Row label={t.sidebar.deductible}>{plan.deductible}</Row>
          </div>

          <div className="stu-sum__promo">
            <Icon name="ticket" size={20} />
            {promoOpen ? (
              <input
                className="gpi-input stu-sum__promoinput"
                placeholder={t.sidebar.promoPh}
                autoFocus
              />
            ) : (
              <>
                <span className="t-body-sm stu-sum__promoq">{t.sidebar.promoQ}</span>
                <button className="t-body-sm stu-sum__promolink" onClick={() => setPromoOpen(true)}>
                  {t.sidebar.promoCta}
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="stu-sum__person">
            <Avatar name={name} size={40} />
            <div className="stu-sum__who">
              <span className="t-body stu-sum__name">{name}</span>
              <span className="t-caption stu-sum__sub">
                {labelOf(COUNTRIES, insured.citizenship)} · {t.sidebar.role}
              </span>
            </div>
          </div>
          <p className="t-body-sm stu-sum__empty">{t.sidebar.empty}</p>
        </>
      )}
    </aside>
  )
}
