/* The OTP-protected block of the Curatio surface, shared by BOTH nav versions —
   V1's hub page (CuratioHubScreen) and V2's dashboard tab (CuratioDashScreen).
   Locked cards stay VISIBLE (dashed + lock badge, counts withheld) so users can
   see what exists before authenticating; tapping one opens the OTP sheet. After
   unlock the same rows become normal navigable cards plus a ჩაკეტვა action.
   Parent owns the gate state (useOtpGate) because the doctor card outside this
   zone shares it. */

import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'

function LockedCard({ icon, title, hint, onRequest }) {
  return (
    <button className="mga-card mga-prow mga-lockcard" onClick={onRequest}>
      <span className="mga-itile" style={{ background: 'var(--mga-lav)', color: 'var(--mga-lav-fg)' }}>
        <Icon name={icon} size={17} />
      </span>
      <span style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
        <span className="mga-meta__val" style={{ display: 'block' }}>{title}</span>
        <span className="mga-meta__lbl">{hint}</span>
      </span>
      <span className="mga-iconbtn mga-iconbtn--sm mga-iconbtn--tint" aria-label={M.dash.protectedHint}>
        <Icon name="lock" size={14} />
      </span>
    </button>
  )
}

function OpenCard({ icon, title, hint, onClick }) {
  return (
    <button className="mga-card mga-prow" onClick={onClick}>
      <span className="mga-itile">
        <Icon name={icon} size={17} />
      </span>
      <span style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
        <span className="mga-meta__val" style={{ display: 'block' }}>{title}</span>
        <span className="mga-meta__lbl">{hint}</span>
      </span>
      <span className="mga-prow__chv">
        <Icon name="chevron-right" size={16} />
      </span>
    </button>
  )
}

export default function ProtectedZone({ unlocked, request, relock, counts, onHistory, onTransfer }) {
  return (
    <>
      <div className="mga-locksect">
        <span className="mga-locksect__icon" aria-hidden="true">
          <Icon name="lock" size={12} />
        </span>
        <span className="mga-locksect__title">{M.dash.protectedTitle}</span>
        <span className="mga-locksect__hint">
          {unlocked ? M.dash.unlockedNote : M.dash.protectedHint}
        </span>
        {unlocked && (
          <button className="mga-link mga-link--quiet mga-link--underline" onClick={relock}>
            {M.dash.relock}
          </button>
        )}
      </div>

      {unlocked ? (
        <>
          <OpenCard
            icon="file-text"
            title={M.hub.historyTitle}
            hint={M.hub.historyCounts(counts)}
            onClick={onHistory}
          />
          <OpenCard
            icon="arrow-right-left"
            title={M.dash.transferTitle}
            hint={M.dash.lockedTransferHint}
            onClick={onTransfer}
          />
        </>
      ) : (
        <>
          <LockedCard
            icon="file-text"
            title={M.hub.historyTitle}
            hint={M.dash.lockedHistoryHint}
            onRequest={request}
          />
          <LockedCard
            icon="arrow-right-left"
            title={M.dash.transferTitle}
            hint={M.dash.lockedTransferHint}
            onRequest={request}
          />
        </>
      )}
    </>
  )
}
