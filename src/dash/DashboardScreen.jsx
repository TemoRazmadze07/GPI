import { useState } from 'react'
import DemoBar from '../components/DemoBar.jsx'
import { SectionHead } from './DashParts.jsx'
import PolicySummaryCard from './PolicySummaryCard.jsx'
import HealthCard from './HealthCard.jsx'
import AutoCard from './AutoCard.jsx'
import CuratioCard from './CuratioCard.jsx'
import { demo } from './curatioData.js'
import { D } from './strings.js'
import { POLICIES, POLICY_COUNT, BOOKINGS, REFERRALS } from './data.js'

/* The dashboard. Reads top-down as: what you own → your health policy → your
   auto policy. Each product card owns its own records, so nothing on this page
   is a list of mixed-product rows the reader has to re-sort in their head.

   The demo bar exposes the states the design shots cover — a referrals empty
   state, a single booking, and an auto-only account — because they are states,
   not separate pages, and a reviewer should be able to flip them. It hides
   itself on ?study links. */

const go = (hash) => () => {
  window.location.hash = hash
}

/* „Reuse already created components for the booking flow" — the dashboard's
   booking actions open the EXISTING My-Cabinet wizard rather than a second
   copy of it. That does leave this project for the application's shell, which
   is the honest prototype behaviour: there is one booking flow. */
const BOOK = go('#/desktop/appointments/book')
const ALL_BOOKINGS = go('#/desktop/appointments')

export default function DashboardScreen() {
  const [hasHealth, setHasHealth] = useState(() => !demo.uninsured())
  const [refs, setRefs] = useState(true)
  const [manyBookings, setManyBookings] = useState(true)
  const [visitDay, setVisitDay] = useState(demo.visitDay)

  const policies = hasHealth ? POLICIES : POLICIES.filter((p) => p.kind !== 'health')
  const bookings = manyBookings ? BOOKINGS : BOOKINGS.slice(0, 1)
  const referrals = refs ? REFERRALS : []

  const healthOn = {
    switchPerson: () => {},
    book: BOOK,
    bookDoctor: BOOK,
    referralNew: () => {},
    claim: () => {},
    expertise: () => {},
    bookings: ALL_BOOKINGS,
    referrals: () => {},
    referral: () => {},
  }

  const autoOn = {
    assistant: () => {},
    points: () => {},
    claim: () => {},
    chat: () => {},
    voovly: () => {},
    bruno: () => {},
  }

  return (
    <>
      <DemoBar
        actions={[
          { label: hasHealth ? 'auto-only account' : 'health + auto', onClick: () => { demo.setUninsured(hasHealth); setHasHealth((v) => !v) } },
          { label: visitDay ? 'ordinary day' : 'visit day', onClick: () => { demo.setVisitDay(!visitDay); setVisitDay(!visitDay) } },
          { label: refs ? 'no referrals' : 'referrals', onClick: () => setRefs((v) => !v) },
          { label: manyBookings ? '1 booking' : '3 bookings', onClick: () => setManyBookings((v) => !v) },
          {
            label: 'reset',
            ghost: true,
            onClick: () => {
              demo.setUninsured(false)
              demo.setVisitDay(false)
              setHasHealth(true)
              setRefs(true)
              setManyBookings(true)
              setVisitDay(false)
            },
          },
        ]}
      />

      <section className="dash-sec" aria-labelledby="dash-active-title">
        <SectionHead
          id="dash-active-title"
          title={D.sections.active}
          count={hasHealth ? POLICY_COUNT : POLICY_COUNT - 1}
          onViewAll={() => {}}
        />
        {/* The strip is as many columns as there are policies (capped at the
            three the design shows), so an auto-only account gets two half-width
            cards rather than two thirds and a hole. */}
        <div className="dash-strip" style={{ '--dash-cols': Math.min(policies.length, 3) }}>
          {policies.map((p) => (
            <PolicySummaryCard key={p.id} policy={p} onOpen={() => {}} />
          ))}
        </div>
      </section>

      {hasHealth && <HealthCard on={healthOn} bookings={bookings} referrals={referrals} />}
      <AutoCard on={autoOn} />
      {/* Placement A (locked): its OWN card, after the policies — and it renders
          for the auto-only account too, which is placement A's whole argument. */}
      <CuratioCard visitDay={visitDay} />
    </>
  )
}
