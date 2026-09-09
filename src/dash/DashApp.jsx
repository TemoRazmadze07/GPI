import { useEffect } from 'react'
import DashShell from './DashShell.jsx'
import DashboardScreen from './DashboardScreen.jsx'
import CuratioSection from './CuratioSection.jsx'
import CuratioSection2 from './CuratioSection2.jsx'
import VisaBenefitScreen from './VisaBenefitScreen.jsx'
import VisaBenefitScreenV1 from './VisaBenefitScreenV1.jsx'
import { D } from './strings.js'

/* Dashboard host (#/dash) — the client web dashboard, rebuilt on the design
   system as the surface the Curatio module will be prepared for.

   It is a SEPARATE project from the My-Cabinet booking application (src/screens
   + AppShell): its own shell, its own copy table, its own stylesheet, its own
   route tree. What it shares is the foundation — tokens.css, lib/Icon,
   components/{Avatar,Badge,Button,DemoBar,LanguageSwitcher} — and the booking
   flow itself, which it links into rather than re-implementing.

   Sections are routed as #/dash/<section>; `home` is the dashboard. Curatio
   (concept agreed 2026-08-26) lives at #/dash/curatio + …/curatio/history. */
export default function DashApp({ section = 'home' }) {
  useEffect(() => {
    document.title = D.meta.title
  }, [])

  return (
    <DashShell section={section} onHome={() => { window.location.hash = '#/dash' }}>
      {section === 'home' && <DashboardScreen />}
      {/* v2 PROMOTED 2026-09-07 (user's call): the merged concept — doctor + ticket
          on one line, the history page as the body — is what every entry point now
          lands on. v1 is PARKED at ?v=1, untouched, so the two can still be compared;
          both demo bars carry the toggle. Retiring v1 for good is a separate decision. */}
      {section === 'curatio' && (/[?&]v=1(?:&|$)/.test(window.location.hash) ? <CuratioSection /> : <CuratioSection2 />)}
      {/* The standalone history route is RETIRED (audit 2026-09-07 B1): v2 embeds the
          history, so a second home meant a second person selector one click away. Old
          deep links (#/dash/curatio/history?sec=) land on v2 with the section kept —
          CuratioHistory reads ?sec= off the hash whatever the path. Nothing deleted. */}
      {section === 'curatio/history' && <CuratioSection2 />}
      {/* Post-payment landing for the Visa campaign (2026-09-08): receipt → offer →
          2-step claim. ?eligible=0 = the receipt-only state for other cards; ?reward=perks
          flips the demo reward; ?v=1 = the parked receipt-first version (compare only). */}
      {section === 'visa-benefit' && (/[?&]v=1(?:&|$)/.test(window.location.hash) ? <VisaBenefitScreenV1 /> : <VisaBenefitScreen />)}
    </DashShell>
  )
}
