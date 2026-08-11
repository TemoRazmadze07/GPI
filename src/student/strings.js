/* Foreign Student Insurance — purchase flow copy.

   ENGLISH ONLY, deliberately: the audience is non-Georgian-speaking students,
   and the source mockup is English throughout. This is its own surface with its
   own copy table (Rule 5) — it is NOT part of the My-Cabinet ka/en i18n system.

   ⚠️ OPEN with the user: the surrounding My-Cabinet shell is still Georgian, and
   the mockup's consent string (step 3) is Georgian inside an otherwise English
   flow. Flagged, not silently "fixed" — see the session notes. */

export const en = {
  steps: {
    insured: 'Insured',
    policy: 'Policy',
    summary: 'Summary',
  },

  step1: {
    eyebrow: 'Step 1 of 3',
    title: 'Who is being insured?',
    subtitle:
      'The insured student is also the policyholder. Fill every field in English (Latin characters).',

    groups: {
      personal: 'Personal details',
      contact: 'Contact in Georgia',
      university: 'University',
    },

    firstName: 'First name (Latin)',
    lastName: 'Last name (Latin)',
    dob: 'Date of birth',
    dobPh: 'DD / MM / YYYY',
    personalNumber: 'Personal number',
    citizenship: 'Citizenship',
    address: 'Address (in Georgia)',
    phone: 'Phone number',
    email: 'Email',
    university: 'University',

    enter: 'Enter',
    select: 'Select',

    universityNote:
      'University appears on the printed policy but is not stored in the system.',

    continue: 'Continue to plan',
  },

  step3: {
    /* Single imperative title, no eyebrow/subtitle — mirrors the shipped travel
       review step ("გადაამოწმე ინფორმაცია და შეიძინე დაზღვევა") the user asked
       this screen to align to (2026-08-10). */
    title: 'Review your details and buy your policy',

    insuredTitle: 'Insured & policyholder',
    policyTitle: 'Policy',

    fullName: 'Full name',
    dob: 'Date of birth',
    personalNumber: 'Personal number',
    citizenship: 'Citizenship',
    address: 'Address (Georgia)',
    phone: 'Phone',
    email: 'Email',
    university: 'University',

    plan: 'Plan',
    term: 'Term',
    validity: 'Validity',
    coverageLimit: 'Coverage limit',
    deductible: 'Deductible',
    premium: 'Premium',

    /* Two consents with document links — the pattern from the shipped travel
       review step (2026-08-10 alignment), which also closes the earlier flagged
       gap (no terms link before payment). The original mockup's single bundled
       string is split at its natural seam: accuracy+terms / privacy+sharing.
       ⚠️ PLACEHOLDER LEGAL COPY + dead links — document names and wording must
       come from GPI legal; do not ship as-is. */
    consentTerms: {
      pre: 'I confirm the details I have entered are correct and I agree to the ',
      link1: 'Insurance Terms',
      mid: ' and the ',
      link2: 'Terms of Service',
      post: '.',
    },
    consentPrivacy: {
      pre: 'I agree to the ',
      link1: 'Privacy Statement',
      post: ', including sharing my policy number and personal data with the Public Service Hall and my university.',
    },

    paymentMethod: 'Payment method',
    newCard: 'New card',

    emailNote: (email) =>
      `On purchase, the policy, wording, cover note and standard confirmation are emailed to ${email}.`,
    pay: (amount) => `Pay ${amount}`,
    termLong: (months) => `${months} months (${months === 12 ? '1 year' : '6 months'})`,
  },

  sidebar: {
    head: 'Your policy',
    role: 'Student',
    empty: 'Choose a plan and term in the next step to see your premium.',
    plan: 'Plan',
    term: 'Term',
    valid: 'Valid',
    coverage: 'Coverage limit',
    deductible: 'Deductible',
    total: 'Total payable',
    totalNote: 'One-time payment',
    months: (n) => `${n} months`,
    promoQ: 'Have a promo code?',
    promoCta: 'Enter it here',
    promoPh: 'Promo code',
  },

  a11y: {
    summary: 'Policy summary',
  },
}
