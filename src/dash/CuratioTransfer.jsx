import { useMemo, useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import Checkbox from '../components/Checkbox.jsx'
import Modal from '../components/Modal.jsx'
import Radio from '../components/Radio.jsx'
import SearchField from '../components/SearchField.jsx'
import Select from '../components/Select.jsx'
import Toast from '../components/Toast.jsx'
import { Button } from '../components/Button.jsx'
import { useGate } from './gate.jsx'
import { D } from './strings.js'
import {
  PERSONS, DOCTOR, TRANSFER_DOCTORS, ANALYSES, MEDS, VISITS,
  forPerson, dateWithYear, getShares, addShares, clearShares, shortName,
} from './curatioData.js'

/* ისტორიის გადატანა — the web transfer flow (2026-09-09, L0 agreed in chat).

   Mobile A5 hands the WHOLE history to another Curatio doctor: doctor list →
   confirm sheet → success. The web change request widens it in two ways and
   this one dialog carries both:
     · SCOPE — full history, or a checklist of records (grouped by the three
       history sections, searchable, select-all per section);
     · TARGET — the personal doctor, preselected, or another doctor from the
       network roster (mobile's TRANSFER_DOCTORS, verbatim).
   Two entry points, one dialog: the doctor row's kebab opens it empty (full
   history checked); a record's send icon opens it with THAT record picked
   under „არჩეული ჩანაწერები" and the personal doctor chosen — one click.
   After confirm the records carry „ხილვადია: <doctor>" in the table and the
   row icon turns into a check (glyph change, not colour alone — WCAG 1.4.1).

   Gate: history-class data, so the OTP comes first when the session is locked
   (mobile parity); the continuation opens this dialog only on success. Allowed
   for uninsured accounts — own data is never gated (comment #14 rule).

   Success = Toast + row marks (the desktop idiom; mobile keeps its success
   sheet because it has no toast). All copy is DRAFT until GPI signs it off;
   share-vs-transfer wording is an open stakeholder question.

   Rule 9: Modal · Radio · Checkbox · SearchField · Select (rich rows) · Avatar ·
   Button · Toast — nothing new. */

const T = D.cur.transfer

/* One hook owns the flow for a page: the shares store, the two dialogs (OTP +
   transfer) and the toast. The section page calls it once and hands the same
   object to the embedded history table, so the doctor row and the table rows
   drive ONE dialog and read ONE store. A standalone CuratioHistory (the parked
   v1 route) falls back to its own instance. */
/* `insured` (2026-09-10): an uninsured account has no personal doctor, so the
   dialog offers network doctors only and starts on that option. */
export function useTransfer({ personId, insured = true }) {
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
        <TransferModal insured={insured}
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
    modal,
    toast: <Toast toast={toast} onDone={() => setToast(null)} />,
  }
}

