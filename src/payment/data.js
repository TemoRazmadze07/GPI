/* Payment portal demo data + session state. Cards live in sessionStorage so the
   new-user / returning-user demo states survive navigation within the flow but
   reset with the tab (same idiom as the mobile module's session state). */

/* The identified customer (after personal number + birth date + SMS code).
   Phone is masked exactly as the live portal masks it. */
export const CUSTOMER = { name: 'მარიამ ხაჩიძე', phoneMasked: '591****39' }

/* Policies found for that person. The third carries NO debt on purpose — the
   zero-balance case is real and the team should see how it reads. */
export const POLICIES = [
  { id: 'mh', name: 'პოლისი ჩემი სახლი', person: 'მარიამ ხაჩიძე', number: 'MH 03432/26', due: 228.84 },
  { id: 'opc', name: 'პოლისი კომფორტი სტანდარტი', person: 'მარიამ ხაჩიძე', number: 'OPC 4275349/26', due: 150.0 },
  { id: 'auto', name: 'ავტო დაზღვევა', person: 'მარიამ ხაჩიძე', number: 'AT 118842/26', due: 0 },
]

const POLICY_KEY = 'gpi.pay.policy'

export function getPolicyId() {
  return sessionStorage.getItem(POLICY_KEY) || POLICIES[0].id
}

export function setPolicyId(id) {
  sessionStorage.setItem(POLICY_KEY, id)
}

export function getPolicy() {
  return POLICIES.find((p) => p.id === getPolicyId()) || POLICIES[0]
}

/* `bank` + `type` are what people actually recognise a card by — four digits
   alone don't separate two cards from the same wallet. Deliberately two
   DIFFERENT banks here so the sub-line is doing visible work in the demo. */
export const SEED_CARDS = [
  { id: 'visa-4318', brand: 'visa', last4: '4318', exp: '12/27', benefit: true, bank: 'საქართველოს ბანკი', type: 'საკრედიტო' },
  { id: 'mc-2201', brand: 'mc', last4: '2201', exp: '09/26', benefit: false, bank: 'თიბისი ბანკი', type: 'სადებეტო' },
]

/* The card "entered" on the bank stub — joins the saved list after a
   new-card payment or a link-only (0 ₾) tokenization. */
export const NEW_CARD = {
  id: 'visa-7712',
  brand: 'visa',
  last4: '7712',
  exp: '08/29',
  benefit: true,
  bank: 'საქართველოს ბანკი',
  type: 'საკრედიტო',
}

const KEY = 'gpi.pay.cards'

export function getCards() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function setCards(cards) {
  sessionStorage.setItem(KEY, JSON.stringify(cards))
}

export function addCard(card) {
  const cards = getCards()
  if (!cards.some((c) => c.id === card.id)) setCards([card, ...cards])
}

/* Visa campaign — real mechanics (GPI, 2026-09-01). Bruno points accrue as a
   % of the PAID PREMIUM per card tier; the site must show the computed POINT
   AMOUNT, never the percentage (explicit requirement). The banner's control is
   a TIER choice, not a yes/no: 'other' (default) | 'signature' | 'infinite'.
   Session-scoped because it must survive the bank-redirect round-trip and be
   settled on the receipt. */
export const VISA_RATES = { signature: 0.06, infinite: 0.07 }

export function visaPoints(tier, amount) {
  const rate = VISA_RATES[tier]
  return rate ? (amount * rate).toFixed(2) : null
}

const VISA_KEY = 'gpi.pay.visaTier'

export function getVisaTier() {
  const t = sessionStorage.getItem(VISA_KEY)
  return t === 'signature' || t === 'infinite' ? t : 'other'
}

export function setVisaTier(tier) {
  sessionStorage.setItem(VISA_KEY, tier)
}

export function fmt(n) {
  return n.toFixed(2) + ' ₾'
}

/* Query string carried INSIDE the hash (#/pay/bank?mode=link) — same helper
   shape as App.jsx's parseHashQuery. */
export function hashQuery() {
  const h = window.location.hash
  const qi = h.indexOf('?')
  return new URLSearchParams(qi === -1 ? '' : h.slice(qi + 1))
}
