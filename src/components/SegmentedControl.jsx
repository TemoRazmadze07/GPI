/* SegmentedControl — pill track with equal segments; selected = pink pill
   by default, or dark indigo when variant="indigo" (Step-2 booking type tabs).
   Mirrors the Figma Segmented Control component. */
export default function SegmentedControl({ options, value, onChange, size = 'md', variant }) {
  return (
    <div className={`gpi-seg gpi-seg--${size} ${variant ? `gpi-seg--${variant}` : ''}`} role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={o.value === value}
          aria-disabled={o.disabled || undefined}
          className={`gpi-seg__item ${o.value === value ? 'is-active' : ''} ${o.disabled ? 'is-disabled' : ''}`}
          onClick={() => { if (!o.disabled) onChange(o.value) }}
          title={o.disabled ? o.disabledReason : undefined}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
