import { t as strings } from '../i18n/index.js'

/* PromoCard — cross-sell card shown beside the insured-selection step.
   Marketing image is a placeholder; swap for the real creative later. */
export default function PromoCard() {
  const t = strings.wizard.promo
  return (
    <aside
      className="gpi-promo"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(27,24,66,0.15) 0%, rgba(27,24,66,0.88) 100%), url(https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=70)',
      }}
    >
      <div className="gpi-promo__text">
        <p className="t-body gpi-promo__line">{t.line}</p>
        <p className="t-h3 gpi-promo__highlight">{t.highlight}</p>
      </div>
    </aside>
  )
}
