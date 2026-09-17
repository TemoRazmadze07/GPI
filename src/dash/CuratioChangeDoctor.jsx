import { useState } from 'react'
import DoctorBioModal from '../components/DoctorBioModal.jsx'
import DoctorRow from '../components/DoctorRow.jsx'
import Drawer from '../components/Drawer.jsx'
import SearchField from '../components/SearchField.jsx'
import Toast from '../components/Toast.jsx'
import { Button } from '../components/Button.jsx'
import { useGate } from './gate.jsx'
import { useRecordPicker, RecordPicker } from './CuratioTransfer.jsx'
import { D } from './strings.js'
import {
  PERSONS, TRANSFER_DOCTORS, currentDoctor, setPersonalDoctor, replaceShares, clearShares, shortName,
} from './curatioData.js'

/* პირადი ექიმის შეცვლა — the CHANGE-DOCTOR CONCEPT (2026-09-16), a comparison
   variant beside the published v2 transfer drawer (Rule 4: v2 untouched; the demo
   bar's „change doctor" chip switches the doctor row between the two).

   Why: the product owner's rule is that transferring history == changing the
   personal doctor — only the personal doctor can see Curatio history. v2 says
   „transfer history" and changes the doctor as a side effect nobody sees. This
   version makes the real act the call to action: the drawer asks for the NEW
   doctor first, carries the history handover as ONE pre-ticked option, and
   spells out what changes before the primary button. (The user is challenging
   the rule itself on 2026-09-17 — the substitute-doctor and referral cases —
   so both versions stay demonstrable.)

   Anatomy (L1 approved in chat 2026-09-16, kebab placement the user's ask):
     1 · ახალი პირადი ექიმი — search + the booking wizard's DoctorRow list over
       the Curatio network; the info trigger opens the wizard's DoctorBioModal
       over the drawer (select there picks here). ONE pick.
     2 · ისტორიის გადატანა ახალ ექიმთან — the transfer drawer's RecordPicker with
       EVERYTHING selected up front (round 2, user: „what if I want to share only
       some particular files when I change doctor" — the earlier single pre-ticked
       checkbox could not say which). Full history = leave it; particular files =
       untick; nothing = „ყველას მოხსნა". The footer totals it. A consent line
       under the picker names who gets access (mobile docsel wording, Rule 6).
       The consent risk of a pre-selected handover on health data stays flagged.
     (Round 2 removed „3 · რა შეიცვლება" — the user's call; the „old doctor loses
       access" line went with it.)
   Footer: total · გაუქმება · primary „ექიმის შეცვლა". Validation on submit (no
   doctor → inline role=alert, clears on pick). OTP first when the session is
   locked — the handover is history-class data, same gate as the transfer flow.

   After confirm: currentDoctor() = the pick (sessionStorage); the shares store
   is REPLACED — the picked records → the new doctor, or nothing — so the table's
   „ხილვადია" marks and the check glyph follow the new doctor; Toast names the
   outcome (full / N records / none). The doctor row re-renders with the new
   doctor, no next visit, and Book reading „პირველი ვიზიტის ჩაწერა". Whatever
   was NOT handed over can follow later: the row's kebab keeps „ისტორიის
   გადატანა" (the transfer drawer, personal doctor only in this mode).

   Rule 9: Drawer · SearchField · DoctorRow · DoctorBioModal · RecordPicker ·
   Button · Toast — nothing new. */

const C = D.cur.change

/* `onChanged`: the history table renders the shares through useTransfer's state —
   after a handover (or the demo reset) the section passes `transfer.refresh` here. */
