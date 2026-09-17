/* ჩემი კურაციო (web) — demo data + the demo-state store.

   All ILLUSTRATIVE (Rule/locked decision: clinical content like „ლიზინოპრილი
   10 მგ" is a placeholder — real medical copy comes from GPI). Person model
   mirrors the dashboard's: the holder first, family members as first-class
   rows. Record vocabulary mirrors the mobile module's data so the two
   platforms describe one truth. */

import { lang } from '../i18n/index.js'
import { doctors as BOOKING_DOCTORS, clinics as BOOKING_CLINICS, clinicByValue } from '../data/booking.js'

const L = (ka, en) => (lang === 'en' ? en : ka)
const face = (id) => `https://images.unsplash.com/${id}?w=96&h=96&fit=crop&crop=faces&auto=format&q=60`

/* ---- Demo-state store ------------------------------------------------------
   visit-day and uninsured are STATES of one account, not separate pages, and a
   reviewer flips them from the demo bar. sessionStorage (not React state) so
   the dashboard and the section — separate routes — read the same account. */
const DK = { visit: 'gpi.dash.visitDay', unins: 'gpi.dash.uninsured', attach: 'gpi.dash.attachments', ticket: 'gpi.dash.ticket', early: 'gpi.dash.windowClosed', shares: 'gpi.dash.shares', v2: 'gpi.dash.transferV2', doc: 'gpi.dash.personalDoctor', docClinic: 'gpi.dash.personalClinic', read: 'gpi.dash.read' }
/* Per-record attachments (web twin of mobile's addAttachment, 2026-09-04): a
   document hung off an EXISTING record, keyed by record id. Own key (Rule 5). */
export function getAttachments() {
  try { return JSON.parse(sessionStorage.getItem(DK.attach) || '{}') } catch { return {} }
}
export function addAttachment(recId, doc) {
  try {
    const all = getAttachments()
    sessionStorage.setItem(DK.attach, JSON.stringify({ ...all, [recId]: [...(all[recId] || []), doc] }))
  } catch { /* private mode — the prototype just forgets */ }
}
/* ---- Unread records (2026-09-17) ----------------------------------------------
   „Something new arrived": a record the person has not OPENED yet. The seed
   records carry `unread: true` (the newest ones — what a fresh Curatio sync
   brings); opening the file (the row's download) writes the id HERE, and the
   record is read from then on. The store holds READ ids, not unread ones, so the
   seed stays the truth and the demo bar's „new records" is just a clear. Own key
   (Rule 5). What production needs from Curatio Core is exactly this: a per-record
   „opened" flag — the section counters are its sum, per selected person. A
   window event keeps siblings on one page (card ↔ demo bar) in step. */
const UNREAD_EVT = 'gpi:unread'
const announce = () => window.dispatchEvent(new Event(UNREAD_EVT))
export const onUnreadChange = (fn) => {
  window.addEventListener(UNREAD_EVT, fn)
  return () => window.removeEventListener(UNREAD_EVT, fn)
}
export function getRead() {
  try { return new Set(JSON.parse(sessionStorage.getItem(DK.read) || '[]')) } catch { return new Set() }
}
export function markRead(recId) {
  try {
    const s = getRead()
    if (s.has(recId)) return
    s.add(recId)
    sessionStorage.setItem(DK.read, JSON.stringify([...s]))
  } catch { /* private mode — the prototype just forgets */ }
  announce()
}
const seededUnread = () => [...ANALYSES, ...MEDS, ...VISITS].filter((r) => r.unread).map((r) => r.id)
export function markAllRead() {
  try { sessionStorage.setItem(DK.read, JSON.stringify(seededUnread())) } catch { /* ditto */ }
  announce()
}
export function clearRead() {
  sessionStorage.removeItem(DK.read)
  announce()
}
export const isUnread = (r, read = getRead()) => !!r.unread && !read.has(r.id)
export const unreadCount = (rows, personId, read = getRead()) => forPerson(rows, personId).filter((r) => isUnread(r, read)).length
export const anyUnread = (read = getRead()) => seededUnread().some((id) => !read.has(id))

