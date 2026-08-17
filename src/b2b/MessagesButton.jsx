import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import PopoverFilter from './PopoverFilter.jsx'
import ComposeMessageDrawer from './ComposeMessageDrawer.jsx'
import { kaB2B } from './strings.js'
import {
  MSG_CATEGORIES,
  CATEGORY_ICON,
  useMessages,
  visibleConversations,
  isUnread,
  unreadCount,
  markRead,
  lastMessage,
} from './data/messages.js'

/* MessagesButton — topbar mail icon + conversations popover (concept locked
   in chat, 2026-08-15). Sits LEFT of the bell; same popover grammar as the
   notification center (shared list/row classes — see b2b.css provenance
   note) but rows are org↔GPI CONVERSATIONS, so every row is a doorway to the
   thread on the full page. Unlike the bell, messaging has a full page from
   day one — composing and attachments don't fit a 400px panel.
   Dot = plain unread (no urgency tiers: a reply from GPI is exactly the
   thing the icon exists to surface). Read state is per-user, session-only. */

const CATEGORY_OPTIONS = ['all', ...MSG_CATEGORIES]

function Row({ c, unread, t, onOpen }) {
  const last = lastMessage(c)
  const who = last.from === 'gpi' ? t.gpi : t.you
  const hasAtt = c.messages.some((m) => m.attachments.length > 0)
  return (
    <div className="b2b-notif__item" role="listitem">
      <button
        type="button"
        className={`b2b-notif__row is-clickable ${unread ? 'is-unread' : ''}`}
        onClick={() => onOpen(c)}
      >
        <span className="b2b-notif__tilewrap">
          <span className="b2b-notif__tile" aria-hidden="true">
            <Icon name={CATEGORY_ICON[c.category]} size={16} />
          </span>
          {unread && (
            <span className="b2b-notif__dot">
              <span className="gpi-sr-only">{t.unreadMark}</span>
            </span>
          )}
        </span>
        <span className="b2b-notif__content">
          <span className="b2b-notif__rowtitle">{c.subject}</span>
          <span className="b2b-notif__meta b2b-msg__snippet">
            {who} · {last.text}
          </span>
        </span>
        <span className="b2b-msg__side">
          <span className="b2b-notif__time">{last.time}</span>
          {hasAtt && (
            <span className="b2b-msg__attmark" title={t.attachedMark}>
              <Icon name="paperclip" size={16} />
              <span className="gpi-sr-only">{t.attachedMark}</span>
            </span>
          )}
        </span>
      </button>
    </div>
  )
}

export default function MessagesButton() {
  const t = kaB2B.msgs
  const cats = kaB2B.notif.categories
  useMessages()
  const [open, setOpen] = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [category, setCategory] = useState('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const rootRef = useRef(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  const unread = unreadCount()
  const convs = visibleConversations()
  const unreadByCat = useMemo(() => {
    const m = {}
    for (const c of convs) if (isUnread(c)) m[c.category] = (m[c.category] || 0) + 1
    return m
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convs])
  const activeCount = (filter !== 'all' ? 1 : 0) + (category !== 'all' ? 1 : 0)

  const shown = convs
    .filter((c) => category === 'all' || c.category === category)
    .filter((c) => filter === 'all' || isUnread(c))

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (menuOpen) {
        setMenuOpen(false)
        return
      }
      setOpen(false)
      btnRef.current?.focus()
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

  /* Filters reset on every open — same rule as the bell: the dot reflects the
     WHOLE inbox, so the panel must never reopen pre-narrowed and look empty. */
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

  const openConv = (c) => {
    markRead(c.id)
    setOpen(false)
    window.location.hash = `#/b2b/messages/${c.id}`
  }
  const clearFilters = () => {
    setFilter('all')
    setCategory('all')
  }

  let empty = null
  if (!shown.length) empty = filter === 'unread' && category === 'all' ? 'unread' : 'filter'

  return (
    <div className="b2b-notif b2b-msg" ref={rootRef}>
      <button
        ref={btnRef}
        className="b2b-topbtn"
        aria-label={unread ? t.iconUnread(unread) : t.title}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={toggleOpen}
      >
        <Icon name="mail" size={20} />
        {unread > 0 && <span className="b2b-topbtn__dot" />}
      </button>

      {open && (
        <div className="b2b-notif__popover" role="dialog" aria-label={t.title}>
          <div className="b2b-notif__head">
            <span className="b2b-notif__title">{t.title}</span>
            <button
              type="button"
              className="b2b-notif__markall"
              onClick={() => {
                setOpen(false)
                setComposeOpen(true)
              }}
            >
              + {t.compose}
            </button>
          </div>

          <div className="b2b-notif__toolbar" role="group" aria-label={t.filterLabel}>
            <PopoverFilter
              open={menuOpen}
              onToggle={() => setMenuOpen((v) => !v)}
              anchorRef={menuRef}
              activeCount={activeCount}
              menuLabel={t.filterLabel}
              groups={[
                {
                  label: t.statusLabel,
                  options: [
                    { id: 'all', label: t.filterAll, selected: filter === 'all', onPick: () => setFilter('all') },
                    { id: 'unread', label: t.filterUnread, count: unread, selected: filter === 'unread', onPick: () => setFilter('unread') },
                  ],
                },
                {
                  label: t.categoryLabel,
                  options: CATEGORY_OPTIONS.map((c) => ({
                    id: c,
                    label: c === 'all' ? t.categoryAll : cats[c],
                    count: c === 'all' ? 0 : unreadByCat[c] || 0,
                    selected: category === c,
                    onPick: () => setCategory(c),
                  })),
                },
              ]}
            />
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
                {cats[category]}
                <button
                  type="button"
                  className="gpi-fchip__x"
                  aria-label={`${kaB2B.filterBar.remove} — ${cats[category]}`}
                  onClick={() => setCategory('all')}
                >
                  <Icon name="x" size={16} />
                </button>
              </span>
            )}
          </div>

          <div className="b2b-notif__list" role="list">
            {shown.map((c) => (
              <Row key={c.id} c={c} unread={isUnread(c)} t={t} onOpen={openConv} />
            ))}
            {empty === 'unread' && (
              <div className="b2b-notif__empty">
                <Icon name="check" size={20} className="b2b-notif__empty-ok" />
                <div>{t.emptyUnread}</div>
              </div>
            )}
            {empty === 'filter' && (
              <div className="b2b-notif__empty">
                <Icon name="mail" size={20} />
                <div>{t.emptyFilter}</div>
                <button type="button" className="b2b-notif__clear" onClick={clearFilters}>
                  {t.clearFilter}
                </button>
              </div>
            )}
          </div>

          <div className="b2b-msg__foot">
            <a className="b2b-msg__viewall" href="#/b2b/messages" onClick={() => setOpen(false)}>
              {t.viewAll}
              <Icon name="arrow-right" size={16} />
            </a>
          </div>
        </div>
      )}

      {composeOpen && (
        <ComposeMessageDrawer
          onClose={() => setComposeOpen(false)}
          onSent={(id) => {
            setComposeOpen(false)
            window.location.hash = `#/b2b/messages/${id}`
          }}
        />
      )}
    </div>
  )
}