export function TransferModal({ personId, record = null, shares = {}, onClose, onDone, insured = true }) {
  const [mode, setMode] = useState(record ? 'selected' : 'full')
  const [picked, setPicked] = useState(() => new Set(record ? [record.id] : []))
  const [query, setQuery] = useState('')
  const [target, setTarget] = useState(insured ? 'personal' : 'other')
  const [otherId, setOtherId] = useState(null)
  const [errs, setErrs] = useState({})

  const person = PERSONS.find((p) => p.id === personId)
  /* The three history sections, in the table's order, scoped to the person the
     header switcher shows — the same forPerson() the table uses, so the checklist
     can never list a record the table would not. */
  const groups = useMemo(
    () => [
      { id: 'analyses', label: D.cur.hist.sections.analyses, rows: forPerson(ANALYSES, personId) },
      { id: 'meds', label: D.cur.hist.sections.meds, rows: forPerson(MEDS, personId) },
      { id: 'visits', label: D.cur.hist.sections.visits, rows: forPerson(VISITS, personId) },
    ],
    [personId],
  )
  const allIds = groups.flatMap((g) => g.rows.map((r) => r.id))
  const q = query.trim().toLowerCase()
  const match = (r) => !q || `${r.name} ${r.clinic || ''} ${r.doctor || ''}`.toLowerCase().includes(q)
  const shown = groups.map((g) => ({ ...g, shown: g.rows.filter(match) })).filter((g) => g.shown.length)

  const full = mode === 'full'
  const doctor = target === 'personal' ? DOCTOR : TRANSFER_DOCTORS.find((d) => d.id === otherId) || null
  const ids = full ? allIds : [...picked]
  const already = (r) => !!doctor && (shares[r.id] || []).some((d) => d.id === doctor.id)

  const clearErr = (k) => errs[k] && setErrs((x) => ({ ...x, [k]: undefined }))
  const toggle = (id, on) => {
    setPicked((p) => {
      const n = new Set(p)
      on ? n.add(id) : n.delete(id)
      return n
    })
    clearErr('pick')
  }
  /* Select-all works on the rows the search SHOWS, so a filtered „select all"
     never silently picks records the person cannot see. */
  const toggleGroup = (g) => {
    const every = g.shown.every((r) => picked.has(r.id))
    setPicked((p) => {
      const n = new Set(p)
      g.shown.forEach((r) => (every ? n.delete(r.id) : n.add(r.id)))
      return n
    })
    clearErr('pick')
  }

  const submit = () => {
    const e = {}
    if (!full && ids.length === 0) e.pick = T.errNone
    if (!doctor) e.doctor = T.errDoctor
    setErrs(e)
    if (Object.keys(e).length) return
    onDone({ ids, doctor, full })
  }

  return (
    <Modal
      title={T.title}
      onClose={onClose}
      className="dash-trfmodal"
      footer={
        <>
          <Button variant="tertiary" size="md" onClick={onClose}>{T.cancel}</Button>
          <Button variant="primary" size="md" leadingIcon="arrow-right-left" onClick={submit}>
            {full ? T.confirmFull : ids.length ? T.confirm(ids.length) : T.confirmNone}
          </Button>
        </>
      }
    >
      <p className="dash-trf__ctx">{person?.name} · {D.cur.hist.title}</p>

      <div className="dash-trf__block" role="radiogroup" aria-label={T.scope}>
        <p className="dash-trf__lbl">1 · {T.scope}</p>
        <div className={`dash-trf__opt${full ? ' is-on' : ''}`}>
          <Radio name="trf-scope" value="full" checked={full} onChange={() => setMode('full')} label={T.full} />
          <span className="dash-trf__sub">{groups.map((g) => `${g.label} ${g.rows.length}`).join(' · ')}</span>
        </div>
        <div className={`dash-trf__opt${!full ? ' is-on' : ''}`}>
          <Radio name="trf-scope" value="selected" checked={!full} onChange={() => setMode('selected')} label={T.selected} />
          {full ? (
            /* A count under the option NOT chosen is only worth a line once it says
               something — „არჩეულია 0" under an unselected radio is noise. */
            picked.size > 0 && <span className="dash-trf__sub">{T.selectedCount(picked.size)}</span>
          ) : (
            <>
              <span className="dash-trf__sub">{T.selectedCount(picked.size)}</span>
              <SearchField value={query} onChange={setQuery} placeholder={T.search} />
              <div className="dash-trf__list">
                {shown.length === 0 && <p className="dash-trf__empty">{T.noMatch}</p>}
                {shown.map((g) => {
                  const every = g.shown.every((r) => picked.has(r.id))
                  return (
                    <div key={g.id} className="dash-trf__group" role="group" aria-label={g.label}>
                      <div className="dash-trf__ghead">
                        <span>
                          {g.label} <span className="dash-trf__count">· {g.rows.length}</span>
                        </span>
                        <button type="button" className="gpi-link" onClick={() => toggleGroup(g)}>
                          {every ? T.clearAll : T.selectAll}
                        </button>
                      </div>
                      {g.shown.map((r) => (
                        <Checkbox
                          key={r.id}
                          name={`trf-${r.id}`}
                          checked={picked.has(r.id)}
                          onChange={(on) => toggle(r.id, on)}
                          label={r.name}
                          help={`${dateWithYear(r)} · ${r.clinic || r.doctor}${already(r) ? ` · ${T.visible(shortName(doctor.name))}` : ''}`}
                        />
                      ))}
                    </div>
                  )
                })}
              </div>
              {errs.pick && (
                <p className="gpi-field__hint gpi-field__hint--err dash-trf__err" role="alert">{errs.pick}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Uninsured: no personal doctor exists, so there is nothing to choose
          between — the block is the network picker alone, no radios. */}
      <div className="dash-trf__block" role={insured ? 'radiogroup' : undefined} aria-label={T.to}>
        <p className="dash-trf__lbl">2 · {T.to}</p>
        {insured && (
          <div className={`dash-trf__opt${target === 'personal' ? ' is-on' : ''}`}>
            <Radio name="trf-to" value="personal" checked={target === 'personal'} onChange={() => setTarget('personal')} label={T.personal} />
            <div className="dash-trf__doc">
              <Avatar src={DOCTOR.photo} name={DOCTOR.name} size={32} />
              <span className="dash-trf__docmeta">
                <span className="dash-trf__docname">{DOCTOR.name}</span>
                <span className="dash-trf__docsub">{DOCTOR.spec}</span>
              </span>
            </div>
          </div>
        )}
        <div className={`dash-trf__opt${target === 'other' ? ' is-on' : ''}`}>
          {insured && (
            <Radio name="trf-to" value="other" checked={target === 'other'} onChange={() => { setTarget('other'); clearErr('doctor') }} label={T.other} />
          )}
          {target === 'other' && (
            <div className="dash-trf__pick">
              <Select
                value={otherId}
                placeholder={T.pickDoctor}
                ariaLabel={insured ? T.pickDoctor : T.network}
                error={!!errs.doctor}
                options={TRANSFER_DOCTORS.map((d) => ({
                  value: d.id,
                  label: d.name,
                  sub: `${d.spec} · ${d.clinic}`,
                  lead: <Avatar name={d.name} size={32} />,
                }))}
                onChange={(v) => {
                  setOtherId(v)
                  clearErr('doctor')
                }}
              />
              {errs.doctor && (
                <p className="gpi-field__hint gpi-field__hint--err dash-trf__err" role="alert">{errs.doctor}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
