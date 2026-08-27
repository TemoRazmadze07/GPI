/* Mock data for the MyGPI mobile health dashboard + Curatio pages — ENGLISH (en).
   Mirror of ./data.ka.js, which is the primary. Medication names are ILLUSTRATIVE
   placeholders — real prescription display rules come from GPI/Curatio.

   ⚠ KEY-FOR-KEY, ORDER-FOR-ORDER identical to data.ka.js. data.js re-exports by name,
   and the screens index into these records by field, so a missing constant is a crash
   and a renamed field is a blank cell. Keep the same order so a side-by-side diff of
   the two files stays readable — that is the only practical audit of a translation.

   Conventions (same as strings.en.js):
   - Georgian person, clinic and street names are TRANSLITERATED, never anglicised or
     replaced with English stand-ins: თამარ გიორგაძე → Tamar Giorgadze, not "Tamara".
     A reviewer comparing the two builds has to see the SAME family, same doctors.
   - Medical terms take real English terms (სისხლის საერთო → Complete blood count).
   - Dates render `D MMM` / `D MMM YYYY` using MONTHS below; times are 24-hour.

   ⚠ NAME MATCHING: records are joined to a person by FIRST NAME (`person: 'Tamar'`
   against V2_PERSONS' 'Tamar Giorgadze' — see personFirstName() in data.js). Rename a
   person here and every one of their records has to be renamed in the same commit, or
   they silently vanish from the person-scoped lists. */

