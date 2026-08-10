import { useEffect, useRef } from 'react'

/* OtpInput — segmented one-time-code entry (one box per digit).
   SHARED component: any OTP surface should use this (contact verification
   today; login, mobile app and Curatio later) rather than a single text field.

   Controlled: the parent owns the string so it can clear it on a failed code.
   Behaviours that make segmented inputs usable — all expected by users:
   · typing a digit fills the box and advances
   · Backspace clears the current box, or steps back when the box is empty
   · ArrowLeft/Right move between boxes, Home/End jump to the ends
   · PASTING a full code anywhere distributes it across the boxes
   · onComplete fires as soon as the last digit lands (callers auto-submit)
   `autocomplete="one-time-code"` sits on the FIRST box only — that is what
   lets iOS/Android offer the SMS code; browsers spread it across the rest.
   Digits stay LTR regardless of the surrounding language. */
export default function OtpInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = false,
  ariaLabel,
}) {
  const refs = useRef([])

  useEffect(() => {
    if (autoFocus && refs.current[0]) refs.current[0].focus()
  }, [autoFocus])

  const digits = Array.from({ length }, (_, i) => value[i] || '')

  const push = (next) => {
    onChange(next)
    if (next.length === length && !next.includes(' ')) onComplete && onComplete(next)
  }

  const setAt = (i, char) => {
    const arr = Array.from({ length }, (_, k) => value[k] || ' ')
    arr[i] = char || ' '
    return arr.join('').replace(/\s+$/, '')
  }

  const focusBox = (i) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))]
    if (el) {
      el.focus()
      el.select()
    }
  }

  const onInput = (i) => (e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    if (!char) return
    const next = setAt(i, char)
    push(next)
    if (i < length - 1) focusBox(i + 1)
  }

  const onKeyDown = (i) => (e) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (digits[i]) push(setAt(i, ''))
      else if (i > 0) {
        push(setAt(i - 1, ''))
        focusBox(i - 1)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusBox(i - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusBox(i + 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusBox(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      focusBox(length - 1)
    }
  }

  const onPaste = (e) => {
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    e.preventDefault()
    push(pasted)
    focusBox(pasted.length >= length ? length - 1 : pasted.length)
  }

  return (
    <div className={`gpi-otp${error ? ' is-error' : ''}`} onPaste={onPaste} role="group" aria-label={ariaLabel}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          className="gpi-otp__box"
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={d.trim()}
          disabled={disabled}
          aria-label={`${i + 1}/${length}`}
          aria-invalid={error || undefined}
          onChange={onInput(i)}
          onKeyDown={onKeyDown(i)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  )
}
