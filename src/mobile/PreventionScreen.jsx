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
import { usePurchaseGate, GateLock } from './purchase.jsx'

const noop = () => {}

/* Icon tiles carry ONE style module-wide (user, 2026-08-18: „they are very colorful,
   with low contrast so it seems very busy"). The per-item palette is gone — it never
   encoded anything, and `teal` was a dark teal glyph on a SATURATED teal fill (~1.5:1).
   The base .mga-itile (lavender tint + indigo glyph, ~7:1) is now the only tile. */

function Row({ item, gated, guard }) {
  return (
    <div className="mga-prv__row">
      <span className="mga-itile">
        <Icon name={item.icon} size={17} />
      </span>
      {/* Status rides the TITLE line and the action sits below at full width — as a
          right rail they squeezed the body until titles broke over three lines. */}
      <div className="mga-prv__body">
        <div className="mga-meta__val">{item.name}</div>
        <div className="mga-meta__lbl">{item.meta}</div>
        {item.extra && <div className="mga-meta__lbl">{item.extra}</div>}
        {item.note && <div className={'mga-prv__note mga-prv__note--' + item.tone}>{item.note}</div>}
        {/* „შესრულებულია" gets its OWN line (user, 2026-08-18) — with an icon rail
            eating 44px, the title line cannot hold a badge without breaking long
            screening names over three lines. Green: it is the one fill on the row,
            and a completed screening is worth reading as good news. */}
        {item.status === 'done' && (
          <div className="mga-prv__state">
            <span className="mga-badge mga-badge--green">{M.prev.done}</span>
          </div>
        )}{/* already on its own line — the standing rule's first instance */}
        {item.status !== 'done' && (
          /* Dead until F-04 — see header comment. */
          <button className={'mga-btn mga-btn--secondary mga-btn--sm' + (gated ? ' mga-btn--locked' : '')} onClick={guard(noop)}>
            <Icon name="calendar" size={11} /> {M.prev.book}
            <GateLock gated={gated} />
          </button>
        )}
      </div>
    </div>
  )
}

export default function PreventionScreen() {
  /* #14 — screenings and vaccination are insurance-funded. */
  const { gated, guard, sheet } = usePurchaseGate()
  return (
    <>
      <div className="mga-hdr">
        <button className="mga-iconbtn" aria-label={M.a11y.back} onClick={() => go('curatio')}>
          <Icon name="chevron-left" size={16} />
        </button>
        <h1 className="mga-hdr__title">{M.prev.title}</h1>
      </div>

      <div className="mga-body">
        <div className="mga-prv__banner">
          <span className="mga-itile">
            <Icon name="clock" size={17} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="mga-meta__val" style={{ color: 'var(--mga-amber-fg)' }}>
              {V2_PREVENTION.reminder.title}
            </div>
            <div className="mga-meta__lbl">{V2_PREVENTION.reminder.body}</div>
            {/* Dead until F-04 — see header comment. */}
            <button className={'mga-btn mga-btn--secondary mga-btn--sm' + (gated ? ' mga-btn--locked' : '')} style={{ marginTop: 8 }} onClick={guard(noop)}>
              <Icon name="calendar" size={11} /> {M.prev.book}
              <GateLock gated={gated} />
            </button>
          </div>
        </div>

        <section className="mga-card">
          <div className="mga-cardhdr">
            <span className="mga-meta__lbl">{M.prev.vaccines}</span>
          </div>
          {V2_PREVENTION.vaccines.map((v) => (
            <Row key={v.id} item={v} gated={gated} guard={guard} />
          ))}
        </section>

        <section className="mga-card">
          <div className="mga-cardhdr">
            <span className="mga-meta__lbl">{M.prev.screenings}</span>
            {/* Dead end — no state-programs screen exists. */}
            <button className="mga-link" onClick={noop}>{M.prev.screeningsLink}</button>
          </div>
          <div className="mga-meta__lbl mga-cardlbl">{M.prev.screeningsHint}</div>
          {V2_PREVENTION.screenings.map((s) => (
            <Row key={s.id} item={s} gated={gated} guard={guard} />
          ))}
        </section>
      </div>
      {sheet}
    </>
  )
}