/* ---- History transfer (2026-09-09) --------------------------------------------
   Which records the patient has handed to which doctor. Keyed by record id →
   the doctors it is visible to (id + name, deduped), so the table can print
   „ხილვადია: ნ. ნინოშვილი" under the record and the row icon can flip to a
   check. sessionStorage, own key (Rule 5 — mobile's transfer has no store yet;
   when it gets one it must NOT share this key). Illustrative like everything
   else here: production reads this from Curatio Core. */
export function getShares() {
  try { return JSON.parse(sessionStorage.getItem(DK.shares) || '{}') } catch { return {} }
}
export function addShares(recIds, doctor) {
  try {
    const all = getShares()
    const next = { ...all }
    recIds.forEach((id) => {
      const cur = next[id] || []
      if (!cur.some((d) => d.id === doctor.id)) next[id] = [...cur, { id: doctor.id, name: doctor.name }]
    })
    sessionStorage.setItem(DK.shares, JSON.stringify(next))
  } catch { /* private mode — the prototype just forgets */ }
}
export function clearShares() {
  sessionStorage.removeItem(DK.shares)
}
/* „ნინო ნინოშვილი" → „ნ. ნინოშვილი": the short form the mark and the toast use,
   so a record shared with two doctors still fits one line. Latin names behave
   the same way (Nino Ninoshvili → N. Ninoshvili). */
/* The store keeps the name it was written with, but the UI must print the
   CURRENT locale's — a ka-session share read in an en session would otherwise
   show „ნ. ნინოშვილი" beside English rows. Resolve by id first; the stored name
   is only the fallback for a doctor the roster no longer lists. */
export const shareName = (d) =>
  (d.id === DOCTOR.id
    ? DOCTOR.name
    : (PERSONAL_DOCTORS.find((x) => x.id === d.id)?.name ?? TRANSFER_DOCTORS.find((x) => x.id === d.id)?.name)) ?? d.name
export const shortName = (name) => {
  const parts = String(name).trim().split(/\s+/)
  return parts.length > 1 ? `${parts[0][0]}. ${parts.slice(1).join(' ')}` : name
}

export const demo = {
  visitDay: () => sessionStorage.getItem(DK.visit) === '1',
  setVisitDay: (on) => (on ? sessionStorage.setItem(DK.visit, '1') : sessionStorage.removeItem(DK.visit)),
  uninsured: () => sessionStorage.getItem(DK.unins) === '1',
  setUninsured: (on) => (on ? sessionStorage.setItem(DK.unins, '1') : sessionStorage.removeItem(DK.unins)),
  /* The check-in WINDOW, as a demo switch. In production this is a clock
     comparison against the appointment time; the prototype cannot wait until
     11:00 to demonstrate the closed state, so the chip stands in for the clock.
     Default = OPEN, so a `?study` session (where the DemoBar is hidden) can
     actually exercise the check-in. */
  /* „window: closed" — stands in for the clock on visit day: the activation
     window (appointment − ACTIVATION_OPENS_MIN) has not opened yet. */
  windowClosed: () => sessionStorage.getItem(DK.early) === '1',
  /* „transfer (v2)" — the COMPARISON BASELINE (Rule 4). Since 2026-09-17 the change-doctor
     version is what #/dash/curatio serves (the PO settled the rule: transferring history ==
     changing the personal doctor, and the history moves automatically). ON = the published
     v2 doctor row (transfer button → the full drawer) for side-by-side review. */
  transferV2: () => sessionStorage.getItem(DK.v2) === '1',
  setTransferV2: (on) => (on ? sessionStorage.setItem(DK.v2, '1') : sessionStorage.removeItem(DK.v2)),
  setWindowClosed: (on) => (on ? sessionStorage.setItem(DK.early, '1') : sessionStorage.removeItem(DK.early)),
}

