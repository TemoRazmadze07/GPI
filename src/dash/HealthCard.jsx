import Avatar from '../components/Avatar.jsx'
import Badge from '../components/Badge.jsx'
import Icon from '../lib/Icon.jsx'
import { ExpertiseMark } from './marks.jsx'
import { CardHead, LimitMeter, ActionTile, MetaRow, ListRow, RailSection, ProductCard } from './DashParts.jsx'
import { D } from './strings.js'
import { ASSETS } from '../lib/assets.js'
import { HEALTH, money, BOOKINGS, BOOKINGS_COUNT, REFERRALS, REFERRALS_COUNT } from './data.js'

/* ⚠️ PLACEHOLDER ILLUSTRATION: the design's empty referrals state uses a pair of
   doctors; the closest thing the prototype owns is the booking-flow empty art,
   which is the same pink monochrome family. Swap when GPI supplies the real one. */
const EMPTY_ILLUS = ASSETS.bookingEmpty

/* The health policy card. Main column = the policy (who, limits, what you can
   do about it); rail = the records it produces (bookings, referrals).

   Curatio integration (concept agreed 2026-08-26) = ENHANCE IN PLACE, the
   locked hybrid model: booking rows carry გადაჯავშნა (F-04), referral rows
   carry expiry/chronic + the renewal visit (F-03/F-05). The net-new lives in
   its own CuratioCard — nothing here is duplicated there. */

function BookingsRail({ items, onViewAll }) {
  if (!items.length) {
    return (
      <RailSection title={D.health.bookings}>
        <p className="dash-rsec__empty">{D.health.bookingsEmpty}</p>
      </RailSection>
    )
  }
  return (
    <RailSection title={D.health.bookings} count={BOOKINGS_COUNT} onViewAll={onViewAll}>
      {items.map((b) => (
        <ListRow
          key={b.id}
          lead={<Avatar src={b.photo} name={b.doctor} size={40} />}
          title={b.doctor}
          /* გადაჯავშნა (F-04, enhance-in-place — locked hybrid model): rides the
             META line, not a right rail (title/badge rule), and opens the
             EXISTING wizard's reschedule path with a real appointment id. */
          sub={
            <>
              {b.when}
              {b.apptId && (
                <>
                  {' · '}
                  <button
                    type="button"
                    className="gpi-link dash-link dash-link--inline"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.location.hash = `#/desktop/appointments/book/schedule?from=${b.apptId}`
                    }}
                  >
                    {D.cur.rebook}
                  </button>
                </>
              )}
            </>
          }
          trailing={
            <>
              <span className="dash-lrow__fact">{b.person}</span>
              <Badge color="success" size="sm">{D.status[b.status]}</Badge>
            </>
          }
        />
      ))}
    </RailSection>
  )
}

function ReferralsRail({ items, onViewAll }) {
  if (!items.length) {
    return (
      <RailSection title={D.health.referrals}>
        <div className="gpi-empty dash-rsec__emptybox">
          <img className="gpi-empty__illus" src={EMPTY_ILLUS} alt="" />
          <p className="gpi-empty__title">{D.health.referralsEmpty}</p>
        </div>
      </RailSection>
    )
  }
  return (
    <RailSection title={D.health.referrals} count={REFERRALS_COUNT} onViewAll={onViewAll}>
      {items.map((r) => (
        <ListRow
          key={r.id}
          lead={
            <span className="dash-lrow__disc">
              <Icon name="user" size={20} />
            </span>
          }
          title={r.person}
          /* F-03/F-05 enhance-in-place: an expiring chronic referral carries its
             deadline + the renewal path here, in the rail it already lives in.
             Renewal = a VISIT (mobile #11's locked wording), so the link opens
             the booking wizard. */
          sub={
            r.status === 'expiring' ? (
              <>
                {D.cur.hist.expiryIn(r.expiryDays)}
                {' · '}
                <button
                  type="button"
                  className="gpi-link dash-link dash-link--inline"
                  title={D.cur.hist.renewNote}
                  onClick={(e) => {
                    e.stopPropagation()
                    window.location.hash = '#/desktop/appointments/book'
                  }}
                >
                  {D.cur.hist.renew}
                </button>
              </>
            ) : null
          }
          trailing={
            <>
              {r.chronic && <Badge color="brand" size="sm">{D.cur.hist.chronic}</Badge>}
              <span className="dash-lrow__fact">{r.no}</span>
              <Badge color="warning" size="sm">{D.status[r.status]}</Badge>
            </>
          }
          /* No row-level onClick: the expiring row carries a REAL interactive
             child (the renewal link), and a button inside a button is invalid
             HTML. The row-open affordance returns when a referral details page
             exists to open — until then the stub earned nobody a chevron. */
        />
      ))}
    </RailSection>
  )
}

export default function HealthCard({ on = {}, bookings = BOOKINGS, referrals = REFERRALS }) {
  const rail = (
    <>
      <BookingsRail items={bookings} onViewAll={on.bookings} />
      <ReferralsRail items={referrals} onViewAll={on.referrals} />
    </>
  )
  return (
    <ProductCard tone="health" labelledBy="dash-health-title" rail={rail}>
      <CardHead
        title={HEALTH.person}
        titleId="dash-health-title"
        onSwitch={on.switchPerson}
        switchLabel={D.policy.switchPerson}
        note={HEALTH.nextPayment}
      />
      <p className="dash-pcard__state">{D.policy.renews(HEALTH.renews)}</p>
      <hr className="dash-rule" />

      <div className="dash-meters">
        {HEALTH.limits.map((l) => (
          <LimitMeter
            key={l.id}
            label={D.health.limits[l.id]}
            used={l.used}
            total={l.total}
            format={money}
          />
        ))}
      </div>

      <div className="dash-tiles">
        <ActionTile icon="calendar" label={D.health.actions.book} onClick={on.book} />
        <ActionTile icon="file-output" label={D.health.actions.referral} onClick={on.referralNew} />
        <ActionTile icon="receipt" label={D.health.actions.claim} onClick={on.claim} />
      </div>

      <MetaRow
        lead={<Avatar src={HEALTH.doctor.photo} name={HEALTH.doctor.name} size={48} />}
        title={HEALTH.doctor.name}
        sub={D.health.doctorRole}
        action={
          <button type="button" className="gpi-link dash-link" onClick={on.bookDoctor}>
            {D.health.doctorCta}
          </button>
        }
      />

      <MetaRow
        lead={<ExpertiseMark size={48} />}
        title={D.health.expertise.title}
        sub={D.health.expertise.sub}
        action={
          <button type="button" className="gpi-link dash-link" onClick={on.expertise}>
            {D.health.expertise.cta}
          </button>
        }
      />
    </ProductCard>
  )
}
