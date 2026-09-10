/* ჩემი კურაციო (web) — demo data + the demo-state store.

   All ILLUSTRATIVE (Rule/locked decision: clinical content like „ლიზინოპრილი
   10 მგ" is a placeholder — real medical copy comes from GPI). Person model
   mirrors the dashboard's: the holder first, family members as first-class
   rows. Record vocabulary mirrors the mobile module's data so the two
   platforms describe one truth. */

import { lang } from '../i18n/index.js'

const L = (ka, en) => (lang === 'en' ? en : ka)
const face = (id) => `https://images.unsplash.com/${id}?w=96&h=96&fit=crop&crop=faces&auto=format&q=60`

/* ---- Demo-state store ------------------------------------------------------
   visit-day and uninsured are STATES of one account, not separate pages, and a
   reviewer flips them from the demo bar. sessionStorage (not React state) so
   the dashboard and the section — separate routes — read the same account. */
const DK = { visit: 'gpi.dash.visitDay', unins: 'gpi.dash.uninsured', attach: 'gpi.dash.attachments', arrived: 'gpi.dash.arrived', early: 'gpi.dash.checkinEarly', shares: 'gpi.dash.shares' }
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
  (d.id === DOCTOR.id ? DOCTOR.name : TRANSFER_DOCTORS.find((x) => x.id === d.id)?.name) ?? d.name
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
  checkinEarly: () => sessionStorage.getItem(DK.early) === '1',
  setCheckinEarly: (on) => (on ? sessionStorage.setItem(DK.early, '1') : sessionStorage.removeItem(DK.early)),
}

/* ---- F-01 · arrival check-in („მე მოვედი") --------------------------------
   Mobile stakeholder comment #5 (2026-08-18), ported to the web ticket box on
   2026-09-07 at the user's request. Qmatic separates ACTIVATING a ticket from
   physically ARRIVING; the clinic needs the second signal before it can call
   the patient.
   ⚠️ WEB HAS ITS OWN KEY — `gpi.dash.arrived`, never mobile's `mgaArrived`
   (Rule 5, the same split the OTP gate already makes). Per person, because the
   ticket is person-scoped; sessionStorage, so the state survives navigation
   inside a session but a fresh tab resets the scenario.
   ⚠️ TIME-GATED ON WEB, unlike mobile (user's call, 2026-09-07): a desktop user
   is usually at a desk, not in the waiting room, and a check-in from home puts a
   patient in the queue who is not there. Mobile corroborates with a geolocation
   push near the clinic; a browser has nothing, so the window is the guard.
   CHECKIN_OPENS_MIN is the production rule this demo switch stands for. */
export const CHECKIN_OPENS_MIN = 30

function arrivedMap() {
  try {
    return JSON.parse(sessionStorage.getItem(DK.arrived)) || {}
  } catch {
    return {}
  }
}
/* The stamp is the patient's evidence, so it is stored, not re-derived. */
export function arrivedAtFor(personId) {
  return arrivedMap()[personId] || null
}
export function setArrived(personId, at) {
  sessionStorage.setItem(DK.arrived, JSON.stringify({ ...arrivedMap(), [personId]: at }))
}
export function clearArrived() {
  sessionStorage.removeItem(DK.arrived)
}

/* ---- People ---------------------------------------------------------------- */
export const PERSONS = [
  /* Portraits: the same Unsplash faces the mobile module uses for the family (Rule 1). */
  { id: 'g', name: L('გიორგი გიორგაძე', 'Giorgi Giorgadze'), ocin: 'OCIN 23213/22', holder: true, photo: face('photo-1519238263530-99bdd11df2ea') },
  { id: 'e', name: L('ელენე გიორგაძე', 'Elene Giorgadze'), ocin: 'OCIN 23213/23', photo: face('photo-1503454537195-1dcabb73ffb9') },
]

