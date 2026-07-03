import { useState } from 'react'
import ActionMenu from '../components/ActionMenu.jsx'
import Badge from '../components/Badge.jsx'
import { Button } from '../components/Button.jsx'
import DataTable from '../components/DataTable.jsx'
import FilterChips from '../components/FilterChips.jsx'
import Icon from '../lib/Icon.jsx'
import { kaB2B } from './strings.js'
import { CONTRACTS, PRODUCTS, PRODUCT_ORDER } from './data/contracts.js'

/* ContractsScreen — company-level contracts (CNT-…) as a Data Table with
   product filter chips. Contract DETAIL page is deferred — row actions
   are stubs until the detail flow exists. */

const STATUS_BADGE = { active: 'success', preparing: 'warning', ended: 'neutral' }

function ProductTile({ product }) {
  const p = PRODUCTS[product]
  return (
    <span className="gpi-table__media" aria-hidden="true">
      {p.img ? (
        <img src={`${import.meta.env.BASE_URL}products/${p.img}`} alt="" />
      ) : (
        <Icon name="shield-check" size={24} />
      )}
    </span>
  )
}

export default function ContractsScreen() {
  const t = kaB2B
  const c = t.contracts
  const page = t.pages.contracts
  const [filter, setFilter] = useState('all')

  const chips = [
    { id: 'all', label: c.all, count: CONTRACTS.length },
    ...PRODUCT_ORDER.map((p) => ({
      id: p,
      label: PRODUCTS[p].chip,
      count: CONTRACTS.filter((r) => r.product === p).length,
    })),
  ]
  const rows = filter === 'all' ? CONTRACTS : CONTRACTS.filter((r) => r.product === filter)

  const rowActions = [
    { id: 'details', label: c.actions.details },
    { id: 'deactivate', label: c.actions.deactivate },
    { divider: true },
    { id: 'revoke', label: c.actions.revoke, destructive: true },
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
      render: () => <ActionMenu items={rowActions} label={c.actions.menu} />,
    },
  ]

  return (
    <>
      <div className="b2b-page__head">
        <div>
          <h1 className="b2b-page__title">{page.title}</h1>
          <div className="b2b-page__subtitle">{page.subtitle}</div>
        </div>
        <div className="b2b-page__actions">
          <Button variant="secondary" size="md" leadingIcon="download">
            {t.stub.export}
          </Button>
          <Button variant="primary" size="md" leadingIcon="plus">
            {c.newContract}
          </Button>
        </div>
      </div>
      <div className="b2b-page__filters">
        <FilterChips options={chips} value={filter} onChange={setFilter} label={c.filterLabel} />
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        empty={{
          icon: 'file-text',
          title: c.emptyTitle,
          hint: c.emptyHint,
          actionLabel: c.emptyAction,
          onAction: () => setFilter('all'),
        }}
      />
    </>
  )
}
