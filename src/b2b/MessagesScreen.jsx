import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import Badge from '../components/Badge.jsx'
import Switch from '../components/Switch.jsx'
import { Button } from '../components/Button.jsx'
import PopoverFilter from './PopoverFilter.jsx'
import ComposeMessageDrawer from './ComposeMessageDrawer.jsx'
import AttachmentCard from './AttachmentCard.jsx'
import FilePreviewModal from './FilePreviewModal.jsx'
import ClientMark from './ClientMark.jsx'
import { ASSETS } from '../lib/assets.js'
import { kaB2B } from './strings.js'
import {
  MSG_CATEGORIES,
  CATEGORY_ICON,
  useMessages,
  visibleConversations,
  isUnread,
  markRead,
  lastMessage,
  getHiddenCats,
  toggleCategory,
  sendReply,
  ATTACH_ACCEPT,
  ATTACH_MAX_BYTES,
  fmtSize,
  fileToAttachment,
} from './data/messages.js'

/* MessagesScreen — the full მიმოწერა workspace (#/b2b/messages[/<id>]).
   Master–detail: conversation list left, thread right. This is the parked
   left-rail-inbox layout finally earning its page — the popover stays the
   glance surface, this is where reading + writing actually happens.

   Selection follows the HASH (#/b2b/messages/<id>) so popover rows, direct
   links and in-page clicks are one flow; B2BApp passes the id down and a
   hashchange re-render syncs it (hash-query changes never remount an SPA
   component — learned 2026-08-12 on the accounts demo links).

   Bubbles carry exactly TWO identities (locked): the org mark and a GPI
   mark — the author is small meta text ("did accounting already answer?"
   stays answerable without per-person avatars). Category visibility is
   per-user self-serve (⚙ under the list); hidden categories vanish from
   list, counts and dot alike, and real ACL is a stakeholder question. */

const CATEGORY_OPTIONS = ['all', ...MSG_CATEGORIES]

