import { useId, useRef, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { Button } from './Button.jsx'

/* FileDropzone — shared kit. Drag-and-drop OR click/keyboard file selection.
   Carries no copy of its own: every string arrives as a prop, so it can serve
   B2B (Georgian, no i18n module) today and claims document upload later.

   The <input type="file"> is visually hidden with .gpi-sr-only (the clip
   technique) — NOT display:none and NOT hidden — because it must stay in the
   tab order and in the accessibility tree. That native input IS the
   keyboard/screen-reader path to the OS picker, which is what satisfies
   WCAG 2.2 SC 2.5.7 (dragging movements are never the only way) and SC 2.1.1.
   Never replace it with role="button" + inputRef.current.click(), and never
   add an onKeyDown here — Space/Enter already activate a focused file input,
   so a handler would open the picker twice. */
export default function FileDropzone({
  onFile,
  state = 'idle',
  file = null,
  error = null,
  announcement = '',
  accept = '.xlsx',
  acceptMime = '',
  maxSizeBytes = null,
  onReject,
  onClear,
  title,
  browseLabel,
  replaceLabel,
  hint = '',
  subhint = '',
  loadingLabel = '',
  clearLabel = '',
  formatSize,
  disabled = false,
  compact = false,
  /* Compact-state slots (2026-08-06): `compactLabel` renders a muted
     "<label>:" before the filename (mirrors the contract chip's "კონტრაქტი:"),
     `extra` is a caller-supplied node (e.g. import stats) shown between the
     file identity and the replace CTA. Both are ignored in the full state. */
  compactLabel = '',
  extra = null,
  className = '',
  inputRef: externalRef,
}) {
  const internalRef = useRef(null)
  const inputRef = externalRef || internalRef
  const base = useId()
  const inputId = `${base}-input`
  const hintId = `${base}-hint`
  const errId = `${base}-err`

  const [over, setOver] = useState(false)
  /* dragleave fires for every child element the pointer crosses, so a boolean
     alone flickers the highlight. Counting enters/leaves is the fix. */
  const dragDepth = useRef(0)
  const armed = !disabled && state !== 'loading'

  const fmt = formatSize || ((b) => (b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`))

  const handleFile = (f) => {
    /* Clearing the value first means re-picking the SAME file still fires
       `change` — otherwise a user who fixes their spreadsheet and re-selects it
       gets no response at all. */
    if (inputRef.current) inputRef.current.value = ''
    const okExt = accept
      .split(',')
      .some((a) => f.name.toLowerCase().endsWith(a.trim().toLowerCase()))
    if (!okExt) return onReject?.('type', f)
    if (maxSizeBytes && f.size > maxSizeBytes) return onReject?.('size', f)
    onFile(f)
  }

  const onDragEnter = (e) => {
    if (!armed) return
    e.preventDefault()
    dragDepth.current += 1
    setOver(true)
  }
  /* Without preventDefault on dragover the browser never fires `drop`. */
  const onDragOver = (e) => {
    if (!armed) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }
  const onDragLeave = (e) => {
    if (!armed) return
    e.preventDefault()
    dragDepth.current -= 1
    if (dragDepth.current <= 0) {
      dragDepth.current = 0
      setOver(false)
    }
  }
  const onDrop = (e) => {
    if (!armed) return
    e.preventDefault()
    dragDepth.current = 0
    setOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  /* `compact` is a LAYOUT state, not a different component: once the file has
     been read, it is context for the work below, not the work itself, so the
     same markup collapses to one row. The input is deliberately still here —
     unmounting the dropzone would drop keyboard focus to the body and take the
     drop target away. */
  const cls = [
    'gpi-dropzone',
    compact ? 'gpi-dropzone--compact' : '',
    over ? 'is-over' : '',
    error ? 'is-error' : '',
    state === 'loading' ? 'is-loading' : '',
    file ? 'is-filled' : '',
    disabled ? 'is-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls} onDragEnter={onDragEnter} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="gpi-sr-only"
        accept={acceptMime ? `${accept},${acceptMime}` : accept}
        disabled={disabled || state === 'loading'}
        aria-describedby={error ? `${hintId} ${errId}` : hintId}
        aria-invalid={error ? true : undefined}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />

      {compact ? (
        /* Compact: only the CTA is a <label> for the input — the file identity
           and the `extra` slot are plain read-out, so clicking the stats can
           never open the OS picker. Keyboard path stays the input itself. */
        <>
          <span className="gpi-dropzone__icon gpi-dropzone__tile" aria-hidden="true">
            <Icon name={over ? 'download' : 'file-text'} size={20} />
          </span>
          {compactLabel && <span className="gpi-dropzone__lbl">{compactLabel}:</span>}
          <span className="gpi-dropzone__file">
            <span className="gpi-dropzone__filename">{file?.name}</span>
            {file && <span className="gpi-dropzone__filemeta">{fmt(file.size)}</span>}
          </span>
          {extra && <span className="gpi-dropzone__extra">{extra}</span>}
          <label htmlFor={inputId} className="gpi-dropzone__cta">
            {state === 'loading' ? loadingLabel : replaceLabel || browseLabel}
          </label>
        </>
      ) : (
        <label htmlFor={inputId} className="gpi-dropzone__label">
          <span className="gpi-dropzone__icon">
            {/* The icon SHAPE changes on drag-over, not just its colour (SC 1.4.1). */}
            <Icon name={file ? 'file-text' : over ? 'download' : 'upload'} size={24} />
          </span>
          {file ? (
            <span className="gpi-dropzone__file">
              <span className="gpi-dropzone__filename">{file.name}</span>
              <span className="gpi-dropzone__filemeta">{fmt(file.size)}</span>
            </span>
          ) : (
            <span className="gpi-dropzone__title">{title}</span>
          )}
          <span className="gpi-dropzone__cta">
            {state === 'loading' ? loadingLabel : file ? replaceLabel || browseLabel : browseLabel}
          </span>
        </label>
      )}

      {onClear && file && state !== 'loading' && (
        <div className="gpi-dropzone__actions">
          <Button variant="tertiary" size="sm" type="button" leadingIcon="x" onClick={onClear}>
            {clearLabel}
          </Button>
        </div>
      )}

      {/* Compact hides the requirements line visually but keeps it in the DOM:
          aria-describedby points at it, and dropping the node would leave the
          input describing nothing. */}
      {hint && (
        <p id={hintId} className={compact ? 'gpi-sr-only' : 'gpi-dropzone__hint'}>
          {hint}
        </p>
      )}
      {subhint && !file && <p className="gpi-dropzone__hint">{subhint}</p>}

      {error && (
        <p id={errId} className="gpi-dropzone__err" role="alert">
          <Icon name="alert-circle" size={16} />
          {error}
        </p>
      )}

      {/* Mounted empty from the first render and only then filled: a live region
          that mounts already-populated is frequently not announced at all. */}
      <span className="gpi-sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
    </div>
  )
}
