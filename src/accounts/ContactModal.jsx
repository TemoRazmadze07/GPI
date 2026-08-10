import { useEffect, useRef, useState } from 'react'
import Modal from '../components/Modal.jsx'
import { Button } from '../components/Button.jsx'
import Icon from '../lib/Icon.jsx'
import OtpInput from '../components/OtpInput.jsx'
import { kaAcc as ka } from './strings.js'

const CODE_LENGTH = 6
/* Seconds before a new code may be requested. Starts counting the moment the
   code step opens (a code was just sent), so the link can't be hammered.
   120 = the shipped registration screen's window (it shows 1:59 on entry). */
const RESEND_SECONDS = 120

const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

/* ContactModal — edit or verify a contact channel (phone / email) with an OTP
   step (user direction 2026-08-10: changing OR verifying email/phone must be
   confirmed with a code sent to the NEW value).

   modes:
   · edit   → step 1: enter the new value (validated) → step 2: 4-digit code
              "sent" to that new value → confirm applies it as VERIFIED.
   · verify → straight to the code step for the CURRENT value.

   The code step uses the shared segmented OtpInput (6 boxes) and AUTO-SUBMITS
   the moment the last digit lands — no confirm button to hunt for. The status
   line below it runs idle → spinner „მოწმდება…" → green check „დადასტურდა",
   then applies the value and closes. It is an aria-live region, so a screen
   reader is told what the auto-submit is doing.

   Prototype note: no code is actually sent — any 6 digits pass EXCEPT 000000,
   which is wired to fail so the error path stays demoable. Real rules (expiry,
   resend timer, attempt limit, changed-number recovery) belong to the same TBC
   pile as the linking mechanics. */
const strip = (v) => v.replace(/\D/g, '')
const formatPhone = (digits) => `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`

