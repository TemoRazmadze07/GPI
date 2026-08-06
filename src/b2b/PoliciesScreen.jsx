import { useState } from 'react'
import ActionMenu from '../components/ActionMenu.jsx'
import Badge from '../components/Badge.jsx'
import { Button } from '../components/Button.jsx'
import ColumnsModal from '../components/ColumnsModal.jsx'
import DataTable from '../components/DataTable.jsx'
import Icon from '../lib/Icon.jsx'
import FilterBar from '../components/FilterBar.jsx'
import { datePresets } from '../components/FilterPopover.jsx'
import Pagination from '../components/Pagination.jsx'
import Tabs from '../components/Tabs.jsx'
import { kaB2B } from './strings.js'
import { PRODUCTS, PRODUCT_ORDER } from './data/contracts.js'
import { POLICIES, PROP_TYPE_ORDER } from './data/policies.js'

/* PoliciesScreen — one page, product tabs (concept locked 2026-07-15).
   Each product = its OWN table because the policy identifier differs, but the
   column ORDER is standardized (2026-07-16, aligned with the team prototype's
   policy tables: პოლისის # · დაზღვეული · პაკეტი · დაწყება · დასრულება ·
   სტატუსი + კონტრაქტის # on product lists):

     identifier (stacked) · product extras · კონტრაქტი № · პოლისი № ·
     პერიოდი · სტატუსი · actions

   Shared row fields (contract/start/end/status) are filtered generically;
   only the identifier block + extras vary per product. B2BApp remounts the
   screen per tab (key=product) → clean state per tab. */

const STATUS_BADGE = { active: 'success', ended: 'neutral', canceled: 'error' }
const PAGE_SIZE = 10

const toDate = (s) => {
  const [d, m, y] = s.split('.').map(Number)
  return new Date(y, m - 1, d)
}
const fmtGel = (n) => `₾ ${n.toLocaleString('en-US')}`

/* Identifier cell: primary line + muted secondary (name/პირადი №, plate/model) */
const Stack = ({ primary, secondary, mono = false }) => (
  <span className="gpi-table__stack">
    <span className={mono ? 'gpi-table__id' : undefined}>{primary}</span>
    <span className="gpi-table__sub">{secondary}</span>
  </span>
)

/* Product-specific parts only: identifier + extra columns, extra filter
   categories, search haystack, CSV identifier columns. */
function productConfig(product, rows, p) {
  const personCol = (header) => ({
    key: 'who',
    header,
    render: (r) => <Stack primary={r.name} secondary={r.pid} />,
  })

  switch (product) {
    case 'health': {
      const relLabel = (r) =>
        r.relation === 'employee' ? p.relation.employee : `${p.relation[r.relation]} → ${r.linkedTo}`
      return {
        columns: [
          personCol(p.cols.insured),
          {
            key: 'relation',
            header: p.cols.relation,
            width: 176,
            render: (r) =>
              r.relation === 'employee' ? (
                p.relation.employee
              ) : (
                /* long family labels truncate (full text in the tooltip) so
                   the table can fit WITHOUT scrolling where possible */
                <span className="gpi-table__trunc gpi-table__muted" title={relLabel(r)}>
                  {relLabel(r)}
                </span>
              ),
          },
          { key: 'package', header: p.cols.package, width: 100, render: (r) => r.package },
        ],
        categories: [
          {
            id: 'package',
            label: p.filterCats.package,
            type: 'pills',
            options: ['ბაზისი', 'ოპტიმალი', 'პრემიუმი'].map((pk) => ({
              id: pk,
              label: pk,
              count: rows.filter((r) => r.package === pk).length,
            })),
          },
          {
            id: 'relation',
            label: p.filterCats.relation,
            type: 'pills',
            options: [
              { id: 'employee', label: p.relation.employee, count: rows.filter((r) => r.relation === 'employee').length },
              { id: 'family', label: p.familyGroup, count: rows.filter((r) => r.relation !== 'employee').length },
            ],
          },
        ],
        match: (r, f) =>
          (!f.package?.length || f.package.includes(r.package)) &&
          (!f.relation?.length ||
            f.relation.includes(r.relation === 'employee' ? 'employee' : 'family')),
        hay: (r) => `${r.name} ${r.pid} ${r.package}`,
        csv: {
          head: [p.cols.person, p.cols.pid, p.cols.relation, p.cols.package],
          cells: (r) => [r.name, r.pid, relLabel(r), r.package],
        },
      }
    }
    case 'auto':
      return {
        columns: [
          {
            key: 'who',
            header: p.cols.vehicle,
            render: (r) => <Stack primary={r.plate} secondary={r.vehicle} mono />,
          },
          { key: 'owner', header: p.cols.owner, width: 176, render: (r) => r.owner },
        ],
        categories: [],
        match: () => true,
        hay: (r) => `${r.plate} ${r.vehicle} ${r.owner}`,
        csv: {
          head: [p.cols.plate, p.cols.vehicle, p.cols.owner],
          cells: (r) => [r.plate, r.vehicle, r.owner],
        },
      }
    case 'travel':
      return {
        columns: [personCol(p.cols.insured)],
        categories: [],
        match: () => true,
        hay: (r) => `${r.name} ${r.pid}`,
        rowActions: 'travel',
        csv: { head: [p.cols.person, p.cols.pid], cells: (r) => [r.name, r.pid] },
      }
    default: /* property */
      return {
        columns: [
          { key: 'who', header: p.cols.object, render: (r) => <Stack primary={r.address} secondary={r.type} /> },
          { key: 'sum', header: p.cols.sum, width: 128, sortable: true, render: (r) => <span className="gpi-table__id">{fmtGel(r.sum)}</span> },
        ],
        categories: [
          {
            id: 'type',
            label: p.filterCats.type,
            type: 'pills',
            options: PROP_TYPE_ORDER.map((tp) => ({
              id: tp,
              label: tp,
              count: rows.filter((r) => r.type === tp).length,
            })),
          },
        ],
        match: (r, f) => !f.type?.length || f.type.includes(r.type),
        hay: (r) => `${r.address} ${r.type}`,
        csv: {
          head: [p.cols.object, p.cols.type, p.cols.sum],
          cells: (r) => [r.address, r.type, fmtGel(r.sum)],
        },
      }
  }
}

