import { useEffect, useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import DemoBar from '../components/DemoBar.jsx'
import PersonSwitch from '../components/PersonSwitch.jsx'
import { Button } from '../components/Button.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import TicketBox from './CuratioTicket.jsx'
import CuratioHistory from './CuratioHistory.jsx'
import { useTransfer } from './CuratioTransfer.jsx'
import { useChangeDoctor } from './CuratioChangeDoctor.jsx'
import ActionMenu from '../components/ActionMenu.jsx'
import DoctorBioModal from '../components/DoctorBioModal.jsx'
import { D } from './strings.js'
import { BOOKINGS, BOOKINGS_COUNT } from './data.js'
import { TODAY, PERSONS, demo, clearArrived } from './curatioData.js'

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
     · UNINSURED account (user, 2026-09-10): NO personal doctor and NO bookings
       exist without a GPI health policy — both are policy benefits, not data the
       person owns — so lines 1–2 are replaced by ONE banner (the shared
       CtaBanner) that says what the policy adds; the history (own data, OTP)
       is untouched, and the transfer dialog offers network doctors only.
       This supersedes the earlier „doctor row + gate note" rendering.
   PROMOTED 2026-09-07: this is the version #/dash/curatio serves. v1 is parked at
   ?v=1 (Rule 4 — kept for comparison, not deleted); the demo bar toggles between them. */

const ROUTE = '#/dash/curatio'
const go = (hash) => () => {
  window.location.hash = hash
}
const BOOK = go('#/desktop/appointments/book')
/* „ნახე პაკეტები" mirrors the nav's „შეიძინე დაზღვევა" — which has NO page on web
   (DashShell NAV: no hash). So the banner CTA goes nowhere yet, deliberately: a
   fake destination would demo a flow that does not exist. ⚠️ flagged. */
const BUY = undefined

/* Same anatomy as v1's DoctorCard (the `.dash-doc` grammar) — duplicated here
   so the v1 file, which another track is editing, stays untouched. Fold into
   one export when v2 is chosen. */
function DoctorBox({ doctor, onTransfer, concept = false, onChange }) {
  /* CHANGE-DOCTOR CONCEPT (2026-09-16, demo chip „change doctor"): the transfer
     button gives way to the kebab (user: „a bit hidden in the three dots") with
     THREE items — „ექიმის დეტალები" (the wizard's bio modal on the current doctor),
     „ისტორიის გადატანა" (round 2: whatever was not handed over at the change can
     follow any time) and „პირადი ექიმის შეცვლა". A freshly chosen doctor has no next visit: the sub line says so
     and Book reads „first visit". v2 (concept off) renders exactly as published. */
  const [bio, setBio] = useState(false)
  return (
    <section className="dash-mrow dash-doc dash-cur2__doc" aria-label={D.cur.doctor.role}>
      <Avatar src={doctor.photo} seed={doctor.avatar} name={doctor.name} size={48} />
      <div className="dash-doc__text">
        <span className="dash-cur2__label">{D.cur.doctor.role}</span>
        <span className="dash-mrow__title">{doctor.name}</span>
        <span className="dash-mrow__sub">
          {doctor.spec} · {doctor.next ? D.cur.doctor.nextVisit(doctor.next) : D.cur.doctor.noVisit}
        </span>
      </div>
      <div className="dash-doc__actions">
        <Button variant="secondary" size="md" leadingIcon="calendar" onClick={BOOK}>
          {doctor.next ? D.cur.doctor.book : D.cur.doctor.bookFirst}
        </Button>
        {concept ? (
          <ActionMenu
            label={D.cur.doctor.more}
            items={[
              { id: 'details', label: D.cur.doctor.details, onSelect: () => setBio(true) },
              /* Round 2 (user): history not handed over at the change must be transferable
                 any time — the transfer drawer, personal doctor only in this mode. */
              { id: 'transfer', label: D.cur.doctor.transfer, onSelect: onTransfer },
              { id: 'change', label: D.cur.doctor.change, onSelect: onChange },
            ]}
          />
        ) : (
          <Button variant="tertiary" size="md" leadingIcon="arrow-right-left" onClick={onTransfer}>
            {D.cur.doctor.transfer}
          </Button>
        )}
      </div>
      {bio && (
        <DoctorBioModal
          doctor={{ ...doctor, role: doctor.spec, languages: doctor.languages || [], bio: doctor.bio || '' }}
          onClose={() => setBio(false)}
        />
      )}
    </section>
  )
}

/* The uninsured account's lines 1–2: one banner in the shared CtaBanner anatomy
   (icon tile · title + sub · one action — the same component the booking pages
   use, Rule 9). Lock tile = the glyph every insurance gate carries (#14); the
   CTA keeps the component's default primary variant (Rule 1 — consistent with
   its other uses), and it is the page's only action in this state. */
function InsuranceBanner() {
  return (
    <CtaBanner
      as="h3"
      icon="lock"
      title={D.cur.uninsured.title}
      subtitle={D.cur.uninsured.body}
      cta={D.cur.uninsured.cta}
      ctaIcon="arrow-right"
      className="dash-cur2__banner"
      onStart={BUY}
    />
  )
}

/* The ticket box (hero / stats / check-in / next bookings) lives in CuratioTicket.jsx —
   shared with the dashboard card since 2026-09-08. */

export default function CuratioSection2() {
  const [personId, setPersonId] = useState(PERSONS[0].id)
  const [visitDay, setVisitDay] = useState(demo.visitDay)
  const [uninsured, setUninsured] = useState(demo.uninsured)
  const person = PERSONS.find((p) => p.id === personId)
  const alerts = visitDay && !uninsured ? { [TODAY.p]: D.cur.alerts.todayVisit } : {}
  /* Demo data keys bookings by display name; the list is already in date order,
     so the first two are what the ticket box shows. */
  const upcoming = BOOKINGS.filter((b) => b.person === person.name)
  /* One transfer flow for the page: the doctor row's menu item and the history
     table's row icons open the same dialog and read the same shares store. */
  /* The change-doctor concept — off by default; the demo chip flips `demo.docChange`.
     In concept mode the transfer drawer is personal-doctor-only (the PO rule: nobody
     else can receive history) — it is how records NOT handed over at the change
     follow later, from the row's kebab or a record's send icon. */
  const [concept, setConcept] = useState(demo.docChange)
  const transfer = useTransfer({ personId, insured: !uninsured, personalOnly: concept })
  const change = useChangeDoctor({ personId, onChanged: transfer.refresh })
  /* `?transfer=1` (flow map / study links): land with the dialog open — the
     OTP first if the session is locked, exactly as a click would. Read once. */
  useEffect(() => {
    const h = window.location.hash
    const q = h.indexOf('?')
    const params = q !== -1 ? new URLSearchParams(h.slice(q + 1)) : null
    if (params?.get('transfer') === '1') transfer.open()
    /* `?change=1` — land on the concept with its drawer open (flow map / study links). */
    if (params?.get('change') === '1') { demo.setDocChange(true); setConcept(true); change.open() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <DemoBar
        wrap
        actions={[
          { label: visitDay ? 'ordinary day' : 'visit day', onClick: () => { demo.setVisitDay(!visitDay); setVisitDay(!visitDay) } },
          { label: uninsured ? 'insured' : 'uninsured', onClick: () => { demo.setUninsured(!uninsured); setUninsured(!uninsured) } },
          /* Stands in for the clock: the activation window (appointment − 15 min)
             cannot be demonstrated by waiting for 11:15. Reloads because the banner
             reads the state once on mount — the same way a real page load re-reads
             the time. `reset ticket` clears activation + arrival for every person. */
          { label: demo.windowClosed() ? 'window: open' : 'window: closed', onClick: () => { demo.setWindowClosed(!demo.windowClosed()); window.location.reload() } },
          { label: 'reset ticket', ghost: true, onClick: () => { clearArrived(); window.location.reload() } },
          { label: 'clear transfers', ghost: true, onClick: transfer.reset },
          /* The concept switch. Turning it OFF also puts the seed doctor back and clears
             the handover marks, so v2 demos from a clean state. */
          { label: concept ? 'transfer (v2)' : 'change doctor', onClick: () => { const on = !concept; demo.setDocChange(on); if (!on) change.reset(); setConcept(on) } },
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
        {uninsured ? (
          <InsuranceBanner />
        ) : (
          <>
            <TicketBox slim visit={visitDay && TODAY.p === personId} upcoming={upcoming} count={BOOKINGS_COUNT} personId={personId} />
            <DoctorBox doctor={change.doctor} concept={concept} onTransfer={() => transfer.open()} onChange={() => change.open()} />
          </>
        )}
      </div>

      {/* The head (title + section switch) is rendered BY CuratioHistory since
          2026-09-10 — the switch owns the section state that lives there. */}
      <section className="dash-cur2__hist" aria-labelledby="dash-cur2-hist">
        <CuratioHistory embedded personId={personId} route={ROUTE} transfer={transfer} />
      </section>
      {transfer.modal}
      {transfer.toast}
      {change.modal}
      {change.toast}
    </>
  )
}
