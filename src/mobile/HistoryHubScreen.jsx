/* A6c — V2 history HUB: the menu page between the Curatio dash and the four
   section pages (analyses / prescriptions / visits / docs). User decision
   2026-08-04: sections are separate destinations reached from tappable rows
   with chevrons — replaces landing straight on a tabbed screen (deliberate
   deviation from the stakeholder file's single sc-med-history-full screen).
   The OTP gate moved HERE (hub entry) — unlock once, all sections inherit;
   section pages keep their own gate only against direct deep links.
   Row status: the „ვადა" badge (expiring meds) lives on the prescriptions
   row — same signal the dash row shows, one level deeper. */

import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { V2_HISTORY } from './data.js'
import { go } from './nav.js'
import { OtpSheet, isUnlocked } from './otp.jsx'

const TILES = {
  analyses: { icon: 'activity', bg: 'var(--mga-lav)', fg: 'var(--mga-lav-fg)' },
  prescriptions: { icon: 'pill', bg: 'var(--mga-pink-soft)', fg: 'var(--mga-pink-fg)' },
  visits: { icon: 'stethoscope', bg: 'var(--mga-teal)', fg: 'var(--mga-teal-fg)' },
  docs: { icon: 'folder', bg: 'var(--mga-amber-bg)', fg: 'var(--mga-amber-fg)' },
}

export default function HistoryHubScreen() {
  const [unlocked, setUnlocked] = useState(isUnlocked())

  const expiring = V2_HISTORY.meds.filter((m) => m.state === 'expiring').length
  const metas = {
    analyses: M.histhub.metaAnalyses(V2_HISTORY.analyses.length, V2_HISTORY.analyses[0].date),
    prescriptions: M.histhub.metaPrescriptions,
    visits: M.histhub.metaVisits(V2_HISTORY.visits.length),
    docs: M.histhub.metaDocs(V2_HISTORY.docs.length),
  }

  const header = (
    <div className="mga-hdr">
      <button className="mga-back" aria-label="უკან" onClick={() => go('curatio')}>
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
        <OtpSheet onSuccess={() => setUnlocked(true)} onClose={() => go('curatio')} />
      </>
    )
  }

  return (
    <>
      {header}
      <div className="mga-body">
        {Object.entries(M.histhub.rows).map(([id, label]) => (
          <button key={id} className="mga-card mga-prow" onClick={() => go('history', { sec: id })}>
            <span className="mga-itile" style={{ background: TILES[id].bg, color: TILES[id].fg }}>
              <Icon name={TILES[id].icon} size={17} />
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