export default function PoliciesScreen({ product = 'health', initialContract = null }) {
  const t = kaB2B
  const p = t.policies
  const rows = POLICIES[product]
  const cfg = productConfig(product, rows, p)

  /* Shared filter categories — identical on every tab (status · contract ·
     product extras · period), matching the standardized column order. */
  const contractIds = [...new Set(rows.map((r) => r.contract))].sort().reverse()
  const categories = [
    {
      id: 'status',
      label: p.filterCats.status,
      type: 'pills',
      options: ['active', 'ended', 'canceled'].map((s) => ({
        id: s,
        label: p.status[s],
        count: rows.filter((r) => r.status === s).length,
      })),
    },
    {
      id: 'contract',
      label: p.filterCats.contract,
      type: 'pills',
      options: contractIds.map((c) => ({
        id: c,
        label: c,
        count: rows.filter((r) => r.contract === c).length,
      })),
    },
    ...cfg.categories,
    { id: 'period', label: p.filterCats.period, type: 'range', presets: datePresets(t.filterBar.presets) },
  ]

  const emptyFilters = () => {
    const f = {}
    for (const c of categories) f[c.id] = c.type === 'range' ? null : []
    return f
  }
  /* Deep-link from a contract row (?contract=CNT-…) pre-selects that contract. */
  const [filters, setFiltersRaw] = useState(() => {
    const f = emptyFilters()
    if (initialContract) f.contract = [initialContract]
    return f
  })
  const [q, setQRaw] = useState('')
  const [page, setPage] = useState(1)
  const PREFS_KEY = `gpi.cols.policies.${product}`
  const [colPrefs, setColPrefs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PREFS_KEY)) || null
    } catch {
      return null
    }
  })
  const [customizeOpen, setCustomizeOpen] = useState(false)
  /* Sorting (user rule 2026-07-16): only VARIABLE columns sort — status,
     premium, period (by start date), property's insured sum. Identifiers
     (№s, names, package) don't. Default = latest policy first; first click
     on amounts/dates = largest/latest first, on status = active first. */
  const [sort, setSort] = useState({ key: 'period', dir: 'desc' })
  const setFilters = (f) => {
    setFiltersRaw(f)
    setPage(1)
  }
  const setQ = (v) => {
    setQRaw(v)
    setPage(1)
  }
  const SORT_VALUE = {
    status: (r) => ({ active: 0, ended: 1, canceled: 2 })[r.status],
    premium: (r) => r.premium,
    sum: (r) => r.sum,
    period: (r) => toDate(r.start).getTime(),
  }
  const SORT_FIRST_DIR = { status: 'asc', premium: 'desc', sum: 'desc', period: 'desc' }
  const onSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: SORT_FIRST_DIR[key] }))
    setPage(1)
  }

  const matches = (r, f, query) => {
    if (f.status?.length && !f.status.includes(r.status)) return false
    if (f.contract?.length && !f.contract.includes(r.contract)) return false
    if (f.period && !(toDate(r.start) <= f.period.to && toDate(r.end) >= f.period.from)) return false
    if (!cfg.match(r, f)) return false
    if (query && !`${cfg.hay(r)} ${r.id} ${r.contract}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  }
  const filtered = rows.filter((r) => matches(r, filters, q))
  const val = SORT_VALUE[sort.key]
  const sorted = [...filtered].sort((a, b) => {
    const d = val(a) < val(b) ? -1 : val(a) > val(b) ? 1 : 0
    return sort.dir === 'asc' ? d : -d
  })
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const total = PRODUCT_ORDER.reduce((n, pr) => n + POLICIES[pr].length, 0)

  const rowActions = [
    { id: 'details', label: p.actions.details },
    ...(cfg.rowActions === 'travel' ? [{ id: 'pdf', label: p.actions.pdf }] : []),
    { divider: true },
    { id: 'cancel', label: p.actions.cancel, destructive: true },
  ]
  /* Shared tail — same columns in the same places on every tab.
     premium/period/status opt into sorting; №s stay plain headers. */
  const baseCols = [
    ...cfg.columns,
    {
      key: 'premium',
      header: p.cols.premium,
      width: 116,
      sortable: true,
      render: (r) => (
        <span className="gpi-table__id">
          {fmtGel(r.premium)}
          {product === 'health' && <span className="gpi-table__muted"> {p.perMonth}</span>}
        </span>
      ),
    },
    { key: 'contract', header: p.cols.contract, width: 132, render: (r) => <span className="gpi-table__id">{r.contract}</span> },
    { key: 'id', header: p.cols.policy, width: 132, render: (r) => <span className="gpi-table__id">{r.id}</span> },
    { key: 'period', header: p.cols.period, width: 128, sortable: true, render: (r) => `${r.start} — ${r.end}` },
    {
      key: 'status',
      header: p.cols.status,
      width: 128,
      sortable: true,
      render: (r) => (
        <Badge color={STATUS_BADGE[r.status]} dot>
          {p.status[r.status]}
        </Badge>
      ),
    },
  ]

  /* Column customization (2026-07-16): the first column (identifier — also
     the PINNED one) is locked visible + first; the rest reorder/hide via the
     ✎ modal. Preference persists per product tab. CSV stays FULL — hiding is
     a viewing preference, not a data choice. */
  const applyPrefs = (cols, prefs) => {
    if (!prefs) return cols
    const byKey = Object.fromEntries(cols.map((c) => [c.key, c]))
    const ordered = (prefs.order || []).map((k) => byKey[k]).filter((c) => c && c !== cols[0])
    const rest = cols.slice(1).filter((c) => !ordered.includes(c))
    const hidden = new Set(prefs.hidden || [])
    return [cols[0], ...[...ordered, ...rest].filter((c) => !hidden.has(c.key))]
  }
  const saveColPrefs = (next) => {
    setColPrefs(next)
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(next))
    } catch {}
    setCustomizeOpen(false)
    if (next.hidden.includes(sort.key)) setSort({ key: 'period', dir: 'desc' })
  }

  const columns = [
    ...applyPrefs(baseCols, colPrefs),
    {
      key: 'actions',
      header: (
        <button
          type="button"
          className="gpi-table__custbtn"
          aria-label={t.tableCustomize.title}
          aria-haspopup="dialog"
          onClick={() => setCustomizeOpen(true)}
        >
          <Icon name="pencil" size={16} />
        </button>
      ),
      width: 48,
      align: 'right',
      render: () => <ActionMenu items={rowActions} label={p.actions.menu} />,
    },
  ]

  /* Exports in the on-screen SORTED order */
  const exportCsv = () => {
    const head = [...cfg.csv.head, p.cols.premium, p.cols.contract, p.cols.policy, p.cols.start, p.cols.end, p.cols.status]
    const lines = sorted.map((r) => [...cfg.csv.cells(r), r.premium, r.contract, r.id, r.start, r.end, p.status[r.status]])
    const csv =
      '\uFEFF' +
      [head, ...lines].map((l) => l.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `policies-${product}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="b2b-page__head">
        <div>
          <h1 className="b2b-page__title">{t.nav.policies}</h1>
          <div className="b2b-page__subtitle">{p.subtitle(total, PRODUCT_ORDER.length)}</div>
        </div>
        <div className="b2b-page__actions">
          <Button
            variant="primary"
            size="md"
            leadingIcon="plus"
            onClick={() => (window.location.hash = '#/b2b/insured/add')}
          >
            {t.actions.addPolicy}
          </Button>
        </div>
      </div>
      <div className="b2b-page__tabs">
        <Tabs
          items={PRODUCT_ORDER.map((pr) => ({ id: pr, label: PRODUCTS[pr].chip, count: POLICIES[pr].length }))}
          value={product}
          onChange={(id) => (window.location.hash = `#/b2b/policies/${id}`)}
          label={p.tabsLabel}
        />
      </div>
      <div className="b2b-page__filters">
        <FilterBar
          categories={categories}
          value={filters}
          onChange={setFilters}
          countRows={(draft) => rows.filter((r) => matches(r, draft, q)).length}
          search={{ value: q, onChange: setQ, placeholder: p.search[product] }}
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
          icon: 'users',
          title: p.emptyTitle,
          hint: p.emptyHint,
          actionLabel: p.emptyAction,
          onAction: () => {
            setFiltersRaw(emptyFilters())
            setQRaw('')
            setPage(1)
          },
        }}
      />
      {pages > 1 && (
        <div className="b2b-page__pagination">
          <Pagination current={page} total={pages} onChange={setPage} />
        </div>
      )}
      {customizeOpen && (
        <ColumnsModal
          columns={baseCols.map((c, i) => ({ key: c.key, label: c.header, locked: i === 0 }))}
          value={colPrefs}
          onSave={saveColPrefs}
          onClose={() => setCustomizeOpen(false)}
          t={t.tableCustomize}
        />
      )}
    </>
  )
}
