/* Mock appointment data for the prototype (Georgian).
   Each row REFERENCES the shared records — booking doctors/clinics + insured
   people — so a row can deep-link into the wizard fully pre-filled (the
   reschedule/rebook flow). The table renders the doctor/clinic/patient from those
   references, so the list and the booking wizard are one consistent world.
   Grouped in the UI by `dateKey`; each row keeps its own exact date + time. */

import { doctors, clinicByValue, availableDates, slotGroupsFor, fmtDateLong } from './booking.js'
import { insuredPersons } from './insured.js'

/* The booking as stored: shared-record refs + the originally-reserved
   date/time/status. `clinicValue` is where it was booked (saburtalo | vake);
   `insuredId` is the patient; `doctorId` maps to a real wizard doctor.
   Implicit "today" ≈ 1 Nov 2025 (availability month): ongoing rows land on
   Nov dates via bookedSlot(); finished/cancelled dates must sit in the PAST
   so statuses read consistently. Labels derive from dateKey (fmtDateLong). */
const raw = [
  { id: 'a1', dateKey: '2025-11-12', time: '11:30 – 12:00', doctorId: 'd1', clinicValue: 'saburtalo', status: 'ongoing',   insuredId: 'p1' },
  { id: 'a2', dateKey: '2025-11-12', time: '13:00 – 13:30', doctorId: 'd9', clinicValue: 'saburtalo', status: 'ongoing',   insuredId: 'p1' },
  { id: 'a3', dateKey: '2025-10-21', time: '16:15 – 16:45', doctorId: 'd7', clinicValue: 'vake',      status: 'cancelled', insuredId: 'p3' },
  { id: 'a4', dateKey: '2025-11-12', time: '10:00 – 10:30', doctorId: 'd1', clinicValue: 'vake',      status: 'ongoing',   insuredId: 'p1' },
  { id: 'a5', dateKey: '2025-10-14', time: '11:30 – 12:00', doctorId: 'd3', clinicValue: 'vake',      status: 'finished',  insuredId: 'p1' },
  { id: 'a6', dateKey: '2025-10-14', time: '14:00 – 14:30', doctorId: 'd7', clinicValue: 'vake',      status: 'finished',  insuredId: 'p3' },
  { id: 'a7', dateKey: '2025-09-30', time: '09:15 – 09:45', doctorId: 'd9', clinicValue: 'vake',      status: 'finished',  insuredId: 'p1' },
  { id: 'a8', dateKey: '2025-09-02', time: '12:30 – 13:00', doctorId: 'd1', clinicValue: 'saburtalo', status: 'finished',  insuredId: 'p1' },
]

const drById = (id) => doctors.find((d) => d.id === id)
const personById = (id) => insuredPersons.find((p) => p.id === id)

/* An ongoing (upcoming) appointment's booked slot must be a REAL availability
   entry for its doctor+clinic, so EDIT can pre-select the exact booked date/time
   on the wizard calendar. Pick the 2nd available date + 2nd slot (a realistic
   "not-the-earliest" booking, still deterministic). Returns null for none. */
function bookedSlot(doctorId, clinicValue) {
  const dates = availableDates(doctorId, [clinicValue]).sort()
  if (!dates.length) return null
  const date = dates[Math.min(1, dates.length - 1)]
  const slots = slotGroupsFor(doctorId, date, [clinicValue]).flatMap((g) => g.slots)
  if (!slots.length) return null
  return { date, slot: slots[Math.min(1, slots.length - 1)], slotClinic: clinicValue }
}

/* Resolve refs → the display shape the table already consumes (doctor/clinic/
   patient objects) while carrying what the deep-links need: doctorId, clinicValue,
   insuredId, type, specialty (direction), and — for ongoing rows — the exact
   booked date/slot (reschedule ignores it and computes nearest; edit uses it). */
export const appointments = raw.map((a) => {
  const dr = drById(a.doctorId)
  const cl = clinicByValue(a.clinicValue)
  const pt = personById(a.insuredId)
  let { dateKey, time } = a
  const booked = a.status === 'ongoing' ? bookedSlot(a.doctorId, a.clinicValue) : null
  if (booked) { dateKey = booked.date; time = booked.slot }
  return {
    ...a,
    dateKey, dateLabel: fmtDateLong(dateKey), time,
    date: booked ? booked.date : null,
    slot: booked ? booked.slot : null,
    slotClinic: a.clinicValue,
    type: dr.type,
    specialty: dr.specialtyValue || dr.studyValue || null, // "direction" for specialist/instrumental
    doctor: { name: dr.name, specialty: dr.role, avatar: dr.avatar },
    clinic: { name: cl.label, address: cl.address, isPhone: false },
    patient: { name: pt.name, relation: pt.relation },
  }
})

export const appointmentById = (id) => appointments.find((a) => a.id === id)

/* Wizard confirm → write-back. Maps the confirmed drafts to table rows and
   appends them to the module list, so the appointments screen (which seeds
   from it on mount) shows them as მიმდინარე. Local only — resets on reload. */
let bookedSeq = 0
export function confirmBooking(insuredId, drafts) {
  const pt = personById(insuredId)
  const rows = drafts.map((d) => {
    const dr = drById(d.doctorId)
    const cl = clinicByValue(d.slotClinic)
    return {
      id: 'b' + ++bookedSeq,
      dateKey: d.date, dateLabel: fmtDateLong(d.date), time: d.slot,
      doctorId: d.doctorId, clinicValue: d.slotClinic, status: 'ongoing', insuredId,
      date: d.date, slot: d.slot, slotClinic: d.slotClinic,
      type: d.type,
      specialty: d.specialty ?? (dr.specialtyValue || dr.studyValue || null),
      doctor: { name: dr.name, specialty: dr.role, avatar: dr.avatar },
      clinic: { name: cl.label, address: cl.address, isPhone: false },
      patient: { name: pt.name, relation: pt.relation },
    }
  })
  appointments.push(...rows)
  return rows
}

/* List order: upcoming (ongoing) first, soonest at the top; then history
   (finished/cancelled), most recent first — the standard patient-portal
   pattern (the next appointment is what you came for; the past is archive). */
const isUpcoming = (a) => a.status === 'ongoing'
export function sortForList(list) {
  const byDateAsc = (x, y) => x.dateKey.localeCompare(y.dateKey) || x.time.localeCompare(y.time)
  const upcoming = list.filter(isUpcoming).sort(byDateAsc)
  const past = list.filter((a) => !isUpcoming(a)).sort((x, y) => byDateAsc(y, x))
  return [...upcoming, ...past]
}

/* Group into CONSECUTIVE same-date runs (not a global index — a date can
   legitimately appear in both the upcoming and past sections, e.g. right
   after cancelling one of two same-day bookings). `key` is render-unique. */
export function groupByDate(list) {
  const groups = []
  for (const a of sortForList(list)) {
    const last = groups[groups.length - 1]
    if (last && last.dateKey === a.dateKey && last.upcoming === isUpcoming(a)) {
      last.items.push(a)
    } else {
      groups.push({ key: `${a.dateKey}:${groups.length}`, dateKey: a.dateKey, dateLabel: a.dateLabel, upcoming: isUpcoming(a), items: [a] })
    }
  }
  return groups
}
