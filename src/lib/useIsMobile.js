import { useEffect, useState } from 'react'

/* useIsMobile — live `≤767px` flag, matching the breakpoint every mobile rule in
   styles/mobile.css uses. Load-time flags (?ui=flat, ?lang=) are the prototype's
   usual idiom, but the viewport genuinely changes at runtime (rotation, a dev
   dragging the window), so this one subscribes.

   Use it only where the difference is STRUCTURAL — a different design-system
   component or variant. Anything purely visual belongs in mobile.css. */
const QUERY = '(max-width: 767px)'

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    // The query can have flipped between the initial render and this effect.
    setIsMobile(mq.matches)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
