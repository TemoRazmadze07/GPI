/* Mock data + session state for the MyGPI mobile health dashboard and Curatio pages.

   BILINGUAL SINCE 2026-08-27. The records themselves live in ./data.ka.js (primary)
   and ./data.en.js (mirror); this module picks one with the app-wide locale and
   re-exports every constant under its original name, so all twenty-odd screens keep
   their existing `import { V2_HISTORY } from './data.js'` untouched.

   What stays HERE, deliberately:
   · locale-NEUTRAL constants — queue numbers, counts, feature flags. A ticket number
     and a record count read the same in both languages; duplicating them into two
     tables would only create two places to forget.
   · every piece of SESSION STATE (person scope, uploads, attachments, dismissed meds,
     picked doctor, arrival check-in). None of it is language-dependent, and keeping
     one store means switching language never loses a demo in progress.

   ⚠ Language switching RELOADS the page (see ../i18n/index.js), so nothing here has to
   react to a change at runtime — but the sessionStorage written before the switch does
   survive it, which is why dateRank below reads BOTH locales' month names. */

import { ka } from './data.ka.js'
import { en } from './data.en.js'
import { lang } from '../i18n/index.js'

const DS = lang === 'en' ? en : ka

/* ── Localised records, re-exported under their original names ──────────────── */
export const PERSONS = DS.PERSONS
export const BOOKING = DS.BOOKING
export const NEXT_BOOKING = DS.NEXT_BOOKING
export const CLINIC = DS.CLINIC
export const REFERRAL = DS.REFERRAL
export const CHRONIC = DS.CHRONIC
export const DOCTOR = DS.DOCTOR
export const V2_PERSONS = DS.V2_PERSONS
export const V2_TODAY = DS.V2_TODAY
export const V2_HISTORY_ALERT = DS.V2_HISTORY_ALERT
export const V2_BOOKINGS = DS.V2_BOOKINGS
export const NEXT_REMINDER = DS.NEXT_REMINDER
export const PREVENTION_NEXT = DS.PREVENTION_NEXT
export const TRANSFER_DOCTORS = DS.TRANSFER_DOCTORS
export const V2_PREVENTION = DS.V2_PREVENTION
export const V2_ANALYSIS_CATS = DS.V2_ANALYSIS_CATS
export const V2_HISTORY = DS.V2_HISTORY
export const HISTORY = DS.HISTORY
export const DOCSEL_CITIES = DS.DOCSEL_CITIES
export const DOCSEL_CLINICS = DS.DOCSEL_CLINICS
export const SELECT_DOCTORS = DS.SELECT_DOCTORS
/* Prefills the upload sheet's date field — a record, so it belongs to the locale. */
export const UPLOAD_DEFAULT_DATE = DS.UPLOAD_DEFAULT_DATE

/* ── Locale-neutral ─────────────────────────────────────────────────────────── */

export const QUEUE = { number: 'A042', waitMin: 12, ahead: 3 }

export const COUNTS = { bookings: 8, referrals: 5, reminders: 1 }

/* #4 (stakeholder comments 2026-08-18) — REAL-TIME AVAILABILITY IS MVP2.
   The „Online" dot and „ხელმისაწვდომია ახლა" were designed FOR the online-
   consultation feature, which ships in MVP2. Showing them in MVP1 promises a
   channel the app cannot deliver. A working-hours-derived indicator was
   considered and REJECTED (user + me, 2026-08-18): it still reads as presence,
   so it misleads more than it informs — the A4 info grid's working days /
   working hours carry that information honestly instead.
   Kept as a FLAG, not deleted: MVP2 flips this one boolean to restore every
   badge. Applies to V2 (canonical); V1 is frozen and untouched. */
export const ONLINE_STATUS_ENABLED = false

/* Curatio hub — history counts per person scope. */
export const HISTORY_COUNTS = {
  all: { analyses: 12, prescriptions: 4, visits: 9, docs: 3 },
  p1: { analyses: 8, prescriptions: 3, visits: 6, docs: 2 },
  p2: { analyses: 4, prescriptions: 1, visits: 3, docs: 1 },
}

/* ── PERSON SCOPE (user, 2026-08-27) ──────────────────────────────────────────
   The insured-person selector moved INTO the history section pages (it replaced
   the per-section upload entry), so the choice can no longer be one screen's local
   state: a person picked on the კურაციო dash must still be the one whose records
   the section lists, and switching there must hold on the way back. One store,
   read by the dash, the history hub and the section pages.
   sessionStorage = the same lifetime as the OTP unlock. Changing person NEVER
   re-locks (user: „no need to have another verification when we change the
   person") — the passcode gates the family's protected zone as a whole, and
   re-asking per member would punish the switch we just made easier. */
const PERSON_KEY = 'mgaPersonScope'

