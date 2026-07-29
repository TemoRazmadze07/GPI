import { useEffect } from 'react'
import Icon from '../lib/Icon.jsx'
import { t } from '../i18n/index.js'

/* Drawer — shared right-side detail panel (overlay · panel: header title + ×
   close · scrollable body · footer actions). The header stays GENERIC (e.g.
   "კონტრაქტის დეტალები") so every record-detail drawer shares one experience;
   record-specific facts live in the body. Overlay click, × and Escape dismiss
   via onClose. The go-to pattern for expanding table-row details across the
   app (contracts today; requests/claims/invoices later) — a dedicated page is
   only added when a record outgrows the drawer. */
export default function Drawer({ title, onClose, closeLabel, children, footer }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="gpi-drawer-overlay" onClick={onClose}>
      <aside className="gpi-drawer" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="gpi-drawer__hd">
          <h3 className="gpi-drawer__title">{title}</h3>
          <button className="gpi-drawer__close" onClick={onClose} aria-label={closeLabel || t.actions.close}>
            <Icon name="x" size={24} />
          </button>
        </div>
        <div className="gpi-drawer__body">{children}</div>
        {footer && <div className="gpi-drawer__ft">{footer}</div>}
      </aside>
    </div>
  )
}
