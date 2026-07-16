import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { Button } from './Button.jsx'
import Modal from './Modal.jsx'

/* ColumnsModal — "customize table" dialog (design-system Column Customization
   v1, BMLL-pattern, 2026-07-16). Lets the user hide columns and reorder them;
   the LOCKED first column (the table's identifier — also its pinned column)
   always shows and always stays first; the actions column isn't listed.
   Changes STAGE in a local draft — Save commits via onSave, closing any other
   way discards (same model as the filter popover).

   columns: [{ key, label, locked? }] in DEFAULT order.
   value:   { order: [keys], hidden: [keys] } | null (null = defaults).
   Reorder: drag the grip handle, or focus it and press ↑/↓ (a11y + testable). */
export default function ColumnsModal({ columns, value, onSave, onClose, t }) {
  const locked = columns.filter((c) => c.locked)
  const unlocked = columns.filter((c) => !c.locked)
  const [rows, setRows] = useState(() => {
    const byKey = Object.fromEntries(unlocked.map((c) => [c.key, c]))
    const ordered = (value?.order || []).map((k) => byKey[k]).filter(Boolean)
    const rest = unlocked.filter((c) => !ordered.includes(c))
    const hidden = new Set(value?.hidden || [])
    return [...ordered, ...rest].map((c) => ({ key: c.key, label: c.label, visible: !hidden.has(c.key) }))
  })
  const [dragIdx, setDragIdx] = useState(null)

  const move = (from, to) => {
    if (to < 0 || to >= rows.length || from === to) return
    setRows((rs) => {
      const next = [...rs]
      const [it] = next.splice(from, 1)
      next.splice(to, 0, it)
      return next
    })
  }
  const toggle = (key) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, visible: !r.visible } : r)))

  return (
    <Modal
      title={t.title}
      onClose={onClose}
      className="gpi-modal--cols"
      footer={
        <>
          <Button variant="tertiary" size="md" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() =>
              onSave({
                order: rows.map((r) => r.key),
                hidden: rows.filter((r) => !r.visible).map((r) => r.key),
              })
            }
          >
            {t.save}
          </Button>
        </>
      }
    >
      <div className="gpi-colmodal__list">
        {locked.map((c) => (
          <div key={c.key} className="gpi-colmodal__row is-locked">
            <Icon name="lock" size={16} />
            <span className="gpi-colmodal__label">{c.label}</span>
            <span className="gpi-colmodal__hint">{t.always}</span>
          </div>
        ))}
        {rows.map((r, i) => (
          <div
            key={r.key}
            className={`gpi-colmodal__row${dragIdx === i ? ' is-dragging' : ''}`}
            draggable
            onDragStart={(e) => {
              setDragIdx(i)
              e.dataTransfer.effectAllowed = 'move'
            }}
            onDragEnter={() => {
              if (dragIdx != null && dragIdx !== i) {
                move(dragIdx, i)
                setDragIdx(i)
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={() => setDragIdx(null)}
          >
            <button
              type="button"
              className="gpi-colmodal__handle"
              aria-label={`${t.move} — ${r.label}`}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  move(i, i - 1)
                }
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  move(i, i + 1)
                }
              }}
            >
              <Icon name="grip-vertical" size={16} />
            </button>
            <label className="gpi-colmodal__item">
              <input
                type="checkbox"
                className="gpi-colmodal__check"
                checked={r.visible}
                onChange={() => toggle(r.key)}
              />
              <span className="gpi-colmodal__label">{r.label}</span>
            </label>
          </div>
        ))}
      </div>
    </Modal>
  )
}
