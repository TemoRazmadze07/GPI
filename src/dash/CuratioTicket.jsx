import { useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import Badge from '../components/Badge.jsx'
import { Button } from '../components/Button.jsx'
import Icon from '../lib/Icon.jsx'
import { ListRow } from './DashParts.jsx'
import { D } from './strings.js'
import { TODAY, DOCTOR, PERSONS, demo, CHECKIN_OPENS_MIN, arrivedAtFor, setArrived } from './curatioData.js'

/* The Curatio e-ticket on the WEB (2026-09-08) — ONE component, two sizes, used by
   the dashboard card (compact) and the section page (full). Anatomy is the MOBILE
   ticket's (user: „align these two as they should work"):
     · HERO  = the mobile კურაციო-dash visit hero: kicker „დღევანდელი ვიზიტი", who,
               where, live pulse, and the APPOINTMENT TIME as the big figure on the
               right — a desk user needs „when" before „which number". Skinned with
               the mobile ticket hero's brand: Curatio gradient + the mosaic mark as a
               white corner watermark (the one place the zone goes full brand on a
               card, because the ticket is Curatio's physical artifact).
     · STATS = the mobile ticket's 3-cell strip, led by the ticket NUMBER (4 cells):
               ბილეთი · მოლოდინი · წინ · სტატუსი. Full size only.
     · CHECK-IN = „მე მოვედი" (mobile #5), full size only — the user's 09-07 placement
               (section box, not the card) still stands.
   Compact keeps the „ბილეთი ტელეფონშია" pointer: the card is a summary, the ticket
   itself lives on the section page and the phone. Full drops it — the ticket IS here.
   Ordinary day: the next booking(s) + „ყველა N" (2 rows full / 1 compact); nothing
   booked: an invitation. Web keys only (`gpi.dash.*`, Rule 5); ka strings verbatim
   from mobile (`M.dash2.hero*`, `M.ticket.*`). */

const go = (hash) => () => {
  window.location.hash = hash
}
const BOOK = go('#/desktop/appointments/book')
/* Same destination the dashboard's bookings rail uses — one appointments list. */
const ALL_BOOKINGS = go('#/desktop/appointments')

export function TicketHero({ compact = false }) {
  const T = D.cur.ticket
  return (
    <div className={`dash-tkt${compact ? ' dash-tkt--compact' : ''}`}>
      <div className="dash-tkt__main">
        <span className="dash-tkt__kicker">{T.hero}</span>
        <strong className="dash-tkt__title">{T.who(TODAY.doctor, TODAY.role)}</strong>
        <span className="dash-tkt__place">
          {/* Compact has no stats row, so its place line carries the queue facts
              (the card strip's original meta); full says where, the stats say what. */}
          {compact
            ? D.cur.strip.meta(TODAY.queue, TODAY.ahead, TODAY.cabinet)
            : T.where(TODAY.address, TODAY.cabinet, TODAY.floor)}
        </span>
        <span className="dash-tkt__live">
          <span className="dash-tkt__pulse" aria-hidden="true" />
          {T.live}
        </span>
        {compact && (
          <span className="dash-tkt__phone">
            <Icon name="smartphone" size={16} />
            {D.cur.strip.phone}
          </span>
        )}
      </div>
      <div className="dash-tkt__when">
        <span className="dash-tkt__whenlbl">{T.time}</span>
        <span className="dash-tkt__time">{TODAY.time}</span>
      </div>
    </div>
  )
}

export function TicketStats() {
  const T = D.cur.ticket
  return (
    <dl className="dash-tkt__stats">
      <div className="dash-tkt__cell">
        <dt>{T.number}</dt>
        <dd className="dash-tkt__num">{TODAY.queue}</dd>
      </div>
      <div className="dash-tkt__cell">
        <dt>{T.wait}</dt>
        <dd>~{TODAY.wait} {T.minutes}</dd>
      </div>
      <div className="dash-tkt__cell">
        <dt>{T.ahead}</dt>
        <dd>{TODAY.ahead} {T.patients}</dd>
      </div>
      <div className="dash-tkt__cell">
        <dt>{T.status}</dt>
        <dd><Badge color="success" size="sm">{T.statusLive}</Badge></dd>
      </div>
    </dl>
  )
}

/* HH:MM of the check-in tap — the confirmation is the patient's evidence, so it
   carries a real local time rather than a placeholder. */
function nowHHMM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
/* When the window opens = appointment − CHECKIN_OPENS_MIN, derived from the same
   TODAY.time the hero prints, so the two can never disagree. */
function opensAt() {
  const [h, m] = TODAY.time.split(':').map(Number)
  const t = h * 60 + m - CHECKIN_OPENS_MIN
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

/* Arrival check-in („მე მოვედი") — F-01, mobile comment #5, ported 2026-09-07.
   Three states in ONE slot under the stats:
     too early → a muted line naming the time the window opens (+ the phone, which
                 has no such gate); open → the map-pin tile + prompt + CTA (the
                 mobile card's anatomy); done → the stamp, „რიგში ხარ" and the next
                 step, which STAYS on screen — the patient needs the proof AND what
                 to do next. Time-gated on web, unlike mobile: a desk is not a
                 waiting room, and a browser has no geolocation to corroborate. */
function ArrivalCheckIn({ personId }) {
  const [early] = useState(() => demo.checkinEarly())
  const [at, setAt] = useState(() => arrivedAtFor(personId))

  if (at) {
    return (
      <div className="dash-arr dash-arr--done">
        <span className="dash-arr__ico dash-arr__ico--ok" aria-hidden="true"><Icon name="check" size={18} /></span>
        <span className="dash-arr__text">
          {/* Title + bare time. `doneAt` is mobile's phrasing for a SEPARATE meta
              label; concatenated here it said „დადასტურდა" twice. */}
          <strong>{D.cur.arrive.doneTitle} · {at}</strong>
          <span>{D.cur.arrive.next(TODAY.cabinet)}</span>
        </span>
        <Badge color="success" size="md">{D.cur.arrive.badge}</Badge>
      </div>
    )
  }

  if (early) {
    return (
      <p className="dash-arr dash-arr--early">
        <Icon name="smartphone" size={16} />
        {D.cur.arrive.early(opensAt())}
      </p>
    )
  }

  return (
    <div className="dash-arr">
      <span className="dash-arr__ico dash-arr__ico--pin" aria-hidden="true"><Icon name="map-pin" size={18} /></span>
      <span className="dash-arr__text">
        <strong>{D.cur.arrive.title}</strong>
        <span>{D.cur.arrive.hint}</span>
      </span>
      <Button
        variant="primary"
        size="md"
        onClick={() => {
          const t = nowHHMM()
          setArrived(personId, t)
          setAt(t)
        }}
      >
        {D.cur.arrive.cta}
      </Button>
    </div>
  )
}

/* Name + date only (user, 2026-09-10). The row used to carry „გადაჯავშნა" on
   the date line like the health rail does — but here the row lives in a
   three-up grid cell (~430px at 1440), so the link wrapped onto a THIRD line
   and broke the cell. Rescheduling has its home in the appointments section,
   which the box head's „ყველა N" already opens. */
function BookingRow({ b }) {
  return (
    <ListRow
      lead={<Avatar src={b.photo} name={b.doctor} size={40} />}
      title={b.doctor}
      sub={b.when}
      trailing={<Badge color="success" size="md">{D.status[b.status]}</Badge>}
    />
  )
}

/* TICKET BANNER (2026-09-10) — the visit-day ticket promoted to the TOP of the
   dashboard and of the Curatio page. User: a queue number is the critical thing
   on the day, and the card at the bottom of the page hid it. Anatomy „E2",
   agreed in chat after four rounds:
     · top row  = doctor photo · kicker (visit · person) · doctor · role · „დეტალები"
     · band     = FIXED cells in the user's order — რიგის ნომერი · ჩაწერის დრო ·
                  მოლოდინი · წინ — then LOCATION as the ONE flexible cell that takes
                  what is left (the long item; the band wraps it to its own line
                  when narrow). No live pill: „3 ahead" says the queue is running.
                  No ticket count: one ticket at a time.
   Curatio skin = the .dash-tkt recipe (gradient + white mark). The band is a
   DARK translucent overlay, not a light one: white labels on the gradient's
   lightest stop lightened by 12% measured 4.0:1 — darkened by 16% they clear
   5.5 (Rule 7). The phone pointer is GONE: this site IS the app for people who
   do not have it. `details=false` on the Curatio page (already there). */
export function TicketBanner({ personId, details = true }) {
  const T = D.cur.ticket
  const B = D.cur.banner
  const person = PERSONS.find((p) => p.id === (personId ?? TODAY.p)) || PERSONS[0]
  return (
    <section className="dash-vban" aria-label={B.aria}>
      <div className="dash-vban__top">
        <Avatar src={TODAY.photo} name={TODAY.doctor} size={48} />
        <div className="dash-vban__who">
          <span className="dash-vban__kicker">{B.kicker(person.name)}</span>
          <strong className="dash-vban__title">{T.who(TODAY.doctor, TODAY.role)}</strong>
        </div>
        {details && (
          <Button variant="inverse" size="md" trailingIcon="arrow-right" onClick={go('#/dash/curatio')}>
            {B.details}
          </Button>
        )}
      </div>
      <dl className="dash-vban__band">
        <div className="dash-vban__cell">
          <dt>{B.queue}</dt>
          <dd className="dash-vban__fig">{TODAY.queue}</dd>
        </div>
        <div className="dash-vban__cell">
          <dt>{T.time}</dt>
          <dd className="dash-vban__fig">{TODAY.time}</dd>
        </div>
        <div className="dash-vban__cell">
          <dt>{T.wait}</dt>
          <dd>~{TODAY.wait} {T.minutes}</dd>
        </div>
        <div className="dash-vban__cell">
          <dt>{T.ahead}</dt>
          <dd>{TODAY.ahead} {T.patients}</dd>
        </div>
        <div className="dash-vban__cell dash-vban__cell--loc">
          <dt>{B.location}</dt>
          <dd>{B.where(TODAY.clinic, TODAY.address, TODAY.cabinet, TODAY.floor)}</dd>
        </div>
      </dl>
    </section>
  )
}

export default function TicketBox({ visit, upcoming = [], count, insured = true, personId, compact = false, slim = false }) {
  if (visit) {
    if (compact) {
      return (
        <div className="dash-ccard__ticket">
          <TicketHero compact />
        </div>
      )
    }
    /* Curatio page (slim): the TicketBanner leads (no „დეტალები" — this IS the
       page), and the check-in keeps its own white box under it. The stats row is
       gone here: every figure it carried now sits in the banner's band. */
    if (slim) {
      return (
        <>
          <TicketBanner personId={personId} details={false} />
          <section className="dash-cur2__box dash-cur2__box--ticket" aria-label={D.cur.arrive.title}>
            <ArrivalCheckIn personId={personId} />
          </section>
        </>
      )
    }
    /* Parked v1 keeps the 09-08 full box. */
    return (
      <section className="dash-cur2__box dash-cur2__box--ticket" aria-label={D.cur.ticket.today}>
        <TicketHero />
        <TicketStats />
        <ArrivalCheckIn personId={personId} />
      </section>
    )
  }

  /* Two rows on the section page (the box is stretched to the doctor box's height —
     one row left 64px of air above and below it); ONE on the card, which already
     carries the bookings tile and sits beside the health card's bookings rail. */
  const shown = upcoming.slice(0, compact ? 1 : 2)
  const label = shown.length > 1 ? D.cur.ticket.upcoming : D.cur.ticket.next
  const head = (
    <div className="dash-cur2__boxhead">
      <span className="dash-cur2__label">{label}</span>
      {shown.length > 0 && count > shown.length && (
        <button type="button" className="gpi-link dash-link" onClick={ALL_BOOKINGS}>
          {D.viewAll(count)}
        </button>
      )}
    </div>
  )

  /* One-column section page (2026-09-08): line 1 on an ordinary day. First cut
     was ONE booking on one line — a 350px pill stretched across 1720px, the same
     „slot wider than its content" defect the ticket box had (user: „not cool to
     have such a long line"). Now the line EARNS its width with real data: up to
     three upcoming bookings side by side (this person has three, with three
     different doctors — which finally gives other doctors' bookings a home on
     this page), under the box head „მომავალი ჯავშნები · ყველა N". The grid
     wraps 3 → 2 → 1 as the window narrows; each cell is the existing row. */
  if (slim) {
    const three = upcoming.slice(0, 3)
    const slimLabel = three.length > 1 ? D.cur.ticket.upcoming : D.cur.ticket.next
    return (
      <section className="dash-cur2__box dash-cur2__box--slim" aria-label={slimLabel}>
        <div className="dash-cur2__boxhead">
          <span className="dash-cur2__label">{slimLabel}</span>
          {three.length > 0 && count > three.length && (
            <button type="button" className="gpi-link dash-link" onClick={ALL_BOOKINGS}>
              {D.viewAll(count)}
            </button>
          )}
        </div>
        {three.length > 0 ? (
          <div className="dash-cur2__grid">
            {three.map((b) => <BookingRow key={b.id} b={b} />)}
          </div>
        ) : (
          <p className="dash-tkt__none">
            {D.cur.ticket.none}
            {' · '}
            <button type="button" className="gpi-link dash-link dash-link--inline" onClick={BOOK}>
              {D.cur.doctor.book}
            </button>
          </p>
        )}
      </section>
    )
  }

  if (compact) {
    return (
      <div className="dash-ccard__ticket">
        {head}
        {shown.length > 0 ? (
          shown.map((b) => <BookingRow key={b.id} b={b} />)
        ) : (
          <p className="dash-tkt__none">
            {D.cur.ticket.none}
            {' · '}
            <button type="button" className="gpi-link dash-link dash-link--inline" onClick={BOOK}>
              {D.cur.doctor.book}
            </button>
          </p>
        )}
      </div>
    )
  }

  return (
    <section className="dash-cur2__box" aria-label={label}>
      {head}
      {shown.length > 0 ? (
        shown.map((b) => <BookingRow key={b.id} b={b} />)
      ) : (
        <div className="dash-cur2__empty">
          <Icon name="calendar" size={24} />
          <strong>{D.cur.ticket.none}</strong>
          <span>{D.cur.ticket.noneHint}</span>
          {insured ? (
            <Button variant="secondary" size="md" leadingIcon="calendar" onClick={BOOK}>
              {D.cur.doctor.book}
            </Button>
          ) : (
            <button type="button" className="gpi-link dash-link">{D.cur.uninsured.cta}</button>
          )}
        </div>
      )}
    </section>
  )
}
