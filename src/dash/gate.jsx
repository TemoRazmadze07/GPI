import { useEffect, useRef, useState } from 'react'
import Modal from '../components/Modal.jsx'
import OtpInput from '../components/OtpInput.jsx'
import { Button } from '../components/Button.jsx'
import { D } from './strings.js'

/* OTP gate for the web Curatio protected zone — the mobile module's gate
   (mobile/otp.jsx) ported to the desktop surface: same rules, different shell.
   · One code unlocks the SESSION (sessionStorage); locks return when the tab
     closes. The explicit „ჩაკეტვა" action was DROPPED from the product on
     2026-09-04 (user: session expiry is enough) — `relock` survives only for the
     DemoBar, so the locked state stays demonstrable.
   · Deep links never bypass — the history route gates in place.
   · Its own storage key, NOT mobile's `mgaOtpUnlocked`: the platforms are
     separate contexts (Rule 5) and a shared key would let one demo unlock the
     other invisibly.
   · The sheet becomes a Modal (the desktop dialog shell) and the digit boxes
     are the shared OtpInput — the mobile file hand-rolls boxes because it
     predates the component; this surface starts on the shared one.
   Demo behaviour mirrors mobile: any 4 digits pass, the countdown is cosmetic. */

const KEY = 'gpi.dash.otpUnlocked'
/* One gate, many hooks (2026-09-09): the section page now holds TWO useGate()
   instances — the history table's and the transfer flow's — and each seeded its
   `unlocked` once from storage. Unlocking through one left the other stale until
   a reload. Writes announce themselves on the window; every instance re-reads. */
const EVT = 'gpi.dash.gate'

export const isUnlocked = () => sessionStorage.getItem(KEY) === '1'
export const setUnlocked = (on) => {
  on ? sessionStorage.setItem(KEY, '1') : sessionStorage.removeItem(KEY)
  window.dispatchEvent(new Event(EVT))
}

export function useGate() {
  const [unlocked, setLocal] = useState(isUnlocked)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const sync = () => setLocal(isUnlocked())
    window.addEventListener(EVT, sync)
    return () => window.removeEventListener(EVT, sync)
  }, [])

  const relock = () => {
    setUnlocked(false)
    setLocal(false)
  }

  /* `request(after)` (additive, 2026-09-09): the transfer flow asks for the code
     and then needs to continue — open its own dialog — only if the code passed.
     Cancelling the OTP drops the continuation; nothing resumes later by surprise. */
  const after = useRef(null)
  const modal = open ? (
    <OtpModal
      onSuccess={() => {
        setUnlocked(true)
        setLocal(true)
        setOpen(false)
        const fn = after.current
        after.current = null
        fn?.()
      }}
      onClose={() => {
        after.current = null
        setOpen(false)
      }}
    />
  ) : null

  return {
    unlocked,
    request: (fn = null) => {
      after.current = typeof fn === 'function' ? fn : null
      setOpen(true)
    },
    relock,
    modal,
  }
}

export function OtpModal({ onSuccess, onClose }) {
  const [code, setCode] = useState('')
  const [left, setLeft] = useState(47)
  const full = code.length === 4

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <Modal
      title={D.cur.otp.title}
      onClose={onClose}
      className="dash-otpmodal"
      footer={
        <Button variant="primary" size="md" disabled={!full} onClick={onSuccess}>
          {D.cur.otp.confirm}
        </Button>
      }
    >
      <p className="dash-otp__body">{D.cur.otp.body}</p>
      <OtpInput length={4} value={code} onChange={setCode} autoFocus ariaLabel={D.cur.otp.title} />
      <p className="dash-otp__resend">
        {left > 0 ? (
          D.cur.otp.resendIn(left)
        ) : (
          <button type="button" className="gpi-link" onClick={() => setLeft(47)}>
            {D.cur.otp.resend}
          </button>
        )}
      </p>
      <p className="dash-otp__demo">{D.cur.otp.demoNote}</p>
    </Modal>
  )
}
