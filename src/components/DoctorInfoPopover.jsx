import Avatar from './Avatar.jsx'
import Icon from '../lib/Icon.jsx'
import { clinicByValue, langLabels } from '../data/booking.js'
import { t } from '../i18n/index.js'

/* DoctorInfoPopover — the "i" detail. Bio, languages (full names), clinics,
   rating. Rendered as an overlay inside the workspace (Rule 9: lightweight). */
export default function DoctorInfoPopover({ doctor, onClose }) {
  if (!doctor) return null
  return (
    <div className="gpi-docinfo__overlay" onClick={onClose}>
      <div className="gpi-docinfo" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={doctor.name}>
        <button className="gpi-docinfo__close" onClick={onClose} aria-label={t.a11y.close}><Icon name="x" size={18} /></button>
        <div className="gpi-docinfo__head">
          <Avatar name={doctor.name} seed={doctor.avatar} size={48} />
          <div>
            <div className="gpi-docinfo__name">{doctor.name}</div>
            <div className="gpi-docinfo__role">
              {doctor.role}{doctor.experience ? ` · ${doctor.experience} ${t.wizard.book.experience}` : ''}
            </div>
          </div>
        </div>
        <p className="gpi-docinfo__bio">{doctor.bio}</p>
        <div className="gpi-docinfo__rows">
          <div className="gpi-docinfo__row">
            <Icon name="globe" size={16} />
            <span className="gpi-muted">{t.wizard.book.languages}:</span>
            {doctor.languages.map((l) => langLabels[l]).join(' · ')}
          </div>
          <div className="gpi-docinfo__row">
            <Icon name="building-2" size={16} />
            <span className="gpi-muted">{t.wizard.book.clinicsTitle}:</span>
            {doctor.clinics.map((c) => clinicByValue(c).short).join(', ')}
          </div>
          <div className="gpi-docinfo__row">
            <Icon name="star" size={16} className="gpi-star" /> {doctor.rating}
            <span className="gpi-muted">({doctor.reviews} {t.wizard.book.reviews})</span>
          </div>
        </div>
      </div>
    </div>
  )
}
