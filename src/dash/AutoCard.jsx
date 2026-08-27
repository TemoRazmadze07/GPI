import Avatar from '../components/Avatar.jsx'
import Badge from '../components/Badge.jsx'
import Icon from '../lib/Icon.jsx'
import { BrunoMark, VoovlyMark, WhatsAppMark } from './marks.jsx'
import { CardHead, ActionTile, MetaRow, ListRow, RailSection, ProductCard } from './DashParts.jsx'
import { D } from './strings.js'
import { AUTO, TIERS, VOOVLY, VOOVLY_COUNT, BRUNO, BRUNO_COUNT } from './data.js'

/* The auto policy card. Same anatomy as the health one — policy on the left,
   its records on the right — so the two read as one family rather than two
   designs. What differs is the content: auto's "records" are entitlements
   (Voovly assistance, Bruno loyalty), not medical documents. */

function BenefitRow({ item }) {
  const tier = item.tier ? TIERS[item.tier] : null
  return (
    <ListRow
      lead={
        <span className={`dash-lrow__disc${item.tint ? ` dash-lrow__disc--${item.tint}` : ''}`}>
          {item.mark === 'bruno' ? (
            <BrunoMark size={22} tone={item.tone} />
          ) : (
            <Icon name={item.icon} size={20} />
          )}
        </span>
      }
      title={item.label}
      titleBadge={item.free ? <Badge color="success" size="sm">{D.benefit.free}</Badge> : null}
      trailing={
        <>
          {item.value && <span className="dash-lrow__fact">{D.benefit[item.value]}</span>}
          {item.plate && <span className="dash-lrow__fact">{item.plate}</span>}
          {tier && (
            <span className="dash-lrow__tier">
              <BrunoMark size={18} tone={tier.tone} />
              {tier.label}
            </span>
          )}
        </>
      }
      onClick={item.plate ? () => {} : undefined}
    />
  )
}

export default function AutoCard({ on = {} }) {
  const tier = TIERS[AUTO.tier]
  const rail = (
    <>
      <RailSection title={D.auto.voovly} count={VOOVLY_COUNT} onViewAll={on.voovly}>
        {VOOVLY.map((v) => (
          <BenefitRow key={v.id} item={v} />
        ))}
      </RailSection>
      <RailSection title={D.auto.bruno} count={BRUNO_COUNT} onViewAll={on.bruno}>
        {BRUNO.map((b) => (
          <BenefitRow key={b.id} item={b} />
        ))}
      </RailSection>
    </>
  )

  return (
    <ProductCard tone="auto" labelledBy="dash-auto-title" rail={rail}>
      <CardHead
        title={D.auto.title}
        titleId="dash-auto-title"
        sub={
          <>
            <BrunoMark size={20} tone={tier.tone} />
            {tier.label}
          </>
        }
        note={AUTO.nextPayment}
      />
      <p className="dash-pcard__state">{D.policy.actives(AUTO.actives)}</p>
      <hr className="dash-rule" />

      <p className="dash-pcard__body">{D.auto.loyalty}</p>

      <div className="dash-tiles">
        {/* The Voovly tile's mark IS its disc (a navy lockup), so the tile's own
            disc tint steps aside rather than drawing a ring around a ring. */}
        <ActionTile
          tint="bare"
          mark={<VoovlyMark size={48} />}
          label={D.auto.actions.assistant}
          onClick={on.assistant}
        />
        <ActionTile
          tint="pink"
          mark={<BrunoMark size={26} tone="pink" />}
          label={D.auto.actions.points}
          onClick={on.points}
        />
        <ActionTile tint="blue" icon="receipt" label={D.auto.actions.claim} onClick={on.claim} />
      </div>

      <MetaRow
        lead={<Avatar src={AUTO.assistant.photo} name={AUTO.assistant.name} size={48} />}
        title={D.auto.chatWith(AUTO.assistant.name)}
        sub={AUTO.assistant.phone}
        action={
          <button type="button" className="gpi-link dash-link dash-wa" onClick={on.chat}>
            <WhatsAppMark size={24} />
            {D.auto.chatCta}
          </button>
        }
      />
    </ProductCard>
  )
}
