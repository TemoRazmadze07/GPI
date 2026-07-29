/* Mock booking data for Step 2 — the on-page 3-column workspace
   (doctor list · month calendar · time column). Georgian.

   Model notes:
   - A doctor works at ONE OR MORE clinics (cross-clinic availability).
   - Availability is per (doctor, date, clinic) → a list of slot RANGES.
   - Clinic colour is a categorical `tone` (1|2|3) → clinic/* tokens (tokens.css).
   - Availability is generated deterministically so the prototype is stable.

   Localisation: the Georgian labels below are the source of truth for STRUCTURE and
   IDs. When the session runs in English, `./booking.en.js` supplies replacement
   labels keyed by the same IDs and `loc()` merges them in at module load. The
   availability engine hashes on IDs, never on labels, so it is language-agnostic and
   both locales generate identical slots. */

import { lang } from '../i18n/index.js'
import * as EN from './booking.en.js'

const isEn = lang === 'en'

/* Merge an English label map (keyed by the row's `value`/`id`) over a data array.
   In Georgian this is the identity function — the ka data is returned untouched. */
const loc = (rows, map, key = 'value') =>
  isEn ? rows.map((r) => ({ ...r, ...(map[r[key]] || {}) })) : rows

/* English label maps store `label` for the simple lists. */
const asLabel = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, { label: v }]))

export const cities = loc([
  { value: 'tbilisi', label: 'თბილისი' },
  { value: 'batumi', label: 'ბათუმი' },
  { value: 'kutaisi', label: 'ქუთაისი' },
], asLabel(EN.cityLabels))

/* Specialist "direction" = medical specialty/profession. */
export const specialties = loc([
  { value: 'ophthalmology', label: 'ოფთალმოლოგი' },
  { value: 'gynecology', label: 'გინეკოლოგი' },
  { value: 'dermatology', label: 'დერმატოლოგი' },
  { value: 'cardiology', label: 'კარდიოლოგი' },
  { value: 'neurology', label: 'ნევროლოგი' },
], asLabel(EN.specialtyLabels))

/* Instrumental "direction" = type of study/procedure. */
export const instrumentalTypes = loc([
  { value: 'ultrasound', label: 'ექოსკოპია (ულტრაბგერა)' },
  { value: 'ecg', label: 'ელექტროკარდიოგრამა (ეკგ)' },
  { value: 'xray', label: 'რენტგენი' },
  { value: 'mri', label: 'მაგნიტურ-რეზონანსული (მრტ)' },
], asLabel(EN.studyLabels))

/* Options for the direction selector, by appointment type. */
export const directionsFor = (type) =>
  type === 'specialist' ? specialties : type === 'instrumental' ? instrumentalTypes : []

/* Clinics. The first two (Curatio Saburtalo/Vake) are COLOUR-CODED — tone = link blue
   (1) / brand purple (2) — and are the ones the chip flows (returning personal +
   specialist/instrumental) use, plus the calendar colour-coding. The rest have NO tone:
   they exist to demo a many-clinic network and are surfaced ONLY in the first-time
   personal DROPDOWN (which drops per-clinic calendar colours — too many to colour-code). */
export const clinics = loc([
  { value: 'saburtalo', label: 'კურაციო საბურთალოზე', short: 'საბურთალო', address: 'თბილისი, ო. ლორთქიფანიძის ქ. #31', tone: 1 },
  { value: 'vake', label: 'კურაციო ვაკეში', short: 'ვაკე', address: 'თბილისი, ჭავჭავაძის გამზ. #37', tone: 2 },
  { value: 'gldani', label: 'კურაციო გლდანი', short: 'გლდანი', address: 'თბილისი, ხიზანიშვილის ქ. #7' },
  { value: 'isani', label: 'კურაციო ისანი', short: 'ისანი', address: 'თბილისი, ქეთევან წამებულის გამზ. #52' },
  { value: 'didube', label: 'კურაციო დიდუბე', short: 'დიდუბე', address: 'თბილისი, ცერეთლის გამზ. #116' },
  { value: 'varketili', label: 'კურაციო ვარკეთილი', short: 'ვარკეთილი', address: 'თბილისი, ჯავახეთის ქ. #21' },
  { value: 'mukhiani', label: 'კურაციო მუხიანი', short: 'მუხიანი', address: 'თბილისი, მუხიანის დას. IVა მ/რ #4' },
  { value: 'ortachala', label: 'კურაციო ორთაჭალა', short: 'ორთაჭალა', address: 'თბილისი, გორგასლის ქ. #93' },
], EN.clinicLabels)

