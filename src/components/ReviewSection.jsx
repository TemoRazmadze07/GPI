import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { t } from '../i18n/index.js'

/* Collapsible review section — the buying-flow review pattern (outlined box,
   header = icon · title · collapsed one-line summary · edit pencil · chevron;
   body = label/value grid). Shared across flows (booking review, purchase review). */
export default function ReviewSection({ icon, title, summary, onEdit, defaultOpen = true, editLabel, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const toggle = () => setOpen((o) => !o)
  return (
    <section className="gpi-rsec">
      <div
        className="gpi-rsec__hd"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={(e) => {
          if (e.target.closest('.gpi-rsec__edit')) return
          toggle()
        }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.gpi-rsec__edit')) {
            e.preventDefault()
            toggle()
          }
        }}
      >
        <Icon name={icon} size={20} />
        <span className="gpi-rsec__title">{title}</span>
        {!open && summary && <span className="gpi-rsec__summary">{summary}</span>}
        {onEdit && (
          <button className="gpi-rsec__edit" aria-label={editLabel || t.actions.edit} onClick={onEdit}>
            <Icon name="pencil" size={16} />
          </button>
        )}
        <span className="gpi-rsec__chev">
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} />
        </span>
      </div>
      {open && <div className="gpi-rsec__body">{children}</div>}
    </section>
  )
}

/* One label/value line inside a ReviewSection body (grid children). */
export function ReviewRow({ label, children }) {
  return (
    <>
      <span className="gpi-rrow__label">{label}</span>
      <span className="gpi-rrow__value">{children}</span>
    </>
  )
}
