import { useState } from 'react'
import ActionMenu from '../components/ActionMenu.jsx'
import Badge from '../components/Badge.jsx'
import DataTable from '../components/DataTable.jsx'
import FilterBar from '../components/FilterBar.jsx'
import { datePresets } from '../components/FilterPopover.jsx'
import ContractDetailsDrawer from './ContractDetailsDrawer.jsx'
import ProductTile from './ProductTile.jsx'
import { kaB2B } from './strings.js'
import { CONTRACTS, PRODUCTS, PRODUCT_ORDER } from './data/contracts.js'

/* ContractsScreen — company-level contracts (CNT-…) as a Data Table behind the
   common Filter Bar (filter popover + search + CSV export, 2026-07-15).
   Contract details open in the shared right-side Drawer (2026-07-16) — via
   row click or ⋮ → დეტალურად; a dedicated page only if a record outgrows it. */

const STATUS_BADGE = { active: 'success', ended: 'neutral' }

const toDate = (s) => {
  const [d, m, y] = s.split('.').map(Number)
  return new Date(y, m - 1, d)
}

/* Period = OVERLAP semantics: a contract matches when its active period
   intersects the selected range (answers "what was active in March?"). */
function matches(r, f, q) {
  if (f.status?.length && !f.status.includes(r.status)) return false
  if (f.product?.length && !f.product.includes(r.product)) return false
  if (f.period && !(toDate(r.start) <= f.period.to && toDate(r.end) >= f.period.from)) return false
  if (q) {
    const hay = `${r.id} ${PRODUCTS[r.product].label} ${PRODUCTS[r.product].chip}`.toLowerCase()
    if (!hay.includes(q.toLowerCase())) return false
  }
  return true
}

export default function ContractsScreen() {
  const t = kaB2B
  const c = t.contracts
  const page = t.pages.contracts
  const [filters, setFilters] = useState({ status: [], product: [], period: null })
  const [q, setQ] = useState('')
  const [detail, setDetail] = useState(null)

  const rows = CONTRACTS.filter((r) => matches(r, filters, q))
  const productCount = new Set(CONTRACTS.map((r) => r.product)).size
  const clearAll = () => {
    setFilters({ status: [], product: [], period: null })
    setQ('')
  }

  const categories = [
    {
      id: 'status',
      label: c.filterCats.status,
      type: 'pills',
      options: ['active', 'ended'].map((s) => ({
        id: s,
        label: c.status[s],
        count: CONTRACTS.filter((r) => r.status === s).length,
      })),
    },
    {
      id: 'product',
      label: c.filterCats.product,
      type: 'multi',
      searchPlaceholder: c.productSearch,
      options: PRODUCT_ORDER.map((p) => ({
        id: p,
        label: PRODUCTS[p].chip,
        count: CONTRACTS.filter((r) => r.product === p).length,
      })),
    },
    {
      id: 'period',
      label: c.filterCats.period,
      type: 'range',
      presets: datePresets(t.filterBar.presets),
    },
  ]

  /* Export = the FILTERED rows, not the whole dataset (agreed rule). BOM so
     Excel opens the Georgian text as UTF-8. */
  const exportCsv = () => {
    const head = [c.cols.number, c.cols.product, c.cols.start, c.cols.end, c.cols.insured, c.cols.status]
    const lines = rows.map((r) => [
      r.id,
      PRODUCTS[r.product].label,
      r.start,
      r.end,
      r.insured == null ? '' : `${r.insured} ${PRODUCTS[r.product].unit}`,
      c.status[r.status],
    ])
    const csv =
      '\uFEFF' +
      [head, ...lines].map((l) => l.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'contracts.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  /* Row actions are contextual (2026-07-16): view details (opens the drawer,
     same as row click) + jump to this contract's policies. No activate/
     deactivate or cancel — GPI has no such flows here. "View policies"
     deep-links to the product's policy tab with the contract filter
     pre-applied (?contract=CNT-…). */
  const rowActionsFor = (r) => [
    { id: 'details', label: c.actions.details, onSelect: () => setDetail(r) },
    {
      id: 'viewPolicies',
      label: c.actions.viewPolicies,
      onSelect: () => {
        window.location.hash = `#/b2b/policies/${r.product}?contract=${r.id}`
      },
    },
  ]

  const columns = [
    {
      key: 'contract',
      header: c.cols.number,
      width: 216,
      render: (r) => (
        <span className="gpi-table__contract">
          <ProductTile product={r.product} />
          <span className="gpi-table__id">{r.id}</span>
        </span>
      ),
    },
    { key: 'product', header: c.cols.product, render: (r) => PRODUCTS[r.product].label },
    { key: 'start', header: c.cols.start, width: 112, render: (r) => r.start },
    { key: 'end', header: c.cols.end, width: 112, render: (r) => r.end },
    {
      key: 'insured',
      header: c.cols.insured,
      width: 128,
      render: (r) =>
        r.insured == null ? (
          <span className="gpi-table__muted">—</span>
        ) : (
          `${r.insured} ${PRODUCTS[r.product].unit}`
        ),
    },
    {
      key: 'status',
      header: c.cols.status,
      width: 148,
      render: (r) => (
        <Badge color={STATUS_BADGE[r.status]} dot>
          {c.status[r.status]}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: 64,
      align: 'right',
      render: (r) => <ActionMenu items={rowActionsFor(r)} label={c.actions.menu} />,
    },
  ]

  return (
    <>
      {/* No page-head CTA: contracts are signed OFF-platform (stakeholders, 2026-08-05) —
          this page is visibility only. Adding a policy lives in the topbar + Policies. */}
      <div className="b2b-page__head">
        <div>
          <h1 className="b2b-page__title">{page.title}</h1>
          <div className="b2b-page__subtitle">{c.subtitle(CONTRACTS.length, productCount)}</div>
        </div>
      </div>
      <div className="b2b-page__filters">
        <FilterBar
          categories={categories}
          value={filters}
          onChange={setFilters}
          countRows={(draft) => CONTRACTS.filter((r) => matches(r, draft, q)).length}
          search={{ value: q, onChange: setQ, placeholder: c.searchPlaceholder }}
          onExport={exportCsv}
          t={t.filterBar}
        />
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        onRowClick={setDetail}
        empty={{
          icon: 'file-text',
          title: c.emptyTitle,
          hint: c.emptyHint,
          actionLabel: c.emptyAction,
          onAction: clearAll,
        }}
      />
      {detail && <ContractDetailsDrawer contract={detail} onClose={() => setDetail(null)} />}
    </>
  )
}
