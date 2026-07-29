import { useState, useEffect, useRef } from 'react'
import Stepper from '../components/Stepper.jsx'
import PersonCard from '../components/PersonCard.jsx'
import PromoCard from '../components/PromoCard.jsx'
import WizardFooter from '../components/WizardFooter.jsx'
import AppointmentCard from '../components/AppointmentCard.jsx'
import AddInsuredModal from '../components/AddInsuredModal.jsx'
import NotificationPeek from '../components/NotificationPeek.jsx'
import ReservationCountdown from '../components/ReservationCountdown.jsx'
import Avatar from '../components/Avatar.jsx'
import Icon from '../lib/Icon.jsx'
import { Button } from '../components/Button.jsx'
import ReviewSection, { ReviewRow } from '../components/ReviewSection.jsx'
import { insuredPersons, defaultInsuredId } from '../data/insured.js'
import { doctors, clinicByValue, fmtDate, fmtDateLong, directionsFor, rescheduleDraft, editDraft } from '../data/booking.js'
import { appointmentById, confirmBooking } from '../data/appointments.js'
import { downloadIcs } from '../lib/ics.js'
import { t } from '../i18n/index.js'

const STEPS = [
  { id: 'insured', label: t.wizard.steps.insured },
  { id: 'booking', label: t.wizard.steps.booking },
  { id: 'review', label: t.wizard.steps.review },
]

// URL per wizard step — mirrors the Flow Map hierarchy (see App.jsx router).
const STEP_PATHS = [
  '#/desktop/appointments/book',
  '#/desktop/appointments/book/schedule',
  '#/desktop/appointments/book/review',
  '#/desktop/appointments/book/done',
]

const newDraft = (type = 'personal', insured = null) => {
  const d = {
    id: 'a' + Math.random().toString(36).slice(2, 8),
    type,
    city: insured?.city || 'tbilisi',
    specialty: null,
    activeClinics: [], // clinic FILTER — empty = no filter (show all clinics)
    doctorId: null,
    date: null,
    slot: null,
    slotClinic: null,
  }
  // Returning patient: carry the assigned personal doctor + default visit type so
  // the personal path locks to that doctor (set regardless of the initial type,
  // since the card's type switch can move a fresh draft to "personal").
  if (insured?.personalDoctorId) {
    d.assignedDoctorId = insured.personalDoctorId
    d.visit = 'inclinic'
  }
  return d
}

