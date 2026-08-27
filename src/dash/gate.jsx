import { useEffect, useState } from 'react'
import Modal from '../components/Modal.jsx'
import OtpInput from '../components/OtpInput.jsx'
import { Button } from '../components/Button.jsx'
import { D } from './strings.js'

/* OTP gate for the web Curatio protected zone — the mobile module's gate
   (mobile/otp.jsx) ported to the desktop surface: same rules, different shell.
   · One code unlocks the SESSION (sessionStorage); locks return when the tab
     closes or via the explicit „ჩაკეტვა" action.
   · Deep links never bypass — the history route gates in place.
   · Its own storage key, NOT mobile's `mgaOtpUnlocked`: the platforms are
     separate contexts (Rule 5) and a shared key would let one demo unlock the
     other invisibly.
   · The sheet becomes a Modal (the desktop dialog shell) and the digit boxes
     are the shared OtpInput — the mobile file hand-rolls boxes because it
     predates the component; this surface starts on the shared one.
   Demo behaviour mirrors mobile: any 4 digits pass, the countdown is cosmetic. */

const KEY = 'gpi.dash.otpUnlocked'

export const isUnlocked = () => sessionStorage.getItem(KEY) === '1'
export const setUnlocked = (on) =>
  on ? sessionStorage.setItem(KEY, '1') : sessionStorage.removeItem(KEY)

export function useGate() {
  const [unlocked, setLocal] = useState(isUnlocked)
  const [open, setOpen] = useState(false)

  const relock = () => {
    setUnlocked(false)
    setLocal(false)
  }

  const modal = open ? (
    <OtpModal
      onSuccess={() => {
        setUnlocked(true)
        setLocal(true)
        setOpen(false)
      }}
      onClose={() => setOpen(false)}
    />
  ) : null

  return { unlocked, request: () => setOpen(true), relock, modal }
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
