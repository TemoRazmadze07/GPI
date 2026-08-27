import Icon from '../lib/Icon.jsx'
import { BrunoMark } from './marks.jsx'
import { D } from './strings.js'
import { TIERS } from './data.js'

/* One card of the ACTIVE POLICIES strip: what the policy is, its number, and
   the single fact that identifies it in the real world (who is insured / which
   car). The whole card is the target — the chevron is decoration on a button,
   not a second, smaller hit area. */
export default function PolicySummaryCard({ policy, onOpen }) {
  const tier = policy.tier ? TIERS[policy.tier] : null
  return (
    <button type="button" className="dash-psum" onClick={onOpen}>
      <span className="dash-psum__top">
        <span className={`dash-psum__disc dash-psum__disc--${policy.kind}`}>
          <Icon name={policy.kind === 'health' ? 'cross' : 'car'} size={24} />
        </span>
        <span className="dash-psum__id">
          <span className="dash-psum__name">{policy.name}</span>
          <span className="dash-psum__no">{policy.no}</span>
        </span>
        <Icon name="chevron-right" size={24} className="dash-psum__chev" />
      </span>
      <span className="dash-psum__meta">
        <span className="dash-psum__key">{D.policy[policy.metaKey]}:</span>
        <strong className="dash-psum__val">{policy.metaValue}</strong>
        {tier && (
          <span className="dash-psum__tier">
            <BrunoMark size={18} tone={tier.tone} />
            {tier.label}
          </span>
        )}
      </span>
      <span className="gpi-sr-only">{D.policy.open}</span>
    </button>
  )
}
