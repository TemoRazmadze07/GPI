import { useEffect, useRef, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { ASSETS } from '../lib/assets.js'
import Drawer from '../components/Drawer.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import { kaAcc as ka } from './strings.js'
import ProfileScreen from './ProfileScreen.jsx'
import OverviewScreen from './OverviewScreen.jsx'
import PersonalInfoScreen from './PersonalInfoScreen.jsx'
import SecurityScreen from './SecurityScreen.jsx'
import LinkingModal from './LinkingModal.jsx'

/* AccountsApp — the devaccounts.gpih.ge console redesign (own Rule 5 surface).
   Shell mirrors the SHIPPED login screen (full-width pill top bar on
   surface-page). Routing between login ↔ console ↔ MyGPI is already developed
   — buttons here are visual hand-offs.

   TWO VERSIONS (user pivot 2026-08-10):
   · DEFAULT — V2 single page: no side nav, everything in one centered 8-col
     container (profile header w/ avatar upload · MyGPI hero · linking ·
     personal info · password-change row → modal).
   · `?v=1` — the first sidebar-console version, kept for comparison.
   The header account chip carries the avatar + a menu with ONLY logout — the
   current console's duplicated navigation stays dead in both versions.

   Linking state is session-scoped demo state: the popup auto-opens ONCE per
   session (doc requirement 1, "migration popup"); dismissing it leaves the
   persistent linking card until the account is linked.

   MOBILE (≤767, added 2026-08-10): the header's right cluster (ENG pill +
   account chip) is 266px of unshrinkable email and overflowed every phone
   width, so below the breakpoint it collapses into a BURGER that opens the
   shared Drawer full-screen — chrome 1:1 with GPI's shipped mobile menu
   (title + ×, tall rows, language switcher pinned to the bottom).
   Both trees are always in the DOM; CSS alone decides which is visible, so
   desktop rendering is untouched. The menu deliberately carries NO page
   navigation — duplicating nav between a bar and a menu is the exact flaw
   this redesign removed from the current console. */

const NAV = [
  { id: 'home', icon: 'home', label: ka.nav.home },
  { id: 'personal', icon: 'user', label: ka.nav.personal },
  { id: 'security', icon: 'lock', label: ka.nav.security },
]

const LINKED_KEY = 'gpi.acc.linked'
const PROMPTED_KEY = 'gpi.acc.linkPrompted'

/* Account linking (one-time migration popup + overview card) — HIDDEN
   2026-08-10, user: "we don't need this section". Mechanics were TBC anyway
   (see LinkingModal). Nothing deleted — flip to true to restore. Same
   hide-don't-delete idiom as B2B's SHOW_GLOBAL_SEARCH. While false, the popup
   never auto-opens (any version); V1's overview card remains as history. */
const SHOW_LINKING = false

function isV1() {
  const h = window.location.hash
  const qi = h.indexOf('?')
  const hashQ = new URLSearchParams(qi === -1 ? '' : h.slice(qi + 1))
  const searchQ = new URLSearchParams(window.location.search)
  return hashQ.get('v') === '1' || searchQ.get('v') === '1'
}

export default function AccountsApp({ section = 'home' }) {
  const v1 = isV1()
  const sec = NAV.some((n) => n.id === section) ? section : 'home'
  const [linked, setLinked] = useState(() => sessionStorage.getItem(LINKED_KEY) === '1')
  const [photo, setPhoto] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  /* Visual only: the console has a single Georgian string table (Rule 5 keeps
     it out of My-Cabinet's i18n), so switching moves the check but does not
     translate. Wiring a real EN table is its own job. */
  const [lang, setLang] = useState('ka')
  const menuRef = useRef(null)

  useEffect(() => {
    if (SHOW_LINKING && !linked && !sessionStorage.getItem(PROMPTED_KEY)) {
      sessionStorage.setItem(PROMPTED_KEY, '1')
      setModalOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const go = (id) => {
    const suffix = v1 ? '?v=1' : ''
    window.location.hash = '#/accounts' + (id === 'home' ? '' : '/' + id) + suffix
  }

  const confirmLink = () => {
    setLinked(true)
    sessionStorage.setItem(LINKED_KEY, '1')
    setModalOpen(false)
  }

  return (
    <div className="acc-page">
      <header className="acc-topbar">
        <img className="acc-logo" src={ASSETS.logo} alt="GPI — Vienna Insurance Group" />
        <div className="acc-topbar__spacer" />
        <button
          className="acc-burger"
          type="button"
          aria-label={ka.nav.menu}
          aria-expanded={navOpen}
          onClick={() => setNavOpen(true)}
        >
          <Icon name="menu" size={24} />
        </button>
        <button className="acc-pill" type="button" title="KA / ENG">
          <Icon name="globe" size={16} />
          <span>ENG</span>
        </button>
        <div className="acc-account" ref={menuRef}>
          <button
            className="acc-pill"
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="acc-chipav" aria-hidden="true">
              {photo ? <img src={photo} alt="" /> : ka.user.initials}
            </span>
            <span className="acc-pill__mail">{ka.user.login}</span>
            <Icon name={menuOpen ? 'chevron-up' : 'chevron-down'} size={16} />
          </button>
          {menuOpen && (
            <div className="acc-menu" role="menu">
              <button
                className="acc-menu__item"
                role="menuitem"
                type="button"
                onClick={() => setMenuOpen(false)}
              >
                <Icon name="log-out" size={16} />
                <span>{ka.nav.logout}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {v1 ? (
        <div className="acc-layout">
          <nav className="acc-side" aria-label={ka.brand}>
            <ul className="acc-nav">
              {NAV.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className={`acc-nav__item${sec === n.id ? ' is-active' : ''}`}
                    aria-current={sec === n.id ? 'page' : undefined}
                    onClick={() => go(n.id)}
                  >
                    <Icon name={n.icon} size={20} />
                    <span>{n.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="acc-nav__item acc-nav__item--logout">
              <Icon name="log-out" size={20} />
              <span>{ka.nav.logout}</span>
            </button>
          </nav>

          <main className="acc-main">
            {sec === 'home' && (
              <OverviewScreen linked={linked} onOpenLink={() => setModalOpen(true)} onGo={go} />
            )}
            {sec === 'personal' && <PersonalInfoScreen />}
            {sec === 'security' && <SecurityScreen />}
          </main>
        </div>
      ) : (
        <main className="acc-container">
          <ProfileScreen
            linked={linked}
            linking={SHOW_LINKING}
            onOpenLink={() => setModalOpen(true)}
            photo={photo}
            onPhoto={setPhoto}
          />
        </main>
      )}

      {navOpen && (
        <Drawer
          className="acc-menudrawer"
          title={ka.nav.menu}
          closeLabel={ka.nav.close}
          onClose={() => setNavOpen(false)}
          footer={
            <LanguageSwitcher
              value={lang}
              onChange={setLang}
              direction="up"
              label={ka.nav.language}
            />
          }
        >
          <div className="acc-menuid">
            <span className="acc-menuid__av" aria-hidden="true">
              {photo ? <img src={photo} alt="" /> : ka.user.initials}
            </span>
            <span className="acc-menuid__txt">
              <span className="t-body acc-menuid__name">
                {ka.user.firstName} {ka.user.lastName}
              </span>
              <span className="t-caption acc-menuid__mail">{ka.user.login}</span>
            </span>
          </div>
          <button type="button" className="acc-menurow" onClick={() => setNavOpen(false)}>
            <Icon name="log-out" size={20} />
            <span className="t-body acc-menurow__lbl">{ka.nav.logout}</span>
            <Icon name="chevron-right" size={20} className="acc-menurow__chev" />
          </button>
        </Drawer>
      )}

      {modalOpen && <LinkingModal onConfirm={confirmLink} onClose={() => setModalOpen(false)} />}
    </div>
  )
}
