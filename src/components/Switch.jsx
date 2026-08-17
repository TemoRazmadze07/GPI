/* Switch — an instant-effect on/off control.

   NEW in code 2026-08-17, but NOT a new design-system component: the Switch set
   is already specced in Figma (node 80:111, 8 variants) and this is its first
   code implementation, built to that spec — md track 44×24 / knob 20, sm 36×20 /
   knob 16, pill radius, white knob on Elevation/Card, track Off `border-strong`
   → On `action-primary`.

   The system's own rule for choosing it (documented with the Figma set):
   **Switch = instant save; Checkbox = submitted choice.** So a switch must never
   sit behind a Save/Apply button — if a screen needs staged changes, use
   Checkbox. There is deliberately no error state.

   Built on a real <input type="checkbox" role="switch"> the way Checkbox.jsx and
   Radio.jsx are, so keyboard, focus and form semantics come for free; role=switch
   makes assistive tech announce on/off rather than checked/unchecked.

   LAYOUT RULE (user, 2026-08-17 — interface-wide): the control sits on the
   **LEFT**, label to its right, matching Checkbox and Radio so every selection
   control in the product shares one alignment. There is deliberately no
   right-pinned variant. NOTE this supersedes the layout of Figma's **Settings
   Row** (node 81:863), which pins the Switch right — reconcile that component in
   Figma before building a settings list from it. */
export default function Switch({
  name,
  checked,
  onChange,
  label,
  help,
  disabled = false,
  size = 'md',
  ariaLabel,
}) {
  return (
    <label
      className={`gpi-switchrow gpi-switchrow--${size} ${checked ? 'is-checked' : ''} ${
        disabled ? 'is-disabled' : ''
      }`}
    >
      <input
        type="checkbox"
        role="switch"
        className="gpi-switchrow__input"
        name={name}
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="gpi-switch" aria-hidden="true">
        <span className="gpi-switch__knob" />
      </span>
      {label && (
        <span className="gpi-switchrow__text">
          <span className="gpi-switchrow__title">{label}</span>
          {help && <span className="gpi-switchrow__help">{help}</span>}
        </span>
      )}
    </label>
  )
}
