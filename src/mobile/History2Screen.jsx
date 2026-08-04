/* A6 — V2 medical history, stakeholder parity FILTERED by the MVP1 spec.
   V1 keeps HistoryScreen untouched; MobileApp routes history → this in V2.
   A6c restructure (user decision 2026-08-04): no more tabs — each section is
   its OWN PAGE reached from HistoryHubScreen (?sec= in the hash), header is a
   plain title + back-to-hub. The stacked period/category chip rows collapsed
   into ONE row of filter pills that open a bottom-sheet picker (reuses the
   mga-sheet grammar). Charts stay OUT (F-02 "მხოლოდ PDF", F-03) — the
   category FILTER replaces the stakeholder chart block. Linkage fixes vs
   their file: expiring-med CTA = „მოითხოვე განახლება" (F-03/F-05 renewal),
   not a booking button; per-row „ჩაეწერე" CTAs stay dead until F-04. Visit
   „შედეგის ატვირთვა" jumps to the docs section — one upload home. The 2-step
   upload sheet itself is A6b (not built yet). OTP gates in place (deep links
   cannot bypass); the normal path unlocks at the hub and inherits here. */

import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { V2_HISTORY, V2_ANALYSIS_CATS } from './data.js'
import { go, sectionParam } from './nav.js'
import { OtpSheet, isUnlocked } from './otp.jsx'

const noop = () => {}

const BADGE = {
  norm: 'mga-badge--green',
  warn: 'mga-badge--amber',
  crit: 'mga-badge--red',
  uploaded: 'mga-badge--lav',
}

