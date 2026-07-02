/* Insured persons under the policy — policy owner + dependents (family members).
   The owner is pre-selected by default in the wizard's first step. */

export const insuredPersons = [
  { id: 'p1', name: 'მაგდა იაკობაშვილი', policyId: 'GPIH G3512', avatar: 45, relation: 'owner' },
  { id: 'p2', name: 'გიორგი გიორგაძე', policyId: 'GPIH G3512', avatar: 13, relation: 'spouse' },
  { id: 'p3', name: 'ირაკლი გიორგაძე', policyId: 'GPIH G3512', avatar: 33, relation: 'child' },
  { id: 'p4', name: 'ნატო ხატიაშვილი', policyId: 'GPIH G3512', avatar: 9, relation: 'child' },
]

export const defaultInsuredId = insuredPersons[0].id
