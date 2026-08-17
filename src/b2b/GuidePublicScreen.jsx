import { useState } from 'react'
import Badge from '../components/Badge.jsx'
import { Button } from '../components/Button.jsx'
import Rating from '../components/Rating.jsx'
import Icon from '../lib/Icon.jsx'
import { ASSETS } from '../lib/assets.js'
import { BlogBody, BundleBody } from './GuideContent.jsx'
import { kaB2B } from './strings.js'
import { itemById, myVote, addVote } from './data/guideItems.js'

/* GuidePublicScreen — the EXTERNAL page a company employee lands on from the
   SMS/email link (#/guide/<id> — deliberately OUTSIDE the #/b2b shell: no
   portal chrome, no auth, read-only; fork locked 2026-08-17). Mobile-first:
   these links open from a phone, so the column is narrow, targets are ≥24px
   and the section chips replace any sidebar. The SAME GuideContent renderers
   feed both this page and the internal detail — one content, two framings.
   Whether the real link is public or per-recipient tokenized is an open
   stakeholder question; nothing here depends on the answer. */

const SECTION_IDS = { videos: 'gpub-videos', faqs: 'gpub-faqs', instruction: 'gpub-instr' }
const TYPE_BADGE = { bundle: 'brand', blog: 'info' }
/* A score at or below this opens the „რა დააკლდა?" field. 3/5 is the honest
   cut: 4–5 is a happy reader, 3 already means something was missing. */
const LOW_SCORE = 3

export default function GuidePublicScreen({ id }) {
  const t = kaB2B
  const g = t.guide
  const gb = g.b
  const pub = gb.pub
  const rt = gb.rate
  const item = itemById(id) || itemById('onboarding')
  /* A rated page never asks again (the vote is remembered per reader). */
  const [vote, setVote] = useState(() => myVote(item.id))
  const [comment, setComment] = useState('')
  const [commentSent, setCommentSent] = useState(false)

  const rate = (stars) => {
    addVote(item.id, stars)
    setVote(stars)
  }

  const jump = (sid) => document.getElementById(sid)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="gpub">
      <header className="gpub__bar">
        <div className="gpub__bar-in">
          <img className="gpub__logo" src={ASSETS.logo} alt="GPI" />
          <span className="gpub__tagline">{pub.tagline}</span>
        </div>
      </header>

      <main className="gpub__page">
        <p className="gpub__from">{pub.from(t.topbar.clientShort)}</p>
        <div className="gpub__head">
          <Badge color={TYPE_BADGE[item.type]} size="sm">
            {g.library.types[item.type]}
          </Badge>
          <span className="b2b-gfeed__pub">
            {gb.by} · {gb.publishedAt(item.published.label)}
          </span>
        </div>
        <h1 className="gpub__title">{item.title}</h1>

        {item.type === 'bundle' && (
          <nav className="gpub__toc" aria-label={pub.onThisPage}>
            <button type="button" className="gpi-chip" onClick={() => jump(SECTION_IDS.videos)}>
              {gb.item.sections.videos}
            </button>
            <button type="button" className="gpi-chip" onClick={() => jump(SECTION_IDS.faqs)}>
              {gb.item.sections.faqs}
            </button>
            <button type="button" className="gpi-chip" onClick={() => jump(SECTION_IDS.instruction)}>
              {item.sections.instruction.title}
            </button>
          </nav>
        )}

        {item.img && (
          <div className={`b2b-gitem__hero b2b-guide__thumb--${item.tint}`}>
            <img src={item.img} alt="" loading="lazy" />
          </div>
        )}

        {item.type === 'bundle' ? <BundleBody item={item} ids={SECTION_IDS} /> : <BlogBody item={item} />}

        {/* Rating — the only interactive thing on an otherwise read-only page.
            One click IS the vote; the low-score field is optional and never
            blocks. Feeds the admin rail's „შეფასება" row. */}
        <section className="gpub__rate">
          {!vote ? (
            <>
              <h2 className="gpub__rate-q">{rt.q}</h2>
              <Rating
                label={rt.scaleLabel}
                starLabel={rt.star}
                value={0}
                onRate={rate}
              />
              <p className="gpub__rate-hint">{rt.hint}</p>
            </>
          ) : (
            <>
              <p className="gpub__rate-thanks">
                <Icon name="check" size={18} />
                {rt.thanks}
              </p>
              <Rating readOnly value={vote} label={rt.yours(vote)} />
              <p className="gpub__rate-hint">{rt.yours(vote)}</p>

              {vote <= LOW_SCORE && !commentSent && (
                <div className="gpub__rate-low">
                  <label className="gpub__rate-lowq" htmlFor="gpub-comment">
                    {rt.lowTitle}
                  </label>
                  <textarea
                    id="gpub-comment"
                    className="gpi-input gpub__rate-field"
                    rows={3}
                    placeholder={rt.lowPh}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button
                    variant="secondary"
                    size="md"
                    disabled={!comment.trim()}
                    onClick={() => setCommentSent(true)}
                  >
                    {rt.send}
                  </Button>
                </div>
              )}
              {commentSent && <p className="gpub__rate-hint">{rt.commentThanks}</p>}
            </>
          )}
        </section>
      </main>

      <footer className="gpub__foot">
        <p className="gpub__foot-help">
          <Icon name="phone" size={16} />
          {pub.footHelp} <strong>{pub.hotline}</strong>
        </p>
        <p className="gpub__foot-note">{pub.footNote}</p>
      </footer>
    </div>
  )
}
