import { useEffect, useRef, useState } from 'react'
import { ASSETS } from '../lib/assets.js'
import Icon from '../lib/Icon.jsx'
import Avatar from '../components/Avatar.jsx'
import { Button } from '../components/Button.jsx'
import ContactLauncher from './ContactLauncher.jsx'
import NotificationsBell from './NotificationsBell.jsx'
import MessagesButton from './MessagesButton.jsx'
import CompanySwitcher from './CompanySwitcher.jsx'
import { kaB2B } from './strings.js'
import { NAV_MAIN, parentOf, bubbled } from './nav.js'
import { COMPANIES, DEFAULT_COMPANY_ID } from './data/companies.js'
import { useMessages, unreadCount as msgUnreadCount } from './data/messages.js'

/* B2BShell — CORPO portal application chrome (Rule 5: separate platform
   context from My Cabinet). Light chrome on surface/page, content floats as
   a rounded white canvas. Sidebar: 7 top-level items, accordion groups,
   collapsible to an icon rail. All sizes come straight from tokens. */

/* Global (cross-entity) top-bar search is HIDDEN, not removed — searching across
   people, policies, invoices and requests at once is expensive to implement on
   the current back end (2026-08-06). The field, its clear button, its strings
   (t.topbar.search / .searchClear) and its CSS (.b2b-search in b2b.css) all stay
   in place: flip this to true to bring it back. The per-table search inside
   FilterBar is a DIFFERENT, working feature — it is untouched by this flag. */
const SHOW_GLOBAL_SEARCH = false

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
  // Kept wired up while SHOW_GLOBAL_SEARCH is false — nothing to restore later.
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

  // Active company (session-only, like notification read state). Switching
  // changes the whole portal context, so it always lands on the portal home.
  const [companyId, setCompanyId] = useState(DEFAULT_COMPANY_ID)
  const switchCompany = (id) => {
    setCompanyId(id)
    navigate('home')
  }

  const navProps = { active, openGroup, flyout, collapsed, onNavigate: navigate, onToggle: toggle }

  /* მიმოწერა badge is LIVE from the messages store (unlike the static seed
     counts on requests/claims): reading a thread anywhere — popover or page —
     clears it immediately. Hidden categories are already excluded. */
  useMessages()
  const msgUnread = msgUnreadCount()
  const navItems = NAV_MAIN.map((item) =>
    item.id === 'messages' ? { ...item, badge: msgUnread || undefined } : item
  )

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
          {/* Client chip = company switcher when the account spans several
              companies; static chip when there is only one. */}
          <CompanySwitcher
            companies={COMPANIES}
            activeId={companyId}
            onSwitch={switchCompany}
          />
        </div>

        <div className="b2b-topbar__actions">
          {SHOW_GLOBAL_SEARCH && (
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
          )}
          <Button
            variant="primary"
            size="md"
            leadingIcon="plus"
            onClick={() => {
              window.location.hash = '#/b2b/insured/add'
            }}
          >
            {t.actions.addPolicy}
          </Button>
          <MessagesButton />
          <NotificationsBell />
          <button className="b2b-user" aria-label={`${t.topbar.user} · ${t.topbar.role}`}>
            <Avatar name={t.topbar.user} size={32} />
            <Icon name="chevron-down" size={16} />
          </button>
        </div>
      </header>

      <div className="b2b-body">
        <aside className={`b2b-sidebar ${collapsed ? 'is-collapsed' : ''}`} ref={sidebarRef}>
          <nav className="b2b-nav">
            {navItems.map((item) => (
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
