import { useState } from 'react'
import Badge from '../components/Badge.jsx'
import { Button } from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import SearchField from '../components/SearchField.jsx'
import Tabs from '../components/Tabs.jsx'
import Icon from '../lib/Icon.jsx'
import { kaB2B } from './strings.js'
import { VIDEOS, FAQS, HANDBOOKS } from './data/guide.js'

/* GuideLibrary — the material library card (global search over all types +
   videos/FAQ/handbooks tabs + per-material send). Extracted VERBATIM from
   GuideScreen 2026-08-17 when version B became the second consumer (the
   promote-on-second-consumer rule, InsuredFields precedent): in v A it is the
   find-and-send core of the page; in v B it sits below the feed as the archive
   of raw materials — the pieces bundles are built from, still individually
   sendable. `q` stays CONTROLLED by the parent because v A's history rows seed
   it ("მასალის ნახვა" → search for the material); tab + accordion state is the
   card's own business. */

const FLAG_BADGE = { top: 'brand', new: 'info' }

export default function GuideLibrary({ q, onQueryChange, onSend, id }) {
  const g = kaB2B.guide
  const [tab, setTab] = useState('videos')
  const [openFaq, setOpenFaq] = useState(null)

  const query = q.trim().toLowerCase()
  const hit = (s) => s.toLowerCase().includes(query)
  const results = query
    ? [
        ...VIDEOS.filter((v) => hit(v.title)).map((v) => ({ type: 'video', id: v.id, title: v.title, meta: v.dur })),
        ...FAQS.filter((f) => hit(f.q) || hit(f.a)).map((f) => ({ type: 'faq', id: f.id, title: f.q })),
        ...HANDBOOKS.filter((h) => hit(h.title)).map((h) => ({ type: 'handbook', id: h.id, title: h.title, meta: `PDF · ${h.size}` })),
      ]
    : null

  const itemActions = (type, title, primaryLabel) => (
    <div className="b2b-guide__acts">
      <Button variant="tertiary" size="sm">
        {primaryLabel}
      </Button>
      <Button variant="secondary" size="sm" onClick={() => onSend(type, title)} aria-label={g.library.sendTo(title)}>
        {g.library.send}
      </Button>
    </div>
  )

  return (
    <Card className="b2b-guide__lib" id={id}>
      <div className="b2b-guide__search">
        <SearchField value={q} onChange={onQueryChange} placeholder={g.library.search} />
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
                <Button variant="secondary" size="sm" onClick={() => onSend(r.type, r.title)} aria-label={g.library.sendTo(r.title)}>
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
                      <Button variant="secondary" size="sm" onClick={() => onSend('faq', f.q)} aria-label={g.library.sendTo(f.q)}>
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
  )
}