/* Bottom-sheet single-choice picker for a filter pill (mga-sheet grammar). */
function FilterSheet({ title, options, value, onPick, onClose }) {
  return (
    <div className="mga-sheetwrap" role="dialog" aria-modal="true" aria-label={title}>
      <button className="mga-sheetwrap__scrim" aria-label={M.otp.close} onClick={onClose} />
      <div className="mga-sheet">
        <div className="mga-sheet__grab" aria-hidden="true" />
        <div className="mga-sheet__head">
          <h2 className="mga-sheet__title">{title}</h2>
        </div>
        <div className="mga-fsheet">
          {options.map((o) => (
            <button
              key={o.id}
              className={'mga-fopt' + (value === o.id ? ' mga-fopt--on' : '')}
              aria-pressed={value === o.id}
              onClick={() => {
                onPick(o.id)
                onClose()
              }}
            >
              <span>{o.label}</span>
              {value === o.id && <Icon name="check" size={15} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function FilterPill({ label, value, onOpen }) {
  return (
    <button className="mga-chip mga-fpill" onClick={onOpen}>
      {label ? label + ': ' + value : value}
      <Icon name="chevron-down" size={12} />
    </button>
  )
}

export default function History2Screen() {
  const sec = sectionParam() || 'analyses'
  const [period, setPeriod] = useState('m3')
  const [cat, setCat] = useState('all')
  const [year, setYear] = useState('2026')
  const [sheet, setSheet] = useState(null) /* 'period' | 'cat' | 'year' | null */
  const [unlocked, setUnlocked] = useState(isUnlocked())

  const header = (
    <div className="mga-hdr">
      <button className="mga-back" aria-label="უკან" onClick={() => go('histhub')}>
        <Icon name="chevron-left" size={16} />
      </button>
      <h1 className="mga-hdr__title">{M.histhub.rows[sec]}</h1>
    </div>
  )

  if (!unlocked) {
    return (
      <>
        {header}
        <div className="mga-body">
          <div className="mga-qpk__empty">
            <Icon name="lock" size={22} />
            <div className="mga-meta__val" style={{ marginTop: 8 }}>{M.dash.protectedTitle}</div>
            <div className="mga-meta__lbl" style={{ marginTop: 2 }}>{M.dash.protectedHint}</div>
          </div>
        </div>
        <OtpSheet onSuccess={() => setUnlocked(true)} onClose={() => go('curatio')} />
      </>
    )
  }

  const analyses = V2_HISTORY.analyses.filter((r) => cat === 'all' || r.cat === cat)
  const visits = V2_HISTORY.visits.filter((v) => v.year === year)
  const periodOpts = Object.entries(M.history.periods).map(([id, label]) => ({ id, label }))
  const yearOpts = [...M.hist2.years.map((y) => ({ id: y, label: y })), { id: 'range', label: M.hist2.yearRange }]
  const catLabel = V2_ANALYSIS_CATS.find((c) => c.id === cat).label

  return (
    <>
      {header}

      {sec === 'analyses' && (
        <>
          <div className="mga-chiprow" role="group" aria-label={M.hist2.filterPeriod + ' · ' + M.hist2.filterCat}>
            <FilterPill value={M.history.periods[period]} onOpen={() => setSheet('period')} />
            <FilterPill label={M.hist2.filterCat} value={catLabel} onOpen={() => setSheet('cat')} />
          </div>
          <div className="mga-body" style={{ paddingTop: 0 }}>
            <div className="mga-card" style={{ padding: '4px 16px' }}>
              {analyses.map((r) => (
                <div key={r.title + r.date} className="mga-hitem">
                  <div className="mga-hitem__body">
                    <div className="mga-meta__val" style={{ fontSize: 12.5 }}>
                      {r.title} · {r.person}
                    </div>
                    <div className="mga-meta__lbl">
                      {r.date} · {r.src}
                    </div>
                    {r.note && <div className="mga-hitem__note">{r.note}</div>}
                    {r.book && (
                      <button className="mga-h2__minicta" onClick={noop}>
                        {M.hist2.book}
                      </button>
                    )}
                  </div>
                  <span className={'mga-badge ' + BADGE[r.status]}>{M.history.statuses[r.status]}</span>
                  <button className="mga-dlbtn" aria-label={M.history.download + ' — ' + r.title}>
                    <Icon name="download" size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {sheet === 'period' && (
            <FilterSheet
              title={M.hist2.filterPeriod}
              options={periodOpts}
              value={period}
              onPick={setPeriod}
              onClose={() => setSheet(null)}
            />
          )}
          {sheet === 'cat' && (
            <FilterSheet
              title={M.hist2.filterCat}
              options={V2_ANALYSIS_CATS}
              value={cat}
              onPick={setCat}
              onClose={() => setSheet(null)}
            />
          )}
        </>
      )}

      {sec === 'prescriptions' && (
        <div className="mga-body" style={{ paddingTop: 0 }}>
          <div className="mga-card">
            <div className="mga-h2__sec">{M.hist2.sections.meds}</div>
            {V2_HISTORY.meds.map((m) => (
              <div key={m.name} className={'mga-h2__med' + (m.state === 'expiring' ? ' mga-h2__med--exp' : '')}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mga-meta__val" style={{ fontSize: 12.5 }}>{m.name}</div>
                  <div className="mga-meta__lbl">
                    {m.how} · {m.by}
                  </div>
                  {m.expiry && <div className="mga-h2__exp">{m.expiry}</div>}
                </div>
                {m.state === 'expiring' ? (
                  <button className="mga-h2__minicta mga-h2__minicta--red" onClick={noop}>
                    {M.hist2.renew}
                  </button>
                ) : (
                  <span className={'mga-badge ' + (m.state === 'chronic' ? 'mga-badge--lav' : 'mga-badge--green')}>
                    {M.hist2.medStates[m.state]}
                  </span>
                )}
              </div>
            ))}

            <div className="mga-h2__sec" style={{ marginTop: 12 }}>{M.hist2.sections.studies}</div>
            {V2_HISTORY.studies.map((s) => (
              <div key={s.title} style={{ padding: '8px 0' }}>
                <div className="mga-meta__val" style={{ fontSize: 12.5 }}>{s.title}</div>
                <div className="mga-meta__lbl">{s.meta}</div>
                <div className="mga-h2__callout">📋 {s.prep}</div>
                <div className="mga-h2__callout mga-h2__callout--amber">⏰ {s.repeat}</div>
              </div>
            ))}
          </div>

          <div className="mga-card">
            <div className="mga-h2__sec">{M.hist2.sections.referrals}</div>
            {V2_HISTORY.referrals.map((r) => (
              <div key={r.number} className="mga-h2__med">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mga-meta__val" style={{ fontSize: 12.5 }}>{r.title}</div>
                  <div className="mga-meta__lbl">
                    № {r.number} · {r.expiry}
                  </div>
                  {r.prep && <div className="mga-h2__callout">📋 {r.prep}</div>}
                </div>
                <span className={'mga-badge ' + (r.status === 'booked' ? 'mga-badge--green' : 'mga-badge--amber')}>
                  {M.hist2.refStatuses[r.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sec === 'visits' && (
        <>
          <div className="mga-chiprow" role="group" aria-label={M.hist2.filterYear}>
            <FilterPill label={M.hist2.filterYear} value={year === 'range' ? M.hist2.yearRange : year} onOpen={() => setSheet('year')} />
          </div>
          <div className="mga-body" style={{ paddingTop: 0 }}>
            {visits.map((v) => (
              <div key={v.title + v.date} className="mga-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div className="mga-meta__val" style={{ fontSize: 12.5 }}>
                    {v.title} · {v.person}
                  </div>
                  <span className="mga-badge mga-badge--green">{M.hist2.visitStatuses.done}</span>
                </div>
                <div className="mga-meta__lbl">
                  {v.date} · {v.by} · {v.clinic}
                </div>
                <div className="mga-h2__summary">{v.summary}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <button className="mga-h2__minicta" onClick={noop}>
                    <Icon name="download" size={11} /> {M.hist2.downloadPdf}
                  </button>
                  <button className="mga-h2__minicta" onClick={() => go('history', { sec: 'docs' })}>
                    <Icon name="upload" size={11} /> {M.hist2.uploadResult}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {sheet === 'year' && (
            <FilterSheet
              title={M.hist2.filterYear}
              options={yearOpts}
              value={year}
              onPick={setYear}
              onClose={() => setSheet(null)}
            />
          )}
        </>
      )}

      {sec === 'docs' && (
        <div className="mga-body" style={{ paddingTop: 0 }}>
          <div className="mga-h2__uzone">
            <span className="mga-h2__uico">
              <Icon name="upload" size={19} />
            </span>
            <div className="mga-meta__val" style={{ marginTop: 8 }}>{M.hist2.uploadTitle}</div>
            <div className="mga-meta__lbl" style={{ marginTop: 2 }}>{M.hist2.uploadHint}</div>
            {/* A6b: the 2-step upload sheet opens from here once built. */}
            <button className="mga-obtn" style={{ marginTop: 10 }} onClick={noop}>
              {M.hist2.uploadCta}
            </button>
          </div>

          <div className="mga-card" style={{ padding: '4px 16px' }}>
            <div className="mga-h2__sec" style={{ paddingTop: 8 }}>{M.hist2.uploadedDocs}</div>
            {V2_HISTORY.docs.map((d) => (
              <div key={d.title} className="mga-hitem">
                <div className="mga-hitem__body">
                  <div className="mga-meta__val" style={{ fontSize: 12.5 }}>{d.title}</div>
                  <div className="mga-meta__lbl">
                    {d.date} · {d.type}
                    {d.shared && <> · {M.hist2.sharedNote}</>}
                  </div>
                </div>
                <span className="mga-prow__chv">
                  <Icon name="chevron-right" size={15} />
                </span>
              </div>
            ))}
          </div>

          <div className="mga-h2__confid">
            <Icon name="shield-check" size={14} />
            <span>{M.hist2.confid}</span>
          </div>
        </div>
      )}
    </>
  )
}
