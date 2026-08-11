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
   variant, for "reset"-shaped actions that undo rather than set up. */
const STUDY = new URLSearchParams(window.location.search).has('study')

export default function DemoBar({ actions = [] }) {
  if (STUDY || !actions.length) return null
  return (
    <div className="gpi-demobar" role="group" aria-label="prototype demo controls">
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