export const allClinicValues = clinics.map((c) => c.value)
export const clinicByValue = (v) => clinics.find((c) => c.value === v)
/* The colour-coded clinics the chip flows render (specialist/returning). Keeps the
   chip row from overflowing with the full many-clinic list. */
export const chipClinics = clinics.filter((c) => c.tone)

/* type: personal | specialist | instrumental.
   `role` is the label shown on the slim doctor row. */
export const doctors = loc([
  { id: 'd1', name: 'ნინო ნინოშვილი', type: 'personal', role: 'პირადი ექიმი', clinics: ['saburtalo', 'vake'], languages: ['KA', 'EN', 'RU'], experience: 12, rating: 4.8, reviews: 214, bio: 'ოჯახის ექიმი, თბილისის სახელმწიფო სამედიცინო უნივერსიტეტი. პრევენციული მედიცინა და ქრონიკული დაავადებების მართვა.', avatar: 5 },
  { id: 'd2', name: 'მარიამ ნოზაძე', type: 'personal', role: 'პირადი ექიმი', clinics: ['vake'], languages: ['KA', 'EN'], experience: 8, rating: 4.7, reviews: 180, bio: 'ოჯახის ექიმი. პროფილაქტიკური გასინჯვები და ვაქცინაცია.', avatar: 16 },
  { id: 'd3', name: 'ანა ბერიძე', type: 'personal', role: 'პირადი ექიმი', clinics: ['saburtalo', 'vake'], languages: ['KA', 'RU'], experience: 15, rating: 4.9, reviews: 320, bio: 'ოჯახის ექიმი, 15 წლის გამოცდილება. შინაგანი მედიცინა.', avatar: 31 },
  { id: 'd4', name: 'გიორგი ტატიშვილი', type: 'personal', role: 'პირადი ექიმი', clinics: ['saburtalo'], languages: ['KA', 'EN', 'DE'], experience: 10, rating: 4.6, reviews: 95, bio: 'ოჯახის ექიმი. გერმანიაში გავლილი რეზიდენტურა.', avatar: 12 },
  { id: 'd5', name: 'დავით კაპანაძე', type: 'personal', role: 'პირადი ექიმი', clinics: ['saburtalo'], languages: ['KA'], experience: 6, rating: 4.5, reviews: 60, bio: 'ოჯახის ექიმი. ახალგაზრდა სპეციალისტი.', avatar: 60, bookedOutDays: 10 },
  /* ---- personal doctors at the additional clinics (first-time browse only) ---- */
  { id: 'd27', name: 'ლალი ორბელაძე', type: 'personal', role: 'პირადი ექიმი', clinics: ['gldani'], languages: ['KA', 'RU'], experience: 9, rating: 4.6, reviews: 88, bio: 'ოჯახის ექიმი. პრევენცია და ქრონიკული დაავადებების მართვა.', avatar: 21 },
  { id: 'd28', name: 'ზაალ მღებრიშვილი', type: 'personal', role: 'პირადი ექიმი', clinics: ['isani', 'didube'], languages: ['KA', 'EN'], experience: 13, rating: 4.7, reviews: 130, bio: 'ოჯახის ექიმი, შინაგანი მედიცინა.', avatar: 3 },
  { id: 'd29', name: 'ეთერ ცქიტიშვილი', type: 'personal', role: 'პირადი ექიმი', clinics: ['didube'], languages: ['KA'], experience: 7, rating: 4.5, reviews: 54, bio: 'ოჯახის ექიმი. პროფილაქტიკური გასინჯვები.', avatar: 24 },
  { id: 'd30', name: 'ბექა შონია', type: 'personal', role: 'პირადი ექიმი', clinics: ['varketili'], languages: ['KA', 'EN'], experience: 11, rating: 4.8, reviews: 142, bio: 'ოჯახის ექიმი. ქრონიკული დაავადებების მართვა.', avatar: 15 },
  { id: 'd31', name: 'ია მელაძე', type: 'personal', role: 'პირადი ექიმი', clinics: ['mukhiani', 'gldani'], languages: ['KA', 'RU'], experience: 15, rating: 4.9, reviews: 205, bio: 'ოჯახის ექიმი, 15 წლის გამოცდილება.', avatar: 40 },
  { id: 'd32', name: 'ვასილ ჯაფარიძე', type: 'personal', role: 'პირადი ექიმი', clinics: ['ortachala'], languages: ['KA', 'EN', 'RU'], experience: 10, rating: 4.6, reviews: 77, bio: 'ოჯახის ექიმი. პროფილაქტიკა და ვაქცინაცია.', avatar: 6 },
  { id: 'd6', name: 'თამარ კიკნაძე', type: 'specialist', specialtyValue: 'gynecology', role: 'გინეკოლოგი', clinics: ['vake', 'saburtalo'], languages: ['KA', 'EN'], experience: 11, rating: 4.8, reviews: 240, bio: 'გინეკოლოგი. ულტრაბგერითი დიაგნოსტიკა.', avatar: 9 },
  { id: 'd7', name: 'ლევან ჩხეიძე', type: 'specialist', specialtyValue: 'dermatology', role: 'დერმატოლოგი', clinics: ['vake'], languages: ['KA'], experience: 9, rating: 4.4, reviews: 70, bio: 'დერმატოლოგი. კანის დაავადებები.', avatar: 13 },
  { id: 'd8', name: 'ნანა გელაშვილი', type: 'specialist', specialtyValue: 'ophthalmology', role: 'ოფთალმოლოგი', clinics: ['saburtalo'], languages: ['KA', 'RU'], experience: 14, rating: 4.9, reviews: 210, bio: 'ოფთალმოლოგი. მხედველობის კორექცია.', avatar: 25 },
  { id: 'd9', name: 'ზურაბ მაისურაძე', type: 'specialist', specialtyValue: 'cardiology', role: 'კარდიოლოგი', clinics: ['vake', 'saburtalo'], languages: ['KA', 'EN'], experience: 18, rating: 4.7, reviews: 300, bio: 'კარდიოლოგი. გულ-სისხლძარღვთა სისტემა.', avatar: 33 },
  { id: 'd10', name: 'მაკა ფხალაძე', type: 'instrumental', studyValue: 'ultrasound', role: 'ულტრაბგერითი დიაგნოსტიკა', clinics: ['saburtalo', 'vake'], languages: ['KA', 'EN', 'RU'], experience: 12, rating: 4.8, reviews: 140, bio: 'ულტრაბგერითი დიაგნოსტიკა — მუცლის ღრუ, ფარისებრი ჯირკვალი.', avatar: 48 },
  { id: 'd14', name: 'ლაშა გოგიჩაიშვილი', type: 'instrumental', studyValue: 'ultrasound', role: 'ულტრაბგერითი დიაგნოსტიკა', clinics: ['vake'], languages: ['KA', 'RU'], experience: 9, rating: 4.7, reviews: 96, bio: 'ულტრაბგერითი დიაგნოსტიკა.', avatar: 20 },
  { id: 'd11', name: 'თამთა ბერაია', type: 'instrumental', studyValue: 'ecg', role: 'ფუნქციური დიაგნოსტიკა', clinics: ['vake', 'saburtalo'], languages: ['KA'], experience: 8, rating: 4.6, reviews: 80, bio: 'ფუნქციური დიაგნოსტიკა — ეკგ, ჰოლტერი.', avatar: 52 },
  { id: 'd12', name: 'ვაჟა კიკნაძე', type: 'instrumental', studyValue: 'xray', role: 'რადიოლოგი', clinics: ['saburtalo'], languages: ['KA'], experience: 15, rating: 4.5, reviews: 64, bio: 'რადიოლოგი — რენტგენოგრაფია.', avatar: 11 },
  { id: 'd13', name: 'გიორგი ჩიქოვანი', type: 'instrumental', studyValue: 'mri', role: 'რადიოლოგი', clinics: ['vake'], languages: ['KA', 'EN'], experience: 17, rating: 4.9, reviews: 120, bio: 'რადიოლოგი — მაგნიტურ-რეზონანსული ტომოგრაფია.', avatar: 36 },

  /* ---- additional specialists (2–3 per specialty) ---- */
  { id: 'd15', name: 'თეა ბაქრაძე', type: 'specialist', specialtyValue: 'ophthalmology', role: 'ოფთალმოლოგი', clinics: ['saburtalo'], languages: ['KA', 'EN'], experience: 13, rating: 4.8, reviews: 176, bio: 'ოფთალმოლოგი. ბავშვთა და მოზრდილთა მხედველობა.', avatar: 26 },
  { id: 'd16', name: 'ვახტანგ კვირიკაშვილი', type: 'specialist', specialtyValue: 'ophthalmology', role: 'ოფთალმოლოგი', clinics: ['vake', 'saburtalo'], languages: ['KA', 'RU'], experience: 20, rating: 4.9, reviews: 305, bio: 'ოფთალმოლოგი-ქირურგი. კატარაქტის მკურნალობა.', avatar: 51 },
  { id: 'd17', name: 'ეკა ჩხარტიშვილი', type: 'specialist', specialtyValue: 'gynecology', role: 'გინეკოლოგი', clinics: ['saburtalo'], languages: ['KA', 'EN'], experience: 9, rating: 4.7, reviews: 142, bio: 'გინეკოლოგი. ორსულობის მართვა.', avatar: 41 },
  { id: 'd18', name: 'სალომე გოგუა', type: 'specialist', specialtyValue: 'dermatology', role: 'დერმატოლოგი', clinics: ['vake', 'saburtalo'], languages: ['KA', 'EN', 'RU'], experience: 7, rating: 4.6, reviews: 88, bio: 'დერმატო-ვენეროლოგი. ესთეტიკური დერმატოლოგია.', avatar: 47 },
  { id: 'd19', name: 'ირაკლი ბერიძე', type: 'specialist', specialtyValue: 'cardiology', role: 'კარდიოლოგი', clinics: ['saburtalo'], languages: ['KA', 'EN'], experience: 16, rating: 4.8, reviews: 260, bio: 'კარდიოლოგი. არითმიების მკურნალობა.', avatar: 14 },
  { id: 'd20', name: 'მაია წიკლაური', type: 'specialist', specialtyValue: 'cardiology', role: 'კარდიოლოგი', clinics: ['vake'], languages: ['KA', 'RU'], experience: 11, rating: 4.7, reviews: 150, bio: 'კარდიოლოგი. არტერიული ჰიპერტენზია.', avatar: 32 },
  { id: 'd21', name: 'გელა ქავთარაძე', type: 'specialist', specialtyValue: 'neurology', role: 'ნევროლოგი', clinics: ['saburtalo', 'vake'], languages: ['KA', 'EN', 'DE'], experience: 18, rating: 4.9, reviews: 280, bio: 'ნევროლოგი. თავის ტკივილისა და მიგრენის მართვა.', avatar: 8 },
  { id: 'd22', name: 'ნათია ჯანელიძე', type: 'specialist', specialtyValue: 'neurology', role: 'ნევროლოგი', clinics: ['vake'], languages: ['KA', 'EN'], experience: 10, rating: 4.6, reviews: 120, bio: 'ნევროლოგი. ცერებროვასკულური დაავადებები.', avatar: 44 },

  /* ---- additional instrumental services (2–3 per study type) ---- */
  { id: 'd23', name: 'ქეთევან ფირცხალავა', type: 'instrumental', studyValue: 'ultrasound', role: 'ულტრაბგერითი დიაგნოსტიკა', clinics: ['saburtalo', 'vake'], languages: ['KA', 'EN'], experience: 14, rating: 4.8, reviews: 110, bio: 'ულტრაბგერითი დიაგნოსტიკა — ექოკარდიოგრაფია.', avatar: 64 },
  { id: 'd24', name: 'ზაზა ლომიძე', type: 'instrumental', studyValue: 'ecg', role: 'ფუნქციური დიაგნოსტიკა', clinics: ['saburtalo'], languages: ['KA'], experience: 11, rating: 4.5, reviews: 54, bio: 'ფუნქციური დიაგნოსტიკა — ჰოლტერ მონიტორინგი.', avatar: 56 },
  { id: 'd25', name: 'ნინო ხარაძე', type: 'instrumental', studyValue: 'xray', role: 'რადიოლოგი', clinics: ['vake'], languages: ['KA'], experience: 10, rating: 4.4, reviews: 39, bio: 'რადიოლოგი — კიდურების რენტგენოგრაფია.', avatar: 58 },
  { id: 'd26', name: 'ანა წერეთელი', type: 'instrumental', studyValue: 'mri', role: 'რადიოლოგი', clinics: ['saburtalo'], languages: ['KA', 'EN'], experience: 13, rating: 4.9, reviews: 95, bio: 'რადიოლოგი — ხერხემლის მრტ.', avatar: 67 },
], EN.doctorLabels, 'id')

