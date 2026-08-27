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
const DK = { visit: 'gpi.dash.visitDay', unins: 'gpi.dash.uninsured' }
export const demo = {
  visitDay: () => sessionStorage.getItem(DK.visit) === '1',
  setVisitDay: (on) => (on ? sessionStorage.setItem(DK.visit, '1') : sessionStorage.removeItem(DK.visit)),
  uninsured: () => sessionStorage.getItem(DK.unins) === '1',
  setUninsured: (on) => (on ? sessionStorage.setItem(DK.unins, '1') : sessionStorage.removeItem(DK.unins)),
}

/* ---- People ---------------------------------------------------------------- */
export const PERSONS = [
  { id: 'g', name: L('გიორგი გიორგაძე', 'Giorgi Giorgadze'), ocin: 'OCIN 23213/22', holder: true },
  { id: 'e', name: L('ელენე გიორგაძე', 'Elene Giorgadze'), ocin: 'OCIN 23213/23' },
]

export const DOCTOR = {
  name: L('ნინო ნინოშვილი', 'Nino Ninoshvili'),
  spec: L('ოჯახის ექიმი · კურაციო საბურთალოზე', 'Family doctor · Curatio Saburtalo'),
  next: L('12 ნოე', '12 Nov'),
  photo: face('photo-1559839734-2b71ea197ec2'),
}

/* ---- F-01: today (visit-day state only) ------------------------------------ */
export const TODAY = {
  time: '11:30',
  doctor: DOCTOR.name,
  queue: 'A042',
  ahead: 3,
  cabinet: 208,
}

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

/* ---- F-05: prevention + reminders ------------------------------------------ */
export const PREVENTION = [
  { id: 'pr1', name: L('გრიპის ვაქცინა', 'Flu vaccine'), status: 'due' },
  { id: 'pr2', name: L('მკერდის სქრინინგი', 'Breast screening'), status: 'missed' },
  { id: 'pr3', name: L('წლიური შემოწმება', 'Annual check-up'), status: 'done' },
  { id: 'pr4', name: L('მხედველობის შემოწმება', 'Vision check'), status: 'due' },
]

export const REMINDERS = [
  { id: 'visit', label: L('ვიზიტი — 24სთ / 2სთ ადრე', 'Visit — 24h / 2h before'), on: true },
  { id: 'analysis', label: L('ანალიზის ვადა', 'Analysis due'), on: true },
  { id: 'prevention', label: L('პრევენცია — სქრინინგი, ვაქცინაცია', 'Prevention — screenings, vaccines'), on: true },
  { id: 'referral', label: L('მიმართვის ვადა', 'Referral expiry'), on: true },
]
