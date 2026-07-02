import { useState } from 'react'

/* Avatar — photo with graceful initials fallback. Sizes map to avatar tokens. */
function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function Avatar({ name = '', seed, size = 40 }) {
  const [failed, setFailed] = useState(false)
  const src = seed != null ? `https://i.pravatar.cc/120?img=${seed}` : null
  const style = { width: size, height: size, fontSize: Math.round(size * 0.4) }

  if (src && !failed) {
    return (
      <img
        className="gpi-avatar"
        style={style}
        src={src}
        alt={name}
        onError={() => setFailed(true)}
      />
    )
  }
  return (
    <span className="gpi-avatar gpi-avatar--initials" style={style} aria-label={name}>
      {initials(name)}
    </span>
  )
}