export default function ContactModal({ type, mode, current, onCancel, onConfirm }) {
  const isPhone = type === 'phone'
  const [step, setStep] = useState(mode === 'edit' ? 'value' : 'code')
  const [value, setValue] = useState('')
  const [code, setCode] = useState('')
  const [err, setErr] = useState(null)
  const [status, setStatus] = useState('idle') // idle | verifying | success
  const [cooldown, setCooldown] = useState(RESEND_SECONDS)
  const [resent, setResent] = useState(false)
  const [otpKey, setOtpKey] = useState(0) // bumping it remounts OtpInput → refocuses box 1
  const timers = useRef([])

  // Auto-submit runs on timers; never let one fire into an unmounted modal.
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Restart the window whenever the code step opens (edit → code counts too).
  useEffect(() => {
    if (step === 'code') setCooldown(RESEND_SECONDS)
  }, [step])

  // One-second tick, self-cancelling — no interval left running on unmount.
  useEffect(() => {
    if (step !== 'code' || cooldown <= 0) return undefined
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [step, cooldown])

  const resend = () => {
    if (cooldown > 0) return
    setCode('')
    setErr(null)
    setResent(true)
    setCooldown(RESEND_SECONDS)
    setOtpKey((k) => k + 1)
  }

  const finalValue = () => (mode === 'edit' ? (isPhone ? formatPhone(strip(value)) : value.trim()) : current)

  /* Fires from OtpInput as soon as the 6th digit lands. */
  const verify = (entered) => {
    setErr(null)
    setStatus('verifying')
    timers.current.push(
      setTimeout(() => {
        if (entered === '000000') {
          setStatus('idle')
          setCode('')
          setErr(ka.contact.errCode)
          return
        }
        setStatus('success')
        timers.current.push(setTimeout(() => onConfirm(finalValue()), 700))
      }, 900),
    )
  }

  const title = ka.contact.titles[`${type}${mode === 'edit' ? 'Edit' : 'Verify'}`]
  const target = mode === 'edit' ? (isPhone && strip(value).length === 9 ? formatPhone(strip(value)) : value) : current

  const next = (e) => {
    e.preventDefault()
    if (isPhone ? !/^5\d{8}$/.test(strip(value)) : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      setErr(isPhone ? ka.contact.errPhone : ka.contact.errEmail)
      return
    }
    setErr(null)
    setStep('code')
  }

  const busy = status !== 'idle'

  return (
    <Modal title={title} onClose={onCancel} className="acc-contactmodal">
      {step === 'value' ? (
        <form onSubmit={next} noValidate>
          <div className="gpi-field">
            <label className="gpi-field__lbl" htmlFor="acc-contact-value">
              {isPhone ? ka.contact.newPhone : ka.contact.newEmail}
              <span className="gpi-field__req">*</span>
            </label>
            <input
              id="acc-contact-value"
              className={`gpi-input acc-contactmodal__input${err ? ' is-error' : ''}`}
              type={isPhone ? 'tel' : 'email'}
              inputMode={isPhone ? 'tel' : 'email'}
              placeholder={isPhone ? '5XX XXX XXX' : 'name@example.com'}
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (err) setErr(null)
              }}
              autoComplete="off"
            />
            {err && <p className="acc-err t-caption" role="alert">{err}</p>}
          </div>
          <div className="acc-contactmodal__ft">
            <Button variant="tertiary" type="button" onClick={onCancel}>{ka.crop.cancel}</Button>
            <Button variant="primary" type="submit">{ka.contact.sendCode}</Button>
          </div>
        </form>
      ) : (
        // Code step is a centred, focused moment — sent-line through resend
        // link all share one centre axis.
        <div className="acc-code">
          <p className="t-body acc-desc acc-contactmodal__sent">{ka.contact.codeSent(isPhone, target)}</p>
          <div className="gpi-field">
            <span className="gpi-field__lbl" id="acc-contact-code-lbl">
              {ka.contact.codeLabel}
              <span className="gpi-field__req">*</span>
            </span>
            <OtpInput
              key={otpKey}
              length={CODE_LENGTH}
              value={code}
              onChange={(v) => {
                setCode(v)
                if (err) setErr(null)
                if (resent) setResent(false)
              }}
              onComplete={verify}
              disabled={busy}
              error={!!err}
              autoFocus
              ariaLabel={ka.contact.codeGroupLabel}
            />
            {err && <p className="acc-err t-caption" role="alert">{err}</p>}
          </div>

          {/* Auto-submit means no confirm button — announce progress instead.
              Also carries the resend confirmation, so every automatic thing
              that happens here is spoken once. */}
          <div className="acc-otpstatus" aria-live="polite">
            {status === 'verifying' && (
              <>
                <span className="gpi-spinner" />
                <span className="t-body-sm acc-desc">{ka.contact.verifying}</span>
              </>
            )}
            {status === 'success' && (
              <>
                <Icon name="check" size={20} className="acc-otpstatus__ok" />
                <span className="t-body-sm acc-otpstatus__oktxt">{ka.contact.verifiedMsg}</span>
              </>
            )}
            {status === 'idle' && resent && (
              <>
                <Icon name="check" size={20} className="acc-otpstatus__ok" />
                <span className="t-body-sm acc-otpstatus__oktxt">{ka.contact.resent}</span>
              </>
            )}
          </div>

          {!busy && (
            <p className="t-caption acc-contactmodal__resend">
              {cooldown > 0 ? (
                <span className="acc-resend--wait">
                  {ka.contact.resend(isPhone)} - <strong className="acc-resend__t">{mmss(cooldown)}</strong>
                </span>
              ) : (
                <button type="button" className="acc-link" onClick={resend}>{ka.contact.resend(isPhone)}</button>
              )}
            </p>
          )}
          <div className="acc-contactmodal__ft">
            <Button variant="tertiary" type="button" onClick={onCancel} disabled={busy}>
              {ka.crop.cancel}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
