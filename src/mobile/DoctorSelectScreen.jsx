/* #1 (stakeholder comments 2026-08-18) — personal-doctor selection. V2 only,
   reached from the dash doctor card's EMPTY variant (?doc=0).
   REUSE, not a new design: in production this is the booking flow's doctor
   selection (usability-tested 2026-07, in development) opened in a "select
   personal doctor" mode — family doctors only. Its selection controls are
   mirrored here: CITY + CLINIC filters (FilterPill/FilterSheet reused from
   filters.jsx) + name search, and the flow's Geo/Eng/Rus language chips on
   each doctor. Its calendar/slots are OUT — availability is booking info, not
   selection info (user call, 2026-08-18). Photos = Unsplash stand-ins.
   No OTP gate: nothing history-class is SHOWN — the sensitive part is the
   GRANT of history access to the chosen doctor, which the confirm sheet makes
   explicit (consent line). Confirm → success sheet; „ჩაეწერე პირველ ვიზიტზე"
   deep-links into the booking flow in production (doctor preselected) — in
   the prototype both actions return to the dash with the doctor assigned. */

import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { SELECT_DOCTORS, DOCSEL_CITIES, DOCSEL_CLINICS, setPickedDoctor } from './data.js'
import { go } from './nav.js'
import { FilterSheet, FilterPill } from './filters.jsx'

