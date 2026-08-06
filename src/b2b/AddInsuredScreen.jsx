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
import Field from './WizardField.jsx'
import StepExcel from './StepExcel.jsx'
import ContractSelect from './ContractSelect.jsx'
import { kaB2B } from './strings.js'
import {
  defaultContract,
  contractById,
  existingEmployeesFor,
  packages,
  packageByValue,
  relations,
  relationByValue,
  registryLookup,
  emptyDraft,
} from './data/addInsured.js'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { importable, toPerson } from './data/insuredImport.js'

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

const fmtGel = (n) => `₾ ${n.toFixed(2)}`

/* Stable reference: the importer memoises its validation context on this, so a
   fresh Date() per render would rebuild it on every keystroke. */
const TODAY = new Date()

/* ---- step 1: method cards -------------------------------------------------- */

/* Navigation tiles (user, 2026-08-06 — replaced the radio-cards + footer
   „გაგრძელება"): clicking a tile goes STRAIGHT to its flow — the extra
   confirm-click bought nothing on a one-decision step. Chevron = navigation
   affordance; disabled methods keep their tag and get no chevron. */
function MethodCard({ icon, title, meta, disabled, tag, onGo }) {
  return (
    <button type="button" className="b2b-method__card" disabled={disabled} onClick={onGo}>
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
      {!disabled && (
        <span className="b2b-method__chev" aria-hidden="true">
          <Icon name="chevron-right" size={20} />
        </span>
      )}
    </button>
  )
}

