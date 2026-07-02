import Icon from '../lib/Icon.jsx'
import { Button } from './Button.jsx'
import { ka } from '../i18n/strings.js'

/* CtaBanner — entry-point card for starting the booking wizard. */
export default function CtaBanner({ onStart }) {
  const t = ka.banner
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
