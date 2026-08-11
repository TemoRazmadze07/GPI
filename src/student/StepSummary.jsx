import Radio from '../components/Radio.jsx'
import Checkbox from '../components/Checkbox.jsx'
import ReviewSection, { ReviewRow } from '../components/ReviewSection.jsx'
import { PLANS, COUNTRIES, UNIVERSITIES, labelOf } from './data.js'
import { en as t } from './strings.js'

/* Step 3 — Review and confirm.

   Aligned 2026-08-10 to the shipped travel review step the user provided as the
   style reference: single imperative title (no eyebrow/subtitle), policy section
   first, card choice as a two-up grid of outlined options, and TWO plain
   consent checkboxes with document links at the bottom of the card. Fields and
   copy stay the student flow's own — the reference is a styling grammar, not a
   content source (same call as the step-1 SVG alignment). */

/* A dead document link — the prototype has no legal docs to open yet. Kept a
   real <a> so the consent reads and focuses like the shipped screen. */
function DocLink({ children }) {
  return (
    <a className="stu-doclink" href="#" onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  )
}

const Req = () => <span className="stu-req" aria-hidden="true"> *</span>

export default function StepSummary({ insured, planId, term, fromDate, toDate, consents, onConsent, onEditStep }) {
  const s = t.step3
  const plan = PLANS.find((p) => p.id === planId)
  const months = term === '12' ? 12 : 6
  const premium = term === '12' ? plan.price12 : plan.price6
  const name = `${insured.firstName} ${insured.lastName}`.trim()

  return (
    <section className="gpi-card stu-card">
      <h2 className="t-h4 stu-title stu-title--review">{s.title}</h2>

      <div className="stu-reviews">
        <ReviewSection
          icon="shield-check"
          title={s.policyTitle}
          summary={`${plan.name} · ${t.sidebar.months(months)}`}
          onEdit={() => onEditStep(1)}
        >
          <ReviewRow label={s.plan}>Plan {plan.id} — {plan.name}</ReviewRow>
          <ReviewRow label={s.term}>{s.termLong(months)}</ReviewRow>
          <ReviewRow label={s.validity}>{fromDate} — {toDate}</ReviewRow>
          <ReviewRow label={s.coverageLimit}>{plan.limit}</ReviewRow>
          <ReviewRow label={s.deductible}>{plan.deductible}</ReviewRow>
          <ReviewRow label={s.premium}>
            <strong className="stu-premium">{premium.toFixed(2)} ₾</strong>
          </ReviewRow>
        </ReviewSection>

        <ReviewSection
          icon="user"
          title={s.insuredTitle}
          summary={`${name} · ${labelOf(COUNTRIES, insured.citizenship)}`}
          onEdit={() => onEditStep(0)}
        >
          <ReviewRow label={s.fullName}>{name}</ReviewRow>
          <ReviewRow label={s.dob}>{insured.dob}</ReviewRow>
          <ReviewRow label={s.personalNumber}>{insured.personalNumber}</ReviewRow>
          <ReviewRow label={s.citizenship}>{labelOf(COUNTRIES, insured.citizenship)}</ReviewRow>
          <ReviewRow label={s.address}>{insured.address}</ReviewRow>
          <ReviewRow label={s.phone}>{insured.phone}</ReviewRow>
          <ReviewRow label={s.email}>{insured.email}</ReviewRow>
          <ReviewRow label={s.university}>{labelOf(UNIVERSITIES, insured.university)}</ReviewRow>
        </ReviewSection>
      </div>

      <h3 className="t-overline stu-paylbl">{s.paymentMethod}</h3>
      {/* Two-up option grid, as on the reference screen. A first-time student
          buyer has no saved cards, so "New card" is the only option — saved
          cards become extra grid items once accounts exist, not a rewrite. */}
      <div className="stu-pay" role="radiogroup" aria-label={s.paymentMethod}>
        <label className="stu-pay__opt is-selected">
          <Radio name="paymethod" value="new" checked onChange={() => {}} label={s.newCard} />
        </label>
      </div>

      <div className="stu-consents">
        <Checkbox
          name="consentTerms"
          checked={consents.terms}
          onChange={(v) => onConsent('terms', v)}
          label={
            <>
              {s.consentTerms.pre}
              <DocLink>{s.consentTerms.link1}</DocLink>
              {s.consentTerms.mid}
              <DocLink>{s.consentTerms.link2}</DocLink>
              {s.consentTerms.post}
              <Req />
            </>
          }
        />
        <Checkbox
          name="consentPrivacy"
          checked={consents.privacy}
          onChange={(v) => onConsent('privacy', v)}
          label={
            <>
              {s.consentPrivacy.pre}
              <DocLink>{s.consentPrivacy.link1}</DocLink>
              {s.consentPrivacy.post}
              <Req />
            </>
          }
        />
      </div>

      <p className="t-caption stu-payhelp">{s.emailNote(insured.email)}</p>
    </section>
  )
}
