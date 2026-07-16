import { useState } from 'react'
import { ASSETS } from '../lib/assets.js'
import Icon from '../lib/Icon.jsx'
import Avatar from './Avatar.jsx'
import { ka } from '../i18n/strings.js'

/* AppShell — top bar (logo + utilities) and horizontal primary nav.
   Reused by every My-Cabinet screen. Page content goes in `children`.
   ≤767px the nav collapses behind a burger toggle (see mobile.css);
   on desktop the burger is display:none and the nav renders as always. */

function Logo() {
  return (
    <a className="gpi-logo" href="#" aria-label="GPI — Vienna Insurance Group">
      <img className="gpi-logo__img" src={ASSETS.logo} alt="GPI — Vienna Insurance Group" />
    </a>
  )
}

function NavItem({ children, active = false, hasMenu = false }) {
  return (
    <button className={`gpi-nav__item ${active ? 'is-active' : ''}`}>
      {children}
      {hasMenu && <Icon name="chevron-down" size={16} />}
    </button>
  )
}

export default function AppShell({ children }) {
  const t = ka
  const [navOpen, setNavOpen] = useState(false)
  return (
    <div className={`gpi-shell ${navOpen ? 'is-navopen' : ''}`}>
      <header className="gpi-topbar">
        <div className="gpi-topbar__inner">
          <Logo />
          <div className="gpi-topbar__utils">
            <button className="gpi-lang">
              <span className="gpi-lang__flag" aria-hidden="true">🇬🇧</span>
              <span>{t.topbar.language}</span>
              <Icon name="chevron-down" size={16} />
            </button>
            <button className="gpi-iconcircle" aria-label="messages">
              <Icon name="mail" size={20} />
            </button>
            <button className="gpi-user">
              <Avatar name={t.topbar.user} seed={48} size={32} />
              <span>{t.topbar.user}</span>
              <Icon name="chevron-down" size={16} />
            </button>
            <button
              className="gpi-burger"
              aria-label={t.topbar.menu}
              aria-expanded={navOpen}
              onClick={() => setNavOpen((o) => !o)}
            >
              <Icon name={navOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </header>

      <nav className="gpi-nav">
        <div className="gpi-nav__inner">
          <NavItem active><Icon name="home" size={20} /></NavItem>
          <NavItem>{t.nav.policies}</NavItem>
          <NavItem>{t.nav.payments}</NavItem>
          <NavItem hasMenu>{t.nav.booking}</NavItem>
          <NavItem>{t.nav.referrals}</NavItem>
          <NavItem>{t.nav.reimbursement}</NavItem>
          <NavItem>{t.nav.coverage}</NavItem>
          <NavItem>{t.nav.dental}</NavItem>
          <NavItem hasMenu>{t.nav.internal}</NavItem>
        </div>
      </nav>

      <main className="gpi-main">
        <div className="gpi-main__inner">{children}</div>
      </main>
    </div>
  )
}