export const en = {
  PERSONS: [
    { id: 'p1', name: 'Giorgi Giorgadze', short: 'Giorgi', ocin: 'OCIN 23213/22' },
    { id: 'p2', name: 'Elene Giorgadze', short: 'Elene', ocin: 'OCIN 23213/22' },
  ],

  BOOKING: {
    specialty: 'Cardiologist',
    doctor: 'Marika Dvalishvili',
    clinic: 'Curatio',
    date: '20 Sep',
    time: '11:30 - 12:00',
    timeShort: '11:30',
  },

  NEXT_BOOKING: { label: 'Family doctor', date: '29 Sep', time: '11:00' },

  CLINIC: {
    name: 'Curatio Clinic',
    address: 'Lortkipanidze St. 31 · 4th floor',
    cabinet: 'Room 208 · 4th floor',
  },

  REFERRAL: { person: 'Giorgi Giorgadze', number: 'EED 336 135 / 23' },

  CHRONIC: { med: 'Lisinopril 10 mg', daysLeft: 7 },

  DOCTOR: {
    initial: 'N',
    name: 'Nino Gigauri',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=96&h=96&fit=crop&crop=faces&auto=format&q=60',
    role: 'Family doctor · Curatio',
    online: true /* rendered only when ONLINE_STATUS_ENABLED (MVP2) */,
    nextVisit: '29 Sep · 11:00',
    /* Clinic naming follows the BOOKING FLOW ("Curatio Saburtalo"), not the
       stakeholder file's address style — the tested flow is the naming source. */
    clinic: 'Curatio Saburtalo',
    cabinet: 'Room 208 · 4th floor',
    workDays: 'Mon — Fri',
    workHours: '09:00 — 18:00',
  },

  /* The clinic-network name appended to a newly picked doctor's role line
     (setPickedDoctor in data.js). */
  NETWORK: 'Curatio',

  /* Short month names, newest-first sorting (dateRank in data.js). Order = Jan…Dec.
     ⚠ Every `date` string in this table must use these exact abbreviations, or the
     record sorts to the bottom. */
  MONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  /* Default date prefilled in the upload sheet's metadata step. */
  UPLOAD_DEFAULT_DATE: '18 Aug',

  /* ── V2 stakeholder-parity data. No relation labels by design — the system only
     knows policyholder (sorted first = default) vs members. ── */
  V2_PERSONS: [
    { id: 'tp', name: 'Tamar Giorgadze', initial: 'T', ocin: 'OCIN 00142897', holder: true, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
    { id: 'np', name: 'Nika Giorgadze', initial: 'N', ocin: 'OCIN 00142911', photo: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
    { id: 'ap', name: 'Ani Giorgadze', initial: 'A', ocin: 'OCIN 00142912', photo: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
  ],

  /* Today's visit per person — exists only in the visit-day demo mode. */
  V2_TODAY: {
    tp: { proc: 'Ultrasound', place: 'Lortkipanidze St. 31 · Room 312 · 4th floor', time: '10:30', queue: 'A042' },
    np: { proc: 'Paediatrician', place: 'Lortkipanidze St. 31 · Room 115 · 2nd floor', time: '12:30', queue: 'B017' },
  },

  /* History-row alert badge per person — counts are sensitive, shown only after OTP unlock. */
  V2_HISTORY_ALERT: { tp: '1 expiring', np: null, ap: null },

  /* Queue-picker bookings per person (F-01). `when: 'today'` entries are ACTIVATABLE
     only in visit-day mode; everything else stays locked until 09:00 of its own day. */
  V2_BOOKINGS: {
    tp: [
      { when: 'today', date: '28 Apr 2026', proc: 'Ultrasound', place: 'Curatio Cl. · Room 214 · 4th floor', time: '10:30' },
      { when: 'tomorrow', date: '29 Apr 2026', proc: 'Family doctor', place: 'N. Gigauri · Room 208 · 4th floor', time: '11:00' },
    ],
    np: [{ when: 'today', date: '28 Apr 2026', proc: 'Paediatrician', place: 'Curatio Cl. · Room 115 · 2nd floor', time: '12:30' }],
    ap: [],
  },

  NEXT_REMINDER: { text: 'Referral expires — in 7 days', tone: 'amber' },

  PREVENTION_NEXT: { text: 'Flu vaccine · Oct · free with your GPI policy' },

  /* A5 — history-transfer targets (F-03). The CURRENT personal doctor is
     deliberately excluded — transferring to yourself is meaningless. */
  TRANSFER_DOCTORS: [
    { id: 'd1', initial: 'G', name: 'Giorgi Mamuladze', spec: 'Cardiologist', clinic: 'Curatio Cl. — Lortkipanidze St. 31', avail: 'online' },
    { id: 'd2', initial: 'A', name: 'Ana Kobakhidze', spec: 'Endocrinologist', clinic: 'Curatio Cl. — Sheshelidze St. 6', avail: 'tomorrow' },
    { id: 'd3', initial: 'D', name: 'Davit Chkheidze', spec: 'Neurologist', clinic: 'Curatio Cl. — Sheshelidze St. 6', avail: 'online' },
  ],

  /* ── A7 — prevention screen dataset. status drives the row action: due/missed →
     booking CTA (dead until F-04), done → badge. tones: red = missed, amber = due. ── */
  V2_PREVENTION: {
    reminder: {
      title: 'Reminder — ultrasound',
      body: 'Repeat in 3 months (Jun 2026) — ordered by G. Gigauri, 14 Mar',
    },
    vaccines: [
      { id: 'flu', icon: 'syringe', tile: 'lav', name: 'Flu vaccine', meta: 'Seasonal vaccination · Oct 2026', extra: 'Covered by your GPI policy · free', status: 'due' },
      { id: 'covid', icon: 'check', tile: 'green', name: 'COVID-19 booster', meta: '2025 — Curatio Clinic', status: 'done' },
    ],
    screenings: [
      { id: 'breast', icon: 'microscope', tile: 'pink', name: 'Breast screening', meta: 'State programme · every 2 years · 40+', note: '2024 — missed', tone: 'red', status: 'due' },
      { id: 'annual', icon: 'stethoscope', tile: 'teal', name: 'Annual preventive check-up', meta: 'Blood count + ECG + urine · Mar 2026', status: 'done' },
      { id: 'vision', icon: 'eye', tile: 'amber', name: 'Vision screening', meta: 'Glaucoma screening · every 2 years', note: '2025 — due soon', tone: 'amber', status: 'due' },
    ],
  },

  V2_ANALYSIS_CATS: [
    { id: 'all', label: 'All' },
    { id: 'blood', label: 'Blood' },
    { id: 'bio', label: 'Biochemistry' },
    { id: 'thyroid', label: 'Thyroid' },
    { id: 'lipid', label: 'Lipids' },
    { id: 'imaging', label: 'Imaging' },
  ],

  /* ── A6 — V2 history dataset (stakeholder parity minus charts; F-02/F-03). ── */
  V2_HISTORY: {
    /* `src` is the ORIGIN ENUM behind SourceTag (curatio | external | referral), not a
       display string. An externally-uploaded row carries NO clinical status: GPI cannot
       read an external result (OCR is MVP2). `shared` = the per-upload consent. */
    analyses: [
      { title: 'Complete blood count', cat: 'blood', date: '22 Apr', src: 'curatio', person: 'Tamar', status: 'norm' },
      /* HIDDEN 2026-08-26 at the user's request, mirroring data.ka.js — this abnormal
         result was a distraction during stakeholder demos. DEMO DATA ONLY.
         ⚠️ It is the ONLY analyses record exercising `status:'warn'`, `note` and
         `book:true`. Restore BOTH locales together or the two builds diverge.
      { title: 'Biochemistry', cat: 'bio', date: '14 Apr', src: 'curatio', person: 'Tamar', status: 'warn', note: 'ALT/AST elevated — a doctor’s consultation is needed', book: true },
      */
      { title: 'Thyroid (TSH)', cat: 'thyroid', date: '3 Apr', src: 'curatio', person: 'Tamar', status: 'norm' },
      { title: 'Lipid panel', cat: 'lipid', date: '15 Feb', src: 'external', clinic: 'BMSC Clinic', person: 'Tamar', shared: true },
      { title: 'Complete blood count', cat: 'blood', date: '2 Mar', src: 'curatio', person: 'Nika', status: 'norm' },
      /* Re-homed from the deleted documents tab (#13) — they were always analyses and
         studies, filed in a drawer only because uploads had nowhere else to go. */
      { title: 'Biochemistry', cat: 'bio', date: '14 Apr', src: 'external', clinic: 'BMSC Clinic', person: 'Tamar', shared: true },
      { title: 'MRI — brain', cat: 'imaging', date: '2 Mar', src: 'external', clinic: 'EMC', person: 'Tamar', shared: false },
    ],
    /* D3 is Nika's deliberately — switching member on prescriptions then SHOWS a
       different record instead of emptying the page, which is what proves the scope
       works in a demo. */
    meds: [
      { name: 'Vitamin D3 2000 IU', how: '1 capsule a day · until 15 June', by: 'N. Gigauri', src: 'curatio', person: 'Nika', state: 'active' },
      { name: 'Metformin 500mg', how: '2 tablets a day', by: 'N. Gigauri', src: 'curatio', person: 'Tamar', expiry: 'Expires: 30 Apr · in 6 days', state: 'expiring' },
      { name: 'Atorvastatin 20mg', how: '1 tablet in the evening · until 1 September', by: 'G. Mamuladze', src: 'external', clinic: 'EMC', person: 'Tamar', state: 'chronic' },
    ],
    studies: [
      {
        src: 'referral',
        title: 'Ultrasound — abdomen',
        person: 'Tamar',
        meta: 'Ordered by N. Gigauri · 14 Mar',
        prep: 'Preparation: 4–6 h fasting, full bladder',
        repeat: 'Repeat in 3 months · Jun 2026',
      },
    ],
    /* #9 — referrals come FROM the family doctor: that is their origin, and SourceTag
       renders it with the same enum the analyses and the card use. */
    referrals: [
      { title: 'Laboratory — biochemistry', number: 'EED 336 135 / 23', expiry: 'Expires: 14 Jul 2026', prep: 'Preparation: 8–12 h fasting, water only', src: 'referral', person: 'Tamar', status: 'booked' },
      { title: 'Cardiologist consultation', number: 'EED 336 218 / 23', expiry: 'Expires: 8 Jul 2026', src: 'referral', person: 'Tamar', status: 'waiting' },
    ],
    /* #10 — the card holds every ENCOUNTER, not only in-clinic visits. `type` drives
       an icon + LABEL (never the icon alone). */
    visits: [
      { title: 'Family doctor', type: 'visit', person: 'Tamar', date: '18 Apr 2026', by: 'N. Gigauri', clinic: 'Curatio Saburtalo', src: 'curatio', summary: 'Biochemistry — attention · Metformin referral renewed', year: '2026' },
      { title: 'Family doctor', type: 'phone', person: 'Tamar', date: '2 Apr 2026', by: 'N. Gigauri', clinic: 'Curatio', src: 'curatio', summary: 'Reviewed test results · dose unchanged', year: '2026' },
      { title: 'Paediatrician', type: 'visit', person: 'Nika', date: '2 Mar 2026', by: 'T. Beridze', clinic: 'Curatio Vake', src: 'curatio', summary: 'Routine check-up — normal', year: '2026' },
      { title: 'Dermatologist', type: 'online', person: 'Tamar', date: '20 Jan 2026', by: 'L. Chikovani', clinic: 'Curatio', src: 'curatio', summary: 'Skin rash — topical treatment', year: '2026' },
      { title: 'Cardiologist', type: 'visit', person: 'Tamar', date: '14 Dec 2025', by: 'G. Mamuladze', clinic: 'EMC', src: 'external', summary: 'ECG normal · Atorvastatin continued', year: '2025' },
    ],
  },

  /* Medical history rows per tab (V1, frozen archive). status: norm | warn | crit | uploaded */
  HISTORY: {
    analyses: [
      { title: 'Complete blood count', date: '22 Apr', src: 'Curatio', person: 'Giorgi', status: 'norm' },
      { title: 'Biochemistry', date: '18 Apr', src: 'Curatio', person: 'Giorgi', status: 'warn' },
      { title: 'Thyroid gland (TSH)', date: '02 Mar', src: 'Curatio', person: 'Elene', status: 'norm' },
      { title: 'Lipid panel', date: '15 Feb', src: 'Another clinic', person: 'Giorgi', status: 'uploaded' },
    ],
    prescriptions: [
      { title: 'Lisinopril 10 mg', date: '01 Apr', src: 'N. Gigauri', person: 'Giorgi', status: 'warn', note: 'Chronic · expires in 7 days' },
      { title: 'Vitamin D 2000 IU', date: '18 Apr', src: 'N. Gigauri', person: 'Elene', status: 'norm' },
    ],
    visits: [
      { title: 'Cardiologist · Marika Dvalishvili', date: '20 Sep', src: 'Curatio', person: 'Giorgi', status: 'norm' },
      { title: 'Family doctor · Nino Gigauri', date: '03 Apr', src: 'Curatio', person: 'Giorgi', status: 'norm' },
      { title: 'Endocrinologist · Ana Kobakhidze', date: '12 Mar', src: 'Curatio', person: 'Elene', status: 'norm' },
    ],
    docs: [
      { title: 'Form 100', date: '22 Apr', src: 'Curatio', person: 'Giorgi', status: 'norm' },
      { title: 'Lipid panel (PDF)', date: '15 Feb', src: 'Another clinic', person: 'Giorgi', status: 'uploaded' },
    ],
  },

  /* ── #1 — personal-doctor selection. The docselect screen REUSES the booking flow's
     page-1 doctor list opened in "select personal doctor" mode — FAMILY DOCTORS only.
     Nino Gigauri IS listed here (unlike TRANSFER_DOCTORS): with no doctor assigned
     there is no "current" to exclude. langs = the flow's Geo/Eng/Rus card chips.
     Photos are Unsplash stand-ins — production uses real Curatio doctor photos. */
  DOCSEL_CITIES: [
    { id: 'tbilisi', label: 'Tbilisi' },
    { id: 'batumi', label: 'Batumi' },
  ],
  DOCSEL_CLINICS: [
    { id: 'all', label: 'All clinics' },
    { id: 'sab', label: 'Curatio Saburtalo' },
    { id: 'vake', label: 'Curatio Vake' },
    { id: 'bat', label: 'Curatio Batumi' },
  ],
  SELECT_DOCTORS: [
    { id: 's1', initial: 'N', name: 'Nino Gigauri', spec: 'Family doctor', city: 'tbilisi', clinicId: 'sab', clinic: 'Curatio Saburtalo', exp: 12, hours: 'Mon — Fri · 09:00—18:00', langs: ['Geo', 'Eng'], photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
    { id: 's2', initial: 'G', name: 'Giorgi Kapanadze', spec: 'Family doctor', city: 'tbilisi', clinicId: 'vake', clinic: 'Curatio Vake', exp: 8, hours: 'Mon — Sat · 10:00—17:00', langs: ['Geo', 'Rus'], photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
    { id: 's3', initial: 'T', name: 'Tamar Beridze', spec: 'Family doctor', city: 'tbilisi', clinicId: 'sab', clinic: 'Curatio Saburtalo', exp: 21, hours: 'Mon — Fri · 14:00—20:00', langs: ['Geo', 'Eng', 'Rus'], photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
    { id: 's4', initial: 'L', name: 'Levan Tsiklauri', spec: 'Family doctor', city: 'batumi', clinicId: 'bat', clinic: 'Curatio Batumi', exp: 5, hours: 'Mon — Fri · 09:00—15:00', langs: ['Geo'], photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
  ],
}
