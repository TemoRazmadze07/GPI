/* Mock data for the MyGPI mobile health dashboard + Curatio pages. Names/numbers
   mirror the user's shared Home design. Medication names are ILLUSTRATIVE
   placeholders — real prescription display rules come from GPI/Curatio. */

export const PERSONS = [
  { id: 'p1', name: 'Giorgi Giorgadze', short: 'გიორგი', ocin: 'OCIN 23213/22' },
  { id: 'p2', name: 'Elene Giorgadze', short: 'ელენე', ocin: 'OCIN 23213/22' },
]

export const BOOKING = {
  specialty: 'კარდიოლოგი',
  doctor: 'მარიკა დვალიშვილი',
  clinic: 'კურაციო',
  date: '20 სექ',
  time: '11:30 - 12:00',
  timeShort: '11:30',
}

export const NEXT_BOOKING = { label: 'ოჯახის ექიმი', date: '29 სექ', time: '11:00' }

export const QUEUE = { number: 'A042', waitMin: 12, ahead: 3 }

export const CLINIC = {
  name: 'კლინიკა კურაციო',
  address: 'ლორთქიფანიძის 31 · IV სართ.',
  cabinet: 'კაბ. 208 · IV სართ.',
}

export const REFERRAL = { person: 'გიორგი გიორგაძე', number: 'EED 336 135 / 23' }

export const CHRONIC = { med: 'ლიზინოპრილი 10 მგ', daysLeft: 7 }

export const COUNTS = { bookings: 8, referrals: 5, reminders: 1 }

export const DOCTOR = {
  initial: 'ნ',
  name: 'ნინო გიგაური',
  role: 'ოჯახის ექიმი · კურაციო',
  online: true,
  nextVisit: '29 სექ · 11:00',
  /* A4 doctor-detail additions (F-03 card fields). */
  clinic: 'კლ. კურაციო',
  cabinet: 'კაბ. 208 · IV სართ.',
  workDays: 'ორ — პარ',
  workHours: '09:00 — 18:00',
}

/* Curatio hub — history counts per person scope. */
export const HISTORY_COUNTS = {
  all: { analyses: 12, prescriptions: 4, visits: 9, docs: 3 },
  p1: { analyses: 8, prescriptions: 3, visits: 6, docs: 2 },
  p2: { analyses: 4, prescriptions: 1, visits: 3, docs: 1 },
}

/* ── V2 stakeholder-parity data (source of truth: reference/mygpi_v3_stakeholder_
   prototype.html). V1 data above stays untouched. No relation labels by design —
   the system only knows policyholder (sorted first = default) vs members. ── */
export const V2_PERSONS = [
  { id: 'tp', name: 'თამარ გიორგაძე', initial: 'თ', ocin: 'OCIN 00142897', holder: true },
  { id: 'np', name: 'ნიკა გიორგაძე', initial: 'ნ', ocin: 'OCIN 00142911' },
  { id: 'ap', name: 'ანი გიორგაძე', initial: 'ა', ocin: 'OCIN 00142912' },
]

/* Today's visit per person — exists only in the visit-day demo mode. */
export const V2_TODAY = {
  tp: { proc: 'ექოსკოპია', place: 'ლორთქიფანიძის 31 · კაბ. XXX · IV სართ.', time: '10:30', queue: 'A042' },
  np: { proc: 'პედიატრი', place: 'ლორთქიფანიძის 31 · კაბ. 115 · II სართ.', time: '12:30', queue: 'B017' },
}

/* History-row alert badge per person — counts are sensitive, shown only after OTP unlock. */
export const V2_HISTORY_ALERT = { tp: '1 ვადა', np: null, ap: null }

/* Queue-picker bookings per person (F-01: today / tomorrow / near future).
   `when: 'today'` entries are ACTIVATABLE only in visit-day mode; everything
   else stays locked until 09:00 of its own visit day. */
export const V2_BOOKINGS = {
  tp: [
    { when: 'today', date: '28 აპრ 2026', proc: 'ექოსკოპია', place: 'კლ. კურაციო · კაბ. XXX · IV სართ.', time: '10:30' },
    { when: 'tomorrow', date: '29 აპრ 2026', proc: 'ოჯახის ექიმი', place: 'ნ. გიგაური · კაბ. 208 · IV სართ.', time: '11:00' },
  ],
  np: [{ when: 'today', date: '28 აპრ 2026', proc: 'პედიატრი', place: 'კლ. კურაციო · კაბ. 115 · II სართ.', time: '12:30' }],
  ap: [],
}

