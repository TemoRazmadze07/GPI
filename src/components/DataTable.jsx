import { useEffect, useRef, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { Button } from './Button.jsx'

/* DataTable — design-system Data Table v1 (+ sorting, 2026-07-16).
   columns: [{ key, header, width?, align?: 'right', render(row), sortable? }]
   rows + rowKey(row); onRowClick(row) makes whole rows clickable (hover bg).
   empty: { icon?, title, hint?, actionLabel?, onAction? } shown when rows is empty.
   Sorting is CONTROLLED: pass sort={ key, dir: 'asc'|'desc' } + onSort(key);
   columns opt in via `sortable: true` (identifiers like №s stay unsortable —
   user rule 2026-07-16). The table only renders the header affordance — the
   screen owns comparator + order.
   Deferred by spec: selection/bulk bar, column resize, sticky header. */
export default function DataTable({ columns, rows, rowKey, onRowClick, empty, sort, onSort }) {
  /* Pinned-edge elevation: a shadow shows ONLY while content is hidden behind
     that pinned column (user rule 2026-07-16 — never a stroke; a table that
     fits gets no scroll and no decoration). Re-checked on scroll, resize, and
     whenever columns/rows change (customization, filters, tab switch). */
  const wrapRef = useRef(null)
  const [edges, setEdges] = useState({ left: false, right: false })
  const updateEdges = () => {
    const el = wrapRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const next = { left: el.scrollLeft > 0, right: max > 0 && el.scrollLeft < max - 1 }
    setEdges((e) => (e.left === next.left && e.right === next.right ? e : next))
  }
  useEffect(() => {
    updateEdges()
    window.addEventListener('resize', updateEdges)
    return () => window.removeEventListener('resize', updateEdges)
  })

  if (rows.length === 0 && empty) {
    return (
      <div className="gpi-table gpi-table--empty">
        <span className="gpi-table__empty-icon">
          <Icon name={empty.icon || 'file-text'} size={24} />
        </span>
        <div className="gpi-table__empty-title">{empty.title}</div>
        {empty.hint && <div className="gpi-table__empty-hint">{empty.hint}</div>}
        {empty.actionLabel && (
          <Button variant="secondary" size="md" onClick={empty.onAction}>
            {empty.actionLabel}
          </Button>
        )}
      </div>
    )
  }
  return (
    <div
      className={`gpi-table gpi-table--pin${edges.left ? ' is-shadow-left' : ''}${edges.right ? ' is-shadow-right' : ''}`}
      ref={wrapRef}
      onScroll={updateEdges}
    >
      <table>
        <thead>
          <tr>
            {columns.map((c) => {
              const active = c.sortable && sort?.key === c.key
              return (
                <th
                  key={c.key}
                  scope="col"
                  style={c.width ? { width: c.width } : undefined}
                  className={c.align === 'right' ? 'is-right' : undefined}
                  aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      className={`gpi-table__sortbtn${active ? ' is-active' : ''}`}
                      onClick={() => onSort?.(c.key)}
                    >
                      {c.header}
                      <Icon
                        name={active ? (sort.dir === 'asc' ? 'chevron-up' : 'chevron-down') : 'arrow-up-down'}
                        size={16}
                      />
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={onRowClick ? 'is-clickable' : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((c) => (
                <td key={c.key} className={c.align === 'right' ? 'is-right' : undefined}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
