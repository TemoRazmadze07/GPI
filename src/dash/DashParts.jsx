import Icon from '../lib/Icon.jsx'
import { D } from './strings.js'

/* Dashboard host — the presentational primitives the screens compose from.

   Every one of these is NEW to the desktop kit (the booking flow never needed a
   limit meter or a benefit row), so they are built here as proper, token-driven
   components rather than inline markup (Rules 1 / 8 / 9). Anything the booking
   flow already owns — Button, Badge, Avatar, Icon, Card, the .gpi-* classes —
   is imported, never re-implemented.

   ⚠️ These are candidates to be promoted into src/components/ + the Figma
   library once the dashboard settles. Keeping them project-local for now means
   the My-Cabinet booking app is not touched by this work. */

/* ---- Section head: "ACTIVE POLICIES" + "View all 5" ----------------------- */
export function SectionHead({ title, count, onViewAll, id }) {
  return (
    <div className="dash-sechead">
      <h2 className="dash-sechead__title" id={id}>{title}</h2>
      {onViewAll && (
        <button type="button" className="gpi-link dash-link" onClick={onViewAll}>
          {D.viewAll(count)}
        </button>
      )}
    </div>
  )
}

/* ---- Card head: title (+ optional trailing control) and the payment note --- */
export function CardHead({ title, titleId, onSwitch, switchLabel, sub, note }) {
  return (
    <header className="dash-chead">
      <div className="dash-chead__main">
        <div className="dash-chead__titlerow">
          {/* Title and its switcher are ONE unit: the chevron belongs to the
              name, so it must never wrap onto a line of its own when the head
              gets tight. Anything else on the row (a tier mark) may wrap. */}
          <span className="dash-chead__name">
            <h3 className="dash-chead__title" id={titleId}>{title}</h3>
            {onSwitch && (
              <button
                type="button"
                className="dash-chead__switch"
                onClick={onSwitch}
                aria-label={switchLabel}
              >
                <Icon name="chevron-down" size={20} />
              </button>
            )}
          </span>
          {/* Non-interactive trailing content (a tier mark, a plate) rides the
              title row in the design, so it is passed as `sub` and rendered
              inline rather than under it. */}
          {sub && <span className="dash-chead__sub">{sub}</span>}
        </div>
      </div>
      {note && (
        <p className="dash-chead__note">
          <Icon name="calendar" size={16} />
          <span>
            {D.policy.nextPayment}: <strong>{note}</strong>
          </span>
        </p>
      )}
    </header>
  )
}

/* ---- Limit meter ----------------------------------------------------------
   A spend meter, not a progress bar in the "task completion" sense: the value
   shown is what has been USED of an allowance. The accessible name says so, and
   the bar carries the numbers as text too, because colour+length alone would
   fail anyone who cannot see the fill. */
export function LimitMeter({ label, used, total, format }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0
  const remaining = Math.max(0, total - used)
  return (
    <div className="dash-meter">
      <div className="dash-meter__head">
        <span className="dash-meter__label">{label}</span>
        <span className="dash-meter__value">
          {used.toLocaleString('en-US')} / {format(total)}
        </span>
      </div>
      <div
        className="dash-meter__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={used}
        aria-valuetext={`${format(used)} / ${format(total)}`}
        aria-label={`${label} — ${D.health.limits.used}`}
      >
        <span className="dash-meter__fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="dash-meter__rest">{D.health.limits.remaining(format(remaining))}</p>
    </div>
  )
}

/* ---- Action tile ----------------------------------------------------------
   The card's primary actions. A tile is a button, not a card with a link in it:
   the whole surface is the target, which is also how it clears the 24px
   target-size floor comfortably (Rule 7). */
export function ActionTile({ icon, mark, tint = 'neutral', label, sub, onClick }) {
  return (
    <button type="button" className="dash-tile" onClick={onClick}>
      <span className={`dash-tile__disc dash-tile__disc--${tint}`}>
        {mark || <Icon name={icon} size={24} />}
      </span>
      <span className="dash-tile__text">
        <span className="dash-tile__label">{label}</span>
        {sub && <span className="dash-tile__sub">{sub}</span>}
      </span>
    </button>
  )
}

/* ---- Meta row -------------------------------------------------------------
   Leading mark/avatar + title + sub + a trailing action. Serves the personal
   doctor, the second-opinion promo and the auto assistant — one shape, three
   contents, so it is one component (Rule 1). */
export function MetaRow({ lead, title, sub, action, className = '' }) {
  return (
    <div className={`dash-mrow ${className}`}>
      {lead && <span className="dash-mrow__lead">{lead}</span>}
      <span className="dash-mrow__text">
        <span className="dash-mrow__title">{title}</span>
        {sub && <span className="dash-mrow__sub">{sub}</span>}
      </span>
      {action && <span className="dash-mrow__action">{action}</span>}
    </div>
  )
}

/* ---- List row -------------------------------------------------------------
   The rail's repeating unit: bookings, referrals, Voovly and Bruno benefits are
   all "lead · title(+sub) · trailing facts (· chevron)". `onClick` promotes the
   whole row to a button; without it the row is static, and no chevron is drawn
   — an affordance that leads nowhere is worse than none. */
export function ListRow({ lead, title, titleBadge, sub, trailing, onClick }) {
  const inner = (
    <>
      {lead && <span className="dash-lrow__lead">{lead}</span>}
      <span className="dash-lrow__text">
        <span className="dash-lrow__titlerow">
          <span className="dash-lrow__title">{title}</span>
          {titleBadge}
        </span>
        {sub && <span className="dash-lrow__sub">{sub}</span>}
      </span>
      {trailing && <span className="dash-lrow__trail">{trailing}</span>}
      {onClick && <Icon name="chevron-right" size={20} className="dash-lrow__chev" />}
    </>
  )
  return onClick ? (
    <button type="button" className="dash-lrow dash-lrow--btn" onClick={onClick}>
      {inner}
    </button>
  ) : (
    <div className="dash-lrow">{inner}</div>
  )
}

/* ---- Rail section: a heading + "View all" over a stack of rows ------------- */
export function RailSection({ title, count, onViewAll, children }) {
  return (
    <section className="dash-rsec">
      <div className="dash-rsec__head">
        <h4 className="dash-rsec__title">{title}</h4>
        {onViewAll && (
          <button type="button" className="gpi-link dash-link" onClick={onViewAll}>
            {D.viewAll(count)}
          </button>
        )}
      </div>
      <div className="dash-rsec__body">{children}</div>
    </section>
  )
}

/* ---- Product card ---------------------------------------------------------
   The big per-product panel: a coloured top rail names the product family
   (pink = health, blue = auto), a main column carries the policy, and an
   optional rail carries its lists. The rail is a column of the SAME card, not
   a second card — the design tints it and hangs it off one hairline. */
export function ProductCard({ tone = 'health', children, rail, labelledBy }) {
  return (
    <section className={`gpi-card dash-pcard dash-pcard--${tone}`} aria-labelledby={labelledBy}>
      <div className="dash-pcard__main">{children}</div>
      {rail && <div className="dash-pcard__rail">{rail}</div>}
    </section>
  )
}
