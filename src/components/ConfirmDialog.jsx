import Modal from './Modal.jsx'
import Avatar from './Avatar.jsx'
import { Button } from './Button.jsx'

/* ConfirmDialog — a destructive confirmation on the shared Modal shell (same frame
   as the doctor-details modal). Danger "confirm" + secondary "keep"; the safe keep
   button takes initial focus so a stray Enter can't confirm. `appt` (optional)
   renders a compact summary of what's being acted on. */
export default function ConfirmDialog({ title, body, appt, confirmLabel, keepLabel, onConfirm, onClose }) {
  return (
    <Modal
      title={title}
      closeLabel={keepLabel}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose} autoFocus>{keepLabel}</Button>
          <Button variant="danger" size="md" onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="gpi-confirm__text">{body}</p>
      {appt && (
        <div className="gpi-confirm__appt">
          <Avatar name={appt.doctor.name} seed={appt.doctor.avatar} size={40} />
          <div className="gpi-confirm__meta">
            <span className="gpi-confirm__name">
              {appt.doctor.name} · <span className="gpi-confirm__role">{appt.doctor.specialty}</span>
            </span>
            <span className="gpi-confirm__sub">{appt.dateLabel} · {appt.time} · {appt.clinic.name}</span>
          </div>
        </div>
      )}
    </Modal>
  )
}
