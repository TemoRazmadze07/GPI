import Avatar from './Avatar.jsx'
import Icon from '../lib/Icon.jsx'
import { clinics } from '../data/booking.js'

/* DoctorResultCard — a doctor row carrying their own slot chips for the
   selected day. Booking = tap a slot chip. "i" opens the doctor info. */
const MAX_SHOWN = 6

export default function DoctorResultCard({ doctor, slots, selectedSlot, onSelectSlot, onInfo }) {
  const clinic = clinics.find((c) => c.value === doctor.clinic)
  const shown = slots.slice(0, MAX_SHOWN)
  const extra = slots.length - shown.length

  return (
    <div className={`gpi-docres ${selectedSlot ? 'is-chosen' : ''}`}>
      <div className="gpi-docres__head">
        <Avatar name={doctor.name} seed={doctor.avatar} size={40} />
        <div className="gpi-docres__meta">
          <span className="gpi-docres__name">{doctor.name}</span>
          <span className="gpi-docres__sub">
            {doctor.specialty} · {clinic?.label} · {doctor.languages.join('·')}
          </span>
        </div>
        <button className="gpi-docres__info" onClick={() => onInfo(doctor)} aria-label="ექიმის დეტალები">
          <Icon name="info" size={20} />
        </button>
      </div>
      {slots.length === 0 ? (
        <div className="gpi-docres__empty">ამ დღეს თავისუფალი დრო არ აქვს</div>
      ) : (
        <div className="gpi-docres__slots">
          {shown.map((s) => (
            <button
              key={s}
              className={`gpi-slot ${selectedSlot === s ? 'is-sel' : ''}`}
              onClick={() => onSelectSlot(doctor.id, s)}
            >
              {s}
            </button>
          ))}
          {extra > 0 && <button className="gpi-slot gpi-slot--more">+{extra}</button>}
        </div>
      )}
    </div>
  )
}
