import Icon from '../lib/Icon.jsx'

/* Field — label + control + ONE message line.

   Moved out of AddInsuredScreen.jsx (2026-08) so the Excel importer's repair
   drawer can render the same fields as the single-person form without a
   circular import. Behaviour is unchanged.

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
        <span className="gpi-field__hint b2b-hint-err" role="alert">
          {errorMsg}
        </span>
      ) : success ? (
        <span className="gpi-field__hint b2b-hint-ok">
          <Icon name="check" size={14} />
          {success}
        </span>
      ) : hint ? (
        <span className="gpi-field__hint">{hint}</span>
      ) : null}
    </div>
  )
}
