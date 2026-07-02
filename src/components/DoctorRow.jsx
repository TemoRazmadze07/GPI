import Avatar from './Avatar.jsx'
import Icon from '../lib/Icon.jsx'
import { langTag } from '../data/booking.js'
import { ka } from '../i18n/strings.js'

/* DoctorRow — selectable list item (design 104:8702): avatar · name · role ·
   language tags. Clicking the row selects the doctor; the NAME is a link that
   opens the doctor's bio (onInfo). Selected row gets a lavender fill + indigo
   border and an × to deselect. */
export default function DoctorRow({ doctor, selected, onSelect, onDeselect, onInfo, locked = false }) {
  return (
    <div className={`gpi-drow ${selected ? 'is-selected' : ''}`}>
      <div
        className="gpi-drow__main"
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        onClick={(e) => { if (e.target.closest('.gpi-drow__namelink')) return; onSelect(doctor.id) }}
        onKeyDown={(e) => { if (e.target.closest('.gpi-drow__namelink')) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(doctor.id) } }}
      >
        <Avatar name={doctor.name} seed={doctor.avatar} size={40} />
        <div className="gpi-drow__meta">
          <button
            type="button"
            className="gpi-drow__namelink"
            onClick={(e) => { e.stopPropagation(); onInfo(doctor) }}
            title={doctor.name}
          >
            {doctor.name}
          </button>
          <span className="gpi-drow__role">{doctor.role}</span>
        </div>
      </div>
      <div className="gpi-drow__tags">
        {doctor.languages.map((l) => (
          <span key={l} className="gpi-langtag">{langTag[l] || l}</span>
        ))}
      </div>
      {selected && !locked && (
        <button className="gpi-drow__x" onClick={onDeselect} aria-label="ექიმის მოხსნა">
          <Icon name="x" size={16} />
        </button>
      )}
      {selected && locked && (
        <span className="gpi-drow__lock" title={ka.wizard.book.doctorLocked}>
          <Icon name="lock" size={16} />
        </span>
      )}
    </div>
  )
}
