import Avatar from './Avatar.jsx'
import Modal from './Modal.jsx'
import { Button } from './Button.jsx'
import useIsMobile from '../lib/useIsMobile.js'
import { langLabels } from '../data/booking.js'
import { t } from '../i18n/index.js'

/* DoctorBioModal — doctor details dialog (design node 89:3546): avatar · name ·
   სპეციალობა · ენები · description, with Close / Select-doctor footer actions.
   Built on the shared Modal shell. */
/* `onSelect` optional (2026-09-16, additive): the Curatio doctor row opens this on
   the CURRENT personal doctor as „ექიმის დეტალები" — a read-only look, so without a
   handler the footer is Close alone (mobile too: its sheet otherwise had no action).
   `doctor.photo` (additive): a real photo wins over the pravatar seed. */
export default function DoctorBioModal({ doctor, onClose, onSelect }) {
  const langs = doctor.languages.map((l) => langLabels[l] || l).join(', ')
  /* Sheet footer = actions only (user, 2026-09-15): Close is dismissal (header ×), so the
     mobile sheet carries just "Choose doctor" full width. Desktop keeps the pair. */
  const isMobile = useIsMobile()

  return (
    <Modal
      title={t.wizard.bio.title}
      closeLabel={t.wizard.bio.close}
      onClose={onClose}
      footer={
        <>
          {(!isMobile || !onSelect) && <Button variant="secondary" size="md" onClick={onClose}>{t.wizard.bio.close}</Button>}
          {onSelect && <Button variant="primary" size="md" onClick={onSelect}>{t.wizard.bio.select}</Button>}
        </>
      }
    >
      <div className="gpi-bio__person">
        <Avatar name={doctor.name} seed={doctor.avatar} src={doctor.photo} size={80} />
        <div className="gpi-bio__meta">
          <span className="gpi-bio__name">{doctor.name}</span>
          <span className="gpi-bio__attr">
            <span className="gpi-bio__lbl">{t.wizard.bio.specialty}: </span>
            <strong>{doctor.role}</strong>
          </span>
          <span className="gpi-bio__attr">
            <span className="gpi-bio__lbl">{t.wizard.bio.languages}: </span>
            <strong>{langs}</strong>
          </span>
        </div>
      </div>
      <p className="gpi-bio__desc">{doctor.bio}</p>
    </Modal>
  )
}
