/* Insured persons under the policy — policy owner + dependents (family members).
   The owner is pre-selected by default in the wizard's first step. */

export const insuredPersons = [
  { id: 'p1', name: 'მაგდა იაკობაშვილი', policyId: 'GPIH G3512', avatar: 45, relation: 'owner' },
  { id: 'p2', name: 'გიორგი გიორგაძე', policyId: 'GPIH G3512', avatar: 13, relation: 'spouse' },
  { id: 'p3', name: 'ირაკლი გიორგაძე', policyId: 'GPIH G3512', avatar: 33, relation: 'child' },
  { id: 'p4', name: 'ნატო ხატიაშვილი', policyId: 'GPIH G3512', avatar: 9, relation: 'child' },
]

export const defaultInsuredId = insuredPersons[0].id

/* ---- Mock backend lookup (prototype only) --------------------------------
   Stands in for GPI's real identity check. The personal-data method requires
   BOTH the 11-digit personal number AND the birth date; the policy method
   resolves by policy number. Returns { person } on success or { error } with a
   key that maps to ka.wizard.addInsured.errors. Test triggers for usability
   sessions: personal ID `11111111111` → not found; a policy ending in `0000`
   → policy not found. Any other plausible input resolves to a sample person. */
const SAMPLE = [
  { name: 'გიორგი ბერიძე', avatar: 52 },
  { name: 'ნინო კაპანაძე', avatar: 31 },
  { name: 'დავით მაისურაძე', avatar: 68 },
]
const digitSum = (s) => s.split('').reduce((n, d) => n + (+d || 0), 0)
const mask = (digits) => digits.slice(0, 7) + '••••'

export function lookupByPersonalId(personalId, birthDate) {
  const digits = (personalId || '').replace(/\D/g, '')
  if (digits.length !== 11) return { error: 'invalidId' }
  if (!(birthDate || '').trim()) return { error: 'invalidDate' }
  if (digits === '11111111111') return { error: 'notFound' }
  const s = SAMPLE[digitSum(digits) % SAMPLE.length]
  return {
    person: {
      id: 'ins-' + digits.slice(-4),
      name: s.name, avatar: s.avatar, policyId: 'GPIH G3512',
      relation: 'family', metaId: 'პ/ნ ' + mask(digits),
    },
  }
}

export function lookupByPolicy(policyNumber) {
  const v = (policyNumber || '').trim()
  if (!v) return { error: 'invalidPolicy' }
  if (/0000$/.test(v)) return { error: 'policyNotFound' }
  const s = SAMPLE[v.length % SAMPLE.length]
  return {
    person: {
      id: 'ins-' + v.replace(/\s/g, '').slice(-4),
      name: s.name, avatar: s.avatar, policyId: v.toUpperCase(),
      relation: 'family', metaId: 'პოლისი ' + v.toUpperCase(),
    },
  }
}
