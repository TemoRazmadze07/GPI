import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { kaB2B } from './strings.js'
import { bundleVideos, bundleFaqs } from './data/guideItems.js'

/* GuideContent — the ONE renderer for a guide item's body (version B).
   Both audiences read the SAME content through these components:
     · GuideItemScreen (internal, #/b2b/guide/<id>) wraps it with the admin rail;
     · GuidePublicScreen (external, #/guide/<id>) wraps it in the public chrome.
   One source keeps the "what the employee sees" promise honest (Rule 1).
   Video cards reuse the v A .b2b-guide__* classes — same card, new context.
   Opening a video in a PLAYER is an explicitly deferred phase (2026-08-17):
   thumbs render the play affordance but are inert, exactly like v A. */

export function BlogBody({ item }) {
  return (
    <div className="b2b-gcontent">
      {item.body.map((block, i) => {
        if (block.h) return <h2 key={i} className="b2b-gcontent__h">{block.h}</h2>
        if (block.list)
          return (
            <ul key={i} className="b2b-gcontent__list">
              {block.list.map((li) => (
                <li key={li}>
                  <Icon name="check" size={16} />
                  {li}
                </li>
              ))}
            </ul>
          )
        return <p key={i} className="b2b-gcontent__p">{block.p}</p>
      })}
    </div>
  )
}

/* ids: optional {videos, faqs, instruction} anchor ids for the external page's
   section chips (scrollIntoView — real #anchors would fight the hash router). */
export function BundleBody({ item, ids = {} }) {
  const gb = kaB2B.guide.b
  const [openFaq, setOpenFaq] = useState(null)
  const videos = bundleVideos(item)
  const faqs = bundleFaqs(item)
  const instr = item.sections.instruction

  return (
    <div className="b2b-gcontent">
      <section id={ids.videos}>
        <h2 className="b2b-gcontent__h">{gb.item.sections.videos}</h2>
        <div className="b2b-gcontent__videos">
          {videos.map((v) => (
            <div key={v.id} className="b2b-guide__video">
              <div className={`b2b-guide__thumb b2b-guide__thumb--${v.tint}${v.img ? ' has-img' : ''}`}>
                {v.img && <img className="b2b-guide__img" src={v.img} alt="" loading="lazy" />}
                <span className="b2b-guide__play" aria-hidden="true">
                  <Icon name="play" size={18} />
                </span>
                <span className="b2b-guide__dur">{v.dur}</span>
              </div>
              <div className="b2b-guide__vbody">
                <span className="b2b-guide__vtitle">{v.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id={ids.faqs}>
        <h2 className="b2b-gcontent__h">{gb.item.sections.faqs}</h2>
        <ul className="b2b-guide__faqs">
          {faqs.map((f) => {
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
                </div>
                {open && <p className="b2b-guide__faq-a">{f.a}</p>}
              </li>
            )
          })}
        </ul>
      </section>

      <section id={ids.instruction}>
        <h2 className="b2b-gcontent__h">{instr.title}</h2>
        <ol className="b2b-gcontent__steps">
          {instr.steps.map((s, i) => (
            <li key={s.t}>
              <span className="b2b-gcontent__stepno" aria-hidden="true">{i + 1}</span>
              <span className="b2b-gcontent__stepbody">
                <span className="b2b-gcontent__stept">{s.t}</span>
                <span className="b2b-gcontent__stepd">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
