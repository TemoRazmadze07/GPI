import { useEffect, useMemo, useState } from 'react'
import Stepper from '../components/Stepper.jsx'
import WizardFooter from '../components/WizardFooter.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import Radio from '../components/Radio.jsx'
import Select from '../components/Select.jsx'
import Avatar from '../components/Avatar.jsx'
import Badge from '../components/Badge.jsx'
import { Button } from '../components/Button.jsx'
import Icon from '../lib/Icon.jsx'
import { kaB2B } from './strings.js'
import {
  contract,
  packages,
  packageByValue,
  relations,
  relationByValue,
  existingEmployees,
  registryLookup,
} from './data/addInsured.js'

/* AddInsuredScreen — B2B add-insured wizard (concept agreed 2026-07-06).
   Full-page wizard ON the canvas, shell kept (BMLL-pattern): 3 steps
   (method → data → review) + success. Batch model: N people, ONE request.
   Steps are hash-routed (#/b2b/insured/add[/data|/review|/done]); the
   component instance survives step changes so the batch state persists. */

const t = kaB2B.addIns

const STEPS = [
  { id: 'method', label: t.steps.method },
  { id: 'data', label: t.steps.data },
  { id: 'review', label: t.steps.review },
]

const go = (sub) => {
  window.location.hash = '#/b2b/insured/add' + (sub ? `/${sub}` : '')
}

const emptyDraft = () => ({
  who: 'employee',
  citizen: 'resident',
  pid: '',
  birth: '',
  firstName: '',
  lastName: '',
  gender: '',
  linkedTo: '',
  relation: '',
  mobile: '',
  email: '',
  address: '',
  pkg: '',
})

const fmtGel = (n) => `₾ ${n.toFixed(2)}`

/* ---- step 1: method cards -------------------------------------------------- */

function MethodCard({ icon, title, meta, selected, disabled, tag, onSelect }) {
  return (
    <button
      type="button"
      className={`b2b-method__card ${selected ? 'is-selected' : ''}`}
      disabled={disabled}
      aria-pressed={!disabled ? selected : undefined}
      onClick={onSelect}
    >
      <span className="gpi-radio" aria-hidden="true">
        {selected && <span className="gpi-radio__dot" />}
      </span>
      <span className="b2b-method__icon">
        <Icon name={icon} size={24} />
      </span>
      <span className="b2b-method__body">
        <span className="b2b-method__title">
          {title}
          {tag && (
            <Badge color="neutral" size="sm">
              {tag}
            </Badge>
          )}
        </span>
        <span className="b2b-method__meta">{meta}</span>
      </span>
    </button>
  )
}

function ContractChip() {
  return (
    <div className="b2b-wiz__contract">
      <span className="b2b-wiz__contract-lbl">{t.contractLabel}:</span>
      <span className="b2b-wiz__contract-val">{contract.label}</span>
      <Badge color="success" size="sm">
        {contract.status}
      </Badge>
      <button type="button" className="gpi-link" title={t.contractSingle}>
        {t.contractChange}
      </button>
    </div>
  )
}

function StepMethod() {
  return (
    <>
      <ContractChip />
      <h2 className="b2b-wiz__h">{t.method.heading}</h2>
      <div className="b2b-method">
        <MethodCard icon="user-plus" title={t.method.single.title} meta={t.method.single.meta} selected onSelect={() => {}} />
        <MethodCard icon="upload" title={t.method.excel.title} meta={t.method.excel.meta} tag={t.method.later} disabled />
        <MethodCard icon="mail" title={t.method.link.title} meta={t.method.link.meta} tag={t.method.later} disabled />
        <MethodCard icon="arrow-right-left" title={t.method.hr.title} meta={t.method.hr.meta} tag={t.method.soon} disabled />
      </div>
      <InlineAlert tone="info" title={t.method.headcount}>
        {t.method.headcountBody}
      </InlineAlert>
    </>
  )
}

/* ---- step 2: data form + batch list ---------------------------------------- */

/* Field — label + control + ONE message line. Message priority is exclusive
   (user rule 2026-07-06): inline error (red) > success check (green) > hint.
   A success message can never render in the error tone. */
