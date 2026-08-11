import { useEffect, useState } from 'react'

/* Tooltip — the system's hover/focus label for icon-only elements.
   Added 2026-08-10 with the user's go-ahead (Rule 9) when the contact-row
   status badges became icons; the codebase's only prior idiom was the native
   `title`, which is delayed, OS-styled and never fires on keyboard focus.

   CONTRACT — the bubble is VISUAL ONLY (aria-hidden, no role="tooltip").
   The trigger must carry its own accessible name: a `.gpi-sr-only` span for
   static content, or aria-label when the child is a real control. Rationale:
   a `role="tooltip"` + aria-describedby bubble would duplicate that name and
   announce it twice, and it only exists while open — so on touch, where
   nothing hovers, a describedby-only label would vanish entirely.

   WCAG 1.4.13 (content on hover or focus) governs the visual bubble:
   · HOVERABLE  — listeners sit on the WRAPPER, so moving the pointer from the
     trigger onto the bubble keeps it open.
   · PERSISTENT — stays until blur / mouseleave / Esc; no auto-dismiss timer.
   · DISMISSIBLE — Esc closes it with the pointer left in place.

   `focusable` (default true) puts a tab stop on the trigger so keyboard users
   reach the label at all — per the ARIA practice that a tooltip trigger must
   be focusable. Pass focusable={false} when the child is ALREADY a button or
   link, or the wrapper adds a second, duplicate tab stop.

   Placement is CSS-only (absolute against the wrapper) — no flip/collision
   logic, which is fine for inline row usage. If a tooltip ever has to escape a
   scroll container, that is the moment to reach for a real popover rather than
   grow this one.

   Props: label · placement 'top' | 'bottom' (default top) · focusable · children */
export default function Tooltip({ label, placement = 'top', focusable = true, children }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <span
      className="gpi-tip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span className="gpi-tip__trigger" tabIndex={focusable ? 0 : undefined}>
        {children}
      </span>
      <span
        className={`gpi-tip__bubble gpi-tip__bubble--${placement}${open ? ' is-open' : ''}`}
        aria-hidden="true"
      >
        {label}
      </span>
    </span>
  )
}
