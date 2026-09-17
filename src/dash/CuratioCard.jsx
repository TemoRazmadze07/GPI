import { useEffect, useState } from 'react'
import Badge from '../components/Badge.jsx'
import Icon from '../lib/Icon.jsx'
import PersonSwitch from '../components/PersonSwitch.jsx'
import SegmentedControl from '../components/SegmentedControl.jsx'
import { ASSETS } from '../lib/assets.js'
import CuratioMark from '../lib/CuratioMark.jsx'
import { ActionTile, ListRow, ProductCard, RailSection } from './DashParts.jsx'
import { useGate } from './gate.jsx'
import { D } from './strings.js'
import { BOOKINGS } from './data.js'
import { TODAY, PERSONS, ANALYSES, MEDS, VISITS, forPerson, ticketState, getRead, isUnread, unreadCount, onUnreadChange } from './curatioData.js'

/* The dashboard's „ჩემი კურაციო" card — placement A, locked in the concept
   round: its OWN card, rendered with or without a health policy, because the
   module also serves users with no GPI health insurance (standalone health
   record). Only the SECTION's booking actions are insurance-gated; the card is
   identical for both.

   Four states, all data/session-driven, none a separate page:
   · locked (default)  — the section tabs stay visible (user, 2026-09-16: set the
     expectation of what each holds), under them the padlock + a per-section
     „will appear here" line + the unlock prompt; no RECORD counts leak past the
     gate — the UNREAD counters on the tabs do (user, 2026-09-17): „something new
     arrived" is the reason to unlock, and it names no record.
   · unlocked          — a per-section records preview (segmented switch).
   · visit day         — NO ticket in the card any more (2026-09-10, same day the
     ordinary-day „next booking" row went): the ticket now LEADS THE PAGE as the
     TicketBanner (CuratioTicket.jsx) above the policies. The card keeps a
     pointer only — a success badge in its head („ბილეთი მიმდინარეობს · A042").
   · uninsured         — no difference here; the gate is in the section.

   The card carries only what is NET-NEW (locked hybrid model): bookings and
   referrals stay in the health card, enhanced in place. Prevention and
   reminders were CUT from desktop in the 2026-09-04 review (not in scope) —
   the card is the record, nothing else. */

const go = (hash) => () => {
  window.location.hash = hash
}

/* Records preview, per SECTION (review 2026-09-04: "segmented controls and a
   couple of recordings"): the rail carries the same three sections the history
   page has, the newest rows of the active one, and „ყველა N" counts THAT
   section and deep-links into it. Meta per kind = what the row's own table
   leads with (status / expiry / doctor).
   FOUR rows, not two (user, 2026-09-10: „fill the white space"): with the
   ordinary-day ticket row gone the main column measures 386 (1900) / 402
   (1440); the rail's fixed part is 158 and a row costs 58 + 12, so four rows
   (426) overshoot by 24–40px and the tiles centre in the slack — three (356)
   leave 30–46px of air under the last row, which is the complaint. The
   sibling rails carry 5–7 rows, so four is also the closer density. */
const SECTIONS = ['analyses', 'meds', 'visits']
const BASE = { analyses: ANALYSES, meds: MEDS, visits: VISITS }
const PREVIEW_ROWS = 4
/* `read` = the opened-records set (2026-09-17): every preview row learns whether
   it is still unread, so the rail can mark it the way the history table does. */
function sectionRows(sec, personId, read) {
  if (sec === 'analyses')
    return forPerson(ANALYSES, personId).map((a) => ({ id: a.id, name: a.name, unread: isUnread(a, read), meta: `${a.date} · ${D.cur.hist.statuses[a.status]}` }))
  if (sec === 'meds')
    return forPerson(MEDS, personId).map((m) => ({
      id: m.id, name: m.name, unread: isUnread(m, read),
      meta: m.expiryDays != null && m.expiryDays <= 14
        ? `${D.cur.hist.expiring} · ${D.cur.hist.expiryIn(m.expiryDays)}`
        : `${m.date} · ${m.doctor}`,
    }))
  return forPerson(VISITS, personId).map((v) => ({ id: v.id, name: v.name, unread: isUnread(v, read), meta: `${v.date} · ${v.doctor}` }))
}

