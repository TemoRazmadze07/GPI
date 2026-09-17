import { useEffect, useRef } from 'react'
import Icon from '../lib/Icon.jsx'
import { t } from '../i18n/index.js'

/* Modal — shared dialog shell (frame · header title + × close · body · footer),
   matching the doctor-details modal (design node 89:3546). Clicking the overlay,
   the × or pressing Escape all dismiss via onClose. Reused by DoctorBioModal and
   ConfirmDialog so every dialog shares one frame.
   `variant` (2026-09-11, user): 'sheet' (default) | 'dialog'. Desktop renders both
   the same; ≤767px a sheet rises from the bottom at full width and a dialog stays a
   small centred card (mobile.css). 'dialog' is for a confirmation asked ON TOP of a
   task (remove/delete) — ConfirmDialog is its consumer. */
export default function Modal({ title, onClose, closeLabel, children, footer, className, variant = 'sheet' }) {
  const boxRef = useRef(null)
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  /* Initial focus + restore (audit 2026-09-07 E1): a dialog that leaves focus on the
     page behind it is invisible to a keyboard user. A child that focused itself
     (OtpInput's autoFocus) wins; otherwise the first text control or button in the
     body, else the ×. On close, focus goes back to whatever opened the dialog. */
  useEffect(() => {
    const opener = document.activeElement
    const box = boxRef.current
    if (box && !box.contains(document.activeElement)) {
      const first =
        box.querySelector(
          '.gpi-modal__body input:not([type="hidden"]):not([type="file"]):not([disabled]), .gpi-modal__body textarea, .gpi-modal__body select, .gpi-modal__body button:not([disabled]), .gpi-modal__body [tabindex]:not([tabindex="-1"])',
        ) || box.querySelector('.gpi-modal__close')
      first?.focus()
    }
    return () => {
      if (opener && document.contains(opener) && typeof opener.focus === 'function') opener.focus()
    }
  }, [])

  return (
    <div className={`gpi-modal-overlay gpi-modal-overlay--${variant}`} onClick={onClose}>
      <div ref={boxRef} className={`gpi-modal${className ? ` ${className}` : ''}`} role={variant === 'dialog' ? 'alertdialog' : 'dialog'} aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="gpi-modal__hd">
          <h3 className="gpi-modal__title">{title}</h3>
          <button className="gpi-modal__close" onClick={onClose} aria-label={closeLabel || t.actions.close}>
            <Icon name="x" size={24} />
          </button>
        </div>
        <div className="gpi-modal__body">{children}</div>
        {footer && <div className="gpi-modal__ft">{footer}</div>}
      </div>
    </div>
  )
}
