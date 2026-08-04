/* A5 — medical-history transfer (F-03: Curatio doctor list with photos +
   Confirmation Overlay). V2 only, reached from the doctor screen's gated CTA.
   History-class data → OTP gates IN PLACE (same pattern as HistoryScreen), so
   a deep link cannot bypass the code; declining returns to the doctor screen.
   Fix vs the stakeholder file: the current personal doctor is NOT listed as a
   target. Addition vs their file: an explicit success state after confirm —
   theirs closes silently, leaving no evidence the transfer happened. */

import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { TRANSFER_DOCTORS } from './data.js'
import { go } from './nav.js'
import { OtpSheet, isUnlocked } from './otp.jsx'

export default function TransferScreen() {
  const [unlocked, setUnlocked] = useState(isUnlocked())
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)

  const header = (
    <div className="mga-hdr">
      <button className="mga-back" aria-label="უკან" onClick={() => go('doctor')}>
        <Icon name="chevron-left" size={16} />
      </button>
      <div>
        <h1 className="mga-hdr__title">{M.transfer.title}</h1>
        <div className="mga-hdr__sub">{M.transfer.sub}</div>
      </div>
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
        <OtpSheet onSuccess={() => setUnlocked(true)} onClose={() => go('doctor')} />
      </>
    )
  }

  return (
    <>
      {header}
      <div className="mga-body">
        <div className="mga-card" style={{ padding: '4px 12px' }}>
          {TRANSFER_DOCTORS.map((d) => (
            <button key={d.id} className="mga-trf__row" onClick={() => setPicked(d)}>
              <span className="mga-trf__ava" aria-hidden="true">{d.initial}</span>
              <span className="mga-trf__meta">
                <span className="mga-trf__name">{d.name}</span>
                <span className="mga-meta__lbl">
                  {d.spec} · {d.clinic}
                </span>
              </span>
              <span className={'mga-badge ' + (d.avail === 'online' ? 'mga-badge--green' : 'mga-badge--lav')}>
                {d.avail === 'online' ? M.transfer.online : M.transfer.tomorrow}
              </span>
            </button>
          ))}
        </div>
      </div>

      {picked && (
        <div className="mga-sheetwrap" role="dialog" aria-modal="true" aria-label={M.transfer.title}>
          <button
            className="mga-sheetwrap__scrim"
            aria-label={M.transfer.close}
            onClick={() => {
              setPicked(null)
              setDone(false)
            }}
          />
          <div className="mga-sheet">
            <div className="mga-sheet__grab" aria-hidden="true" />
            {!done ? (
              <>
                <div className="mga-sheet__head">
                  <span className="mga-itile" style={{ background: 'var(--mga-lav)', color: 'var(--mga-lav-fg)' }}>
                    <Icon name="arrow-right-left" size={17} />
                  </span>
                  <h2 className="mga-sheet__title">{M.transfer.title}</h2>
                </div>
                <div className="mga-trf__target">
                  <div className="mga-trf__name">
                    {picked.name} · {picked.spec}
                  </div>
                  <div className="mga-meta__lbl">{picked.clinic}</div>
                </div>
                <div className="mga-trf__includes">{M.transfer.includes}</div>
                <div className="mga-trf__btns">
                  <button className="mga-obtn" style={{ flex: 1 }} onClick={() => setPicked(null)}>
                    {M.transfer.cancel}
                  </button>
                  <button className="mga-cta" style={{ flex: 2, margin: 0, padding: 12 }} onClick={() => setDone(true)}>
                    {M.transfer.confirm}
                  </button>
                </div>
              </>
            ) : (
              <div className="mga-trf__success">
                <span className="mga-trf__successico" aria-hidden="true">
                  <Icon name="check" size={22} />
                </span>
                <div className="mga-sheet__title" style={{ marginTop: 10 }}>{M.transfer.successTitle}</div>
                <div className="mga-meta__lbl" style={{ marginTop: 4 }}>
                  {M.transfer.successBody} <b>{picked.name}</b>
                </div>
                <button
                  className="mga-cta"
                  style={{ margin: '14px 0 0', padding: 12 }}
                  onClick={() => go('doctor')}
                >
                  {M.transfer.close}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
