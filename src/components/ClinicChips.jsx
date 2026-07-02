import { clinics as allClinics } from '../data/booking.js'

/* ClinicChips — radio-style clinic options matching the Step-2 design
   (node 104:8241): a clinic-coloured ring + the full clinic label. They double
   as the calendar LEGEND and a SOFT filter (all-on by default; tap to focus).
   Colour comes from the clinic/* tokens via the gpi-cl--{tone} class. */
export default function ClinicChips({ clinics = allClinics, active, onToggle }) {
  return (
    <div className="gpi-clinicchips" role="group">
      {clinics.map((c) => {
        const on = active.includes(c.value)
        return (
          <button
            key={c.value}
            type="button"
            className={`gpi-clinicchip gpi-cl--${c.tone} ${on ? 'is-on' : ''}`}
            aria-pressed={on}
            onClick={() => onToggle(c.value)}
          >
            <span className="gpi-clinicchip__ring" />
            {c.label}
          </button>
        )
      })}
    </div>
  )
}
