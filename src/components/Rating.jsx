import { useState } from 'react'
import Icon from '../lib/Icon.jsx'

/* Rating — 1-to-5 star rating control (design-system Rating v1, created
   2026-08-17 for the external guide page; Figma port pending).

   ONE CLICK submits: there is no separate confirm button — clicking a star IS
   the vote (the user's explicit requirement). Hover/focus previews the fill up
   to that star so the click is never a guess.

   Read-only mode (`value` set + `readOnly`) renders the same stars filled, so
   "you rated this 4/5" needs no second component.

   A11y: radiogroup + radio semantics (a rating IS a single choice from a
   scale), each star individually focusable with a spoken label („4 ვარსკვლავი"),
   40px targets — well past the 24px floor in Rule 7. The stars are decorative
   SVG; the accessible name comes from aria-label, never from the icon. */
export default function Rating({ value = 0, onRate, label, starLabel, readOnly = false, max = 5 }) {
  const [preview, setPreview] = useState(0)
  const shown = preview || value

  return (
    <div
      className={`gpi-rating ${readOnly ? 'is-readonly' : ''}`}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={label}
      onMouseLeave={() => setPreview(0)}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
        const on = n <= shown
        if (readOnly) {
          return (
            <span key={n} className={`gpi-rating__star ${on ? 'is-on' : ''}`} aria-hidden="true">
              <Icon name="star" size={20} />
            </span>
          )
        }
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={starLabel ? starLabel(n) : `${n}`}
            className={`gpi-rating__star ${on ? 'is-on' : ''}`}
            onMouseEnter={() => setPreview(n)}
            onFocus={() => setPreview(n)}
            onBlur={() => setPreview(0)}
            onClick={() => onRate?.(n)}
          >
            <Icon name="star" size={24} />
          </button>
        )
      })}
    </div>
  )
}
