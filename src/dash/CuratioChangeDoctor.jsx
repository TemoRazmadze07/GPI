import { useState } from 'react'
import DoctorBioModal from '../components/DoctorBioModal.jsx'
import DoctorRow from '../components/DoctorRow.jsx'
import Drawer from '../components/Drawer.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import Select from '../components/Select.jsx'
import Toast from '../components/Toast.jsx'
import { Button } from '../components/Button.jsx'
import { useGate } from './gate.jsx'
import { D } from './strings.js'
import {
  PERSONS, CLINICS, personalDoctorsAt, currentDoctor, setPersonalDoctor, handoverShares, clearShares,
  allRecordIds, shortName,
} from './curatioData.js'

/* პირადი ექიმის შეცვლა — the change-doctor drawer. THE DEFAULT on #/dash/curatio
   since 2026-09-17 (the PO discussion settled the rule; the published v2 transfer
   drawer stays as the comparison baseline behind the demo chip „transfer (v2)",
   Rule 4).

   The rule: transferring history == changing the personal doctor, and the history
   moves AUTOMATICALLY — the new personal doctor sees it, the old one stops. So the
   drawer no longer asks WHAT to hand over (the 09-16 record picker is gone); it
   states the rule once, up front, and asks WHERE and WHO. Sharing particular
   records with a doctor is the history table's job alone (each row's send icon).

   Anatomy (the user's change request, 2026-09-17):
     context line (person · current personal doctor)
     InlineAlert (info) — „after you choose a new personal doctor, your medical
       history is transferred to them automatically" — the one thing to know
       before choosing, so it leads.
     „აირჩიე კლინიკა" — the shared Select over the eight Tbilisi Curatio clinics
       (the booking wizard's own list; rich rows carry the address, because the
       address is how one picks a clinic). The doctor block waits for it.
     „აირჩიე ახალი პირადი ექიმი" — the wizard's DoctorRow list of the personal
       doctors who practise at THAT clinic (the current doctor excluded — listing
       her as „new" would be a trap); the info trigger opens the wizard's
       DoctorBioModal over the drawer (select there picks here). ONE pick.
     Headings are instructions without step numbers (round 3) at Heading/H5.
   Footer: გაუქმება · primary „ექიმის შეცვლა". Validation on submit — no clinic →
   error under the select; no doctor → error under the list — both inline
   role=alert, cleared live by the next pick. OTP first when the session is
   locked: the handover is history-class data, same gate as the transfer flow.

   After confirm: currentDoctor() = the pick at that clinic (sessionStorage);
   every record of the person is marked visible to the new doctor and the old
   doctor drops off them (handoverShares keeps other doctors' shares); Toast
   „პირადი ექიმი შეიცვალა: … · სრული ისტორია გადატანილია". The doctor row
   re-renders with the new doctor, no next visit, Book reading „first visit".

   Rule 9: Drawer · InlineAlert · Select · DoctorRow · DoctorBioModal · Button ·
   Toast — nothing new. */

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
          onDone={({ doctor: next, clinic }) => {
            const previous = currentDoctor()
            setPersonalDoctor(next.id, clinic.value)
            handoverShares(allRecordIds(personId), previous, next)
            onChanged?.()
            setDoctor(currentDoctor())
            setOpen(false)
            setToast({ text: C.doneHist(shortName(next.name)) })
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
  const [clinicValue, setClinicValue] = useState('')
  const [pickedId, setPickedId] = useState(null)
  const [bio, setBio] = useState(null)
  const [err, setErr] = useState(null) /* { clinic } | { doctor } */

  const person = PERSONS.find((p) => p.id === personId)
  const clinic = CLINICS.find((c) => c.value === clinicValue) || null
  /* The personal doctors at the chosen clinic, minus whoever is the personal doctor now. */
  const list = clinic ? personalDoctorsAt(clinic.value, current.bookingId) : []
  const picked = list.find((d) => d.id === pickedId) || null
  const rowShape = (d) => ({ ...d, role: `${d.spec} · ${clinic.label}` })
  const bioShape = (d) => ({ ...d, role: d.spec })

  /* A new clinic starts the doctor choice over — the pick belonged to the old list. */
  const pickClinic = (v) => { setClinicValue(v); setPickedId(null); setErr(null) }
  const pick = (id) => { setPickedId(id); setErr(null) }

  const submit = () => {
    if (!clinic) return setErr({ clinic: C.errClinic })
    if (!picked) return setErr({ doctor: C.errDoctor })
    onDone({ doctor: picked, clinic })
  }

  const clinicOptions = CLINICS.map((c) => ({ value: c.value, label: c.label, sub: c.address }))

  return (
    <>
      <Drawer
        title={C.title}
        onClose={onClose}
        className="dash-trfdrawer dash-chgdrawer"
        footer={
          <>
            <Button variant="tertiary" size="md" onClick={onClose}>{C.cancel}</Button>
            <Button variant="primary" size="md" onClick={submit}>{C.confirm}</Button>
          </>
        }
      >
        <p className="dash-trf__ctx">{C.ctx(person?.name, current.name)}</p>

        {/* The rule, stated before any choice is made. */}
        <InlineAlert tone="info">{C.info}</InlineAlert>

        {/* 1 · the clinic — the wizard's many-clinic dropdown, address on every row. */}
        <section className="dash-trf__block" aria-label={C.clinic}>
          <div className="dash-trf__head">
            <p className="dash-trf__lbl">{C.clinic}</p>
          </div>
          <Select
            value={clinicValue}
            placeholder={C.clinicPh}
            options={clinicOptions}
            onChange={pickClinic}
            error={!!err?.clinic}
            ariaLabel={C.clinic}
          />
          {err?.clinic && <p className="gpi-field__hint gpi-field__hint--err dash-trf__err" role="alert">{err.clinic}</p>}
        </section>

        {/* 2 · the doctor — shown once a clinic is chosen (the user's sequence). */}
        {clinic && (
          <section className="dash-trf__block" aria-label={C.pick}>
            <div className="dash-trf__head">
              <p className="dash-trf__lbl">{C.pick}</p>
            </div>
            <div className="dash-trf__doclist" role="list" aria-label={C.pick}>
              {list.length === 0 && <p className="dash-trf__empty">{C.noDoctor}</p>}
              {list.map((d) => (
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
            {err?.doctor && <p className="gpi-field__hint gpi-field__hint--err dash-trf__err" role="alert">{err.doctor}</p>}
          </section>
        )}
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
