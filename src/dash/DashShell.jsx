import { useState, useRef, useLayoutEffect, useCallback } from 'react'
import { ASSETS } from '../lib/assets.js'
import Icon from '../lib/Icon.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import { lang, setLang } from '../i18n/index.js'
import { BrunoMark } from './marks.jsx'
import { D } from './strings.js'
import { USER } from './data.js'

/* DashShell — the dashboard host's own chrome.

   NOT AppShell, on purpose. The two are close cousins but they are not the same
   bar: this one carries the Bruno points chip, its account chip is a glyph
   rather than a photo, its last nav item is „შეიძინე დაზღვევა" (a sales entry)
   where My-Cabinet's is „შიდა დაზღვევა", and Home is an icon-only active tab.
   Forking the component keeps the booking application untouched by this project
   (the user's „another project, not inside the application"), while everything
   below the chrome — tokens, Icon, LanguageSwitcher, Avatar, Badge, Button — is
   the same shared kit.

   ⚠️ LOGO: the design shows the GEORGIAN lockup (ჯიპიაი / ვენის სადაზღვევო
   ჯგუფი). The prototype only owns the English one, so that is what renders.
   Needs the ka lockup export from GPI. */

/* კურაციო joined 2026-08-26 (concept round: a section this big needs a
   permanent way in, and SMS/email deep links need somewhere visible to land).
   The SHORT label — the mobile V2 switcher's own form — not „ჩემი კურაციო".
   `hash` marks the items that lead to a built page. */
const NAV = [
  { id: 'policies', menu: false },
  { id: 'payments', menu: false },
  { id: 'booking', menu: true },
  { id: 'referrals', menu: false },
  { id: 'reimbursement', menu: false },
  { id: 'curatio', menu: false, hash: '#/dash/curatio', label: (d) => d.cur.nav },
  { id: 'coverage', menu: false },
  { id: 'dental', menu: false },
  { id: 'buy', menu: true },
]

/* ---------------------------------------------------------------------------
   The nav does NOT fit, and no amount of spacing fixes that.

   MEASURED: the ten items need 1306px of intrinsic width between them. Even at
   the minimum 4px gap that is ~1342px of content box — about a 1560px viewport
   once the fluid gutters are taken out. So at 1280 or 1440, two of the design's
   own labels („დაფარვები და გახარჯვები", „სტომატოლოგიური კლინიკები") simply
   have nowhere to go. `flex-wrap` was the first answer and it was the wrong one:
   it stranded a single item alone on a second row, which reads as a bug.

   So the nav now behaves like a real desktop nav: it measures itself and moves
   whatever will not fit into a „მეტი" menu. One row at every width, nothing
   hidden, no label shortening, and the client's own wording untouched.

   Widths are cached from ONE full render (and re-taken when webfonts land,
   because Georgian metrics change once Noto loads). Overflow follows DOM order,
   so the last items go first.
   ⚠️ PRODUCT NOTE for the user: that means „შეიძინე დაზღვევა" — a SALES entry —
   is the first thing to fall into the menu. If it must always stay visible, its
   place in the list is the thing to change, not this mechanism. */
function useNavOverflow(count) {
  const innerRef = useRef(null)
  const widths = useRef(null)
  const [visible, setVisible] = useState(count)

  const measure = useCallback(() => {
    const inner = innerRef.current
    if (!inner || !widths.current) return
    const cs = getComputedStyle(inner)
    /* Burger mode stacks the nav into a column, where every item has its own
       line and nothing can overflow. Without this the row math would keep
       hiding items into a menu that mode deliberately does not render — and
       those sections would be unreachable on a small screen. */
    if (cs.flexDirection === 'column') return setVisible(count)
    const gap = parseFloat(cs.columnGap) || 0
    const avail =
      inner.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
    const { home, items, more } = widths.current

    // Everything fits → no menu at all, and no space reserved for one.
    const all = items.reduce((sum, w) => sum + gap + w, home)
    if (all <= avail) return setVisible(items.length)

    let used = home + gap + more
    let n = 0
    for (const w of items) {
      if (used + gap + w > avail) break
      used += gap + w
      n += 1
    }
    setVisible(n)
  }, [count])

  /* First layout renders every item, so this is the one chance to read their
     natural widths. `more` is measured from a probe that is in flow but
     invisible — a display:none element has no width to read. */
  useLayoutEffect(() => {
    const inner = innerRef.current
    if (!inner) return
    const read = () => {
      const nodes = [...inner.querySelectorAll('[data-nav]')]
      const probe = inner.querySelector('[data-nav-probe]')
      if (nodes.length < count + 1 || !probe) return
      widths.current = {
        home: nodes[0].offsetWidth,
        items: nodes.slice(1).map((n) => n.offsetWidth),
        more: probe.offsetWidth,
      }
      measure()
    }
    read()
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(read)
    const ro = new ResizeObserver(measure)
    ro.observe(inner)
    return () => ro.disconnect()
  }, [count, measure])

  return { innerRef, visible, measured: !!widths.current }
}

