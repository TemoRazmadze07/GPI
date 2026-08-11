import { useMemo, useState } from 'react'
import Drawer from '../components/Drawer.jsx'
import Avatar from '../components/Avatar.jsx'
import Badge from '../components/Badge.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import { Button } from '../components/Button.jsx'
import InsuredFields from './InsuredFields.jsx'
import { kaB2B } from './strings.js'
import { existingEmployeesFor, packageByValue, validateDraft, nextRequestNo } from './data/addInsured.js'
import { insuredDraftFor, STATUS_BADGE } from './data/policies.js'

/* EditInsuredDrawer — the policy-row drawer on the policies HEALTH tab, in TWO
   modes (user, 2026-08-11):
   · view („დაზღვეულის დეტალები", the default) — read-only facts in the
     contract-drawer grammar; footer = close + „პოლისის ცვლილება".
   · edit („დაზღვეულის რედაქტირება") — the SAME step-2 form as the add-insured
     wizard (shared InsuredFields), pre-populated, saved WITHOUT a review step.
     „შენახვა" still creates an async change REQUEST to GPI back-office (≤24h)
     — skipping review is UI, not pipeline — stated by the info alert, which
     reuses the wizard's own pipeline copy.
   Row click and ⋮ „დეტალურად" land on view; ⋮ „პოლისის ცვლილება" deep-links
   into edit. Cancelling an edit returns to VIEW (drawer stays open); closing
   or cancelling with unsaved changes confirms first. */

const p = kaB2B.policies
const e = p.editDrawer
const t = kaB2B.addIns
const f = t.form

const fmtGel = (n) => `₾ ${n.toFixed(2)}`

export default function EditInsuredDrawer({ row, initialMode = 'view', onClose, onSaved }) {
  const initial = useMemo(() => insuredDraftFor(row), [row])
  const [mode, setMode] = useState(initialMode)
  const [draft, setDraft] = useState(initial)
  const [errors, setErrors] = useState(new Map())

  /* Same live-clearing rule as the wizard: editing a field drops its error;
     switching to employee clears the family-link fields. */
  const onChange = (k, v) => {
    setDraft((d) => {
      if (k === 'who' && v === 'employee') return { ...d, who: v, linkedTo: '', relation: '' }
      return { ...d, [k]: v }
    })
    setErrors((es) => {
      if (!es.has(k)) return es
      const next = new Map(es)
      next.delete(k)
      return next
    })
  }

  const errMsg = (k) => (errors.has(k) ? (errors.get(k) === 'format' ? f.errPid : f.errRequired) : undefined)

  const dirty = mode === 'edit' && JSON.stringify(draft) !== JSON.stringify(initial)
  const confirmDiscard = () => !dirty || window.confirm(e.closeConfirm)
  const close = () => {
    if (!confirmDiscard()) return
    onClose()
  }
  /* Cancel inside edit returns to VIEW, not out of the drawer — the user chose
     this record on purpose; only × / overlay / Esc leave it entirely. */
  const cancelEdit = () => {
    if (!confirmDiscard()) return
    setDraft(initial)
    setErrors(new Map())
    setMode('view')
  }

  const save = () => {
    const bad = validateDraft(draft)
    setErrors(bad)
    if (bad.size) return
    onSaved(row, nextRequestNo())
  }

  /* Family link options: the policy stores the employee's NAME, so names are
     the value space here — current link first, then the contract roster. */
  const roster = existingEmployeesFor(row.contract)
  const linkOptions = [
    ...(initial.linkedTo && !roster.some((emp) => emp.name === initial.linkedTo)
      ? [{ value: initial.linkedTo, label: initial.linkedTo }]
      : []),
    ...roster.map((emp) => ({ value: emp.name, label: emp.name })),
  ]

  /* Read-only facts, mirroring the form's field order (policy context first). */
  const pkg = packageByValue(initial.pkg)
  const facts = [
    { label: p.cols.contract, value: <span className="gpi-table__id">{row.contract}</span> },
    { label: p.cols.period, value: `${row.start} – ${row.end}` },
    /* NOT the wizard's „ვის ამატებთ?" — that's an adding question; a details
       view states the relation (same label as the table column). */
    {
      label: p.cols.relation,
      value: initial.who === 'employee' ? t.who.employee : `${p.relation[row.relation] || ''} → ${row.linkedTo}`,
    },
    { label: f.citizen, value: initial.citizen === 'resident' ? f.resident : f.nonresident },
    { label: f.personalId, value: <span className="gpi-table__id">{initial.pid}</span> },
    { label: f.birthDate, value: initial.birth },
    { label: f.gender, value: initial.gender === 'male' ? f.male : f.female },
    { label: f.mobile, value: initial.mobile },
    { label: f.email, value: initial.email },
    { label: f.address, value: initial.address },
    { label: f.package, value: pkg ? `${pkg.label} · ${fmtGel(pkg.premium)} ${p.perMonth}` : row.package },
  ]

  return (
    <Drawer
      title={mode === 'view' ? e.viewTitle : e.title}
      closeLabel={e.close}
      onClose={close}
      footer={
        mode === 'view' ? (
          <>
            <Button variant="secondary" size="md" type="button" onClick={onClose}>
              {e.close}
            </Button>
            <Button variant="primary" size="md" type="button" leadingIcon="pencil" onClick={() => setMode('edit')}>
              {p.actions.edit}
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" size="md" type="button" onClick={cancelEdit}>
              {e.cancel}
            </Button>
            <Button variant="primary" size="md" type="button" leadingIcon="check" onClick={save}>
              {e.save}
            </Button>
          </>
        )
      }
    >
      <div className="b2b-cdrawer__identity">
        <Avatar name={row.name} size={40} />
        <div className="b2b-cdrawer__idmeta">
          <span className="b2b-cdrawer__factlbl">
            {e.policyLabel} {row.id}
          </span>
          <span className="b2b-cdrawer__name">{row.name}</span>
        </div>
        <Badge color={STATUS_BADGE[row.status]} size="sm" dot>
          {p.status[row.status]}
        </Badge>
      </div>

      {mode === 'view' ? (
        <dl className="b2b-cdrawer__facts">
          {facts.map((fc) => (
            <div key={fc.label} className="b2b-cdrawer__fact">
              <dt className="b2b-cdrawer__factlbl">{fc.label}</dt>
              <dd className="b2b-cdrawer__factval">{fc.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <>
          <InlineAlert tone="info" title={e.introTitle}>
            {t.side.nextBody}
          </InlineAlert>

          <InsuredFields
            className="b2b-wiz__grid b2b-drawer__grid"
            value={draft}
            onChange={onChange}
            linkOptions={linkOptions}
            idPrefix={`ed-${row.id}`}
            invalid={(k) => errors.has(k)}
            msg={errMsg}
            pidMaxLength={11}
          />
        </>
      )}
    </Drawer>
  )
}