export function useChangeDoctor({ personId, onChanged }) {
  const gate = useGate()
  const [open, setOpen] = useState(false)
  const [doctor, setDoctor] = useState(currentDoctor)
  const [toast, setToast] = useState(null)

  const show = () => (gate.unlocked ? setOpen(true) : gate.request(() => setOpen(true)))

  const reset = () => {
    setPersonalDoctor(null)
    clearShares()
    setDoctor(currentDoctor())
    onChanged?.()
  }

  const modal = (
    <>
      {open && (
        <ChangeDoctorDrawer
          personId={personId}
          onClose={() => setOpen(false)}
          onDone={({ doctor: next, ids, full }) => {
            setPersonalDoctor(next.id)
            ids.length ? replaceShares(ids, next) : clearShares()
            onChanged?.()
            setDoctor(currentDoctor())
            setOpen(false)
            const who = shortName(next.name)
            setToast({ text: full ? C.doneHist(who) : ids.length ? C.doneN(ids.length, who) : C.done(who) })
          }}
        />
      )}
      {gate.modal}
    </>
  )

  return { doctor, open: show, reset, modal, toast: <Toast toast={toast} onDone={() => setToast(null)} /> }
}

export function ChangeDoctorDrawer({ personId, onClose, onDone }) {
  const current = currentDoctor()
  const [pickedId, setPickedId] = useState(null)
  const [query, setQuery] = useState('')
  const [bio, setBio] = useState(null)
  const [err, setErr] = useState(null)
  /* The handover: every record selected up front (see the header note). */
  const picker = useRecordPicker({ personId, all: true })
  const { ids, full } = picker

  const person = PERSONS.find((p) => p.id === personId)
  /* The network minus whoever is the personal doctor right now — listing her as
     a „new" doctor would be a trap. */
  const q = query.trim().toLowerCase()
  const network = TRANSFER_DOCTORS
    .filter((d) => d.id !== current.id)
    .filter((d) => !q || `${d.name} ${d.spec} ${d.clinic}`.toLowerCase().includes(q))
  const rowShape = (d) => ({ ...d, role: `${d.spec} · ${d.clinic}` })
  const bioShape = (d) => ({ ...d, role: d.spec })
  const picked = TRANSFER_DOCTORS.find((d) => d.id === pickedId) || null
  const pick = (id) => { setPickedId(id); setErr(null) }

  const submit = () => {
    if (!picked) return setErr(C.errDoctor)
    onDone({ doctor: picked, ids, full })
  }

  return (
    <>
      <Drawer
        title={C.title}
        onClose={onClose}
        className="dash-trfdrawer dash-chgdrawer"
        footer={
          <>
            <span className="dash-trf__total" aria-live="polite">
              {ids.length ? D.cur.transfer.totalLine(ids.length) : D.cur.transfer.totalNone}
            </span>
            <Button variant="tertiary" size="md" onClick={onClose}>{C.cancel}</Button>
            <Button variant="primary" size="md" onClick={submit}>{C.confirm}</Button>
          </>
        }
      >
        <p className="dash-trf__ctx">{C.ctx(person?.name, current.name)}</p>

        {/* 1 · the new doctor — the transfer drawer's network block, verbatim. */}
        <section className="dash-trf__block" aria-label={C.pick}>
          <div className="dash-trf__head">
            <p className="dash-trf__lbl">1 · {C.pick}</p>
          </div>
          <div className="dash-trf__network">
            <SearchField value={query} onChange={setQuery} placeholder={D.cur.transfer.docSearch} />
            <div className="dash-trf__doclist" role="list" aria-label={C.pick}>
              {network.length === 0 && <p className="dash-trf__empty">{D.cur.transfer.noDoctor}</p>}
              {network.map((d) => (
                <DoctorRow
                  key={d.id}
                  doctor={rowShape(d)}
                  selected={pickedId === d.id}
                  onSelect={pick}
                  onDeselect={() => setPickedId(null)}
                  onInfo={() => setBio(bioShape(d))}
                />
              ))}
            </div>
            {err && <p className="gpi-field__hint gpi-field__hint--err dash-trf__err" role="alert">{err}</p>}
          </div>
        </section>

        {/* 2 · the handover — the shared picker, everything selected up front, plus
            the consent line naming who gets access. */}
        <RecordPicker picker={picker} label={`2 · ${C.hist}`} />
        <p className="dash-trf__ctx">{C.consent(picked ? shortName(picked.name) : C.newDoc)}</p>
      </Drawer>

      {bio && (
        <DoctorBioModal
          doctor={bio}
          onClose={() => setBio(null)}
          onSelect={() => { pick(bio.id); setBio(null) }}
        />
      )}
    </>
  )
}