function NavMore({ items, activeId, onPick }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  /* An active section hidden inside the menu still has to look current, or the
     nav claims nothing is selected while the page says otherwise. */
  const holdsActive = items.some((i) => i.id === activeId)

  return (
    <div className="gpi-actmenu dash-nav__more" ref={ref}>
      <button
        type="button"
        className={`dash-nav__item${holdsActive ? ' is-active' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {D.nav.more}
        <Icon name="chevron-down" size={16} />
      </button>
      {open && (
        <div className="gpi-actmenu__panel dash-nav__panel" role="menu">
          {items.map((n) => (
            <button
              key={n.id}
              type="button"
              role="menuitem"
              className={`gpi-actmenu__item${n.id === activeId ? ' is-active' : ''}`}
              onClick={() => {
                setOpen(false)
                onPick(n)
              }}
            >
              {n.label ? n.label(D) : D.nav[n.id]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DashShell({ children, section = 'home', onHome }) {
  const [navOpen, setNavOpen] = useState(false)
  const { innerRef, visible } = useNavOverflow(NAV.length)
  const activeId = section.startsWith('curatio') ? 'curatio' : null
  const shown = NAV.slice(0, visible)
  const hidden = NAV.slice(visible)
  const pick = (n) => {
    if (n.hash) window.location.hash = n.hash
  }

  return (
    <div className={`dash-shell ${navOpen ? 'is-navopen' : ''}`}>
      <header className="dash-topbar">
        <div className="dash-shell__inner dash-topbar__inner">
          <a className="dash-logo" href="#/dash" aria-label="GPI — Vienna Insurance Group">
            <img className="dash-logo__img" src={ASSETS.logo} alt="GPI — Vienna Insurance Group" />
          </a>

          <div className="dash-topbar__utils">
            <LanguageSwitcher value={lang} onChange={setLang} />

            <button type="button" className="dash-points" aria-label={D.topbar.pointsA11y}>
              <BrunoMark size={22} tone="pink" />
              <span>{D.topbar.points(USER.points)}</span>
            </button>

            <button type="button" className="gpi-iconcircle" aria-label={D.topbar.mail}>
              <Icon name="mail" size={20} />
            </button>

            <button type="button" className="dash-user">
              <span className="dash-user__ava" aria-hidden="true">
                <Icon name="user" size={20} />
              </span>
              <span className="dash-user__name">{D.topbar.user}</span>
              <Icon name="chevron-down" size={16} />
            </button>

            <button
              type="button"
              className="dash-burger"
              aria-label={D.topbar.menu}
              aria-expanded={navOpen}
              onClick={() => setNavOpen((o) => !o)}
            >
              <Icon name={navOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </header>

      <nav className="dash-nav" aria-label={D.topbar.menu}>
        <div className="dash-shell__inner dash-nav__inner" ref={innerRef}>
          <button
            type="button"
            data-nav
            className={`dash-nav__item${section === 'home' ? ' is-active' : ''}`}
            aria-current={section === 'home' ? 'page' : undefined}
            onClick={onHome}
          >
            <Icon name="home" size={20} />
            <span className="gpi-sr-only">{D.nav.home}</span>
          </button>
          {shown.map((n) => {
            const active = n.id === activeId
            return (
              <button
                type="button"
                key={n.id}
                data-nav
                className={`dash-nav__item${active ? ' is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={n.hash ? () => pick(n) : undefined}
              >
                {n.label ? n.label(D) : D.nav[n.id]}
                {n.menu && <Icon name="chevron-down" size={16} />}
              </button>
            )
          })}
          {hidden.length > 0 && (
            <NavMore items={hidden} activeId={activeId} onPick={pick} />
          )}
          {/* Width probe for the „მეტი" trigger. In flow (so it has a width to
              read) but visually gone and out of the a11y tree. */}
          <span className="dash-nav__probe" data-nav-probe aria-hidden="true">
            {D.nav.more}
            <Icon name="chevron-down" size={16} />
          </span>
        </div>
      </nav>

      <main className="dash-main">
        <div className="dash-shell__inner dash-main__inner">{children}</div>
      </main>

      {/* Support launcher. Fixed, so it survives the page's scroll — the design
          has it hovering over the dashboard's bottom-right corner. */}
      <button type="button" className="dash-fab" aria-label={D.chat.open}>
        <Icon name="message-circle" size={26} />
      </button>
    </div>
  )
}