/* `insured` (2026-09-10) = the dashboard's hasHealth. Uninsured: no doctor, no
   bookings, no visit — the appointments tile becomes the locked „what the policy
   adds" tile and the ticket slot never renders. Records stay (own data). */
export default function CuratioCard({ visitDay = false, insured = true }) {
  /* Person scope lives on the card (mobile parity, 2026-09-04): records, counts
     and the visit strip all follow it. The holder is the default. */
  const [personId, setPersonId] = useState(PERSONS[0].id)
  const alerts = visitDay && insured ? { [TODAY.p]: D.cur.alerts.todayVisit } : {}
  const gate = useGate()
  const [sec, setSec] = useState('analyses')
  /* Head badge = the ticket's state (2026-09-16): a neutral „დღეს ვიზიტი · 11:30"
     identifier until the ticket is issued, the success „ბილეთი მიმდინარეობს · A042"
     after. Re-read when the banner above activates (same page). */
  const [tstate, setTstate] = useState(() => ticketState(TODAY.p))
  useEffect(() => {
    const on = () => setTstate(ticketState(TODAY.p))
    window.addEventListener('gpi:ticket', on)
    return () => window.removeEventListener('gpi:ticket', on)
  }, [])
  /* Unread state (2026-09-17): re-read whenever the store announces a write —
     the dashboard's demo bar sits on this page and flips it. */
  const [read, setRead] = useState(getRead)
  useEffect(() => onUnreadChange(() => setRead(getRead())), [])
  const rows = sectionRows(sec, personId, read)
  const person = PERSONS.find((p) => p.id === personId)
  const upcomingRows = insured ? BOOKINGS.filter((b) => b.person === person.name) : []

  /* The rail = the records preview, exactly where the policy cards keep their
     lists. The section switch renders in BOTH states (user, 2026-09-16 — the
     history page already kept its switch behind the gate, so this is parity):
     · locked — the padlock illustration + a line naming what the ACTIVE tab
       will hold + the unlock prompt; no „ყველა N" link (no count leaks).
     · unlocked — the newest rows of that section + „ყველა N" into the history
       page, opened on the same section. */
  const rail = (
    <RailSection
      title={D.cur.recent.title}
      /* No record count on the link (user, 2026-09-16: the API cannot count files). */
      onViewAll={gate.unlocked ? go(`#/dash/curatio?sec=${sec}`) : undefined}
      toolbar={(
        <SegmentedControl
          size="sm"
          variant="soft"
          value={sec}
          onChange={setSec}
          /* The card's tabs use the SHORT label where one exists — this control is
             the narrowest home these three names get (it already scrolls at 390).
             The canonical section names still lead the history page's rail and the
             section shelf, so comment #8's wording is not lost. */
          options={SECTIONS.map((id) => {
            /* The unread counter (2026-09-17) renders in BOTH gate states — it is
               the one figure allowed across the gate (see the header comment). */
            const n = unreadCount(BASE[id], personId, read)
            return {
              value: id,
              label: D.cur.hist.sectionsShort?.[id] ?? D.cur.hist.sections[id],
              badge: n,
              badgeLabel: n ? D.cur.hist.unread.tab(n) : undefined,
            }
          })}
        />
      )}
    >
      {gate.unlocked ? (
        rows.length ? (
          rows.slice(0, PREVIEW_ROWS).map((r) => (
            <ListRow
              key={r.id}
              /* Same lead as the section page's record rows and the benefit
                 rows: a tinted disc + the document glyph (Rule 1) — without it
                 these were the only rail rows starting at a bare text edge. */
              lead={
                <span className="dash-lrow__disc dash-lrow__disc--curatio">
                  <Icon name="file-text" size={20} />
                  {/* unread dot ON the glyph (2026-09-17) — decoration; ListRow speaks the words */}
                  {r.unread && <span className="dash-lrow__new" aria-hidden="true" />}
                </span>
              }
              title={r.name}
              unread={r.unread ? D.cur.hist.unread.row : undefined}
              sub={r.meta}
              onClick={go(`#/dash/curatio?sec=${sec}`)}
            />
          ))
        ) : (
          <p className="dash-ccard__none">{D.cur.recent.none}</p>
        )
      ) : (
        <div className="dash-ccard__locked dash-ccard__locked--tabbed">
          <img className="dash-lockillus" src={ASSETS.curatioLocked} alt="" />
          {/* Follows the active tab — the one line that changes as the user
              switches sections while locked. */}
          <p className="dash-ccard__lockedlead">{D.cur.recent.lockedSections[sec]}</p>
          <p>{D.cur.recent.lockedBody}</p>
          <button type="button" className="gpi-link dash-link" onClick={gate.request}>
            {D.cur.recent.enter}
          </button>
        </div>
      )}
    </RailSection>
  )

  return (
    <ProductCard tone="curatio" labelledBy="dash-cur-title" rail={rail}>
      {/* Same head grammar as the policy cards: the name (mark + title) leads,
          the card's actions ride the trailing slot and wrap under it when tight. */}
      <header className="dash-chead">
        <div className="dash-chead__main">
          <div className="dash-chead__titlerow">
            <span className="dash-chead__name dash-ccard__brand">
              <span className="dash-ccard__mark">
                <CuratioMark size={20} />
              </span>
              <h3 className="dash-chead__title" id="dash-cur-title">{D.cur.title}</h3>
            </span>
            {/* Scope selector rides the title row like the auto card's tier mark. */}
            <PersonSwitch
              persons={PERSONS}
              value={personId}
              onChange={setPersonId}
              alerts={alerts}
              label={D.cur.personAria}
            />
          </div>
        </div>
        <span className="dash-ccard__actions">
          {/* Visit day: the ticket leads the page (TicketBanner); the card keeps an
              account-level pointer, whichever person is selected. It rides the
              ACTION slot, not the title row — there it wrapped under the title at
              every width (name 198 + switcher 260 + badge 235 > the 503px row). */}
          {insured && visitDay && (tstate === 'active' || tstate === 'arrived' ? (
            <Badge color="success" size="md" dot>{D.cur.banner.ongoing(TODAY.queue)}</Badge>
          ) : (
            <Badge color="neutral" size="md">{D.cur.banner.todayAt(TODAY.time)}</Badge>
          ))}
          <button type="button" className="gpi-link dash-link" onClick={go('#/dash/curatio')}>
            {D.cur.open}
          </button>
        </span>
      </header>

      <p className="dash-pcard__body">{D.cur.intro}</p>

      {/* Quick actions (restored 2026-09-04). Prevention has no surface yet, so
          it carries „მალე" and no onClick — present but honestly unavailable,
          rather than hidden (it is part of the module's promise). */}
      <div className="dash-tiles dash-ccard__tiles">
        <ActionTile
          tint="curatio"
          icon="file-text"
          label={D.cur.tiles.history}
          /* Unlocked: no „N ჩანაწერი" sub (no counts from the API, 2026-09-16); locked keeps „დაცული". */
          sub={gate.unlocked ? undefined : D.cur.tileMeta.locked}
          onClick={go(`#/dash/curatio?sec=${sec}`)}
        />
        {insured ? (
          <ActionTile
            tint="curatio"
            icon="calendar"
            label={D.cur.tiles.appointments}
            sub={D.cur.tileMeta.bookings(upcomingRows.length)}
            onClick={go('#/desktop/appointments')}
          />
        ) : (
          /* Uninsured: the coming-soon slab (static, no onClick) with the gate's
             lock glyph, naming what the policy adds; the packages link rides the
             sub line — same dead destination as the section banner (no web page). */
          <ActionTile
            tint="neutral"
            icon="lock"
            label={D.cur.tiles.doctorBooking}
            sub={
              <>
                {D.cur.tileMeta.insured}
                {' · '}
                <button type="button" className="gpi-link dash-link dash-link--inline">{D.cur.uninsured.cta}</button>
              </>
            }
          />
        )}
        <ActionTile
          tint="neutral"
          icon="syringe"
          label={D.cur.tiles.prevention}
          badge={<Badge color="neutral" size="sm">{D.cur.tileMeta.soon}</Badge>}
        />
      </div>

      {gate.modal}
    </ProductCard>
  )
}