export const langLabels = isEn
  ? EN.langLabels
  : { KA: 'ქართული', EN: 'ინგლისური', RU: 'რუსული', DE: 'გერმანული' }
/* Short tag shown on the doctor row (matches the design's "Geo"/"Eng" tags). */
export const langTag = { KA: 'Geo', EN: 'Eng', RU: 'Rus', DE: 'Deu' }

/* ---- Month + availability ------------------------------------------------ */
/* Anchored to the REAL current date: the calendar always tracks this month/year and
   availability syncs to real dates (today forward; past days are non-bookable). */
const startOfDay = (dt) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
const TODAY = startOfDay(new Date())
export const bookingMonth = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1) // first of the current month
const MONTHS = isEn
  ? EN.MONTHS
  : ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ']

/* Calendar vocabulary. Full month names appear ONLY in the calendar header
   ("July 2026"); everywhere else uses the abbreviations above. Exported from here
   rather than from MonthCalendar so both the calendar and the filter popover read
   the same locale-resolved source. WEEKDAYS is Monday-first in both locales. */
export const MONTHS_FULL = isEn
  ? EN.MONTHS_FULL
  : ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
     'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი']
export const WEEKDAYS = isEn
  ? EN.WEEKDAYS
  : ['ორშ', 'სამშ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვ']

