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
   · badge  — an UNREAD counter (2026-09-17, Curatio history sections): a solid
              danger disc with the figure, trailing the label — records the user
              has not opened yet, the inbox convention. NOT `count` (how many
              records exist — data, no colour); this is an alert. Capped at
              99+. `badgeLabel` = the accessible reading („3 ახალი"); the figure
              is aria-hidden so a screen reader hears the words. 0/null = nothing.
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
          {o.badge > 0 && (
            <>
              <span className="gpi-seg__badge" aria-hidden="true">{o.badge > 99 ? '99+' : o.badge}</span>
              {o.badgeLabel && <span className="gpi-sr-only">{o.badgeLabel}</span>}
            </>
          )}
        </button>
      ))}
    </div>
  )
}
