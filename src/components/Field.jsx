import Icon from '../lib/Icon.jsx'

/* Field — label + control + ONE message line.

   PROMOTED to the shared library 2026-08-10 (was b2b/WizardField.jsx). The
   locked note on the form-validation pattern said to promote it "when a second
   form needs it" — the foreign-student purchase flow is that second form.
   b2b/WizardField.jsx now re-exports this, so both b2b importers are unchanged.

   Message priority is exclusive (user rule 2026-07-06): inline error (red) >
   success check (green) > hint. A success message can never render in the
   error tone. */
export default function Field({ label, required, hint, success, errorMsg, wide, children }) {
  return (
    <div className={`gpi-field ${wide ? 'wide' : ''}`}>
      <span className="gpi-field__lbl">
        {label}
        {required && <span className="gpi-field__req">*</span>}
      </span>
      {children}
      {errorMsg ? (
        <span className="gpi-field__hint gpi-field__hint--err" role="alert">
          {errorMsg}
        </span>
      ) : success ? (
        <span className="gpi-field__hint gpi-field__hint--ok">
          <Icon name="check" size={14} />
          {success}
        </span>
      ) : hint ? (
        <span className="gpi-field__hint">{hint}</span>
      ) : null}
    </div>
  )
}
