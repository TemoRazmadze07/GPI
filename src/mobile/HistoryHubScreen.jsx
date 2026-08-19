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
import { V2_HISTORY, getUploads } from './data.js'
import { go, fromParam } from './nav.js'
import { OtpSheet, isUnlocked } from './otp.jsx'

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

  const expiring = V2_HISTORY.meds.filter((m) => m.state === 'expiring').length
  /* #7 — a result uploaded in-section is a record like any other, so the row count
     here has to include it; otherwise the hub contradicts the list one tap away. */
  const analyses = [...getUploads(), ...V2_HISTORY.analyses]
  const metas = {
    analyses: M.histhub.metaAnalyses(analyses.length, analyses[0].date),
    prescriptions: M.histhub.metaPrescriptions,
    visits: M.histhub.metaVisits(V2_HISTORY.visits.length),
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
            <div className="mga-meta__lbl" style={{ marginTop: 2 }}>{M.dash.protectedHint}</div>
          </div>
        </div>
        <OtpSheet onSuccess={() => setUnlocked(true)} onClose={() => go(backTarget())} />
      </>
    )
  }

  return (
    <>
      {header}
      <div className="mga-body">
        {Object.entries(M.histhub.rows).map(([id, label]) => (
          <button key={id} className="mga-card mga-prow" onClick={() => go('history', { sec: id })}>
            <span className="mga-itile">
              <Icon name={ICONS[id]} size={17} />
            </span>
            <span style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
              <span className="mga-meta__val" style={{ display: 'block' }}>{label}</span>
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
      </div>
    </>
  )
}
