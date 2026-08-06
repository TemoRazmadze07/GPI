import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import Badge from '../components/Badge.jsx'
import { kaB2B } from './strings.js'
import { NOTIFICATIONS, NOTIF_CATEGORIES, CATEGORY_ICON } from './data/notifications.js'

/* NotificationsBell — topbar bell + notification popover (concept locked in
   chat, 2026-08-06). A notification is a doorway, not a message: rows with a
   `target` deep-link there (click = mark read + close + navigate); rows
   without one are honestly inert — no hover, no chevron, no pointer.
   Bell dot semantics mirror the sidebar rule: red = unread action-required,
   gray = unread info, none = clean. Opening the panel does NOT clear the dot —
   only reading does (auto-clear on open would silently dismiss an unconfirmed
   claim). Read state is session-only by design (prototype). */

/* "all" + every category, in filter-menu order. */
const CATEGORY_OPTIONS = ['all', ...NOTIF_CATEGORIES]

/* One radio-style row of the filter menu. Trailing slot: check when selected,
   otherwise the unread count (the menu's triage signal) when > 0. */
function FilterOption({ selected, label, count = 0, onPick }) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      className={`b2b-notif__fopt ${selected ? 'is-sel' : ''}`}
      onClick={onPick}
    >
      <span className="b2b-notif__foptlabel">{label}</span>
      {selected ? (
        <Icon name="check" size={16} />
      ) : (
        count > 0 && <span className="b2b-notif__foptcount">{count}</span>
      )}
    </button>
  )
}

/* Row anatomy (hierarchy pass, 2026-08-06): title is ONE style regardless of
   read state; the optional meta line carries context only, never the
   category (the title already names it); time is the fixed
   top-right anchor and the ONLY thing on the right — no hover chevron, so
   row geometry never shifts (affordance = bg step + pointer, as in every
   desktop notification list). Unread = dot pinned to the tile corner (same
   grammar as the bell) + row tint; read rows change NOTHING else. */
function Row({ n, unread, t, onOpen }) {
  const clickable = !!n.target
  /* Meta = the detail ONLY. The category is deliberately NOT repeated here:
     a descriptive title ("ინვოისი INV-… ვადაგადაცილებულია") already says it,
     and the tile icon carries it visually. Rows with no extra context simply
     have no second line. */
  const meta = n.detail
  const body = (
    <>
      <span className="b2b-notif__tilewrap">
        <span className="b2b-notif__tile" aria-hidden="true">
          <Icon name={n.icon || CATEGORY_ICON[n.category]} size={16} />
        </span>
        {unread && (
          <span className="b2b-notif__dot">
            <span className="gpi-sr-only">{t.unreadMark}</span>
          </span>
        )}
      </span>
      <span className="b2b-notif__content">
        <span className="b2b-notif__rowtitle">{n.title}</span>
        {meta && <span className="b2b-notif__meta">{meta}</span>}
        {n.chip && (
          <span className="b2b-notif__chip">
            <Badge color={n.chip === 'action' ? 'error' : 'warning'} size="sm">
              {t.chips[n.chip]}
            </Badge>
          </span>
        )}
      </span>
      <span className="b2b-notif__time">{n.time}</span>
    </>
  )

  /* listitem lives on a WRAPPER, never on the button — putting it on the
     button itself overrides the implicit button role, so assistive tech stops
     announcing the row as actionable. */
  return (
    <div className="b2b-notif__item" role="listitem">
      {clickable ? (
        <button
          type="button"
          className={`b2b-notif__row is-clickable ${unread ? 'is-unread' : ''}`}
          onClick={() => onOpen(n)}
        >
          {body}
        </button>
      ) : (
        <div className={`b2b-notif__row is-inert ${unread ? 'is-unread' : ''}`}>{body}</div>
      )}
    </div>
  )
}