export default function WizardScreen({ onExit, initialStep = 0, rescheduleFrom = null, editFrom = null }) {
  const [stepIdx, setStepIdx] = useState(initialStep)
  const [people, setPeople] = useState(insuredPersons)
  const [selectedId, setSelectedId] = useState(defaultInsuredId)
  const [showAddInsured, setShowAddInsured] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [draft, setDraft] = useState(null)
  const [confirmed, setConfirmed] = useState([])
  // Reservation hold: the server holds the doctor for 15 min from the moment the
  // FIRST appointment lands in the cart. One timer covers the whole session.
  const [holdStartedAt, setHoldStartedAt] = useState(null)

  // Deep-link entry from a table row — seed ONCE, pre-select the insured person
  // and open Step 2 with a pre-filled draft:
  //   · reschedule/rebook (finished/cancelled) → same doctor + clinic, CLOSEST date & slot.
  //   · edit (ongoing) → same doctor + clinic, the EXACT booked date & slot;
  //     the personal doctor is locked (editDraft sets `edit:true`).
  const seeded = useRef(false)
  useEffect(() => {
    if (seeded.current) return
    const id = editFrom || rescheduleFrom
    if (!id) return
    const appt = appointmentById(id)
    if (!appt) return
    seeded.current = true
    setSelectedId(appt.insuredId)
    setDraft(editFrom ? editDraft(appt) : rescheduleDraft(appt))
  }, [editFrom, rescheduleFrom])

  // Reflect the wizard step in the URL (silent) so Flow Map share/dev links can
  // deep-link to a specific step and the address bar tracks navigation.
  useEffect(() => {
    // Keep the ?ui=flat variant flag (de-boxed mobile mock) across the rewrite.
    const flat = /[?&]ui=flat/.test(window.location.hash) ? '?ui=flat' : ''
    window.history.replaceState(null, '', (STEP_PATHS[stepIdx] || STEP_PATHS[0]) + flat)
  }, [stepIdx])

  // Sync when an external deep-link changes the target step (e.g. pasting /review).
  // The success step only exists AFTER a confirm in this session — a cold
  // deep-link to /done has nothing to show, so it lands on the start instead.
  // (Must live INSIDE this effect: a separate bounce effect loses the race —
  // both setStepIdx calls queue in the same mount commit and this one wins.)
  useEffect(() => {
    setStepIdx(initialStep === 3 && confirmed.length === 0 ? 0 : initialStep)
  }, [initialStep]) // eslint-disable-line react-hooks/exhaustive-deps — confirmed is read fresh per run

  const insured = people.find((p) => p.id === selectedId)
  const owner = people.find((p) => p.relation === 'owner')

  // Switching the insured on Step 1 must re-point an in-progress (unsaved, non-edit)
  // draft at the new person's assigned personal doctor + city — otherwise the
  // personal-doctor lock would keep the previous person's doctor. A personal draft
  // also drops its current selection so the workspace re-locks; other types keep it.
  const selectInsured = (id) => {
    setSelectedId(id)
    const p = people.find((x) => x.id === id)
    setDraft((d) => {
      if (!d || d.edit) return d
      const patch = { ...d, assignedDoctorId: p?.personalDoctorId || null, city: p?.city || d.city }
      if (d.type === 'personal') { patch.doctorId = null; patch.date = null; patch.slot = null; patch.slotClinic = null }
      return patch
    })
  }

  // Newly added insured (via lookup or manual entry) is appended to the list
  // and auto-selected, so the user continues with the person they just added.
  const handleAddInsured = (person) => {
    setPeople((prev) => (prev.some((p) => p.id === person.id) ? prev : [...prev, person]))
    setSelectedId(person.id)
    setShowAddInsured(false)
  }
  const canSaveDraft = !!(draft && draft.doctorId && draft.date && draft.slot)

  // Max one personal-doctor appointment per booking.
  const hasPersonal = (excludeId) => appointments.some((a) => a.type === 'personal' && a.id !== excludeId)
  const startNewDraft = () => setDraft(newDraft(hasPersonal(null) ? 'specialist' : 'personal', insured))

  // Landing on step 2 with an empty cart: the only possible next action is the
  // booking form, so open it immediately — no placeholder click. Fires on step
  // ENTRY only (deps), so a draft the user explicitly cancels stays closed
  // (placeholder returns as the fallback). Deep-link flows seed their own draft.
  useEffect(() => {
    if (stepIdx === 1 && !draft && appointments.length === 0 && !editFrom && !rescheduleFrom) {
      startNewDraft()
    }
  }, [stepIdx]) // eslint-disable-line react-hooks/exhaustive-deps -- entry-only trigger

  const saveDraft = () => {
    setAppointments((prev) => {
      const i = prev.findIndex((p) => p.id === draft.id)
      if (i >= 0) {
        const c = [...prev]
        c[i] = draft
        return c
      }
      return [...prev, draft]
    })
    setDraft(null)
  }

  // Start the 15-min hold the first time an appointment reaches the cart; never
  // resets on later edits (one session timer). Cleared only by confirm / restart.
  useEffect(() => {
    if (appointments.length > 0 && holdStartedAt === null) setHoldStartedAt(Date.now())
  }, [appointments.length, holdStartedAt])

  // Hold expired → release everything but keep the insured person, and reopen a
  // fresh doctor selection on Step 2 (exactly what the release dialog promises).
  const restartBooking = () => {
    setAppointments([])
    setDraft(newDraft('personal', insured))
    setHoldStartedAt(null)
    setStepIdx(1)
  }

  const ContextBand = () => (
    <section className="gpi-card gpi-ctxband">
      <div className="gpi-ctx__group">
        <span className="gpi-ctx__label">{t.wizard.step2.patient}</span>
        <div className="gpi-ctx__person">
          <Avatar name={insured.name} seed={insured.avatar} size={36} />
          <div className="gpi-ctx__meta">
            <span className="gpi-ctx__name">{insured.name}</span>
            <span className="gpi-ctx__id">{insured.policyId}</span>
          </div>
          <span className="gpi-badge gpi-badge--sm gpi-badge--neutral">{t.wizard.relation[insured.relation]}</span>
          <button className="gpi-ctx__edit" aria-label={t.actions.edit} onClick={() => setStepIdx(0)}>
            <Icon name="pencil" size={16} />
          </button>
        </div>
      </div>

      {insured.relation !== 'owner' && (
        <>
          <span className="gpi-ctx__div" />
          <div className="gpi-ctx__group">
            <span className="gpi-ctx__label">{t.wizard.step2.policyOwner}</span>
            <div className="gpi-ctx__person">
              <Avatar name={owner.name} seed={owner.avatar} size={36} />
              <div className="gpi-ctx__meta">
                <span className="gpi-ctx__name">{owner.name}</span>
                <span className="gpi-ctx__id">{owner.policyId}</span>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="gpi-ctx__note">
        <Icon name="info" size={16} />
        <span>{t.wizard.step2.note}</span>
      </div>
    </section>
  )

  const confirm = () => {
    setConfirmed(confirmBooking(selectedId, appointments))
    setStepIdx(3)
  }

  const footer = stepIdx < 3 ? [
    { back: onExit, cont: () => setStepIdx(1), label: t.wizard.footer.continue, icon: 'arrow-right', can: true },
    { back: () => setStepIdx(0), cont: () => setStepIdx(2), label: t.wizard.footer.continue, icon: 'arrow-right', can: appointments.length > 0 && !draft, hint: draft ? t.wizard.footer.finishDraft : null },
    { back: () => setStepIdx(1), cont: confirm, label: t.wizard.footer.confirm, icon: 'check', can: appointments.length > 0 },
  ][stepIdx] : null

  return (
    <div className="gpi-wizard">
      <Stepper steps={STEPS} current={stepIdx} />

      {holdStartedAt !== null && (stepIdx === 1 || stepIdx === 2) && (
        <ReservationCountdown startedAt={holdStartedAt} onRestart={restartBooking} />
      )}

      {stepIdx === 0 && (
        <div className="gpi-wizard__body">
          <section className="gpi-card gpi-insured">
            <h2 className="t-h3 gpi-insured__title">{t.wizard.insured.title}</h2>
            <div className="gpi-insured__grid" role="radiogroup" aria-label={t.wizard.insured.title}>
              {people.map((p) => (
                <PersonCard key={p.id} person={p} selected={selectedId === p.id} onSelect={selectInsured} />
              ))}
            </div>
            <div className="gpi-insured__add">
              <Button variant="tertiary" size="md" leadingIcon="user-plus" onClick={() => setShowAddInsured(true)}>
                {t.wizard.insured.add}
              </Button>
            </div>
          </section>
          <PromoCard />
        </div>
      )}

      {stepIdx === 1 && (
        <div className="gpi-wizard__stack">
          {/* Patient context band hidden for now — restore <ContextBand /> to bring it back. */}
          {/* ?ui=flat (in the hash query) turns on the DE-BOXED mobile mock —
              comparison variant, 2026-07-27; default URL keeps the current UI. */}
          <section className={`gpi-card gpi-cart${/[?&]ui=flat/.test(window.location.hash) ? ' gpi-flat' : ''}`}>
            <div className="gpi-cart__hd">
              <div className="t-h3">{t.wizard.step2.title}</div>
              <div className="t-body gpi-muted">{t.wizard.step2.subtitle}</div>
            </div>
            {appointments
              .filter((a) => a.id !== draft?.id)
              .map((a, i) => (
                <AppointmentCard
                  key={a.id}
                  appt={a}
                  index={i + 1}
                  expanded={false}
                  onToggle={() => setDraft({ ...a })}
                  onRemove={() => setAppointments((prev) => prev.filter((p) => p.id !== a.id))}
                />
              ))}
            {draft && (
              <AppointmentCard
                appt={draft}
                index={appointments.filter((a) => a.id !== draft.id).length + 1}
                expanded
                onChange={setDraft}
                onSave={saveDraft}
                onRemove={() => setDraft(null)}
                canSave={canSaveDraft}
                personalTaken={hasPersonal(draft.id)}
              />
            )}
            {!draft && (
              <button className="gpi-cart__add" onClick={startNewDraft}>
                <Icon name="plus" size={20} />
                {appointments.length === 0 ? t.wizard.step2.add : t.wizard.step2.addMore}
              </button>
            )}
          </section>
        </div>
      )}

      {stepIdx === 2 && (
        <div className="gpi-wizard__stack">
          <section className="gpi-card gpi-review">
            <h2 className="t-h3 gpi-review__heading">{t.wizard.review.heading}</h2>

            <ReviewSection
              icon="user"
              title={t.wizard.review.insured}
              summary={`${insured.name} · ${insured.policyId}`}
              onEdit={() => setStepIdx(0)}
            >
              <ReviewRow label={t.wizard.review.name}>{insured.name}</ReviewRow>
              <ReviewRow label={t.wizard.review.policy}>{insured.policyId}</ReviewRow>
              <ReviewRow label={t.wizard.review.relation}>{t.wizard.relation[insured.relation]}</ReviewRow>
            </ReviewSection>

            {appointments.map((a, i) => {
              const dr = doctors.find((d) => d.id === a.doctorId)
              const cl = clinicByValue(a.slotClinic)
              const direction = a.specialty ? directionsFor(a.type).find((o) => o.value === a.specialty) : null
              const isRemote = a.type === 'personal' && a.visit === 'remote'
              return (
                <ReviewSection
                  key={a.id}
                  icon="stethoscope"
                  title={`${t.wizard.step2.entry} ${i + 1} — ${t.wizard.types[a.type]}`}
                  summary={`${dr?.name} · ${fmtDate(a.date)} · ${a.slot}`}
                  onEdit={() => { setDraft({ ...a }); setStepIdx(1) }}
                >
                  <ReviewRow label={t.wizard.review.doctor}>{dr?.name}</ReviewRow>
                  {direction && (
                    <ReviewRow label={a.type === 'instrumental' ? t.wizard.review.study : t.wizard.review.direction}>
                      {direction.label}
                    </ReviewRow>
                  )}
                  <ReviewRow label={t.wizard.review.when}>{fmtDateLong(a.date)} · {a.slot}</ReviewRow>
                  {isRemote ? (
                    <ReviewRow label={t.wizard.review.format}>{t.wizard.visit.remote}</ReviewRow>
                  ) : (
                    <>
                      <ReviewRow label={t.wizard.review.clinic}>{cl?.label}</ReviewRow>
                      <ReviewRow label={t.wizard.review.address}>{cl?.address}</ReviewRow>
                    </>
                  )}
                </ReviewSection>
              )
            })}

            <div className="gpi-alert">
              <Icon name="info" size={20} />
              <span>{t.wizard.review.note}</span>
            </div>
          </section>
        </div>
      )}

      {stepIdx === 3 && (
        <div className="gpi-wizard__stack">
          <section className="gpi-card gpi-success">
            <div className="gpi-success__icon">
              <Icon name="check" size={28} />
            </div>
            <h2 className="t-h3 gpi-success__title">{t.wizard.success.title}</h2>
            <p className="gpi-success__sub">{t.wizard.success.subtitle}</p>
            <div className="gpi-success__rows">
              {confirmed.map((r) => (
                <div className="gpi-asum" key={r.id}>
                  <div className="gpi-asum__person">
                    <Avatar name={r.doctor.name} seed={r.doctor.avatar} size={40} />
                    <div className="gpi-asum__meta">
                      <span className="gpi-asum__name">{r.doctor.name}</span>
                      <span className="gpi-asum__role">{r.doctor.specialty}</span>
                    </div>
                  </div>
                  <div className="gpi-asum__when">
                    <span className="gpi-asum__date">{r.dateLabel}</span>
                    <span className="gpi-asum__time">{r.time}</span>
                  </div>
                  <div className="gpi-asum__clinic">{r.clinic.name}</div>
                </div>
              ))}
            </div>
            <div className="gpi-alert">
              <Icon name="info" size={20} />
              <span>{t.wizard.success.note}</span>
            </div>
            <div className="gpi-success__acts">
              <Button variant="primary" size="md" trailingIcon="arrow-right" onClick={onExit}>
                {t.wizard.success.toList}
              </Button>
              <Button variant="secondary" size="md" leadingIcon="calendar" onClick={() => downloadIcs(confirmed)}>
                {t.wizard.success.calendar}
              </Button>
            </div>
          </section>
          <NotificationPeek bookings={confirmed} />
        </div>
      )}

      {footer && (
        <WizardFooter
          onBack={footer.back}
          onContinue={footer.cont}
          canContinue={footer.can}
          continueLabel={footer.label}
          continueIcon={footer.icon}
          hint={footer.hint}
        />
      )}

      {showAddInsured && (
        <AddInsuredModal
          existingIds={people.map((p) => p.id)}
          onAdd={handleAddInsured}
          onClose={() => setShowAddInsured(false)}
        />
      )}
    </div>
  )
}
