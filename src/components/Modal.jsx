import { useEffect } from 'react'
import Icon from '../lib/Icon.jsx'
import { ka } from '../i18n/strings.js'

/* Modal — shared dialog shell (frame · header title + × close · body · footer),
   matching the doctor-details modal (design node 89:3546). Clicking the overlay,
   the × or pressing Escape all dismiss via onClose. Reused by DoctorBioModal and
   ConfirmDialog so every dialog shares one frame. */
export default function Modal({ title, onClose, closeLabel, children, footer }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="gpi-modal-overlay" onClick={onClose}>
      <div className="gpi-modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="gpi-modal__hd">
          <h3 className="gpi-modal__title">{title}</h3>
          <button className="gpi-modal__close" onClick={onClose} aria-label={closeLabel || ka.actions.close}>
            <Icon name="x" size={24} />
          </button>
        </div>
        <div className="gpi-modal__body">{children}</div>
        {footer && <div className="gpi-modal__ft">{footer}</div>}
      </div>
    </div>
  )
}
