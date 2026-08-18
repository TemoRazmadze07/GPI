/* MyGPI MOBILE APP prototype shell (route #/mobile/…) — Rule 5: a separate platform
   from My-Cabinet and B2B, with its own scoped styles (styles/mga.css) mirroring the
   CURRENT production app's language. Renders a 390px device frame on desktop and
   full-bleed on real mobile viewports.

   Sections: health (home) · curatio (hub) · ticket (F-01) · history (F-02).
   Demo state: `?day=visit` flips visit-day mode; `?v=2` switches to the V2
   three-tab nav comparison (curatio renders as a DASHBOARD TAB, not a hub page).
   nav.js#go() preserves both across pages. The chips above the frame switch
   them and are hidden from usability-study links (?study). */

import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { isVisitDay, isV2, hasDoctor, go } from './nav.js'
import { clearPickedDoctor, clearArrived } from './data.js'
import HealthHomeScreen from './HealthHomeScreen.jsx'
import CuratioHubScreen from './CuratioHubScreen.jsx'
import CuratioDashScreen from './CuratioDashScreen.jsx'
import TicketScreen from './TicketScreen.jsx'
import HistoryScreen from './HistoryScreen.jsx'
import QueuePickerScreen from './QueuePickerScreen.jsx'
import DoctorScreen from './DoctorScreen.jsx'
import DoctorSelectScreen from './DoctorSelectScreen.jsx'
import TransferScreen from './TransferScreen.jsx'
import History2Screen from './History2Screen.jsx'
import HistoryHubScreen from './HistoryHubScreen.jsx'
import PreventionScreen from './PreventionScreen.jsx'
import MoreScreen from './MoreScreen.jsx'

const IS_STUDY = new URLSearchParams(window.location.search).has('study')

function StatusBar() {
  return (
    <div className="mga-status" aria-hidden="true">
      <span>9:41</span>
      <span className="mga-status__icons">
        <span className="mga-status__bars">
          <span style={{ height: 4 }} />
          <span style={{ height: 6 }} />
          <span style={{ height: 8 }} />
          <span style={{ height: 10 }} />
        </span>
        <span className="mga-status__batt" />
      </span>
    </div>
  )
}

/* #12 — the „more" tab became a real destination, so the bar now navigates instead
   of hard-coding the first tab as active. The other three stay dead: they belong to
   the existing app, not to this module. */
function BottomNav({ section }) {
  const items = [
    { label: M.nav[0], icon: 'home', to: 'health' },
    { label: M.nav[1], icon: 'shield-check' },
    { label: M.nav[2], icon: 'shopping-cart' },
    { label: M.nav[3], icon: 'file-text' },
    { label: M.nav[4], icon: 'layout-grid', to: 'more' },
  ]
  return (
    <nav className="mga-nav" aria-label="Main">
      {items.map((it) => {
        /* Everything that is not the More menu lives under the main tab. */
        const on = it.to === 'more' ? section === 'more' : it.to === 'health' && section !== 'more'
        return (
          <button
            key={it.label}
            className={'mga-nav__item' + (on ? ' mga-nav__item--on' : '')}
            aria-current={on ? 'page' : undefined}
            onClick={it.to ? () => go(it.to) : undefined}
          >
            <Icon name={it.icon} size={18} />
            {it.label}
          </button>
        )
      })}
    </nav>
  )
}

const SCREENS = {
  health: HealthHomeScreen,
  curatio: CuratioHubScreen,
  ticket: TicketScreen,
  history: HistoryScreen,
  queuepicker: QueuePickerScreen /* V2 only — reached from the dash (A3) */,
  docselect: DoctorSelectScreen /* V2 only — #1: empty doctor card CTA (booking-flow page-1 reuse) */,
  doctor: DoctorScreen /* V2 only — dash doctor card „სრული ინფო" (A4) */,
  transfer: TransferScreen /* V2 only — doctor screen's gated CTA (A5) */,
  histhub: HistoryHubScreen /* V2 only — dash history row → section menu (A6c) */,
  prevention: PreventionScreen /* V2 only — dash prevention row (A7) */,
  more: MoreScreen /* #12 — „მეტი" menu, the second way into კურაციო */,
}

export default function MobileApp({ section = 'health' }) {
  const visitDay = isVisitDay()
  const v2 = isV2()
  /* V2 swaps: curatio hub → dashboard tab; history → parity rework (A6). */
  const Screen =
    v2 && section === 'curatio'
      ? CuratioDashScreen
      : v2 && section === 'history'
        ? History2Screen
        : SCREENS[section] || HealthHomeScreen

  const sect = SCREENS[section] ? section : 'health'
  const noDoc = !hasDoctor()
  /* #5 — flipping the visit-day scenario resets the arrival check-in. */
  const setDay = (visit) => {
    clearArrived()
    go(sect, { day: visit })
  }
  const setV2 = (on) => go(sect, { v2: on })
  /* #1 demo state — both chips reset any doctor picked via docselect. */
  const setDoc = (on) => {
    clearPickedDoctor()
    go(sect, { doc: on })
  }

  return (
    <div className="mga-stage">
      {!IS_STUDY && (
        <div className="mga-demo" role="group" aria-label="Demo state">
          <button
            className={'mga-demo__chip' + (!visitDay ? ' mga-demo__chip--on' : '')}
            onClick={() => setDay(false)}
          >
            {M.demo.normal}
          </button>
          <button
            className={'mga-demo__chip' + (visitDay ? ' mga-demo__chip--on' : '')}
            onClick={() => setDay(true)}
          >
            {M.demo.visit}
          </button>
          <span className="mga-demo__sep" aria-hidden="true" />
          <button
            className={'mga-demo__chip' + (!v2 ? ' mga-demo__chip--on' : '')}
            onClick={() => setV2(false)}
          >
            {M.demo.v1}
          </button>
          <button
            className={'mga-demo__chip' + (v2 ? ' mga-demo__chip--on' : '')}
            onClick={() => setV2(true)}
          >
            {M.demo.v2}
          </button>
          {v2 && (
            <>
              <span className="mga-demo__sep" aria-hidden="true" />
              <button
                className={'mga-demo__chip' + (!noDoc ? ' mga-demo__chip--on' : '')}
                onClick={() => setDoc(true)}
              >
                {M.demo.docOn}
              </button>
              <button
                className={'mga-demo__chip' + (noDoc ? ' mga-demo__chip--on' : '')}
                onClick={() => setDoc(false)}
              >
                {M.demo.docOff}
              </button>
            </>
          )}
        </div>
      )}
      <div className="mga-frame">
        <div className="mga-screen">
          <StatusBar />
          <Screen visitDay={visitDay} v2={v2} />
          <BottomNav section={sect} />
          <div className="mga-homebar" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </div>
  )
}
