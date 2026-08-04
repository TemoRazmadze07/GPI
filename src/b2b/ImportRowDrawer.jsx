import { useEffect, useRef } from 'react'
import Drawer from '../components/Drawer.jsx'
import Avatar from '../components/Avatar.jsx'
import Badge from '../components/Badge.jsx'
import Radio from '../components/Radio.jsx'
import Select from '../components/Select.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import { Button } from '../components/Button.jsx'
import Field from './WizardField.jsx'
import { kaB2B } from './strings.js'
import { packages, relations, existingEmployees, packageByValue } from './data/addInsured.js'

/* ImportRowDrawer — repair one imported row, using the SAME controls as the
   single-person form (Field + gpi-input + Select + Radio) so a person edited
   here and a person typed by hand go through identical affordances.

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

const fmtGel = (n) => `₾ ${n.toFixed(2)}`

export const rowRef = (r) =>
  (r.firstName || r.lastName) ? `${r.firstName} ${r.lastName}`.trim()
    : r.pid ? `${x.cols.pid} ${r.pid}`
      : `${x.cols.row} ${r.excelRow}`

export default function ImportRowDrawer({ row, rows, onChange, onRemove, onNext, hasNext, onClose }) {
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

  const set = (key) => (e) => onChange(row.id, key, e.target.value)
  const pick = (key) => (v) => onChange(row.id, key, v)

  const issueFields = new Set(row.issues.map((i) => i.field).filter(Boolean))
  const bad = (k) => issueFields.has(k)
  const msgFor = (k) => row.issues.find((i) => i.field === k && i.severity === 'error')?.message
  /* The first field carrying an error gets the autofocus marker. */
  const firstBad = ['pid', 'birth', 'firstName', 'lastName', 'gender', 'pkg', 'relation', 'linkPid', 'who', 'citizen']
    .find((k) => row.issues.some((i) => i.field === k && i.severity === 'error'))
  const mark = (k) => (k === firstBad ? { 'data-autofocus': 'true' } : {})

  const isFamily = row.who === 'family'
  const pkg = packageByValue(row.pkg)

  /* Same two namespaces the single form offers: employees already on the
     contract, plus the employees this file itself introduces (`b:` prefixed —
     the wizard's removal cascade depends on that exact shape). */
  const linkOptions = [
    ...existingEmployees.map((e) => ({ value: e.id, label: e.name })),
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

        <div className="b2b-wiz__grid b2b-xl__drawergrid">
          <Field label={t.who.label} wide>
            <div className="b2b-wiz__radios" role="radiogroup" aria-label={t.who.label}>
              <Radio name={`dwho-${row.id}`} value="employee" checked={!isFamily} onChange={() => onChange(row.id, 'who', 'employee')} label={t.who.employee} />
              <Radio name={`dwho-${row.id}`} value="family" checked={isFamily} onChange={() => onChange(row.id, 'who', 'family')} label={t.who.family} />
            </div>
          </Field>

          {isFamily && (
            <>
              <Field label={f.linkedTo} required errorMsg={msgFor('linkPid')} {...mark('linkPid')}>
                <Select
                  value={row.linkedTo}
                  placeholder={f.linkedToPh}
                  options={linkOptions}
                  onChange={pick('linkedTo')}
                  error={bad('linkPid')}
                />
              </Field>
              <Field label={f.relation} required errorMsg={msgFor('relation')} {...mark('relation')}>
                <Select
                  value={row.relation}
                  placeholder={f.relationPh}
                  options={relations}
                  onChange={pick('relation')}
                  error={bad('relation')}
                />
              </Field>
            </>
          )}

          <Field label={f.citizen} wide>
            <div className="b2b-wiz__radios" role="radiogroup" aria-label={f.citizen}>
              <Radio name={`dcit-${row.id}`} value="resident" checked={row.citizen === 'resident'} onChange={() => onChange(row.id, 'citizen', 'resident')} label={f.resident} />
              <Radio name={`dcit-${row.id}`} value="nonresident" checked={row.citizen === 'nonresident'} onChange={() => onChange(row.id, 'citizen', 'nonresident')} label={f.nonresident} />
            </div>
          </Field>

          <div {...mark('pid')}>
            <Field label={f.personalId} required errorMsg={msgFor('pid')}>
              <input className={`gpi-input ${bad('pid') ? 'is-error' : ''}`} value={row.pid} placeholder={f.personalIdPh} inputMode="numeric" onChange={set('pid')} />
            </Field>
          </div>
          <div {...mark('birth')}>
            <Field label={f.birthDate} required errorMsg={msgFor('birth')}>
              <input className={`gpi-input ${bad('birth') ? 'is-error' : ''}`} value={row.birth} placeholder={f.birthDatePh} onChange={set('birth')} />
            </Field>
          </div>

          <div {...mark('firstName')}>
            <Field label={f.firstName} required errorMsg={msgFor('firstName')}>
              <input className={`gpi-input ${bad('firstName') ? 'is-error' : ''}`} value={row.firstName} onChange={set('firstName')} />
            </Field>
          </div>
          <div {...mark('lastName')}>
            <Field label={f.lastName} required errorMsg={msgFor('lastName')}>
              <input className={`gpi-input ${bad('lastName') ? 'is-error' : ''}`} value={row.lastName} onChange={set('lastName')} />
            </Field>
          </div>

          <Field label={f.gender} required errorMsg={msgFor('gender')} {...mark('gender')}>
            <Select
              value={row.gender}
              placeholder={f.genderPh}
              options={[
                { value: 'male', label: f.male },
                { value: 'female', label: f.female },
              ]}
              onChange={pick('gender')}
              error={bad('gender')}
            />
          </Field>
          <Field label={f.mobile}>
            <input className="gpi-input" value={row.mobile} placeholder={f.mobilePh} onChange={set('mobile')} />
          </Field>

          <Field label={f.email}>
            <input className="gpi-input" type="email" value={row.email} placeholder={f.emailPh} onChange={set('email')} />
          </Field>
          <Field label={f.address}>
            <input className="gpi-input" value={row.address} placeholder={f.addressPh} onChange={set('address')} />
          </Field>

          <Field
            label={f.package}
            required
            errorMsg={msgFor('pkg')}
            hint={pkg ? `${f.premium}: ${fmtGel(pkg.premium)} · ${f.systemTag}` : undefined}
            {...mark('pkg')}
          >
            <Select
              value={row.pkg}
              placeholder={f.packagePh}
              options={packages.map((p) => ({ value: p.value, label: p.label }))}
              onChange={pick('pkg')}
              error={bad('pkg')}
            />
          </Field>
        </div>

        <div className="b2b-wiz__formactions">
          <Button variant="danger-tertiary" size="md" type="button" leadingIcon="trash" onClick={() => onRemove(row.id)}>
            {x.rowRemove}
          </Button>
        </div>
      </div>
    </Drawer>
  )
}
