import { useState } from 'react'
import Badge from '../components/Badge.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import DataTable from '../components/DataTable.jsx'
import FilterBar from '../components/FilterBar.jsx'
import { datePresets } from '../components/FilterPopover.jsx'
import Pagination from '../components/Pagination.jsx'
import { kaB2B } from './strings.js'
import { STATEMENT, STATEMENT_PERIODS } from './data/statement.js'

/* StatementScreen — finances → ამონაწერი. A READ-ONLY per-insured premium
   ledger with the company/employee cost split (concept agreed 2026-07-20):
   table + filters only, NO actions. The prototype's KPIs, % cost-share
   manager, save/Excel/PDF, per-row checkbox + PDF, list/invoice toggle and
   product picker are intentionally omitted; the editable % inputs are shown as
   plain read-only text. Cost-sharing is health-only, so rows = active health
   insured (see data/statement.js). Consistent with the other B2B tables. */

const STATUS_BADGE = { paid: 'success', due: 'warning' }
const PAGE_SIZE = 20

const toDate = (s) => {
  const [d, m, y] = s.split('.').map(Number)
  return new Date(y, m - 1, d)
}
const fmtGel = (n) => `₾ ${n.toLocaleString('en-US')}`

function matches(r, f, q) {
  if (f.status?.length && !f.status.includes(r.status)) return false
  if (f.contract?.length && !f.contract.includes(r.contract)) return false
  if (f.package?.length && !f.package.includes(r.package)) return false
  if (f.period && !(toDate(r.periodDate) >= f.period.from && toDate(r.periodDate) <= f.period.to)) return false
  if (q) {
    const hay = `${r.name} ${r.pid} ${r.contract}`.toLowerCase()
    if (!hay.includes(q.toLowerCase())) return false
  }
  return true
}