function ConvRow({ c, unread, active, t, onOpen }) {
  const last = lastMessage(c)
  const who = last.from === 'gpi' ? t.gpi : t.you
  const hasAtt = c.messages.some((m) => m.attachments.length > 0)
  return (
    <div className="b2b-notif__item" role="listitem">
      <button
        type="button"
        className={`b2b-notif__row is-clickable b2b-msg__lrow ${unread ? 'is-unread' : ''} ${active ? 'is-active' : ''}`}
        aria-current={active ? 'true' : undefined}
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

function Bubble({ m, t, onOpen }) {
  const isOrg = m.from === 'org'
  return (
    <div className={`b2b-msg__brow ${isOrg ? 'is-org' : 'is-gpi'}`}>
      {/* BOTH identities use the same mark component (user, 2026-08-17): the GPI side
          was a rounded-square indigo tile with text while the org side was a circle,
          so the two never matched. Now one circle, one geometry, GPI's real emblem —
          with „GPI" surviving as the fallback if the asset ever fails to load. */}
      {isOrg ? (
        <ClientMark name={kaB2B.topbar.client} logo={kaB2B.topbar.clientLogo} />
      ) : (
        <ClientMark
          name={t.gpi}
          logo={ASSETS.gpiMark}
          fallback={t.gpi}
          className="b2b-msg__mark--gpi"
        />
      )}
      <div className="b2b-msg__bubble">
        <div className="b2b-msg__bmeta">
          {m.author} · {isOrg ? kaB2B.topbar.clientShort : t.gpi} · {m.time}
        </div>
        <div className="b2b-msg__btext">{m.text}</div>
        {m.attachments.length > 0 && (
          <div className="b2b-msg__batts">
            {m.attachments.map((a) => (
              <AttachmentCard key={a.name} a={a} onOpen={onOpen} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MessagesScreen({ activeId = null }) {
  const t = kaB2B.msgs
  const cats = kaB2B.notif.categories
  useMessages()

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [category, setCategory] = useState('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const [catsOpen, setCatsOpen] = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)
  const [preview, setPreview] = useState(null) // attachment being previewed
  const [reply, setReply] = useState('')
  const [replyFiles, setReplyFiles] = useState([])
  const [replyErr, setReplyErr] = useState(null)
  const menuRef = useRef(null)
  const catsRef = useRef(null)
  const threadRef = useRef(null)
  const fileRef = useRef(null)
  const replyRef = useRef(null)

  const hidden = getHiddenCats()
  const convs = visibleConversations()
  const conv = convs.find((c) => c.id === activeId) || null

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return convs
      .filter((c) => category === 'all' || c.category === category)
      .filter((c) => filter === 'all' || isUnread(c))
      .filter((c) => !q || c.subject.toLowerCase().includes(q))
  }, [convs, category, filter, query])

  const unreadByCat = useMemo(() => {
    const m = {}
    for (const c of convs) if (isUnread(c)) m[c.category] = (m[c.category] || 0) + 1
    return m
  }, [convs])
  const unreadTotal = convs.filter(isUnread).length
  const shownCats = MSG_CATEGORIES.length - hidden.size
  const activeCount = (filter !== 'all' ? 1 : 0) + (category !== 'all' ? 1 : 0)

  /* Opening a thread reads it (per-user). Reply draft resets per thread. */
  useEffect(() => {
    if (conv) markRead(conv.id)
    setReply('')
    setReplyFiles([])
    setReplyErr(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  /* No empty thread pane (user, 2026-08-17): with nothing selected — first load,
     or the open thread's category just got hidden — open the FIRST visible
     conversation instead. `location.replace`, NOT a hash assignment: pushing a
     history entry would let Back land on the selection-less URL, which would
     immediately re-open the first thread again — a Back-button trap. The empty
     state survives for the one case with nothing to open (0 visible rows). */
  useEffect(() => {
    if (conv || shown.length === 0) return
    window.location.replace(`#/b2b/messages/${shown[0].id}`)
  }, [conv, shown])

  /* Keep the newest message in view — on open and after sending. */
  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [activeId, conv?.messages.length])

  /* Composer autosize. The field is a one-line control at rest so the row reads
     as one 40px rhythm with the attach + send buttons, then grows with the draft
     (CSS caps it at 5 lines, after which it scrolls). Reset to auto first, or
     scrollHeight can only ever grow; border is added back because .gpi-input is
     border-box and scrollHeight excludes it. */
  useEffect(() => {
    const el = replyRef.current
    if (!el) return
    el.style.height = 'auto'
    const cs = getComputedStyle(el)
    const border = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)
    el.style.height = `${el.scrollHeight + border}px`
  }, [reply, activeId])

  /* Close the ⚙ category popover on Esc / outside press. */
  useEffect(() => {
    if (!catsOpen) return
    const onKey = (e) => e.key === 'Escape' && setCatsOpen(false)
    const onDown = (e) => {
      if (catsRef.current && !catsRef.current.contains(e.target)) setCatsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [catsOpen])

  /* PopoverFilter's outside-press close (the component leaves this to us). */
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const openConv = (c) => {
    window.location.hash = `#/b2b/messages/${c.id}`
  }

  const addReplyFile = (f) => {
    const okExt = ATTACH_ACCEPT.split(',').some((a) => f.name.toLowerCase().endsWith(a.trim()))
    if (!okExt) return setReplyErr(t.compose_.attachTypeErr)
    if (f.size > ATTACH_MAX_BYTES) return setReplyErr(t.compose_.attachSizeErr)
    setReplyErr(null)
    setReplyFiles((fs) => [...fs, f])
  }

  const submitReply = () => {
    if (!reply.trim() && replyFiles.length === 0) return
    sendReply(conv.id, reply.trim(), replyFiles.map(fileToAttachment))
    setReply('')
    setReplyFiles([])
    setReplyErr(null)
  }

  return (
    <>
      <div className="b2b-page__head">
        <div>
          <h1 className="b2b-page__title">{t.title}</h1>
          <div className="b2b-page__subtitle">{t.subtitle(convs.length)}</div>
        </div>
        {/* Compose lives in the page head (user, 2026-08-15) — the standard
            page-CTA slot, out of the list pane's way. */}
        <Button variant="primary" size="md" leadingIcon="plus" onClick={() => setComposeOpen(true)}>
          {t.compose}
        </Button>
      </div>

      <div className="b2b-msgpage">
        {/* ---- list pane ---- */}
        <div className="b2b-msgpage__list">
          <div className="b2b-msgpage__tools">
            <div className="b2b-msgpage__search">
              <Icon name="search" size={16} />
              <input
                value={query}
                placeholder={t.search}
                aria-label={t.search}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  type="button"
                  className="b2b-msgpage__searchx"
                  aria-label={t.searchClear}
                  onClick={() => setQuery('')}
                >
                  <Icon name="x" size={16} />
                </button>
              )}
            </div>
            <PopoverFilter
              open={menuOpen}
              onToggle={() => setMenuOpen((v) => !v)}
              anchorRef={menuRef}
              activeCount={activeCount}
              menuLabel={t.filterLabel}
              iconOnly
              align="right"
              groups={[
                {
                  label: t.statusLabel,
                  options: [
                    { id: 'all', label: t.filterAll, selected: filter === 'all', onPick: () => setFilter('all') },
                    { id: 'unread', label: t.filterUnread, count: unreadTotal, selected: filter === 'unread', onPick: () => setFilter('unread') },
                  ],
                },
                {
                  label: t.categoryLabel,
                  options: CATEGORY_OPTIONS.filter((c) => c === 'all' || !hidden.has(c)).map((c) => ({
                    id: c,
                    label: c === 'all' ? t.categoryAll : cats[c],
                    count: c === 'all' ? 0 : unreadByCat[c] || 0,
                    selected: category === c,
                    onPick: () => setCategory(c),
                  })),
                },
              ]}
            />
          </div>

          <div className="b2b-msgpage__rows" role="list">
            {shown.map((c) => (
              <ConvRow
                key={c.id}
                c={c}
                unread={isUnread(c)}
                active={c.id === activeId}
                t={t}
                onOpen={openConv}
              />
            ))}
            {shown.length === 0 && (
              <div className="b2b-notif__empty">
                <Icon name="mail" size={20} />
                <div>{convs.length === 0 ? t.emptyList : t.emptyFilter}</div>
                <div className="b2b-msgpage__emptyhint">
                  {convs.length === 0 ? t.emptyListHint : ''}
                </div>
              </div>
            )}
          </div>

          <div className="b2b-msgpage__foot" ref={catsRef}>
            <button
              type="button"
              className="b2b-msgpage__cats"
              aria-expanded={catsOpen}
              aria-haspopup="dialog"
              onClick={() => setCatsOpen((v) => !v)}
            >
              <Icon name="settings" size={16} />
              <span>{t.catSettings}</span>
              <span className="b2b-msgpage__catcount">
                <span aria-hidden="true">{t.catCount(shownCats, MSG_CATEGORIES.length)}</span>
                <span className="gpi-sr-only">{t.catCountLabel(shownCats, MSG_CATEGORIES.length)}</span>
              </span>
            </button>
            {catsOpen && (
              <div className="b2b-msgpage__catspop" role="dialog" aria-label={t.catSettings}>
                <div className="b2b-msgpage__catshint">{t.catSettingsHint}</div>
                {/* Switches, not checkboxes: each flip applies IMMEDIATELY (there is no
                    Apply button here), and the system's rule is Switch = instant save,
                    Checkbox = submitted choice. Control sits LEFT of the label — the
                    interface-wide rule for toggles (user, 2026-08-17). */}
                {MSG_CATEGORIES.map((c) => (
                  <Switch
                    key={c}
                    name={`cat-${c}`}
                    label={cats[c]}
                    checked={!hidden.has(c)}
                    onChange={() => toggleCategory(c)}
                  />
                ))}
                <div className="b2b-msgpage__catsnote">{t.catHiddenNote}</div>
              </div>
            )}
          </div>
        </div>

        {/* ---- thread pane ---- */}
        <div className="b2b-msgpage__thread">
          {conv ? (
            <>
              <div className="b2b-msgpage__threadhead">
                <div className="b2b-msgpage__threadtitle">
                  <h2>{conv.subject}</h2>
                  {/* Category only. The waiting/answered status badge was removed
                      (user, 2026-08-17): it restated what the last bubble and the
                      list row's „GPI · …" / „თქვენ · …" meta already say. */}
                  <div className="b2b-msgpage__threadbadges">
                    <Badge color="neutral" size="sm">
                      {cats[conv.category]}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="b2b-msgpage__bubbles" ref={threadRef}>
                {conv.messages.map((m) => (
                  <Bubble key={m.id} m={m} t={t} onOpen={setPreview} />
                ))}
              </div>

              <div className="b2b-msgpage__composer">
                {replyFiles.length > 0 && (
                  <ul className="b2b-msg__attlist">
                    {replyFiles.map((f, i) => (
                      <li key={`${f.name}-${i}`} className="b2b-msg__att">
                        <Icon name={/\.(mp4|mov)$/i.test(f.name) ? 'video' : 'file-text'} size={16} />
                        <span className="b2b-msg__attname">{f.name}</span>
                        <span className="b2b-msg__attsize">{fmtSize(f.size)}</span>
                        <button
                          type="button"
                          className="b2b-msg__attx"
                          aria-label={t.removeAttachment(f.name)}
                          onClick={() => setReplyFiles((fs) => fs.filter((_, j) => j !== i))}
                        >
                          <Icon name="x" size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {replyErr && (
                  <div className="b2b-msgpage__replyerr" role="alert">
                    {replyErr}
                  </div>
                )}
                <div className="b2b-msgpage__composerrow">
                  <input
                    ref={fileRef}
                    type="file"
                    className="gpi-sr-only"
                    accept={ATTACH_ACCEPT}
                    aria-label={t.attach}
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      e.target.value = ''
                      if (f) addReplyFile(f)
                    }}
                  />
                  <button
                    type="button"
                    className="b2b-msgpage__attachbtn"
                    aria-label={t.attach}
                    title={t.attach}
                    onClick={() => fileRef.current?.click()}
                  >
                    <Icon name="paperclip" size={20} />
                  </button>
                  <textarea
                    ref={replyRef}
                    className="gpi-input b2b-msgpage__replybox"
                    value={reply}
                    placeholder={t.msgPlaceholder}
                    aria-label={t.replyLabel}
                    rows={1}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <Button
                    variant="primary"
                    size="md"
                    leadingIcon="send"
                    onClick={submitReply}
                    disabled={!reply.trim() && replyFiles.length === 0}
                  >
                    {t.send}
                  </Button>
                </div>
              </div>
            </>
          ) : shown.length === 0 ? (
            /* Only reachable with nothing TO open — search, filters or hidden
               categories leaving 0 rows. With rows present the effect above has
               already opened the first one, so render nothing for that frame
               rather than flashing this state. */
            <div className="b2b-msgpage__noconv">
              <Icon name="mail" size={24} />
              <div className="b2b-msgpage__noconvtitle">{t.emptyThread}</div>
              <button type="button" className="gpi-link" onClick={() => setComposeOpen(true)}>
                {t.emptyThreadHint}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {composeOpen && (
        <ComposeMessageDrawer
          onClose={() => setComposeOpen(false)}
          onSent={(id) => {
            setComposeOpen(false)
            window.location.hash = `#/b2b/messages/${id}`
          }}
        />
      )}

      {preview && <FilePreviewModal a={preview} onClose={() => setPreview(null)} />}
    </>
  )
}
