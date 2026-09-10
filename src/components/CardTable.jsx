import Icon from '../lib/Icon.jsx'
import { TableEmpty } from './DataTable.jsx'

/* CardTable — the appointments list's grammar as a shared component (2026-09-10):
   one sunken column-header band (`.gpi-table__head`), then every record as its
   own bordered card (`.gpi-row`, radius/lg inside the radius/xl section card —
   the concentric-corner ladder), 12px apart. Same column config as DataTable,
   so a screen can move between the two grammars without rewriting its columns:
     columns: [{ key, header, width?, align?: 'right', render(row), rowHeader?, icon? }]
   · width     → the grid track (a fixed px width; omitted = the flexible column).
   · rowHeader → the cell that names the row (role rowheader; on the ≤767 stack it
                 takes the top, full width, over a divider).
   · icon      → the ≤767 leading meta glyph (mobile list/table rule 2026-07-28:
                 when the header band goes, icons replace the column labels).
                 Hidden on desktop by the existing `.gpi-cell__mico` rule.
   · align: 'right' → right-aligned on desktop, a full-width footer on the stack
                 (row actions; their icon buttons get labelled there like the
                 appointments footer — consumers ship `.gpi-iconbtn__label` spans).
   Semantics stay a TABLE (ARIA table/row/rowheader/cell roles on the divs) so
   the screen-reader experience matches DataTable; `caption` names it.
   `--cols` is set inline from the config, so the band and the rows share one
   template with no per-screen CSS. No date grouping on purpose — the rows carry
   their own dates; sticky date separators stay an appointments-list feature.
   rowClassName(row) — per-row state hook (e.g. an in-network Curatio record).
   Decorative only: the row's content must still carry the meaning (SC 1.4.1). */
export default function CardTable({ columns, rows, rowKey, caption, rowClassName, empty }) {
  if (rows.length === 0 && empty) return <TableEmpty empty={empty} />
  const cols = columns.map((c) => c.width || 'minmax(0, 1fr)').join(' ')
  return (
    <div className="gpi-ctable" role="table" aria-label={caption} style={{ '--cols': cols }}>
      <div className="gpi-table__head" role="row">
        {columns.map((c) => (
          <div key={c.key} role="columnheader" className={`t-label gpi-muted${c.align === 'right' ? ' is-right' : ''}`}>
            {c.header}
          </div>
        ))}
      </div>
      <div className="gpi-ctable__rows" role="rowgroup">
        {rows.map((row) => {
          const extra = rowClassName?.(row)
          return (
            <div key={rowKey(row)} className={`gpi-row${extra ? ` ${extra}` : ''}`} role="row">
              {columns.map((c) => (
                <div
                  key={c.key}
                  role={c.rowHeader ? 'rowheader' : 'cell'}
                  className={[
                    'gpi-cell gpi-ctable__cell',
                    c.rowHeader ? 'gpi-ctable__cell--head' : '',
                    c.icon ? 'gpi-ctable__cell--meta' : '',
                    c.align === 'right' ? 'gpi-cell--right' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {c.icon && <Icon name={c.icon} size={16} className="gpi-cell__mico" aria-hidden="true" />}
                  {c.render(row)}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
