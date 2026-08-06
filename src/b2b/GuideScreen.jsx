import { useState } from 'react'
import ActionMenu from '../components/ActionMenu.jsx'
import Avatar from '../components/Avatar.jsx'
import Badge from '../components/Badge.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { Button } from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import DataTable from '../components/DataTable.jsx'
import SearchField from '../components/SearchField.jsx'
import StatTile from '../components/StatTile.jsx'
import Tabs from '../components/Tabs.jsx'
import Icon from '../lib/Icon.jsx'
import Pagination from '../components/Pagination.jsx'
import SendMaterialDrawer from './SendMaterialDrawer.jsx'
import { kaB2B } from './strings.js'
import { VIDEOS, FAQS, HANDBOOKS, KIT, QUESTIONS, GUIDE_STATS, SEND_HISTORY } from './data/guide.js'

/* GuideScreen — the employee-education hub (გზამკვლევი), concept locked in
   chat 2026-08-06. The admin's three real jobs shape the page top-to-bottom:
   1. onboard new hires   → the kit card (the page's ONE primary CTA);
   2. find-and-send       → GLOBAL search over all material types (a query
                            bypasses the tabs — the admin knows the topic, not
                            whether the answer is a video, FAQ or PDF);
   3. minimal monitoring  → exactly two actionable StatTiles (engagement % for
                            reporting, open questions = work in flight) — the
                            rest lives in the deferred engagement report.
   Every "გაგზავნა" opens the ONE shared SendMaterialDrawer; the send log below
   absorbs the team prototype's separate "მოთხოვნილი SMS" page. */

const FLAG_BADGE = { top: 'brand', new: 'info' }
const HISTORY_PAGE_SIZE = 10
/* Scroll targets for "მასალის ნახვა". Ids (not refs) because the shared Card
   is a plain function component — React 18 would drop a ref on it. */
const KIT_ID = 'b2b-guide-kit'
const LIB_ID = 'b2b-guide-library'