function Field({ label, required, hint, success, errorMsg, wide, children }) {
  return (
    <div className={`gpi-field ${wide ? 'wide' : ''}`}>
      <span className="gpi-field__lbl">
        {label}
        {required && <span className="gpi-field__req">*</span>}
      </span>
      {children}
      {errorMsg ? (
        <span className="gpi-field__hint b2b-hint-err" role="alert">
          {errorMsg}
        </span>
      ) : success ? (
        <span className="gpi-field__hint b2b-hint-ok">
          <Icon name="check" size={14} />
          {success}
        </span>
      ) : hint ? (
        <span className="gpi-field__hint">{hint}</span>
      ) : null}
    </div>
  )
}

function StepData({ people, draft, onField, onWho, errors, lookup, editingId, onAddToList, onClearForm, onEditRow, onRemoveRow, onAddFamily }) {
  const f = t.form
  const set = (k) => (e) => onField(k, e.target.value)
  /* Per-field inline message (user rule): required vs format, cleared live. */
  const errMsg = (k) => (errors.has(k) ? (errors.get(k) === 'format' ? f.errPid : f.errRequired) : undefined)
  const isFamily = draft.who === 'family'
  const pkg = packageByValue(draft.pkg)

  const linkOptions = [
    ...existingEmployees.map((e) => ({ value: e.id, label: e.name })),
    ...people.filter((p) => p.who === 'employee').map((p) => ({ value: `b:${p.id}`, label: `${f.linkedNew} ${p.firstName} ${p.lastName}` })),
  ]

  const linkedLabel = (v) => linkOptions.find((o) => o.value === v)?.label || ''

  return (
    <div className="b2b-wiz__cols">
      <div className="b2b-wiz__main">
        <div className="b2b-wiz__grid">
          <Field label={t.who.label} wide>
            <div className="b2b-wiz__radios" role="radiogroup" aria-label={t.who.label}>
              <Radio name={`who-${editingId || 'new'}`} value="employee" checked={!isFamily} onChange={() => onWho('employee')} label={t.who.employee} />
              <Radio name={`who-${editingId || 'new'}`} value="family" checked={isFamily} onChange={() => onWho('family')} label={t.who.family} />
            </div>
          </Field>

          {isFamily && (
            <>
              <Field label={f.linkedTo} required errorMsg={errMsg('linkedTo')}>
                <Select value={draft.linkedTo} placeholder={f.linkedToPh} options={linkOptions} onChange={(v) => onField('linkedTo', v)} error={errors.has('linkedTo')} />
              </Field>
              <Field label={f.relation} required errorMsg={errMsg('relation')}>
                <Select value={draft.relation} placeholder={f.relationPh} options={relations} onChange={(v) => onField('relation', v)} error={errors.has('relation')} />
              </Field>
            </>
          )}

          <Field label={f.citizen} wide>
            <div className="b2b-wiz__radios" role="radiogroup" aria-label={f.citizen}>
              <Radio name={`cit-${editingId || 'new'}`} value="resident" checked={draft.citizen === 'resident'} onChange={(v) => onField('citizen', v)} label={f.resident} />
              <Radio name={`cit-${editingId || 'new'}`} value="nonresident" checked={draft.citizen === 'nonresident'} onChange={(v) => onField('citizen', v)} label={f.nonresident} />
            </div>
          </Field>

          <Field
            label={f.personalId}
            required
            errorMsg={errMsg('pid')}
            success={lookup === 'found' ? f.found : undefined}
            hint={lookup === 'notFound' ? f.notFound : undefined}
          >
            <input className={`gpi-input ${errors.has('pid') ? 'is-error' : ''}`} value={draft.pid} placeholder={f.personalIdPh} inputMode="numeric" maxLength={11} onChange={set('pid')} />
          </Field>
          <Field label={f.birthDate} required errorMsg={errMsg('birth')}>
            <input className={`gpi-input ${errors.has('birth') ? 'is-error' : ''}`} value={draft.birth} placeholder={f.birthDatePh} onChange={set('birth')} />
          </Field>

          <Field label={f.firstName} required errorMsg={errMsg('firstName')}>
            <input className={`gpi-input ${errors.has('firstName') ? 'is-error' : ''}`} value={draft.firstName} onChange={set('firstName')} />
          </Field>
          <Field label={f.lastName} required errorMsg={errMsg('lastName')}>
            <input className={`gpi-input ${errors.has('lastName') ? 'is-error' : ''}`} value={draft.lastName} onChange={set('lastName')} />
          </Field>

          <Field label={f.gender} required errorMsg={errMsg('gender')}>
            <Select
              value={draft.gender}
              placeholder={f.genderPh}
              options={[
                { value: 'male', label: f.male },
                { value: 'female', label: f.female },
              ]}
              onChange={(v) => onField('gender', v)}
              error={errors.has('gender')}
            />
          </Field>
          <Field label={f.mobile}>
            <input className="gpi-input" value={draft.mobile} placeholder={f.mobilePh} onChange={set('mobile')} />
          </Field>

          <Field label={f.email}>
            <input className="gpi-input" type="email" value={draft.email} placeholder={f.emailPh} onChange={set('email')} />
          </Field>
          <Field label={f.address}>
            <input className="gpi-input" value={draft.address} placeholder={f.addressPh} onChange={set('address')} />
          </Field>

          <Field
            label={f.package}
            required
            errorMsg={errMsg('pkg')}
            hint={pkg ? `${f.premium}: ${fmtGel(pkg.premium)} · ${f.systemTag}` : undefined}
          >
            <Select
              value={draft.pkg}
              placeholder={f.packagePh}
              options={packages.map((p) => ({ value: p.value, label: p.label }))}
              onChange={(v) => onField('pkg', v)}
              error={errors.has('pkg')}
            />
          </Field>
        </div>

        <div className="b2b-wiz__formactions">
          <Button variant="tertiary" size="md" onClick={onClearForm}>
            {f.clearForm}
          </Button>
          <Button variant="secondary" size="md" leadingIcon="plus" onClick={onAddToList}>
            {editingId ? f.updateInList : f.addToList}
          </Button>
        </div>

        {people.length > 0 && (
        <div className="b2b-batch">
          <div className="b2b-batch__hd">
            {t.batch.heading} ({people.length})
          </div>
          {people.map((p) => {
            const rel = relationByValue(p.relation)
            const pk = packageByValue(p.pkg)
            return (
              <div key={p.id} className="b2b-batch__row">
                <Avatar name={`${p.firstName} ${p.lastName}`} size={32} />
                <div className="b2b-batch__txt">
                  <div className="b2b-batch__name">
                    {p.firstName} {p.lastName}
                  </div>
                  <div className="b2b-batch__meta">
                    {p.who === 'employee' ? t.batch.employeeTag : `${rel?.label || ''} → ${linkedLabel(p.linkedTo) || ''}`}
                  </div>
                </div>
                <div className="b2b-batch__pkg">
                  {pk?.label} · {pk ? fmtGel(pk.premium) : ''}
                </div>
                <div className="b2b-batch__actions">
                  {p.who === 'employee' && (
                    <button type="button" className="gpi-link" onClick={() => onAddFamily(p)}>
                      + {t.batch.addFamily}
                    </button>
                  )}
                  <button type="button" className="b2b-batch__iconbtn" aria-label={t.batch.edit} title={t.batch.edit} onClick={() => onEditRow(p)}>
                    <Icon name="pencil" size={16} />
                  </button>
                  <button type="button" className="b2b-batch__iconbtn" aria-label={t.batch.remove} title={t.batch.remove} onClick={() => onRemoveRow(p)}>
                    <Icon name="x" size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        )}
      </div>

      <div className="b2b-wiz__side">
        <div className="b2b-wiz__sideplain">
          <span className="b2b-wiz__sidelbl">{t.contractLabel}</span>
          <span className="b2b-wiz__sideval">{contract.label}</span>
        </div>
        <div className="b2b-wiz__sidecard">
          <div className="b2b-wiz__sidehd">{t.side.rulesTitle}</div>
          <InlineAlert tone="success" title={t.side.ruleWindowTitle}>
            {t.side.ruleWindow}
          </InlineAlert>
          <InlineAlert tone="warning" title={t.side.rulePackageTitle}>
            {t.side.rulePackage}
          </InlineAlert>
          <InlineAlert tone="info" title={t.side.ruleWaitTitle}>
            {t.side.ruleWait}
          </InlineAlert>
        </div>
        <div className="b2b-wiz__sidetext">
          {t.side.nextBody} · {t.side.bulkTip}
        </div>
      </div>
    </div>
  )
}

/* ---- step 3: review --------------------------------------------------------- */

function StepReview({ people }) {
  const total = people.reduce((s, p) => s + (packageByValue(p.pkg)?.premium || 0), 0)
  return (
    <div className="b2b-wiz__cols">
      <div className="b2b-wiz__main">
        <h2 className="b2b-wiz__h">{t.review.heading}</h2>
        <ContractChip />
        <div className="b2b-batch">
          <div className="b2b-batch__hd">
            {people.length} {t.review.people}
          </div>
          {people.map((p) => {
            const rel = relationByValue(p.relation)
            const pk = packageByValue(p.pkg)
            return (
              <div key={p.id} className="b2b-batch__row">
                <Avatar name={`${p.firstName} ${p.lastName}`} size={32} />
                <div className="b2b-batch__txt">
                  <div className="b2b-batch__name">
                    {p.firstName} {p.lastName}
                  </div>
                  <div className="b2b-batch__meta">{p.who === 'employee' ? t.batch.employeeTag : rel?.label}</div>
                </div>
                <div className="b2b-batch__pkg">
                  {pk?.label} · {pk ? fmtGel(pk.premium) : ''}
                </div>
              </div>
            )
          })}
          <div className="b2b-batch__total">
            <span>
              {t.review.total} · {t.review.totalNote}
            </span>
            <strong>
              {fmtGel(total)} / {t.batch.perMonth.replace('₾/', '')}
            </strong>
          </div>
        </div>
        <InlineAlert tone="info" title={t.side.nextTitle}>
          {t.side.nextBody}
        </InlineAlert>
      </div>
    </div>
  )
}

/* ---- success ----------------------------------------------------------------- */

function StepDone({ count }) {
  return (
    <div className="b2b-wiz__done">
      <span className="b2b-wiz__donemark">
        <Icon name="check" size={24} />
      </span>
      <h2 className="b2b-wiz__donetitle">{t.done.requestNo}</h2>
      <div className="b2b-wiz__donemeta">
        {count} {t.review.people} · <Badge color="info">{t.done.status}</Badge>
      </div>
      <div className="b2b-wiz__donenote">{t.done.meta}</div>
      <div className="b2b-wiz__doneactions">
        <Button variant="secondary" size="md" onClick={() => (window.location.hash = '#/b2b/requests')}>
          {t.done.viewRequest}
        </Button>
        <Button variant="tertiary" size="md" leadingIcon="plus" onClick={() => go('data')}>
          {t.done.addMore}
        </Button>
        <Button variant="tertiary" size="md" onClick={() => (window.location.hash = '#/b2b')}>
          {t.done.home}
        </Button>
      </div>
    </div>
  )
}

/* ---- the wizard -------------------------------------------------------------- */

export default function AddInsuredScreen({ step = 'method' }) {
  const [people, setPeople] = useState([])
  const [draft, setDraft] = useState(emptyDraft)
  const [editingId, setEditingId] = useState(null)
  /* key → 'required' | 'format'. Set on submit-attempt, cleared LIVE per field
     as the user edits it (user rule 2026-07-06: no stale red borders). */
  const [errors, setErrors] = useState(new Map())
  const [doneCount, setDoneCount] = useState(0)
  const [seq, setSeq] = useState(1)

  /* Mock registry autofill: resident + 11-digit ID + birth date → look the
     person up and pre-fill name/surname/gender (fields stay editable). */
  const lookup = useMemo(() => {
    if (draft.citizen !== 'resident' || !/^\d{11}$/.test(draft.pid) || !draft.birth) return 'idle'
    return registryLookup(draft.pid, draft.birth) ? 'found' : 'notFound'
  }, [draft.citizen, draft.pid, draft.birth])

  useEffect(() => {
    if (lookup !== 'found') return
    const found = registryLookup(draft.pid, draft.birth)
    setDraft((d) => ({ ...d, firstName: found.firstName, lastName: found.lastName, gender: found.gender }))
    /* Autofilled fields are valid by definition — drop their stale errors too. */
    setErrors((es) => {
      if (!es.size) return es
      const next = new Map(es)
      for (const k of ['firstName', 'lastName', 'gender']) next.delete(k)
      return next
    })
  }, [lookup]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Deep-linking review with an empty batch bounces back to the form. */
  useEffect(() => {
    if (step === 'review' && people.length === 0) go('data')
  }, [step, people.length])

  /* The batch empties only once the success step is MOUNTED — clearing it inside
     submit() raced the guard above (step still 'review' → bounced to 'data'). */
  useEffect(() => {
    if (step === 'done' && people.length > 0) {
      setDoneCount(people.length)
      setPeople([])
      clearForm()
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  const dirty = people.length > 0 || draft.pid || draft.firstName || draft.lastName

  const cancel = () => {
    if (dirty && !window.confirm(t.cancelConfirm)) return
    window.location.hash = '#/b2b/persons'
  }

  const validate = () => {
    const req = ['pid', 'birth', 'firstName', 'lastName', 'gender', 'pkg']
    if (draft.who === 'family') req.push('linkedTo', 'relation')
    const bad = new Map()
    for (const k of req) if (!String(draft[k]).trim()) bad.set(k, 'required')
    if (!bad.has('pid') && !/^\d{11}$/.test(draft.pid)) bad.set('pid', 'format')
    setErrors(bad)
    return bad.size === 0
  }

  /* Editing a field immediately clears its own error. */
  const updateField = (k, v) => {
    setDraft((d) => ({ ...d, [k]: v }))
    setErrors((es) => {
      if (!es.has(k)) return es
      const next = new Map(es)
      next.delete(k)
      return next
    })
  }

  /* Switching who changes the form's shape — stale errors don't carry over. */
  const switchWho = (who) => {
    setDraft((d) => (who === 'employee' ? { ...d, who, linkedTo: '', relation: '' } : { ...d, who }))
    setErrors(new Map())
  }

  const clearForm = () => {
    setDraft(emptyDraft())
    setEditingId(null)
    setErrors(new Map())
  }

  const addToList = () => {
    if (!validate()) return
    if (editingId) {
      setPeople((ps) => ps.map((p) => (p.id === editingId ? { ...draft, id: editingId } : p)))
    } else {
      setPeople((ps) => [...ps, { ...draft, id: `p${seq}` }])
      setSeq((n) => n + 1)
    }
    clearForm()
  }

  const editRow = (p) => {
    setEditingId(p.id)
    setDraft({ ...p })
    setErrors(new Map())
  }

  /* Removing an employee also removes family rows linked to them in this batch. */
  const removeRow = (p) => {
    setPeople((ps) => ps.filter((x) => x.id !== p.id && x.linkedTo !== `b:${p.id}`))
    if (editingId === p.id) clearForm()
  }

  const addFamily = (p) => {
    setDraft({ ...emptyDraft(), who: 'family', linkedTo: `b:${p.id}` })
    setEditingId(null)
    setErrors(new Map())
    window.scrollTo?.(0, 0)
  }

  const submit = () => go('done')

  const stepIndex = { method: 0, data: 1, review: 2 }[step] ?? 0
  const isDone = step === 'done'

  return (
    <div className="b2b-wiz">
      {!isDone && (
        <>
          <div className="b2b-page__head">
            <div>
              <Breadcrumbs items={[{ label: t.crumbParent, href: '#/b2b/policies' }]} current={t.title} label={kaB2B.crumbsLabel} />
              <h1 className="b2b-page__title">{t.title}</h1>
            </div>
            <Button variant="tertiary" size="md" leadingIcon="x" onClick={cancel}>
              {t.cancel}
            </Button>
          </div>
          <div className="b2b-wiz__stepper">
            <Stepper steps={STEPS} current={stepIndex} />
          </div>
        </>
      )}

      {step === 'method' && <StepMethod />}
      {step === 'data' && (
        <StepData
          people={people}
          draft={draft}
          onField={updateField}
          onWho={switchWho}
          errors={errors}
          lookup={lookup}
          editingId={editingId}
          onAddToList={addToList}
          onClearForm={clearForm}
          onEditRow={editRow}
          onRemoveRow={removeRow}
          onAddFamily={addFamily}
        />
      )}
      {step === 'review' && <StepReview people={people} />}
      {isDone && <StepDone count={doneCount} />}

      {!isDone && (
        <WizardFooter
          onBack={step === 'method' ? cancel : () => go(step === 'review' ? 'data' : '')}
          onContinue={step === 'review' ? submit : () => go(step === 'method' ? 'data' : 'review')}
          canContinue={step !== 'data' || people.length > 0}
          continueLabel={step === 'data' ? `${t.steps.review} (${people.length})` : step === 'review' ? t.review.submit : undefined}
          continueIcon={step === 'review' ? 'check' : 'arrow-right'}
        />
      )}
    </div>
  )
}