/* ---- The visit ticket (user journey, 2026-09-16) ----------------------------
   One ticket per person per visit day, four states, ONE action slot on the banner:
     locked  — visit day, but the activation window has not opened
               (window = appointment − ACTIVATION_OPENS_MIN; „გააქტიურება 11:15-დან")
     open    — inside the window → „ბილეთის გააქტიურება" (the queue number is issued
               only now; visits can exist without a ticket)
     active  — ticket issued (A042 …) → „მე მოვედი", no time gate on arrival
     arrived — the stamp; Curatio's API retires the ticket after the visit (not ours)
   Assumptions stated to the user: the window stays open past the appointment time
   until Curatio retires the visit; the holder can act for the selected family member
   (person-scoped, mobile parity). The web has no geolocation, so the window is the guard.
   ACTIVATION_OPENS_MIN is the production rule the demo „window: closed" switch stands
   for. The stamp is the patient's evidence, so it is stored, not re-derived. */
export const ACTIVATION_OPENS_MIN = 15
/** @deprecated alias — CuratioTicket's opensAt() still reads it; new code gates ACTIVATION. */
export const CHECKIN_OPENS_MIN = ACTIVATION_OPENS_MIN

function ticketMap() {
  try {
    return JSON.parse(sessionStorage.getItem(DK.ticket) || '{}')
  } catch {
    return {}
  }
}
function writeTicket(personId, patch) {
  const m = ticketMap()
  sessionStorage.setItem(DK.ticket, JSON.stringify({ ...m, [personId]: { ...(m[personId] || {}), ...patch } }))
  /* Siblings on one page (dashboard banner ↔ Curatio card badge) re-read on this. */
  window.dispatchEvent(new CustomEvent('gpi:ticket'))
}
export function ticketFor(personId) {
  return ticketMap()[personId] || {}
}
export function activatedAtFor(personId) {
  return ticketFor(personId).activatedAt || null
}
export function activateTicket(personId, at) {
  writeTicket(personId, { activatedAt: at })
}
export function arrivedAtFor(personId) {
  return ticketFor(personId).arrivedAt || null
}
export function setArrived(personId, at) {
  writeTicket(personId, { arrivedAt: at })
}
export function clearArrived() {
  sessionStorage.removeItem(DK.ticket)
  window.dispatchEvent(new CustomEvent('gpi:ticket'))
}
/** State of the banner's action slot for a person on visit day. */
export function ticketState(personId) {
  if (arrivedAtFor(personId)) return 'arrived'
  if (activatedAtFor(personId)) return 'active'
  return demo.windowClosed() ? 'locked' : 'open'
}

/* ---- People ---------------------------------------------------------------- */
export const PERSONS = [
  /* Portraits: the same Unsplash faces the mobile module uses for the family (Rule 1). */
  { id: 'g', name: L('გიორგი გიორგაძე', 'Giorgi Giorgadze'), ocin: 'OCIN 23213/22', holder: true, photo: face('photo-1519238263530-99bdd11df2ea') },
  { id: 'e', name: L('ელენე გიორგაძე', 'Elene Giorgadze'), ocin: 'OCIN 23213/23', photo: face('photo-1503454537195-1dcabb73ffb9') },
]

export const DOCTOR = {
  id: 'pd',
  /* She is the booking wizard's d1 (same Nino Ninoshvili): the change-doctor drawer
     lists the wizard's personal doctors and must not offer the current one as „new". */
  bookingId: 'd1',
  /* `languages` / `bio` (2026-09-16): the concept's „ექიმის დეტალები" opens the wizard's
     DoctorBioModal on her too, so she needs its shape. DEMO copy. */
  languages: ['KA', 'EN', 'RU'],
  bio: L('ოჯახის ექიმი, 12 წლის გამოცდილება. ქრონიკული დაავადებების მართვა, პრევენციული მედიცინა, ოჯახის ყველა წევრის მეთვალყურეობა.', 'Family doctor, 12 years of practice. Chronic-condition management, preventive medicine, care for the whole family.'),
  name: L('ნინო ნინოშვილი', 'Nino Ninoshvili'),
  spec: L('ოჯახის ექიმი · კურაციო საბურთალოზე', 'Family doctor · Curatio Saburtalo'),
  next: L('18 ნოე', '18 Nov'), /* today (12 Nov) is the cardiologist's slot — see TODAY */
  photo: face('photo-1559839734-2b71ea197ec2'),
}

