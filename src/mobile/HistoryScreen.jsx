/* Medical history (F-02/F-03) — tabs, period filter, status badges, per-row PDF
   download, person label per row (consequence of the ყველა scope), "ატვირთული"
   badge marking externally uploaded docs, and the 2-step upload entry.
   NO charts — MVP1 is PDF-only per the spec (charts are MVP2). */

import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { HISTORY } from './data.js'
import { go } from './nav.js'
import { OtpSheet, isUnlocked } from './otp.jsx'

const BADGE = {
  norm: 'mga-badge--green',
  warn: 'mga-badge--amber',
  crit: 'mga-badge--red',
  uploaded: 'mga-badge--lav',
}

export default function HistoryScreen() {
  const [tab, setTab] = useState('analyses')
  const [period, setPeriod] = useState('m3')
  /* History is OTP-protected in BOTH nav versions — a deep link (tile, push, SMS)
     must not bypass the lock. The gate opens in place; declining goes back. */
  const [unlocked, setUnlocked] = useState(isUnlocked())
  const rows = HISTORY[tab] || []

  if (!unlocked) {
    return (
      <>
        <div className="mga-hdr">
          <button className="mga-iconbtn" aria-label="უკან" onClick={() => go('curatio')}>
            <Icon name="chevron-left" size={16} />
          </button>
          <h1 className="mga-hdr__title">{M.history.title}</h1>
        </div>
        <div className="mga-body">
          <div className="mga-card mga-lockcard" style={{ textAlign: 'center', padding: 24 }}>
            <span className="mga-itile" style={{ background: 'var(--mga-lav)', color: 'var(--mga-lav-fg)', margin: '0 auto 8px' }}>
              <Icon name="lock" size={17} />
            </span>
            <div className="mga-meta__val">{M.dash.protectedTitle}</div>
            <div className="mga-meta__lbl" style={{ marginTop: 4 }}>{M.dash.protectedHint}</div>
          </div>
        </div>
        <OtpSheet onSuccess={() => setUnlocked(true)} onClose={() => go('curatio')} />
      </>
    )
  }

  return (
    <>
      <div className="mga-hdr">
        <button className="mga-iconbtn" aria-label="უკან" onClick={() => go('curatio')}>
          <Icon name="chevron-left" size={16} />
        </button>
        <h1 className="mga-hdr__title">{M.history.title}</h1>
      </div>

      <div className="mga-chiprow" role="tablist" aria-label={M.history.title} style={{ gap: 4 }}>
        {Object.entries(M.history.tabs).map(([key, label]) => (
          <button
            key={key}
            className={'mga-chip mga-chip--flex' + (tab === key ? ' mga-chip--on' : '')}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mga-chiprow" role="group" aria-label="პერიოდი">
        {Object.entries(M.history.periods).map(([key, label]) => (
          <button
            key={key}
            className={'mga-chip' + (period === key ? ' mga-chip--on' : '')}
            aria-pressed={period === key}
            onClick={() => setPeriod(key)}
          >
            {key === 'range' && <Icon name="calendar" size={11} style={{ marginRight: 3 }} />}
            {label}
          </button>
        ))}
      </div>

      <div className="mga-body" style={{ paddingTop: 0 }}>
        <div className="mga-card" style={{ padding: '4px 12px' }}>
          {rows.map((r) => (
            <div key={r.title + r.date} className="mga-hitem">
              <div className="mga-hitem__body">
                <div className="mga-meta__val" style={{ fontSize: 12.5 }}>{r.title}</div>
                <div className="mga-meta__lbl">
                  {r.date} · {r.src} · {r.person}
                </div>
                {r.note && <div className="mga-hitem__note">{r.note}</div>}
              </div>
              <span className={'mga-badge ' + BADGE[r.status]}>{M.history.statuses[r.status]}</span>
              <button className="mga-iconbtn mga-iconbtn--sm mga-iconbtn--plain" aria-label={M.history.download + ' — ' + r.title}>
                <Icon name="download" size={15} />
              </button>
            </div>
          ))}
        </div>

        <button className="mga-btn mga-btn--dashed mga-btn--md mga-btn--block">
          <Icon name="upload" size={14} />
          {M.history.upload}
        </button>
      </div>
    </>
  )
}
