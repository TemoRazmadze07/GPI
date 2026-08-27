/* A6c — V2 history HUB: the menu page between the Curatio dash and the four
   section pages (analyses / prescriptions / visits / docs). User decision
   2026-08-04: sections are separate destinations reached from tappable rows
   with chevrons — replaces landing straight on a tabbed screen (deliberate
   deviation from the stakeholder file's single sc-med-history-full screen).
   The OTP gate moved HERE (hub entry) — unlock once, all sections inherit;
   section pages keep their own gate only against direct deep links.
   Row status: the „ვადა" badge (expiring meds) lives on the prescriptions
   row — same signal the dash row shows, one level deeper.
   #13 (2026-08-18): the fourth row, დოკუმენტები, is GONE. Uploads now land in the
   section they belong to (#7), so a drawer of loose files had nothing left to hold —
   its two records moved into ანალიზები და კვლევები as external ones. */

import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { V2_HISTORY, V2_PERSONS, getUploads, getPersonScope, setPersonScope, personFirstName } from './data.js'
import { go, fromParam } from './nav.js'
import { OtpSheet, isUnlocked } from './otp.jsx'
import PersonSelect from './PersonSelect.jsx'

/* #2 (2026-08-18): the hub is now reachable from TWO tabs — the კურაციო dash
   and the Health dashboard's pointer row — so back returns to whichever sent
   us here, instead of always dumping the user on the კურაციო tab. */
const backTarget = () => fromParam() || 'curatio'

/* One tile style module-wide (user, 2026-08-18) — the glyph distinguishes the
   section; four different tints only made the menu busy. */
const ICONS = {
  analyses: 'activity',
  prescriptions: 'pill',
  visits: 'stethoscope',
}

export default function HistoryHubScreen() {
  const [unlocked, setUnlocked] = useState(isUnlocked())
  /* 2026-08-27 — the section pages are person-scoped now, so the hub had to follow:
     a menu promising „6 ჩანაწერი" over a list that shows 4 is exactly the
     contradiction #7 warned about, one tap away. The selector renders HERE too so
     the count has a visible cause — and so the member can be chosen before drilling
     in. Same shared scope, so it survives in both directions. */
  const [personId, setPersonId] = useState(getPersonScope)
  const person = personFirstName(personId)
  const pickPerson = (id) => {
    setPersonScope(id)
    setPersonId(id)
  }

  const owned = (rows) => rows.filter((r) => r.person === person)
  const expiring = owned(V2_HISTORY.meds).filter((m) => m.state === 'expiring').length
  /* #7 — a result uploaded in-section is a record like any other, so the row count
     here has to include it; otherwise the hub contradicts the list one tap away. */
  const analyses = owned([...getUploads('analyses'), ...V2_HISTORY.analyses])
  const visits = owned([...V2_HISTORY.visits, ...getUploads('visits')])
  const metas = {
    /* „ბოლო <date>" needs a record to have one — a member with none gets the plain
       count, not a crash on analyses[0] */
    analyses: analyses.length
      ? M.histhub.metaAnalyses(analyses.length, analyses[0].date)
      : M.histhub.metaEmpty,
    /* the row carries no count, but it must not list three group names for a member
       who has nothing in any of them — that reads as content waiting behind the tap */
    prescriptions:
      owned(V2_HISTORY.meds).length + owned(V2_HISTORY.studies).length + owned(V2_HISTORY.referrals).length > 0
        ? M.histhub.metaPrescriptions
        : M.histhub.metaEmpty,
    /* uploaded visit records count as records — same #7 rule as analyses */
    visits: visits.length ? M.histhub.metaVisits(visits.length) : M.histhub.metaEmpty,
  }

  const header = (
    <div className="mga-hdr">
      <button className="mga-iconbtn" aria-label="უკან" onClick={() => go(backTarget())}>
        <Icon name="chevron-left" size={16} />
      </button>
      <h1 className="mga-hdr__title">{M.histhub.title}</h1>
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
        <OtpSheet onSuccess={() => setUnlocked(true)} onClose={() => go(backTarget())} />
      </>
    )
  }

  return (
    <>
      {header}
      <PersonSelect persons={V2_PERSONS} selectedId={personId} onSelect={pickPerson} />
      {/* --hub hooks the bottom mosaic (this page only — see mga.css); the confid
          note gives the near-empty menu its footnote: this is the protected zone,
          and saying so is content, not decoration. */}
      <div className="mga-body mga-body--hub">
        {Object.entries(M.histhub.rows).map(([id, label]) => (
          <button key={id} className="mga-card mga-prow" onClick={() => go('history', { sec: id })}>
            <span className="mga-itile">
              <Icon name={ICONS[id]} size={17} />
            </span>
            <span className="mga-meta" style={{ flex: 1 }}>
              <span className="mga-meta__val">{label}</span>
              <span className="mga-meta__lbl">{metas[id]}</span>
            </span>
            {id === 'prescriptions' && expiring > 0 && (
              <span className="mga-badge mga-badge--red">{M.histhub.expiry(expiring)}</span>
            )}
            <span className="mga-prow__chv">
              <Icon name="chevron-right" size={16} />
            </span>
          </button>
        ))}
        <div className="mga-confid">
          <Icon name="shield-check" size={13} />
          <span>{M.histhub.confid}</span>
        </div>
      </div>
    </>
  )
}
