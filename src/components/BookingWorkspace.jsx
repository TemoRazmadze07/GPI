import { useState, useEffect } from 'react'
import Select from './Select.jsx'
import ClinicChips from './ClinicChips.jsx'
import SearchField from './SearchField.jsx'
import DoctorRow from './DoctorRow.jsx'
import DoctorBioModal from './DoctorBioModal.jsx'
import MonthCalendar from './MonthCalendar.jsx'
import SlotList from './SlotList.jsx'
import {
  doctors, cities, clinics, allClinicValues, clinicByValue, directionsFor,
  filterDoctors, sortBySoonest, availableDates, dayClinics, slotGroupsFor,
  firstAvailableDate, bookingMonth, fmtDate,
  listAvailableDates, listDayTones, listSlotsOn, doctorsOnDate, doctorsWithSlot,
  doctorOffersSlot, doctorClinicForSlot,
} from '../data/booking.js'
import { ka } from '../i18n/strings.js'

/* BookingWorkspace — the on-page booking surface (design 104:8241): a filter
   row (search · city · clinic chips) over three columns — doctor list · month
   calendar · time. BIDIRECTIONAL: works doctor-first OR date/time-first. When no
   doctor is chosen the calendar/time stay usable (union of the filtered list);
   picking a date then a time narrows the doctor list. `value` (the draft) holds
   the selection; `onChange` patches it. */