export default function DoctorSelectScreen() {
  const [q, setQ] = useState('')
  const [city, setCity] = useState('tbilisi')
  const [clinic, setClinic] = useState('all')
  const [sheet, setSheet] = useState(null) /* 'city' | 'clinic' | null */
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)

  const finish = () => go('curatio', { doc: true })

  const doctors = SELECT_DOCTORS.filter(
    (d) =>
      d.city === city &&
      (clinic === 'all' || d.clinicId === clinic) &&
      (!q.trim() || d.name.includes(q.trim()))
  )
  const cityLabel = DOCSEL_CITIES.find((c) => c.id === city).label
  const clinicLabel = DOCSEL_CLINICS.find((c) => c.id === clinic).label

  return (
    <>
      <div className="mga-hdr">
        <button className="mga-iconbtn" aria-label={M.a11y.back} onClick={() => go('curatio')}>
          <Icon name="chevron-left" size={16} />
        </button>
        <div>
          <h1 className="mga-hdr__title">{M.docsel.title}</h1>
          <div className="mga-hdr__sub">{M.docsel.sub}</div>
        </div>
      </div>

      <div className="mga-dsearch">
        <Icon name="search" size={14} />
        <input
          type="search"
          value={q}
          placeholder={M.docsel.searchPh}
          aria-label={M.docsel.searchPh}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="mga-chiprow mga-chiprow--fill" role="group" aria-label={M.docsel.cityF + ' · ' + M.docsel.clinicF}>
        {/* Value-only pills — the label prefixes overflowed 390px (user, 2026-08-18);
            the sheet titles still carry ქალაქი / კლინიკა. */}
        <FilterPill value={cityLabel} onOpen={() => setSheet('city')} />
        <FilterPill value={clinicLabel} onOpen={() => setSheet('clinic')} />
      </div>

      <div className="mga-body" style={{ paddingTop: 0 }}>
        {doctors.length > 0 ? (
          <div className="mga-card mga-card--list">
            {doctors.map((d) => (
              <button key={d.id} className="mga-trf__row mga-dsel__row" onClick={() => setPicked(d)}>
                <span className="mga-dsel__main">
                  <span className="mga-trf__ava" aria-hidden="true">
                    <img src={d.photo} alt="" />
                  </span>
                  {/* Clinic dropped from the row — the clinic FILTER above already
                      scopes the list, so repeating it on every row is noise (user,
                      2026-08-18). Full details live in the confirm sheet. */}
                  <span className="mga-dsel__meta">
                    <span className="mga-trf__name">{d.name}</span>
                    <span className="mga-meta__lbl mga-dsel__role">
                      {d.spec} · {M.docsel.exp(d.exp)}
                    </span>
                  </span>
                </span>
                {/* Own row, indented past the avatar — the booking flow's pattern. */}
                <span className="mga-dsel__tags">
                  {d.langs.map((l) => (
                    <span key={l} className="mga-langtag">{l}</span>
                  ))}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mga-qpk__empty">
            <Icon name="search" size={22} />
            <div className="mga-meta__val" style={{ marginTop: 8 }}>{M.docsel.empty}</div>
            <div className="mga-meta__lbl" style={{ marginTop: 4 }}>{M.docsel.emptyHint}</div>
          </div>
        )}
      </div>

      {sheet === 'city' && (
        <FilterSheet
          title={M.docsel.cityF}
          options={DOCSEL_CITIES}
          value={city}
          onPick={setCity}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === 'clinic' && (
        <FilterSheet
          title={M.docsel.clinicF}
          options={DOCSEL_CLINICS}
          value={clinic}
          onPick={setClinic}
          onClose={() => setSheet(null)}
        />
      )}

      {picked && (
        <div className="mga-sheetwrap" role="dialog" aria-modal="true" aria-label={M.docsel.confirmTitle}>
          <button
            className="mga-sheetwrap__scrim"
            aria-label={M.docsel.close}
            onClick={() => (done ? finish() : setPicked(null))}
          />
          <div className="mga-sheet">
            <div className="mga-sheet__grab" aria-hidden="true" />
            {!done ? (
              <>
                <div className="mga-sheet__head mga-dsheet__head">
                  <h2 className="mga-sheet__title">{M.docsel.confirmTitle}</h2>
                </div>
                {/* Doctor DETAILS live here (user, 2026-08-18): rows stay scannable,
                    and the details land exactly where the decision is made. Same
                    field grammar as the A4 detail screen. */}
                <div className="mga-dsheet__hero">
                  <span className="mga-trf__ava" aria-hidden="true">
                    <img src={picked.photo} alt="" />
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span className="mga-trf__name" style={{ display: 'block' }}>{picked.name}</span>
                    <span className="mga-meta__lbl">
                      {picked.spec} · {M.docsel.exp(picked.exp)}
                    </span>
                  </span>
                </div>
                <div className="mga-kv mga-dsheet__kv">
                  <div className="mga-kv__row">
                    <span className="mga-kv__lbl">{M.docsel.clinicL}</span>
                    <span className="mga-kv__val">{picked.clinic}</span>
                  </div>
                  <div className="mga-kv__row">
                    <span className="mga-kv__lbl">{M.docsel.langs}</span>
                    <span className="mga-kv__val">{picked.langs.join(' · ')}</span>
                  </div>
                  <div className="mga-kv__row">
                    <span className="mga-kv__lbl">{M.docsel.hours}</span>
                    <span className="mga-kv__val">{picked.hours}</span>
                  </div>
                </div>
                <div className="mga-trf__includes mga-dsheet__consent">{M.docsel.consent}</div>
                <div className="mga-trf__btns mga-trf__btns--stack">
                  <button
                    className="mga-btn mga-btn--primary mga-btn--lg mga-btn--block"
                    onClick={() => {
                      setPickedDoctor(picked)
                      setDone(true)
                    }}
                  >
                    {M.docsel.pick}
                  </button>
                  <button className="mga-btn mga-btn--secondary mga-btn--lg mga-btn--block" onClick={() => setPicked(null)}>
                    {M.docsel.cancel}
                  </button>
                </div>
              </>
            ) : (
              <div className="mga-trf__success">
                <span className="mga-trf__successico" aria-hidden="true">
                  <Icon name="check" size={22} />
                </span>
                <div className="mga-sheet__title" style={{ marginTop: 10 }}>{M.docsel.successTitle}</div>
                <div className="mga-meta__lbl" style={{ marginTop: 4 }}>
                  {M.docsel.successBody} <b>{picked.name}</b>
                </div>
                <div className="mga-trf__btns mga-trf__btns--stack">
                  <button className="mga-btn mga-btn--primary mga-btn--lg mga-btn--block" onClick={finish}>
                    {M.docsel.bookFirst}
                  </button>
                  <button className="mga-btn mga-btn--secondary mga-btn--lg mga-btn--block" onClick={finish}>
                    {M.docsel.close}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
