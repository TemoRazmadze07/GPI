/* Radio — a single labeled radio option (design-system Radio: ring + pink dot,
   node 77:131). Uses a real <input type="radio"> so keyboard + roving focus come
   for free; the visible control reuses the shared `.gpi-radio` ring so it matches
   PersonCard and the Figma component. Group these under a role="radiogroup". */
export default function Radio({ name, value, checked, onChange, label, disabled = false }) {
  return (
    <label className={`gpi-radiopt ${checked ? 'is-checked' : ''} ${disabled ? 'is-disabled' : ''}`}>
      <input
        type="radio"
        className="gpi-radiopt__input"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
      />
      <span className="gpi-radio" aria-hidden="true">{checked && <span className="gpi-radio__dot" />}</span>
      <span className="gpi-radiopt__label">{label}</span>
    </label>
  )
}
