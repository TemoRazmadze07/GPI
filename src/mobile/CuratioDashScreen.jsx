/* V2 ONLY — stakeholder-parity კურაციო tab, FILTERED by the MVP1 spec
   (sources: reference/mygpi_v3_stakeholder_prototype.html for experience,
   Curatio_MVP1_Feature_Spec_v1.docx as the scope cut-line; user, 2026-08-04).
   Same chrome as Home (top bar + 3-pill switcher + bottom nav), then:
     person dropdown (policyholder default, alert dot for other members) →
     today-visit hero (visit day, per selected person) → digital-queue ticket
     activation (F-01) → personal doctor card (F-03 — booking only) → history
     row (F-02/F-03; OTP gates in place on HistoryScreen, counts withheld
     while locked) → prevention (F-05).
   CUT BY THE SPEC (do not re-add without the user): in-app doctor chat +
   next-chat chip (F-02/F-05 out), My Wellness, teleconsult and AI-symptom
   banners (absent from MVP1 entirely). Charts are also out — history stays
   PDF-only (F-02/F-03).
   Booking management stays on the Health dashboard — this tab deep-links to
   the e-ticket, never duplicates ჯავშნები. Dead ends until their screens
   exist: queue picker (A3), doctor detail via სრული ინფო (A4), ჯავშანი (A3),
   prevention (A7). */

import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { V2_PERSONS, V2_TODAY, V2_HISTORY_ALERT, DOCTOR } from './data.js'
import { go, isVisitDay } from './nav.js'
import { isUnlocked } from './otp.jsx'
import PersonSelect from './PersonSelect.jsx'
import { TopBar, ProductSwitcher } from './HealthHomeScreen.jsx'

const noop = () => {}

export default function CuratioDashScreen() {
  const [personId, setPersonId] = useState(V2_PERSONS[0].id)
  const visitDay = isVisitDay()
  const unlocked = isUnlocked()
  const today = visitDay ? V2_TODAY[personId] : null
  const historyAlert = V2_HISTORY_ALERT[personId]
  const alerts = visitDay
    ? Object.fromEntries(V2_PERSONS.filter((p) => V2_TODAY[p.id]).map((p) => [p.id, M.dash2.todayVisit]))
    : {}

  return (
    <>
      <TopBar />
      <ProductSwitcher v2 active="curatio" />
      <PersonSelect persons={V2_PERSONS} selectedId={personId} onSelect={setPersonId} alerts={alerts} />

      <div className="mga-body" style={{ paddingTop: 0 }}>
        {today && (
          <section className="mga-hero" aria-label={M.dash2.hero}>
            <div className="mga-hero__kicker">{M.dash2.hero}</div>
            <div className="mga-hero__row">
              <div>
                <div className="mga-hero__proc">{today.proc}</div>
                <div className="mga-hero__place">{today.place}</div>
                <div className="mga-hero__live">
                  <span className="mga-hero__pulse" aria-hidden="true" /> {M.dash2.heroLive}
                </div>
              </div>
              <div className="mga-hero__when">
                <div className="mga-hero__whenlbl">{M.dash2.heroTime}</div>
                <div className="mga-hero__time">{today.time}</div>
              </div>
            </div>
            <button className="mga-cta" style={{ margin: '12px 0 0' }} onClick={() => go('ticket', { p: personId })}>
              {M.dash2.heroCta} →
            </button>
          </section>
        )}

        <button className="mga-card mga-prow" onClick={() => go('queuepicker', { p: personId })}>
          <span className="mga-itile">
            <Icon name="ticket" size={17} />
          </span>
          <span style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            <span className="mga-meta__val" style={{ display: 'block' }}>{M.dash2.queueTitle}</span>
            <span className="mga-meta__lbl">{M.dash2.queueHint}</span>
          </span>
          <span className="mga-gobtn" aria-hidden="true">
            <Icon name="arrow-right" size={14} />
          </span>
        </button>

        <section className="mga-card" aria-label={M.hub.doctorLabel}>
          <div className="mga-cardhdr">
            <span className="mga-meta__lbl">{M.hub.doctorLabel}</span>
            <button className="mga-seeall" onClick={() => go('doctor')}>
              {M.dash2.docInfo} ›
            </button>
          </div>
          <div className="mga-irow" style={{ padding: 0 }}>
            <span className="mga-doc__ava" aria-hidden="true">{DOCTOR.initial}</span>
            <div className="mga-meta" style={{ flex: 1 }}>
              <div className="mga-meta__val">{DOCTOR.name}</div>
              <div className="mga-meta__lbl">
                {DOCTOR.role} ·{' '}
                <span style={{ color: 'var(--mga-green-fg)', fontWeight: 600 }}>● {M.hub.online}</span>
              </div>
            </div>
          </div>
          <div className="mga-doc__next">
            {M.hub.nextVisit} <b>{DOCTOR.nextVisit}</b>
          </div>
          <div className="mga-doc__btns">
            <button className="mga-obtn mga-obtn--pink" style={{ flex: 1 }} onClick={noop}>
              {M.hub.book}
            </button>
          </div>
        </section>

        <button className="mga-card mga-prow" onClick={() => go('histhub')}>
          <span className="mga-itile" style={{ background: 'var(--mga-lav)', color: 'var(--mga-lav-fg)' }}>
            <Icon name="file-text" size={17} />
          </span>
          <span style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            <span className="mga-meta__val" style={{ display: 'block' }}>{M.dash2.historyTitle}</span>
            <span className="mga-meta__lbl">{M.dash2.historyHint}</span>
          </span>
          {unlocked && historyAlert ? (
            <span className="mga-badge mga-badge--red">{historyAlert}</span>
          ) : !unlocked ? (
            <span className="mga-lockchip" aria-label={M.dash.protectedHint}>
              <Icon name="lock" size={12} />
            </span>
          ) : (
            <span className="mga-prow__chv">
              <Icon name="chevron-right" size={16} />
            </span>
          )}
        </button>

        <button className="mga-card mga-prow" onClick={() => go('prevention')}>
          <span className="mga-itile" style={{ background: 'var(--mga-green-bg)', color: 'var(--mga-green-fg)' }}>
            <Icon name="shield-check" size={17} />
          </span>
          <span style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            <span className="mga-meta__val" style={{ display: 'block' }}>{M.hub.preventionTitle}</span>
            <span className="mga-meta__lbl">{M.dash2.preventionHint}</span>
          </span>
          <span className="mga-badge mga-badge--amber">{M.dash2.preventionBadge}</span>
        </button>

      </div>
    </>
  )
}
