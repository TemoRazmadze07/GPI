import { clinics as allClinics } from '../data/booking.js'
import Icon from '../lib/Icon.jsx'

/* ClinicChips — radio-style clinic options matching the Step-2 design
   (node 104:8241): a clinic-coloured ring + the full clinic label. They are the
   calendar LEGEND and a soft filter, and they also REFLECT the clinic resolved by
   the picked time slot (`selectedClinic`) — so choosing a time lights up its
   clinic here. Colour comes from the clinic/* tokens via the gpi-cl--{tone} class. */
export default function ClinicChips({ clinics = allClinics, active, selectedClinic = null, onToggle, disabled = false }) {
  return (
    <div className={`gpi-clinicchips ${disabled ? 'is-disabled' : ''}`} role="group">
      {clinics.map((c) => {
        // Two distinct states: an ACTIVE FILTER (the user toggled it — pressed, tinted
        // bg, aria-pressed) vs merely REFLECTING the clinic of the picked time slot
        // (a lighter cue, not a pressed toggle). Keeping aria-pressed tied to the real
        // filter only means the button's state never lies, and clicking a reflected
        // chip is a clear escalation into an actual filter.
        const isFilter = active.includes(c.value)
        const isReflected = !isFilter && c.value === selectedClinic
        return (
          <button
            key={c.value}
            type="button"
            className={`gpi-clinicchip gpi-cl--${c.tone} ${isFilter ? 'is-on' : ''} ${isReflected ? 'is-reflected' : ''}`}
            aria-pressed={isFilter}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            onClick={() => { if (!disabled) onToggle(c.value) }}
          >
            <span className="gpi-clinicchip__ring" />
            {c.label}
            {disabled && <Icon name="lock" size={13} />}
          </button>
        )
      })}
    </div>
  )
}