export const NEXT_REMINDER = { text: 'მიმართვის ვადა — 7 დღეში', tone: 'amber' }

export const PREVENTION_NEXT = { text: 'გრიპის ვაქცინა · ოქტ · უფასოა GPI პოლისით' }

/* A5 — history-transfer targets (F-03). The CURRENT personal doctor is
   deliberately excluded — transferring to yourself is meaningless (fix vs
   the stakeholder file, which listed her). avail: online | tomorrow */
export const TRANSFER_DOCTORS = [
  { id: 'd1', initial: 'გ', name: 'გიორგი მამულაძე', spec: 'კარდიოლოგი', clinic: 'კლ. კურაციო — ლორთქიფანიძის 31', avail: 'online' },
  { id: 'd2', initial: 'ა', name: 'ანა კობახიძე', spec: 'ენდოკრინოლოგი', clinic: 'კლ. კურაციო — შეშელიძის 6', avail: 'tomorrow' },
  { id: 'd3', initial: 'დ', name: 'დავით ჩხეიძე', spec: 'ნევროლოგი', clinic: 'კლ. კურაციო — შეშელიძის 6', avail: 'online' },
]

/* ── A7 — prevention screen dataset (stakeholder sc-prev parity, scope-filtered).
   status drives the row action: due/missed → booking CTA (dead until F-04),
   done → badge. note tones: red = missed, amber = due soon. ── */
export const V2_PREVENTION = {
  reminder: {
    title: 'შეხსენება — ექოსკოპია',
    body: 'გამეორება 3 თვეში (ივნ 2026) — დანიშნულება: გ. გიგაური 14 მარ',
  },
  vaccines: [
    { id: 'flu', icon: 'syringe', tile: 'lav', name: 'გრიპის ვაქცინა', meta: 'სეზონური ვაქცინაცია · ოქტ 2026', extra: 'GPI პოლისით დაფარულია · უფასოდ', status: 'due' },
    { id: 'covid', icon: 'check', tile: 'green', name: 'COVID-19 ბუსტერი', meta: '2025 — კლინიკა კურაციო', status: 'done' },
  ],
  screenings: [
    { id: 'breast', icon: 'microscope', tile: 'pink', name: 'მკერდის ჯირკვლის სქრინინგი', meta: 'სახ. პროგრამა · ყოველ 2 წელიწადში · 40+', note: '2024 — ჩატარება გამოტოვებულია', tone: 'red', status: 'due' },
    { id: 'annual', icon: 'stethoscope', tile: 'teal', name: 'წლიური პრევენციული გამოკვლევა', meta: 'სისხლის საერთო + ეკგ + შარდი · მარ 2026', status: 'done' },
    { id: 'vision', icon: 'eye', tile: 'amber', name: 'მხედველობის სქრინინგი', meta: 'გლაუკომის სქრინინგი · ყოველ 2 წელიწადში', note: '2025 — ვადა ახლოვდება', tone: 'amber', status: 'due' },
  ],
}

/* ── A6 — V2 history dataset (stakeholder parity minus charts; F-02/F-03).
   V1 keeps HISTORY below untouched. ── */
export const V2_ANALYSIS_CATS = [
  { id: 'all', label: 'ყველა' },
  { id: 'blood', label: 'სისხლი' },
  { id: 'bio', label: 'ბიოქიმია' },
  { id: 'thyroid', label: 'ფარისებრი' },
  { id: 'lipid', label: 'ლიპიდები' },
]

