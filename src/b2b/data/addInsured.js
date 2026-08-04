/* Add-insured wizard — mock data + mock registry lookup.
   Mirrors the team prototype's product logic (B2B_BRIEF.md flow #2): packages,
   employee links, Revenue-Service lookup. All values illustrative. */

export const contract = {
  id: 'CNT-2026-0341',
  label: 'ჯანმრთელობა CORPO 2026',
  status: 'აქტიური',
}

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

/* Already-insured employees a family member can link to (search source).
   `pid` was added for the Excel importer: a spreadsheet links a family member
   to an employee by personal ID, and a row whose PID is already on this
   contract must be reported as "already insured" rather than re-added. */
export const existingEmployees = [
  { id: 'e1', name: 'გიორგი გვარიძე', pid: '01024001122' },
  { id: 'e2', name: 'ანა ქარიძე', pid: '01019004455' },
  { id: 'e3', name: 'დავით ბერიძე', pid: '01027007788' },
  { id: 'e4', name: 'თამარ კალანდაძე', pid: '01011002233' },
]

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