export function getPersonScope() {
  const id = sessionStorage.getItem(PERSON_KEY)
  /* an unknown id (stale storage, hand-typed) falls back to the policyholder
     rather than rendering a person-less screen */
  return V2_PERSONS.some((p) => p.id === id) ? id : V2_PERSONS[0].id
}

export function setPersonScope(id) {
  try {
    sessionStorage.setItem(PERSON_KEY, id)
  } catch {
    /* private mode — the scope just won't survive navigation */
  }
}

/* Records carry the person's FIRST name (that is what a list line needs to read);
   the selector speaks ids. One map here, so no screen re-derives it.
   Ids are locale-stable ('tp' / 'np' / 'ap'), so a scope chosen in one language
   still resolves after a language switch — it just returns the other spelling. */
export function personFirstName(id) {
  const p = V2_PERSONS.find((x) => x.id === id)
  return p ? p.name.split(' ')[0] : ''
}

/* #11 follow-up (user, 2026-08-18) — meds the patient marked „აღარ მჭირდება".
   Same session-scoped store as the uploads; reversible from the row.
   ⚠ Keyed by medication NAME, and the trade-name meds ("Metformin 500mg") are
   spelled identically in both tables — but a med whose name IS translated
   ("Vitamin D3" / „ვიტამინი D3") loses its dismissed flag across a language
   switch. Acceptable for a prototype: the flag is demo state, and the row
   reappears in its default, honest form rather than in a wrong one. */
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
/* Per-record attachments (2026-08-26): same session store shape as the uploads, but
   keyed by the record they hang off.
   ⚠️ The key MUST match whatever makes that record unique in its own list — variadic
   for exactly that reason. Title+date is NOT enough in analyses: the same test exists
   twice on the same date, once done at Curatio and once uploaded from another clinic
   (the list key carries `clinic || src` for the same reason). Found the hard way —
   a document attached to one biochemistry result rendered on both. */
const ATTACH_KEY = 'mgaAttachments'

export const recKey = (...parts) => parts.filter(Boolean).join('__')

export function getAttachments() {
  try {
    return JSON.parse(sessionStorage.getItem(ATTACH_KEY) || '{}')
  } catch {
    return {}
  }
}

export function addAttachment(key, rec) {
  try {
    const all = getAttachments()
    sessionStorage.setItem(ATTACH_KEY, JSON.stringify({ ...all, [key]: [...(all[key] || []), rec] }))
  } catch {
    /* private mode — the prototype just forgets, same as the uploads store */
  }
}

/* No arg = every upload; with a kind, only that section's. Records saved before
   the type field existed carry no `kind` — they were all analyses, so that is the
   legacy default. */
export function getUploads(kind) {
  const all = getAllUploads()
  return kind ? all.filter((u) => (u.kind || 'analyses') === kind) : all
}

function getAllUploads() {
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
    sessionStorage.removeItem(ATTACH_KEY) /* attachments are uploads too — reset together */
    sessionStorage.removeItem(UPLOADS_KEY)
  } catch {
    /* ignore */
  }
}

/* Short month → index, so records from different sources sort together.
   #13's re-homed rows were simply appended, which broke the newest-first reading
   (22 აპრ → 14 აპრ → 3 აპრ → 15 თებ → 2 მარ → 14 აპრ → 2 მარ).

   BOTH locales' month names are in the map, not just the active one, and that is
   deliberate: a document uploaded during the demo is stored in sessionStorage with
   the date the user typed, and that store survives the reload a language switch
   does. Reading only the active locale's names would silently sort every
   pre-switch upload to the bottom of the list. */
const MONTH_RANK = Object.fromEntries(
  [...ka.MONTHS, ...en.MONTHS].map((m, i) => [m.toLowerCase(), i % 12])
)

export function dateRank(d) {
  const m = String(d || '').trim().match(/^(\d{1,2})\s+(\S+)/)
  if (!m) return -1
  const mi = MONTH_RANK[m[2].toLowerCase()]
  return mi === undefined ? -1 : mi * 100 + Number(m[1])
}

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
     hard-coded default doctor, so A4 showed Nino Gigauri's cabinet and hours beside
     the newly picked doctor's clinic, contradicting the confirmation sheet the user
     had just accepted (audit 2026-08-18). */
  sessionStorage.setItem(
    PICK_KEY,
    JSON.stringify({
      initial: d.initial,
      name: d.name,
      photo: d.photo,
      /* The network name comes from the locale table — it used to be a hard-coded
         „კურაციო" here, which is how a Georgian word reached the English build. */
      role: d.spec + ' · ' + DS.NETWORK,
      clinic: d.clinic,
      /* `hours` is one string carrying both („ორ — პარ · 09:00—15:00" / "Mon — Fri ·
         09:00—15:00"), while the detail screen has a cell for each — split it rather
         than dumping the whole thing into one cell and leaving the other blank.
         Both tables use the same ' · ' separator, so this split is locale-safe. */
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
