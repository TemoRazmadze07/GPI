import { useState, useEffect } from 'react'
import Select from './Select.jsx'
import ClinicChips from './ClinicChips.jsx'
import SearchField from './SearchField.jsx'
import Radio from './Radio.jsx'
import DoctorRow from './DoctorRow.jsx'
import DoctorBioModal from './DoctorBioModal.jsx'
import MonthCalendar from './MonthCalendar.jsx'
import SlotList from './SlotList.jsx'
import Icon from '../lib/Icon.jsx'
import {
  doctors, cities, clinics, allClinicValues, clinicByValue, directionsFor,
  filterDoctors, sortBySoonest, availableDates, dayClinics, slotGroupsFor,
  firstAvailableDate, bookingMonth,
  listAvailableDates, listDayTones, listSlotsOn, doctorsOnDate, doctorsWithSlot,
  doctorOffersSlot, doctorClinicForSlot, hasAvailabilityWithin, personalDoctorsAt, chipClinics,
} from '../data/booking.js'
import { ka } from '../i18n/strings.js'

/* BookingWorkspace — the on-page booking surface (design 104:8241): a filter
   row (search · city · clinic chips) over three columns — doctor list · month
   calendar · time. BIDIRECTIONAL: works doctor-first OR date/time-first.

   Personal-doctor (returning patient) has its own rules, driven by the draft's
   `assignedDoctorId`:
     · State B — the doctor has a free slot within 7 days → LOCKED to that one
       doctor; city fixed; clinic fixed too when the doctor is single-clinic.
     · State C — booked out this week → the list opens to OTHER personal doctors
       at the same clinic(s) (a one-time exception; the assignment is unchanged).
     · Visit type (in-clinic / remote) — remote is fully online: no clinic
       selector, no clinic column grouping, no address.
   Specialist / instrumental: pick a direction OR search a doctor by name (search
   always works; selecting a searched doctor back-fills the specialty).
   `value` (the draft) holds the selection; `onChange` patches it. */
