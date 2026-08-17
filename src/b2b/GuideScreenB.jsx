import { useState } from 'react'
import Badge from '../components/Badge.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { Button } from '../components/Button.jsx'
import FilterChips from '../components/FilterChips.jsx'
import SearchField from '../components/SearchField.jsx'
import StatTile from '../components/StatTile.jsx'
import Icon from '../lib/Icon.jsx'
import GuideLibrary from './GuideLibrary.jsx'
import SendMaterialDrawerB from './SendMaterialDrawerB.jsx'
import { kaB2B } from './strings.js'
import { GUIDE_STATS, QUESTIONS } from './data/guide.js'
import { GUIDE_ITEMS, allSends } from './data/guideItems.js'

/* GuideScreenB — version B landing (concept locked 2026-08-17): the guide is a
   FEED of GPI-published items (bundles + blogs), newest first. The v A library
   tabs folded INTO the items — a video/FAQ is no longer sent on its own, it
   ships inside a bundle. Per-item actions replace the page-level kit CTA:
   every card opens its detail page or the ONE shared send drawer. The global
   send-history table moved to the item pages (per-item history); the questions
   tile stays status-only, exactly as in v A. */

const TYPE_BADGE = { bundle: 'brand', blog: 'info' }

export default function GuideScreenB() {
  const t = kaB2B
  const g = t.guide
  const gb = g.b
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')
  /* The library card's own material search (separate scope from the feed's). */
  const [libQ, setLibQ] = useState('')
  const [send, setSend] = useState(null)
  /* Session-only send log (v A idiom): seeds the drawer's dup-warning and
     keeps the "sends" tile live when a demo send happens. */
  const [history, setHistory] = useState(allSends)

  const pending = QUESTIONS.filter((x) => x.status === 'pending')

  const query = q.trim().toLowerCase()
  const items = GUIDE_ITEMS.filter(
    (item) =>
      (filter === 'all' || item.type === filter) &&
      (!query || item.title.toLowerCase().includes(query) || item.excerpt.toLowerCase().includes(query))
  ).sort((a, b) => b.published.iso.localeCompare(a.published.iso))

  const counts = { bundle: 0, blog: 0 }
  GUIDE_ITEMS.forEach((i) => counts[i.type]++)

  const openItem = (item) => {
    window.location.hash = `#/b2b/guide/${item.id}`
  }

  return (
    <>
      <Breadcrumbs items={[]} current={g.title} label={t.crumbsLabel} />
      <div className="b2b-page__head">
        <div>
          <h1 className="b2b-page__title">{g.title}</h1>
          <div className="b2b-page__subtitle">{gb.subtitle}</div>
        </div>
        <Button variant="secondary" size="md" leadingIcon="activity">
          {g.report}
        </Button>
      </div>

      <div className="b2b-guide__stats b2b-guide__stats--3">
        <StatTile
          label={g.stats.engagement}
          value={`${GUIDE_STATS.pct}%`}
          meta={g.stats.engagementMeta(GUIDE_STATS.active, GUIDE_STATS.total)}
        />
        <StatTile
          label={gb.stats.sends}
          value={history.length}
          meta={history.length ? gb.stats.lastSend(history[0].date) : gb.stats.noSends}
        />
        <StatTile
          tone={pending.length ? 'warning' : 'success'}
          icon={pending.length ? 'message-circle' : undefined}
          label={g.stats.openQ}
          value={pending.length}
          meta={pending.length ? g.stats.openQMeta : g.stats.allAnswered}
        />
      </div>

      <div className="b2b-gfeed__toolbar">
        <FilterChips
          label={gb.filtersLabel}
          value={filter}
          onChange={setFilter}
          options={[
            { id: 'all', label: gb.filters.all, count: GUIDE_ITEMS.length },
            { id: 'bundle', label: gb.filters.bundle, count: counts.bundle },
            { id: 'blog', label: gb.filters.blog, count: counts.blog },
          ]}
        />
        <div className="b2b-gfeed__search">
          <SearchField value={q} onChange={setQ} placeholder={gb.search} />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="b2b-guide__empty">
          <Icon name="search" size={24} />
          <p className="b2b-guide__empty-title">{g.library.noResults}</p>
          <p className="b2b-guide__empty-hint">{g.library.noResultsHint}</p>
        </div>
      ) : (
        <div className="b2b-gfeed" role="list">
          {items.map((item) => (
            <article key={item.id} className="gpi-card b2b-gfeed__card" role="listitem">
              <a
                className={`b2b-gfeed__thumb b2b-guide__thumb--${item.tint}`}
                href={`#/b2b/guide/${item.id}`}
                tabIndex={-1}
                aria-hidden="true"
              >
                {item.img && <img src={item.img} alt="" loading="lazy" />}
              </a>
              <div className="b2b-gfeed__main">
                <div className="b2b-gfeed__top">
                  <Badge color={TYPE_BADGE[item.type]} size="sm">
                    {g.library.types[item.type]}
                  </Badge>
                  <span className="b2b-gfeed__pub">
                    {gb.by} · {gb.publishedAt(item.published.label)}
                  </span>
                </div>
                <a className="b2b-gfeed__title" href={`#/b2b/guide/${item.id}`}>
                  {item.title}
                </a>
                <p className="b2b-gfeed__excerpt">{item.excerpt}</p>
                <span className={`b2b-gfeed__meta${item.engagement ? '' : ' is-unsent'}`}>
                  <Icon name={item.engagement ? 'send' : 'info'} size={14} />
                  {item.engagement ? gb.sentMeta(item.engagement.sent, item.engagement.openRate) : gb.notSent}
                </span>
              </div>
              <div className="b2b-gfeed__acts">
                <Button variant="tertiary" size="sm" onClick={() => openItem(item)} aria-label={gb.openTo(item.title)}>
                  {gb.open}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSend({ type: item.type, title: item.title, id: item.id })}
                  aria-label={g.library.sendTo(item.title)}
                >
                  {g.library.send}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* The library stays in v B (user, 2026-08-17): the feed is what GPI
          PUBLISHED, the library is the raw materials underneath — browsable
          and still individually sendable through the same drawer. */}
      <div className="b2b-gfeed__libhead">
        <h2 className="b2b-guide__h">{gb.libraryTitle}</h2>
        <p className="b2b-gfeed__libhint">{gb.libraryHint}</p>
      </div>
      <GuideLibrary q={libQ} onQueryChange={setLibQ} onSend={(type, title) => setSend({ type, title })} />

      {send && (
        <SendMaterialDrawerB
          material={send}
          history={history}
          onSent={(entry) => setHistory((h) => [entry, ...h])}
          onClose={() => setSend(null)}
        />
      )}
    </>
  )
}
