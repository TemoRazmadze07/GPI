/* "ჩემი კურაციო" hub — what სრულად › opens. Aggregates and ROUTES; it never
   duplicates the dashboard's booking management. Person chips scope the
   per-patient content (doctor, history counts); ყველა aggregates with person
   labels downstream. The today-strip (visit day only) deep-links to the SAME
   e-ticket the home card opens. */

import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'
import { PERSONS, BOOKING, QUEUE, DOCTOR, HISTORY_COUNTS, NEXT_REMINDER, PREVENTION_NEXT } from './data.js'
import { go, isVisitDay } from './nav.js'

export default function CuratioHubScreen() {
  const [scope, setScope] = useState('all')
  const visitDay = isVisitDay()
  const counts = HISTORY_COUNTS[scope] || HISTORY_COUNTS.all

  return (
    <>
      <div className="mga-hdr">
        <button className="mga-back" aria-label="უკან" onClick={() => go('health')}>
          <Icon name="chevron-left" size={16} />
        </button>
        <span className="mga-hdr__mark" aria-hidden="true">
          <Icon name="activity" size={14} />
        </span>
        <h1 className="mga-hdr__title">{M.hub.title}</h1>
      </div>

      <div className="mga-chiprow" role="tablist" aria-label="პაციენტი">
        <button
          className={'mga-chip' + (scope === 'all' ? ' mga-chip--on' : '')}
          role="tab"
          aria-selected={scope === 'all'}
          onClick={() => setScope('all')}
        >
          {M.hub.allPersons}
        </button>
        {PERSONS.map((p) => (
          <button
            key={p.id}
            className={'mga-chip' + (scope === p.id ? ' mga-chip--on' : '')}
            role="tab"
            aria-selected={scope === p.id}
            onClick={() => setScope(p.id)}
          >
            {p.short}
          </button>
        ))}
      </div>

      <div className="mga-body" style={{ paddingTop: 0 }}>
        {visitDay && (
          <button className="mga-card mga-irow mga-strip" onClick={() => go('ticket')}>
            <span className="mga-badge mga-strip__bdg">{M.bookings.today}</span>
            <span className="mga-strip__txt">
              {M.hub.todayStrip(BOOKING.specialty, BOOKING.timeShort, QUEUE.number)}
            </span>
            <Icon name="chevron-right" size={16} style={{ color: 'var(--mga-pink-fg)' }} />
          </button>
        )}

        <section className="mga-card" aria-label={M.hub.doctorLabel}>
          <div className="mga-meta__lbl" style={{ marginBottom: 8 }}>{M.hub.doctorLabel}</div>
          <div className="mga-irow" style={{ padding: 0 }}>
            <span className="mga-doc__ava" aria-hidden="true">{DOCTOR.initial}</span>
            <div className="mga-meta" style={{ flex: 1 }}>
              <div className="mga-meta__val">{DOCTOR.name}</div>
              <div className="mga-meta__lbl">
                {DOCTOR.role} ·{' '}
                <span style={{ color: 'var(--mga-green-fg)', fontWeight: 600 }}>● {M.hub.online}</span>
              </div>
            </div>
          </div>
          <div className="mga-doc__next">
            {M.hub.nextVisit} <b>{DOCTOR.nextVisit}</b>
          </div>
          <div className="mga-doc__btns">
            <button className="mga-obtn" style={{ flex: 1 }}>{M.hub.book}</button>
            <button className="mga-obtn mga-obtn--pink" style={{ flex: 1 }}>{M.hub.details} ›</button>
          </div>
        </section>

        <button className="mga-card mga-prow" onClick={() => go('history')}>
          <span className="mga-itile">
            <Icon name="file-text" size={17} />
          </span>
          <span style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            <span className="mga-meta__val" style={{ display: 'block' }}>{M.hub.historyTitle}</span>
            <span className="mga-meta__lbl">{M.hub.historyCounts(counts)}</span>
          </span>
          <span className="mga-prow__chv">
            <Icon name="chevron-right" size={16} />
          </span>
        </button>

        <button className="mga-card mga-prow">
          <span className="mga-itile" style={{ background: 'var(--mga-amber-bg)', color: 'var(--mga-amber-fg)' }}>
            <Icon name="bell" size={17} />
          </span>
          <span style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            <span className="mga-meta__val" style={{ display: 'block' }}>{M.hub.remindersTitle}</span>
            <span className="mga-meta__lbl" style={{ color: 'var(--mga-amber-fg)', fontWeight: 600 }}>
              {NEXT_REMINDER.text}
            </span>
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--mga-pink-fg)', whiteSpace: 'nowrap' }}>
            {M.hub.manage} ›
          </span>
        </button>

        <button className="mga-card mga-prow">
          <span className="mga-itile" style={{ background: 'var(--mga-green-bg)', color: 'var(--mga-green-fg)' }}>
            <Icon name="shield-check" size={17} />
          </span>
          <span style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            <span className="mga-meta__val" style={{ display: 'block' }}>{M.hub.preventionTitle}</span>
            <span className="mga-meta__lbl">{PREVENTION_NEXT.text}</span>
          </span>
          <span className="mga-prow__chv">
            <Icon name="chevron-right" size={16} />
          </span>
        </button>

        <div className="mga-hub__soon">{M.hub.soon}</div>
      </div>
    </>
  )
}
