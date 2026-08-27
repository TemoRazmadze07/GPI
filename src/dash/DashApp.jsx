import { useEffect } from 'react'
import DashShell from './DashShell.jsx'
import DashboardScreen from './DashboardScreen.jsx'
import CuratioSection from './CuratioSection.jsx'
import CuratioHistory from './CuratioHistory.jsx'
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
      {section === 'curatio' && <CuratioSection />}
      {section === 'curatio/history' && <CuratioHistory />}
    </DashShell>
  )
}
