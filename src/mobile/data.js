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
}

/* Curatio hub — history counts per person scope. */
export const HISTORY_COUNTS = {
  all: { analyses: 12, prescriptions: 4, visits: 9, docs: 3 },
  p1: { analyses: 8, prescriptions: 3, visits: 6, docs: 2 },
  p2: { analyses: 4, prescriptions: 1, visits: 3, docs: 1 },
}

export const NEXT_REMINDER = { text: 'მიმართვის ვადა — 7 დღეში', tone: 'amber' }

export const PREVENTION_NEXT = { text: 'გრიპის ვაქცინა · ოქტ · უფასოა GPI პოლისით' }

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
