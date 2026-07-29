import CtaBanner from '../components/CtaBanner.jsx'
import { Button } from '../components/Button.jsx'
import { t as strings } from '../i18n/index.js'
import { ASSETS } from '../lib/assets.js'

/* EmptyBookingsScreen — the All-Bookings page with no bookings yet. Starting
   point of the first-time booking flow (design node 89:1619). Reuses the CtaBanner
   and, in the bookings card, shows the unDraw "booking" illustration + an invite to
   book. The booking logic (first-time doctor selection) is layered in later —
   this screen just leads into the existing wizard for now. */
export default function EmptyBookingsScreen({ onStartBooking }) {
  const t = strings.bookings
  return (
    <div className="gpi-page-stack">
      <CtaBanner onStart={onStartBooking} />
      <section className="gpi-card gpi-bookings">
        <h2 className="t-h3 gpi-table__heading">{strings.table.heading}</h2>
        <div className="gpi-empty">
          <img
            className="gpi-empty__illus"
            src={ASSETS.bookingEmpty}
            alt=""
            aria-hidden="true"
          />
          <p className="gpi-empty__title">{t.emptyTitle}</p>
          <Button variant="tertiary" size="md" leadingIcon="plus" onClick={onStartBooking}>
            {t.emptyCta}
          </Button>
        </div>
      </section>
    </div>
  )
}
