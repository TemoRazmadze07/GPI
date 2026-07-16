import Badge from '../components/Badge.jsx'
import { Button } from '../components/Button.jsx'
import Drawer from '../components/Drawer.jsx'
import Icon from '../lib/Icon.jsx'
import ProductTile from './ProductTile.jsx'
import { kaB2B } from './strings.js'
import { PRODUCTS, contractDetails } from './data/contracts.js'

const STATUS_BADGE = { active: 'success', ended: 'neutral' }

/* ContractDetailsDrawer — contract quick-view in the shared Drawer (concept
   locked in chat 2026-07-16). Generic header ("კონტრაქტის დეტალები"); the
   record identity (tile + name + status) and the contract № live in the BODY
   so every detail drawer shares the same header experience. Sections: identity
   · facts grid · what's included · documents (placeholder). Footer: close +
   view-policies deep-link (same target as the row ⋮ action). */
export default function ContractDetailsDrawer({ contract: r, onClose }) {
  const c = kaB2B.contracts
  const t = c.drawer
  const d = contractDetails(r)

  const facts = [
    { label: t.number, value: <span className="gpi-table__id">{r.id}</span> },
    { label: t.period, value: `${r.start} – ${r.end}` },
    { label: t.insured, value: `${r.insured} ${PRODUCTS[r.product].unit}` },
    { label: t.premium, value: d.premium },
    { label: t.schedule, value: d.schedule },
  ]

  return (
    <Drawer
      title={t.title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose}>
            {t.close}
          </Button>
          <Button
            variant="primary"
            size="md"
            trailingIcon="arrow-right"
            onClick={() => {
              window.location.hash = `#/b2b/policies/${r.product}?contract=${r.id}`
            }}
          >
            {c.actions.viewPolicies}
          </Button>
        </>
      }
    >
      <div className="b2b-cdrawer__identity">
        <ProductTile product={r.product} />
        <div className="b2b-cdrawer__idmeta">
          <span className="b2b-cdrawer__factlbl">{t.name}</span>
          <span className="b2b-cdrawer__name">{PRODUCTS[r.product].label}</span>
        </div>
        <Badge color={STATUS_BADGE[r.status]} dot>
          {c.status[r.status]}
        </Badge>
      </div>

      <dl className="b2b-cdrawer__facts">
        {facts.map((f) => (
          <div key={f.label} className="b2b-cdrawer__fact">
            <dt className="b2b-cdrawer__factlbl">{f.label}</dt>
            <dd className="b2b-cdrawer__factval">{f.value}</dd>
          </div>
        ))}
      </dl>

      <section className="b2b-cdrawer__sect">
        <h4 className="b2b-cdrawer__secttitle">{t.included}</h4>
        <ul className="b2b-cdrawer__list">
          {d.included.map((it) => (
            <li key={it.label} className="b2b-cdrawer__item">
              <span className="b2b-cdrawer__itemlbl">{it.label}</span>
              <span className="b2b-cdrawer__itemmeta">{it.meta}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="b2b-cdrawer__sect">
        <h4 className="b2b-cdrawer__secttitle">{t.documents}</h4>
        <button type="button" className="b2b-cdrawer__doc" onClick={() => {}}>
          <Icon name="file-text" size={20} />
          <span className="b2b-cdrawer__doclbl">{t.contractPdf}</span>
          <span className="b2b-cdrawer__docaction">
            <Icon name="download" size={16} />
            {t.download}
          </span>
        </button>
      </section>
    </Drawer>
  )
}
