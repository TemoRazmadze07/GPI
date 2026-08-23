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

   Anatomy (user, 2026-08-20): rounded PILL with a leading icon, on its OWN LINE
   under the meta row — no longer a rounded-rect right-slotted inline (supersedes
   audit D1's stable-right-slot and the r6 shape-axis note). With shape shared
   across all pills, ORIGIN is now marked by icon + placement instead.

   Size (user, 2026-08-20): the CLINIC-CHIP tier — 12px label, 24px pill, 16px icon —
   one step up from the h18 meta pills so origin reads at a glance.

   Variants (user, 2026-08-20 — GPI pink for in-network, gray for external):
     · curatio  — in-network, GPI PINK (#c01b60 on #fde7f1, 5.01:1) · building icon
     · external — produced elsewhere, GRAY (#5b6078 on #eef0f4, 5.43:1) · building icon
     · referral — ordered by the family doctor, LAVENDER (#3a3d8f on #eef0fb, 8.24:1) · stethoscope
   Both non-token fgs are a step darker than their family token, which fails AA on
   the tint (--mga-pink-fg 4.16:1, --mga-muted-fg 4.28:1). All measured, not estimated. */

import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'

const TONE = {
  curatio: 'mga-srctag--curatio',
  external: 'mga-srctag--external',
  referral: 'mga-srctag--referral',
}

/* Clinics get the building; the referral origin is the doctor's order, not a place. */
const GLYPH = { curatio: 'building-2', external: 'building-2', referral: 'stethoscope' }

export default function SourceTag({ src, clinic }) {
  if (!src || !TONE[src]) return null
  /* The clinic name rides INSIDE the tag for external records: „გარე" alone leaves
     the patient asking „from where?", and a separate text node would read as an
     unrelated field. */
  const label = src === 'external' && clinic ? `${M.src[src]} · ${clinic}` : M.src[src]
  /* `clinic` is null when the uploader left the field blank — the guard above is what
     keeps the chip from reading „გარე · გარე". */
  return (
    <span className={'mga-srctag ' + TONE[src]}>
      <Icon name={GLYPH[src]} size={16} />
      {label}
    </span>
  )
}
