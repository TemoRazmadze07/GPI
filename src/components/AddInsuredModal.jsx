import { useState } from 'react'
import Modal from './Modal.jsx'
import SegmentedControl from './SegmentedControl.jsx'
import Avatar from './Avatar.jsx'
import Icon from '../lib/Icon.jsx'
import { Button } from './Button.jsx'
import { lookupByPersonalId, lookupByPolicy } from '../data/insured.js'
import { ka } from '../i18n/strings.js'

/* AddInsuredModal — Step-1 "add insured person" dialog. Two lookup methods
   (personal data · policy number), a search → confirm → add flow, and a
   manual-entry fallback surfaced only when the lookup finds nobody. Built from
   the shared Modal shell + Segmented Control + Button + Avatar. Content/UX per
   the 2026-07-05 agreed spec. */
export default function AddInsuredModal({ existingIds = [], onAdd, onClose }) {
  const t = ka.wizard.addInsured
  const [method, setMethod] = useState('personal') // personal | policy
  const [mode, setMode] = useState('search') // search | confirmed | manual
  const [personalId, setPersonalId] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [policyNumber, setPolicyNumber] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState(null) // error key → t.errors[key]
  const [errField, setErrField] = useState(null) // 'id' | 'birth' | 'policy' | null
  const [found, setFound] = useState(null)
  const [man, setMan] = useState({ firstName: '', lastName: '', id: '', birth: '', relation: '' })

  const clearErr = () => { setError(null); setErrField(null) }

  const search = () => {
    const res = method === 'personal'
      ? lookupByPersonalId(personalId, birthDate)
      : lookupByPolicy(policyNumber)
    if (res.error) {
      setError(res.error)
      setErrField(res.error === 'invalidDate' ? 'birth' : method === 'policy' ? 'policy' : 'id')
      return
    }
    if (existingIds.includes(res.person.id)) { setError('alreadyAdded'); setErrField(null); return }
    clearErr(); setFound(res.person); setMode('confirmed')
  }

  const addFound = () => { onAdd({ ...found, remembered: remember }); onClose() }

  const addManual = () => {
    if (!man.firstName.trim() || !man.lastName.trim() || man.id.replace(/\D/g, '').length !== 11) {
      setError('manualIncomplete'); setErrField(null); return
    }
    onAdd({
      id: 'ins-' + man.id.replace(/\D/g, '').slice(-4),
      name: `${man.firstName.trim()} ${man.lastName.trim()}`,
      avatar: null, policyId: 'GPIH G3512',
      relation: man.relation || 'other', remembered: remember,
    })
    onClose()
  }

  const goManual = () => { setMode('manual'); clearErr() }
  const backToSearch = () => { setMode('search'); setFound(null); clearErr() }
  const onEnter = (e) => { if (e.key === 'Enter') { e.preventDefault(); search() } }

  const footer =
    mode === 'confirmed' ? (
      <>
        <Button variant="secondary" size="md" onClick={backToSearch}>{t.searchOther}</Button>
        <Button variant="primary" size="md" leadingIcon="plus" onClick={addFound}>{t.add}</Button>
      </>
    ) : mode === 'manual' ? (
      <>
        <Button variant="secondary" size="md" onClick={onClose}>{t.cancel}</Button>
        <Button variant="primary" size="md" leadingIcon="plus" onClick={addManual}>{t.add}</Button>
      </>
    ) : (
      <>
        <Button variant="secondary" size="md" onClick={onClose}>{t.cancel}</Button>
        <Button variant="primary" size="md" leadingIcon="search" onClick={search}>{t.search}</Button>
      </>
    )

  const errBar = error && (
    <div className="gpi-errbar" role="alert">
      <Icon name="alert-circle" size={18} />
      <span>{t.errors[error]}</span>
    </div>
  )

  const rememberRow = (
    <button type="button" className="gpi-checkrow" onClick={() => setRemember((v) => !v)} aria-pressed={remember}>
      <span className={`gpi-check ${remember ? 'is-on' : ''}`} aria-hidden="true">
        {remember && <Icon name="check" size={13} />}
      </span>
      <span className="gpi-checkrow__text">
        <span className="gpi-checkrow__title">{t.remember}</span>
        <span className="gpi-checkrow__help">{t.rememberHelp}</span>
      </span>
    </button>
  )

  return (
    <Modal title={t.title} closeLabel={t.cancel} onClose={onClose} footer={footer}>
      <div className="gpi-addins">
        {mode !== 'manual' && mode !== 'confirmed' && (
          <SegmentedControl
            variant="indigo"
            value={method}
            onChange={(v) => { setMethod(v); clearErr() }}
            options={[
              { value: 'personal', label: t.tabs.personal },
              { value: 'policy', label: t.tabs.policy },
            ]}
          />
        )}

        {mode === 'search' && (
          <>
            {errBar}
            <p className="gpi-addins__intro">{method === 'personal' ? t.personalIntro : t.policyIntro}</p>
            {method === 'personal' ? (
              <>
                <Field
                  label={t.fields.personalId} required hint={t.fields.personalIdHint}
                  placeholder={t.fields.personalIdPh} value={personalId} error={errField === 'id'}
                  onChange={(v) => { setPersonalId(v); clearErr() }} onKeyDown={onEnter} inputMode="numeric"
                />
                <Field
                  label={t.fields.birth} required placeholder={t.fields.birthPh}
                  value={birthDate} error={errField === 'birth'}
                  onChange={(v) => { setBirthDate(v); clearErr() }} onKeyDown={onEnter}
                />
              </>
            ) : (
              <Field
                label={t.fields.policy} required placeholder={t.fields.policyPh}
                value={policyNumber} error={errField === 'policy'}
                onChange={(v) => { setPolicyNumber(v); clearErr() }} onKeyDown={onEnter}
              />
            )}
            {/* Manual-entry fallback ("provide all information") hidden 2026-07-05 —
               GPI hasn't confirmed the backend supports adding a person who isn't
               found by lookup. Re-enable by restoring this link (the `manual` mode,
               goManual, and man state below are still wired):
            <div className="gpi-addins__manual">
              {t.manualLink.split('? ')[0]}?{' '}
              <button type="button" className="gpi-link" onClick={goManual}>
                {t.manualLink.split('? ')[1]} <Icon name="arrow-right" size={14} />
              </button>
            </div> */}
          </>
        )}

        {mode === 'confirmed' && (
          <>
            <p className="gpi-addins__intro">{t.confirmIntro}</p>
            <div className="gpi-found">
              <Avatar name={found.name} seed={found.avatar} size={44} />
              <div className="gpi-found__meta">
                <span className="gpi-found__name">{found.name}</span>
                <span className="gpi-found__id">{found.metaId} · {found.policyId}</span>
                <span className="gpi-badge gpi-badge--sm gpi-badge--success gpi-found__badge">
                  <Icon name="shield-check" size={13} />{t.activePolicy}
                </span>
              </div>
            </div>
            {rememberRow}
          </>
        )}

        {mode === 'manual' && (
          <>
            <button type="button" className="gpi-link gpi-addins__back" onClick={backToSearch}>
              <Icon name="arrow-left" size={15} />{t.manualBack}
            </button>
            <p className="gpi-addins__intro">{t.manualIntro}</p>
            {errBar}
            <div className="gpi-addins__grid">
              <Field label={t.fields.firstName} required placeholder={t.fields.firstName}
                value={man.firstName} onChange={(v) => { setMan((s) => ({ ...s, firstName: v })); clearErr() }} />
              <Field label={t.fields.lastName} required placeholder={t.fields.lastName}
                value={man.lastName} onChange={(v) => { setMan((s) => ({ ...s, lastName: v })); clearErr() }} />
              <Field label={t.fields.personalId} required placeholder={t.fields.personalIdPh} inputMode="numeric"
                value={man.id} onChange={(v) => { setMan((s) => ({ ...s, id: v })); clearErr() }} />
              <Field label={t.fields.birth} required placeholder={t.fields.birthPh}
                value={man.birth} onChange={(v) => setMan((s) => ({ ...s, birth: v }))} />
            </div>
            <label className="gpi-field">
              <span className="gpi-field__lbl">{t.fields.relation}</span>
              <select className="gpi-input gpi-input--select" value={man.relation}
                onChange={(e) => setMan((s) => ({ ...s, relation: e.target.value }))}>
                <option value="" disabled>{t.fields.relationPh}</option>
                {Object.entries(t.relationOpts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            {rememberRow}
          </>
        )}
      </div>
    </Modal>
  )
}

/* Field — labelled text input matching the Figma Text Input (label above,
   neutral/400 border, 12px radius, red asterisk + error stroke). */
function Field({ label, required, hint, placeholder, value, onChange, error, ...rest }) {
  return (
    <label className="gpi-field">
      <span className="gpi-field__lbl">{label}{required && <span className="gpi-field__req">*</span>}</span>
      <input
        className={`gpi-input ${error ? 'is-error' : ''}`}
        type="text" value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} {...rest}
      />
      {hint && <span className="gpi-field__hint">{hint}</span>}
    </label>
  )
}
