import { Button } from '../components/Button.jsx'
import { P } from './strings.js'
import { getPolicy, NEW_CARD, addCard, fmt, hashQuery } from './data.js'

/* BankStubScreen — a deliberately-marked STAND-IN for the Liberty Bank hosted
   payment page (libertypaytxtest.lb.ge). That page is the bank's and is NOT
   part of this redesign; the stub exists only so the prototype can demo the
   redirect round-trip. Styled like the DemoBar family (dashed frame, mono
   tag) so nobody mistakes it for a GPI design. mode=link is the 0.00 ₾
   card-tokenization transaction; mode=pay is a real charge. */
export default function BankStubScreen() {
  const mode = hashQuery().get('mode') || 'pay'
  const amount = mode === 'link' ? 0 : getPolicy().due

  const simulate = () => {
    addCard(NEW_CARD)
    window.location.hash = mode === 'link' ? '#/pay?linked=1' : '#/pay/done?m=new'
  }

  return (
    <div className="pay-bankframe">
      <span className="pay-bankframe__tag">{P.bank.tag}</span>
      <div className="pay-bankframe__body">
        <p className="pay-bankframe__note">{P.bank.note}</p>
        <p className="pay-bankframe__logo">ლიბერთი</p>
        <dl className="pay-bankframe__rows">
          <div>
            <dt>{P.bank.merchant}</dt>
            <dd>{P.bank.merchantValue}</dd>
          </div>
          <div>
            <dt>{P.bank.amount}</dt>
            <dd>{fmt(amount)}</dd>
          </div>
        </dl>
        <div className="pay-bankframe__fields">
          <input type="text" disabled placeholder={P.bank.cardPan} />
          <div className="pay-bankframe__fieldrow">
            <input type="text" disabled placeholder={P.bank.month} />
            <input type="text" disabled placeholder={P.bank.year} />
            <input type="text" disabled placeholder="CVV2" />
          </div>
        </div>
        <div className="pay-bankframe__actions">
          <Button variant="secondary" size="md" onClick={simulate}>
            {P.bank.simulateOk}
          </Button>
          <Button
            variant="tertiary"
            size="md"
            onClick={() => {
              window.location.hash = '#/pay'
            }}
          >
            {P.bank.backToPay}
          </Button>
        </div>
      </div>
    </div>
  )
}
