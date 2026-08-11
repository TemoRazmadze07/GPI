/* Foreign Student Insurance — demo data for the purchase flow.

   Values mirror the source mockup (foreign_student_insurance_mockup_2.html) so
   the rebuilt screen loads showing the same person and the same defaults.

   ⚠️ ALL PLACEHOLDER — pending real product data from GPI:
   · plan limits / deductibles / premiums are the mockup's numbers, not a rate card
   · the university list is a sample of Georgian HEIs, not GPI's partner list
   · the country list is a common-origin subset, not the full ISO list
   Do not treat any of it as authoritative. */

export const PLANS = [
  { id: 'A', name: 'Basic', limit: '30,000 ₾', deductible: '100 ₾', price6: 90, price12: 160 },
  { id: 'B', name: 'Standard', limit: '50,000 ₾', deductible: '50 ₾', price6: 120, price12: 210 },
  { id: 'C', name: 'Extended', limit: '100,000 ₾', deductible: '50 ₾', price6: 160, price12: 285, popular: true },
  { id: 'D', name: 'Premium', limit: '250,000 ₾', deductible: '0 ₾', price6: 220, price12: 390 },
]

// Pre-filled with the mockup's demo student so step 1 renders identically on load.
export const defaultInsured = {
  firstName: 'Maria',
  lastName: 'Kowalski',
  dob: '14 Mar 2003',
  personalNumber: 'PL8842190',
  citizenship: 'pl',
  address: '12 Rustaveli Ave, Tbilisi',
  phone: '+995 599 45 67 89',
  email: 'm.kowalski@example.com',
  university: 'tsu',
}

export const COUNTRIES = [
  { value: 'az', label: 'Azerbaijan' },
  { value: 'bd', label: 'Bangladesh' },
  { value: 'cn', label: 'China' },
  { value: 'eg', label: 'Egypt' },
  { value: 'de', label: 'Germany' },
  { value: 'in', label: 'India' },
  { value: 'ir', label: 'Iran' },
  { value: 'iq', label: 'Iraq' },
  { value: 'il', label: 'Israel' },
  { value: 'jo', label: 'Jordan' },
  { value: 'ng', label: 'Nigeria' },
  { value: 'pk', label: 'Pakistan' },
  { value: 'pl', label: 'Poland' },
  { value: 'ru', label: 'Russia' },
  { value: 'lk', label: 'Sri Lanka' },
  { value: 'tr', label: 'Türkiye' },
  { value: 'ua', label: 'Ukraine' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'uz', label: 'Uzbekistan' },
]

export const UNIVERSITIES = [
  { value: 'tsu', label: 'Ivane Javakhishvili Tbilisi State University' },
  { value: 'gtu', label: 'Georgian Technical University' },
  { value: 'tsmu', label: 'Tbilisi State Medical University' },
  { value: 'iliauni', label: 'Ilia State University' },
  { value: 'cu', label: 'Caucasus University' },
  { value: 'ug', label: 'The University of Georgia' },
  { value: 'freeuni', label: 'Free University of Tbilisi' },
  { value: 'nvu', label: 'New Vision University' },
  { value: 'dtmu', label: 'David Tvildiani Medical University' },
  { value: 'gau', label: 'Georgian American University' },
  { value: 'eu', label: 'European University' },
  { value: 'kiu', label: 'Kutaisi International University' },
  { value: 'bsu', label: 'Batumi Shota Rustaveli State University' },
  { value: 'atsu', label: 'Akaki Tsereteli State University' },
]

export const labelOf = (options, value) => options.find((o) => o.value === value)?.label || ''
