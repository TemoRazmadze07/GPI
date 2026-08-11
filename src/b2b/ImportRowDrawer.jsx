import { useEffect, useRef } from 'react'
import Drawer from '../components/Drawer.jsx'
import Avatar from '../components/Avatar.jsx'
import Badge from '../components/Badge.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import { Button } from '../components/Button.jsx'
import InsuredFields from './InsuredFields.jsx'
import { kaB2B } from './strings.js'
import { existingEmployees } from './data/addInsured.js'
/* NB `existingEmployees` here is the default-contract fallback only — the
   caller passes the selected contract's roster via the `employees` prop. */

/* ImportRowDrawer — repair one imported row, using the SAME form as the
   single-person step (shared InsuredFields since 2026-08-11) so a person
   edited here and a person typed by hand go through identical affordances.

   Edits apply LIVE: there is no save button and no dirty state. That is
   deliberate — Escape, ×, or an overlay click can never destroy work, so this
   drawer never needs a confirm-on-close, and the counts, the badge and the
   wizard footer all update behind it as you type. */

const t = kaB2B.addIns
const x = t.excel
const f = t.form

const BADGE = { error: 'error', warning: 'warning', exists: 'neutral', ok: 'success' }
const STATUS_LABEL = {
  error: x.status.error,
  warning: x.status.warning,
  exists: x.exists.label,
  ok: x.status.ready,
}

export const rowRef = (r) =>
  (r.firstName || r.lastName) ? `${r.firstName} ${r.lastName}`.trim()
    : r.pid ? `${x.cols.pid} ${r.pid}`
      : `${x.cols.row} ${r.excelRow}`

export default function ImportRowDrawer({ row, rows, onChange, onRemove, onNext, hasNext, onClose, employees = existingEmployees }) {
  const panelRef = useRef(null)

  /* Land on the first control that actually has a problem — the user opened
     this drawer to fix something specific, not to read 13 fields. */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const el = panelRef.current?.querySelector('[data-autofocus] input, [data-autofocus] button, [data-autofocus] select')
      el?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [row?.id])

  if (!row) return null

  const issueFields = new Set(row.issues.map((i) => i.field).filter(Boolean))
  /* The importer's issue records use `linkPid` where the form field is
     `linkedTo` (a spreadsheet links by personal №) — translate at the seam. */
  const alias = (k) => (k === 'linkedTo' ? 'linkPid' : k)
  const bad = (k) => issueFields.has(alias(k))
  const msgFor = (k) => row.issues.find((i) => i.field === alias(k) && i.severity === 'error')?.message
  /* The first field carrying an error gets the autofocus marker. */
  const firstBad = ['pid', 'birth', 'firstName', 'lastName', 'gender', 'pkg', 'relation', 'linkPid', 'who', 'citizen']
    .find((k) => row.issues.some((i) => i.field === k && i.severity === 'error'))
  const mark = (k) => (alias(k) === firstBad ? { 'data-autofocus': 'true' } : {})

  /* Same two namespaces the single form offers: employees already on the
     contract, plus the employees this file itself introduces (`b:` prefixed —
     the wizard's removal cascade depends on that exact shape). */
  const linkOptions = [
    ...employees.map((e) => ({ value: e.id, label: e.name })),
    ...rows
      .filter((p) => p.who === 'employee' && !p.removed && p.id !== row.id)
      .map((p) => ({
        value: `b:${p.id}`,
        label: `${f.linkedNew} ${p.firstName} ${p.lastName}`.trim(),
      })),
  ]

  return (
    <Drawer
      title={`${x.drawer.title} — ${x.cols.row} ${row.excelRow}`}
      closeLabel={x.drawer.close}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" size="md" type="button" onClick={onClose}>
            {x.drawer.close}
          </Button>
          {hasNext && (
            <Button variant="primary" size="md" type="button" trailingIcon="arrow-right" onClick={onNext}>
              {x.drawer.next}
            </Button>
          )}
        </>
      }
    >
      <div ref={panelRef}>
        <div className="b2b-cdrawer__identity">
          <Avatar name={`${row.firstName} ${row.lastName}`} size={40} />
          <div className="b2b-cdrawer__idmeta">
            <span className="b2b-cdrawer__factlbl">
              {x.cols.row} {row.excelRow}
            </span>
            <span className="b2b-cdrawer__name">{rowRef(row)}</span>
          </div>
          <Badge color={BADGE[row.status]} size="sm" dot>
            {STATUS_LABEL[row.status]}
          </Badge>
        </div>

        {row.issues.length > 0 && (
          <InlineAlert tone={row.status === 'error' ? 'error' : 'warning'} title={x.drawer.issuesTitle}>
            <ul className="b2b-xl__issues">
              {row.issues.map((i) => (
                <li key={i.ruleId}>{i.message}</li>
              ))}
            </ul>
          </InlineAlert>
        )}

        <InsuredFields
          className="b2b-wiz__grid b2b-drawer__grid"
          value={row}
          onChange={(k, v) => onChange(row.id, k, v)}
          linkOptions={linkOptions}
          idPrefix={`d-${row.id}`}
          invalid={bad}
          msg={msgFor}
          mark={mark}
        />

        <div className="b2b-wiz__formactions">
          <Button variant="danger-tertiary" size="md" type="button" leadingIcon="trash" onClick={() => onRemove(row.id)}>
            {x.rowRemove}
          </Button>
        </div>
      </div>
    </Drawer>
  )
}