export default function BookingWorkspace({ value: v, onChange }) {
  const [query, setQuery] = useState('')
  const [month, setMonth] = useState(bookingMonth)
  const [info, setInfo] = useState(null) // doctor whose bio modal is open

  // ---- Personal-doctor (returning patient) context ------------------------
  const isPersonal = v.type === 'personal'
  const assignedId = isPersonal ? (v.assignedDoctorId || null) : null
  const assignedDoc = assignedId ? doctors.find((d) => d.id === assignedId) : null
  const remote = isPersonal && v.visit === 'remote'
  // First-time patient (no assigned personal doctor): free browse across MANY clinics
  // via a dropdown; per-clinic calendar colours are dropped (too many to colour-code).
  const firstTimePersonal = isPersonal && !assignedId

  // Clinic scope: a returning patient is bound to their doctor's clinic(s) in
  // person; remote has no clinic, so scope opens up (it's just used for probing).
  const scopeValues = assignedDoc && !remote ? assignedDoc.clinics : allClinicValues
  const active = v.activeClinics && v.activeClinics.length ? v.activeClinics : scopeValues

  // The 7-day rule (returning patients only). Gated on the RESOLVED doctor so a
  // stale/unknown assignedDoctorId can never deref a null doctor.
  const withinWeek = assignedDoc
    ? hasAvailabilityWithin(assignedDoc.id, 7, remote ? allClinicValues : assignedDoc.clinics)
    : true
  const returningLocked = !!(assignedDoc && withinWeek) // State B — single doctor
  const fallbackC = !!(assignedDoc && !withinWeek)       // State C — same-clinic peers

  const locked = !!((v.edit && isPersonal && v.doctorId) || returningLocked)
  const clinicDisabled = !!(assignedDoc && !remote && assignedDoc.clinics.length === 1)

  // Keep the calendar on the month of the selected/seeded date (auto-select, edit
  // and reschedule can land in another month). Fires only on v.date change, so
  // manual prev/next browsing is never overridden.
  useEffect(() => {
    if (!v.date) return
    const [y, mo] = v.date.split('-').map(Number)
    setMonth((prev) => (prev.getFullYear() === y && prev.getMonth() === mo - 1) ? prev : new Date(y, mo - 1, 1))
  }, [v.date])

  const maxMonth = new Date(bookingMonth.getFullYear(), bookingMonth.getMonth() + 1, 1)
  const atMinMonth = month.getFullYear() === bookingMonth.getFullYear() && month.getMonth() === bookingMonth.getMonth()
  const atMaxMonth = month.getFullYear() === maxMonth.getFullYear() && month.getMonth() === maxMonth.getMonth()

  const doctorSel = !!v.doctorId

  // Availability for slot lookups: remote ignores clinics (union across them).
  const slotActive = remote ? allClinicValues : active

  // Earliest slot for a doctor on a date (so the time pre-fills and Add is
  // actionable). Remote strips the clinic (online → no location).
  const firstSlotForDoctor = (doctorId, dateKey, act = slotActive) => {
    if (!doctorId || !dateKey) return { slot: null, slotClinic: null }
    const items = []
    slotGroupsFor(doctorId, dateKey, act).forEach((g) => g.slots.forEach((s) => items.push({ slot: s, clinic: g.clinic })))
    items.sort((a, b) => a.slot.localeCompare(b.slot))
    if (!items.length) return { slot: null, slotClinic: null }
    return { slot: items[0].slot, slotClinic: remote ? null : items[0].clinic }
  }
  const seedFor = (id) => {
    const date = firstAvailableDate(id, slotActive)
    return { doctorId: id, date, ...firstSlotForDoctor(id, date) }
  }

  // The generic list (specialist / instrumental / first-time personal).
  let base = sortBySoonest(filterDoctors({ type: v.type, specialty: v.specialty, query }), active)
  // First-time: a chosen clinic narrows the list to doctors who actually work there.
  if (firstTimePersonal && v.activeClinics && v.activeClinics.length) {
    base = base.filter((d) => d.clinics.some((c) => v.activeClinics.includes(c)))
  }
  // Same-clinic fallback pool (State C).
  const fallbackPool = sortBySoonest(personalDoctorsAt(remote ? allClinicValues : (assignedDoc ? assignedDoc.clinics : allClinicValues), assignedId), slotActive)

  // Doctor list shown.
  let shown
  if (locked) {
    shown = doctors.filter((d) => d.id === v.doctorId)
  } else if (fallbackC) {
    shown = fallbackPool
  } else {
    shown = base
    if (!doctorSel) {
      if (v.date && v.slot) shown = doctorsWithSlot(base, v.date, v.slot, active)
      else if (v.date) shown = doctorsOnDate(base, v.date, active)
    }
  }

  // Seed the initial selection: lock to the assigned doctor (B), the soonest
  // same-clinic peer (C), or the soonest match (specialist / first-time) — but
  // never auto-pick while the user is typing a name search.
  useEffect(() => {
    if (v.doctorId || v.date) return
    if (returningLocked) { onChange({ ...v, ...seedFor(assignedId) }); return }
    if (fallbackC && fallbackPool.length) { onChange({ ...v, ...seedFor(fallbackPool[0].id) }); return }
    if (!assignedId && !query && base.length) { onChange({ ...v, ...seedFor(base[0].id) }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.type, v.specialty, v.visit, v.assignedDoctorId, base.length, returningLocked, fallbackC])

  // Calendar availability + ring tones (remote = no clinic colour).
  const calSet = new Set(doctorSel ? availableDates(v.doctorId, slotActive) : listAvailableDates(base, active))
  const tonesOf = (k) => {
    if (remote || firstTimePersonal) return [] // plain calendar (many clinics → no per-clinic colour)
    return doctorSel
      ? dayClinics(v.doctorId, k, active).map((cv) => clinicByValue(cv).tone)
      : listDayTones(base, k, active)
  }

  // Time items for the selected day. Remote → one plain group (no clinic). With a
  // clinic doctor → one group per clinic; without a doctor → a single date-first group.
  let slotGroups = []
  if (v.date) {
    if (remote && doctorSel) {
      const flat = [...new Set(slotGroupsFor(v.doctorId, v.date, allClinicValues).flatMap((g) => g.slots))].sort((a, b) => a.localeCompare(b))
      slotGroups = flat.length ? [{ clinic: null, slots: flat }] : []
    } else if (doctorSel) {
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
    const doc = doctors.find((d) => d.id === id)
    // Searching by name back-fills the specialist / study direction on select.
    const dir = {}
    if (v.type === 'specialist' && doc?.specialtyValue) dir.specialty = doc.specialtyValue
    if (v.type === 'instrumental' && doc?.studyValue) dir.specialty = doc.studyValue
    const keepDate = v.date && availableDates(id, slotActive).includes(v.date) ? v.date : firstAvailableDate(id, slotActive)
    if (!remote && keepDate && v.slot && doctorOffersSlot(id, keepDate, v.slot, active)) {
      onChange({ ...v, ...dir, doctorId: id, date: keepDate, slot: v.slot, slotClinic: doctorClinicForSlot(id, keepDate, v.slot, active) })
    } else {
      onChange({ ...v, ...dir, doctorId: id, date: keepDate, ...firstSlotForDoctor(id, keepDate) })
    }
  }
  const dropDoctor = () => onChange({ ...v, doctorId: null, date: null, slot: null, slotClinic: null })
  const slotPatchFor = (id, date) => firstSlotForDoctor(id, date)
  const pickDate = (key) => onChange(v.doctorId
    ? { ...v, date: key, ...slotPatchFor(v.doctorId, key) }
    : { ...v, date: key, slot: null, slotClinic: null })
  const pickSlot = (slot, clinic) => onChange({ ...v, slot, slotClinic: (remote || !doctorSel) ? null : clinic })

  const setVisit = (visit) => onChange({ ...v, visit, doctorId: null, date: null, slot: null, slotClinic: null, activeClinics: [] })

  const toggleClinic = (val) => {
    const raw = v.activeClinics || []
    const next = raw.includes(val) ? raw.filter((x) => x !== val) : [...raw, val]
    applyClinics(next)
  }
  // First-time personal flow: clinic is a single-select DROPDOWN (scales to many
  // clinics, unlike the 2-item chips). '' = all clinics. Sets the same `activeClinics`
  // filter the chips use, so the availability / doctor-list logic is unchanged.
  const selectClinic = (val) => applyClinics(val ? [val] : [])
  function applyClinics(next) {
    const eff = next.length ? next : scopeValues
    let doctorId = v.doctorId
    // First-time: if the chosen clinic doesn't include the current doctor, jump to the
    // soonest personal doctor who works there (so the list + selection stay coherent).
    if (firstTimePersonal && next.length) {
      const doc = doctorId ? doctors.find((d) => d.id === doctorId) : null
      if (!doc || !doc.clinics.some((c) => next.includes(c))) {
        const pool = sortBySoonest(doctors.filter((d) => d.type === 'personal' && d.clinics.some((c) => next.includes(c))), next)
        doctorId = pool.length ? pool[0].id : null
      }
    }
    let date = v.date
    if (doctorId) date = availableDates(doctorId, eff).includes(v.date) ? v.date : firstAvailableDate(doctorId, eff)
    else if (v.date && !listAvailableDates(base, eff).includes(v.date)) date = null
    const slotPatch = doctorId ? firstSlotForDoctor(doctorId, date, eff) : { slot: null, slotClinic: null }
    onChange({ ...v, activeClinics: next, doctorId, date, ...slotPatch })
  }

  const needsDirection = v.type === 'specialist' || v.type === 'instrumental'
  const awaitingDirection = needsDirection && !v.specialty && !query.trim()

  // Filter-row composition per flow. Remote is online → no city, no clinic (there's
  // nowhere to be), so for a returning patient on a remote visit the filter row has
  // nothing left and is dropped entirely.
  const showSearch = !locked && !fallbackC && !assignedId
  const showCity = !remote
  const showClinic = !remote
  const cityDisabled = isPersonal && !!assignedId
  // Chip flows (returning / specialist) show only the COLOUR-CODED Curatio clinics, so
  // the row never overflows with the full many-clinic list; the first-time DROPDOWN
  // (below) lists them all.
  const clinicList = assignedDoc && !remote ? clinics.filter((c) => assignedDoc.clinics.includes(c.value)) : chipClinics
  const clinicValue = (v.activeClinics && v.activeClinics[0]) || ''
  const hasFilters = showSearch || showCity || needsDirection || showClinic

  // Clinic-colour legend (mobile-only via CSS; desktop hidden — frozen for
  // research). Explains the calendar's ring colours (research scenario #8).
  const legendClinics = (remote || firstTimePersonal) ? [] : clinicList.filter((c) => c.tone)

  return (
    <div className={`gpi-bw3 ${awaitingDirection ? 'is-awaiting' : ''}`}>
      {isPersonal && (
        <div className="gpi-bw3__visit">
          <span id={`visit-lbl-${v.id}`} className="gpi-bw3__visitlbl">{ka.wizard.visit.label}</span>
          <div className="gpi-bw3__visitopts" role="radiogroup" aria-labelledby={`visit-lbl-${v.id}`}>
            <Radio name={`visit-${v.id}`} value="inclinic" checked={(v.visit || 'inclinic') === 'inclinic'} onChange={setVisit} label={ka.wizard.visit.inclinic} />
            <Radio name={`visit-${v.id}`} value="remote" checked={v.visit === 'remote'} onChange={setVisit} label={ka.wizard.visit.remote} />
          </div>
          {remote && <span className="gpi-bw3__visithint"><Icon name="phone" size={14} />{ka.wizard.visit.remoteHint}</span>}
        </div>
      )}

      {hasFilters && (
        <div className="gpi-bw3__filters">
          {showSearch && <SearchField value={query} onChange={setQuery} placeholder={ka.wizard.filters.searchDoctor} />}
          {showCity && <Select value={v.city} placeholder={ka.wizard.filters.city} options={cities} disabled={cityDisabled} onChange={(x) => onChange({ ...v, city: x })} />}
          {needsDirection && (
            <Select
              className="gpi-fsel--dir"
              value={v.specialty}
              placeholder={v.type === 'instrumental' ? ka.wizard.filters.study : ka.wizard.filters.specialty}
              options={directionsFor(v.type)}
              onChange={(x) => onChange({ ...v, specialty: x, doctorId: null, date: null, slot: null, slotClinic: null })}
            />
          )}
          {showClinic && (firstTimePersonal ? (
            <Select
              value={clinicValue}
              placeholder={ka.wizard.filters.clinic}
              options={[{ value: '', label: ka.wizard.filters.allClinics }, ...clinics.map((c) => ({ value: c.value, label: c.label }))]}
              onChange={selectClinic}
            />
          ) : (
            <>
              <ClinicChips clinics={clinicList} active={v.activeClinics || []} selectedClinic={v.slotClinic} onToggle={toggleClinic} disabled={clinicDisabled} />
              {/* MOBILE variant of the clinic control — a single-select dropdown
                  (user request, 2026-07-17, evaluating uniform-dropdown filters;
                  '' = all clinics keeps the soft cross-clinic behavior). Desktop
                  keeps the colour-coded chips; CSS shows one per viewport. */}
              <div className="gpi-bw3__clinicsel">
                <Select
                  value={clinicValue}
                  placeholder={ka.wizard.filters.clinic}
                  options={[{ value: '', label: ka.wizard.filters.allClinics }, ...clinicList.map((c) => ({ value: c.value, label: c.label }))]}
                  onChange={selectClinic}
                  disabled={clinicDisabled}
                />
              </div>
            </>
          ))}
        </div>
      )}

      {fallbackC && (
        <div className="gpi-bw3__banner">
          <Icon name="alert-triangle" size={16} />
          <span>{ka.wizard.book.fallbackWeek}</span>
        </div>
      )}

      <div className="gpi-bw3__cols">
        <div className="gpi-bw3__col">
          <div className="gpi-bw3__colhd">{ka.wizard.types[v.type]}</div>
          <div className="gpi-bw3__list">
            {!awaitingDirection && shown.map((d) => (
              <DoctorRow key={d.id} doctor={d} selected={v.doctorId === d.id} onSelect={pickDoctor} onDeselect={dropDoctor} onInfo={setInfo} locked={locked} />
            ))}
            {awaitingDirection && (
              <>
                <div className="gpi-bw3__empty">{v.type === 'instrumental' ? ka.wizard.book.pickStudy : ka.wizard.book.pickDirection}</div>
                {/* FLAT-VARIANT twin (?ui=flat, mobile): the direction options as an
                    in-place tappable list replacing the direction dropdown. Hidden by
                    base CSS everywhere else — same render-both-hide-one pattern. */}
                <div className="gpi-bw3__dirlist">
                  {directionsFor(v.type).map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      className="gpi-bw3__diritem"
                      onClick={() => onChange({ ...v, specialty: o.value, doctorId: null, date: null, slot: null, slotClinic: null })}
                    >
                      <span>{o.label}</span>
                      <Icon name="chevron-right" size={16} />
                    </button>
                  ))}
                </div>
              </>
            )}
            {!awaitingDirection && shown.length === 0 && <div className="gpi-bw3__empty">{ka.wizard.book.noDoctors}</div>}
          </div>
        </div>

        <div className="gpi-bw3__col gpi-bw3__col--div">
          <div className="gpi-bw3__colhd" aria-hidden="true">{' '}</div>
          {legendClinics.length > 0 && (
            <div className="gpi-bw3__legend">
              {legendClinics.map((c) => (
                <span key={c.value} className={`gpi-bw3__legenditem gpi-cl--${c.tone}`}>
                  <i className="gpi-bw3__legenddot" aria-hidden="true" />
                  {c.short}
                </span>
              ))}
            </div>
          )}
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
          <div className="gpi-bw3__colhd" aria-hidden="true">{' '}</div>
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
