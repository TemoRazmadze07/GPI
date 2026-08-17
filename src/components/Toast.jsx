import { useEffect } from 'react'
import Icon from '../lib/Icon.jsx'

/* Toast — transient confirmation message (design-system Toast v1; Figma port
   pending). Created 2026-08-17 for copy-link feedback (user rule: the control
   itself must NOT change — success is announced beside the flow, not inside
   it). The --elevation-toast token already existed in the foundation; this is
   its first consumer.

   v1 scope: one confirmation at a time, auto-dismiss, success tone. Queueing,
   action buttons and error tones arrive with a real second use case.

   `toast` is an OBJECT ({ text, tone?, icon? }) or null — callers create a
   fresh object per fire, so re-triggering while visible restarts the timer (a
   string prop with the same value would not). tone: success (default) |
   warning — warning exists because an action can fail for environment
   reasons (e.g. clipboard blocked) and silence would read as "broken".
   role=status → screen readers announce it without stealing focus. */
const TONE_ICON = { success: 'check', warning: 'info' }

export default function Toast({ toast, onDone, duration = 2400 }) {
  useEffect(() => {
    if (!toast) return undefined
    const id = setTimeout(() => onDone?.(), duration)
    return () => clearTimeout(id)
  }, [toast, duration, onDone])

  if (!toast) return null
  const tone = toast.tone || 'success'
  return (
    <div className={`gpi-toast gpi-toast--${tone}`} role="status">
      <span className="gpi-toast__ic">
        <Icon name={toast.icon || TONE_ICON[tone]} size={16} />
      </span>
      {toast.text}
    </div>
  )
}
