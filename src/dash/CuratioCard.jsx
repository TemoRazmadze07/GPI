import Icon from '../lib/Icon.jsx'
import CuratioMark from '../lib/CuratioMark.jsx'
import { ActionTile, ListRow } from './DashParts.jsx'
import { useGate } from './gate.jsx'
import { D } from './strings.js'
import { TODAY, ANALYSES, MEDS, VISITS, forPerson } from './curatioData.js'

/* The dashboard's „ჩემი კურაციო" card — placement A, locked in the concept
   round: its OWN card, rendered with or without a health policy, because the
   module also serves users with no GPI health insurance (standalone health
   record). Only the SECTION's booking actions are insurance-gated; the card is
   identical for both.

   Four states, all data/session-driven, none a separate page:
   · locked (default)  — tiles show, the records preview shows only the unlock
     prompt; no counts leak past the gate (the history tile says „დაცული").
   · unlocked          — counts on the tile + a last-3 records preview.
   · visit day         — the accent strip on top; it POINTS AT THE PHONE rather
     than pretending to be a ticket (F-01 web scope = read-only strip, locked).
   · uninsured         — no difference here; the gate is in the section.

   The card carries only what is NET-NEW (locked hybrid model): bookings and
   referrals stay in the health card, enhanced in place. */

const go = (hash) => () => {
  window.location.hash = hash
}

export function VisitStrip({ full = false }) {
  return (
    <div className={`dash-cvisit${full ? ' dash-cvisit--full' : ''}`}>
      <span className="dash-cvisit__main">
        <strong>{D.cur.strip.today(TODAY.time, TODAY.doctor)}</strong>
        <span>{D.cur.strip.meta(TODAY.queue, TODAY.ahead, TODAY.cabinet)}</span>
      </span>
      <span className="dash-cvisit__phone">
        <Icon name="smartphone" size={16} />
        {D.cur.strip.phone}
      </span>
    </div>
  )
}

/* Last-3 preview: newest analysis, the expiring prescription, newest visit —
   one row per record KIND, which is what makes three rows a fair summary. */
function recentRows(personId) {
  const an = forPerson(ANALYSES, personId)[0]
  const med = forPerson(MEDS, personId).find((m) => m.expiryDays != null && m.expiryDays <= 14)
  const vi = forPerson(VISITS, personId)[0]
  const rows = []
  if (an) rows.push({ id: an.id, name: an.name, meta: `${an.date} · ${D.cur.hist.statuses[an.status]}`, sec: 'analyses' })
  if (med) rows.push({ id: med.id, name: med.name, meta: `${D.cur.hist.expiring} · ${D.cur.hist.expiryIn(med.expiryDays)}`, sec: 'meds' })
  if (vi) rows.push({ id: vi.id, name: vi.name, meta: vi.date, sec: 'visits' })
  return rows
}

export default function CuratioCard({ visitDay = false, personId = 'g' }) {
  const gate = useGate()
  const counts = {
    records:
      forPerson(ANALYSES, personId).length +
      forPerson(MEDS, personId).length +
      forPerson(VISITS, personId).length,
    due: 2,
    on: 4,
  }

  return (
    <section className="gpi-card dash-pcard dash-pcard--curatio dash-ccard" aria-labelledby="dash-cur-title">
      <header className="dash-ccard__head">
        <span className="dash-ccard__brand">
          <span className="dash-ccard__mark">
            <CuratioMark size={20} />
          </span>
          <h3 className="dash-chead__title" id="dash-cur-title">{D.cur.title}</h3>
        </span>
        <span className="dash-ccard__actions">
          {gate.unlocked && (
            <button type="button" className="gpi-link dash-link dash-link--quiet" onClick={gate.relock}>
              <Icon name="lock" size={16} />
              {D.cur.lock}
            </button>
          )}
          <button type="button" className="gpi-link dash-link" onClick={go('#/dash/curatio')}>
            {D.cur.open}
          </button>
        </span>
      </header>

      {visitDay && <VisitStrip full />}

      <div className="dash-tiles dash-ccard__tiles">
          <ActionTile
            tint="curatio"
            icon="file-text"
            label={D.cur.tiles.history}
            sub={gate.unlocked ? D.cur.tileMeta.records(counts.records) : D.cur.tileMeta.locked}
            onClick={go('#/dash/curatio/history')}
          />
          <ActionTile
            tint="curatio"
            icon="syringe"
            label={D.cur.tiles.prevention}
            sub={D.cur.tileMeta.due(counts.due)}
            onClick={go('#/dash/curatio')}
          />
          <ActionTile
            tint="curatio"
            icon="bell"
            label={D.cur.tiles.reminders}
            sub={D.cur.tileMeta.on(counts.on)}
            onClick={go('#/dash/curatio')}
          />
        </div>

        <div className="dash-ccard__recent">
          <h4 className="dash-rsec__title">{D.cur.recent.title}</h4>
          {gate.unlocked ? (
            <div className="dash-rsec__body">
              {recentRows(personId).map((r) => (
                <ListRow
                  key={r.id}
                  title={r.name}
                  sub={r.meta}
                  onClick={go(`#/dash/curatio/history?sec=${r.sec}`)}
                />
              ))}
            </div>
          ) : (
            <div className="dash-ccard__locked">
              <Icon name="lock" size={20} />
              <p>{D.cur.recent.lockedBody}</p>
              <button type="button" className="gpi-link dash-link" onClick={gate.request}>
                {D.cur.recent.enter}
              </button>
            </div>
        )}
      </div>

      {gate.modal}
    </section>
  )
}
