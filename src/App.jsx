import { useState, useEffect } from 'react'
import AppShell from './components/AppShell.jsx'
import AppointmentsScreen from './screens/AppointmentsScreen.jsx'
import EmptyBookingsScreen from './screens/EmptyBookingsScreen.jsx'
import WizardScreen from './screens/WizardScreen.jsx'
import MapScreen from './screens/MapScreen.jsx'
import B2BApp from './b2b/B2BApp.jsx'

/* Tiny hash-router. URLs mirror the Flow Map hierarchy: app → feature → flow.
     #/map                                      → Flow Map console (internal hub)
     #/desktop/appointments                     → all-appointments list
     #/desktop/appointments/book                → booking wizard, step 1 (insured)
     #/desktop/appointments/book/schedule       → step 2 (doctor & time)
     #/desktop/appointments/book/review         → step 3 (review)
     #/desktop/appointments/book/done           → success (after confirm)

   Two audiences, two modes (decided by the URL — see the Flow Map's share/dev links):
     · STUDY (share link, `?study`) — usability-study participants. Locked to the
       ONE flow the link opened: the hub never renders and any attempt to reach it
       (or a bare URL) bounces back to that flow. So a participant only ever sees
       the single flow under test, never the index of in-development links.
     · INTERNAL (localhost or `?internal`) — developers. Full app incl. the hub.
   A production visit that is neither shows a neutral fallback, never the hub. */

const params = new URLSearchParams(window.location.search)
const STUDY = params.has('study')
const INTERNAL =
  params.has('internal') || ['localhost', '127.0.0.1'].includes(window.location.hostname)
const STUDY_ROOT_KEY = 'gpi.studyRoot'

function parseSegs() {
  const path = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return path.split('/').filter(Boolean)
}

// Query string carried INSIDE the hash (e.g. #/…/book/schedule?from=a5).
function parseHashQuery() {
  const h = window.location.hash
  const qi = h.indexOf('?')
  return new URLSearchParams(qi === -1 ? '' : h.slice(qi + 1))
}

function resolve(segs) {
  if (segs.length === 0 || segs[0] === 'map') return { view: 'map', wizardStep: 0 }
  if (segs[0] === 'b2b') return { view: 'b2b', wizardStep: 0, b2bSection: segs.slice(1).join('/') || 'home' }
  const ai = segs.indexOf('appointments')
  if (ai !== -1) {
    if (segs[ai + 1] === 'book') {
      const sub = segs[ai + 2]
      const wizardStep = sub === 'schedule' ? 1 : sub === 'review' ? 2 : sub === 'done' ? 3 : 0
      return { view: 'wizard', wizardStep }
    }
    // First-time booking flow starts on the empty All-Bookings page.
    if (segs[ai + 1] === 'empty') return { view: 'emptyBookings', wizardStep: 0 }
    return { view: 'appointments', wizardStep: 0 }
  }
  return { view: 'map', wizardStep: 0 }
}

function StudyFallback() {
  return (
    <div className="gpi-fmap" style={{ paddingTop: 80, textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
        გამოიყენეთ თქვენთვის გაზიარებული ბმული პროტოტიპის გასახსნელად.
      </p>
    </div>
  )
}

function Flow({ view, wizardStep, rescheduleFrom, editFrom, b2bSection, b2bContract }) {
  if (view === 'b2b') {
    return <B2BApp section={b2bSection} contract={b2bContract} />
  }
  return (
    <AppShell>
      {view === 'appointments' && (
        <AppointmentsScreen
          onStartBooking={() => {
            window.location.hash = '#/desktop/appointments/book'
          }}
          onReschedule={(id) => {
            window.location.hash = '#/desktop/appointments/book/schedule?from=' + id
          }}
          onEdit={(id) => {
            window.location.hash = '#/desktop/appointments/book/schedule?edit=' + id
          }}
        />
      )}
      {view === 'emptyBookings' && (
        <EmptyBookingsScreen
          onStartBooking={() => {
            window.location.hash = '#/desktop/appointments/book'
          }}
        />
      )}
      {view === 'wizard' && (
        <WizardScreen
          initialStep={wizardStep}
          rescheduleFrom={rescheduleFrom}
          editFrom={editFrom}
          onExit={() => {
            window.location.hash = '#/desktop/appointments'
          }}
        />
      )}
    </AppShell>
  )
}

export default function App() {
  const [segs, setSegs] = useState(parseSegs)

  useEffect(() => {
    const onHash = () => setSegs(parseSegs())
    window.addEventListener('hashchange', onHash)
    // Internal/dev with no hash → land on the hub. (Study/production never do this.)
    if (!STUDY && INTERNAL && !window.location.hash) {
      window.history.replaceState(null, '', '#/map')
      setSegs(parseSegs())
    }
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Study mode: remember the flow so clearing the hash can't reveal the hub.
  useEffect(() => {
    if (STUDY && resolve(segs).view !== 'map') {
      sessionStorage.setItem(STUDY_ROOT_KEY, window.location.hash)
    }
  }, [segs])

  const { view, wizardStep, b2bSection } = resolve(segs)
  const q = parseHashQuery()
  const rescheduleFrom = q.get('from')
  const editFrom = q.get('edit')
  const b2bContract = q.get('contract')
  const flowProps = { view, wizardStep, rescheduleFrom, editFrom, b2bSection, b2bContract }

  if (STUDY) {
    if (view === 'map') {
      const root = sessionStorage.getItem(STUDY_ROOT_KEY)
      if (root && root !== window.location.hash) {
        window.location.hash = root
        return null
      }
      return <StudyFallback />
    }
    return <Flow {...flowProps} />
  }

  if (view === 'map') {
    return INTERNAL ? <MapScreen /> : <StudyFallback />
  }

  return <Flow {...flowProps} />
}
