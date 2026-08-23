/* „მეტი" — the app's overflow menu, built for stakeholder comment #12 (2026-08-18).

   Why it exists at all: in V2 the Curatio module is a TAB in the product switcher,
   which only appears for users who have health cover in view. The stakeholder asked
   for a second, permanent way in — the More menu is where people look for „the rest
   of the app", so „ჩემი კურაციო" gets a row there too. It is the same destination,
   not a second copy of the module.

   Deliberately MINIMAL: the production More menu is owned by the existing app and is
   not ours to redesign here (Rule 5 — separate platform context). The other rows are
   plausible stand-ins so the Curatio row is read IN CONTEXT rather than on an empty
   page; they are dead on purpose. Replace this list with the real one at handoff. */

import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { go } from './nav.js'

const noop = () => {}

const ROWS = [
  {
    id: 'curatio',
    icon: 'cross',
    bg: 'var(--mga-pink-soft)',
    fg: 'var(--mga-pink-fg)',
    live: true,
  },
  { id: 'profile', icon: 'user' },
  { id: 'notifications', icon: 'bell' },
  { id: 'payments', icon: 'credit-card' },
  { id: 'help', icon: 'headphones' },
  { id: 'settings', icon: 'settings' },
]

export default function MoreScreen() {
  return (
    <>
      <div className="mga-hdr">
        <h1 className="mga-hdr__title">{M.more.title}</h1>
      </div>

      <div className="mga-body">
        {ROWS.map((r) => (
          <button
            key={r.id}
            className="mga-card mga-prow"
            onClick={r.live ? () => go('curatio') : noop}
          >
            <span className="mga-itile">
              <Icon name={r.icon} size={17} />
            </span>
            <span className="mga-meta" style={{ flex: 1 }}>
              <span className="mga-meta__val">{M.more.rows[r.id]}</span>
              {M.more.hints[r.id] && <span className="mga-meta__lbl">{M.more.hints[r.id]}</span>}
            </span>
            <span className="mga-prow__chv">
              <Icon name="chevron-right" size={16} />
            </span>
          </button>
        ))}
      </div>
    </>
  )
}
