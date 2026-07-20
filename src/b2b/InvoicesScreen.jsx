import { useState } from 'react'
import ActionMenu from '../components/ActionMenu.jsx'
import Badge from '../components/Badge.jsx'
import { Button } from '../components/Button.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import DataTable from '../components/DataTable.jsx'
import FilterBar from '../components/FilterBar.jsx'
import { datePresets } from '../components/FilterPopover.jsx'
import Pagination from '../components/Pagination.jsx'
import StatTile from '../components/StatTile.jsx'
import InvoiceDetailsDrawer from './InvoiceDetailsDrawer.jsx'
import { kaB2B } from './strings.js'
import { PRODUCTS, PRODUCT_ORDER } from './data/contracts.js'
import { INVOICES, TODAY, toDate, fmtGel, relDays, STATUS_SORT } from './data/invoices.js'

/* InvoicesScreen — the finances/invoices index (concept agreed in chat
   2026-07-20): a finance summary strip (overdue / due / paid-this-year) over
   ONE unified table behind the common Filter Bar, consistent with Contracts &
   Policies. Invoice details open in the shared right-side Drawer. Invoices are
   GENERATED (not user-created) so there is no "new invoice" CTA; `გადახდა`
   hands off to GPI's embedded payment service (payment flow out of scope). */

const STATUS_BADGE = { overdue: 'error', due: 'warning', paid: 'success', credited: 'neutral' }
const PAGE_SIZE = 10

const sum = (arr) => arr.reduce((n, i) => n + i.amount, 0)

function matches(r, f, q) {
  if (f.status?.length && !f.status.includes(r.status)) return false
  if (f.product?.length && !f.product.includes(r.product)) return false
  if (f.contract?.length && !f.contract.includes(r.contract)) return false
  if (f.period && !(toDate(r.issued) <= f.period.to && toDate(r.due) >= f.period.from)) return false
  if (q) {
    const hay = `${r.id} ${r.contract} ${PRODUCTS[r.product].label} ${r.period}`.toLowerCase()
    if (!hay.includes(q.toLowerCase())) return false
  }
  return true
}

