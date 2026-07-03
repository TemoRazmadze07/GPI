import Icon from '../lib/Icon.jsx'
import { Button } from './Button.jsx'

/* DataTable — design-system Data Table v1.
   columns: [{ key, header, width?, align?: 'right', render(row) }]
   rows + rowKey(row); onRowClick(row) makes whole rows clickable (hover bg).
   empty: { icon?, title, hint?, actionLabel?, onAction? } shown when rows is empty.
   Deferred by spec: sorting, selection/bulk bar, column resize, sticky header,
   pagination footer (slot in a later iteration when long tables need them). */
export default function DataTable({ columns, rows, rowKey, onRowClick, empty }) {
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
    <div className="gpi-table">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                style={c.width ? { width: c.width } : undefined}
                className={c.align === 'right' ? 'is-right' : undefined}
              >
                {c.header}
              </th>
            ))}
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
