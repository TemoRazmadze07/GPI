import SegmentedControl from './SegmentedControl.jsx'
import Select from './Select.jsx'
import BookingWorkspace from './BookingWorkspace.jsx'
import Avatar from './Avatar.jsx'
import { Button, IconButton } from './Button.jsx'
import { doctors, clinicByValue, fmtDateLong } from '../data/booking.js'
import { t } from '../i18n/index.js'

/* Only one personal-doctor appointment is allowed per booking. When one already
   exists (in another card), the "personal" type is disabled here. */
const typeOptions = (personalTaken) => [
  { value: 'personal', label: t.wizard.typeSeg.personal, disabled: personalTaken, disabledReason: t.wizard.step2.personalTaken },
  { value: 'specialist', label: t.wizard.typeSeg.specialist },
  { value: 'instrumental', label: t.wizard.typeSeg.instrumental },
]

/* AppointmentCard — an item in the Step-2 list (design node 104:8241).
   Collapsed = a horizontal summary row (avatar · name/role · date/time · clinic
   · edit + delete). Expanded = "ჩანაწერი N" header + type segmented control +
   the 3-column booking workspace + footer (გაუქმება / დამატება). */
export default function AppointmentCard({ appt, expanded, index, onToggle, onChange, onSave, onRemove, canSave, personalTaken = false }) {
  const doctor = doctors.find((d) => d.id === appt.doctorId)
  const clinic = clinicByValue(appt.slotClinic)
  const isRemote = appt.type === 'personal' && appt.visit === 'remote'
  const placeLabel = isRemote ? t.wizard.visit.remote : clinic?.label

  if (!expanded) {
    return (
      <div className="gpi-asum">
        <div className="gpi-asum__person">
          <Avatar name={doctor?.name} seed={doctor?.avatar} size={40} />
          <div className="gpi-asum__meta">
            <span className="gpi-asum__name">{doctor?.name || '—'}</span>
            <span className="gpi-asum__role">{doctor?.role}</span>
          </div>
        </div>
        <div className="gpi-asum__when">
          <span className="gpi-asum__date">{fmtDateLong(appt.date)}</span>
          <span className="gpi-asum__time">{appt.slot}</span>
        </div>
        <div className="gpi-asum__clinic">{placeLabel}</div>
        <div className="gpi-asum__acts">
          <IconButton icon="pencil" title={t.actions.edit} onClick={onToggle} />
          <IconButton icon="trash" title={t.actions.cancel} onClick={onRemove} />
        </div>
      </div>
    )
  }

  return (
    // is-ready (slot picked, savable) drives the MOBILE sticky commit bar.
    <div className={`gpi-appt gpi-appt--open ${canSave ? 'is-ready' : ''}`}>
      <div className="gpi-appt__hd">
        <span className="gpi-appt__title">{t.wizard.step2.entry} {index}</span>
      </div>

      <SegmentedControl
        variant="indigo"
        value={appt.type}
        onChange={(nextType) => onChange({ ...appt, type: nextType, specialty: null, doctorId: null, date: null, slot: null, slotClinic: null })}
        options={typeOptions(personalTaken)}
      />
      {/* MOBILE variant of the same control — a dropdown (user request, 2026-07-17,
          evaluating uniform-dropdown filters). Desktop keeps the segmented pill;
          CSS shows exactly one of the two per viewport. */}
      <div className="gpi-appt__typesel">
        <Select
          value={appt.type}
          options={typeOptions(personalTaken)}
          onChange={(nextType) => onChange({ ...appt, type: nextType, specialty: null, doctorId: null, date: null, slot: null, slotClinic: null })}
        />
      </div>

      <BookingWorkspace value={appt} onChange={onChange} />

      <div className="gpi-appt__ft">
        {doctor && appt.date && appt.slot && (clinic || isRemote) ? (
          <div className="gpi-appt__ftsum">
            <Avatar name={doctor.name} seed={doctor.avatar} size={36} />
            <div className="gpi-appt__ftsumtxt">
              <span className="gpi-appt__ftname">{doctor.name}</span>
              <span className="gpi-appt__ftmeta">{fmtDateLong(appt.date)} · {appt.slot} · {placeLabel}</span>
            </div>
          </div>
        ) : <span className="gpi-appt__ftsum" />}
        <div className="gpi-appt__ftbtns">
          <Button variant="tertiary" size="md" onClick={onRemove}>{t.wizard.book.cancel}</Button>
          <Button variant="primary" size="md" onClick={onSave} disabled={!canSave}>{t.wizard.book.add}</Button>
        </div>
      </div>
    </div>
  )
}