export default function GuideScreen() {
  const t = kaB2B
  const g = t.guide
  const [tab, setTab] = useState('videos')
  const [q, setQ] = useState('')
  const [openFaq, setOpenFaq] = useState(null)
  const [send, setSend] = useState(null)
  /* Session-only, like notification read-state: a new send prepends a row. */
  const [history, setHistory] = useState(SEND_HISTORY)
  /* Newest first by default — a log's natural order. Only the date sorts;
     material/recipient are identifiers (user rule 2026-07-16). */
  const [histSort, setHistSort] = useState({ key: 'date', dir: 'desc' })
  const [histPage, setHistPage] = useState(1)

  const pending = QUESTIONS.filter((x) => x.status === 'pending')

  const query = q.trim().toLowerCase()
  const hit = (s) => s.toLowerCase().includes(query)
  const results = query
    ? [
        ...VIDEOS.filter((v) => hit(v.title)).map((v) => ({ type: 'video', id: v.id, title: v.title, meta: v.dur })),
        ...FAQS.filter((f) => hit(f.q) || hit(f.a)).map((f) => ({ type: 'faq', id: f.id, title: f.q })),
        ...HANDBOOKS.filter((h) => hit(h.title)).map((h) => ({ type: 'handbook', id: h.id, title: h.title, meta: `PDF · ${h.size}` })),
      ]
    : null

  const sendMaterial = (type, title) => setSend({ type, title })
  const onSent = (entry) => setHistory((h) => [entry, ...h])

  /* "მასალის ნახვა" from a log row: the kit lives in its own card, everything
     else in the library — so seed the global search with the title. The single
     result IS the answer, and it works whatever type the material is (a tab
     switch would only say "somewhere in this list"). */
  const viewMaterial = (r) => {
    if (r.type === 'kit') {
      document.getElementById(KIT_ID)?.scrollIntoView({ block: 'center' })
      return
    }
    setQ(r.material)
    document.getElementById(LIB_ID)?.scrollIntoView({ block: 'start' })
  }

  const sortedHistory = [...history].sort((a, b) => {
    const d = String(a.sentAt || '').localeCompare(String(b.sentAt || ''))
    return histSort.dir === 'asc' ? d : -d
  })
  const histPages = Math.max(1, Math.ceil(sortedHistory.length / HISTORY_PAGE_SIZE))
  const histRows = sortedHistory.slice((histPage - 1) * HISTORY_PAGE_SIZE, histPage * HISTORY_PAGE_SIZE)
  const onHistSort = (key) => {
    setHistSort((s) => ({ key, dir: s.dir === 'desc' ? 'asc' : 'desc' }))
    setHistPage(1)
  }

  const historyCols = [
    { key: 'date', header: g.history.cols.date, width: 110, sortable: true, render: (r) => r.date },
    {
      key: 'material',
      header: g.history.cols.material,
      rowHeader: true,
      render: (r) => (
        <span className="gpi-table__stack">
          <span>{r.material}</span>
          <span className="gpi-table__sub">{g.library.types[r.type]}</span>
        </span>
      ),
    },
    {
      key: 'to',
      header: g.history.cols.to,
      width: 220,
      render: (r) => (
        <span className="gpi-table__stack">
          <span>{r.to}</span>
          <span className="gpi-table__sub">{g.history.people(r.count)}</span>
        </span>
      ),
    },
    {
      key: 'channel',
      header: g.history.cols.channel,
      width: 130,
      render: (r) => (
        <span className="b2b-guide__chan">
          <Icon name={r.channel === 'email' ? 'mail' : 'smartphone'} size={16} />
          {g.send.channels[r.channel]}
        </span>
      ),
    },
    {
      key: 'status',
      header: g.history.cols.status,
      width: 150,
      render: () => (
        <Badge color="success" dot>
          {g.history.delivered}
        </Badge>
      ),
    },
    /* Row actions live in the kebab, the established row-action pattern.
       Resending is the real job here — new hires join, the same kit goes out
       again — and it reuses the send drawer, so its "already sent to this
       group" warning fires for free. There is deliberately NO row click →
       drawer: every field is already on the row, so a detail panel would just
       repeat it. Revisit if per-send engagement or the recipient list lands. */
    {
      key: 'actions',
      header: '',
      width: 64,
      align: 'right',
      render: (r) => (
        <ActionMenu
          label={g.history.actions.menu}
          items={[
            { id: 'resend', label: g.history.actions.resend, onSelect: () => sendMaterial(r.type, r.material) },
            { id: 'view', label: g.history.actions.viewMaterial, onSelect: () => viewMaterial(r) },
          ]}
        />
      ),
    },
  ]

  const itemActions = (type, title, primaryLabel) => (
    <div className="b2b-guide__acts">
      <Button variant="tertiary" size="sm">
        {primaryLabel}
      </Button>
      <Button variant="secondary" size="sm" onClick={() => sendMaterial(type, title)} aria-label={g.library.sendTo(title)}>
        {g.library.send}
      </Button>
    </div>
  )

  return (
    <>
      <Breadcrumbs items={[]} current={g.title} label={t.crumbsLabel} />
      <div className="b2b-page__head">
        <div>
          <h1 className="b2b-page__title">{g.title}</h1>
          <div className="b2b-page__subtitle">{g.subtitle}</div>
        </div>
        <Button variant="secondary" size="md" leadingIcon="activity">
          {g.report}
        </Button>
      </div>

      <div className="b2b-guide__stats">
        <StatTile
          label={g.stats.engagement}
          value={`${GUIDE_STATS.pct}%`}
          meta={g.stats.engagementMeta(GUIDE_STATS.active, GUIDE_STATS.total)}
        />
        <StatTile
          tone={pending.length ? 'warning' : 'success'}
          icon={pending.length ? 'message-circle' : undefined}
          label={g.stats.openQ}
          value={pending.length}
          meta={pending.length ? g.stats.openQMeta : g.stats.allAnswered}
        />
      </div>

      <div className="b2b-guide__row">
        <Card className="b2b-guide__kit" id={KIT_ID}>
          <h2 className="b2b-guide__h">{g.kit.title}</h2>
          <p className="b2b-guide__lead">{g.kit.lead}</p>
          <ul className="b2b-guide__kitlist">
            {KIT.items.map((item) => (
              <li key={item}>
                <Icon name="check" size={16} />
                {item}
              </li>
            ))}
          </ul>
          <div className="b2b-guide__kitfoot">
            <Button variant="primary" size="md" onClick={() => sendMaterial('kit', g.kit.title)}>
              {g.kit.send}
            </Button>
            <span className="b2b-guide__kitmeta">{g.kit.lastSent(KIT.lastSent.date, KIT.lastSent.count)}</span>
          </div>
        </Card>

        {/* STATUS-ONLY on purpose: who ANSWERS (GPI vs HR) is an open
            stakeholder question — no composer until that's settled. */}
        <Card className="b2b-guide__qs">
          <h2 className="b2b-guide__h">{g.questions.title}</h2>
          <ul className="b2b-guide__qlist">
            {QUESTIONS.map((x) => (
              <li key={x.id} className="b2b-guide__q">
                <Avatar name={x.name} size={32} />
                <div className="b2b-guide__q-main">
                  <div className="b2b-guide__q-top">
                    <span className="b2b-guide__q-name">{x.name}</span>
                    <span className="b2b-guide__q-when">
                      {x.when} · {x.source}
                    </span>
                  </div>
                  <p className="b2b-guide__q-text">{x.text}</p>
                </div>
                <Badge color={x.status === 'pending' ? 'warning' : 'success'} size="sm">
                  {x.status === 'pending' ? g.questions.pending : g.questions.answered}
                </Badge>
              </li>
            ))}
          </ul>
          <p className="b2b-guide__q-note">{g.questions.note}</p>
        </Card>
      </div>

      <Card className="b2b-guide__lib" id={LIB_ID}>
        <div className="b2b-guide__search">
          <SearchField value={q} onChange={setQ} placeholder={g.library.search} />
        </div>

        {results ? (
          <div className="b2b-guide__results">
            {results.length > 0 && <p className="b2b-guide__rescount">{g.library.results(results.length)}</p>}
            {results.length === 0 && (
              <div className="b2b-guide__empty">
                <Icon name="search" size={24} />
                <p className="b2b-guide__empty-title">{g.library.noResults}</p>
                <p className="b2b-guide__empty-hint">{g.library.noResultsHint}</p>
              </div>
            )}
            <ul className="b2b-guide__reslist">
              {results.map((r) => (
                <li key={`${r.type}-${r.id}`} className="b2b-guide__res">
                  <Badge color="neutral" size="sm">
                    {g.library.types[r.type]}
                  </Badge>
                  <span className="b2b-guide__res-title">
                    {r.title}
                    {r.meta && <span className="b2b-guide__res-meta"> · {r.meta}</span>}
                  </span>
                  <Button variant="secondary" size="sm" onClick={() => sendMaterial(r.type, r.title)} aria-label={g.library.sendTo(r.title)}>
                    {g.library.send}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <Tabs
              label={g.library.tabsLabel}
              value={tab}
              onChange={setTab}
              items={[
                { id: 'videos', label: g.library.tabs.videos, count: VIDEOS.length },
                { id: 'faqs', label: g.library.tabs.faqs, count: FAQS.length },
                { id: 'handbooks', label: g.library.tabs.handbooks, count: HANDBOOKS.length },
              ]}
            />

            {tab === 'videos' && (
              <div className="b2b-guide__grid">
                {VIDEOS.map((v) => (
                  <div key={v.id} className="b2b-guide__video">
                    {/* Photo when present, token tint as the fallback — the
                        card must survive a missing/blocked image. */}
                    <div className={`b2b-guide__thumb b2b-guide__thumb--${v.tint}${v.img ? ' has-img' : ''}`}>
                      {v.img && <img className="b2b-guide__img" src={v.img} alt="" loading="lazy" />}
                      <span className="b2b-guide__play" aria-hidden="true">
                        <Icon name="play" size={18} />
                      </span>
                      <span className="b2b-guide__dur">{v.dur}</span>
                      {v.flag && (
                        <span className="b2b-guide__flag">
                          <Badge color={FLAG_BADGE[v.flag]} size="sm">
                            {g.library.flags[v.flag]}
                          </Badge>
                        </span>
                      )}
                    </div>
                    <div className="b2b-guide__vbody">
                      <span className="b2b-guide__vtitle">{v.title}</span>
                      <span className="b2b-guide__vmeta">{g.library.helpful(v.helpful)}</span>
                      {itemActions('video', v.title, g.library.watch)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'faqs' && (
              <ul className="b2b-guide__faqs">
                {FAQS.map((f) => {
                  const open = openFaq === f.id
                  return (
                    <li key={f.id} className="b2b-guide__faq">
                      <div className="b2b-guide__faq-row">
                        <button
                          type="button"
                          className="b2b-guide__faq-q"
                          aria-expanded={open}
                          onClick={() => setOpenFaq(open ? null : f.id)}
                        >
                          <span>{f.q}</span>
                          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
                        </button>
                        <Button variant="secondary" size="sm" onClick={() => sendMaterial('faq', f.q)} aria-label={g.library.sendTo(f.q)}>
                          {g.library.send}
                        </Button>
                      </div>
                      {open && <p className="b2b-guide__faq-a">{f.a}</p>}
                    </li>
                  )
                })}
              </ul>
            )}

            {tab === 'handbooks' && (
              <ul className="b2b-guide__hbs">
                {HANDBOOKS.map((h) => (
                  <li key={h.id} className="b2b-guide__hb">
                    <span className="b2b-guide__hb-ic">
                      <Icon name="file-text" size={20} />
                    </span>
                    <span className="b2b-guide__hb-main">
                      <span className="b2b-guide__hb-title">{h.title}</span>
                      <span className="b2b-guide__hb-meta">PDF · {h.size}</span>
                    </span>
                    {itemActions('handbook', h.title, g.library.download)}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </Card>

      <h2 className="b2b-guide__h b2b-guide__histh">{g.history.title}</h2>
      <DataTable
        columns={historyCols}
        rows={histRows}
        rowKey={(r) => r.id}
        caption={g.history.caption}
        sort={histSort}
        onSort={onHistSort}
      />
      {histPages > 1 && (
        <div className="b2b-page__pagination">
          <Pagination current={histPage} total={histPages} onChange={setHistPage} />
        </div>
      )}

      {send && <SendMaterialDrawer material={send} history={history} onSent={onSent} onClose={() => setSend(null)} />}
    </>
  )
}
