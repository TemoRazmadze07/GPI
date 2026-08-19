/* A6b — the 2-step upload sheet (F-02 „ატვირთე სხვა კლინიკის დოკუმენტი"),
   built for stakeholder comment #7 (2026-08-18).

   The point of #7 is that uploading happens IN CONTEXT: you are looking at your
   analyses, so the result you add lands in analyses — no trip to a separate
   დოკუმენტები drawer (which #13 then removes). Consequences visible here:
     · the CATEGORY is preselected from whatever the section is filtered to, so
       the common case is a straight confirm rather than a form;
     · the record is stamped `src: 'external'` + its clinic, which is what
       SourceTag renders — the origin is never inferred from a status badge;
     · consent is PER UPLOAD („გავუზიაროთ პირად ექიმს?"), defaulting ON per the
       F-02 spec (uploads are shared with the Curatio doctor) — the toggle turns
       a policy into a choice, and the hint states plainly what each state means.
   Step 1 is a stub picker: no real file lands in a prototype, so any of the three
   sources produces the same placeholder and moves on. Steps stay in ONE sheet so
   „back" is a step, not a navigation. */

import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { V2_ANALYSIS_CATS, V2_PERSONS, DOCTOR, getPickedDoctor } from './data.js'
import { FilterSheet } from './filters.jsx'

const SOURCES = [
  { id: 'camera', icon: 'camera', label: M.upl.camera },
  { id: 'gallery', icon: 'folder', label: M.upl.gallery },
  { id: 'file', icon: 'paperclip', label: M.upl.file },
]

/* Real categories only — „ყველა" is a filter value, not a property of a record. */
const CATS = V2_ANALYSIS_CATS.filter((c) => c.id !== 'all')

