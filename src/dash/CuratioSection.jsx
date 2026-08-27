import { useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import Badge from '../components/Badge.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import DemoBar from '../components/DemoBar.jsx'
import Select from '../components/Select.jsx'
import Switch from '../components/Switch.jsx'
import { Button } from '../components/Button.jsx'
import Icon from '../lib/Icon.jsx'
import { ListRow } from './DashParts.jsx'
import { VisitStrip } from './CuratioCard.jsx'
import { useGate } from './gate.jsx'
import { D } from './strings.js'
import {
  PERSONS, DOCTOR, ANALYSES, MEDS, VISITS, PREVENTION, REMINDERS, forPerson, demo,
} from './curatioData.js'

/* #/dash/curatio — the section. Two columns: what you DO (doctor, records) on
   the left-weighted main; what runs by itself (prevention, reminders) on the
   right. The F-05 reminders panel lands here — MVP1-in but homeless on mobile.

   Insurance gating (locked, 2026-08): the module serves uninsured users too —
   records, prevention and reminders are theirs regardless. Only booking-class
   actions gate: ჩაწერა and დისტანციური კონსულტაცია become a purchase trigger.
   ისტორიის გადაცემა stays — moving your own records needs no policy. */

const go = (hash) => () => {
  window.location.hash = hash
}
const BOOK = go('#/desktop/appointments/book')

function DoctorCard({ insured }) {
  return (
    <div className="dash-mrow dash-doc">
      <Avatar src={DOCTOR.photo} name={DOCTOR.name} size={48} />
      <div className="dash-doc__text">
        <span className="dash-mrow__title">{DOCTOR.name}</span>
        <span className="dash-mrow__sub">
          {D.cur.doctor.role} · {DOCTOR.spec} · {D.cur.doctor.nextVisit(DOCTOR.next)}
        </span>
        <div className="dash-doc__btns">
          {insured ? (
            <>
              <Button variant="secondary" size="md" leadingIcon="calendar" onClick={BOOK}>
                {D.cur.doctor.book}
              </Button>
              <Button variant="secondary" size="md" leadingIcon="video" onClick={BOOK}>
                {D.cur.doctor.remote}
              </Button>
            </>
          ) : (
            <span className="dash-doc__gate">
              <Icon name="lock" size={16} />
              <span>{D.cur.uninsured.note}</span>
              <button type="button" className="gpi-link dash-link">{D.cur.uninsured.cta}</button>
            </span>
          )}
          <Button variant="tertiary" size="md" leadingIcon="arrow-right-left">
            {D.cur.doctor.transfer}
          </Button>
        </div>
      </div>
    </div>
  )
}

function HistoryShelf({ personId, gate }) {
  const secs = [
    { id: 'analyses', label: D.cur.hist.sections.analyses, count: forPerson(ANALYSES, personId).length },
    { id: 'meds', label: D.cur.hist.sections.meds, count: forPerson(MEDS, personId).length,
      expiring: forPerson(MEDS, personId).filter((m) => m.expiryDays != null && m.expiryDays <= 14).length },
    { id: 'visits', label: D.cur.hist.sections.visits, count: forPerson(VISITS, personId).length },
  ]
  return (
    <section className="gpi-card dash-shelf" aria-label={D.cur.hist.title}>
      <div className="dash-rsec__head">
        <h4 className="dash-rsec__title">{D.cur.hist.title}</h4>
        {gate.unlocked && (
          <button type="button" className="gpi-link dash-link dash-link--quiet" onClick={gate.relock}>
            <Icon name="lock" size={16} />
            {D.cur.lock}
          </button>
        )}
      </div>
      {gate.unlocked ? (
        <div className="dash-rsec__body">
          {secs.map((s) => (
            <ListRow
              key={s.id}
              lead={
                <span className="dash-lrow__disc dash-lrow__disc--curatio">
                  <Icon name="file-text" size={20} />
                </span>
              }
              title={s.label}
              sub={D.cur.tileMeta.records(s.count)}
              trailing={s.expiring ? <Badge color="warning" size="sm">{D.cur.hist.expiryBadge(s.expiring)}</Badge> : null}
              onClick={go(`#/dash/curatio/history?sec=${s.id}`)}
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
    </section>
  )
}

const PREV_TONE = { due: 'warning', missed: 'error', done: 'success' }

function PreventionCard() {
  return (
    <section className="gpi-card dash-shelf" aria-label={D.cur.prevTitle}>
      <h4 className="dash-rsec__title">{D.cur.prevTitle}</h4>
      <div className="dash-rsec__body">
        {PREVENTION.map((p) => (
          <ListRow
            key={p.id}
            title={p.name}
            sub={
              p.status === 'done' ? null : (
                <button type="button" className="gpi-link dash-link" onClick={BOOK}>
                  {D.cur.prevBook}
                </button>
              )
            }
            trailing={
              <Badge color={PREV_TONE[p.status]} size="sm">{D.cur.prevStatus[p.status]}</Badge>
            }
          />
        ))}
      </div>
    </section>
  )
}

function RemindersCard() {
  const [state, setState] = useState(() => Object.fromEntries(REMINDERS.map((r) => [r.id, r.on])))
  return (
    <section className="gpi-card dash-shelf" aria-label={D.cur.remTitle}>
      <h4 className="dash-rsec__title">{D.cur.remTitle}</h4>
      <div className="dash-rem">
        {REMINDERS.map((r) => (
          <Switch
            key={r.id}
            name={`rem-${r.id}`}
            checked={state[r.id]}
            onChange={(on) => setState((s) => ({ ...s, [r.id]: on }))}
            label={r.label}
          />
        ))}
      </div>
      <p className="dash-rem__note">{D.cur.remChannels}</p>
    </section>
  )
}

export default function CuratioSection() {
  const gate = useGate()
  const [personId, setPersonId] = useState('g')
  const [visitDay, setVisitDay] = useState(demo.visitDay)
  const [uninsured, setUninsured] = useState(demo.uninsured)

  return (
    <>
      <DemoBar
        actions={[
          { label: visitDay ? 'ordinary day' : 'visit day', onClick: () => { demo.setVisitDay(!visitDay); setVisitDay(!visitDay) } },
          { label: uninsured ? 'insured' : 'uninsured', onClick: () => { demo.setUninsured(!uninsured); setUninsured(!uninsured) } },
          { label: gate.unlocked ? 'relock' : 'unlock', onClick: gate.unlocked ? gate.relock : gate.request },
        ]}
      />

      {/* Crumbs and the title row are ONE page header. As separate children of
          .dash-main__inner they each took the 40px CARD rhythm, which put 52px
          between a breadcrumb and the title it belongs to. */}
      <header className="dash-pagehead">
        <Breadcrumbs
          items={[{ label: D.cur.crumbHome, href: '#/dash' }]}
          current={D.cur.title}
          label={D.cur.title}
        />
        <div className="dash-sechead">
          <h2 className="dash-sechead__title">{D.cur.title}</h2>
          <Select
            value={personId}
            onChange={setPersonId}
            ariaLabel={D.cur.person}
            options={PERSONS.map((p) => ({ value: p.id, label: `${p.name} · ${p.ocin}` }))}
            renderValue={(o) => o.label.split(' · ')[0]}
          />
        </div>
      </header>

      {visitDay && <VisitStrip />}

      <div className="dash-cur__cols">
        <div className="dash-cur__main">
          <DoctorCard insured={!uninsured} />
          <HistoryShelf personId={personId} gate={gate} />
        </div>
        <div className="dash-cur__side">
          <PreventionCard />
          <RemindersCard />
        </div>
      </div>

      {gate.modal}
    </>
  )
}
