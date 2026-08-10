import Icon from '../lib/Icon.jsx'
import { Button } from '../components/Button.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import { kaAcc as ka } from './strings.js'

/* Overview — the console landing page as a small hub: the MyGPI hand-off is the
   hero action (doc requirement 5), the linking card persists until the account
   is linked (softening the "one-time popup": dismissing the popup must not
   burn the only chance), plus shortcuts into the two other pages. */
export default function OverviewScreen({ linked, onOpenLink, onGo }) {
  const shortcuts = [
    { id: 'personal', icon: 'user', label: ka.home.shortPersonal, hint: ka.home.shortPersonalHint },
    { id: 'security', icon: 'lock', label: ka.home.shortSecurity, hint: ka.home.shortSecurityHint },
  ]

  return (
    <>
      <header className="acc-head">
        <h1 className="t-h2 acc-title">{ka.home.greeting}</h1>
        <p className="t-body-sm acc-sub">
          {ka.home.signedInAs} <span className="acc-sub__mail">{ka.user.login}</span>
        </p>
      </header>

      <section className="acc-card acc-hero">
        <div className="acc-hero__txt">
          <h2 className="t-h4 acc-title">{ka.home.mygpiTitle}</h2>
          <p className="t-body acc-desc">{ka.home.mygpiDesc}</p>
        </div>
        <Button variant="primary" size="lg" trailingIcon="arrow-right">{ka.home.mygpiCta}</Button>
      </section>

      {linked ? (
        <InlineAlert tone="success" title={ka.home.linkedTitle}>{ka.home.linkedText}</InlineAlert>
      ) : (
        <section className="acc-card acc-hero">
          <div className="acc-hero__txt">
            <h2 className="t-h4 acc-title">{ka.home.linkTitle}</h2>
            <p className="t-body acc-desc">{ka.home.linkDesc}</p>
            <p className="t-caption acc-once">
              <Icon name="info" size={14} />
              {ka.home.linkOnce}
            </p>
          </div>
          <Button variant="secondary" size="lg" onClick={onOpenLink}>{ka.home.linkCta}</Button>
        </section>
      )}

      <section className="acc-card acc-shortcuts">
        {shortcuts.map((s) => (
          <button key={s.id} type="button" className="acc-short" onClick={() => onGo(s.id)}>
            <span className="acc-short__ic"><Icon name={s.icon} size={20} /></span>
            <span className="acc-short__txt">
              <span className="t-body acc-short__lbl">{s.label}</span>
              <span className="t-caption acc-short__hint">{s.hint}</span>
            </span>
            <Icon name="chevron-right" size={20} className="acc-short__chev" />
          </button>
        ))}
      </section>

      <p className="t-caption acc-privacy">
        {ka.home.privacy}{' '}
        <a className="acc-link" href="#/accounts" onClick={(e) => e.preventDefault()}>{ka.home.privacyMore}</a>
      </p>
    </>
  )
}
