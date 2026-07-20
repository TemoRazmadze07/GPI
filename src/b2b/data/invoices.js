/* Mock invoices — generated per contract per billing period (INV-…). The heart
   of the finances section: some are paid, some open, some overdue. Amounts,
   dates and line items are ILLUSTRATIVE placeholders — the real invoice
   structure (how a GPI corporate invoice is itemised) comes from GPI's core /
   billing system (TBD, flagged to the user 2026-07-20). Deterministic, no
   randomness (same pattern as data/contracts.js). */

import { PRODUCTS } from './contracts.js'

/* Fixed "today" so the demo scenario stays stable — INV-2026-0039 stays 3 days
   overdue regardless of the real calendar date. Real app: server date. */
export const TODAY = new Date(2026, 3, 7) // 07.04.2026

export const toDate = (s) => {
  const [d, m, y] = s.split('.').map(Number)
  return new Date(y, m - 1, d)
}
const daysBetween = (a, b) => Math.round((b - a) / 86400000)
export const fmtGel = (n) => `${n < 0 ? '− ' : ''}₾ ${Math.abs(n).toLocaleString('en-US')}`

/* status: overdue | due | paid | credited
   overdue = past due date & unpaid · due = open, not yet overdue · paid =
   settled · credited = cancelled / credit note (excluded from money totals). */
export const INVOICE_STATUS_ORDER = ['overdue', 'due', 'paid', 'credited']
export const STATUS_SORT = { overdue: 0, due: 1, paid: 2, credited: 3 }

/* Whole-number relative distance for the due column / drawer meta:
   overdue → days since due (positive) · due → days until due (positive). */
export function relDays(inv) {
  if (inv.status === 'overdue') return daysBetween(toDate(inv.due), TODAY)
  if (inv.status === 'due') return daysBetween(TODAY, toDate(inv.due))
  return null
}

export const INVOICES = [
  { id: 'INV-2026-0039', contract: 'CNT-2025-0128', product: 'health',   period: 'მარტი 2026',     issued: '25.03.2026', due: '04.04.2026', amount: 6450,  status: 'overdue' },
  { id: 'INV-2026-0042', contract: 'CNT-2025-0128', product: 'health',   period: 'აპრილი 2026',    issued: '01.04.2026', due: '19.04.2026', amount: 35210, status: 'due' },
  { id: 'INV-2026-0043', contract: 'CNT-2025-0131', product: 'auto',     period: 'Q2 2026',        issued: '01.04.2026', due: '25.04.2026', amount: 4200,  status: 'due' },
  { id: 'INV-2026-0041', contract: 'CNT-2025-0094', product: 'travel',   period: 'აპრილი 2026',    issued: '01.04.2026', due: '15.04.2026', amount: 1450,  status: 'due' },
  { id: 'INV-2026-0044', contract: 'CNT-2025-0162', product: 'property', period: 'Q2 2026',        issued: '01.04.2026', due: '05.05.2026', amount: 3900,  status: 'due' },
  { id: 'INV-2026-0040', contract: 'CNT-2025-0182', product: 'auto',     period: 'Q1 2026',        issued: '20.03.2026', due: '31.03.2026', amount: 1180,  status: 'credited' },
  { id: 'INV-2026-0038', contract: 'CNT-2025-0128', product: 'health',   period: 'თებერვალი 2026', issued: '01.02.2026', due: '15.02.2026', amount: 34780, status: 'paid', paidOn: '12.02.2026' },
  { id: 'INV-2026-0035', contract: 'CNT-2025-0131', product: 'auto',     period: 'Q1 2026',        issued: '01.02.2026', due: '22.02.2026', amount: 4180,  status: 'paid', paidOn: '20.02.2026' },
  { id: 'INV-2026-0033', contract: 'CNT-2025-0094', product: 'travel',   period: 'მარტი 2026',     issued: '01.03.2026', due: '12.03.2026', amount: 1850,  status: 'paid', paidOn: '11.03.2026' },
  { id: 'INV-2026-0031', contract: 'CNT-2025-0128', product: 'health',   period: 'იანვარი 2026',   issued: '01.01.2026', due: '15.01.2026', amount: 34210, status: 'paid', paidOn: '14.01.2026' },
  { id: 'INV-2026-0028', contract: 'CNT-2025-0162', product: 'property', period: 'Q1 2026',        issued: '02.01.2026', due: '12.01.2026', amount: 3820,  status: 'paid', paidOn: '08.01.2026' },
  { id: 'INV-2025-0026', contract: 'CNT-2025-0128', product: 'health',   period: 'დეკემბერი 2025', issued: '01.12.2025', due: '15.12.2025', amount: 33990, status: 'paid', paidOn: '13.12.2025' },
  { id: 'INV-2025-0022', contract: 'CNT-2025-0131', product: 'auto',     period: 'Q4 2025',        issued: '01.11.2025', due: '22.11.2025', amount: 4180,  status: 'paid', paidOn: '19.11.2025' },
  { id: 'INV-2025-0019', contract: 'CNT-2025-0094', product: 'travel',   period: 'ნოემბერი 2025',  issued: '01.11.2025', due: '12.11.2025', amount: 1780,  status: 'paid', paidOn: '10.11.2025' },
  { id: 'INV-2025-0015', contract: 'CNT-2025-0128', product: 'health',   period: 'ნოემბერი 2025',  issued: '01.11.2025', due: '15.11.2025', amount: 33110, status: 'paid', paidOn: '12.11.2025' },
]

/* invoiceLines — ILLUSTRATIVE per-invoice breakdown ("what it covers"), summing
   exactly to inv.amount. Health = per-package headcounts + mid-cycle proration
   + a leavers credit (the differentiating corporate case); other products = a
   flat premium line + a small service fee. Real structure TBD from GPI. */
export function invoiceLines(inv) {
  const a = inv.amount
  if (inv.product === 'health') {
    const opt = Math.round(a * 0.16)
    const adj = Math.round(a * 0.028)
    const credit = -Math.round(a * 0.005)
    const base = a - opt - adj - credit
    return [
      { label: 'ბაზისი პაკეტი', qty: `${Math.round(base / 45)} × ₾45`, amount: base },
      { label: 'ოპტიმალი პაკეტი', qty: `${Math.round(opt / 55)} × ₾55`, amount: opt },
      { label: 'შუა თვის დამატება', qty: 'პროპორ.', amount: adj },
      { label: 'გასული თანამშრომლები', qty: '', amount: credit, credit: true },
    ]
  }
  const fee = Math.round(a * 0.02)
  const unit = PRODUCTS[inv.product].unit
  return [
    { label: 'სადაზღვევო პრემია', qty: PRODUCTS[inv.product].chip, amount: a - fee },
    { label: 'მომსახურების საკომისიო', qty: unit, amount: fee },
  ]
}
