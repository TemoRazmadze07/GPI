import Avatar from './Avatar.jsx'
import Badge from './Badge.jsx'
import Icon from '../lib/Icon.jsx'
import { IconButton } from './Button.jsx'
import { groupByDate } from '../data/appointments.js'
import { t as strings } from '../i18n/index.js'

const STATUS_COLOR = { ongoing: 'success', finished: 'neutral', cancelled: 'error' }

function StatusBadge({ status }) {
  return <Badge color={STATUS_COLOR[status]} size="md">{strings.status[status]}</Badge>
}

function RowActions({ status, onReschedule, onEdit, onCancel }) {
  if (status === 'ongoing') {
    // edit → deep-link into the wizard pre-filled to the EXACT booked slot;
    // cancel (trash) → confirmation modal, then mark the row cancelled.
    return (
      <div className="gpi-row__actions">
        <IconButton icon="pencil" tone="neutral" title={strings.actions.edit} onClick={onEdit} />
        <IconButton icon="trash" tone="danger" title={strings.actions.cancel} onClick={onCancel} />
      </div>
    )
  }
  // finished / cancelled → reschedule/rebook: deep-link into the wizard pre-filled.
  return (
    <div className="gpi-row__actions">
      <IconButton icon="rotate-ccw" tone="neutral" title={strings.actions.rebook} onClick={onReschedule} />
    </div>
  )
}

function Row({ a, onReschedule, onEdit, onCancel }) {
  return (
    <div className="gpi-row">
      {/* Doctor */}
      <div className="gpi-cell gpi-cell--doctor">
        <Avatar name={a.doctor.name} seed={a.doctor.avatar} size={40} />
        <div className="gpi-doctor__meta">
          <span className="t-body gpi-doctor__name">{a.doctor.name}</span>
          <span className="t-body-sm gpi-muted">{a.doctor.specialty}</span>
        </div>
      </div>

      {/* Date & time. The date repeats the group separator above it — mobile
          hides it there (the separator goes sticky instead) and promotes the
          time, so the card never spends a line on a duplicate. */}
      <div className="gpi-cell gpi-cell--datetime">
        <Icon name="clock" size={16} className="gpi-cell__mico" />
        <span className="t-body gpi-strong gpi-dt__date">{a.dateLabel}</span>
        <span className="t-body-sm gpi-muted gpi-dt__time">{a.time}</span>
      </div>

      {/* Clinic */}
      <div className="gpi-cell gpi-cell--clinic">
        <Icon name={a.clinic.isPhone ? 'phone' : 'map-pin'} size={16} className="gpi-cell__mico" />
        <span className="t-body gpi-clinic__name">
          {a.clinic.isPhone && <Icon name="phone" size={16} className="gpi-clinic__icon" />}
          {a.clinic.name}
        </span>
        {a.clinic.address && <span className="t-body-sm gpi-muted">{a.clinic.address}</span>}
      </div>

      {/* Status */}
      <div className="gpi-cell gpi-cell--status">
        <StatusBadge status={a.status} />
      </div>

      {/* Patient (insured person). Two person names sit on one mobile card with
          no column headers to separate them — the leading icons do that job. */}
      <div className="gpi-cell gpi-cell--patient">
        <Icon name="user" size={16} className="gpi-cell__mico" />
        <span className="t-body">{a.patient.name}</span>
      </div>

      {/* Actions */}
      <div className="gpi-cell gpi-cell--actions">
        <RowActions
          status={a.status}
          onReschedule={() => onReschedule?.(a.id)}
          onEdit={() => onEdit?.(a.id)}
          onCancel={() => onCancel?.(a.id)}
        />
      </div>
    </div>
  )
}

export default function AppointmentsTable({ items, onReschedule, onEdit, onCancel }) {
  const t = strings.table
  const groups = groupByDate(items)
  return (
    <div className="gpi-table">
      <h2 className="t-h3 gpi-table__heading">{t.heading}</h2>

      {/* Column header */}
      <div className="gpi-table__head">
        <div className="t-label gpi-muted">{t.col.doctor}</div>
        <div className="t-label gpi-muted">{t.col.datetime}</div>
        <div className="t-label gpi-muted">{t.col.clinic}</div>
        <div className="t-label gpi-muted">{t.col.status}</div>
        <div className="t-label gpi-muted">{t.col.patient}</div>
        <div className="t-label gpi-muted" />
      </div>

      {groups.map((g) => (
        <div className="gpi-table__group" key={g.key}>
          <div className="gpi-table__date">
            <span>{g.dateLabel}</span>
          </div>
          {g.items.map((a) => (
            <Row a={a} key={a.id} onReschedule={onReschedule} onEdit={onEdit} onCancel={onCancel} />
          ))}
        </div>
      ))}
    </div>
  )
}