function StepMethod({ onMethod, contract, onContract }) {
  return (
    <>
      <ContractSelect contract={contract} onSelect={onContract} />
      <h2 className="b2b-wiz__h">{t.method.heading}</h2>
      <div className="b2b-method">
        <MethodCard
          icon="user-plus"
          title={t.method.single.title}
          meta={t.method.single.meta}
          onGo={() => onMethod('single')}
        />
        <MethodCard
          icon="upload"
          title={t.method.excel.title}
          meta={t.method.excel.meta}
          onGo={() => onMethod('excel')}
        />
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

function StepData({ people, draft, onField, onWho, errors, lookup, editingId, onAddToList, onClearForm, onEditRow, onRemoveRow, onAddFamily, contract, onContract }) {
  const f = t.form
  const set = (k) => (e) => onField(k, e.target.value)
  /* Per-field inline message (user rule): required vs format, cleared live. */
  const errMsg = (k) => (errors.has(k) ? (errors.get(k) === 'format' ? f.errPid : f.errRequired) : undefined)
  const isFamily = draft.who === 'family'
  const pkg = packageByValue(draft.pkg)

  const linkOptions = [
    ...existingEmployeesFor(contract.id).map((e) => ({ value: e.id, label: e.name })),
    ...people.filter((p) => p.who === 'employee').map((p) => ({ value: `b:${p.id}`, label: `${f.linkedNew} ${p.firstName} ${p.lastName}` })),
  ]

  const linkedLabel = (v) => linkOptions.find((o) => o.value === v)?.label || ''

  return (
    <div className="b2b-wiz__cols">
      <div className="b2b-wiz__main">
        <ContractSelect contract={contract} onSelect={onContract} />
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

      {/* No contract read-out here (audit 2026-08-06): the selector chip at the
          top of the main column already names it on this same screen. */}
      <div className="b2b-wiz__side">
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

function StepReview({ people, contract }) {
  const total = people.reduce((s, p) => s + (packageByValue(p.pkg)?.premium || 0), 0)
  /* Same link resolution the data step's batch list uses (audit 2026-08-06 —
     review previously showed a bare „შვილი" with no employee): in-batch people
     first (`b:` ids), then the selected contract's roster. */
  const linkedName = (p) => {
    if (!p.linkedTo) return ''
    const inBatch = people.find((o) => `b:${o.id}` === p.linkedTo)
    if (inBatch) return `${inBatch.firstName} ${inBatch.lastName}`.trim()
    return existingEmployeesFor(contract.id).find((e) => e.id === p.linkedTo)?.name || ''
  }
  return (
    <div className="b2b-wiz__cols">
      <div className="b2b-wiz__main">
        {/* Chip ABOVE the heading — same order as the data + excel steps
            (audit 2026-08-06). readOnly: at review the contract is context, not
            a control — switching here would re-open validation behind the
            user's back. */}
        <ContractSelect contract={contract} readOnly />
        <h2 className="b2b-wiz__h">{t.review.heading}</h2>
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
                  <div className="b2b-batch__meta">
                    {p.who === 'employee'
                      ? t.batch.employeeTag
                      : linkedName(p)
                        ? `${rel?.label || ''} → ${linkedName(p)}`
                        : rel?.label}
                  </div>
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
  const [method, setMethod] = useState('single')
  /* The Excel batch lives HERE, not in StepExcel, so it survives navigating to
     review and back. The component instance is preserved across steps — never
     add a `key` to the step branches or the batch is wiped. */
  const [excel, setExcel] = useState({ file: null, result: null })
  /* key → 'required' | 'format'. Set on submit-attempt, cleared LIVE per field
     as the user edits it (user rule 2026-07-06: no stale red borders). */
  const [errors, setErrors] = useState(new Map())
  const [doneCount, setDoneCount] = useState(0)
  const [seq, setSeq] = useState(1)

  /* Selected contract (2026-08-06): default pre-selected, switchable from the
     inline selector. Switching with data present goes through a confirm —
     entered people are kept, an uploaded file is RE-VALIDATED (StepExcel
     watches contract.id): already-insured / link-to-existing checks are
     contract-scoped, so results can genuinely change. */
  const [contractId, setContractId] = useState(defaultContract.id)
  const [pendingContract, setPendingContract] = useState(null)
  const selContract = contractById(contractId)
  const requestContract = (id) => {
    const hasData = method === 'excel' ? !!(excel.file || excel.result) : people.length > 0
    if (hasData) setPendingContract(id)
    else setContractId(id)
  }

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

  const backFromReview = () => (method === 'excel' ? 'excel' : 'data')

  /* Deep-linking straight to /excel (or /data) skips the method step, which
     would otherwise leave `method` on its default and send Back-from-review to
     the wrong screen. The route is the source of truth. */
  useEffect(() => {
    if (step === 'excel' && method !== 'excel') setMethod('excel')
    if (step === 'data' && method !== 'single') setMethod('single')
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Deep-linking review with an empty batch bounces back — to whichever step
     the chosen method actually uses. */
  useEffect(() => {
    if (step === 'review' && people.length === 0) go(backFromReview())
  }, [step, people.length]) // eslint-disable-line react-hooks/exhaustive-deps

  /* The batch empties only once the success step is MOUNTED — clearing it inside
     submit() raced the guard above (step still 'review' → bounced to 'data'). */
  useEffect(() => {
    if (step === 'done' && people.length > 0) {
      setDoneCount(people.length)
      setPeople([])
      clearForm()
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  /* An uploaded-but-unresolved Excel batch counts as work in progress — without
     `excel.file` here, leaving the page would silently discard it. */
  const dirty = people.length > 0 || !!excel.file || draft.pid || draft.firstName || draft.lastName

  const cancel = () => {
    if (dirty && !window.confirm(t.cancelConfirm)) return
    window.location.hash = '#/b2b/persons'
  }

  /* Switching method discards the other side's work, so it asks first — same
     window.confirm pattern as cancel(). Mixing an uploaded file with
     hand-added people is not supported in v1. */
  /* Tile click = navigate straight into the chosen flow (2026-08-06). The
     lose-data guard stays for the revisit case: coming BACK to step 1 with an
     Excel batch and tapping the single form (or vice versa) still confirms
     before wiping the other method's data. */
  const chooseMethod = (next) => {
    if (next !== method) {
      const losing = next === 'single' ? !!excel.file : people.length > 0
      if (losing && !window.confirm(t.excel.switchConfirm)) return
      if (next === 'single') setExcel({ file: null, result: null })
      else setPeople([])
      setMethod(next)
    }
    go(next === 'excel' ? 'excel' : 'data')
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

  const excelCount = excel.result ? excel.result.counts.importable : 0
  const excelReady = !!excel.result && !excel.result.fileError && excel.result.counts.error === 0 && excelCount > 0
  const excelBlockHint = excel.result?.counts.error
    ? t.excel.continueDisabled(excel.result.counts.error)
    : t.excel.continueEmpty
  /* Replace rather than append, so pressing Continue twice cannot double the
     batch. */
  const commitExcel = () => {
    setPeople(importable(excel.result.rows).map(toPerson))
    setSeq(excel.result.nextSeq)
    go('review')
  }

  const stepIndex = { method: 0, data: 1, excel: 1, review: 2 }[step] ?? 0
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

      {step === 'method' && (
        <StepMethod onMethod={chooseMethod} contract={selContract} onContract={requestContract} />
      )}
      {step === 'excel' && (
        <StepExcel
          excel={excel}
          onImportState={setExcel}
          startSeq={seq}
          ctxToday={TODAY}
          contract={selContract}
          onContract={requestContract}
        />
      )}
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
          contract={selContract}
          onContract={requestContract}
        />
      )}
      {step === 'review' && <StepReview people={people} contract={selContract} />}
      {isDone && <StepDone count={doneCount} />}

      {pendingContract && (
        <ConfirmDialog
          variant="primary"
          title={t.contractSwitch.title}
          body={method === 'excel' ? t.contractSwitch.bodyExcel : t.contractSwitch.bodyForm}
          confirmLabel={t.contractSwitch.confirm}
          keepLabel={t.contractSwitch.cancel}
          onConfirm={() => {
            setContractId(pendingContract)
            setPendingContract(null)
          }}
          onClose={() => setPendingContract(null)}
        />
      )}

      {/* No footer on the method step (2026-08-06): tiles navigate directly, and
          „უკან" there duplicated the X გაუქმება in the page head. */}
      {!isDone && step !== 'method' && (
        <WizardFooter
          onBack={() => go(step === 'review' ? backFromReview() : '')}
          onContinue={step === 'review' ? submit : step === 'excel' ? commitExcel : () => go('review')}
          canContinue={step === 'data' ? people.length > 0 : step === 'excel' ? excelReady : true}
          continueLabel={
            step === 'data'
              ? `${t.steps.review} (${people.length})`
              : step === 'excel'
                ? `${t.steps.review} (${excelCount})`
                : t.review.submit
          }
          continueIcon={step === 'review' ? 'check' : 'arrow-right'}
          hint={step === 'excel' && !excelReady ? excelBlockHint : null}
        />
      )}
    </div>
  )
}
