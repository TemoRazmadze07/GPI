import Radio from '../components/Radio.jsx'
import Select from '../components/Select.jsx'
import Field from './WizardField.jsx'
import { kaB2B } from './strings.js'
import { packages, relations, packageByValue } from './data/addInsured.js'

/* InsuredFields — THE single insured-person form (step 2 of the add-insured
   wizard). Extracted 2026-08-11 when the edit-insured drawer became its THIRD
   consumer: the wizard's StepData, the Excel ImportRowDrawer, and
   EditInsuredDrawer all render exactly this grid, so one shape and one field
   order stay guaranteed (Rule 1).

   Error wiring stays with the CONSUMER — the wizard keeps its errors Map, the
   importer its issues list — this component only asks two questions per field:
   `invalid(k)` (red border?) and `msg(k)` (inline error line). `mark(k)`
   returns wrapper attrs for the importer's autofocus-on-first-problem; the
   wrapper div is added ONLY when mark returns attrs (and inherits `wide` so a
   spanning field keeps its span). NB: spreading mark onto <Field> never worked
   — Field drops unknown props — so select-type fields silently lost their
   marker before this extraction. */

const t = kaB2B.addIns
const f = t.form

const fmtGel = (n) => `₾ ${n.toFixed(2)}`

export default function InsuredFields({
  value,
  onChange,
  linkOptions,
  idPrefix,
  invalid = () => false,
  msg = () => undefined,
  mark = () => ({}),
  pidSuccess,
  pidHint,
  pidMaxLength,
  className = 'b2b-wiz__grid',
}) {
  const set = (k) => (e) => onChange(k, e.target.value)
  const isFamily = value.who === 'family'
  const pkg = packageByValue(value.pkg)

  /* Autofocus marker wrapper — only when the consumer marks this field. */
  const M = (k, wide, node) => {
    const attrs = mark(k)
    if (!Object.keys(attrs).length) return node
    return (
      <div {...attrs} className={wide ? 'wide' : undefined}>
        {node}
      </div>
    )
  }

  return (
    <div className={className}>
      {M(
        'who',
        true,
        <Field label={t.who.label} wide>
          <div className="b2b-wiz__radios" role="radiogroup" aria-label={t.who.label}>
            <Radio name={`${idPrefix}-who`} value="employee" checked={!isFamily} onChange={() => onChange('who', 'employee')} label={t.who.employee} />
            <Radio name={`${idPrefix}-who`} value="family" checked={isFamily} onChange={() => onChange('who', 'family')} label={t.who.family} />
          </div>
        </Field>,
      )}

      {isFamily && (
        <>
          {M(
            'linkedTo',
            false,
            <Field label={f.linkedTo} required errorMsg={msg('linkedTo')}>
              <Select value={value.linkedTo} placeholder={f.linkedToPh} options={linkOptions} onChange={(v) => onChange('linkedTo', v)} error={invalid('linkedTo')} />
            </Field>,
          )}
          {M(
            'relation',
            false,
            <Field label={f.relation} required errorMsg={msg('relation')}>
              <Select value={value.relation} placeholder={f.relationPh} options={relations} onChange={(v) => onChange('relation', v)} error={invalid('relation')} />
            </Field>,
          )}
        </>
      )}

      {M(
        'citizen',
        true,
        <Field label={f.citizen} wide>
          <div className="b2b-wiz__radios" role="radiogroup" aria-label={f.citizen}>
            <Radio name={`${idPrefix}-cit`} value="resident" checked={value.citizen === 'resident'} onChange={(v) => onChange('citizen', v)} label={f.resident} />
            <Radio name={`${idPrefix}-cit`} value="nonresident" checked={value.citizen === 'nonresident'} onChange={(v) => onChange('citizen', v)} label={f.nonresident} />
          </div>
        </Field>,
      )}

      {M(
        'pid',
        false,
        <Field label={f.personalId} required errorMsg={msg('pid')} success={pidSuccess} hint={pidHint}>
          <input
            className={`gpi-input ${invalid('pid') ? 'is-error' : ''}`}
            value={value.pid}
            placeholder={f.personalIdPh}
            inputMode="numeric"
            maxLength={pidMaxLength}
            onChange={set('pid')}
          />
        </Field>,
      )}
      {M(
        'birth',
        false,
        <Field label={f.birthDate} required errorMsg={msg('birth')}>
          <input className={`gpi-input ${invalid('birth') ? 'is-error' : ''}`} value={value.birth} placeholder={f.birthDatePh} onChange={set('birth')} />
        </Field>,
      )}

      {M(
        'firstName',
        false,
        <Field label={f.firstName} required errorMsg={msg('firstName')}>
          <input className={`gpi-input ${invalid('firstName') ? 'is-error' : ''}`} value={value.firstName} onChange={set('firstName')} />
        </Field>,
      )}
      {M(
        'lastName',
        false,
        <Field label={f.lastName} required errorMsg={msg('lastName')}>
          <input className={`gpi-input ${invalid('lastName') ? 'is-error' : ''}`} value={value.lastName} onChange={set('lastName')} />
        </Field>,
      )}

      {M(
        'gender',
        false,
        <Field label={f.gender} required errorMsg={msg('gender')}>
          <Select
            value={value.gender}
            placeholder={f.genderPh}
            options={[
              { value: 'male', label: f.male },
              { value: 'female', label: f.female },
            ]}
            onChange={(v) => onChange('gender', v)}
            error={invalid('gender')}
          />
        </Field>,
      )}
      <Field label={f.mobile}>
        <input className="gpi-input" value={value.mobile} placeholder={f.mobilePh} onChange={set('mobile')} />
      </Field>

      <Field label={f.email}>
        <input className="gpi-input" type="email" value={value.email} placeholder={f.emailPh} onChange={set('email')} />
      </Field>
      <Field label={f.address}>
        <input className="gpi-input" value={value.address} placeholder={f.addressPh} onChange={set('address')} />
      </Field>

      {M(
        'pkg',
        false,
        <Field
          label={f.package}
          required
          errorMsg={msg('pkg')}
          hint={pkg ? `${f.premium}: ${fmtGel(pkg.premium)} · ${f.systemTag}` : undefined}
        >
          <Select
            value={value.pkg}
            placeholder={f.packagePh}
            options={packages.map((p) => ({ value: p.value, label: p.label }))}
            onChange={(v) => onChange('pkg', v)}
            error={invalid('pkg')}
          />
        </Field>,
      )}
    </div>
  )
}
