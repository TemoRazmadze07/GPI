/* OTP gate for the Curatio protected zone (medical history + transfer/doctor
   detail). Applies to BOTH nav versions — the passcode is a real data-access
   constraint, so V1 and V2 differ only in navigation structure, never in what
   is protected. One code unlocks EVERYTHING for the session (sessionStorage) —
   locks reappear only after the app/tab is closed, or via the explicit ჩაკეტვა
   action. Demo behaviour: any 4 digits are accepted; the countdown is cosmetic. */

import { useEffect, useRef, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'

const KEY = 'mgaOtpUnlocked'

export function isUnlocked() {
  return sessionStorage.getItem(KEY) === '1'
}

export function setUnlocked(on) {
  if (on) sessionStorage.setItem(KEY, '1')
  else sessionStorage.removeItem(KEY)
}

/* Shared gate state for a screen: `unlocked` + a request()/relock() pair and the
   sheet element to render. Keeps V1's hub and V2's dashboard behaving identically. */
export function useOtpGate() {
  const [unlocked, setLocal] = useState(isUnlocked())
  const [sheet, setSheet] = useState(false)

  const relock = () => {
    setUnlocked(false)
    setLocal(false)
  }

  const gate = sheet ? (
    <OtpSheet
      onSuccess={() => {
        setLocal(true)
        setSheet(false)
      }}
      onClose={() => setSheet(false)}
    />
  ) : null

  return { unlocked, request: () => setSheet(true), relock, gate }
}

export function OtpSheet({ onSuccess, onClose }) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [left, setLeft] = useState(47)
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    refs[0].current?.focus()
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  const full = digits.every((d) => d !== '')

  const setDigit = (i, val) => {
    const typed = val.replace(/\D/g, '')
    /* One box, many digits — paste or the SMS `one-time-code` autofill. Spill the
       extras into the boxes to the right rather than keeping just the last one. */
    const incoming = typed.length > 1 ? typed.slice(-4).split('') : [typed]
    setDigits((prev) => {
      const next = [...prev]
      incoming.forEach((d, n) => {
        if (i + n < 4) next[i + n] = d
      })
      return next
    })
    const last = Math.min(i + incoming.length - 1, 3)
    if (incoming[0] && last < 3) refs[last + 1].current?.focus()
    else if (incoming[0]) refs[3].current?.focus()
  }

  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus()
  }

  const confirm = () => {
    if (!full) return
    setUnlocked(true)
    onSuccess()
  }

  return (
    <div className="mga-sheetwrap" role="dialog" aria-modal="true" aria-label={M.otp.title}>
      <button className="mga-sheetwrap__scrim" aria-label={M.otp.close} onClick={onClose} />
      <div className="mga-sheet">
        <div className="mga-sheet__grab" aria-hidden="true" />
        <div className="mga-sheet__head">
          <span className="mga-itile" style={{ background: 'var(--mga-lav)', color: 'var(--mga-lav-fg)' }}>
            <Icon name="lock" size={17} />
          </span>
          <h2 className="mga-sheet__title">{M.otp.title}</h2>
        </div>
        <p className="mga-sheet__body">{M.otp.body}</p>
        <div className="mga-otp">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              value={d}
              inputMode="numeric"
              maxLength={4}
              autoComplete="one-time-code"
              aria-label={`ციფრი ${i + 1}`}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
            />
          ))}
        </div>
        <button
          className={'mga-btn mga-btn--primary mga-btn--lg mga-btn--block' + (full ? '' : ' mga-btn--off')}
          disabled={!full}
          onClick={confirm}
        >
          {M.otp.confirm}
        </button>
        <button className={'mga-link mga-link--block' + (left > 0 ? ' mga-link--quiet' : '')} style={{ marginTop: 12 }} disabled={left > 0} onClick={() => setLeft(47)}>
          {left > 0 ? M.otp.resendIn(left) : M.otp.resend}
        </button>
        <div className="mga-sheet__demo">{M.otp.demoNote}</div>
      </div>
    </div>
  )
}
