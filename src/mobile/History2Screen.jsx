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
   cannot bypass); the normal path unlocks at the hub and inherits here.
   2026-08-27 (user) — the per-section dashed „დოკუმენტის ატვირთვა" entry is GONE
   from all three sections: filing a NEW record per category was a decision the
   section page should not have been asking for. The per-record paperclip stays
   untouched (user: „do not touch cards"), so a document still attaches to the
   record it belongs to. Its slot now holds the INSURED-PERSON selector — the same
   PersonSelect the კურაციო dash uses, over a scope shared through data.js, so the
   member chosen here holds on the way back. One person at a time (no „ყველა"):
   medical history is personal and the dash already defaults to the policyholder.
   Switching person does NOT re-verify — the OTP gates the zone, not the member. */

import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import {
  V2_HISTORY,
  V2_ANALYSIS_CATS,
  V2_PERSONS,
  dateRank,
  getUploads,
  getDismissedMeds,
  setMedDismissed,
  getAttachments,
  addAttachment,
  getPersonScope,
  setPersonScope,
  personFirstName,
  recKey,
} from './data.js'
import SourceTag from './SourceTag.jsx'
import PersonSelect from './PersonSelect.jsx'
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
  /* clinic-origin filter (2026-08-26): records already carry `src` (curatio /
     external — uploads stamp external), so the filter is a straight cut. Analyses
     is where the mixed-origin problem actually lives (the same test can exist
     twice, once per clinic); the other sections stay unfiltered for now. */
  const [clinic, setClinic] = useState('all')
  const [year, setYear] = useState('2026')
  const [sheet, setSheet] = useState(null) /* 'period' | 'cat' | 'year' | null */
  const [unlocked, setUnlocked] = useState(isUnlocked())
  /* Whose records this page is showing. Seeded from the SHARED scope (the dash's
     choice), and every change writes back to it — see data.js. Never touches the
     OTP: switching member re-filters a list the user is already cleared to see. */
  const [personId, setPersonId] = useState(getPersonScope)
  const person = personFirstName(personId)
  const pickPerson = (id) => {
    setPersonScope(id)
    setPersonId(id)
  }
  /* #7 — results added in-session sat in front of the seeded ones. Read-only since
     2026-08-27: with the dashed entry gone there is no longer a way to FILE a new
     standalone record, so this only surfaces whatever an earlier session left in
     sessionStorage. Kept (not deleted) so restoring the entry is a one-line change
     rather than a rebuild — per-card attachments are a separate store and untouched. */
  const [uploads] = useState(getUploads)
  /* Per-record attachment (user, 2026-08-26: „document upload for each card"):
     holds {key, kind} of the record being attached to, or null. Distinct from
     `uploading` — that files a NEW record into a section, this hangs supporting
     documentation off an EXISTING one. */
  const [attachTo, setAttachTo] = useState(null)
  const [attachments, setAttachments] = useState(getAttachments)
  /* User, 2026-08-18: with everything stacked, a long medication list buried კვლევები
     and მიმართვები. The three groups are peers, so they get the main page's own
     segmented control instead of a scroll. */
  const [grp, setGrp] = useState('meds')
  const [dismissed, setDismissed] = useState(getDismissedMeds)
  /* #14 — records stay open without cover; the actions that spend insurance do not. */
  const { gated, guard, sheet: buySheet } = usePurchaseGate()

  const header = (
    <div className="mga-hdr">
      <button className="mga-iconbtn" aria-label={M.a11y.back} onClick={() => go('histhub')}>
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
            <div className="mga-meta__lbl" style={{ marginTop: 4 }}>{M.dash.protectedHint}</div>
          </div>
        </div>
        <OtpSheet onSuccess={() => setUnlocked(true)} onClose={() => go('curatio')} />
      </>
    )
  }

  /* PERSON is the outer cut everywhere (2026-08-27) — it scopes the page, the pills
     only narrow inside it. Each list keeps its person-scoped TOTAL alongside the
     filtered one so an empty screen can say WHICH of the two emptied it. */
  const analysesOwned = [...uploads.filter((u) => (u.kind || 'analyses') === 'analyses'), ...V2_HISTORY.analyses]
    .filter((r) => r.person === person)
  const analyses = analysesOwned
    .filter((r) => cat === 'all' || r.cat === cat)
    .filter((r) => clinic === 'all' || r.src === clinic)
    .sort((a, b) => dateRank(b.date) - dateRank(a.date)) /* newest first, whatever the source */
  const visitsOwned = V2_HISTORY.visits.filter((v) => v.person === person)
  const visits = visitsOwned.filter((v) => v.year === year)
  const meds = V2_HISTORY.meds.filter((m) => m.person === person)
  const studies = V2_HISTORY.studies.filter((st) => st.person === person)
  const referrals = V2_HISTORY.referrals.filter((r) => r.person === person)
  /* Rendered at the foot of every record card. The attached docs list FIRST (proof
     the upload landed — a file that vanishes reads as a failure), then the quiet
     link. Link, not a third button: the flagged analysis card already carries two
     and a third breaks 390 — same reason the meds card puts „აღარ მჭირდება" here. */
  /* Utility actions as ICON buttons, right-aligned (user, 2026-08-26 — „reduce the
     visual noise… align those buttons and have a similar placement for all cards").
     Icon-only, so each carries an aria-label naming the ACTION AND THE RECORD — the
     same treatment the old analyses download icon had, and the only thing that makes
     a column of identical glyphs usable on a screen reader. */
  const pdfBtn = (label, recName) => (
    <button className="mga-iconbtn" aria-label={`${label} — ${recName}`} onClick={noop}>
      <Icon name="download" size={15} />
    </button>
  )
  const attachIconBtn = (key, kind, recName) => (
    <button className="mga-iconbtn" aria-label={`${M.hist2.attach} — ${recName}`} onClick={() => setAttachTo({ key, kind })}>
      <Icon name="paperclip" size={15} />
    </button>
  )
  /* Origin chip + the utility icons on ONE line — the chip is short and the icons are
     small, so a card no longer spends two rows on them (user, 2026-08-26). */
  const originRow = (tag, ...util) => (
    <div className="mga-h2__originrow">
      {tag}
      <span className="mga-h2__util">{util}</span>
    </div>
  )

  /* The attached-documents list, rendered under the actions row. */
  const attachedDocs = (key) => {
    const docs = attachments[key] || []
    if (docs.length === 0) return null
    return (
      <div className="mga-attach">
        {docs.map((d, i) => (
          <span key={d.title + i} className="mga-attach__row">
            <Icon name="paperclip" size={11} />
            <span className="mga-attach__name">{d.title}</span>
            {d.clinic && <span className="mga-meta__lbl">{d.clinic}</span>}
          </span>
        ))}
      </div>
    )
  }

  const docUploads = {
    prescriptions: uploads.filter((u) => u.kind === 'prescriptions' && u.person === person),
    visits: uploads.filter((u) => u.kind === 'visits' && u.person === person),
  }
  /* An empty list is now a REACHABLE state (a member can own nothing in a section),
     so it gets said out loud instead of leaving a blank page under the pills. Reuses
     the module's one empty block — the same one the lock state above renders. */
  const emptyNote = (msg) => (
    <div className="mga-qpk__empty">
      <Icon name="file-text" size={20} />
      {/* .mga-meta__val, NOT __lbl: the message is the only content on the screen,
          and --mga-muted at 11px measures 3.19:1 — fine for a date sitting beside a
          record, a Rule 7 failure for the one line a user has to read. Same shape as
          the lock state directly above, which leads with __val for the same reason. */}
      <div className="mga-meta__val" style={{ marginTop: 8 }}>
        {msg}
      </div>
    </div>
  )
  /* One card shape for an uploaded document wherever it renders — record-card
     grammar, external srctag, its own artifact action. */
  const uploadedCluster = (kind) =>
    docUploads[kind].length > 0 && (
      <>
        <h2 className="mga-sect">{M.hist2.uploadedLbl}</h2>
        {docUploads[kind].map((u) => (
          <div key={u.title + u.date} className="mga-card mga-card--rec">
            <div className="mga-meta__val">
              {u.title} · {u.person}
            </div>
            <div className="mga-hitem__meta">
              <span className="mga-meta__lbl">{u.date}</span>
              {u.shared && (
                <span className="mga-mark">
                  <Icon name="check" size={10} /> {M.upl.shared}
                </span>
              )}
            </div>
            {/* no paperclip here: this card IS a document — attaching to it would nest
                documents inside documents. */}
            {originRow(<SourceTag src={u.src} clinic={u.clinic} />, pdfBtn(M.hist2.uplPdf, u.title))}
          </div>
        ))}
      </>
    )
  const periodOpts = Object.entries(M.history.periods).map(([id, label]) => ({ id, label }))
  const yearOpts = [...M.hist2.years.map((y) => ({ id: y, label: y })), { id: 'range', label: M.hist2.yearRange }]
  const catLabel = V2_ANALYSIS_CATS.find((c) => c.id === cat).label

  return (
    <>
      {header}
      {/* Above the pills, not among them: person is the SCOPE of the page, period /
          category / clinic only narrow what is already in it. Same component and
          same position (directly under the chrome) as the კურაციო dash — one
          person-switching gesture in the module, learned once. */}
      <PersonSelect persons={V2_PERSONS} selectedId={personId} onSelect={pickPerson} />

      {sec === 'analyses' && (
        <>
          {/* --fill (2026-08-27, user): the three pills share the row's full width
              instead of huddling at the left and side-scrolling once a long value is
              picked. Proportional, so „გარე კლინიკები" takes its space from its own
              slack rather than from „3 თვე" — see .mga-chiprow--fill in mga.css. */}
          <div className="mga-chiprow mga-chiprow--fill" role="group" aria-label={M.hist2.filterPeriod + ' · ' + M.hist2.filterCat}>
            <FilterPill value={M.history.periods[period]} onOpen={() => setSheet('period')} />
            <FilterPill label={M.hist2.filterCat} value={cat === 'all' ? null : catLabel} onOpen={() => setSheet('cat')} />
            <FilterPill label={M.hist2.filterClinic} value={clinic === 'all' ? null : M.hist2.clinics[clinic]} onOpen={() => setSheet('clinic')} />
          </div>
          <div className="mga-body" style={{ paddingTop: 0 }}>
            {/* #7's in-section upload entry REMOVED 2026-08-27 (user) — see the file
                header. The person selector took the slot; cards keep their paperclip. */}
            {analyses.length === 0 &&
              emptyNote(analysesOwned.length === 0 ? M.hist2.emptyPerson : M.hist2.emptyFilter)}
            {/* Record CARDS since 2026-08-26 (user) — the grammar visits had, applied
                here: labeled actions instead of the naked download icon (which was also
                an undersized target). Key needs the ORIGIN: the same test exists twice —
                once done at Curatio, once uploaded from another clinic on the same date. */}
            {analyses.map((r) => (
              <div key={r.title + r.date + (r.clinic || r.src)} className="mga-card mga-card--rec">
                {/* Standing rules (user, 2026-08-18) hold in card form: title owns its
                    line; status lives in the meta line, which wraps. */}
                <div className="mga-meta__val">
                  {r.title} · {r.person}
                </div>
                <div className="mga-hitem__meta">
                  {r.status && (
                    <span className={'mga-badge ' + BADGE[r.status]}>{M.history.statuses[r.status]}</span>
                  )}
                  <span className="mga-meta__lbl">{r.date}</span>
                  {r.shared && (
                    <span className="mga-mark">
                      <Icon name="check" size={10} /> {M.upl.shared}
                    </span>
                  )}
                </div>
                {originRow(
                  <SourceTag src={r.src} clinic={r.clinic} />,
                  pdfBtn(M.hist2.resultPdf, r.title),
                  attachIconBtn(recKey(r.title, r.date, r.clinic || r.src), 'analyses', r.title),
                )}
                {r.note && <div className="mga-hitem__note">{r.note}</div>}
                {/* the CTA keeps a row of its own — it is the one action with intent */}
                {r.book && (
                  <div className="mga-h2__actions">
                    <button className={'mga-btn mga-btn--secondary mga-btn--sm' + (gated ? ' mga-btn--locked' : '')} onClick={guard(noop)}>
                      {M.hist2.book}
                      <GateLock gated={gated} />
                    </button>
                  </div>
                )}
                {attachedDocs(recKey(r.title, r.date, r.clinic || r.src))}
              </div>
            ))}
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
          {sheet === 'clinic' && (
            <FilterSheet
              title={M.hist2.filterClinic}
              options={Object.entries(M.hist2.clinics).map(([id, label]) => ({ id, label }))}
              value={clinic}
              onPick={setClinic}
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
            {/* upload entry REMOVED 2026-08-27 (user) — see the file header */}
            {/* the group tabs are not a filter over one list but three peer lists, so
                the empty message is always the person one */}
            {((grp === 'meds' && meds.length === 0) ||
              (grp === 'studies' && studies.length === 0) ||
              (grp === 'referrals' && referrals.length === 0)) &&
              docUploads.prescriptions.length === 0 &&
              emptyNote(M.hist2.emptyPerson)}
            {/* record CARDS since 2026-08-26 (user) — one per entry, labeled actions;
                the shared list card went with the rows. */}
            {grp === 'meds' &&
                meds.map((m) => {
                  const off = dismissed.includes(m.name)
                  const renewable = m.state === 'expiring' || m.state === 'chronic'
                  const setOff = (on) => {
                    setMedDismissed(m.name, on)
                    setDismissed(getDismissedMeds())
                  }
                  return (
                    <div
                      key={m.name}
                      className={'mga-card mga-card--rec' + (m.state === 'expiring' && !off ? ' mga-card--warn' : '')}
                    >
                      <div className="mga-meta__val">{m.name}</div>
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
                      </div>
                      {originRow(
                        <SourceTag src={m.src} clinic={m.clinic} />,
                        pdfBtn(M.hist2.rxPdf, m.name),
                        attachIconBtn(recKey(m.name, m.how), 'prescriptions', m.name),
                      )}
                      {m.expiry && !off && <div className="mga-h2__exp">{m.expiry}</div>}
                      {attachedDocs(recKey(m.name, m.how))}
                      {/* User, 2026-08-18: „what if patient do not need the medicament
                          anymore?" — renewal was the row's only answer. The way out sits
                          next to it, and it silences the prompt rather than claiming
                          anything clinical. Reversible. */}
                      {renewable && !off && (
                        <>
                          <div className="mga-h2__renewnote">{M.hist2.renewNote}</div>
                          <button className={'mga-btn mga-btn--secondary mga-btn--md mga-btn--block' + (gated ? ' mga-btn--locked' : '')} onClick={guard(noop)}>
                            {M.hist2.renew}
                            {gated ? <GateLock gated /> : <Icon name="chevron-right" size={12} />}
                          </button>
                          <button className="mga-link mga-link--quiet mga-link--block" onClick={() => setOff(true)}>
                            {M.hist2.dismiss}
                          </button>
                        </>
                      )}
                      {off && (
                        <>
                          <div className="mga-h2__renewnote">{M.hist2.dismissedNote}</div>
                          <button className="mga-link mga-link--quiet mga-link--block" onClick={() => setOff(false)}>
                            {M.hist2.undo}
                          </button>
                        </>
                      )}
                    </div>
                  )
                })}

            {grp === 'studies' &&
              studies.map((st) => (
                <div key={st.title} className="mga-card mga-card--rec">
                  <div className="mga-meta__val">{st.title}</div>
                  <div className="mga-hitem__meta">
                    <span className="mga-meta__lbl">{st.meta}</span>
                  </div>
                  {originRow(
                    <SourceTag src={st.src} />,
                    pdfBtn(M.hist2.rxPdf, st.title),
                    attachIconBtn(recKey(st.title, st.meta), 'prescriptions', st.title),
                  )}
                  <div className="mga-note mga-note--teal">
                    <Icon name="info" size={11} /> {st.prep}
                  </div>
                  <div className="mga-note mga-note--amber">
                    <Icon name="clock" size={11} /> {st.repeat}
                  </div>
                  {attachedDocs(recKey(st.title, st.meta))}
                </div>
              ))}

            {grp === 'referrals' &&
              referrals.map((r) => (
                <div key={r.number} className="mga-card mga-card--rec">
                  <div className="mga-meta__val">{r.title}</div>
                  <div className="mga-hitem__meta">
                    <span
                      className={'mga-badge ' + (r.status === 'booked' ? 'mga-badge--quiet' : 'mga-badge--amber')}
                    >
                      {M.hist2.refStatuses[r.status]}
                    </span>
                    <span className="mga-meta__lbl">
                      № {r.number} · {r.expiry}
                    </span>
                  </div>
                  {originRow(
                    <SourceTag src={r.src} />,
                    pdfBtn(M.hist2.rxPdf, r.title),
                    attachIconBtn(recKey(r.title, r.number), 'prescriptions', r.title),
                  )}
                  {r.prep && (
                    <div className="mga-note mga-note--teal">
                      <Icon name="info" size={11} /> {r.prep}
                    </div>
                  )}
                  {attachedDocs(recKey(r.title, r.number))}
                </div>
              ))}
            {/* section-level, deliberately OUTSIDE the group tabs: the metadata does
                not classify a paper document into მედ/კვლევა/მიმართვა, so claiming a
                group would be invented data. Visible whichever group is active. */}
            {uploadedCluster('prescriptions')}
          </div>
        </>
      )}

      {sec === 'visits' && (
        <>
          <div className="mga-chiprow" role="group" aria-label={M.hist2.filterYear}>
            <FilterPill label={M.hist2.filterYear} value={year === 'range' ? M.hist2.yearRange : year} onOpen={() => setSheet('year')} />
          </div>
          <div className="mga-body" style={{ paddingTop: 0 }}>
            {/* upload entry REMOVED 2026-08-27 (user) — see the file header */}
            {visits.length === 0 &&
              docUploads.visits.length === 0 &&
              emptyNote(visitsOwned.length === 0 ? M.hist2.emptyPerson : M.hist2.emptyFilter)}
            {/* #10 — the encounter KIND leads the row: three kinds (in-clinic, phone,
                online) are not guessable from a glyph, so icon AND label. #9 — origin
                sits in the same meta line as everywhere else. */}
            {visits.map((v) => (
              <div key={v.title + v.date} className="mga-card mga-card--rec">
                <div className="mga-meta__val">
                  {v.title} · {v.person}
                </div>
                <div className="mga-hitem__meta">
                  <span className="mga-mark">
                    <Icon name={VISIT_ICON[v.type] || 'stethoscope'} size={11} /> {M.hist2.visitTypes[v.type]}
                  </span>
                  <span className="mga-meta__lbl">
                    {v.date} · {v.by}
                  </span>
                </div>
                {/* „შედეგის ატვირთვა" (#13's file-a-result-into-analyses button) REMOVED
                    2026-08-26 — user: „attach and upload mean the same to me." They did:
                    two affordances on one card whose only difference was an invisible
                    destination. The paperclip now covers it, and a result added from a
                    visit hangs on the visit that produced it, which is the truer filing.
                    The section's own dashed entry still files new records into analyses. */}
                {originRow(
                  <SourceTag src={v.src} clinic={v.clinic} />,
                  pdfBtn(M.hist2.downloadPdf, v.title),
                  attachIconBtn(recKey(v.title, v.date), 'visits', v.title),
                )}
                <div className="mga-h2__summary">{v.summary}</div>
                {attachedDocs(recKey(v.title, v.date))}
              </div>
            ))}
            {/* year filter deliberately does NOT cut this cluster: an uploaded doc's
                free-typed date is not a parsed year, and hiding it behind a filter
                the user never touched would look like a failed upload. */}
            {uploadedCluster('visits')}
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


      {/* The ONE remaining sheet: attaching a document to an existing record (the
          card paperclip). #13's file-a-new-record instance went with the dashed
          entries on 2026-08-27 — the sheet component itself is unchanged. */}
      {attachTo && (
        <UploadSheet
          kind={attachTo.kind}
          attach
          onClose={() => setAttachTo(null)}
          onDone={(rec) => {
            addAttachment(attachTo.key, rec)
            setAttachments(getAttachments())
            setAttachTo(null)
          }}
        />
      )}
      {buySheet}
    </>
  )
}