const RANGES = [
  '10:00 - 10:30', '10:30 - 11:00', '11:00 - 11:30', '11:30 - 12:00',
  '13:00 - 13:30', '13:30 - 14:00', '15:00 - 15:30', '16:00 - 16:30', '18:30 - 19:00',
]
// A doctor working two clinics on one day does mornings at one, afternoons at the
// other — so every slot maps to exactly ONE clinic (you can't be in two places at once).
const MORNING = RANGES.slice(0, 4)   // 10:00–12:00
const AFTERNOON = RANGES.slice(4)    // 13:00–19:00

function hash(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

const pad = (n) => String(n).padStart(2, '0')
export const dateKeyOf = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/* avail[doctorId] = { 'YYYY-MM-DD': [{ clinic, slots: [range,…] }] }  (memoised) */
const _avail = {}
function availabilityFor(doctorId) {
  if (_avail[doctorId]) return _avail[doctorId]
  const doctor = doctors.find((d) => d.id === doctorId)
  const map = {}
  if (doctor) {
    // Real dates from today through the end of NEXT month: the current month (from
    // today) + all of next month get availability; past days get none (non-bookable).
    const end = new Date(TODAY.getFullYear(), TODAY.getMonth() + 2, 0)
    // A "booked-out" doctor has no free slots for the first N days (used to demo the
    // returning-patient fallback: their personal doctor is full for the coming week).
    const minDate = doctor.bookedOutDays
      ? startOfDay(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + doctor.bookedOutDays))
      : TODAY
    for (let dt = new Date(TODAY); dt <= end; dt.setDate(dt.getDate() + 1)) {
      if (dt < minDate) continue
      const key = dateKeyOf(dt)
      // Which of the doctor's clinics are open that day (deterministic per real date).
      const openCls = doctor.clinics.filter((cl) => hash(`${doctorId}|${cl}|${key}`) % 5 < 2)
      if (!openCls.length) continue
      const groups = []
      if (openCls.length === 1) {
        const cl = openCls[0]
        const h = hash(`${doctorId}|${cl}|${key}`)
        const n = 2 + (h % 4) // 2–5 slots
        const start = h % (RANGES.length - n)
        groups.push({ clinic: cl, slots: RANGES.slice(start, start + n) })
      } else {
        // Two clinics same day → non-overlapping windows: one gets the morning,
        // the other the afternoon. Hash decides which clinic takes mornings.
        const [am, pm] = [...openCls].sort((a, b) =>
          (hash(`${doctorId}|${a}|${key}`) % 100) - (hash(`${doctorId}|${b}|${key}`) % 100))
        const hm = hash(`${doctorId}|${am}|am|${key}`)
        const hp = hash(`${doctorId}|${pm}|pm|${key}`)
        const mn = 2 + (hm % (MORNING.length - 1))            // 2–4 morning slots
        const pn = 2 + (hp % (AFTERNOON.length - 1))          // 2–5 afternoon slots
        const ps = hp % (AFTERNOON.length - pn + 1)
        groups.push({ clinic: am, slots: MORNING.slice(0, mn) })
        groups.push({ clinic: pm, slots: AFTERNOON.slice(ps, ps + pn) })
      }
      map[key] = groups
    }
  }
  _avail[doctorId] = map
  return map
}

