/* ENGLISH LABEL OVERLAY for the booking mock data.

   booking.js stays the single source of truth for STRUCTURE, IDs and the
   deterministic availability engine. This file supplies English display labels
   keyed BY THE SAME IDs, which booking.js merges in when the active language
   is English. Nothing here is logic — labels only.

   Conventions (locked, see the project glossary):
   - Sentence case everywhere; no Title Case, no ALL CAPS.
   - International/British English, with simplified medical specialty spellings
     (Gynecologist, not Gynaecologist).
   - Person names transliterated with standard Georgian romanization; never
     prefixed with "Dr".
   - Addresses: "<number> <Street> <St|Ave>, Tbilisi" — city LAST, no "#".
   - Dates: D MMM / D MMM YYYY; weekdays Monday-first, 3 letters. */

/* ---- Cities -------------------------------------------------------------- */
export const cityLabels = {
  tbilisi: 'Tbilisi',
  batumi: 'Batumi',
  kutaisi: 'Kutaisi',
}

/* ---- Specialist directions (medical specialties) ------------------------- */
export const specialtyLabels = {
  ophthalmology: 'Ophthalmologist',
  gynecology: 'Gynecologist',
  dermatology: 'Dermatologist',
  cardiology: 'Cardiologist',
  neurology: 'Neurologist',
}

/* ---- Diagnostic test directions ------------------------------------------
   Short forms are mandatory: these render in a SELECT and as chips at 320px.
   The Georgian parenthetical is the common abbreviation, which in English IS
   the everyday name (ECG, MRI, X-ray), so the parenthetical collapses away. */
export const studyLabels = {
  ultrasound: 'Ultrasound',
  ecg: 'ECG',
  xray: 'X-ray',
  mri: 'MRI',
}

/* ---- Clinics -------------------------------------------------------------
   `short` is used in narrow mobile chips — district name only. */
export const clinicLabels = {
  saburtalo: { label: 'Curatio Saburtalo', short: 'Saburtalo', address: '31 O. Lortkipanidze St, Tbilisi' },
  vake: { label: 'Curatio Vake', short: 'Vake', address: '37 Chavchavadze Ave, Tbilisi' },
  gldani: { label: 'Curatio Gldani', short: 'Gldani', address: '7 Khizanishvili St, Tbilisi' },
  isani: { label: 'Curatio Isani', short: 'Isani', address: '52 Ketevan Tsamebuli Ave, Tbilisi' },
  didube: { label: 'Curatio Didube', short: 'Didube', address: '116 Tsereteli Ave, Tbilisi' },
  varketili: { label: 'Curatio Varketili', short: 'Varketili', address: '21 Javakheti St, Tbilisi' },
  mukhiani: { label: 'Curatio Mukhiani', short: 'Mukhiani', address: '4 Mukhiani IVa Microdistrict, Tbilisi' },
  ortachala: { label: 'Curatio Ortachala', short: 'Ortachala', address: '93 Gorgasali St, Tbilisi' },
}

/* ---- Doctors (32 ids: d1–d32, listed here in booking.js source order) -----
   `role` is the slim doctor-row label — keep it short.
   `bio` is the sentence or two in the doctor detail popover/modal. */
