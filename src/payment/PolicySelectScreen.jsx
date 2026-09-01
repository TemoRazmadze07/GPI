import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import Badge from '../components/Badge.jsx'
import { Button } from '../components/Button.jsx'
import { P } from './strings.js'
import { POLICIES, CUSTOMER, getPolicyId, setPolicyId, fmt } from './data.js'

/* PolicySelectScreen — the redesigned /Policy step.

   REFRAMED, and this is the substantive change: the live screen asks „რომელ
   პოლისზე გსურს ბარათის დამატება?" — it makes CARD-ADDING the subject, when
   the person arrived from a "pay your premium" message. Here the question is
   the one they came to answer, and linking a card stays an option later in the
   flow rather than the frame around it.

   A policy with NO debt cannot be selected for payment and says so plainly
   instead of offering a 0 ₾ transaction. Selection is single (as in the live
   portal) — paying several policies at once is an open product question. */
export default function PolicySelectScreen() {
  const payable = POLICIES.filter((p) => p.due > 0)
  const [sel, setSel] = useState(() => {
    const saved = getPolicyId()
    return payable.some((p) => p.id === saved) ? saved : payable[0]?.id
  })

  const total = payable.reduce((s, p) => s + p.due, 0)

  const cont = () => {
    setPolicyId(sel)
    window.location.hash = '#/pay'
  }

  return (
    <>
      {/* One step = one sheet (2026-09-01): same .pay-card as login/OTP/done.
          The trust row stays OUTSIDE — it is meta about the service, not part
          of the task, and under-the-sheet is the checkout convention. */}
      <section className="pay-card pay-stack" aria-label={P.policies.title}>
      <div className="pay-head">
        <button
          type="button"
          className="pay-back"
          aria-label={P.pay.back}
          onClick={() => {
            window.location.hash = '#/pay/otp'
          }}
        >
          <Icon name="arrow-left" size={20} />
        </button>
        <h1 className="pay-title">{P.policies.title}</h1>
      </div>
      <p className="pay-lead">
        {CUSTOMER.name} · {P.policies.total}: <strong className="pay-num">{fmt(total)}</strong>
      </p>

      <div className="pay-policies" role="radiogroup" aria-label={P.policies.title}>
        {POLICIES.map((p) => {
          const none = p.due === 0
          const on = sel === p.id
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-disabled={none || undefined}
              className={`pay-pcard${on ? ' pay-pcard--on' : ''}${none ? ' pay-pcard--none' : ''}`}
              onClick={() => !none && setSel(p.id)}
            >
              <span className="pay-cardrow__radio" aria-hidden="true" />
              <span className="pay-pcard__body">
                {/* Title owns its row; the badge sits on the meta line below
                    (locked rule 2026-08-18 — a long policy name must never
                    share a line with a status chip). */}
                <span className="pay-pcard__name">{p.name}</span>
                <span className="pay-pcard__meta">
                  <span>{p.number}</span>
                  <Badge color="success" size="sm" dot>
                    {P.policies.active}
                  </Badge>
                </span>
                <span className="pay-pcard__due">
                  <span className="pay-pcard__duelabel">{none ? P.policies.noDue : P.policies.due}</span>
                  {!none && <span className="pay-pcard__amount pay-num">{fmt(p.due)}</span>}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <Button size="lg" className="pay-block" onClick={cont} disabled={!sel}>
        {P.policies.cta}
      </Button>
      </section>

      <p className="pay-trust">
        <Icon name="lock" size={16} />
        <span>{P.pay.trust}</span>
      </p>
    </>
  )
}
