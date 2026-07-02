import { useState } from 'react'
import CtaBanner from '../components/CtaBanner.jsx'
import AppointmentsTable from '../components/AppointmentsTable.jsx'
import Pagination from '../components/Pagination.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { appointments as seedAppointments } from '../data/appointments.js'
import { ka } from '../i18n/strings.js'

/* Screen 1 — All Appointments (entry point to the booking wizard). */
export default function AppointmentsScreen({ onStartBooking, onReschedule, onEdit }) {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState(seedAppointments)
  const [cancelId, setCancelId] = useState(null)
  const cancelTarget = items.find((a) => a.id === cancelId)

  // Cancelling keeps the row (marks it გაუქმებული, then offers rebook) — matches
  // the existing cancelled rows and the insurance model, rather than deleting it.
  const confirmCancel = () => {
    setItems((prev) => prev.map((a) => (a.id === cancelId ? { ...a, status: 'cancelled' } : a)))
    setCancelId(null)
  }

  return (
    <div className="gpi-page-stack">
      <CtaBanner onStart={onStartBooking} />
      <section className="gpi-card gpi-card--table">
        <AppointmentsTable items={items} onReschedule={onReschedule} onEdit={onEdit} onCancel={setCancelId} />
        <div className="gpi-table__footer">
          <Pagination current={page} total={10} onChange={setPage} />
        </div>
      </section>

      {cancelTarget && (
        <ConfirmDialog
          title={ka.cancelModal.title}
          body={ka.cancelModal.body}
          appt={cancelTarget}
          confirmLabel={ka.cancelModal.confirm}
          keepLabel={ka.cancelModal.keep}
          onConfirm={confirmCancel}
          onClose={() => setCancelId(null)}
        />
      )}
    </div>
  )
}