export const V2_HISTORY = {
  analyses: [
    { title: 'სისხლის საერთო', cat: 'blood', date: '22 აპრ', src: 'კურაციო', person: 'თამარ', status: 'norm' },
    { title: 'ბიოქიმია', cat: 'bio', date: '14 აპრ', src: 'კურაციო', person: 'თამარ', status: 'warn', note: 'ALT/AST ამაღლებულია — საჭიროა ექიმის კონსულტაცია', book: true },
    { title: 'ფარისებრი (TSH)', cat: 'thyroid', date: '3 აპრ', src: 'კურაციო', person: 'თამარ', status: 'norm' },
    { title: 'ლიპიდური სპექტრი', cat: 'lipid', date: '15 თებ', src: 'BMSC კლინიკა', person: 'თამარ', status: 'uploaded' },
    { title: 'სისხლის საერთო', cat: 'blood', date: '2 მარ', src: 'კურაციო', person: 'ნიკა', status: 'norm' },
  ],
  meds: [
    { name: 'ვიტამინი D3 2000 IU', how: 'დღეში 1 კაფსულა · 15 ივნისამდე', by: 'ნ. გიგაური', state: 'active' },
    { name: 'Metformin 500mg', how: 'დღეში 2 ტაბლეტი', by: 'ნ. გიგაური', expiry: 'ვადა: 30 აპრ · 6 დღეში', state: 'expiring' },
    { name: 'Atorvastatin 20mg', how: 'საღამოს 1 ტაბლეტი · 1 სექტემბრამდე', by: 'გ. მამულაძე', state: 'chronic' },
  ],
  studies: [
    {
      title: 'ექოსკოპია — მუცლის ღრუ',
      meta: 'დანიშნა ნ. გიგაურმა · 14 მარ',
      prep: 'მომზადება: 4–6 სთ მარხვა, ბუშტი სავსე',
      repeat: 'გამეორება 3 თვეში · ივნ 2026',
    },
  ],
  referrals: [
    { title: 'ლაბორატორიული — ბიოქიმია', number: 'EED 336 135 / 23', expiry: 'ვადა: 14 ივლ 2026', prep: 'მომზადება: 8–12 სთ მარხვა, მხოლოდ წყალი', status: 'booked' },
    { title: 'კარდიოლოგის კონსულტაცია', number: 'EED 336 218 / 23', expiry: 'ვადა: 8 ივლ 2026', status: 'waiting' },
  ],
  visits: [
    { title: 'ოჯახის ექიმი', person: 'თამარ', date: '18 აპრ 2026', by: 'ნ. გიგაური', clinic: 'კურაციო', summary: 'ბიოქიმია — ყურადღება · Metformin-ის მიმართვა განახლდა', year: '2026' },
    { title: 'პედიატრი', person: 'ნიკა', date: '2 მარ 2026', by: 'თ. ბერიძე', clinic: 'კურაციო', summary: 'გეგმიური შემოწმება — ნორმა', year: '2026' },
    { title: 'კარდიოლოგი', person: 'თამარ', date: '14 დეკ 2025', by: 'გ. მამულაძე', clinic: 'კურაციო', summary: 'ეკგ ნორმა · Atorvastatin გაგრძელდა', year: '2025' },
  ],
  docs: [
    { title: 'ბიოქიმია — BMSC კლინიკა', date: '14 აპრ 2026', type: 'PDF', shared: true },
    { title: 'MRI — EMC', date: '2 მარ 2026', type: 'ფოტო', shared: false },
  ],
}

/* Medical history rows per tab. status: norm | warn | crit | uploaded */
export const HISTORY = {
  analyses: [
    { title: 'სისხლის საერთო ანალიზი', date: '22 აპრ', src: 'კურაციო', person: 'გიორგი', status: 'norm' },
    { title: 'ბიოქიმია', date: '18 აპრ', src: 'კურაციო', person: 'გიორგი', status: 'warn' },
    { title: 'ფარისებრი ჯირკვალი (TSH)', date: '02 მარ', src: 'კურაციო', person: 'ელენე', status: 'norm' },
    { title: 'ლიპიდური სპექტრი', date: '15 თებ', src: 'სხვა კლინიკა', person: 'გიორგი', status: 'uploaded' },
  ],
  prescriptions: [
    { title: 'ლიზინოპრილი 10 მგ', date: '01 აპრ', src: 'ნ. გიგაური', person: 'გიორგი', status: 'warn', note: 'ქრონიკული · ვადა 7 დღეში' },
    { title: 'ვიტამინი D 2000 IU', date: '18 აპრ', src: 'ნ. გიგაური', person: 'ელენე', status: 'norm' },
  ],
  visits: [
    { title: 'კარდიოლოგი · მარიკა დვალიშვილი', date: '20 სექ', src: 'კურაციო', person: 'გიორგი', status: 'norm' },
    { title: 'ოჯახის ექიმი · ნინო გიგაური', date: '03 აპრ', src: 'კურაციო', person: 'გიორგი', status: 'norm' },
    { title: 'ენდოკრინოლოგი · ანა კობახიძე', date: '12 მარ', src: 'კურაციო', person: 'ელენე', status: 'norm' },
  ],
  docs: [
    { title: 'ფორმა 100', date: '22 აპრ', src: 'კურაციო', person: 'გიორგი', status: 'norm' },
    { title: 'ლიპიდური სპექტრი (PDF)', date: '15 თებ', src: 'სხვა კლინიკა', person: 'გიორგი', status: 'uploaded' },
  ],
}