/* Clinic values a doctor is available at on a given day (∩ active clinics). */
export function dayClinics(doctorId, dateKey, active = allClinicValues) {
  const groups = availabilityFor(doctorId)[dateKey] || []
  return groups.map((g) => g.clinic).filter((c) => active.includes(c))
}

/* The doctor's available days in the month (keys), filtered to active clinics. */
export function availableDates(doctorId, active = allClinicValues) {
  const map = availabilityFor(doctorId)
  return Object.keys(map).filter((k) => map[k].some((g) => active.includes(g.clinic)))
}

/* Slot groups for a (doctor, day), filtered to active clinics. */
export function slotGroupsFor(doctorId, dateKey, active = allClinicValues) {
  const groups = availabilityFor(doctorId)[dateKey] || []
  return groups.filter((g) => active.includes(g.clinic))
}

/* Earliest available date for a doctor (∩ active clinics), else null. */
export function firstAvailableDate(doctorId, active = allClinicValues) {
  const dates = availableDates(doctorId, active)
  return dates.length ? dates.sort()[0] : null
}

/* Does the doctor have ANY free slot within `days` calendar days from today
   (inclusive)? Drives the returning-patient rule: if the personal doctor has a
   slot this week keep them locked; otherwise open the same-clinic alternatives. */
