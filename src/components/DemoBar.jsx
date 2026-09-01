import { useState } from 'react'

/* DemoBar — a PROTOTYPE affordance, deliberately NOT a design-system component
   and deliberately not styled like one: dark pill, monospace, English labels,
   so nobody in the room mistakes it for part of the GPI interface. It exists to
   jump the prototype into a state that is otherwise slow or impossible to reach
   in a demo (a spreadsheet full of broken rows; an account whose email isn't
   linked yet).

   Promoted from `b2b/StepExcel.jsx` to shared 2026-08-10 when the accounts
   console became the second consumer — the codebase's promote-on-second-consumer
   rule. Classes went `.b2b-demobar*` → `.gpi-demobar*` with it, since a B2B-
   namespaced class on the accounts surface would break the Rule 5 separation.

   The `?study` guard lives HERE, not at each call site: usability-study links go
   to participants, and a demo bar must never appear in front of one. Any future
   consumer inherits that automatically.

   Delete this (and .gpi-demobar) when the prototype stops being a demo.

   Props: actions = [{ label, onClick, ghost? }] — ghost renders the quiet
   variant, for "reset"-shaped actions that undo rather than set up.
   `wrap` (opt-in) caps the bar to the viewport and lets chips wrap — for
   surfaces with enough chips to overflow a phone.
   `collapsible` (opt-in) starts the bar as a tiny corner chip; tapping it
   opens a DOCKED bottom strip — full-width, opaque, one horizontally
   scrollable row — instead of the floating centred pill. The floating pill
   wrapped 7 chips into a translucent blob sitting ON the design under review;
   a docked strip occupies the screen's bottom edge, which is chrome territory,
   not canvas. The open state persists in sessionStorage so it survives the
   flow's route changes. Collapsible mode renders its own DOM branch so
   non-collapsible consumers keep the exact legacy markup.
   Both flags are additive and off by default, so existing consumers render
   byte-identically. */
const STUDY = new URLSearchParams(window.location.search).has('study')
const OPEN_KEY = 'gpi.demobar.open'

export default function DemoBar({ actions = [], wrap = false, collapsible = false }) {
  const [open, setOpen] = useState(() => !collapsible || sessionStorage.getItem(OPEN_KEY) === '1')
  if (STUDY || !actions.length) return null

  const toggle = (next) => {
    sessionStorage.setItem(OPEN_KEY, next ? '1' : '0')
    setOpen(next)
  }

  if (collapsible && !open) {
    return (
      <button
        type="button"
        className="gpi-demobar-min"
        aria-label="show prototype demo controls"
        aria-expanded="false"
        onClick={() => toggle(true)}
      >
        demo
      </button>
    )
  }

  if (collapsible) {
    return (
      <div className="gpi-demobar gpi-demobar--dock" role="group" aria-label="prototype demo controls">
        <span className="gpi-demobar__tag" aria-hidden="true">demo</span>
        <div className="gpi-demobar__scroll">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              className={`gpi-demobar__btn${a.ghost ? ' gpi-demobar__btn--ghost' : ''}`}
              onClick={a.onClick}
            >
              {a.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="gpi-demobar__btn gpi-demobar__btn--ghost"
          aria-label="hide demo controls"
          onClick={() => toggle(false)}
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <div
      className={`gpi-demobar${wrap ? ' gpi-demobar--wrap' : ''}`}
      role="group"
      aria-label="prototype demo controls"
    >
      <span className="gpi-demobar__tag" aria-hidden="true">demo</span>
      {actions.map((a) => (
        <button
          key={a.label}
          type="button"
          className={`gpi-demobar__btn${a.ghost ? ' gpi-demobar__btn--ghost' : ''}`}
          onClick={a.onClick}
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}