export default function InvoicesScreen() {
  const t = kaB2B
  const c = t.invoices
  const [filters, setFiltersRaw] = useState({ status: [], product: [], contract: [], period: null })
  const [q, setQRaw] = useState('')
  const [page, setPage] = useState(1)
  /* Default sort = status priority (overdue → due → paid → credited), so the
     ledger opens on what needs attention; due date breaks ties. Sortable
     columns: due, amount, status. Identifiers never sort (user rule). */
  const [sort, setSort] = useState({ key: 'status', dir: 'asc' })
  const [detail, setDetail] = useState(null)

  const setFilters = (f) => {
    setFiltersRaw(f)
    setPage(1)
  }
  const setQ = (v) => {
    setQRaw(v)
    setPage(1)
  }
  const clearAll = () => {
    setFiltersRaw({ status: [], product: [], contract: [], period: null })
    setQRaw('')
    setPage(1)
  }

  /* Payment is handled by GPI's embedded / redirect payment service — OUT OF
     SCOPE here (user 2026-07-20). This is the single handoff point; wire the
     real redirect (invoice id + amount) once that service is available. */
  const payInvoice = () => {}

  const overdue = INVOICES.filter((i) => i.status === 'overdue')
  const due = INVOICES.filter((i) => i.status === 'due')
  const paidYtd = INVOICES.filter(
    (i) => i.status === 'paid' && toDate(i.paidOn).getFullYear() === TODAY.getFullYear(),
  )
  const nextDue = [...due].sort((a, b) => toDate(a.due) - toDate(b.due))[0]

  const contractIds = [...new Set(INVOICES.map((r) => r.contract))].sort().reverse()
  const categories = [
    {
      id: 'status',
      label: c.filterCats.status,
      type: 'pills',
      options: ['overdue', 'due', 'paid', 'credited'].map((s) => ({
        id: s,
        label: c.status[s],
        count: INVOICES.filter((r) => r.status === s).length,
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
        count: INVOICES.filter((r) => r.product === p).length,
      })),
    },
    {
      id: 'contract',
      label: c.filterCats.contract,
      type: 'pills',
      options: contractIds.map((id) => ({
        id,
        label: id,
        count: INVOICES.filter((r) => r.contract === id).length,
      })),
    },
    { id: 'period', label: c.filterCats.period, type: 'range', presets: datePresets(t.filterBar.presets) },
  ]

  const filtered = INVOICES.filter((r) => matches(r, filters, q))
  const SORT_VALUE = {
    status: (r) => STATUS_SORT[r.status],
    due: (r) => toDate(r.due).getTime(),
    amount: (r) => r.amount,
  }
  const SORT_FIRST_DIR = { status: 'asc', due: 'asc', amount: 'desc' }
  const onSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: SORT_FIRST_DIR[key] }))
    setPage(1)
  }
  const val = SORT_VALUE[sort.key]
  /* Tie-break by due date (ascending) so within a status group the most urgent
     invoice sits on top. */
  const sorted = [...filtered].sort((a, b) => {
    const d = val(a) < val(b) ? -1 : val(a) > val(b) ? 1 : 0
    const primary = sort.dir === 'asc' ? d : -d
    if (primary !== 0) return primary
    return toDate(a.due) - toDate(b.due)
  })
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const exportCsv = () => {
    const head = [c.cols.invoice, c.filterCats.product, c.filterCats.contract, c.cols.subject, c.cols.due, c.cols.amount, c.cols.status]
    const lines = sorted.map((r) => [r.id, PRODUCTS[r.product].label, r.contract, r.period, r.due, r.amount, c.status[r.status]])
    const csv =
      '﻿' +
      [head, ...lines].map((l) => l.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'invoices.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  /* Pay is surfaced as a row button (below) for unpaid invoices — the kebab
     keeps only the secondary actions (details opens the drawer, PDF). */
  const rowActionsFor = (r) => [
    { id: 'details', label: c.actions.details, onSelect: () => setDetail(r) },
    { id: 'pdf', label: c.actions.pdf, onSelect: () => {} },
  ]

  const relText = (r) =>
    r.status === 'overdue' ? c.rel.overdue(relDays(r)) : r.status === 'due' ? c.rel.due(relDays(r)) : c.rel[r.status] || ''

  const columns = [
    { key: 'invoice', header: c.cols.invoice, width: 140, render: (r) => <span className="gpi-table__id">{r.id}</span> },
    {
      key: 'subject',
      header: c.cols.subject,
      render: (r) => (
        <span className="gpi-table__stack">
          <span>{PRODUCTS[r.product].label}</span>
          <span className="gpi-table__sub">
            {r.contract} · {r.period}
          </span>
        </span>
      ),
    },
    {
      key: 'due',
      header: c.cols.due,
      width: 156,
      sortable: true,
      render: (r) => (
        <span className="gpi-table__stack">
          <span>{r.due}</span>
          <span className={r.status === 'overdue' ? 'b2b-inv__overdue' : 'gpi-table__sub'}>{relText(r)}</span>
        </span>
      ),
    },
    {
      key: 'amount',
      header: c.cols.amount,
      width: 128,
      align: 'right',
      sortable: true,
      render: (r) => <span className="gpi-table__id">{fmtGel(r.amount)}</span>,
    },
    {
      key: 'status',
      header: c.cols.status,
      width: 156,
      sortable: true,
      render: (r) => (
        <Badge color={STATUS_BADGE[r.status]} dot>
          {c.status[r.status]}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: 152,
      align: 'right',
      render: (r) => (
        <div className="b2b-inv__rowact">
          {(r.status === 'overdue' || r.status === 'due') && (
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                /* Don't also open the row's detail drawer (onRowClick). */
                e.stopPropagation()
                payInvoice(r)
              }}
            >
              {c.actions.pay}
            </Button>
          )}
          <ActionMenu items={rowActionsFor(r)} label={c.actions.menu} />
        </div>
      ),
    },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: t.nav.finances }]} current={t.nav.invoices} label={t.crumbsLabel} />
      <div className="b2b-page__head">
        <div>
          <h1 className="b2b-page__title">{t.nav.invoices}</h1>
          <div className="b2b-page__subtitle">{c.subtitle(INVOICES.length, overdue.length)}</div>
        </div>
      </div>

      <div className="b2b-page__summary">
        <StatTile
          tone={overdue.length ? 'danger' : 'success'}
          icon={overdue.length ? 'alert-triangle' : undefined}
          label={c.summary.overdue}
          value={fmtGel(sum(overdue))}
          meta={overdue.length ? c.summary.invoicesN(overdue.length) : c.summary.none}
        />
        <StatTile
          label={c.summary.due}
          value={fmtGel(sum(due))}
          meta={`${c.summary.invoicesN(due.length)}${nextDue ? ` · ${c.summary.nextDue(nextDue.due)}` : ''}`}
        />
        <StatTile
          label={c.summary.paidYtd}
          value={fmtGel(sum(paidYtd))}
          meta={c.summary.invoicesN(paidYtd.length)}
        />
      </div>

      <div className="b2b-page__filters">
        <FilterBar
          categories={categories}
          value={filters}
          onChange={setFilters}
          countRows={(draft) => INVOICES.filter((r) => matches(r, draft, q)).length}
          search={{ value: q, onChange: setQ, placeholder: c.searchPlaceholder }}
          onExport={exportCsv}
          t={t.filterBar}
        />
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        rowKey={(r) => r.id}
        onRowClick={setDetail}
        sort={sort}
        onSort={onSort}
        empty={{
          icon: 'file-text',
          title: c.emptyTitle,
          hint: c.emptyHint,
          actionLabel: c.emptyAction,
          onAction: clearAll,
        }}
      />
      {pages > 1 && (
        <div className="b2b-page__pagination">
          <Pagination current={page} total={pages} onChange={setPage} />
        </div>
      )}
      {detail && <InvoiceDetailsDrawer invoice={detail} onClose={() => setDetail(null)} onPay={payInvoice} />}
    </>
  )
}