export default function BookingWorkspace({ value: v, onChange }) {
  const [query, setQuery] = useState('')
  const [month, setMonth] = useState(bookingMonth)
  const [info, setInfo] = useState(null) // doctor whose bio modal is open

  // Keep the calendar on the month of the selected/seeded date. Auto-select, edit and
  // reschedule can land in a different month than the current one (especially near
  // month-end), so without this the pre-selected day would be off-screen. Fires only
  // when v.date changes, so manual prev/next browsing is never overridden.
  useEffect(() => {
    if (!v.date) return
    const [y, mo] = v.date.split('-').map(Number)
    setMonth((prev) => (prev.getFullYear() === y && prev.getMonth() === mo - 1) ? prev : new Date(y, mo - 1, 1))
  }, [v.date])

  // Availability spans the current month (from today) → end of next month, so bound the
  // month nav to that window (no paging into all-greyed dead months).
  const maxMonth = new Date(bookingMonth.getFullYear(), bookingMonth.getMonth() + 1, 1)
  const atMinMonth = month.getFullYear() === bookingMonth.getFullYear() && month.getMonth() === bookingMonth.getMonth()
  const atMaxMonth = month.getFullYear() === maxMonth.getFullYear() && month.getMonth() === maxMonth.getMonth()

  const active = v.activeClinics && v.activeClinics.length ? v.activeClinics : allClinicValues
  const base = sortBySoonest(filterDoctors({ type: v.type, specialty: v.specialty, query }), active)
  const doctorSel = !!v.doctorId
  // Editing a personal-doctor appointment → the doctor is fixed (returning patient
  // keeps their one personal doctor). Show only that doctor; date/time/clinic stay editable.
  const locked = !!(v.edit && v.type === 'personal' && v.doctorId)

  // Earliest available slot for a doctor on a date (so the time is pre-filled and
  // the Add button is actionable — never a dead "nothing happens" click).
  const firstSlotForDoctor = (doctorId, dateKey, act = active) => {
    if (!doctorId || !dateKey) return { slot: null, slotClinic: null }
    const items = []
    slotGroupsFor(doctorId, dateKey, act).forEach((g) => g.slots.forEach((s) => items.push({ slot: s, clinic: g.clinic })))
    items.sort((a, b) => a.slot.localeCompare(b.slot))
    return items.length ? { slot: items[0].slot, slotClinic: items[0].clinic } : { slot: null, slotClinic: null }
  }

  // Doctor list shown: full base when a doctor is chosen (so you can switch);
  // otherwise narrowed by the chosen date / slot (date-time-first filtering).
  let shown = base
  if (locked) {
    shown = doctors.filter((d) => d.id === v.doctorId)
  } else if (!doctorSel) {
    if (v.date && v.slot) shown = doctorsWithSlot(base, v.date, v.slot, active)
    else if (v.date) shown = doctorsOnDate(base, v.date, active)
  }

  // Auto-pick the soonest doctor on first open (matches the design's initial state).
  useEffect(() => {
    if (!v.doctorId && !v.date && base.length) {
      const d = base[0]
      const date = firstAvailableDate(d.id, active)
      onChange({ ...v, doctorId: d.id, date, ...firstSlotForDoctor(d.id, date) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.type, v.specialty, base.length])

  // Calendar availability + ring tones: the selected doctor, else the whole list.
  const calSet = new Set(doctorSel ? availableDates(v.doctorId, active) : listAvailableDates(base, active))
  const tonesOf = (k) => doctorSel
    ? dayClinics(v.doctorId, k, active).map((cv) => clinicByValue(cv).tone)
    : listDayTones(base, k, active)

  // Time items for the selected day, grouped by clinic. With a doctor chosen each
  // group is one clinic (morning/afternoon windows never overlap); without one the
  // clinic can't be resolved yet, so it's a single headerless group.
  let slotGroups = []
  if (v.date) {
    if (doctorSel) {
      slotGroups = slotGroupsFor(v.doctorId, v.date, active)
        .map((g) => ({ clinic: g.clinic, slots: [...g.slots].sort((a, b) => a.localeCompare(b)) }))
        .sort((a, b) => a.slots[0].localeCompare(b.slots[0]))
    } else {
      const flat = listSlotsOn(base, v.date, active).map(({ slot }) => slot).sort((a, b) => a.localeCompare(b))
      slotGroups = flat.length ? [{ clinic: null, slots: flat }] : []
    }
  }
  const slotCount = slotGroups.reduce((n, g) => n + g.slots.length, 0)

  const pickDoctor = (id) => {
    const keepDate = v.date && availableDates(id, active).includes(v.date) ? v.date : firstAvailableDate(id, active)
    // Keep the existing time if the doctor offers it; otherwise pre-fill the first slot.
    if (keepDate && v.slot && doctorOffersSlot(id, keepDate, v.slot, active)) {
      onChange({ ...v, doctorId: id, date: keepDate, slot: v.slot, slotClinic: doctorClinicForSlot(id, keepDate, v.slot, active) })
    } else {
      onChange({ ...v, doctorId: id, date: keepDate, ...firstSlotForDoctor(id, keepDate) })
    }
  }
  // Deselect → clean slate for date/time-first: full doctor list + union calendar.
  // (Won't auto-reselect: the effect only fires on type/specialty/base-length change.)
  const dropDoctor = () => onChange({ ...v, doctorId: null, date: null, slot: null, slotClinic: null })
  // Picking a day pre-selects the first available time (when a doctor is chosen).
  const pickDate = (key) => onChange(v.doctorId
    ? { ...v, date: key, ...firstSlotForDoctor(v.doctorId, key) }
    : { ...v, date: key, slot: null, slotClinic: null })
  const pickSlot = (slot, clinic) => onChange({ ...v, slot, slotClinic: doctorSel ? clinic : null })

  // Clinic chips are ADDITIVE filters: empty = show all; click highlights a clinic
  // and filters availability to it; click again removes it.
  const toggleClinic = (val) => {
    const raw = v.activeClinics || []
    const next = raw.includes(val) ? raw.filter((x) => x !== val) : [...raw, val]
    const eff = next.length ? next : allClinicValues
    let date = v.date
    if (v.doctorId) date = availableDates(v.doctorId, eff).includes(v.date) ? v.date : firstAvailableDate(v.doctorId, eff)
    else if (v.date && !listAvailableDates(base, eff).includes(v.date)) date = null
    const slotPatch = v.doctorId ? firstSlotForDoctor(v.doctorId, date, eff) : { slot: null, slotClinic: null }
    onChange({ ...v, activeClinics: next, date, ...slotPatch })
  }

  const needsDirection = v.type === 'specialist' || v.type === 'instrumental'
  const awaitingDirection = needsDirection && !v.specialty // gate: pick specialty/study first

  return (
    <div className="gpi-bw3">
      <div className="gpi-bw3__filters">
        {!locked && <SearchField value={query} onChange={setQuery} placeholder={ka.wizard.filters.searchDoctor} />}
        <Select value={v.city} placeholder={ka.wizard.filters.city} options={cities} onChange={(x) => onChange({ ...v, city: x })} />
        {needsDirection && (
          <Select
            value={v.specialty}
            placeholder={v.type === 'instrumental' ? ka.wizard.filters.study : ka.wizard.filters.specialty}
            options={directionsFor(v.type)}
            onChange={(x) => onChange({ ...v, specialty: x, doctorId: null, date: null, slot: null, slotClinic: null })}
          />
        )}
        <ClinicChips clinics={clinics} active={v.activeClinics || []} selectedClinic={v.slotClinic} onToggle={toggleClinic} />
      </div>

      <div className="gpi-bw3__cols">
        <div className="gpi-bw3__col">
          <div className="gpi-bw3__colhd">{ka.wizard.types[v.type]}</div>
          <div className="gpi-bw3__list">
            {!awaitingDirection && shown.map((d) => (
              <DoctorRow key={d.id} doctor={d} selected={v.doctorId === d.id} onSelect={pickDoctor} onDeselect={dropDoctor} onInfo={setInfo} locked={locked} />
            ))}
            {awaitingDirection && (
              <div className="gpi-bw3__empty">{v.type === 'instrumental' ? ka.wizard.book.pickStudy : ka.wizard.book.pickDirection}</div>
            )}
            {!awaitingDirection && shown.length === 0 && <div className="gpi-bw3__empty">{ka.wizard.book.noDoctors}</div>}
          </div>
        </div>

        <div className="gpi-bw3__col gpi-bw3__col--div">
          <div className="gpi-bw3__colhd" aria-hidden="true">{' '}</div>
          <MonthCalendar
            month={month}
            canPrev={!atMinMonth}
            canNext={!atMaxMonth}
            onPrevMonth={() => { if (!atMinMonth) setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1)) }}
            onNextMonth={() => { if (!atMaxMonth) setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1)) }}
            isAvailable={(k) => calSet.has(k)}
            getTones={tonesOf}
            selected={v.date}
            onSelect={pickDate}
          />
        </div>

        <div className="gpi-bw3__col gpi-bw3__col--div">
          <div className="gpi-bw3__colhd" aria-hidden="true">{' '}</div>
          {awaitingDirection ? null : v.date && slotCount ? (
            <SlotList groups={slotGroups} selected={v.slot ? { slot: v.slot, clinic: v.slotClinic } : null} onSelect={pickSlot} />
          ) : (
            <div className="gpi-bw3__empty">{v.date ? ka.wizard.book.noSlots : ka.wizard.book.pickDay}</div>
          )}
        </div>
      </div>

      {info && (
        <DoctorBioModal
          doctor={info}
          onClose={() => setInfo(null)}
          onSelect={() => { pickDoctor(info.id); setInfo(null) }}
        />
      )}
    </div>
  )
}
