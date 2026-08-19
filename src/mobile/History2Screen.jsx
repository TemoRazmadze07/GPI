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
import {
  V2_HISTORY,
  V2_ANALYSIS_CATS,
  getUploads,
  addUpload,
  getDismissedMeds,
  setMedDismissed,
} from './data.js'
import SourceTag from './SourceTag.jsx'
import UploadSheet from './UploadSheet.jsx'
import { FilterSheet, FilterPill } from './filters.jsx'
import { go, sectionParam } from './nav.js'
import { OtpSheet, isUnlocked } from './otp.jsx'
import { usePurchaseGate, GateLock } from './purchase.jsx'

const noop = () => {}

/* #7: `uploaded` is gone — origin moved to SourceTag, so this map holds only
   CLINICAL status again, and a record without one simply shows no badge. */
/* #10 — one glyph per encounter kind; the label beside it does the real work. */
const VISIT_ICON = { visit: 'building-2', phone: 'phone', online: 'video' }

const BADGE = {
  norm: 'mga-badge--quiet' /* the expected reading doesn't need a colour — see mga.css */,
  warn: 'mga-badge--amber',
  crit: 'mga-badge--red',
}

export default function History2Screen() {
  /* #13 — `sec=docs` links (old hub rows, bookmarks, the flow map) must not land on a
     blank screen now that the section is gone: anything unknown falls back to analyses,
     which is where those records were re-homed. */
  const sec = M.histhub.rows[sectionParam()] ? sectionParam() : 'analyses'
  const [period, setPeriod] = useState('m3')
  const [cat, setCat] = useState('all')
  const [year, setYear] = useState('2026')
  const [sheet, setSheet] = useState(null) /* 'period' | 'cat' | 'year' | null */
  const [unlocked, setUnlocked] = useState(isUnlocked())
  /* #7 — results added during this session sit in front of the seeded ones. */
  const [uploads, setUploads] = useState(getUploads)
  const [uploading, setUploading] = useState(false)
  /* User, 2026-08-18: with everything stacked, a long medication list buried კვლევები
     and მიმართვები. The three groups are peers, so they get the main page's own
     segmented control instead of a scroll. */
  const [grp, setGrp] = useState('meds')
  const [dismissed, setDismissed] = useState(getDismissedMeds)
  /* #14 — records stay open without cover; the actions that spend insurance do not. */
  const { gated, guard, sheet: buySheet } = usePurchaseGate()

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

  const analyses = [...uploads, ...V2_HISTORY.analyses].filter((r) => cat === 'all' || r.cat === cat)
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
            {/* #7 — upload lives IN the section, above the list: the results you are
                looking at are the reason you reach for it, and it must not require
                scrolling past every record to find. */}
            <button className="mga-h2__ubtn" onClick={() => setUploading(true)}>
              <Icon name="upload" size={15} />
              {M.upl.entry}
            </button>
            <div className="mga-card" style={{ padding: '4px 16px' }}>
              {/* Key needs the ORIGIN: the same test exists twice — once done at Curatio,
                  once uploaded from another clinic on the same date (#13's re-homing).
                  An earlier attempt at this fix silently no-opped, so React kept warning. */}
              {analyses.map((r) => (
                <div key={r.title + r.date + (r.clinic || r.src)} className="mga-hitem mga-hitem--top">
                  <div className="mga-hitem__body">
                    {/* #7 polish (user, 2026-08-18): the status used to be a column of
                        its own, vertically centred — on a row with a note + CTA it
                        floated mid-height and squeezed the note into three lines. It
                        now sits on the TITLE line, where the reading belongs, and the
                        note gets the full width. Badges still form one column, since
                        every body ends at the same x. */}
                    {/* Standing rule (user, 2026-08-18): a TITLE never shares its line with a
                        badge. It owns the full width; the status drops into the meta line
                        below, which already wraps. A 29-char record name broke over three
                        lines under the old right-rail treatment. */}
                    <div className="mga-meta__val" style={{ fontSize: 12.5 }}>
                      {r.title} · {r.person}
                    </div>
                    <div className="mga-hitem__meta">
                      {r.status && (
                        <span className={'mga-badge ' + BADGE[r.status]}>{M.history.statuses[r.status]}</span>
                      )}
                      <span className="mga-meta__lbl">{r.date}</span>
                      <SourceTag src={r.src} clinic={r.clinic} />
                      {r.shared && (
                        <span className="mga-mark">
                          <Icon name="check" size={10} /> {M.upl.shared}
                        </span>
                      )}
                    </div>
                    {r.note && <div className="mga-hitem__note">{r.note}</div>}
                    {r.book && (
                      <button className={'mga-obtn mga-obtn--sm' + (gated ? ' mga-obtn--locked' : '')} onClick={guard(noop)}>
                        {M.hist2.book}
                        <GateLock gated={gated} />
                      </button>
                    )}
                  </div>
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
        <>
          <div className="mga-seg" role="tablist" aria-label={M.hist2.groups}>
            {['meds', 'studies', 'referrals'].map((id) => (
              <button
                key={id}
                className={'mga-seg__item' + (grp === id ? ' mga-seg__item--on' : '')}
                role="tab"
                aria-selected={grp === id}
                onClick={() => setGrp(id)}
              >
                {M.hist2.sections[id]}
              </button>
            ))}
          </div>

          <div className="mga-body" style={{ paddingTop: 0 }}>
            <div className="mga-card">
              {grp === 'meds' &&
                V2_HISTORY.meds.map((m) => {
                  const off = dismissed.includes(m.name)
                  const renewable = m.state === 'expiring' || m.state === 'chronic'
                  const setOff = (on) => {
                    setMedDismissed(m.name, on)
                    setDismissed(getDismissedMeds())
                  }
                  return (
                    <div
                      key={m.name}
                      className={'mga-h2__rx' + (m.state === 'expiring' && !off ? ' mga-h2__rx--warn' : '')}
                    >
                      <div className="mga-meta__val" style={{ fontSize: 12.5 }}>{m.name}</div>
                      <div className="mga-hitem__meta">
                        <span
                          className={
                            'mga-badge ' +
                            (off ? 'mga-badge--quiet' : m.state === 'expiring' ? 'mga-badge--amber' : 'mga-badge--quiet')
                          }
                        >
                          {off ? M.hist2.dismissed : M.hist2.medStates[m.state]}
                        </span>
                        <span className="mga-meta__lbl">
                          {m.how} · {m.by}
                        </span>
                        <SourceTag src={m.src} clinic={m.clinic} />
                      </div>
                      {m.expiry && !off && <div className="mga-h2__exp">{m.expiry}</div>}
                      {/* User, 2026-08-18: „what if patient do not need the medicament
                          anymore?" — renewal was the row's only answer. The way out sits
                          next to it, and it silences the prompt rather than claiming
                          anything clinical. Reversible. */}
                      {renewable && !off && (
                        <>
                          <div className="mga-h2__renewnote">{M.hist2.renewNote}</div>
                          <button className={'mga-obtn' + (gated ? ' mga-obtn--locked' : '')} onClick={guard(noop)}>
                            {M.hist2.renew}
                            {gated ? <GateLock gated /> : <Icon name="chevron-right" size={12} />}
                          </button>
                          <button className="mga-h2__textbtn" onClick={() => setOff(true)}>
                            {M.hist2.dismiss}
                          </button>
                        </>
                      )}
                      {off && (
                        <>
                          <div className="mga-h2__renewnote">{M.hist2.dismissedNote}</div>
                          <button className="mga-h2__textbtn" onClick={() => setOff(false)}>
                            {M.hist2.undo}
                          </button>
                        </>
                      )}
                    </div>
                  )
                })}

              {grp === 'studies' &&
                V2_HISTORY.studies.map((st) => (
                  <div key={st.title} className="mga-h2__rx">
                    <div className="mga-meta__val" style={{ fontSize: 12.5 }}>{st.title}</div>
                    <div className="mga-hitem__meta">
                      <span className="mga-meta__lbl">{st.meta}</span>
                      <SourceTag src={st.src} />
                    </div>
                    <div className="mga-h2__callout">
                      <Icon name="info" size={11} /> {st.prep}
                    </div>
                    <div className="mga-h2__callout mga-h2__callout--amber">
                      <Icon name="clock" size={11} /> {st.repeat}
                    </div>
                  </div>
                ))}

              {grp === 'referrals' &&
                V2_HISTORY.referrals.map((r) => (
                  <div key={r.number} className="mga-h2__rx">
                    <div className="mga-meta__val" style={{ fontSize: 12.5 }}>{r.title}</div>
                    <div className="mga-hitem__meta">
                      <span
                        className={'mga-badge ' + (r.status === 'booked' ? 'mga-badge--quiet' : 'mga-badge--amber')}
                      >
                        {M.hist2.refStatuses[r.status]}
                      </span>
                      <span className="mga-meta__lbl">
                        № {r.number} · {r.expiry}
                      </span>
                      <SourceTag src={r.src} />
                    </div>
                    {r.prep && (
                      <div className="mga-h2__callout">
                        <Icon name="info" size={11} /> {r.prep}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {sec === 'visits' && (
        <>
          <div className="mga-chiprow" role="group" aria-label={M.hist2.filterYear}>
            <FilterPill label={M.hist2.filterYear} value={year === 'range' ? M.hist2.yearRange : year} onOpen={() => setSheet('year')} />
          </div>
          <div className="mga-body" style={{ paddingTop: 0 }}>
            {/* #10 — the encounter KIND leads the row: three kinds (in-clinic, phone,
                online) are not guessable from a glyph, so icon AND label. #9 — origin
                sits in the same meta line as everywhere else. */}
            {visits.map((v) => (
              <div key={v.title + v.date} className="mga-card">
                <div className="mga-meta__val" style={{ fontSize: 12.5 }}>
                  {v.title} · {v.person}
                </div>
                <div className="mga-hitem__meta">
                  <span className="mga-mark">
                    <Icon name={VISIT_ICON[v.type] || 'stethoscope'} size={11} /> {M.hist2.visitTypes[v.type]}
                  </span>
                  <span className="mga-meta__lbl">
                    {v.date} · {v.by}
                  </span>
                  <SourceTag src={v.src} clinic={v.clinic} />
                </div>
                <div className="mga-h2__summary">{v.summary}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <button className="mga-obtn mga-obtn--sm" onClick={noop}>
                    <Icon name="download" size={11} /> {M.hist2.downloadPdf}
                  </button>
                  {/* #13 — was a jump to the დოკუმენტები drawer; that drawer is gone, so
                      the result is filed where results live, from right here. */}
                  <button className="mga-obtn mga-obtn--sm" onClick={() => setUploading(true)}>
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


      {/* #13 — one upload sheet for the whole screen: both ანალიზები და კვლევები and
          the medical card file into it, so it cannot live inside one section. */}
      {uploading && (
        <UploadSheet
          cat={cat}
          onClose={() => setUploading(false)}
          onDone={(rec) => {
            addUpload(rec)
            setUploads(getUploads())
            setUploading(false)
            /* Land the user on the record they just added, not on a filter that hides it. */
            if (sec === 'analyses' && cat !== 'all' && cat !== rec.cat) setCat(rec.cat)
          }}
        />
      )}
      {buySheet}
    </>
  )
}
