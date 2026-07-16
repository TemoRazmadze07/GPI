import { useEffect, useRef, useState } from 'react'
import { ASSETS } from '../lib/assets.js'
import Icon from '../lib/Icon.jsx'
import Avatar from '../components/Avatar.jsx'
import { Button } from '../components/Button.jsx'
import ContactLauncher from './ContactLauncher.jsx'
import ClientMark from './ClientMark.jsx'
import { kaB2B } from './strings.js'
import { NAV_MAIN, parentOf, bubbled } from './nav.js'

/* B2BShell — CORPO portal application chrome (Rule 5: separate platform
   context from My Cabinet). Light chrome on surface/page, content floats as
   a rounded white canvas. Sidebar: 7 top-level items, accordion groups,
   collapsible to an icon rail. All sizes come straight from tokens. */

function NavBadge({ badge, urgent }) {
  if (urgent) return <span className="b2b-nav__dot" aria-label="საჭიროებს ყურადღებას" />
  if (badge) return <span className="b2b-nav__badge">{badge}</span>
  return null
}

function NavItem({ item, active, openGroup, flyout, collapsed, onNavigate, onToggle }) {
  const isParent = !!item.children
  const isOpen = isParent && openGroup === item.id && !collapsed
  const flyoutOpen = isParent && collapsed && flyout === item.id
  const childActive = isParent && item.children.some((c) => c.id === active)
  const bub = bubbled(item)

  if (isParent) {
    return (
      <div className="b2b-nav__group">
        <button
          className={`b2b-nav__item ${childActive && !isOpen ? 'is-hint' : ''} ${isOpen ? 'is-open' : ''}`}
          title={collapsed ? item.label : undefined}
          aria-expanded={isOpen || flyoutOpen}
          aria-haspopup={collapsed ? 'menu' : undefined}
          onClick={() => onToggle(item.id)}
        >
          <Icon name={item.icon} size={20} />
          {!collapsed && <span className="b2b-nav__label">{item.label}</span>}
          {!collapsed && !isOpen && <NavBadge {...bub} />}
          {collapsed && (bub.urgent || bub.badge) && (
            <span className={`b2b-nav__dot b2b-nav__dot--rail ${bub.urgent ? '' : 'b2b-nav__dot--muted'}`} />
          )}
          {!collapsed && (
            <span className="b2b-nav__chev">
              <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} size={16} />
            </span>
          )}
        </button>
        {isOpen && (
          <div className="b2b-nav__children">
            {item.children.map((c) => (
              <button
                key={c.id}
                className={`b2b-nav__child ${active === c.id ? 'is-active' : ''}`}
                onClick={() => onNavigate(c.id)}
              >
                <span className="b2b-nav__label">{c.label}</span>
                <NavBadge badge={c.badge} urgent={c.urgent} />
              </button>
            ))}
          </div>
        )}
        {flyoutOpen && (
          <div className="b2b-nav__flyout" role="menu" aria-label={item.label}>
            <div className="b2b-nav__flyout-label">{item.label}</div>
            {item.children.map((c) => (
              <button
                key={c.id}
                role="menuitem"
                className={`b2b-nav__flyout-item ${active === c.id ? 'is-active' : ''}`}
                onClick={() => onNavigate(c.id)}
              >
                <span className="b2b-nav__label">{c.label}</span>
                <NavBadge badge={c.badge} urgent={c.urgent} />
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      className={`b2b-nav__item ${active === item.id ? 'is-active' : ''}`}
      title={collapsed ? item.label : undefined}
      onClick={() => onNavigate(item.id)}
    >
      <Icon name={item.icon} size={20} />
      {!collapsed && <span className="b2b-nav__label">{item.label}</span>}
      {!collapsed && <NavBadge badge={item.badge} urgent={item.urgent} />}
      {collapsed && (item.urgent || item.badge) && (
        <span className={`b2b-nav__dot b2b-nav__dot--rail ${item.urgent ? '' : 'b2b-nav__dot--muted'}`} />
      )}
    </button>
  )
}

export default function B2BShell({ active = 'home', onNavigate, children }) {
  const t = kaB2B
  const [collapsed, setCollapsed] = useState(false)
  // Accordion: the group holding the active page opens by default; opening
  // another closes it. Manual toggle wins until the next navigation.
  const [openGroup, setOpenGroup] = useState(() => parentOf(active))
  // Rail flyout: contextual sub-menu next to a parent icon (sidebar stays 72px).
  const [flyout, setFlyout] = useState(null)
  const sidebarRef = useRef(null)
  // Top-bar search: controlled so a clear (×) button can cancel it.
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)
  const clearSearch = () => {
    setQuery('')
    searchRef.current?.focus()
  }

  // Deep links / back-button: any route change re-opens the active page's group
  // and dismisses a stale rail flyout.
  useEffect(() => {
    setOpenGroup(parentOf(active))
    setFlyout(null)
  }, [active])

  // Flyout closes on Esc or any press outside the sidebar.
  useEffect(() => {
    if (!flyout) return
    const onKey = (e) => e.key === 'Escape' && setFlyout(null)
    const onDown = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) setFlyout(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [flyout])

  const navigate = (id) => {
    setOpenGroup(parentOf(id))
    setFlyout(null)
    onNavigate?.(id)
  }
  const toggle = (groupId) => {
    if (collapsed) {
      setFlyout((f) => (f === groupId ? null : groupId))
      return
    }
    setOpenGroup((g) => (g === groupId ? null : groupId))
  }
  const toggleCollapsed = () => {
    setFlyout(null)
    setCollapsed((v) => !v)
  }

  const navProps = { active, openGroup, flyout, collapsed, onNavigate: navigate, onToggle: toggle }

  return (
    <div className="b2b-shell">
      <header className="b2b-topbar">
        <div className="b2b-brand">
          {/* CORPO product logo slot — client to provide the asset; GPI logo only until then.
              Links to the Flow Map hub (prototype nav aid; → CORPO home in production). */}
          <a className="b2b-brand__home" href="#/map" aria-label={t.topbar.home}>
            <img className="b2b-brand__logo" src={ASSETS.logo} alt="GPI" />
          </a>
          <span className="b2b-brand__divider" aria-hidden="true" />
          <span className="b2b-client" title={t.topbar.client}>
            <ClientMark
              name={t.topbar.client}
              logo={t.topbar.clientLogo}
              fallback={t.topbar.clientMark}
            />
            <span className="b2b-client__name">{t.topbar.clientShort}</span>
          </span>
        </div>

        <div className="b2b-topbar__actions">
          <div className={`b2b-search ${query ? 'has-value' : ''}`} role="search">
            <Icon name="search" size={20} />
            <input
              ref={searchRef}
              type="text"
              value={query}
              placeholder={t.topbar.search}
              aria-label={t.topbar.search}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && query && clearSearch()}
            />
            {query && (
              <button
                type="button"
                className="b2b-search__clear"
                aria-label={t.topbar.searchClear}
                onClick={clearSearch}
              >
                <Icon name="x" size={16} />
              </button>
            )}
          </div>
          <Button
            variant="primary"
            size="md"
            leadingIcon="plus"
            onClick={() => {
              window.location.hash = '#/b2b/insured/add'
            }}
          >
            {t.topbar.addInsured}
          </Button>
          <button className="b2b-topbtn" aria-label={t.topbar.notifications}>
            <Icon name="bell" size={20} />
            <span className="b2b-topbtn__dot" />
          </button>
          <button className="b2b-user" aria-label={`${t.topbar.user} · ${t.topbar.role}`}>
            <Avatar name={t.topbar.user} size={32} />
            <Icon name="chevron-down" size={16} />
          </button>
        </div>
      </header>

      <div className="b2b-body">
        <aside className={`b2b-sidebar ${collapsed ? 'is-collapsed' : ''}`} ref={sidebarRef}>
          <nav className="b2b-nav">
            {NAV_MAIN.map((item) => (
              <NavItem key={item.id} item={item} {...navProps} />
            ))}
          </nav>
          <div className="b2b-sidebar__bottom">
            <button
              className="b2b-nav__collapse"
              onClick={toggleCollapsed}
              title={collapsed ? t.nav.expand : t.nav.collapse}
            >
              <Icon name={collapsed ? 'panel-left-open' : 'panel-left-close'} size={20} />
              {!collapsed && <span>{t.nav.collapse}</span>}
            </button>
          </div>
        </aside>

        <main className="b2b-main">
          <div className="b2b-canvas">{children}</div>
        </main>
      </div>

      <ContactLauncher />
    </div>
  )
}
