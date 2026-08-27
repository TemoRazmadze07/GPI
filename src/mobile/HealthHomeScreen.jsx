/* Health-mode Home of the MyGPI mobile app + the new "ჩემი კურაციო" block.
   Everything from the existing design is kept; the additions are: the Curatio
   quick-access card, the გადაჯავშნა booking action, the chronic-referral row,
   and (on visit day) the live queue strip — see project memory for the rationale.
   `visitDay` flips the booking card into its live F-01 state.

   V2 (?v=2, stakeholder comparison — V1 stays canonical): the switcher grows a
   third კურაციო pill (short labels), the Curatio block leaves this screen, and
   on visit day the booking card keeps its normal layout with a slim strip that
   deep-links to the e-ticket — the live queue moves to the კურაციო tab, and a
   history POINTER row (stakeholder comment #2) closes the dashboard. */

import Icon from '../lib/Icon.jsx'
import CuratioMark from '../lib/CuratioMark.jsx'
import { PRODUCT_IMG } from '../lib/assets.js'
import { M } from './strings.js'
import { PERSONS, BOOKING, NEXT_BOOKING, QUEUE, REFERRAL, CHRONIC, COUNTS } from './data.js'
import { go, isInsured } from './nav.js'
import { isUnlocked } from './otp.jsx'
import { usePurchaseGate, GateLock } from './purchase.jsx'

const noop = () => {}

export function TopBar() {
  return (
    <div className="mga-top">
      <div className="mga-ava" aria-hidden="true">
        A
      </div>
      <div className="mga-hello">
        <div className="mga-hello__hi">{M.hello}</div>
        <div className="mga-hello__name">{M.userName}</div>
      </div>
      <button className="mga-iconbtn" aria-label="Search" onClick={noop}>
        <Icon name="search" size={16} />
      </button>
      <button className="mga-iconbtn" aria-label="Notifications" onClick={noop}>
        <Icon name="bell" size={16} />
        <span className="mga-dot mga-dot--sm" aria-hidden="true" />
      </button>
      <button className="mga-pts" onClick={noop}>
        <Icon name="coins" size={14} />
        {M.points}
      </button>
    </div>
  )
}

export function ProductSwitcher({ v2 = false, active = 'health' }) {
  if (!v2) {
    return (
      <div className="mga-seg" role="tablist" aria-label="Insurance products">
        <button className="mga-seg__item" role="tab" aria-selected="false" onClick={noop}>
          <img className="mga-prodimg" src={PRODUCT_IMG['auto.png']} alt="" />
          {M.tabs.auto}
        </button>
        <button className="mga-seg__item mga-seg__item--on" role="tab" aria-selected="true">
          <img className="mga-prodimg" src={PRODUCT_IMG['health.png']} alt="" />
          {M.tabs.health}
        </button>
        <button className="mga-iconbtn mga-iconbtn--sm mga-iconbtn--plain" aria-label="More products" onClick={noop}>
          <Icon name="more-vertical" size={16} />
        </button>
      </div>
    )
  }
  /* V2: three pills. Full product names can't fit 390px three-up → short labels.
     The კურაციო pill carries CURATIO'S OWN LOGO MARK (user, 2026-08-26), bare and
     in their brand blue — exactly how auto/health carry their product mark. It was
     a Lucide pulse glyph on a teal disc, which named a service we'd invented a
     colour for; the partner has an identity, so we use it. */
  const pill = (key, on, label, img, onClick) => (
    <button
      key={key}
      className={'mga-seg__item' + (on ? ' mga-seg__item--on' : '')}
      role="tab"
      aria-selected={on}
      onClick={on ? undefined : onClick}
    >
      {img}
      {label}
    </button>
  )
  /* The switcher lists the products the user actually HOLDS, so with no health policy the
     Health pill is not rendered at all (user, 2026-08-20) — there is no health dashboard to
     switch to. კურაციო stays: the medical record is available without insurance, which is the
     whole point of the uninsured state. `--3` only exists to shrink type for a three-up row,
     so two-up drops it and gets the roomier base size. */
  const showHealth = isInsured()
  return (
    <div className={'mga-seg' + (showHealth ? ' mga-seg--3' : '')} role="tablist" aria-label="Products and services">
      {pill('auto', false, M.tabsV2.auto, <img className="mga-prodimg" src={PRODUCT_IMG['auto.png']} alt="" />, noop)}
      {showHealth &&
        pill('health', active === 'health', M.tabsV2.health, <img className="mga-prodimg" src={PRODUCT_IMG['health.png']} alt="" />, () => go('health'))}
      {pill(
        'curatio',
        active === 'curatio',
        M.tabsV2.curatio,
        <span className="mga-seg__cur" aria-hidden="true">
          <CuratioMark size={16} />
        </span>,
        () => go('curatio'),
      )}
    </div>
  )
}

