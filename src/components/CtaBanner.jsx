import Icon from '../lib/Icon.jsx'
import { Button } from './Button.jsx'
import { t as strings } from '../i18n/index.js'

/* CtaBanner — entry-point card for starting the booking wizard. */
export default function CtaBanner({ onStart }) {
  const t = strings.banner
  return (
    <div className="gpi-banner">
      <div className="gpi-banner__lead">
        <span className="gpi-banner__icon">
          <Icon name="stethoscope" size={24} />
        </span>
        <div className="gpi-banner__text">
          <h2 className="t-h3">{t.title}</h2>
          <p className="t-body gpi-banner__sub">{t.subtitle}</p>
        </div>
      </div>
      <Button variant="primary" size="md" leadingIcon="plus" onClick={onStart}>
        {t.cta}
      </Button>
    </div>
  )
}
