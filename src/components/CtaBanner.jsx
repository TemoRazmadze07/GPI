import Icon from '../lib/Icon.jsx'
import { Button } from './Button.jsx'
import { t as strings } from '../i18n/index.js'

/* CtaBanner — the design's banner card: icon tile · title + sub · one action.
   Born as the booking wizard's entry point; generalised 2026-09-08 with
   ADDITIVE optional props (icon, tone, title, subtitle, cta, ctaIcon,
   ctaVariant, as, className) so other surfaces reuse the same anatomy instead
   of hand-building a lookalike. Every default resolves to the booking strings,
   so EmptyBookings/Appointments render exactly as before.
   · `as`   = heading tag (default h2 — pass 'h3' when the page owns an h2).
   · `tone` = 'brand' (default pink tile) | 'success' (green tile) — a banner
     that REPORTS an outcome rather than inviting an action.
   · `cta`  = pass null for a banner with no action at all. The lead then owns
     the full width, so the subtitle stops wrapping around a button. */
export default function CtaBanner({
  icon = 'stethoscope',
  tone = 'brand',
  title,
  subtitle,
  cta,
  ctaIcon = 'plus',
  ctaVariant = 'primary',
  as: Heading = 'h2',
  className,
  onStart,
}) {
  const t = strings.banner
  return (
    <div className={`gpi-banner${tone !== 'brand' ? ` gpi-banner--${tone}` : ''}${className ? ` ${className}` : ''}`}>
      <div className="gpi-banner__lead">
        <span className="gpi-banner__icon">
          <Icon name={icon} size={24} />
        </span>
        <div className="gpi-banner__text">
          <Heading className="t-h3">{title ?? t.title}</Heading>
          <p className="t-body gpi-banner__sub">{subtitle ?? t.subtitle}</p>
        </div>
      </div>
      {cta !== null && (
        <Button variant={ctaVariant} size="md" leadingIcon={ctaIcon} onClick={onStart}>
          {cta ?? t.cta}
        </Button>
      )}
    </div>
  )
}
