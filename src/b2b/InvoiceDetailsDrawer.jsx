import Badge from '../components/Badge.jsx'
import { Button } from '../components/Button.jsx'
import Drawer from '../components/Drawer.jsx'
import Icon from '../lib/Icon.jsx'
import ProductTile from './ProductTile.jsx'
import { kaB2B } from './strings.js'
import { PRODUCTS } from './data/contracts.js'
import { invoiceLines, fmtGel, relDays } from './data/invoices.js'

/* InvoiceDetailsDrawer — invoice quick-view in the shared Drawer (concept
   agreed in chat 2026-07-20). Same detail-drawer language as the contract
   drawer (generic header, identity · facts · sections in the body) plus an
   amount HERO that carries the payment status, and the "what it covers"
   line-item breakdown. `გადახდა` hands off to GPI's embedded/redirect payment
   service — the payment flow itself is OUT OF SCOPE here (user 2026-07-20). */

const STATUS_BADGE = { overdue: 'error', due: 'warning', paid: 'success', credited: 'neutral' }
const HERO_TONE = { overdue: 'danger', due: 'warning', paid: 'success', credited: 'neutral' }

export default function InvoiceDetailsDrawer({ invoice: r, onClose, onPay }) {
  const c = kaB2B.invoices
  const t = c.drawer
  const unpaid = r.status === 'overdue' || r.status === 'due'
  const lines = invoiceLines(r)

  const heroMeta =
    r.status === 'overdue'
      ? t.dueOverdue(r.due, relDays(r))
      : r.status === 'due'
        ? t.dueSoon(r.due, relDays(r))
        : r.status === 'paid'
          ? t.paidOn(r.paidOn)
          : t.canceled

  const facts = [
    {
      label: t.contract,
      value: (
        <a
          className="gpi-table__link"
          href={`#/b2b/policies/${r.product}?contract=${r.contract}`}
        >
          {r.contract}
        </a>
      ),
    },
    { label: t.product, value: PRODUCTS[r.product].label },
    { label: t.period, value: r.period },
    { label: t.issued, value: r.issued },
    { label: t.due, value: r.due },
    ...(r.status === 'paid' ? [{ label: t.paidDate, value: r.paidOn }] : []),
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
          {unpaid && (
            <Button variant="primary" size="md" onClick={() => onPay(r)}>
              {c.actions.pay}
            </Button>
          )}
        </>
      }
    >
      <div className="b2b-cdrawer__identity">
        <ProductTile product={r.product} />
        <div className="b2b-cdrawer__idmeta">
          <span className="b2b-cdrawer__factlbl">
            <span className="gpi-table__id">{r.id}</span>
          </span>
          <span className="b2b-cdrawer__name">{PRODUCTS[r.product].label}</span>
        </div>
        <Badge color={STATUS_BADGE[r.status]} dot>
          {c.status[r.status]}
        </Badge>
      </div>

      <div className={`b2b-idrawer__hero b2b-idrawer__hero--${HERO_TONE[r.status]}`}>
        <div className="b2b-idrawer__herobody">
          <span className="b2b-idrawer__herolbl">{unpaid ? t.amountDue : t.amountPaid}</span>
          <span className="b2b-idrawer__heroamount">{fmtGel(r.amount)}</span>
          <span className="b2b-idrawer__herometa">{heroMeta}</span>
        </div>
        {unpaid && (
          <Button variant="primary" size="md" leadingIcon="credit-card" onClick={() => onPay(r)}>
            {c.actions.pay}
          </Button>
        )}
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
        <h4 className="b2b-cdrawer__secttitle">
          {t.breakdown} <span className="b2b-idrawer__illus">{t.illustrative}</span>
        </h4>
        <div className="b2b-idrawer__linesbox">
          <table className="b2b-idrawer__lines">
            <thead>
              <tr>
                <th>{t.colItem}</th>
                <th className="is-right">{t.colQty}</th>
                <th className="is-right">{t.colAmount}</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.label}>
                  <td>{l.label}</td>
                  <td className="is-right b2b-idrawer__qty">{l.qty}</td>
                  <td className="is-right">
                    <span className={`gpi-table__id${l.credit ? ' b2b-idrawer__credit' : ''}`}>
                      {fmtGel(l.amount)}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="is-total">
                <td>{t.total}</td>
                <td />
                <td className="is-right">
                  <span className="gpi-table__id">{fmtGel(r.amount)}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="b2b-cdrawer__sect">
        <h4 className="b2b-cdrawer__secttitle">{t.documents}</h4>
        <button type="button" className="b2b-cdrawer__doc" onClick={() => {}}>
          <Icon name="file-text" size={20} />
          <span className="b2b-cdrawer__doclbl">{t.invoicePdf}</span>
          <span className="b2b-cdrawer__docaction">
            <Icon name="download" size={16} />
            {t.download}
          </span>
        </button>
      </section>
    </Drawer>
  )
}
