import Icon from '../lib/Icon.jsx'
import { ASSETS } from '../lib/assets.js'
import { P } from './strings.js'

/* PayShell — the payment portal's chrome (Rule 5 surface, prefix `pay-`).

   HEADER IS 1:1 WITH THE ACCOUNTS CONSOLE (user, 2026-08-31): the floating
   white full-pill bar on surface-page — h72 / logo 40 / pad-inline 32 /
   elevation-card on desktop, collapsing to a FLUSH edge-to-edge band
   (radius 0, h64, logo 32, elevation-dropdown) below 768, which is the locked
   mobile header-band rule. Metrics and tokens are copied from `.acc-topbar`
   deliberately; see the note in payment.css about promoting this to one
   shared component now that it has a second consumer.

   Right cluster carries ONLY logout. The console's burger exists because its
   ENG pill + 266px email chip cannot fit a phone; a single compact pill can,
   so there is no burger and no drawer here — nothing to hide behind one.
   Logout is a QUIET outlined pill, not the live portal's solid-pink button:
   pink is reserved for the actual payment CTA. */
export default function PayShell({ children }) {
  return (
    <div className="pay-page">
      <header className="pay-topbar">
        <img className="pay-logo" src={ASSETS.logo} alt={P.shell.logoAlt} />
        <div className="pay-topbar__spacer" />
        <button
          className="pay-pill"
          type="button"
          onClick={() => {
            window.location.hash = '#/pay'
          }}
        >
          <Icon name="log-out" size={16} />
          <span>{P.shell.logout}</span>
        </button>
      </header>

      <main className="pay-main">{children}</main>
    </div>
  )
}