export const doctorLabels = {
  /* personal — main two clinics */
  d1: {
    name: 'Nino Ninoshvili',
    role: 'Family doctor',
    bio: 'Family doctor, Tbilisi State Medical University. Preventive medicine and chronic disease management.',
  },
  d2: {
    name: 'Mariam Nozadze',
    role: 'Family doctor',
    bio: 'Family doctor. Routine check-ups and vaccinations.',
  },
  d3: {
    name: 'Ana Beridze',
    role: 'Family doctor',
    bio: 'Family doctor with 15 years of experience. Internal medicine.',
  },
  d4: {
    name: 'Giorgi Tatishvili',
    role: 'Family doctor',
    bio: 'Family doctor. Completed a residency in Germany.',
  },
  d5: {
    name: 'Davit Kapanadze',
    role: 'Family doctor',
    bio: 'Family doctor. Early-career specialist.',
  },

  /* personal — additional clinics (first-time browse only) */
  d27: {
    name: 'Lali Orbeladze',
    role: 'Family doctor',
    bio: 'Family doctor. Prevention and chronic disease management.',
  },
  d28: {
    name: 'Zaal Mghebrishvili',
    role: 'Family doctor',
    bio: 'Family doctor, internal medicine.',
  },
  d29: {
    name: 'Eter Tskitishvili',
    role: 'Family doctor',
    bio: 'Family doctor. Routine check-ups.',
  },
  d30: {
    name: 'Beka Shonia',
    role: 'Family doctor',
    bio: 'Family doctor. Chronic disease management.',
  },
  d31: {
    name: 'Ia Meladze',
    role: 'Family doctor',
    bio: 'Family doctor with 15 years of experience.',
  },
  d32: {
    name: 'Vasil Japaridze',
    role: 'Family doctor',
    bio: 'Family doctor. Prevention and vaccinations.',
  },

  /* specialists */
  d6: {
    name: 'Tamar Kiknadze',
    role: 'Gynecologist',
    bio: 'Gynecologist. Ultrasound diagnostics.',
  },
  d7: {
    name: 'Levan Chkheidze',
    role: 'Dermatologist',
    bio: 'Dermatologist. Skin conditions.',
  },
  d8: {
    name: 'Nana Gelashvili',
    role: 'Ophthalmologist',
    bio: 'Ophthalmologist. Vision correction.',
  },
  d9: {
    name: 'Zurab Maisuradze',
    role: 'Cardiologist',
    bio: 'Cardiologist. Heart and vascular health.',
  },

  /* diagnostic tests */
  d10: {
    name: 'Maka Pkhaladze',
    role: 'Ultrasound diagnostics',
    bio: 'Ultrasound diagnostics — abdomen and thyroid.',
  },
  d14: {
    name: 'Lasha Gogichaishvili',
    role: 'Ultrasound diagnostics',
    bio: 'Ultrasound diagnostics.',
  },
  d11: {
    name: 'Tamta Beraia',
    role: 'Functional diagnostics',
    bio: 'Functional diagnostics — ECG and Holter monitoring.',
  },
  d12: {
    name: 'Vazha Kiknadze',
    role: 'Radiologist',
    bio: 'Radiologist — X-ray imaging.',
  },
  d13: {
    name: 'Giorgi Chikovani',
    role: 'Radiologist',
    bio: 'Radiologist — magnetic resonance imaging.',
  },

  /* additional specialists (2–3 per specialty) */
  d15: {
    name: 'Tea Bakradze',
    role: 'Ophthalmologist',
    bio: 'Ophthalmologist. Vision care for children and adults.',
  },
  d16: {
    name: 'Vakhtang Kvirikashvili',
    role: 'Ophthalmologist',
    bio: 'Ophthalmic surgeon. Cataract treatment.',
  },
  d17: {
    name: 'Eka Chkhartishvili',
    role: 'Gynecologist',
    bio: 'Gynecologist. Pregnancy care.',
  },
  d18: {
    name: 'Salome Gogua',
    role: 'Dermatologist',
    bio: 'Dermatologist and venereologist. Aesthetic dermatology.',
  },
  d19: {
    name: 'Irakli Beridze',
    role: 'Cardiologist',
    bio: 'Cardiologist. Treatment of arrhythmias.',
  },
  d20: {
    name: 'Maia Tsiklauri',
    role: 'Cardiologist',
    bio: 'Cardiologist. High blood pressure.',
  },
  d21: {
    name: 'Gela Kavtaradze',
    role: 'Neurologist',
    bio: 'Neurologist. Headache and migraine management.',
  },
  d22: {
    name: 'Natia Janelidze',
    role: 'Neurologist',
    bio: 'Neurologist. Cerebrovascular conditions.',
  },

  /* additional diagnostic-test services (2–3 per test type) */
  d23: {
    name: 'Ketevan Pirtskhalava',
    role: 'Ultrasound diagnostics',
    bio: 'Ultrasound diagnostics — echocardiography.',
  },
  d24: {
    name: 'Zaza Lomidze',
    role: 'Functional diagnostics',
    bio: 'Functional diagnostics — Holter monitoring.',
  },
  d25: {
    name: 'Nino Kharadze',
    role: 'Radiologist',
    bio: 'Radiologist — X-rays of the limbs.',
  },
  d26: {
    name: 'Ana Tsereteli',
    role: 'Radiologist',
    bio: 'Radiologist — MRI of the spine.',
  },
}

/* ---- Spoken languages -----------------------------------------------------
   Full names only. The SHORT row tags (Geo/Eng/Rus/Deu) stay byte-identical in
   the EN build — see booking.js `langTag` — so doctor-row widths never shift. */
export const langLabels = { KA: 'Georgian', EN: 'English', RU: 'Russian', DE: 'German' }

/* ---- Calendar -------------------------------------------------------------
   MONTHS: 3 letters, no full stop, "Sep" (never "Sept") so no month is wider
   than the rest. MONTHS_FULL: calendar header only.
   WEEKDAYS: MONDAY-FIRST — the grid computes its offset as (getDay()+6)%7. */
export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
