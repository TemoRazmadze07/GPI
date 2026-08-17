import { useState } from 'react'
import Badge from '../components/Badge.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { Button } from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import DemoBar from '../components/DemoBar.jsx'
import Toast from '../components/Toast.jsx'
import Icon from '../lib/Icon.jsx'
import copyText from '../lib/copyText.js'
import SendMaterialDrawerB from './SendMaterialDrawerB.jsx'
import { BlogBody, BundleBody } from './GuideContent.jsx'
import { kaB2B } from './strings.js'
import { itemById, setGuideVersion, ratingFor, clearVotes } from './data/guideItems.js'

/* GuideItemScreen — INTERNAL detail page of one guide item (version B,
   #/b2b/guide/<id>). The layout IS the two-audience concept: the main column
   renders exactly what the employee reads (via the shared GuideContent
   renderers), the right rail holds everything only an admin gets — send CTA,
   engagement, this item's send history, and the "view as employee" bridge to
   the external page (#/guide/<id>, new tab — it has no way back on purpose).
   The rail's engagement numbers come from GPI's link analytics — which system
   feeds them is an open stakeholder question (logged 2026-08-17). */

const TYPE_BADGE = { bundle: 'brand', blog: 'info' }
const CHANNEL_ICON = { email: 'mail', sms: 'smartphone', both: 'send' }

export default function GuideItemScreen({ id }) {
  const t = kaB2B
  const g = t.guide
  const gb = g.b
  const item = itemById(id)
  const [send, setSend] = useState(false)
  const [toast, setToast] = useState(null)
  /* Recomputed on every mount, so returning from the employee tab shows the
     vote that was just cast (the store is shared via localStorage). */
  const rating = item ? ratingFor(item) : null
  /* Per-item session log (v A idiom) — a demo send lands in the rail at once. */
  const [history, setHistory] = useState(() =>
    item ? item.history.map((h, i) => ({ id: `h${i}`, material: item.title, type: item.type, ...h })) : []
  )

  if (!item) {
    return (
      <>
        <Breadcrumbs items={[{ label: g.title, href: '#/b2b/guide' }]} current={gb.item.notFound} label={t.crumbsLabel} />
        <div className="b2b-page__stub">
          {gb.item.notFound} · <a className="gpi-link" href="#/b2b/guide">{gb.item.backToGuide}</a>
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumbs items={[{ label: g.title, href: '#/b2b/guide' }]} current={item.title} label={t.crumbsLabel} />
      <div className="b2b-gitem">
        <div className="b2b-gitem__main">
          <div className="b2b-gitem__head">
            <div className="b2b-gfeed__top">
              <Badge color={TYPE_BADGE[item.type]} size="sm">
                {g.library.types[item.type]}
              </Badge>
              <span className="b2b-gfeed__pub">
                {gb.by} · {gb.publishedAt(item.published.label)}
              </span>
            </div>
            <h1 className="b2b-page__title">{item.title}</h1>
            <p className="b2b-gitem__lead">{item.excerpt}</p>
          </div>
          {item.img && (
            <div className={`b2b-gitem__hero b2b-guide__thumb--${item.tint}`}>
              <img src={item.img} alt="" loading="lazy" />
            </div>
          )}
          {item.type === 'bundle' ? <BundleBody item={item} /> : <BlogBody item={item} />}
        </div>

        <aside className="b2b-gitem__rail" aria-label={gb.item.engagement}>
          <Card className="b2b-gitem__railcard" padding={20}>
            <Button variant="primary" size="md" leadingIcon="send" onClick={() => setSend(true)}>
              {g.library.send}
            </Button>
            <h3 className="b2b-gitem__railh">{gb.item.engagement}</h3>
            {item.engagement ? (
              <dl className="b2b-gitem__eng">
                <div>
                  <dt>{gb.item.engRows.sent}</dt>
                  <dd>{gb.item.engPeople(item.engagement.sent)}</dd>
                </div>
                <div>
                  <dt>{gb.item.engRows.open}</dt>
                  <dd>{item.engagement.openRate}%</dd>
                </div>
                {/* Real employee votes from the external page (incl. any cast
                    in this prototype), not an invented percentage. */}
                <div>
                  <dt>{gb.item.engRows.rating}</dt>
                  <dd>
                    {rating ? (
                      <>
                        {gb.item.ratingValue(rating.avg)}
                        <span className="b2b-gitem__engsub">{gb.item.ratingCount(rating.count)}</span>
                      </>
                    ) : (
                      <span className="b2b-gitem__engnone">{gb.item.noRating}</span>
                    )}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="b2b-gitem__railnote">{gb.notSent} · {gb.item.engNote}</p>
            )}
          </Card>

          <Card className="b2b-gitem__railcard" padding={20}>
            <h3 className="b2b-gitem__railh">{g.history.title}</h3>
            {history.length === 0 ? (
              <p className="b2b-gitem__railnote">{gb.item.historyEmpty}</p>
            ) : (
              <ul className="b2b-gitem__hist">
                {history.map((h) => (
                  <li key={h.id}>
                    <Icon name={CHANNEL_ICON[h.channel]} size={16} />
                    <span className="b2b-gitem__hist-main">
                      <span>{h.to}</span>
                      <span className="b2b-gitem__hist-sub">
                        {h.date} · {g.history.people(h.count)} ·{' '}
                        {h.channel === 'both' ? gb.send2.both : g.send.channels[h.channel]}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Button
            variant="secondary"
            size="md"
            leadingIcon="eye"
            className="b2b-gitem__viewas"
            onClick={() => window.open(`#/guide/${item.id}`, '_blank')}
          >
            {gb.item.viewAs}
          </Button>
          {/* Same link the message carries — copyable for HR's own channels. */}
          <Button
            variant="secondary"
            size="md"
            leadingIcon="copy"
            className="b2b-gitem__viewas"
            onClick={async () => {
              const ok = await copyText(`${window.location.origin}${window.location.pathname}#/guide/${item.id}`)
              setToast(ok ? { text: gb.send2.linkCopied } : { text: gb.send2.copyFailed, tone: 'warning' })
            }}
          >
            {gb.send2.copyLink}
          </Button>
        </aside>
      </div>

      <Toast toast={toast} onDone={() => setToast(null)} />

      {send && (
        <SendMaterialDrawerB
          material={{ type: item.type, title: item.title, id: item.id }}
          history={history}
          onSent={(entry) => setHistory((h) => [entry, ...h])}
          onClose={() => setSend(false)}
        />
      )}

      <DemoBar
        actions={[
          {
            label: 'guide A',
            ghost: true,
            onClick: () => {
              setGuideVersion('A')
              window.location.hash = '#/b2b/guide'
            },
          },
          { label: 'guide B', onClick: () => {} },
          {
            label: 'reset votes',
            ghost: true,
            onClick: () => {
              clearVotes()
              window.location.reload()
            },
          },
        ]}
      />
    </>
  )
}
