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

/* #4 (stakeholder comments 2026-08-18) — REAL-TIME AVAILABILITY IS MVP2.
   The „Online" dot and „ხელმისაწვდომია ახლა" were designed FOR the online-
   consultation feature, which ships in MVP2. Showing them in MVP1 promises a
   channel the app cannot deliver. A working-hours-derived indicator was
   considered and REJECTED (user + me, 2026-08-18): it still reads as presence,
   so it misleads more than it informs — the A4 info grid's სამუშაო დღეები /
   სამუშაო საათები carry that information honestly instead.
   Kept as a FLAG, not deleted: MVP2 flips this one boolean to restore every
   badge. Applies to V2 (canonical); V1 is frozen and untouched. */
export const ONLINE_STATUS_ENABLED = false

export const DOCTOR = {
  initial: 'ნ',
  name: 'ნინო გიგაური',
  photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=96&h=96&fit=crop&crop=faces&auto=format&q=60',
  role: 'ოჯახის ექიმი · კურაციო',
  online: true /* rendered only when ONLINE_STATUS_ENABLED (MVP2) */,
  nextVisit: '29 სექ · 11:00',
  /* A4 doctor-detail additions (F-03 card fields). Clinic naming follows the
     BOOKING FLOW ("კურაციო საბურთალოზე"), not the stakeholder file's
     address style — the tested flow is the naming source of truth. */
  clinic: 'კურაციო საბურთალოზე',
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
/* Photos are Unsplash stand-ins on the same URL grammar as the Curatio doctors
   (w/h 96, crop=faces) — `initial` stays as the fallback when a photo is absent.
   Every candidate was checked at the real 34px avatar size before being picked:
   `crop=faces` does NOT rescue a full-body shot, it just crops it, so a figure
   standing in a wide frame lands as an unreadable speck in the circle.
   The cast follows the demo records: ნიკა has a პედიატრი visit (V2_HISTORY),
   so he reads as a child; ანი has no records, and is cast as a second child so
   the switcher tells a family-policy story. Swap freely — nothing keys on age. */
export const V2_PERSONS = [
  { id: 'tp', name: 'თამარ გიორგაძე', initial: 'თ', ocin: 'OCIN 00142897', holder: true, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
  { id: 'np', name: 'ნიკა გიორგაძე', initial: 'ნ', ocin: 'OCIN 00142911', photo: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
  { id: 'ap', name: 'ანი გიორგაძე', initial: 'ა', ocin: 'OCIN 00142912', photo: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
]

/* Today's visit per person — exists only in the visit-day demo mode. */
export const V2_TODAY = {
  /* #5: the cabinet is now surfaced in the arrival confirmation, so the
     stakeholder file's „კაბ. XXX" placeholder became visible — real number. */
  tp: { proc: 'ექოსკოპია', place: 'ლორთქიფანიძის 31 · კაბ. 312 · IV სართ.', time: '10:30', queue: 'A042' },
  np: { proc: 'პედიატრი', place: 'ლორთქიფანიძის 31 · კაბ. 115 · II სართ.', time: '12:30', queue: 'B017' },
}

/* History-row alert badge per person — counts are sensitive, shown only after OTP unlock. */
export const V2_HISTORY_ALERT = { tp: '1 ვადა', np: null, ap: null }

/* Queue-picker bookings per person (F-01: today / tomorrow / near future).
   `when: 'today'` entries are ACTIVATABLE only in visit-day mode; everything
   else stays locked until 09:00 of its own visit day. */
export const V2_BOOKINGS = {
  tp: [
    { when: 'today', date: '28 აპრ 2026', proc: 'ექოსკოპია', place: 'კლ. კურაციო · კაბ. 214 · IV სართ.', time: '10:30' },
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
/* #7 (2026-08-18) — results uploaded during a demo run. Same lifetime + mechanism
   as the picked doctor (sessionStorage, cleared with the tab): the uploaded row has
   to survive navigating away from the section, or the flow reads as broken. */
/* #11 follow-up (user, 2026-08-18) — meds the patient marked „აღარ მჭირდება".
   Same session-scoped store as the uploads; reversible from the row. */
const DISMISSED_KEY = 'mgaMedsDismissed'

export function getDismissedMeds() {
  try {
    return JSON.parse(sessionStorage.getItem(DISMISSED_KEY) || '[]')
  } catch {
    return []
  }
}

export function setMedDismissed(name, on) {
  const next = getDismissedMeds().filter((n) => n !== name)
  if (on) next.push(name)
  try {
    sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(next))
  } catch {
    /* private mode — the state just won't survive navigation */
  }
}

const UPLOADS_KEY = 'mgaUploads'

export function getUploads() {
  try {
    return JSON.parse(sessionStorage.getItem(UPLOADS_KEY) || '[]')
  } catch {
    return []
  }
}

export function addUpload(rec) {
  try {
    sessionStorage.setItem(UPLOADS_KEY, JSON.stringify([rec, ...getUploads()]))
  } catch {
    /* private mode — the row just won't survive navigation */
  }
}

export function clearUploads() {
  try {
    sessionStorage.removeItem(UPLOADS_KEY)
  } catch {
    /* ignore */
  }
}

/* Georgian short month → index, so records from different sources sort together.
   #13's re-homed rows were simply appended, which broke the newest-first reading
   (22 აპრ → 14 აპრ → 3 აპრ → 15 თებ → 2 მარ → 14 აპრ → 2 მარ). */
const GEO_MONTHS = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ']

export function dateRank(d) {
  const m = String(d || '').trim().match(/^(\d{1,2})\s+(\S+)/)
  if (!m) return -1
  const mi = GEO_MONTHS.indexOf(m[2])
  return mi === -1 ? -1 : mi * 100 + Number(m[1])
}

export const V2_ANALYSIS_CATS = [
  { id: 'all', label: 'ყველა' },
  { id: 'blood', label: 'სისხლი' },
  { id: 'bio', label: 'ბიოქიმია' },
  { id: 'thyroid', label: 'ფარისებრი' },
  { id: 'lipid', label: 'ლიპიდები' },
  /* #13 (2026-08-18) — every upload must map to a category in one of the two
     remaining sections; imaging/instrumental studies had none, and the section is
     „ანალიზები და კვლევები" precisely so they belong here. */
  { id: 'imaging', label: 'ინსტრუმენტული' },
]

export const V2_HISTORY = {
  /* #7 (2026-08-18): `src` is now the ORIGIN ENUM behind SourceTag (curatio |
     external | referral), not a display string — origin and clinical status are
     different axes and used to be conflated. The externally-uploaded row lost its
     `status: 'uploaded'` badge for the same reason: GPI cannot read an external
     result (OCR is MVP2), so it has NO clinical status to show. `shared` = the
     per-upload consent from the upload sheet. */
  analyses: [
    { title: 'სისხლის საერთო', cat: 'blood', date: '22 აპრ', src: 'curatio', person: 'თამარ', status: 'norm' },
    { title: 'ბიოქიმია', cat: 'bio', date: '14 აპრ', src: 'curatio', person: 'თამარ', status: 'warn', note: 'ALT/AST ამაღლებულია — საჭიროა ექიმის კონსულტაცია', book: true },
    { title: 'ფარისებრი (TSH)', cat: 'thyroid', date: '3 აპრ', src: 'curatio', person: 'თამარ', status: 'norm' },
    { title: 'ლიპიდური სპექტრი', cat: 'lipid', date: '15 თებ', src: 'external', clinic: 'BMSC კლინიკა', person: 'თამარ', shared: true },
    { title: 'სისხლის საერთო', cat: 'blood', date: '2 მარ', src: 'curatio', person: 'ნიკა', status: 'norm' },
    /* Re-homed from the deleted დოკუმენტები tab (#13) — they were always analyses
       and studies, filed in a drawer only because uploads had nowhere else to go. */
    { title: 'ბიოქიმია', cat: 'bio', date: '14 აპრ', src: 'external', clinic: 'BMSC კლინიკა', person: 'თამარ', shared: true },
    { title: 'MRI — თავის ტვინი', cat: 'imaging', date: '2 მარ', src: 'external', clinic: 'EMC', person: 'თამარ', shared: false },
  ],
  meds: [
    { name: 'ვიტამინი D3 2000 IU', how: 'დღეში 1 კაფსულა · 15 ივნისამდე', by: 'ნ. გიგაური', src: 'curatio', state: 'active' },
    { name: 'Metformin 500mg', how: 'დღეში 2 აბი', by: 'ნ. გიგაური', src: 'curatio', expiry: 'ვადა: 30 აპრ · 6 დღეში', state: 'expiring' },
    { name: 'Atorvastatin 20mg', how: 'საღამოს 1 აბი · 1 სექტემბრამდე', by: 'გ. მამულაძე', src: 'external', clinic: 'EMC', state: 'chronic' },
  ],
  studies: [
    {
      src: 'referral',
      title: 'ექოსკოპია — მუცლის ღრუ',
      meta: 'დანიშნა ნ. გიგაურმა · 14 მარ',
      prep: 'მომზადება: 4–6 სთ მარხვა, ბუშტი სავსე',
      repeat: 'გამეორება 3 თვეში · ივნ 2026',
    },
  ],
  /* #9 — referrals come FROM the family doctor: that is their origin, and SourceTag
     renders it with the same enum the analyses and the card use. */
  referrals: [
    { title: 'ლაბორატორიული — ბიოქიმია', number: 'EED 336 135 / 23', expiry: 'ვადა: 14 ივლ 2026', prep: 'მომზადება: 8–12 სთ მარხვა, მხოლოდ წყალი', src: 'referral', status: 'booked' },
    { title: 'კარდიოლოგის კონსულტაცია', number: 'EED 336 218 / 23', expiry: 'ვადა: 8 ივლ 2026', src: 'referral', status: 'waiting' },
  ],
  /* #10 (2026-08-18) — the card holds every ENCOUNTER, not only in-clinic visits:
     phone and online consultations produce records too, and a patient scanning the
     list needs to know which kind each was. `type` drives an icon + LABEL (never the
     icon alone). `src` is #9's origin, same enum as everywhere else. */
  visits: [
    { title: 'ოჯახის ექიმი', type: 'visit', person: 'თამარ', date: '18 აპრ 2026', by: 'ნ. გიგაური', clinic: 'კურაციო საბურთალოზე', src: 'curatio', summary: 'ბიოქიმია — ყურადღება · Metformin-ის მიმართვა განახლდა', year: '2026' },
    { title: 'ოჯახის ექიმი', type: 'phone', person: 'თამარ', date: '2 აპრ 2026', by: 'ნ. გიგაური', clinic: 'კურაციო', src: 'curatio', summary: 'ანალიზების შედეგების განხილვა · დოზა უცვლელი', year: '2026' },
    { title: 'პედიატრი', type: 'visit', person: 'ნიკა', date: '2 მარ 2026', by: 'თ. ბერიძე', clinic: 'კურაციო ვაკეში', src: 'curatio', summary: 'გეგმიური შემოწმება — ნორმა', year: '2026' },
    { title: 'დერმატოლოგი', type: 'online', person: 'თამარ', date: '20 იან 2026', by: 'ლ. ჩიქოვანი', clinic: 'კურაციო', src: 'curatio', summary: 'კანის გამონაყარი — ადგილობრივი მკურნალობა', year: '2026' },
    { title: 'კარდიოლოგი', type: 'visit', person: 'თამარ', date: '14 დეკ 2025', by: 'გ. მამულაძე', clinic: 'EMC', src: 'external', summary: 'ეკგ ნორმა · Atorvastatin გაგრძელდა', year: '2025' },
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

/* ── #1 (stakeholder comments 2026-08-18) — personal-doctor selection. ──
   The docselect screen REUSES the booking flow's page-1 doctor list (that flow
   is usability-tested and already in development) opened in "select personal
   doctor" mode — FAMILY DOCTORS only. ნინო გიგაური IS listed here (unlike
   TRANSFER_DOCTORS): with no doctor assigned there is no "current" to exclude.
   Filters MIRROR the booking flow's selection controls (city · clinic; its
   calendar/slots stay out — availability is booking info, not selection info,
   user call 2026-08-18). langs = the flow's Geo/Eng/Rus doctor-card chips.
   Photos: Unsplash portraits (prototype stand-ins only — production uses real
   Curatio doctor photos). */
export const DOCSEL_CITIES = [
  { id: 'tbilisi', label: 'თბილისი' },
  { id: 'batumi', label: 'ბათუმი' },
]
export const DOCSEL_CLINICS = [
  { id: 'all', label: 'ყველა კლინიკა' },
  { id: 'sab', label: 'კურაციო საბურთალოზე' },
  { id: 'vake', label: 'კურაციო ვაკეში' },
  { id: 'bat', label: 'კურაციო ბათუმში' },
]
export const SELECT_DOCTORS = [
  { id: 's1', initial: 'ნ', name: 'ნინო გიგაური', spec: 'ოჯახის ექიმი', city: 'tbilisi', clinicId: 'sab', clinic: 'კურაციო საბურთალოზე', exp: 12, hours: 'ორ — პარ · 09:00—18:00', langs: ['Geo', 'Eng'], photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
  { id: 's2', initial: 'გ', name: 'გიორგი კაპანაძე', spec: 'ოჯახის ექიმი', city: 'tbilisi', clinicId: 'vake', clinic: 'კურაციო ვაკეში', exp: 8, hours: 'ორ — შაბ · 10:00—17:00', langs: ['Geo', 'Rus'], photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
  { id: 's3', initial: 'თ', name: 'თამარ ბერიძე', spec: 'ოჯახის ექიმი', city: 'tbilisi', clinicId: 'sab', clinic: 'კურაციო საბურთალოზე', exp: 21, hours: 'ორ — პარ · 14:00—20:00', langs: ['Geo', 'Eng', 'Rus'], photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
  { id: 's4', initial: 'ლ', name: 'ლევან წიკლაური', spec: 'ოჯახის ექიმი', city: 'batumi', clinicId: 'bat', clinic: 'კურაციო ბათუმში', exp: 5, hours: 'ორ — პარ · 09:00—15:00', langs: ['Geo'], photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
]

/* Demo state: the doctor chosen via docselect. sessionStorage — survives route
   changes, resets with the tab (same lifetime as the OTP unlock). null = the
   default DOCTOR. A newly chosen doctor has NO next visit yet (nextVisit:null),
   which the dash + A4 detail must render honestly. */
const PICK_KEY = 'mgaPickedDoctor'
export function getPickedDoctor() {
  try {
    return JSON.parse(sessionStorage.getItem(PICK_KEY))
  } catch {
    return null
  }
}
export function setPickedDoctor(d) {
  /* Carry the fields the detail screen renders — and NULL the ones we do not know.
     Storing a partial record let `{...DOCTOR, ...picked}` fill the gaps from the
     hard-coded default doctor, so A4 showed ნინო გიგაური's cabinet and hours beside
     the newly picked doctor's clinic, contradicting the confirmation sheet the user
     had just accepted (audit 2026-08-18). */
  sessionStorage.setItem(
    PICK_KEY,
    JSON.stringify({
      initial: d.initial,
      name: d.name,
      photo: d.photo,
      role: d.spec + ' · კურაციო',
      clinic: d.clinic,
      /* `hours` is one string carrying both („ორ — პარ · 09:00—15:00"), while the detail
         screen has a cell for each — split it rather than dumping the whole thing into
         one cell and leaving the other blank. */
      workDays: (d.hours.split(' · ')[0] || '').trim() || null,
      workHours: (d.hours.split(' · ')[1] || '').trim() || null,
      /* Genuinely unknown until Curatio assigns one — rendered as „—", never inherited
         from the default doctor. */
      cabinet: null,
      nextVisit: null,
    })
  )
}
export function clearPickedDoctor() {
  sessionStorage.removeItem(PICK_KEY)
}

/* ── #5 (stakeholder comments 2026-08-18) — arrival check-in („მე მოვედი"). ──
   Qmatic separates ACTIVATING a ticket remotely from physically ARRIVING; the
   clinic needs the second signal to call the patient. Stored per person (the
   e-ticket is person-scoped via ?p=) in sessionStorage — same lifetime as the
   OTP unlock — so navigating away and back keeps the confirmed state, while a
   fresh tab (or the visit-day demo chip) resets the scenario.
   In production the geolocation push near the clinic lands on this same
   action, which is why the pre-arrival card advertises it. */
const ARRIVED_KEY = 'mgaArrived'

function arrivedMap() {
  try {
    return JSON.parse(sessionStorage.getItem(ARRIVED_KEY)) || {}
  } catch {
    return {}
  }
}
/* Returns the check-in time ('HH:MM') or null — the stamp is the patient's
   evidence, so it persists with the flag rather than being re-derived. */
export function arrivedAtFor(personId = 'default') {
  return arrivedMap()[personId] || null
}
export function setArrived(personId = 'default', at) {
  sessionStorage.setItem(ARRIVED_KEY, JSON.stringify({ ...arrivedMap(), [personId]: at }))
}
export function clearArrived() {
  sessionStorage.removeItem(ARRIVED_KEY)
}