export function hasAvailabilityWithin(doctorId, days, active = allClinicValues) {
  const limit = dateKeyOf(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + days))
  return availableDates(doctorId, active).some((k) => k <= limit)
}

/* Other personal doctors that work at any of the given clinics (the same-clinic
   fallback pool when a returning patient's own doctor is booked out this week). */
export function personalDoctorsAt(clinicValues, excludeId = null) {
  return doctors.filter((d) => d.type === 'personal' && d.id !== excludeId &&
    d.clinics.some((c) => clinicValues.includes(c)))
}

/* Earliest slot (and its clinic) for a doctor on a day (∩ active clinics). */
export function firstSlotFor(doctorId, dateKey, active = allClinicValues) {
  if (!doctorId || !dateKey) return { slot: null, slotClinic: null }
  const items = []
  slotGroupsFor(doctorId, dateKey, active).forEach((g) => g.slots.forEach((s) => items.push({ slot: s, clinic: g.clinic })))
  items.sort((a, b) => a.slot.localeCompare(b.slot))
  return items.length ? { slot: items[0].slot, slotClinic: items[0].clinic } : { slot: null, slotClinic: null }
}

/* Build a pre-filled booking draft from an existing (booked) appointment — the
   reschedule/rebook flow. Keeps the SAME doctor + clinic and picks the closest
   available date + earliest free slot at that clinic. Falls back to any clinic
   if the doctor has no availability at the original one. */
export function rescheduleDraft(appt) {
  let clinics = [appt.clinicValue]
  let active = clinics
  let date = firstAvailableDate(appt.doctorId, active)
  if (!date) { clinics = []; active = allClinicValues; date = firstAvailableDate(appt.doctorId, active) }
  const { slot, slotClinic } = firstSlotFor(appt.doctorId, date, active)
  return {
    id: 'a' + Math.random().toString(36).slice(2, 8),
    type: appt.type,
    city: 'tbilisi',
    specialty: appt.specialty || null,
    activeClinics: clinics, // [] = no filter; [clinicValue] = keep the original clinic
    doctorId: appt.doctorId,
    date,
    slot,
    slotClinic,
  }
}

/* Build a draft that EDITS an existing appointment: same doctor + clinic and the
   EXACT booked date/slot (no nearest-slot computation — the user keeps what they
   chose, then adjusts). `edit:true` locks the personal doctor in the workspace. */
export function editDraft(appt) {
  return {
    id: 'a' + Math.random().toString(36).slice(2, 8),
    edit: true,
    type: appt.type,
    city: 'tbilisi',
    specialty: appt.specialty || null,
    activeClinics: [appt.clinicValue],
    doctorId: appt.doctorId,
    date: appt.date || null,
    slot: appt.slot || null,
    slotClinic: appt.slotClinic || appt.clinicValue,
  }
}

