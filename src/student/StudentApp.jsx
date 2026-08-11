import { useState } from 'react'
import StudentShell from './StudentShell.jsx'
import Stepper from '../components/Stepper.jsx'
import WizardFooter from '../components/WizardFooter.jsx'
import StepInsured from './StepInsured.jsx'
import StepSummary from './StepSummary.jsx'
import PolicySummary from './PolicySummary.jsx'
import { defaultInsured, PLANS } from './data.js'
import { en as t } from './strings.js'

/* StudentApp — Foreign Student Insurance purchase flow (own Rule 5 surface).

   Rebuild of foreign_student_insurance_mockup_2.html on the design system:
   same steps, same fields, same two-column layout, but assembled from library
   components (Stepper · Card · Field · Select · Checkbox · Radio ·
   ReviewSection · Button · WizardFooter · Avatar) on semantic tokens and shared
   text styles.

   ENGLISH-ONLY SURFACE — the shell resolves to `en` for this route (see
   i18n/index.js), because the product is sold to non-Georgian-speaking students.

   STATUS: steps 1 and 3 built. Step 2 (plan & term) is not designed yet, so it
   shows an explicit not-built placeholder rather than improvised UI — and the
   plan/term it would set are seeded here with the mockup's defaults so step 3
   and the priced rail have real data to render. */

const STEPS = [
  { id: 'insured', label: t.steps.insured },
  { id: 'policy', label: t.steps.policy },
  { id: 'summary', label: t.steps.summary },
]

// Locked EN date convention: `D MMM YYYY`, no comma before the year.
const START_DATE = '01 Sep 2026'
const END_DATE = { 12: '31 Aug 2027', 6: '28 Feb 2027' }

export default function StudentApp() {
  const [step, setStep] = useState(0)
  const [insured, setInsured] = useState(defaultInsured)
  // Seeded from the mockup's defaults until step 2 exists to set them.
  const [planId, setPlanId] = useState('C')
  const [term, setTerm] = useState('12')
  // Two consents (terms / privacy) since the 2026-08-10 reference alignment —
  // both are required before Pay enables.
  const [consents, setConsents] = useState({ terms: false, privacy: false })
  const consented = consents.terms && consents.privacy

  const setField = (k, v) => setInsured((prev) => ({ ...prev, [k]: v }))

  const plan = PLANS.find((p) => p.id === planId)
  const premium = term === '12' ? plan.price12 : plan.price6
  const amount = `${premium.toFixed(2)} ₾`
  const toDate = END_DATE[term === '12' ? 12 : 6]
  const isLast = step === STEPS.length - 1

  return (
    <StudentShell>
      <div className="gpi-wizard stu-wizard">
        <Stepper steps={STEPS} current={step} />

        <div className="gpi-wizard__body">
          {step === 0 && <StepInsured value={insured} onChange={setField} />}

          {step === 1 && (
            <section className="gpi-card stu-card">
              <p className="t-overline stu-eyebrow">Step 2 of 3</p>
              <h2 className="t-h4 stu-title">{STEPS[1].label}</h2>
              <p className="t-body-sm stu-subtitle">
                Plan &amp; term selection — not built yet.
              </p>
            </section>
          )}

          {step === 2 && (
            <StepSummary
              insured={insured}
              planId={planId}
              term={term}
              fromDate={START_DATE}
              toDate={toDate}
              consents={consents}
              onConsent={(key, v) => setConsents((prev) => ({ ...prev, [key]: v }))}
              onEditStep={setStep}
            />
          )}

          {/* Step 1 has no price yet, so the rail shows the person plus the line
              telling the user where the premium will come from. */}
          <PolicySummary
            insured={insured}
            priced={step > 0}
            planId={planId}
            term={term}
            fromDate={START_DATE}
            toDate={toDate}
          />
        </div>

        <WizardFooter
          showBack={step > 0}
          onBack={() => setStep((s) => Math.max(0, s - 1))}
          onContinue={() => {
            if (isLast) return
            setStep((s) => s + 1)
          }}
          canContinue={!isLast || consented}
          continueLabel={
            isLast ? t.step3.pay(amount) : step === 0 ? t.step1.continue : undefined
          }
          continueIcon={isLast ? null : 'arrow-right'}
          continueLeadingIcon={isLast ? 'lock' : undefined}
        />
      </div>
    </StudentShell>
  )
}