/* ---- Transfer targets — the Curatio network beyond the personal doctor ----------
   The mobile A5 roster (data.ka/en TRANSFER_DOCTORS), VERBATIM: same three
   doctors, same clinics, so both platforms describe one network. The personal
   doctor is NOT in this list — she is the preselected target in the modal, and
   listing her twice would make „other doctor" a trap. No photos: the network
   list renders initials (Avatar), as mobile does. */
/* `languages` / `bio` / `avatar` (2026-09-10): the transfer drawer lists these
   doctors with the booking wizard's DoctorRow and opens the wizard's
   DoctorBioModal on the info trigger, so the rows need the wizard's shape —
   language codes (booking.js langTag), a bio paragraph, a pravatar seed. DEMO
   copy; the real network comes from Curatio. */
export const TRANSFER_DOCTORS = [
  { id: 'd1', name: L('გიორგი მამულაძე', 'Giorgi Mamuladze'), spec: L('კარდიოლოგი', 'Cardiologist'), clinic: L('კლ. კურაციო — ლორთქიფანიძის 31', 'Curatio Cl. — Lortkipanidze St. 31'),
    languages: ['KA', 'EN'], avatar: 12,
    bio: L('კარდიოლოგი, 15 წლის გამოცდილება. არითმიების და არტერიული ჰიპერტენზიის მართვა, ექოკარდიოგრაფია.', 'Cardiologist, 15 years of practice. Arrhythmia and hypertension management, echocardiography.') },
  { id: 'd2', name: L('ანა კობახიძე', 'Ana Kobakhidze'), spec: L('ენდოკრინოლოგი', 'Endocrinologist'), clinic: L('კლ. კურაციო — შეშელიძის 6', 'Curatio Cl. — Sheshelidze St. 6'),
    languages: ['KA', 'EN', 'RU'], avatar: 47,
    bio: L('ენდოკრინოლოგი. ფარისებრი ჯირკვლის დაავადებები, დიაბეტის მართვა, ჰორმონული კვლევების ინტერპრეტაცია.', 'Endocrinologist. Thyroid disorders, diabetes management, interpretation of hormone panels.') },
  { id: 'd3', name: L('დავით ჩხეიძე', 'Davit Chkheidze'), spec: L('ნევროლოგი', 'Neurologist'), clinic: L('კლ. კურაციო — შეშელიძის 6', 'Curatio Cl. — Sheshelidze St. 6'),
    languages: ['KA', 'DE'], avatar: 33,
    bio: L('ნევროლოგი. თავის ტკივილის და ძილის დარღვევების დიაგნოსტიკა, ნეიროფიზიოლოგიური კვლევები.', 'Neurologist. Headache and sleep-disorder diagnostics, neurophysiological studies.') },
]

/* ---- The Curatio clinics + their personal doctors (2026-09-17 change request) ----
   The change-doctor drawer asks for the CLINIC first, then a personal doctor who
   practises there — the booking wizard's own roster (data/booking.js: the eight
   Tbilisi Curatio clinics + the `personal`-type doctors, EN labels merged by the
   wizard's loc()), so the network is ONE list on every surface (Rule 1). Ids are
   prefixed `bk:` — the wizard's d1…d5 collide with TRANSFER_DOCTORS' d1…d3, which are
   different people. `bookingId` keeps the raw id: the seed DOCTOR is the wizard's d1
   (same Nino Ninoshvili), and the drawer must not list the current doctor as „new". */
export const CLINICS = BOOKING_CLINICS
/* `spec` = the seed DOCTOR's wording („ოჯახის ექიმი" / „Family doctor"), not the wizard's
   row label „პირადი ექიმი" — the doctor row already says „პირადი ექიმი" as its overline. */
export const PERSONAL_DOCTORS = BOOKING_DOCTORS.filter((d) => d.type === 'personal').map((d) => ({
  id: `bk:${d.id}`, bookingId: d.id, name: d.name, spec: L('ოჯახის ექიმი', 'Family doctor'), clinics: d.clinics,
  languages: d.languages, bio: d.bio, avatar: d.avatar,
}))
export const personalDoctorsAt = (clinicValue, exceptBookingId = null) =>
  PERSONAL_DOCTORS.filter((d) => d.clinics.includes(clinicValue) && d.bookingId !== exceptBookingId)

