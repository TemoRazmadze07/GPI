import Avatar from './Avatar.jsx'
import Modal from './Modal.jsx'
import { Button } from './Button.jsx'
import { langLabels } from '../data/booking.js'
import { t } from '../i18n/index.js'

/* DoctorBioModal — doctor details dialog (design node 89:3546): avatar · name ·
   სპეციალობა · ენები · description, with Close / Select-doctor footer actions.
   Built on the shared Modal shell. */
export default function DoctorBioModal({ doctor, onClose, onSelect }) {
  const langs = doctor.languages.map((l) => langLabels[l] || l).join(', ')

  return (
    <Modal
      title={t.wizard.bio.title}
      closeLabel={t.wizard.bio.close}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose}>{t.wizard.bio.close}</Button>
          <Button variant="primary" size="md" onClick={onSelect}>{t.wizard.bio.select}</Button>
        </>
      }
    >
      <div className="gpi-bio__person">
        <Avatar name={doctor.name} seed={doctor.avatar} size={80} />
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
