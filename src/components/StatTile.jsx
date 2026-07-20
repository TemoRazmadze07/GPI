import Icon from '../lib/Icon.jsx'

/* StatTile — compact metric/KPI summary tile (design-system Stat Tile v1).
   A labelled number with optional meta line + leading icon; `tone` tints the
   tile for status emphasis (danger = overdue money). Built for the invoices
   summary strip (2026-07-20); designed to be reused by the future dashboard
   KPI row (Rule 6). Token-driven — no ad-hoc values.
   tone: default | danger | warning | success. */
export default function StatTile({ label, value, meta, tone = 'default', icon }) {
  return (
    <div className={`gpi-stat gpi-stat--${tone}`}>
      <div className="gpi-stat__label">
        {icon && <Icon name={icon} size={16} />}
        {label}
      </div>
      <div className="gpi-stat__value">{value}</div>
      {meta && <div className="gpi-stat__meta">{meta}</div>}
    </div>
  )
}
