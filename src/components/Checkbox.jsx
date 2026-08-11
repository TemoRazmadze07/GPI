import Icon from '../lib/Icon.jsx'

/* Checkbox — a single labelled checkbox.

   NEW component (flagged to the user 2026-08-10). The VISUAL already existed as
   .gpi-check / .gpi-checkrow, hand-rolled inside AddInsuredModal as a
   <button aria-pressed>. The student flow's consent is the second consumer, so
   the pattern is promoted to a component — and built on a real
   <input type="checkbox"> the way Radio.jsx is, so keyboard, focus, form
   semantics and "checked" (rather than "pressed") announcement come for free.

   AddInsuredModal is deliberately left alone for now; migrating it is a
   follow-up, not part of this build. */
export default function Checkbox({ name, checked, onChange, label, help, disabled = false, boxed = false }) {
  return (
    <label className={`gpi-checkrow ${boxed ? 'gpi-checkrow--boxed' : ''} ${checked ? 'is-checked' : ''} ${disabled ? 'is-disabled' : ''}`}>
      <input
        type="checkbox"
        className="gpi-checkrow__input"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={`gpi-check ${checked ? 'is-on' : ''}`} aria-hidden="true">
        {checked && <Icon name="check" size={14} />}
      </span>
      <span className="gpi-checkrow__text">
        <span className="gpi-checkrow__title">{label}</span>
        {help && <span className="gpi-checkrow__help">{help}</span>}
      </span>
    </label>
  )
}
