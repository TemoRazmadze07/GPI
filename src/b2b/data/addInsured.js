/* Add-insured wizard — mock data + mock registry lookup.
   Mirrors the team prototype's product logic (B2B_BRIEF.md flow #2): packages,
   employee links, Revenue-Service lookup. All values illustrative. */

/* Contracts this wizard can add people to (concept locked 2026-08-06): the
   company's ACTIVE health contracts — the wizard is health-shaped (packages,
   family links, registry lookup), so other products are not eligible targets.
   First entry = the default; the selector at the top of the wizard switches
   between them (with confirm + re-validation when data already exists).
   Both ids exist in data/contracts.js — keep the two files reconciled. */
export const eligibleContracts = [
  { id: 'CNT-2026-0341', label: 'ჯანმრთელობა CORPO 2026', status: 'აქტიური', insured: 4, product: 'health' },
  { id: 'CNT-2025-0128', label: 'ჯანმრთელობა CORPO 2025', status: 'აქტიური', insured: 248, product: 'health' },
]

export const defaultContract = eligibleContracts[0]
export const contractById = (id) => eligibleContracts.find((c) => c.id === id) || defaultContract

/* Legacy alias — pre-selector code imported a single `contract`. */
export const contract = defaultContract

/* Insurance card packages; monthly premium is "system-derived" (read-only). */
export const packages = [
  { value: 'basic', label: 'ბაზისი', premium: 86 },
  { value: 'optimal', label: 'ოპტიმალი', premium: 124.5 },
  { value: 'premium', label: 'პრემიუმი', premium: 168 },
]

export const packageByValue = (v) => packages.find((p) => p.value === v)

export const relations = [
  { value: 'spouse', label: 'მეუღლე' },
  { value: 'child', label: 'შვილი' },
  { value: 'parent', label: 'მშობელი' },
  { value: 'other', label: 'სხვა' },
]

export const relationByValue = (v) => relations.find((r) => r.value === v)

/* Already-insured employees a family member can link to (search source),
   PER CONTRACT — the "already insured" check and the link-to-existing lookup
   are contract-scoped, which is what makes switching contracts genuinely
   re-validate an uploaded file. `pid` was added for the Excel importer: a
   spreadsheet links a family member to an employee by personal ID, and a row
   whose PID is already on the SELECTED contract must be reported as "already
   insured" rather than re-added. NB გიორგი გვარიძე (01024001122) is on 0341
   only — the demo errors file flags him there, but he validates clean on 0128,
   so the switch visibly changes the results. */
const EMPLOYEES_BY_CONTRACT = {
  'CNT-2026-0341': [
    { id: 'e1', name: 'გიორგი გვარიძე', pid: '01024001122' },
    { id: 'e2', name: 'ანა ქარიძე', pid: '01019004455' },
    { id: 'e3', name: 'დავით ბერიძე', pid: '01027007788' },
    { id: 'e4', name: 'თამარ კალანდაძე', pid: '01011002233' },
  ],
  'CNT-2025-0128': [
    { id: 'e2', name: 'ანა ქარიძე', pid: '01019004455' },
    { id: 'e3', name: 'დავით ბერიძე', pid: '01027007788' },
    { id: 'e5', name: 'ნინო ლომიძე', pid: '01015006677' },
  ],
}

export const existingEmployeesFor = (contractId) =>
  EMPLOYEES_BY_CONTRACT[contractId] || EMPLOYEES_BY_CONTRACT[defaultContract.id]

export const employeeByPidFor = (contractId) => {
  const list = existingEmployeesFor(contractId)
  return (pid) => list.find((e) => e.pid === pid)
}

/* Legacy aliases — default-contract views, kept so untouched callers behave
   exactly as before the selector existed. */
export const existingEmployees = EMPLOYEES_BY_CONTRACT[defaultContract.id]
export const employeeByPid = (pid) => existingEmployees.find((e) => e.pid === pid)

/* The single source of truth for a person record in this wizard. The Excel
   importer builds its rows on exactly these keys so an imported person and a
   hand-typed one are the same shape — see data/insuredImport.js `toPerson`. */
export const emptyDraft = () => ({
  who: 'employee',
  citizen: 'resident',
  pid: '',
  birth: '',
  firstName: '',
  lastName: '',
  gender: '',
  linkedTo: '',
  relation: '',
  mobile: '',
  email: '',
  address: '',
  pkg: '',
})

/* Mock Revenue-Service lookup: 11-digit ID + birth date → person or null.
   Deterministic: hash of the ID picks a sample; ID 11111111111 = not found
   (same test trigger as the My-Cabinet add-insured modal). */
const SAMPLES = [
  { firstName: 'ლევან', lastName: 'გვარიძე', gender: 'male' },
  { firstName: 'ნინო', lastName: 'კაპანაძე', gender: 'female' },
  { firstName: 'დავით', lastName: 'მაისურაძე', gender: 'male' },
  { firstName: 'თამარ', lastName: 'ბერიძე', gender: 'female' },
]

export function registryLookup(personalId, birthDate) {
  if (!/^\d{11}$/.test(personalId) || !birthDate) return null
  if (personalId === '11111111111') return null
  let h = 0
  for (const ch of personalId) h = (h * 31 + ch.charCodeAt(0)) % 997
  return SAMPLES[h % SAMPLES.length]
}
