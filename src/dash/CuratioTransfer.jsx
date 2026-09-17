import { useMemo, useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import Checkbox from '../components/Checkbox.jsx'
import DoctorBioModal from '../components/DoctorBioModal.jsx'
import DoctorRow from '../components/DoctorRow.jsx'
import Drawer from '../components/Drawer.jsx'
import SearchField from '../components/SearchField.jsx'
import SegmentedControl from '../components/SegmentedControl.jsx'
import Toast from '../components/Toast.jsx'
import { Button } from '../components/Button.jsx'
import { useGate } from './gate.jsx'
import { D } from './strings.js'
import {
  PERSONS, currentDoctor, TRANSFER_DOCTORS, ANALYSES, MEDS, VISITS, SECTION_ICON,
  forPerson, dateWithYear, getShares, addShares, clearShares, shortName,
} from './curatioData.js'

/* ისტორიის გადატანა — the web transfer flow (2026-09-09; REWORKED 2026-09-10
   into a DRAWER after a usability round in chat).

   Mobile A5 hands the WHOLE history to another Curatio doctor: doctor list →
   confirm sheet → success. On web it is one right-side Drawer (the B2B
   detail/form grammar) with two questions in this order:
     1 · ვის — a Segmented Control: the personal doctor (read-only row) or
       another doctor from the Curatio network — a searchable list of the
       booking wizard's DoctorRow, whose info trigger opens the wizard's
       DoctorBioModal over the drawer (user: „we have a modal for this when
       making appointments, same approach").
     2 · რა გადავიტანოთ — ONE selection, NO mode switch (user rejected a
       second segmented control and a „full history" checkbox that hid the
       list): a category switch (the history head's), a list whose HEADER
       checkbox selects the open category (the data-table idiom), and a
       „სრული ისტორია · N" link in the block head that selects everything.
       Picks persist across categories; the footer totals them. Full history
       is simply „everything selected". No record search — the lists are short
       and the level a search would work at was the ambiguity.
   Two entry points, one drawer: the doctor row's transfer button opens it
   EMPTY (medical data — the full-history link is one click away, nothing is
   shared by reflex); a record's send icon opens it with THAT record picked and
   its category open. After confirm the records carry „ხილვადია: <doctor>" in
   the table and the row icon turns into a check (glyph change, not colour
   alone — WCAG 1.4.1).

   Gate: history-class data, so the OTP comes first when the session is locked
   (mobile parity); the continuation opens this dialog only on success. Allowed
   for uninsured accounts — own data is never gated (comment #14 rule).

   Success = Toast + row marks (the desktop idiom; mobile keeps its success
   sheet because it has no toast). All copy is DRAFT until GPI signs it off;
   share-vs-transfer wording is an open stakeholder question.

   Rule 9: Drawer · SegmentedControl · DoctorRow · DoctorBioModal · Checkbox
   (+ its new additive `indeterminate`) · SearchField · Avatar · Button · Toast —
   nothing new.

   2026-09-16: block 2 is now `useRecordPicker` + `RecordPicker` — ONE picker for
   this drawer and the change-doctor concept's drawer (user: „what if I want to
   share only some particular files when I change doctor" → the same selection,
   starting with everything selected). `personalOnly` (concept mode): under the
   PO rule only the personal doctor can receive history, so the target switch
   goes and the drawer is „to your personal doctor" alone. */

const T = D.cur.transfer

/* ---- The record picker (2026-09-16) -------------------------------------------
   The three history sections scoped to the person (the table's forPerson), a
   category switch, a header Checkbox = the open category, rows, and a block-head
   link that selects EVERYTHING / clears everything. `all` starts with every
   record selected (the change-doctor drawer: the handover is the default and
   unticking is the exception); `record` starts with that one record picked and
   its category open (the table's per-record entry). */
export function useRecordPicker({ personId, record = null, all = false }) {
  const groups = useMemo(
    () => [
      { id: 'analyses', label: D.cur.hist.sections.analyses, short: D.cur.hist.sectionsShort?.analyses, rows: forPerson(ANALYSES, personId) },
      { id: 'meds', label: D.cur.hist.sections.meds, short: D.cur.hist.sectionsShort?.meds, rows: forPerson(MEDS, personId) },
      { id: 'visits', label: D.cur.hist.sections.visits, short: D.cur.hist.sectionsShort?.visits, rows: forPerson(VISITS, personId) },
    ],
    [personId],
  )
  const allIds = groups.flatMap((g) => g.rows.map((r) => r.id))
  const [picked, setPicked] = useState(() => new Set(all ? allIds : record ? [record.id] : []))
  /* Records do not carry their section; derive it from which list holds the id. */
  const [cat, setCat] = useState(() =>
    !record ? 'analyses'
    : MEDS.some((r) => r.id === record.id) ? 'meds'
    : VISITS.some((r) => r.id === record.id) ? 'visits'
    : 'analyses',
  )
  const group = groups.find((g) => g.id === cat) || groups[0]
  const inCat = group.rows.filter((r) => picked.has(r.id)).length
  const full = allIds.length > 0 && allIds.every((id) => picked.has(id))
  const toggle = (id, on) => setPicked((p) => { const n = new Set(p); on ? n.add(id) : n.delete(id); return n })
  /* Header checkbox = the open category only (the data-table idiom); the block
     head's link = everything. Two levels, each named for what it does. */
  const toggleCat = (on) => setPicked((p) => { const n = new Set(p); group.rows.forEach((r) => (on ? n.add(r.id) : n.delete(r.id))); return n })
  const toggleAll = () => setPicked(full ? new Set() : new Set(allIds))
  return { groups, allIds, picked, ids: [...picked], cat, setCat, group, inCat, full, toggle, toggleCat, toggleAll }
}

/* `label` = the block heading (the caller numbers it) · `already(r)` = an optional
   note per row („ხილვადია: …") · `err` = the submit error · `onChange` fires on any
   pick so the caller can clear that error live. */
export function RecordPicker({ picker, label, already, err, onChange }) {
  const { groups, allIds, picked, cat, setCat, group, inCat, full, toggle, toggleCat, toggleAll } = picker
  const act = (fn) => (...a) => { fn(...a); onChange?.() }
  return (
    <section className="dash-trf__block" aria-label={label}>
      <div className="dash-trf__head">
        <p className="dash-trf__lbl">{label}</p>
        <button type="button" className="gpi-link dash-link" onClick={act(toggleAll)}>
          {full ? T.clearFull : T.fullLink(allIds.length)}
        </button>
      </div>
      <SegmentedControl
        variant="soft"
        size="sm"
        value={cat}
        onChange={setCat}
        options={groups.map((g) => ({ value: g.id, label: g.label, short: g.short, icon: SECTION_ICON[g.id], count: g.rows.length }))}
      />
      <div className="dash-trf__rows">
        <div className="dash-trf__cathead">
          <Checkbox
            name="trf-cat-all"
            checked={group.rows.length > 0 && inCat === group.rows.length}
            indeterminate={inCat > 0 && inCat < group.rows.length}
            onChange={act(toggleCat)}
            label={T.catHead(group.label, inCat, group.rows.length)}
          />
        </div>
        {group.rows.map((r) => {
          const note = already?.(r)
          return (
            <Checkbox
              key={r.id}
              name={`trf-${r.id}`}
              checked={picked.has(r.id)}
              onChange={(on) => act(toggle)(r.id, on)}
              label={r.name}
              help={`${dateWithYear(r)} · ${r.clinic || r.doctor}${note ? ` · ${note}` : ''}`}
            />
          )
        })}
      </div>
      {err && (
        <p className="gpi-field__hint gpi-field__hint--err dash-trf__err" role="alert">{err}</p>
      )}
    </section>
  )
}

/* One hook owns the flow for a page: the shares store, the two dialogs (OTP +
   transfer) and the toast. The section page calls it once and hands the same
   object to the embedded history table, so the doctor row and the table rows
   drive ONE dialog and read ONE store. A standalone CuratioHistory (the parked
   v1 route) falls back to its own instance.
   `insured` (2026-09-10): an uninsured account has no personal doctor, so the
   dialog offers network doctors only and starts on that option.
   `personalOnly` (2026-09-16, change-doctor concept): the personal doctor is the
   only target — no switch, no network list. */
export function useTransfer({ personId, insured = true, personalOnly = false }) {
  const gate = useGate()
  const [shares, setShares] = useState(getShares)
  const [state, setState] = useState(null) /* { record } while the dialog is open */
  const [toast, setToast] = useState(null)

  const open = (record = null) => {
    const show = () => setState({ record })
    gate.unlocked ? show() : gate.request(show)
  }

  const modal = (
    <>
      {state && (
        <TransferDrawer insured={insured}
          personalOnly={personalOnly}
          personId={personId}
          record={state.record}
          shares={shares}
          onClose={() => setState(null)}
          onDone={({ ids, doctor, full }) => {
            addShares(ids, doctor)
            setShares(getShares())
            setState(null)
            const who = shortName(doctor.name)
            setToast({ text: full ? T.doneFull(who) : T.done(ids.length, who) })
          }}
        />
      )}
      {gate.modal}
    </>
  )

  return {
    shares,
    open,
    reset: () => {
      clearShares()
      setShares({})
    },
    /* `refresh` (2026-09-16): the change-doctor concept rewrites the store from its own
       hook; the table reads THIS state, so the concept calls back here after a change. */
    refresh: () => setShares(getShares()),
    modal,
    toast: <Toast toast={toast} onDone={() => setToast(null)} />,
  }
}

export function TransferDrawer({ personId, record = null, shares = {}, onClose, onDone, insured = true, personalOnly = false }) {
  const picker = useRecordPicker({ personId, record })
  const { ids, full } = picker
  const [target, setTarget] = useState(insured ? 'personal' : 'other')
  const [otherId, setOtherId] = useState(null)
  const [docQuery, setDocQuery] = useState('')
  const [bio, setBio] = useState(null) /* the doctor whose details modal is open */
  const [errs, setErrs] = useState({})

  const person = PERSONS.find((p) => p.id === personId)

  /* Network doctors in the wizard's row shape: role = specialty · clinic on the
     row (the clinic decides the choice); the bio modal gets the bare specialty. */
  const q = docQuery.trim().toLowerCase()
  const network = TRANSFER_DOCTORS.filter((d) => !q || `${d.name} ${d.spec} ${d.clinic}`.toLowerCase().includes(q))
  const rowShape = (d) => ({ ...d, role: `${d.spec} · ${d.clinic}` })
  const bioShape = (d) => ({ ...d, role: d.spec })

  const PD = currentDoctor() /* the change-doctor concept can swap her for the session */
  const doctor = target === 'personal' ? PD : TRANSFER_DOCTORS.find((d) => d.id === otherId) || null
  const already = (r) => (doctor && (shares[r.id] || []).some((d) => d.id === doctor.id) ? T.visible(shortName(doctor.name)) : '')

  const clearErr = (k) => errs[k] && setErrs((x) => ({ ...x, [k]: undefined }))

  const submit = () => {
    const e = {}
    if (ids.length === 0) e.pick = T.errNone
    if (!doctor) e.doctor = T.errDoctor
    setErrs(e)
    if (Object.keys(e).length) return
    onDone({ ids, doctor, full })
  }

  return (
    <>
      <Drawer
        title={T.title}
        onClose={onClose}
        className="dash-trfdrawer"
        footer={
          <>
            <span className="dash-trf__total" aria-live="polite">
              {ids.length ? T.totalLine(ids.length) : T.totalNone}
            </span>
            <Button variant="tertiary" size="md" onClick={onClose}>{T.cancel}</Button>
            <Button variant="primary" size="md" leadingIcon="arrow-right-left" onClick={submit}>
              {full ? T.confirmFull : ids.length ? T.confirm(ids.length) : T.confirmNone}
            </Button>
          </>
        }
      >
        <p className="dash-trf__ctx">{person?.name} · {D.cur.hist.title}</p>

        {/* 1 · ვის. Uninsured: no personal doctor exists, so there is nothing to
            switch between — the block is the network list alone. Concept mode
            (personalOnly): the personal doctor alone, nothing to switch either. */}
        <section className="dash-trf__block" aria-label={T.to}>
          <div className="dash-trf__head">
            <p className="dash-trf__lbl">1 · {T.to}</p>
          </div>
          {insured && !personalOnly && (
            <SegmentedControl
              variant="soft"
              size="md"
              value={target}
              onChange={(v) => { setTarget(v); clearErr('doctor') }}
              options={[
                { value: 'personal', label: T.personal, icon: 'user' },
                { value: 'other', label: T.otherShort, icon: 'users' },
              ]}
            />
          )}
          {target === 'personal' ? (
            <div className="dash-trf__doc">
              <Avatar src={PD.photo} seed={PD.avatar} name={PD.name} size={40} />
              <span className="dash-trf__docmeta">
                <span className="dash-trf__docname">{PD.name}</span>
                <span className="dash-trf__docsub">{personalOnly ? `${T.personal} · ${PD.spec}` : PD.spec}</span>
              </span>
            </div>
          ) : (
            <div className="dash-trf__network">
              <SearchField value={docQuery} onChange={setDocQuery} placeholder={T.docSearch} />
              <div className="dash-trf__doclist" role="list" aria-label={insured ? T.other : T.network}>
                {network.length === 0 && <p className="dash-trf__empty">{T.noDoctor}</p>}
                {network.map((d) => (
                  <DoctorRow
                    key={d.id}
                    doctor={rowShape(d)}
                    selected={otherId === d.id}
                    onSelect={(id) => { setOtherId(id); clearErr('doctor') }}
                    onDeselect={() => setOtherId(null)}
                    onInfo={() => setBio(bioShape(d))}
                  />
                ))}
              </div>
              {errs.doctor && (
                <p className="gpi-field__hint gpi-field__hint--err dash-trf__err" role="alert">{errs.doctor}</p>
              )}
            </div>
          )}
        </section>

        {/* 2 · რა გადავიტანოთ — the shared picker, one selection across the three categories. */}
        <RecordPicker picker={picker} label={`2 · ${T.scope}`} already={already} err={errs.pick} onChange={() => clearErr('pick')} />
      </Drawer>

      {/* Doctor details over the drawer — the booking wizard's own modal (Modal
          overlay z 1000 sits above the drawer's 900). Select there = pick here. */}
      {bio && (
        <DoctorBioModal
          doctor={bio}
          onClose={() => setBio(null)}
          onSelect={() => { setOtherId(bio.id); clearErr('doctor'); setBio(null) }}
        />
      )}
    </>
  )
}
