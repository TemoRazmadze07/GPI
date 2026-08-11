/* Field moved to the shared library (components/Field.jsx) 2026-08-10 — the
   foreign-student purchase flow became the second form to need it, which is the
   trigger the form-validation rule set for promoting it.

   This file stays as a re-export so b2b's importers (AddInsuredScreen,
   ImportRowDrawer) are untouched. The shared version renders the same anatomy
   with semantic hint classes (gpi-field__hint--err/--ok) that resolve to the
   same status tokens the b2b-hint-* utilities used, so b2b is unchanged. */
export { default } from '../components/Field.jsx'