export default function StatementScreen() {
  const t = kaB2B
  const c = t.statement
  const [filters, setFiltersRaw] = useState({ status: [], contract: [], package: [], period: null })
  const [q, setQRaw] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: 'period', dir: 'desc' })

  const setFilters = (f) => {
    setFiltersRaw(f)
    setPage(1)
  }
  const setQ = (v) => {
    setQRaw(v)
    setPage(1)
  }
  const clearAll = () => {
    setFiltersRaw({ status: [], contract: [], package: [], period: null })
    setQRaw('')
    setPage(1)
  }

  const contractIds = [...new Set(STATEMENT.map((r) => r.contract))].sort().reverse()
  const categories = [
    {
      id: 'status',
      label: c.filterCats.status,
      type: 'pills',
      options: ['paid', 'due'].map((s) => ({
        id: s,
        label: c.status[s],
        count: STATEMENT.filter((r) => r.status === s).length,
      })),
    },
    {
      id: 'contract',
      label: c.filterCats.contract,
      type: 'pills',
      options: contractIds.map((id) => ({
        id,
        label: id,
        count: STATEMENT.filter((r) => r.contract === id).length,
      })),
    },
    {
      id: 'package',
      label: c.filterCats.package,
      type: 'pills',
      options: ['ბაზისი', 'ოპტიმალი', 'პრემიუმი'].map((pk) => ({
        id: pk,
        label: pk,
        count: STATEMENT.filter((r) => r.package === pk).length,
      })),
    },
    { id: 'period', label: c.filterCats.period, type: 'range', presets: datePresets(t.filterBar.presets) },
  ]

  const filtered = STATEMENT.filter((r) => matches(r, filters, q))
  const SORT_VALUE = {
    period: (r) => toDate(r.periodDate).getTime(),
    premium: (r) => r.premium,
    paid: (r) => r.paid,
    status: (r) => ({ paid: 0, due: 1 })[r.status],
  }
  const SORT_FIRST_DIR = { period: 'desc', premium: 'desc', paid: 'desc', status: 'asc' }
  const onSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: SORT_FIRST_DIR[key] }))
    setPage(1)
  }
  const val = SORT_VALUE[sort.key]
  const sorted = [...filtered].sort((a, b) => {
    const d = val(a) < val(b) ? -1 : val(a) > val(b) ? 1 : 0
    return sort.dir === 'asc' ? d : -d
  })
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const exportCsv = () => {
    const head = [
      c.cols.insured,
      c.cols.pid,
      c.cols.contract,
      c.cols.package,
      c.cols.period,
      c.cols.premium,
      c.cols.paid,
      c.cols.companyPct,
      c.cols.companyGel,
      c.cols.employeePct,
      c.cols.employeeGel,
      c.cols.status,
    ]
    const lines = sorted.map((r) => [
      r.name,
      r.pid,
      r.contract,
      r.package,
      r.period,
      r.premium,
      r.paid,
      `${r.companyPct}%`,
      r.companyGel,
      `${r.employeePct}%`,
      r.employeeGel,
      c.status[r.status],
    ])
    const csv =
      '﻿' +
      [head, ...lines].map((l) => l.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'statement.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const Stack = ({ primary, secondary }) => (
    <span className="gpi-table__stack">
      <span>{primary}</span>
      <span className="gpi-table__sub gpi-table__id">{secondary}</span>
    </span>
  )

  /* Company columns carry an indigo (secondary) header tint, employee columns a
     pink (brand) tint — grouping only; the VALUES stay neutral text so they
     pass AA. The % cells are plain read-only text (were editable in the
     prototype). */
  const columns = [
    { key: 'who', header: c.cols.insured, render: (r) => <Stack primary={r.name} secondary={r.pid} /> },
    { key: 'contract', header: c.cols.contract, width: 116, render: (r) => <span className="gpi-table__id">{r.contract}</span> },
    { key: 'package', header: c.cols.package, width: 84, render: (r) => r.package },
    { key: 'period', header: c.cols.period, width: 104, sortable: true, render: (r) => r.period },
    { key: 'premium', header: c.cols.premium, width: 88, align: 'right', sortable: true, render: (r) => <span className="gpi-table__id">{fmtGel(r.premium)}</span> },
    { key: 'paid', header: c.cols.paid, width: 88, align: 'right', sortable: true, render: (r) => <span className="gpi-table__id">{fmtGel(r.paid)}</span> },
    { key: 'companyPct', header: <span className="b2b-stmt__co">{c.cols.companyPct}</span>, width: 72, align: 'right', render: (r) => `${r.companyPct}%` },
    { key: 'companyGel', header: <span className="b2b-stmt__co">{c.cols.companyGel}</span>, width: 88, align: 'right', render: (r) => <span className="gpi-table__id">{fmtGel(r.companyGel)}</span> },
    { key: 'employeePct', header: <span className="b2b-stmt__em">{c.cols.employeePct}</span>, width: 76, align: 'right', render: (r) => `${r.employeePct}%` },
    { key: 'employeeGel', header: <span className="b2b-stmt__em">{c.cols.employeeGel}</span>, width: 88, align: 'right', render: (r) => <span className="gpi-table__id">{fmtGel(r.employeeGel)}</span> },
    {
      key: 'status',
      header: c.cols.status,
      width: 108,
      sortable: true,
      render: (r) => (
        <Badge color={STATUS_BADGE[r.status]} dot>
          {c.status[r.status]}
        </Badge>
      ),
    },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: t.nav.finances }]} current={t.nav.statement} label={t.crumbsLabel} />
      <div className="b2b-page__head">
        <div>
          <h1 className="b2b-page__title">{t.nav.statement}</h1>
          <div className="b2b-page__subtitle">{c.subtitle(filtered.length)}</div>
        </div>
      </div>
      <div className="b2b-page__filters">
        <FilterBar
          categories={categories}
          value={filters}
          onChange={setFilters}
          countRows={(draft) => STATEMENT.filter((r) => matches(r, draft, q)).length}
          search={{ value: q, onChange: setQ, placeholder: c.searchPlaceholder }}
          onExport={exportCsv}
          t={t.filterBar}
        />
      </div>
      <DataTable
        columns={columns}
        rows={pageRows}
        rowKey={(r) => r.id}
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
    </>
  )
}
