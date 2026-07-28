/* MyGPI MOBILE APP prototype shell (route #/mobile/…) — Rule 5: a separate platform
   from My-Cabinet and B2B, with its own scoped styles (styles/mga.css) mirroring the
   CURRENT production app's language. Renders a 390px device frame on desktop and
   full-bleed on real mobile viewports.

   Sections: health (home) · curatio (hub) · ticket (F-01) · history (F-02).
   Demo state: `?day=visit` flips visit-day mode; nav.js#go() preserves it across
   pages. The chips above the frame switch it and are hidden from usability-study
   links (?study). */

import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { isVisitDay } from './nav.js'
import HealthHomeScreen from './HealthHomeScreen.jsx'
import CuratioHubScreen from './CuratioHubScreen.jsx'
import TicketScreen from './TicketScreen.jsx'
import HistoryScreen from './HistoryScreen.jsx'

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

function BottomNav() {
  const items = [
    { label: M.nav[0], icon: 'home', on: true },
    { label: M.nav[1], icon: 'shield-check' },
    { label: M.nav[2], icon: 'shopping-cart' },
    { label: M.nav[3], icon: 'file-text' },
    { label: M.nav[4], icon: 'layout-grid' },
  ]
  return (
    <nav className="mga-nav" aria-label="Main">
      {items.map((it) => (
        <button
          key={it.label}
          className={'mga-nav__item' + (it.on ? ' mga-nav__item--on' : '')}
          aria-current={it.on ? 'page' : undefined}
        >
          <Icon name={it.icon} size={18} />
          {it.label}
        </button>
      ))}
    </nav>
  )
}

const SCREENS = {
  health: HealthHomeScreen,
  curatio: CuratioHubScreen,
  ticket: TicketScreen,
  history: HistoryScreen,
}

export default function MobileApp({ section = 'health' }) {
  const visitDay = isVisitDay()
  const Screen = SCREENS[section] || HealthHomeScreen

  const setDay = (visit) => {
    const sect = SCREENS[section] ? section : 'health'
    window.location.hash = '#/mobile/' + sect + (visit ? '?day=visit' : '')
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
        </div>
      )}
      <div className="mga-frame">
        <div className="mga-screen">
          <StatusBar />
          <Screen visitDay={visitDay} />
          <BottomNav />
          <div className="mga-homebar" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </div>
  )
}
