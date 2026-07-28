/* Health-mode Home of the MyGPI mobile app + the new "ჩემი კურაციო" block.
   Everything from the existing design is kept; the additions are: the Curatio
   quick-access card, the გადაჯავშნა booking action, the chronic-referral row,
   and (on visit day) the live queue strip — see project memory for the rationale.
   `visitDay` flips the booking card into its live F-01 state. */

import Icon from '../lib/Icon.jsx'
import { PRODUCT_IMG } from '../lib/assets.js'
import { M } from './strings.js'
import { PERSONS, BOOKING, NEXT_BOOKING, QUEUE, REFERRAL, CHRONIC, COUNTS } from './data.js'
import { go } from './nav.js'

const noop = () => {}

function TopBar() {
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
        <span className="mga-iconbtn__dot" aria-hidden="true" />
      </button>
      <button className="mga-pts" onClick={noop}>
        <Icon name="coins" size={14} />
        {M.points}
      </button>
    </div>
  )
}

function ProductSwitcher() {
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
      <button className="mga-seg__more" aria-label="More products" onClick={noop}>
        <Icon name="more-vertical" size={16} />
      </button>
    </div>
  )
}

function CuratioBlock() {
  /* doctor/reminders/prevention route to the hub (their cards live there) until
     dedicated pages exist; history has its own page. */
  const tiles = [
    { key: 'doctor', icon: 'stethoscope', label: M.curatio.doctor, to: 'curatio' },
    { key: 'history', icon: 'file-text', label: M.curatio.history, to: 'history' },
    { key: 'reminders', icon: 'bell', label: M.curatio.reminders, count: COUNTS.reminders, to: 'curatio' },
    { key: 'prevention', icon: 'shield-check', label: M.curatio.prevention, to: 'curatio' },
  ]
  return (
    <section className="mga-card mga-cur" aria-label={M.curatio.title}>
      <div className="mga-cur__head">
        <span className="mga-cur__mark" aria-hidden="true">
          <Icon name="activity" size={15} />
        </span>
        <h2 className="mga-cur__title" style={{ margin: 0, fontSize: 14 }}>
          {M.curatio.title}
        </h2>
        <button className="mga-cur__full" onClick={() => go('curatio')}>
          {M.curatio.full} ›
        </button>
      </div>
      <div className="mga-cur__tiles">
        {tiles.map((t) => (
          <button key={t.key} className="mga-qa" onClick={() => go(t.to)}>
            <span className="mga-qa__tile">
              <Icon name={t.icon} size={20} />
              {t.count > 0 && <span className="mga-qa__cnt">{t.count}</span>}
            </span>
            <span className="mga-qa__lbl">{t.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function BookingsWidget({ visitDay }) {
  return (
    <section className={'mga-card' + (visitDay ? ' mga-today-card' : '')} aria-label={M.bookings.title}>
      <div className="mga-whead">
        <h2 className="mga-whead__title" style={{ margin: 0, fontSize: 15 }}>
          {M.bookings.title}
        </h2>
        {visitDay ? (
          <span className="mga-badge mga-badge--pink">{M.bookings.today}</span>
        ) : (
          <button className="mga-all" onClick={noop}>
            {M.bookings.all} <span className="mga-badge mga-badge--pink">{COUNTS.bookings}</span> ›
          </button>
        )}
      </div>

      {visitDay ? (
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
            <div className="mga-queue__live">● {M.bookings.queueLive}</div>
          </div>
          <button className="mga-cta" style={{ margin: 0, padding: 11, borderRadius: 20 }} onClick={() => go('ticket')}>
            {M.bookings.ticket}
          </button>
          <button className="mga-remind" onClick={noop}>
            <Icon name="bell" size={12} />
            {M.bookings.remindEarlier}
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
            <span className="mga-badge mga-badge--green">● {M.bookings.active}</span>
          </div>
          <div className="mga-actions">
            <button className="mga-actbtn" onClick={noop}>
              {M.bookings.reschedule}
            </button>
            <button className="mga-linkbtn" onClick={noop}>
              <Icon name="trash" size={13} />
              {M.bookings.cancel}
            </button>
          </div>
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
        <button className="mga-all" onClick={noop}>
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
        <span className="mga-badge mga-badge--amber">● {M.referrals.inReview}</span>
      </div>
      <div className="mga-irow" style={{ paddingBottom: 2 }}>
        <span className="mga-itile mga-itile--red">
          <Icon name="pill" size={17} />
        </span>
        <div className="mga-meta" style={{ flex: 1 }}>
          <div className="mga-chronic__title">
            <span className="mga-meta__val">{CHRONIC.med}</span>
            <span className="mga-badge mga-badge--lav">{M.referrals.chronic}</span>
          </div>
          <div className="mga-chronic__exp">{M.referrals.expiresIn(CHRONIC.daysLeft)}</div>
        </div>
        <button className="mga-linkbtn" onClick={noop}>
          {M.referrals.renew} ›
        </button>
      </div>
      <button className="mga-cta mga-cta--navy" style={{ fontSize: 12.5, padding: 12, borderRadius: 22 }} onClick={noop}>
        {M.referrals.request}
      </button>
    </section>
  )
}

export default function HealthHomeScreen({ visitDay }) {
  return (
    <>
      <TopBar />
      <ProductSwitcher />
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
        <button className="mga-cta" onClick={noop}>
          {M.newAppointment}
        </button>
        <CuratioBlock />
        <BookingsWidget visitDay={visitDay} />
        {visitDay && <NextBookingCard />}
        <ReferralsWidget />
        <div className="mga-fabrow">
          <button className="mga-fab" aria-label="Call support" onClick={noop}>
            <Icon name="phone" size={18} />
          </button>
        </div>
      </div>
    </>
  )
}
