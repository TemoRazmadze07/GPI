/* Mock contracts — company-level agreements (CNT-…), one row per product-year.
   Product labels/units live here with the data (same pattern as src/data/booking.js). */

export const PRODUCT_ORDER = ['health', 'auto', 'travel', 'onco', 'property', 'accident']

export const PRODUCTS = {
  health: { label: 'კორპ. ჯანმრთელობა', chip: 'ჯანმრთელობა', unit: 'პირი', img: 'health.png' },
  auto: { label: 'ავტო (CASCO)', chip: 'ავტო', unit: 'ავტო', img: 'auto.png' },
  travel: { label: 'სამოგზაურო', chip: 'სამოგზაურო', unit: 'პირი', img: 'travel.png' },
  onco: { label: 'ონკო ქეარი', chip: 'ონკო', unit: 'პირი', img: 'onco.png' },
  property: { label: 'ქონების დაზღვევა', chip: 'ქონება', unit: 'ობიექტი', img: 'property.png' },
  // Accident illustration not yet provided by GPI — tile falls back to an icon.
  accident: { label: 'უბედური შემთხვევა', chip: 'უბედ. შემთხ.', unit: 'პირი', img: null },
}

/* status: active | preparing (renewal being prepared) | ended */
export const CONTRACTS = [
  { id: 'CNT-2025-0128', product: 'health', start: '01.01.2025', end: '31.12.2025', insured: 248, status: 'active' },
  { id: 'CNT-2026-0003', product: 'health', start: '01.01.2026', end: '31.12.2026', insured: null, status: 'preparing' },
  { id: 'CNT-2024-0089', product: 'health', start: '01.01.2024', end: '31.12.2024', insured: 231, status: 'ended' },
  { id: 'CNT-2025-0131', product: 'auto', start: '15.02.2025', end: '14.02.2026', insured: 34, status: 'active' },
  { id: 'CNT-2025-0182', product: 'auto', start: '01.05.2025', end: '30.04.2026', insured: 12, status: 'active' },
  { id: 'CNT-2024-0117', product: 'auto', start: '15.02.2024', end: '14.02.2025', insured: 29, status: 'ended' },
  { id: 'CNT-2025-0094', product: 'travel', start: '15.03.2025', end: '14.03.2026', insured: 62, status: 'active' },
  { id: 'CNT-2024-0152', product: 'travel', start: '15.03.2024', end: '14.03.2025', insured: 48, status: 'ended' },
  { id: 'CNT-2025-0145', product: 'onco', start: '01.06.2025', end: '31.05.2026', insured: 18, status: 'active' },
  { id: 'CNT-2025-0162', product: 'property', start: '01.07.2025', end: '30.06.2026', insured: 16, status: 'active' },
  { id: 'CNT-2024-0201', product: 'property', start: '01.07.2024', end: '30.06.2025', insured: 14, status: 'ended' },
  { id: 'CNT-2025-0178', product: 'accident', start: '01.09.2025', end: '31.08.2026', insured: 198, status: 'active' },
]
