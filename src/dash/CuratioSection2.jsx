import { useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import DemoBar from '../components/DemoBar.jsx'
import PersonSwitch from '../components/PersonSwitch.jsx'
import { Button } from '../components/Button.jsx'
import ActionMenu from '../components/ActionMenu.jsx'
import Icon from '../lib/Icon.jsx'
import TicketBox from './CuratioTicket.jsx'
import CuratioHistory from './CuratioHistory.jsx'
import { D } from './strings.js'
import { BOOKINGS, BOOKINGS_COUNT } from './data.js'
import { DOCTOR, TODAY, PERSONS, demo } from './curatioData.js'

/* ჩემი კურაციო — v2 (#/dash/curatio?v=2), the merged concept the user locked
   on 2026-09-04 (L0 approved in chat):
     · ONE COLUMN since 2026-09-08 (user: „first line ticket, second doctor, third
       history"): the two-box row forced both boxes to the taller one's height, and
       a doctor box has less content than a ticket — whichever box was lighter
       showed the leftover as a hole. Stacked, every row is its own height.
       Line 1 = the ticket (full) on visit day, else ONE slim next-booking row;
       line 2 = the doctor as a full-width row, Book visible, the rest behind the
       system Action Menu (user's call: booking is the entity's primary action).
     · Under them, the medical-history page IN FULL as the body (its rail,
       filters, table, pagination untouched) — the only internal section.
     · No sub-navigation: prevention and reminders are being removed on a
       parallel track, so the page needs no hub.
     · ONE person scope — the header switcher — drives doctor, ticket, history.
   PROMOTED 2026-09-07: this is the version #/dash/curatio serves. v1 is parked at
   ?v=1 (Rule 4 — kept for comparison, not deleted); the demo bar toggles between them. */

const ROUTE = '#/dash/curatio'
const go = (hash) => () => {
  window.location.hash = hash
}
const BOOK = go('#/desktop/appointments/book')

/* Same anatomy as v1's DoctorCard (the `.dash-doc` grammar) — duplicated here
   so the v1 file, which another track is editing, stays untouched. Fold into
   one export when v2 is chosen. */
function DoctorBox({ insured }) {
  /* Remote consultation is a booking path too, so it is gated like Book; the
     history transfer is not. The menu is the design-system ActionMenu (kebab,
     portaled panel, Esc / outside-click / scroll close) — Rule 9, no one-off. */
  const menu = [
    ...(insured ? [{ id: 'remote', label: D.cur.doctor.remote, onSelect: BOOK }] : []),
    { id: 'transfer', label: D.cur.doctor.transfer },
  ]
  return (
    <section className="dash-mrow dash-doc dash-cur2__doc" aria-label={D.cur.doctor.role}>
      <Avatar src={DOCTOR.photo} name={DOCTOR.name} size={48} />
      <div className="dash-doc__text">
        <span className="dash-cur2__label">{D.cur.doctor.role}</span>
        <span className="dash-mrow__title">{DOCTOR.name}</span>
        <span className="dash-mrow__sub">
          {DOCTOR.spec} · {D.cur.doctor.nextVisit(DOCTOR.next)}
        </span>
      </div>
      <div className="dash-doc__actions">
        {insured ? (
          <Button variant="secondary" size="md" leadingIcon="calendar" onClick={BOOK}>
            {D.cur.doctor.book}
          </Button>
        ) : (
          <span className="dash-doc__gate">
            <Icon name="lock" size={16} />
            <span>{D.cur.uninsured.note}</span>
            <button type="button" className="gpi-link dash-link">{D.cur.uninsured.cta}</button>
          </span>
        )}
        <ActionMenu items={menu} label={D.cur.doctor.more} />
      </div>
    </section>
  )
}

/* The ticket box (hero / stats / check-in / next bookings) lives in CuratioTicket.jsx —
   shared with the dashboard card since 2026-09-08. */

export default function CuratioSection2() {
  const [personId, setPersonId] = useState(PERSONS[0].id)
  const [visitDay, setVisitDay] = useState(demo.visitDay)
  const [uninsured, setUninsured] = useState(demo.uninsured)
  const person = PERSONS.find((p) => p.id === personId)
  const alerts = visitDay ? { [TODAY.p]: D.cur.alerts.todayVisit } : {}
  /* Demo data keys bookings by display name; the list is already in date order,
     so the first two are what the ticket box shows. */
  const upcoming = BOOKINGS.filter((b) => b.person === person.name)

  return (
    <>
      <DemoBar
        actions={[
          { label: visitDay ? 'ordinary day' : 'visit day', onClick: () => { demo.setVisitDay(!visitDay); setVisitDay(!visitDay) } },
          { label: uninsured ? 'insured' : 'uninsured', onClick: () => { demo.setUninsured(!uninsured); setUninsured(!uninsured) } },
          /* Stands in for the clock: the check-in window cannot be demonstrated by
             waiting for 11:00. Reloads because the arrival block reads the flag once
             on mount — deliberate, the same way a real page load re-reads the time. */
          { label: 'check-in: early', onClick: () => { demo.setCheckinEarly(!demo.checkinEarly()); window.location.reload() } },
          { label: 'v1', ghost: true, onClick: go('#/dash/curatio?v=1') },
        ]}
      />

      <header className="dash-pagehead">
        <Breadcrumbs
          items={[{ label: D.cur.crumbHome, href: '#/dash' }]}
          current={D.cur.title}
          label={D.cur.title}
        />
        <div className="dash-sechead">
          <h2 className="dash-sechead__title">{D.cur.title}</h2>
          <PersonSwitch persons={PERSONS} value={personId} onChange={setPersonId} alerts={alerts} label={D.cur.personAria} />
        </div>
      </header>

      <div className="dash-cur2__stack">
        <TicketBox slim visit={visitDay && TODAY.p === personId} upcoming={upcoming} count={BOOKINGS_COUNT} insured={!uninsured} personId={personId} />
        <DoctorBox insured={!uninsured} />
      </div>

      <section className="dash-cur2__hist" aria-labelledby="dash-cur2-hist">
        <div className="dash-sechead dash-cur2__histhead">
          <h3 className="dash-sechead__title" id="dash-cur2-hist">{D.cur.hist.title}</h3>
        </div>
        <CuratioHistory embedded personId={personId} route={ROUTE} />
      </section>
    </>
  )
}
