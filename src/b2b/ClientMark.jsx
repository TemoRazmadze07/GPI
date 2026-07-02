import { useState } from 'react'

/* ClientMark — the corporate client's logo in the top-bar account chip.
   Rounded square (companies read as squares; people as round avatars).
   Shows the client logo; falls back to initials on a tinted square if the
   asset is missing or fails to load. */

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

export default function ClientMark({ name = '', logo = null, fallback }) {
  const [failed, setFailed] = useState(false)
  const showLogo = logo && !failed

  return (
    <span className="b2b-client__mark" aria-hidden="true">
      {showLogo ? (
        <img src={logo} alt="" onError={() => setFailed(true)} />
      ) : (
        <span className="b2b-client__initials">{fallback || initials(name)}</span>
      )}
    </span>
  )
}