/* ---- The CURRENT personal doctor (2026-09-16; clinic added 2026-09-17) ----------
   DOCTOR is the seed; the change-doctor drawer replaces her for the session
   (sessionStorage: the doctor id + the clinic she was chosen at, since a doctor
   can practise at two). Everything that means „the personal doctor" — the doctor
   row, the history's „visible to" check, the transfer drawer's personal target —
   reads currentDoctor(), never DOCTOR directly. A chosen doctor is reshaped to
   DOCTOR's fields: `spec` = role · clinic, no `next` (no booked visit yet),
   initials avatar (no photo). The TRANSFER_DOCTORS branch serves ids stored by
   the 09-16 concept (a network specialist) — kept so an old session still renders. */
export const getDoctorId = () => sessionStorage.getItem(DK.doc)
export function setPersonalDoctor(id, clinicValue = null) {
  id ? sessionStorage.setItem(DK.doc, id) : sessionStorage.removeItem(DK.doc)
  clinicValue ? sessionStorage.setItem(DK.docClinic, clinicValue) : sessionStorage.removeItem(DK.docClinic)
}
export function currentDoctor() {
  const id = getDoctorId()
  const pd = PERSONAL_DOCTORS.find((x) => x.id === id)
  if (pd) {
    const cl = clinicByValue(sessionStorage.getItem(DK.docClinic)) || clinicByValue(pd.clinics[0])
    return { ...pd, spec: `${pd.spec} · ${cl.label}`, clinic: cl.label, next: null, photo: undefined }
  }
  const d = TRANSFER_DOCTORS.find((x) => x.id === id)
  return d ? { ...d, spec: `${d.spec} · ${d.clinic}`, next: null, photo: undefined } : DOCTOR
}
/* The handover (2026-09-17: AUTOMATIC — the PO's rule): every record of the person
   becomes visible to the NEW personal doctor and the old one drops off; whatever a
   record was shared with beyond the personal doctor (a specialist, from the table's
   per-record action) is kept — changing the family doctor revokes nothing else. */
export function handoverShares(ids, from, to) {
  const all = getShares()
  ids.forEach((id) => {
    const rest = (all[id] || []).filter((d) => d.id !== from.id && d.id !== to.id)
    all[id] = [{ id: to.id, name: to.name }, ...rest]
  })
  sessionStorage.setItem(DK.shares, JSON.stringify(all))
}

/* Section glyphs — the record FAMILY (the history head switch, the transfer
   drawer's category switch): document / pill / stethoscope. Rows keep their own
   per-record glyph (a visit is in-person or remote). */
export const SECTION_ICON = { analyses: 'file-text', meds: 'pill', visits: 'stethoscope' }

/* ---- F-01: today (visit-day state only) ------------------------------------ */
export const TODAY = {
  p: 'g', // whose visit it is — the switcher tags the other person while they are not selected
  time: '11:30',
  /* Today's visit is with the CARDIOLOGIST, not the personal doctor (user,
     2026-09-10: „do not want the same doctor here and below" — the banner sat
     over the doctor row showing the same face twice). Same person as the
     dashboard's b1 booking and the wizard roster's d9, so the three agree;
     the personal doctor's next visit moved to 18 Nov (b2). */
  doctor: L('ზურაბ მაისურაძე', 'Zurab Maisuradze'),
  role: L('კარდიოლოგი', 'Cardiologist'),
  photo: face('photo-1612349317150-e413f6a5b16d'),
  queue: 'A042',
  ahead: 3,
  cabinet: 208,
  /* 2026-09-08, for the web e-ticket (mobile anatomy): the estimated wait the mobile
     QUEUE carries, and the clinic address/floor from mobile's CLINIC — the same
     Curatio Saburtalo the doctor card names. Illustrative, like the rest. */
  wait: 12,
  clinic: L('კურაციო საბურთალო', 'Curatio Saburtalo'), /* banner location lead (2026-09-10) */
  address: L('ლორთქიფანიძის 31', 'Lortkipanidze St. 31'),
  floor: L('IV სართ.', '4th floor'),
}