export const DOCTOR = {
  id: 'pd',
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
   monthsAgo drives the period filter without live dates. */
export const ANALYSES = [
  { id: 'an1', p: 'g', date: L('12 ნოე', '12 Nov'), monthsAgo: 0, name: L('სისხლის საერთო ანალიზი', 'Complete blood count'), cat: 'blood', clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', status: 'norm' },
  { id: 'an2', p: 'g', date: L('2 ნოე', '2 Nov'), monthsAgo: 0, name: L('ჰორმონები — TSH, T4', 'Hormones — TSH, T4'), cat: 'hormones', clinic: L('კურაციო ვაკეში', 'Curatio Vake'), src: 'curatio', status: 'warn' },
  { id: 'an3', p: 'g', date: L('21 ოქტ', '21 Oct'), monthsAgo: 1, name: L('ბიოქიმია — ლიპიდური სპექტრი', 'Biochemistry — lipid panel'), cat: 'biochem', clinic: 'BMSC', src: 'external', status: 'crit' },
  { id: 'an4', p: 'g', date: L('9 ოქტ', '9 Oct'), monthsAgo: 1, name: L('შარდის საერთო ანალიზი', 'Urinalysis'), cat: 'urine', clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', status: 'norm' },
  { id: 'an5', p: 'g', date: L('28 სექ', '28 Sep'), monthsAgo: 2, name: L('გლუკოზა უზმოზე', 'Fasting glucose'), cat: 'biochem', clinic: L('კურაციო ვაკეში', 'Curatio Vake'), src: 'curatio', status: 'norm' },
  { id: 'an6', p: 'g', date: L('14 ივლ', '14 Jul'), monthsAgo: 4, name: L('ვიტამინი D', 'Vitamin D'), cat: 'blood', clinic: 'BMSC', src: 'external', status: 'warn' },
  { id: 'an7', p: 'g', date: L('2 მაი', '2 May'), monthsAgo: 6, name: L('სისხლის საერთო ანალიზი', 'Complete blood count'), cat: 'blood', clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', status: 'norm' },
  { id: 'an8', p: 'g', date: L('11 თებ', '11 Feb'), monthsAgo: 9, name: L('ბიოქიმია — ღვიძლის პანელი', 'Biochemistry — liver panel'), cat: 'biochem', clinic: L('კურაციო ვაკეში', 'Curatio Vake'), src: 'curatio', status: 'norm' },
  { id: 'an9', p: 'e', date: L('18 ოქტ', '18 Oct'), monthsAgo: 1, name: L('სისხლის საერთო ანალიზი', 'Complete blood count'), cat: 'blood', clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', status: 'norm' },
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
  { id: 'v1', p: 'g', date: L('2 ნოე', '2 Nov'), monthsAgo: 0, name: L('ოჯახის ექიმის ვიზიტი', 'Family doctor visit'), kind: 'inclinic', doctor: DOCTOR.name, clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', form100: true },
  { id: 'v2', p: 'g', date: L('12 ოქტ', '12 Oct'), monthsAgo: 1, name: L('დისტანციური კონსულტაცია', 'Online consultation'), kind: 'remote', doctor: DOCTOR.name, clinic: L('კურაციო', 'Curatio'), src: 'curatio', form100: false },
  { id: 'v3', p: 'g', date: L('28 სექ', '28 Sep'), monthsAgo: 2, name: L('ენდოკრინოლოგის ვიზიტი', 'Endocrinologist visit'), kind: 'inclinic', doctor: L('თ. ბერიძე', 'T. Beridze'), clinic: L('კურაციო ვაკეში', 'Curatio Vake'), src: 'curatio', form100: true },
  { id: 'v4', p: 'g', date: L('14 ივლ', '14 Jul'), monthsAgo: 4, name: L('ოჯახის ექიმის ვიზიტი', 'Family doctor visit'), kind: 'inclinic', doctor: DOCTOR.name, clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', form100: true },
  { id: 'v5', p: 'e', date: L('18 ოქტ', '18 Oct'), monthsAgo: 1, name: L('პედიატრის ვიზიტი', 'Pediatrician visit'), kind: 'inclinic', doctor: L('ლ. წიკლაური', 'L. Tsiklauri'), clinic: L('კურაციო საბურთალოზე', 'Curatio Saburtalo'), src: 'curatio', form100: false },
]

export const forPerson = (rows, personId) => rows.filter((r) => r.p === personId)
