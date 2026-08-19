/* SourceTag — where a medical record CAME FROM (stakeholder comment #7, approved
   as a shared component 2026-08-18; #9 extends it to the medical card + the
   prescriptions section and adds the `referral` variant).

   Why it exists: origin used to be smuggled into other fields — a `src` string in
   the meta line, and worse, a `status: 'uploaded'` badge sitting in the slot that
   otherwise means ნორმა / ყურადღება / კრიტიკული. Origin and clinical status are
   different axes; a patient reading „ატვირთული" where they expect a result reading
   is being told nothing about their health.

   A11y (Rule 7 + WCAG 1.4.1): every variant carries a LABEL, never colour alone —
   the tint is redundant reinforcement, not the signal.

   Variants (palette per the R3 review — the docblock previously described the
   INVERSE of what the CSS paints, which would have mis-ported to Figma):
     · curatio  — in-network, TEAL      (#0b6e63 on #e9f5f3, 5.5:1)
     · external — produced elsewhere, AMBER (#b45309 on #fef3d8, 4.55:1)
     · referral — ordered by the family doctor, LAVENDER (#3a3d8f on #eef0fb, 8.2:1)
   All three are in use; measured with a contrast checker, not estimated. */

import { M } from './strings.js'

const TONE = {
  curatio: 'mga-srctag--curatio',
  external: 'mga-srctag--external',
  referral: 'mga-srctag--referral',
}

export default function SourceTag({ src, clinic }) {
  if (!src || !TONE[src]) return null
  /* The clinic name rides INSIDE the tag for external records: „გარე" alone leaves
     the patient asking „from where?", and a separate text node would read as an
     unrelated field. */
  const label = src === 'external' && clinic ? `${M.src[src]} · ${clinic}` : M.src[src]
  /* `clinic` is null when the uploader left the field blank — the guard above is what
     keeps the chip from reading „გარე · გარე". */
  return <span className={'mga-srctag ' + TONE[src]}>{label}</span>
}