/* „Today" in this module is 12 Nov 2025 — the same date the dashboard's bookings
   carry. Every history record already states how many months back it sits, so the
   YEAR is DERIVED from that rather than typed into 20 date strings: a hand-written
   year would silently disagree with the day/month the moment the demo date moves.
   Format matches the bookings („12 ნოე, 2025") — Rule 1. */
const TODAY_YEAR = 2025
const TODAY_MONTH = 10 /* November, 0-indexed */
export const yearOf = (r) => TODAY_YEAR + Math.floor((TODAY_MONTH - (r.monthsAgo || 0)) / 12)
export const dateWithYear = (r) => `${r.date}, ${yearOf(r)}`

/* ---- F-02/F-03: history records --------------------------------------------
   src: 'curatio' | 'external' — mirrors the mobile SourceTag vocabulary.
   monthsAgo drives the period filter without live dates.
   unread: true (2026-09-17) — not opened yet; see the read store above. Seeded on
   the newest rows only (a fresh sync), so the counters differ per section. */
export const ANALYSES = [
  { id: 'an1', unread: true, p: 'g', date: L('12 ნოე', '12 Nov'), monthsAgo: 0, name: L('სისხლის საერთო ანალიზი', 'Complete blood count'), cat: 'blood', clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', status: 'norm' },
  { id: 'an2', unread: true, p: 'g', date: L('2 ნოე', '2 Nov'), monthsAgo: 0, name: L('ჰორმონები — TSH, T4', 'Hormones — TSH, T4'), cat: 'hormones', clinic: L('კურაციო ვაკეში', 'Curatio Vake'), src: 'curatio', status: 'warn' },
  { id: 'an3', p: 'g', date: L('21 ოქტ', '21 Oct'), monthsAgo: 1, name: L('ბიოქიმია — ლიპიდური სპექტრი', 'Biochemistry — lipid panel'), cat: 'biochem', clinic: 'BMSC', src: 'external', status: 'crit' },
  { id: 'an4', p: 'g', date: L('9 ოქტ', '9 Oct'), monthsAgo: 1, name: L('შარდის საერთო ანალიზი', 'Urinalysis'), cat: 'urine', clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', status: 'norm' },
  { id: 'an5', p: 'g', date: L('28 სექ', '28 Sep'), monthsAgo: 2, name: L('გლუკოზა უზმოზე', 'Fasting glucose'), cat: 'biochem', clinic: L('კურაციო ვაკეში', 'Curatio Vake'), src: 'curatio', status: 'norm' },
  { id: 'an6', p: 'g', date: L('14 ივლ', '14 Jul'), monthsAgo: 4, name: L('ვიტამინი D', 'Vitamin D'), cat: 'blood', clinic: 'BMSC', src: 'external', status: 'warn' },
  { id: 'an7', p: 'g', date: L('2 მაი', '2 May'), monthsAgo: 6, name: L('სისხლის საერთო ანალიზი', 'Complete blood count'), cat: 'blood', clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', status: 'norm' },
  { id: 'an8', p: 'g', date: L('11 თებ', '11 Feb'), monthsAgo: 9, name: L('ბიოქიმია — ღვიძლის პანელი', 'Biochemistry — liver panel'), cat: 'biochem', clinic: L('კურაციო ვაკეში', 'Curatio Vake'), src: 'curatio', status: 'norm' },
  { id: 'an9', unread: true, p: 'e', date: L('18 ოქტ', '18 Oct'), monthsAgo: 1, name: L('სისხლის საერთო ანალიზი', 'Complete blood count'), cat: 'blood', clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', status: 'norm' },
  { id: 'an10', p: 'e', date: L('3 სექ', '3 Sep'), monthsAgo: 2, name: L('ალერგოპანელი', 'Allergy panel'), cat: 'blood', clinic: 'BMSC', src: 'external', status: 'warn' },
  /* an11–an14 (2026-09-08): Giorgi's analyses were 8 rows against a PAGE of 8, so
     pagination could never appear. These four take him to 12 — two pages — AND
     reach back into 2024, so the new year in the date column has something to say.
     Same cat/clinic/src taxonomy as the rows above; nothing new invented. */
  { id: 'an11', p: 'g', date: L('3 დეკ', '3 Dec'), monthsAgo: 11, name: L('ფერიტინი', 'Ferritin'), cat: 'blood', clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', status: 'norm' },
  { id: 'an12', p: 'g', date: L('19 ნოე', '19 Nov'), monthsAgo: 12, name: L('ბიოქიმია — თირკმლის პანელი', 'Biochemistry — kidney panel'), cat: 'biochem', clinic: 'BMSC', src: 'external', status: 'warn' },
  { id: 'an13', p: 'g', date: L('5 სექ', '5 Sep'), monthsAgo: 14, name: L('ჰორმონები — კორტიზოლი', 'Hormones — cortisol'), cat: 'hormones', clinic: L('კურაციო ვაკეში', 'Curatio Vake'), src: 'curatio', status: 'norm' },
  { id: 'an14', p: 'g', date: L('22 ივლ', '22 Jul'), monthsAgo: 16, name: L('შარდის საერთო ანალიზი', 'Urinalysis'), cat: 'urine', clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', status: 'norm' },
]

export const MEDS = [
  { id: 'm1', p: 'g', date: L('12 ნოე', '12 Nov'), monthsAgo: 0, name: L('ლიზინოპრილი 10 მგ', 'Lisinopril 10 mg'), doctor: DOCTOR.name, ref: 'EED 336 135 / 23', expiryDays: 7, chronic: true, src: 'curatio' },
  { id: 'm2', p: 'g', date: L('2 ნოე', '2 Nov'), monthsAgo: 0, name: L('ვიტამინი D 2000 IU', 'Vitamin D 2000 IU'), doctor: DOCTOR.name, ref: 'EED 336 140 / 23', expiryDays: 41, chronic: false, src: 'curatio' },
  { id: 'm3', p: 'g', date: L('21 ოქტ', '21 Oct'), monthsAgo: 1, name: L('ომეპრაზოლი 20 მგ', 'Omeprazole 20 mg'), doctor: L('გ. კაპანაძე', 'G. Kapanadze'), ref: 'EED 335 902 / 23', expiryDays: null, chronic: false, src: 'curatio' },
]

export const VISITS = [
  { id: 'v1', unread: true, p: 'g', date: L('2 ნოე', '2 Nov'), monthsAgo: 0, name: L('ოჯახის ექიმის ვიზიტი', 'Family doctor visit'), kind: 'inclinic', doctor: DOCTOR.name, clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', form100: true },
  { id: 'v2', p: 'g', date: L('12 ოქტ', '12 Oct'), monthsAgo: 1, name: L('დისტანციური კონსულტაცია', 'Online consultation'), kind: 'remote', doctor: DOCTOR.name, clinic: L('კურაციო', 'Curatio'), src: 'curatio', form100: false },
  { id: 'v3', p: 'g', date: L('28 სექ', '28 Sep'), monthsAgo: 2, name: L('ენდოკრინოლოგის ვიზიტი', 'Endocrinologist visit'), kind: 'inclinic', doctor: L('თ. ბერიძე', 'T. Beridze'), clinic: L('კურაციო ვაკეში', 'Curatio Vake'), src: 'curatio', form100: true },
  { id: 'v4', p: 'g', date: L('14 ივლ', '14 Jul'), monthsAgo: 4, name: L('ოჯახის ექიმის ვიზიტი', 'Family doctor visit'), kind: 'inclinic', doctor: DOCTOR.name, clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', form100: true },
  { id: 'v5', p: 'e', date: L('18 ოქტ', '18 Oct'), monthsAgo: 1, name: L('პედიატრის ვიზიტი', 'Pediatrician visit'), kind: 'inclinic', doctor: L('ლ. წიკლაური', 'L. Tsiklauri'), clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', form100: false },
]

export const forPerson = (rows, personId) => rows.filter((r) => r.p === personId)

/* Every record of a person across the three sections — the automatic handover's scope. */
export const allRecordIds = (personId) =>
  [...forPerson(ANALYSES, personId), ...forPerson(MEDS, personId), ...forPerson(VISITS, personId)].map((r) => r.id)
