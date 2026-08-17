import { useState } from 'react'

/* ClientMark — the shared ORGANISATION mark: the corporate client in the top-bar
   account chip, and either identity (client or GPI) on a messaging bubble.
   Renders a CIRCLE at --control-sm; shows the org's logo and falls back to
   initials — or an explicit `fallback` — if the asset is missing or fails to load.

   The comment here used to claim "rounded square (companies read as squares)",
   but .b2b-client__mark has always used --radius-full. Corrected 2026-08-17 when
   the GPI bubble mark was folded into this component so both sides of a thread
   share one shape; despite the name, this is not client-specific.

   `className` is an additive hook for the surface behind the logo. The default is
   --surface-card, which suits an asset that fills its own disc (the client logo);
   an emblem on transparency needs a tinted disc instead, or it floats on a white
   canvas with no avatar to read — see .b2b-msg__mark--gpi. */

function initials(name = '') {
  return name
    .trim()
    .replace(/^შპს\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function ClientMark({ name = '', logo = null, fallback, className }) {
  const [failed, setFailed] = useState(false)
  const showLogo = logo && !failed

  return (
    <span className={`b2b-client__mark${className ? ` ${className}` : ''}`} aria-hidden="true">
      {showLogo ? (
        <img src={logo} alt="" onError={() => setFailed(true)} />
      ) : (
        <span className="b2b-client__initials">{fallback || initials(name)}</span>
      )}
    </span>
  )
}
