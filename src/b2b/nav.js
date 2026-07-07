/* B2B sidebar navigation model (locked IA, 2026-07-01/02; Service group
   flattened 2026-07-06 → Guide + Offers are now top-level leaves):
   8 top-level items + bottom admin group. Max TWO levels — anything deeper
   belongs to in-page tabs/filters, never a third nav level.
   Parents are toggle-only (never navigate); leaves navigate.
   `badge` = neutral count; `urgent` = red-dot bubble shown on the collapsed
   parent so progressive disclosure never hides something actionable. */

import { kaB2B } from './strings.js'

const t = kaB2B.nav

export const NAV_MAIN = [
  { id: 'home', label: t.home, icon: 'home' },
  {
    id: 'insured',
    label: t.insured,
    icon: 'users',
    children: [
      { id: 'persons', label: t.persons },
      { id: 'vehicles', label: t.vehicles },
      { id: 'objects', label: t.objects },
    ],
  },
  { id: 'contracts', label: t.contracts, icon: 'file-text' },
  { id: 'requests', label: t.requests, icon: 'arrow-right-left', badge: 7 },
  { id: 'claims', label: t.claims, icon: 'shield-check', badge: 3 },
  {
    id: 'finances',
    label: t.finances,
    icon: 'credit-card',
    children: [
      { id: 'invoices', label: t.invoices, urgent: true },
      { id: 'statement', label: t.statement },
    ],
  },
  { id: 'guide', label: t.guide, icon: 'graduation-cap' },
  { id: 'offers', label: t.offers, icon: 'tag' },
  {
    id: 'admin',
    label: t.admin,
    icon: 'settings',
    children: [
      { id: 'adminUsers', label: t.adminUsers },
      { id: 'adminOrg', label: t.adminOrg },
    ],
  },
]

/* Find the parent group id of a leaf (or null for top-level leaves). */
export function parentOf(leafId) {
  for (const item of NAV_MAIN) {
    if (item.children?.some((c) => c.id === leafId)) return item.id
  }
  return null
}

/* A parent bubbles a badge/urgent dot up when collapsed. */
export function bubbled(item) {
  if (!item.children) return { badge: item.badge, urgent: item.urgent }
  const badge = item.children.reduce((n, c) => n + (c.badge || 0), 0) || item.badge
  const urgent = item.urgent || item.children.some((c) => c.urgent)
  return { badge, urgent }
}