/* Filter the doctor/service list by appointment type + direction + free-text query.
   Search-by-name ALWAYS works: a query finds any doctor of the type regardless of
   the specialty/study filter (selecting the doctor then back-fills the direction).
   Without a query, specialist & instrumental require a direction first (specialty /
   study type) → empty until one is chosen. `specialty` holds the direction value. */
export function filterDoctors({ type, specialty, query }) {
  const q = (query || '').trim().toLowerCase()
  let list = doctors.filter((d) => d.type === type)
  if (q) return list.filter((d) => d.name.toLowerCase().includes(q))
  if ((type === 'specialist' || type === 'instrumental') && !specialty) return []
  if (type === 'specialist') list = list.filter((d) => d.specialtyValue === specialty)
  if (type === 'instrumental') list = list.filter((d) => d.studyValue === specialty)
  return list
}

/* Sort doctors by soonest available date (∩ active clinics). */
export function sortBySoonest(list, active = allClinicValues) {
  return [...list].sort((a, b) => {
    const da = firstAvailableDate(a.id, active) || '9999'
    const db = firstAvailableDate(b.id, active) || '9999'
    return da.localeCompare(db)
  })
}

/* ---- List-based availability (date/time-first, no doctor chosen yet) -------
   These let the calendar + time column stay usable before a doctor is picked,
   so selecting a date/time can FILTER the doctor list (bidirectional entry). */

/* Union of available dates across a list of doctors (∩ active clinics). */
export function listAvailableDates(list, active = allClinicValues) {
  const set = new Set()
  list.forEach((d) => availableDates(d.id, active).forEach((k) => set.add(k)))
  return [...set]
}

/* Union of clinic tones across a list on a given day (for the calendar ring). */
export function listDayTones(list, dateKey, active = allClinicValues) {
  const set = new Set()
  list.forEach((d) => dayClinics(d.id, dateKey, active).forEach((cv) => set.add(clinicByValue(cv).tone)))
  return [...set].sort()
}

/* Union of slot ranges across a list on a day → [{ slot, clinics:Set }] sorted. */
export function listSlotsOn(list, dateKey, active = allClinicValues) {
  const bySlot = {}
  list.forEach((d) => slotGroupsFor(d.id, dateKey, active).forEach((g) => {
    g.slots.forEach((s) => { (bySlot[s] = bySlot[s] || new Set()).add(g.clinic) })
  }))
  return Object.keys(bySlot).sort().map((slot) => ({ slot, clinics: [...bySlot[slot]] }))
}

/* Doctors in a list available on a given day (∩ active clinics). */
export function doctorsOnDate(list, dateKey, active = allClinicValues) {
  return list.filter((d) => availableDates(d.id, active).includes(dateKey))
}

/* Doctors in a list offering a specific slot on a day (∩ active clinics). */
export function doctorsWithSlot(list, dateKey, slot, active = allClinicValues) {
  return list.filter((d) => slotGroupsFor(d.id, dateKey, active).some((g) => g.slots.includes(slot)))
}

/* Whether a doctor offers a slot on a day; and the clinic they offer it at. */
export function doctorOffersSlot(doctorId, dateKey, slot, active = allClinicValues) {
  return slotGroupsFor(doctorId, dateKey, active).some((g) => g.slots.includes(slot))
}
export function doctorClinicForSlot(doctorId, dateKey, slot, active = allClinicValues) {
  const g = slotGroupsFor(doctorId, dateKey, active).find((gr) => gr.slots.includes(slot))
  return g ? g.clinic : null
}

export function fmtDate(dateKey) {
  if (!dateKey) return ''
  const [, m, d] = dateKey.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]}`
}

/* Long form for the collapsed summary row — e.g. "12 ივლ, 2026" / "12 Jul 2026".
   English drops the comma before the year (D MMM YYYY is the unambiguous form); the
   Georgian output is unchanged. This feeds the appointment-list date group headers
   and the cancel-confirmation summary, so it is the most-rendered date in the flow. */
export function fmtDateLong(dateKey) {
  if (!dateKey) return ''
  const [y, m, d] = dateKey.split('-').map(Number)
  return isEn ? `${d} ${MONTHS[m - 1]} ${y}` : `${d} ${MONTHS[m - 1]}, ${y}`
}
