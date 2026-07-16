/* Mock contracts — company-level agreements (CNT-…), one row per product-year.
   Product labels/units live here with the data (same pattern as src/data/booking.js). */

/* onco + accident REMOVED 2026-07-16 (user): GPI has no corporate policy
   types/services for them — dropped from the whole system. */
export const PRODUCT_ORDER = ['health', 'auto', 'travel', 'property']

export const PRODUCTS = {
  health: { label: 'კორპ. ჯანმრთელობა', chip: 'ჯანმრთელობა', unit: 'პირი', img: 'health.png' },
  auto: { label: 'ავტო (CASCO)', chip: 'ავტო', unit: 'ავტო', img: 'auto.png' },
  travel: { label: 'სამოგზაურო', chip: 'სამოგზაურო', unit: 'პირი', img: 'travel.png' },
  property: { label: 'ქონების დაზღვევა', chip: 'ქონება', unit: 'ობიექტი', img: 'property.png' },
}

/* Drawer detail placeholders (2026-07-16). Premium / schedule / included are
   VISUAL PLACEHOLDERS — the real contract fields come from GPI's core system
   (TBD). "Included" = what the contract covers: health → packages with
   headcounts; other products → covered risks. Deterministic (derived from the
   row), no randomness. */
const SCHEDULE = { health: 'ყოველთვიური', auto: 'წლიური', travel: 'ერთჯერადი', property: 'წლიური' }
const PREMIUM_PER_UNIT = { health: 1260, auto: 1900, travel: 85, property: 2400 }

const INCLUDED = {
  health: (r) => {
    const base = Math.round(r.insured * 0.57)
    const mid = Math.round(r.insured * 0.32)
    return [
      { label: 'ბაზისი', meta: `${base} პირი` },
      { label: 'ოპტიმალი', meta: `${mid} პირი` },
      { label: 'პრემიუმი', meta: `${r.insured - base - mid} პირი` },
    ]
  },
  auto: () => [
    { label: 'ავტოსაგზაო შემთხვევა', meta: 'სრული დაფარვა' },
    { label: 'ქურდობა / გატაცება', meta: 'სრული დაფარვა' },
    { label: 'სტიქიური მოვლენები', meta: 'სრული დაფარვა' },
    { label: 'მესამე პირის პასუხისმგებლობა', meta: '₾ 25,000-მდე' },
  ],
  travel: () => [
    { label: 'სამედიცინო ხარჯები', meta: '€ 50,000-მდე' },
    { label: 'ბარგის დაკარგვა', meta: '€ 1,000-მდე' },
    { label: 'ფრენის გაუქმება / დაგვიანება', meta: '€ 600-მდე' },
  ],
  property: () => [
    { label: 'ხანძარი / აფეთქება', meta: 'სრული დაფარვა' },
    { label: 'სტიქიური მოვლენები', meta: 'სრული დაფარვა' },
    { label: 'წყლით დაზიანება', meta: 'სრული დაფარვა' },
    { label: 'ქურდობა', meta: 'სრული დაფარვა' },
  ],
}

export function contractDetails(r) {
  return {
    premium: `₾ ${(r.insured * PREMIUM_PER_UNIT[r.product]).toLocaleString('en-US')}`,
    schedule: SCHEDULE[r.product],
    included: INCLUDED[r.product](r),
  }
}

/* status: active | ended */
export const CONTRACTS = [
  { id: 'CNT-2025-0128', product: 'health', start: '01.01.2025', end: '31.12.2025', insured: 248, status: 'active' },
  { id: 'CNT-2024-0089', product: 'health', start: '01.01.2024', end: '31.12.2024', insured: 231, status: 'ended' },
  { id: 'CNT-2025-0131', product: 'auto', start: '15.02.2025', end: '14.02.2026', insured: 34, status: 'active' },
  { id: 'CNT-2025-0182', product: 'auto', start: '01.05.2025', end: '30.04.2026', insured: 12, status: 'active' },
  { id: 'CNT-2024-0117', product: 'auto', start: '15.02.2024', end: '14.02.2025', insured: 29, status: 'ended' },
  { id: 'CNT-2025-0094', product: 'travel', start: '15.03.2025', end: '14.03.2026', insured: 62, status: 'active' },
  { id: 'CNT-2024-0152', product: 'travel', start: '15.03.2024', end: '14.03.2025', insured: 48, status: 'ended' },
  { id: 'CNT-2025-0162', product: 'property', start: '01.07.2025', end: '30.06.2026', insured: 16, status: 'active' },
  { id: 'CNT-2024-0201', product: 'property', start: '01.07.2024', end: '30.06.2025', insured: 14, status: 'ended' },
]
