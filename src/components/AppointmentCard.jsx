import SegmentedControl from './SegmentedControl.jsx'
import BookingWorkspace from './BookingWorkspace.jsx'
import Avatar from './Avatar.jsx'
import { Button, IconButton } from './Button.jsx'
import { doctors, clinicByValue, fmtDateLong } from '../data/booking.js'
import { ka } from '../i18n/strings.js'

/* Only one personal-doctor appointment is allowed per booking. When one already
   exists (in another card), the "personal" type is disabled here. */
const typeOptions = (personalTaken) => [
  { value: 'personal', label: ka.wizard.typeSeg.personal, disabled: personalTaken, disabledReason: ka.wizard.step2.personalTaken },
  { value: 'specialist', label: ka.wizard.typeSeg.specialist },
  { value: 'instrumental', label: ka.wizard.typeSeg.instrumental },
]

/* AppointmentCard — an item in the Step-2 list (design node 104:8241).
   Collapsed = a horizontal summary row (avatar · name/role · date/time · clinic
   · edit + delete). Expanded = "ჩანაწერი N" header + type segmented control +
   the 3-column booking workspace + footer (გაუქმება / დამატება). */
export default function AppointmentCard({ appt, expanded, index, onToggle, onChange, onSave, onRemove, canSave, personalTaken = false }) {
  const doctor = doctors.find((d) => d.id === appt.doctorId)
  const clinic = clinicByValue(appt.slotClinic)

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
        <div className="gpi-asum__clinic">{clinic?.label}</div>
        <div className="gpi-asum__acts">
          <IconButton icon="pencil" title={ka.actions.edit} onClick={onToggle} />
          <IconButton icon="trash" title={ka.actions.cancel} onClick={onRemove} />
        </div>
      </div>
    )
  }

  return (
    <div className="gpi-appt gpi-appt--open">
      <div className="gpi-appt__hd">
        <span className="gpi-appt__title">{ka.wizard.step2.entry} {index}</span>
      </div>

      <SegmentedControl
        variant="indigo"
        value={appt.type}
        onChange={(t) => onChange({ ...appt, type: t, specialty: null, doctorId: null, date: null, slot: null, slotClinic: null })}
        options={typeOptions(personalTaken)}
      />

      <BookingWorkspace value={appt} onChange={onChange} />

      <div className="gpi-appt__ft">
        {doctor && appt.date && appt.slot && clinic ? (
          <div className="gpi-appt__ftsum">
            <Avatar name={doctor.name} seed={doctor.avatar} size={36} />
            <div className="gpi-appt__ftsumtxt">
              <span className="gpi-appt__ftname">{doctor.name}</span>
              <span className="gpi-appt__ftmeta">{fmtDateLong(appt.date)} · {appt.slot} · {clinic.label}</span>
            </div>
          </div>
        ) : <span className="gpi-appt__ftsum" />}
        <div className="gpi-appt__ftbtns">
          <Button variant="tertiary" size="md" onClick={onRemove}>{ka.wizard.book.cancel}</Button>
          <Button variant="primary" size="md" onClick={onSave} disabled={!canSave}>{ka.wizard.book.add}</Button>
        </div>
      </div>
    </div>
  )
}