function CuratioBlock() {
  /* doctor/reminders/prevention route to the hub (their cards live there) until
     dedicated pages exist; history has its own page. The ისტორია tile carries a
     lock glyph while the session is locked — the OTP gate then opens on the
     history screen itself, so the tap is never a dead end. */
  const locked = !isUnlocked()
  const tiles = [
    { key: 'doctor', icon: 'stethoscope', label: M.curatio.doctor, to: 'curatio' },
    { key: 'history', icon: 'file-text', label: M.curatio.history, to: 'history', locked },
    { key: 'reminders', icon: 'bell', label: M.curatio.reminders, count: COUNTS.reminders, to: 'curatio' },
    { key: 'prevention', icon: 'shield-check', label: M.curatio.prevention, to: 'curatio' },
  ]
  return (
    <section className="mga-card mga-cur" aria-label={M.curatio.title}>
      <div className="mga-cur__head">
        <span className="mga-cur__mark" aria-hidden="true">
          <CuratioMark size={18} />
        </span>
        <h2 className="mga-cur__title" style={{ margin: 0, fontSize: 14 }}>
          {M.curatio.title}
        </h2>
        <button className="mga-link" onClick={() => go('curatio')}>
          {M.curatio.full} ›
        </button>
      </div>
      <div className="mga-cur__tiles">
        {tiles.map((t) => (
          <button key={t.key} className="mga-qa" onClick={() => go(t.to)}>
            <span className="mga-qa__tile">
              <Icon name={t.icon} size={20} />
              {t.count > 0 && <span className="mga-qa__cnt">{t.count}</span>}
              {t.locked && (
                <span className="mga-qa__lock" aria-label={M.dash.protectedHint}>
                  <Icon name="lock" size={9} />
                </span>
              )}
            </span>
            <span className="mga-qa__lbl">{t.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function HistoryRow() {
  /* #2 (2026-08-18): the medical-history entry point ALSO on the Health
     dashboard — a POINTER, never a second home for the data. It carries NO
     records, counts or alert badge, because history sits behind the OTP gate
     and this screen is public (user: "only button, not actual information").
     `from` makes the hub's back return here instead of to the კურაციო tab.
     V2 only — in V1 the Curatio block already carries an ისტორია tile.
     Leading visual = the CURATIO MARK (mga-cur__mark — Curatio's logo reversed
     out of a brand-blue tile), not a pastel tile + document icon: the row is a
     cross-tab pointer, so the mark names the destination and rhymes with the
     კურაციო pill (user, 2026-08-18: the generic icon tile had to go). The tile
     stays a tile — a list row's leading slot is one — while the pill goes bare
     to match its siblings; both now carry the same mark in the same blue.
     No lock chip — a plain chevron is enough (user); the OTP sheet on the hub
     explains the gate itself. Placed LAST on the dashboard for now (user). */
  return (
    <button className="mga-card mga-prow" onClick={() => go('histhub', { from: 'health' })}>
      <span className="mga-cur__mark" aria-hidden="true">
        <CuratioMark size={18} />
      </span>
      <span className="mga-meta" style={{ flex: 1 }}>
        <span className="mga-meta__val">{M.dash2.historyTitle}</span>
        <span className="mga-meta__lbl">{M.dash2.historyHint}</span>
      </span>
      <span className="mga-prow__chv">
        <Icon name="chevron-right" size={16} />
      </span>
    </button>
  )
}

function BookingsWidget({ visitDay, v2 = false }) {
  /* V2 visit day: the card keeps its NORMAL layout — the live queue lives on the
     კურაციო tab — plus one slim strip deep-linking to the same e-ticket. */
  const liveHere = visitDay && !v2
  return (
    <section className={'mga-card' + (liveHere ? ' mga-today-card' : '')} aria-label={M.bookings.title}>
      <div className="mga-whead">
        <h2 className="mga-whead__title" style={{ margin: 0, fontSize: 15 }}>
          {M.bookings.title}
        </h2>
        {visitDay ? (
          <span className="mga-badge mga-badge--pink">{M.bookings.today}</span>
        ) : (
          <button className="mga-link mga-link--quiet" onClick={noop}>
            {M.bookings.all} <span className="mga-badge mga-badge--pink">{COUNTS.bookings}</span> ›
          </button>
        )}
      </div>

      {liveHere ? (
        <>
          <div className="mga-irow">
            <span className="mga-itile mga-itile--gold">
              <Icon name="stethoscope" size={17} />
            </span>
            <div className="mga-meta" style={{ flex: 1 }}>
              <div className="mga-meta__lbl">
                {BOOKING.specialty} · {BOOKING.clinic}
              </div>
              <div className="mga-meta__val">{BOOKING.doctor}</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{BOOKING.timeShort}</span>
          </div>
          <div className="mga-queue">
            <div className="mga-queue__row">
              <div className="mga-queue__cell">
                <div className="mga-queue__lbl">{M.bookings.queueYour}</div>
                <div className="mga-queue__num">{QUEUE.number}</div>
              </div>
              <div className="mga-queue__cell">
                <div className="mga-queue__lbl">{M.bookings.queueWait}</div>
                <div className="mga-queue__val">
                  ~{QUEUE.waitMin} {M.bookings.minutes}
                </div>
              </div>
              <div className="mga-queue__cell">
                <div className="mga-queue__lbl">{M.bookings.queueAhead}</div>
                <div className="mga-queue__val">
                  {QUEUE.ahead} {M.bookings.queuePatients}
                </div>
              </div>
            </div>
            <div className="mga-queue__live">{M.bookings.queueLive}</div>
          </div>
          <button className="mga-btn mga-btn--primary mga-btn--md mga-btn--block" onClick={() => go('ticket')}>
            {M.bookings.ticket}
          </button>
        </>
      ) : (
        <>
          <div className="mga-irow">
            <span className="mga-itile mga-itile--gold">
              <Icon name="stethoscope" size={17} />
            </span>
            <div className="mga-meta">
              <div className="mga-meta__lbl">{BOOKING.specialty}</div>
              <div className="mga-meta__val">{BOOKING.doctor}</div>
            </div>
          </div>
          <div className="mga-irow">
            <span className="mga-itile">
              <Icon name="building-2" size={17} />
            </span>
            <div className="mga-meta">
              <div className="mga-meta__lbl">{M.bookings.clinic}</div>
              <div className="mga-meta__val">{BOOKING.clinic}</div>
            </div>
          </div>
          <div className="mga-daterow">
            <Icon name="calendar" size={15} />
            <span className="mga-daterow__val">
              {BOOKING.date} · {BOOKING.time}
            </span>
            <span className="mga-badge mga-badge--green">{M.bookings.active}</span>
          </div>
          {v2 && visitDay ? (
            <button className="mga-card mga-irow mga-strip" style={{ marginBottom: 0 }} onClick={() => go('ticket')}>
              <span className="mga-badge mga-strip__bdg">{M.bookings.today}</span>
              <span className="mga-strip__txt">
                რიგი {QUEUE.number} · ~{QUEUE.waitMin} {M.bookings.minutes}
              </span>
              <span className="mga-strip__link">{M.dash.ticketLink} ›</span>
            </button>
          ) : (
            <div className="mga-actions">
              <button className="mga-btn mga-btn--secondary mga-btn--sm" onClick={noop}>
                {M.bookings.reschedule}
              </button>
              <button className="mga-btn mga-btn--secondary mga-btn--sm" onClick={noop}>
                <Icon name="trash" size={13} />
                {M.bookings.cancel}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

function NextBookingCard() {
  return (
    <section className="mga-card" aria-label={M.bookings.next}>
      <div className="mga-irow" style={{ padding: 0 }}>
        <span className="mga-itile">
          <Icon name="calendar" size={17} />
        </span>
        <div className="mga-meta" style={{ flex: 1 }}>
          <div className="mga-meta__lbl">{M.bookings.next}</div>
          <div className="mga-meta__val">
            {NEXT_BOOKING.label} · {NEXT_BOOKING.date} · {NEXT_BOOKING.time}
          </div>
        </div>
        <span className="mga-prow__chv">
          <Icon name="chevron-right" size={16} />
        </span>
      </div>
    </section>
  )
}

function ReferralsWidget() {
  return (
    <section className="mga-card" aria-label={M.referrals.title}>
      <div className="mga-whead">
        <h2 className="mga-whead__title" style={{ margin: 0, fontSize: 15 }}>
          {M.referrals.title}
        </h2>
        <button className="mga-link mga-link--quiet" onClick={noop}>
          {M.referrals.all} <span className="mga-badge mga-badge--pink">{COUNTS.referrals}</span> ›
        </button>
      </div>
      <div className="mga-irow">
        <span className="mga-itile mga-itile--teal">
          <Icon name="user" size={17} />
        </span>
        <div className="mga-meta">
          <div className="mga-meta__lbl">{M.referrals.insured}</div>
          <div className="mga-meta__val">{REFERRAL.person}</div>
        </div>
      </div>
      <div className="mga-refnum">
        <span className="mga-refnum__lbl">{M.referrals.number}</span>
        <span className="mga-refnum__val">{REFERRAL.number}</span>
        <span className="mga-badge mga-badge--amber">{M.referrals.inReview}</span>
      </div>
      <button className="mga-btn mga-btn--navy mga-btn--md mga-btn--block" style={{ marginTop: 8 }} onClick={noop}>
        {M.referrals.request}
      </button>
    </section>
  )
}

/* The chronic prescription moved OUT of the მიმართვები card (user, 2026-08-18): it is a
   different object, and sharing a card with an active referral is what crowded it.
   Layout follows the standing rule — the medication name owns its line, state and meta
   sit below it, the action is full width. Wording follows #11: renewal is a booked
   visit, so this row no longer contradicts დანიშნულებები. */
function ChronicRxWidget({ gated, guard }) {
  return (
    <section className="mga-card" aria-label={M.chronicRx.title}>
      <div className="mga-whead">
        <h2 className="mga-whead__title" style={{ margin: 0, fontSize: 15 }}>
          {M.chronicRx.title}
        </h2>
      </div>
      <div className="mga-rxrow">
        <span className="mga-itile">
          <Icon name="pill" size={17} />
        </span>
        <div className="mga-rxrow__body">
          <div className="mga-meta__val">{CHRONIC.med}</div>
          <div className="mga-hitem__meta">
            <span className="mga-badge mga-badge--amber">{M.chronicRx.state}</span>
            <span className="mga-meta__lbl">{M.chronicRx.meta(CHRONIC.daysLeft)}</span>
          </div>
          <div className="mga-h2__renewnote">{M.chronicRx.note}</div>
        </div>
      </div>
      {/* The action is the CARD's, not the row's, so it spans the full width instead of
          starting after the icon rail (user, 2026-08-18). Card with ONE action → full
          width; list rows with a per-row action keep the small auto-width button. */}
      <button
        className={'mga-btn mga-btn--secondary mga-btn--md mga-btn--block mga-rxrow__cta' + (gated ? ' mga-btn--locked' : '')}
        onClick={guard(noop)}
      >
        {M.chronicRx.cta}
        {gated ? <GateLock gated /> : <Icon name="chevron-right" size={12} />}
      </button>
    </section>
  )
}

export default function HealthHomeScreen({ visitDay, v2 = false }) {
  /* #14 — the renewal CTA on this screen is an insurance-funded action like the rest. */
  const { gated, guard, sheet } = usePurchaseGate()
  return (
    <>
      <TopBar />
      <ProductSwitcher v2={v2} active="health" />
      <div className="mga-body">
        <h1 className="mga-sect">{M.healthSection}</h1>
        {PERSONS.map((p) => (
          <button key={p.id} className="mga-card mga-prow" onClick={noop}>
            <span className="mga-prow__cross">
              <img className="mga-prodimg mga-prodimg--row" src={PRODUCT_IMG['health.png']} alt="" />
            </span>
            <span>
              <span className="mga-prow__name" style={{ display: 'block' }}>
                {p.name}
              </span>
              <span className="mga-prow__sub">{p.ocin}</span>
            </span>
            <span className="mga-prow__chv">
              <Icon name="chevron-right" size={16} />
            </span>
          </button>
        ))}
        <button className="mga-btn mga-btn--primary mga-btn--md mga-btn--block mga-btn--page" onClick={noop}>
          {M.newAppointment}
        </button>
        {!v2 && <CuratioBlock />}
        <BookingsWidget visitDay={visitDay} v2={v2} />
        {visitDay && !v2 && <NextBookingCard />}
        <ReferralsWidget />
        <ChronicRxWidget gated={gated} guard={guard} />
        {v2 && <HistoryRow />}
        <div className="mga-fabrow">
          <button className="mga-iconbtn mga-iconbtn--lg mga-iconbtn--raised" aria-label="Call support" onClick={noop}>
            <Icon name="phone" size={18} />
          </button>
        </div>
      </div>
      {sheet}
    </>
  )
}
