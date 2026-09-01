import { useEffect, useRef, useState } from 'react'
import OtpInput from '../components/OtpInput.jsx'
import { Button } from '../components/Button.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import { P } from './strings.js'
import { CUSTOMER } from './data.js'

/* OtpScreen — the redesigned /Account/LoginTwoStep. Three fixes over the live
   screen, all of them things users hit in practice:

   · SEGMENTED INPUT, not one text field — the shared OtpInput brings paste,
     arrow/backspace navigation and `one-time-code` autofill (iOS/Android offer
     the SMS code above the keyboard). It also shows the code LENGTH, which a
     bare field hides.
   · The COUNTDOWN LEAVES THE FIELD. The live portal parks a timer inside the
     input where an affix belongs; it reads as part of the value. It sits under
     the input as meta, in tabular numerals so the digits don't jitter.
   · THERE IS A WAY OUT. The live screen has no resend at all, so an expired or
     undelivered code is a dead end — the single most common failure of an SMS
     step. On expiry the input locks and resend becomes the action.

   The ticking number is deliberately NOT in a live region (a screen reader
   would announce every second); expiry and resend ARE announced.
   Code length 4 matches the GPI mobile prototype's gate — verify against the
   real SMS before handoff. */
const CODE_LEN = 4
const WINDOW_SEC = 120

export default function OtpScreen() {
  const [code, setCode] = useState('')
  const [left, setLeft] = useState(WINDOW_SEC)
  const [error, setError] = useState('')
  const [resent, setResent] = useState(false)
  const tick = useRef(null)

  useEffect(() => {
    tick.current = setInterval(() => setLeft((s) => (s <= 1 ? 0 : s - 1)), 1000)
    return () => clearInterval(tick.current)
  }, [])

  const expired = left === 0
  const mmss = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`

  const resend = () => {
    setLeft(WINDOW_SEC)
    setCode('')
    setError('')
    setResent(true)
  }

  const submit = (e) => {
    e.preventDefault()
    if (expired || code.length < CODE_LEN) return
    /* Demo: 0000 is the wrong-code path so the error state is reachable. */
    if (code === '0000') {
      setError(P.otp.wrong)
      setCode('')
      return
    }
    window.location.hash = '#/pay/policies'
  }

  return (
    <form className="pay-card pay-stack" onSubmit={submit} noValidate>
      <div className="pay-stack__head">
        <h1 className="pay-h1">{P.otp.title}</h1>
        <p className="pay-lead">
          {P.otp.sent} <strong className="pay-phone">{CUSTOMER.phoneMasked}</strong>
        </p>
      </div>

      <div className="pay-otp">
        <span className="gpi-field__lbl">{P.otp.label}</span>
        <OtpInput
          length={CODE_LEN}
          value={code}
          onChange={(v) => {
            setCode(v)
            if (error) setError('')
          }}
          disabled={expired}
          error={!!error}
          autoFocus
          ariaLabel={P.otp.label}
        />
        <div className="pay-otp__meta">
          {expired ? (
            <span className="pay-otp__expired" role="status">
              {P.otp.expired}
            </span>
          ) : (
            <span className="pay-otp__timer">
              {P.otp.expiresIn} <span className="pay-num">{mmss}</span>
            </span>
          )}
          <Button variant="tertiary" size="sm" type="button" onClick={resend} disabled={!expired}>
            {P.otp.resend}
          </Button>
        </div>
        {error && <InlineAlert tone="error">{error}</InlineAlert>}
        {resent && !error && <InlineAlert tone="success">{P.otp.resent}</InlineAlert>}
      </div>

      <Button size="lg" className="pay-block" type="submit" disabled={expired || code.length < CODE_LEN}>
        {P.otp.cta}
      </Button>
      <p className="pay-help">{P.otp.demoHint}</p>
    </form>
  )
}
