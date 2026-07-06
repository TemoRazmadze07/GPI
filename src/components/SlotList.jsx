import { clinicByValue } from '../data/booking.js'

/* SlotList — the time column, grouped by clinic. `groups` is [{ clinic, slots }].
   When `clinic` is set, the group renders a colour-coded header (dot + clinic
   name) — so a two-clinic day reads as "mornings at X, afternoons at Y". The
   header carries the clinic, so the pills themselves stay clean (no per-pill dot).
   When `clinic` is null (date/time-first, before a doctor is chosen) the clinic
   can't be known yet, so slots render as plain centred pills under no header.
   Tap a slot to select it; commit happens via the card's "დამატება". */
export default function SlotList({ groups, selected, onSelect }) {
  return (
    <div className="gpi-slots">
      {groups.map((g, gi) => {
        const cl = g.clinic ? clinicByValue(g.clinic) : null
        return (
          <div className="gpi-slotgroup" key={g.clinic ?? `g${gi}`}>
            {cl && (
              <div className={`gpi-slotgroup__hd gpi-cl--${cl.tone}`}>
                <span className="gpi-cldot" aria-hidden="true" />
                {cl.label}
              </div>
            )}
            <div className="gpi-slotgroup__slots">
              {g.slots.map((slot) => {
                const on = !!selected && selected.slot === slot &&
                  (selected.clinic == null || g.clinic == null || selected.clinic === g.clinic)
                return (
                  <button
                    key={`${slot}-${g.clinic ?? 'any'}`}
                    className={`gpi-slot2 ${on ? 'is-sel' : ''}`}
                    onClick={() => onSelect(slot, g.clinic)}
                    aria-pressed={on}
                    aria-label={cl ? `${slot} — ${cl.label}` : slot}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
