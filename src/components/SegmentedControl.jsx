import Icon from '../lib/Icon.jsx'

/* SegmentedControl — pill track; selected = pink pill by default, dark indigo
   when variant="indigo" (Step-2 booking type tabs), or a pale-indigo pill on a
   white bordered track when variant="soft" — the web twin of the mobile product
   switcher, for view tabs that are not a page's primary action.
   Mirrors the Figma Segmented Control component.
   Options (2026-09-10, additive — every existing caller unchanged):
   · icon   — a leading glyph (Icon name), the category mark of a section switch
   · count  — a trailing figure (records in that section); regular weight so it
              reads as data beside the label, same colour, so it passes wherever
              the label does
   · short  — a shorter label for ≤767, where three Georgian names outgrow a
              phone. The full label stays the accessible name (the short one is
              aria-hidden); CSS swaps which is visible.
   `className` lets a consumer place the control (never restyle it). */
export default function SegmentedControl({ options, value, onChange, size = 'md', variant, className }) {
  return (
    <div className={`gpi-seg gpi-seg--${size} ${variant ? `gpi-seg--${variant}` : ''}${className ? ` ${className}` : ''}`} role="tablist">
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
          {o.icon && <Icon name={o.icon} size={16} className="gpi-seg__icon" aria-hidden="true" />}
          {o.short ? (
            <>
              <span className="gpi-seg__label">{o.label}</span>
              <span className="gpi-seg__label gpi-seg__label--short" aria-hidden="true">{o.short}</span>
            </>
          ) : (
            o.label
          )}
          {o.count != null && <span className="gpi-seg__count">{o.count}</span>}
        </button>
      ))}
    </div>
  )
}
