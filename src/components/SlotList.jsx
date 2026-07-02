/* SlotList — the time column. Plain full-width pills with centred slot ranges
   (design 104:8774). `items` is a flat [{ slot, clinic }] list; `clinic` may be
   null when no doctor is chosen yet (it's resolved once a doctor is picked).
   Tap a slot to select it; commit happens via the card's "დამატება". */
export default function SlotList({ items, selected, onSelect }) {
  return (
    <div className="gpi-slots">
      {items.map(({ slot, clinic }) => {
        const on = !!selected && selected.slot === slot &&
          (selected.clinic == null || clinic == null || selected.clinic === clinic)
        return (
          <button
            key={`${slot}-${clinic ?? 'any'}`}
            className={`gpi-slot2 ${on ? 'is-sel' : ''}`}
            onClick={() => onSelect(slot, clinic)}
            aria-pressed={on}
          >
            {slot}
          </button>
        )
      })}
    </div>
  )
}
