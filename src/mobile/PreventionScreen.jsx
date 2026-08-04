/* A7 — prevention screen (stakeholder sc-prev PARITY, scope-filtered).
   Content mirrors their screen 1:1: reminder banner → ვაქცინაცია card
   (flu due / COVID done) → სქრინინგ კვლევები card (breast missed / annual
   done / vision due). Deliberate deviations, per standing rules:
   · NO gradient banner (their orange gradient → solid amber card);
   · real Lucide icon tiles, not emoji;
   · ALL „ჩაეწერე" CTAs are dead ends until F-04 exists — their file routes
     every one to the queue picker, which is the activation≠booking IA bug
     we already fixed at A3. Do NOT wire these to `queuepicker`.
   · „სახ. პროგ. ›" see-all is a dead end too (no state-programs screen).
   Public (no OTP) — prevention is not history-class data (dash comment).
   The F-05 reminders TOGGLE PANEL is NOT here — it has no stakeholder
   reference and needs its own wireframe round first (still homeless). */

import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { V2_PREVENTION } from './data.js'
import { go } from './nav.js'

const noop = () => {}

const TILE = {
  lav: { background: 'var(--mga-lav)', color: 'var(--mga-lav-fg)' },
  green: { background: 'var(--mga-green-bg)', color: 'var(--mga-green-fg)' },
  pink: { background: 'var(--mga-pink-soft)', color: 'var(--mga-pink-fg)' },
  teal: { background: 'var(--mga-teal)', color: 'var(--mga-teal-fg)' },
  amber: { background: 'var(--mga-amber-bg)', color: 'var(--mga-amber-fg)' },
}

function Row({ item }) {
  return (
    <div className="mga-h2__med">
      <span className="mga-itile" style={TILE[item.tile]}>
        <Icon name={item.icon} size={17} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mga-meta__val" style={{ fontSize: 12.5 }}>{item.name}</div>
        <div className="mga-meta__lbl">{item.meta}</div>
        {item.extra && <div className="mga-meta__lbl">{item.extra}</div>}
        {item.note && <div className={'mga-prv__note mga-prv__note--' + item.tone}>{item.note}</div>}
      </div>
      {item.status === 'done' ? (
        <span className="mga-badge mga-badge--green">{M.prev.done}</span>
      ) : (
        /* Dead until F-04 — see header comment. */
        <button className="mga-h2__minicta" onClick={noop}>
          <Icon name="calendar" size={11} /> {M.prev.book}
        </button>
      )}
    </div>
  )
}

export default function PreventionScreen() {
  return (
    <>
      <div className="mga-hdr">
        <button className="mga-back" aria-label="უკან" onClick={() => go('curatio')}>
          <Icon name="chevron-left" size={16} />
        </button>
        <h1 className="mga-hdr__title">{M.prev.title}</h1>
      </div>

      <div className="mga-body">
        <div className="mga-prv__banner">
          <span className="mga-itile" style={TILE.amber}>
            <Icon name="clock" size={17} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="mga-meta__val" style={{ fontSize: 12.5, color: 'var(--mga-amber-fg)' }}>
              {V2_PREVENTION.reminder.title}
            </div>
            <div className="mga-meta__lbl">{V2_PREVENTION.reminder.body}</div>
            {/* Dead until F-04 — see header comment. */}
            <button className="mga-h2__minicta" style={{ marginTop: 8 }} onClick={noop}>
              <Icon name="calendar" size={11} /> {M.prev.book}
            </button>
          </div>
        </div>

        <section className="mga-card">
          <div className="mga-cardhdr">
            <span className="mga-cardhdr__ttl">{M.prev.vaccines}</span>
          </div>
          {V2_PREVENTION.vaccines.map((v) => (
            <Row key={v.id} item={v} />
          ))}
        </section>

        <section className="mga-card">
          <div className="mga-cardhdr">
            <span className="mga-cardhdr__ttl">{M.prev.screenings}</span>
            {/* Dead end — no state-programs screen exists. */}
            <button className="mga-seeall" onClick={noop}>{M.prev.screeningsLink}</button>
          </div>
          <div className="mga-meta__lbl" style={{ marginBottom: 6 }}>{M.prev.screeningsHint}</div>
          {V2_PREVENTION.screenings.map((s) => (
            <Row key={s.id} item={s} />
          ))}
        </section>
      </div>
    </>
  )
}