export default function UploadSheet({ cat = 'all', onClose, onDone }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [clinic, setClinic] = useState('')
  const [date, setDate] = useState('18 აგვ')
  const [catId, setCatId] = useState(cat)
  const [personId, setPersonId] = useState(V2_PERSONS[0].id)
  const [shared, setShared] = useState(true)
  const [picker, setPicker] = useState(null) /* 'cat' | 'person' | null */
  const [err, setErr] = useState(null)

  const doc = { ...DOCTOR, ...(getPickedDoctor() || {}) }
  const person = V2_PERSONS.find((p) => p.id === personId)
  const catLabel = CATS.find((c) => c.id === catId)?.label || M.upl.catPick

  const submit = () => {
    if (!name.trim()) return setErr('name')
    if (catId === 'all') return setErr('cat')
    onDone({
      title: name.trim(),
      cat: catId,
      date,
      src: 'external',
      /* Blank stays blank: falling back to M.src.external made SourceTag compose
         „გარე · გარე", since it already prefixes the origin label. */
      clinic: clinic.trim() || null,
      person: person.name.split(' ')[0],
      shared,
    })
  }

  return (
    <div className="mga-sheetwrap" role="dialog" aria-modal="true" aria-label={M.upl.pickTitle}>
      <button className="mga-sheetwrap__scrim" aria-label={M.otp.close} onClick={onClose} />
      <div className="mga-sheet">
        <div className="mga-sheet__grab" aria-hidden="true" />
        <div className="mga-sheet__head mga-upl__head">
          <h2 className="mga-sheet__title">{step === 1 ? M.upl.pickTitle : M.upl.metaTitle}</h2>
          <span className="mga-upl__step">{M.upl.step(step)}</span>
        </div>

        {step === 1 ? (
          <>
            <div className="mga-meta__lbl mga-upl__hint">{M.upl.pickHint}</div>
            <div className="mga-fsheet">
              {SOURCES.map((s) => (
                <button
                  key={s.id}
                  className="mga-fopt"
                  onClick={() => {
                    /* No real file in a prototype — the name stays the user's to write. */
                    setStep(2)
                  }}
                >
                  <span className="mga-upl__optlbl">
                    <Icon name={s.icon} size={16} />
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mga-upl__field">
              <label className="mga-dsheet__lbl" htmlFor="upl-name">{M.upl.name}</label>
              <input
                id="upl-name"
                className={'mga-upl__inp' + (err === 'name' ? ' mga-upl__inp--err' : '')}
                value={name}
                placeholder={M.upl.namePh}
                onChange={(e) => {
                  setName(e.target.value)
                  if (err === 'name') setErr(null)
                }}
              />
              {err === 'name' && <div className="mga-upl__err">{M.upl.errName}</div>}
            </div>

            <div className="mga-upl__row">
              <div className="mga-upl__field">
                <label className="mga-dsheet__lbl" htmlFor="upl-clinic">{M.upl.clinic}</label>
                <input
                  id="upl-clinic"
                  className="mga-upl__inp"
                  value={clinic}
                  placeholder={M.upl.clinicPh}
                  onChange={(e) => setClinic(e.target.value)}
                />
              </div>
              <div className="mga-upl__field">
                <label className="mga-dsheet__lbl" htmlFor="upl-date">{M.upl.date}</label>
                <input id="upl-date" className="mga-upl__inp" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <div className="mga-upl__row">
              <div className="mga-upl__field">
                <span className="mga-dsheet__lbl">{M.upl.cat}</span>
                <button
                  className={'mga-upl__inp mga-upl__sel' + (err === 'cat' ? ' mga-upl__inp--err' : '')}
                  onClick={() => setPicker('cat')}
                >
                  <span>{catLabel}</span>
                  <Icon name="chevron-down" size={13} />
                </button>
                {err === 'cat' && <div className="mga-upl__err">{M.upl.errCat}</div>}
              </div>
              <div className="mga-upl__field">
                <span className="mga-dsheet__lbl">{M.upl.person}</span>
                <button className="mga-upl__inp mga-upl__sel" onClick={() => setPicker('person')}>
                  <span>{person.name.split(' ')[0]}</span>
                  <Icon name="chevron-down" size={13} />
                </button>
              </div>
            </div>

            {/* Consent is a choice per upload, not a setting buried elsewhere — and the
                hint changes with the state so „off" is as legible as „on". */}
            {/* Control on the LEFT, label to its right — global toggle rule
                (2026-08-17); this row predated it with the switch pinned right
                (audit A2). */}
            <div className="mga-upl__consent">
              <button
                className={'mga-swbtn' + (shared ? ' mga-swbtn--on' : '')}
                role="switch"
                aria-checked={shared}
                aria-label={M.upl.consent}
                onClick={() => setShared((v) => !v)}
              />
              <span className="mga-upl__consenttxt">
                <span className="mga-meta__val" style={{ fontSize: 12 }}>{M.upl.consent}</span>
                <span className="mga-meta__lbl">
                  {shared ? M.upl.consentOn(doc.name) : M.upl.consentOff}
                </span>
              </span>
            </div>

            <div className="mga-trf__btns mga-trf__btns--stack">
              <button className="mga-btn mga-btn--primary mga-btn--lg mga-btn--block" onClick={submit}>
                {M.upl.submit}
              </button>
              <button className="mga-btn mga-btn--secondary mga-btn--lg mga-btn--block" onClick={onClose}>
                {M.upl.cancel}
              </button>
            </div>
          </>
        )}
      </div>

      {picker === 'cat' && (
        <FilterSheet
          title={M.upl.cat}
          options={CATS}
          value={catId}
          onPick={(id) => {
            setCatId(id)
            if (err === 'cat') setErr(null)
          }}
          onClose={() => setPicker(null)}
        />
      )}
      {picker === 'person' && (
        <FilterSheet
          title={M.upl.person}
          options={V2_PERSONS.map((p) => ({ id: p.id, label: p.name }))}
          value={personId}
          onPick={setPersonId}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  )
}
