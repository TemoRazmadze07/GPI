/* FilterChips — single-select filter chip row (design-system Filter Chip v1).
   options: [{ id, label, count? }] · one always selected · radio-group semantics. */
export default function FilterChips({ options, value, onChange, label }) {
  return (
    <div className="gpi-chips" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          className={`gpi-chip${value === o.id ? ' is-selected' : ''}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
          {o.count != null && <span className="gpi-chip__count">· {o.count}</span>}
        </button>
      ))}
    </div>
  )
}