export default function NotificationsBell() {
  const t = kaB2B.notif
  const [open, setOpen] = useState(false)
  const [readIds, setReadIds] = useState(() => new Set())
  const [filter, setFilter] = useState('all') // 'all' | 'unread'
  const [category, setCategory] = useState('all') // 'all' | category id
  const [menuOpen, setMenuOpen] = useState(false)
  const rootRef = useRef(null)
  const bellRef = useRef(null)
  const menuRef = useRef(null)
  const listRef = useRef(null)

  const isUnread = (n) => n.unread && !readIds.has(n.id)
  const unreadCount = NOTIFICATIONS.filter(isUnread).length
  const urgentUnread = NOTIFICATIONS.some((n) => isUnread(n) && n.chip === 'action')
  /* Unread per category — shown as trailing counts in the filter menu, the
     popover's version of the archive-page rail's triage counts. */
  const unreadByCat = useMemo(() => {
    const m = {}
    for (const n of NOTIFICATIONS) {
      if (n.unread && !readIds.has(n.id)) m[n.category] = (m[n.category] || 0) + 1
    }
    return m
  }, [readIds])
  const activeCount = (filter !== 'all' ? 1 : 0) + (category !== 'all' ? 1 : 0)

  const visible = useMemo(
    () =>
      NOTIFICATIONS.filter((n) => category === 'all' || n.category === category).filter(
        (n) => filter === 'all' || isUnread(n)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, filter, readIds]
  )

  /* Esc closes the filter menu first, then the popover (focus back to the
     bell). Outside press: off the popover closes everything; inside the
     popover but off the filter anchor closes just the menu. */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (menuOpen) {
        setMenuOpen(false)
        return
      }
      setOpen(false)
      bellRef.current?.focus()
    }
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
        setMenuOpen(false)
      } else if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [open, menuOpen])

  /* Filters reset on every open: the bell dot reflects the WHOLE inbox, so the
     panel must never reopen pre-narrowed to a stale category and look empty. */
  const toggleOpen = () => {
    setMenuOpen(false)
    setOpen((v) => {
      if (!v) {
        setFilter('all')
        setCategory('all')
      }
      return !v
    })
  }
  const markAll = () => setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)))
  const openNotif = (n) => {
    setReadIds((prev) => new Set(prev).add(n.id))
    setOpen(false)
    window.location.hash = n.target
  }
  const clearFilters = () => {
    setCategory('all')
    setFilter('all')
  }

  /* Roving arrow keys over the clickable rows (inert rows aren't focusable). */
  const onListKey = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const rows = [...(listRef.current?.querySelectorAll('button.b2b-notif__row') || [])]
    if (!rows.length) return
    e.preventDefault()
    const i = rows.indexOf(document.activeElement)
    const next = e.key === 'ArrowDown' ? Math.min(i + 1, rows.length - 1) : Math.max(i - 1, 0)
    rows[next].focus()
  }

  let empty = null
  if (!visible.length) {
    if (filter === 'unread' && category === 'all') empty = 'unread'
    else empty = 'filter'
  }

  return (
    <div className="b2b-notif" ref={rootRef}>
      <button
        ref={bellRef}
        className="b2b-topbtn"
        aria-label={unreadCount ? t.bellUnread(unreadCount) : t.title}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={toggleOpen}
      >
        <Icon name="bell" size={20} />
        {unreadCount > 0 && (
          <span className={`b2b-topbtn__dot ${urgentUnread ? '' : 'b2b-topbtn__dot--muted'}`} />
        )}
      </button>

      {open && (
        <div className="b2b-notif__popover" role="dialog" aria-label={t.title}>
          <div className="b2b-notif__head">
            <span className="b2b-notif__title">{t.title}</span>
            {unreadCount > 0 && (
              <button type="button" className="b2b-notif__markall" onClick={markAll}>
                {t.markAll}
              </button>
            )}
          </div>

          {/* Toolbar = the table FilterBar grammar (user, 2026-08-06): trigger
              LEFT, applied chips flow after it on the same row. One menu holds
              both filter groups, applies LIVE (a 9-row list needs no staged
              apply) and STAYS OPEN so status + category are one visit. Trigger,
              count bubble and chips reuse the FilterBar/​fchip classes 1:1. */}
          <div className="b2b-notif__toolbar" role="group" aria-label={t.filterLabel}>
            <span className="b2b-notif__fanchor" ref={menuRef}>
              <button
                type="button"
                className={`gpi-btn gpi-btn--secondary gpi-btn--sm gpi-filterbar__btn${activeCount ? ' has-active' : ''}`}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <Icon name="filter" size={16} />
                <span>{kaB2B.filterBar.filter}</span>
                {activeCount > 0 && <span className="gpi-filterbar__count">{activeCount}</span>}
                <Icon name={menuOpen ? 'chevron-up' : 'chevron-down'} size={16} />
              </button>
              {menuOpen && (
                <div className="b2b-notif__fmenu" role="menu" aria-label={t.filterLabel}>
                  <div className="b2b-notif__fgroup">{t.statusLabel}</div>
                  <FilterOption
                    selected={filter === 'all'}
                    label={t.filterAll}
                    onPick={() => setFilter('all')}
                  />
                  <FilterOption
                    selected={filter === 'unread'}
                    label={t.filterUnread}
                    count={unreadCount}
                    onPick={() => setFilter('unread')}
                  />
                  <div className="b2b-notif__fgroup b2b-notif__fgroup--divided">
                    {t.categoryLabel}
                  </div>
                  {CATEGORY_OPTIONS.map((c) => (
                    <FilterOption
                      key={c}
                      selected={category === c}
                      label={c === 'all' ? t.categoryAll : t.categories[c]}
                      count={c === 'all' ? 0 : unreadByCat[c] || 0}
                      onPick={() => setCategory(c)}
                    />
                  ))}
                </div>
              )}
            </span>
            {filter !== 'all' && (
              <span className="gpi-fchip">
                {t.filterUnread}
                <button
                  type="button"
                  className="gpi-fchip__x"
                  aria-label={`${kaB2B.filterBar.remove} — ${t.filterUnread}`}
                  onClick={() => setFilter('all')}
                >
                  <Icon name="x" size={16} />
                </button>
              </span>
            )}
            {category !== 'all' && (
              <span className="gpi-fchip">
                {t.categories[category]}
                <button
                  type="button"
                  className="gpi-fchip__x"
                  aria-label={`${kaB2B.filterBar.remove} — ${t.categories[category]}`}
                  onClick={() => setCategory('all')}
                >
                  <Icon name="x" size={16} />
                </button>
              </span>
            )}
          </div>

          <div className="b2b-notif__list" role="list" ref={listRef} onKeyDown={onListKey}>
            {visible.map((n) => (
              <Row key={n.id} n={n} unread={isUnread(n)} t={t} onOpen={openNotif} />
            ))}
            {empty === 'unread' && (
              <div className="b2b-notif__empty">
                <Icon name="check" size={20} className="b2b-notif__empty-ok" />
                <div>{t.emptyUnread}</div>
              </div>
            )}
            {empty === 'filter' && (
              <div className="b2b-notif__empty">
                <Icon name="bell" size={20} />
                <div>{t.emptyFilter}</div>
                <button type="button" className="b2b-notif__clear" onClick={clearFilters}>
                  {t.clearFilter}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
