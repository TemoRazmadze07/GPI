import { useEffect, useRef, useState } from 'react'
import Modal from '../components/Modal.jsx'
import { Button } from '../components/Button.jsx'
import { kaAcc as ka } from './strings.js'

/* CropModal — avatar crop step for NON-SQUARE uploads (user rule 2026-08-10:
   "we cannot resize, just crop").

   The frame is the LARGEST square the image allows (side = min(w, h)) and can
   only be MOVED along the long axis — never scaled. Consequences, all wanted:
   the saved photo is always the maximum resolution the source can give, it can
   never be upscaled, and it can never fall under the 200×200 minimum that a
   free-size frame would allow. A dashed circle inside the frame previews the
   round display crop, since the avatar renders as a circle everywhere.

   Keyboard: the frame is focusable and moves with the arrow keys (Shift = ×4,
   Home/End = ends) — dragging alone would fail WCAG 2.1.1.

   Export: canvas at the crop's NATURAL pixel size (no downscale, per the rule),
   JPEG 0.92, handed back as an object URL. Production should additionally cap
   stored avatars (~512–1024px) server-side. */

const STAGE_MAX = 420 // px — longest edge of the preview stage (desktop)
const STAGE_GUTTER = 80 // px — sheet padding + breathing room on phones

/* The stage size is the SCALE DENOMINATOR, not just a visual cap: the frame is
   positioned with `offset * scale`, so shrinking the stage in CSS alone would
   slide the frame off the image. It must be a number the component computes.
   Frozen at mount so a re-render mid-drag can't resize the stage under the
   pointer. */
function stageMax() {
  const vw = typeof window === 'undefined' ? STAGE_MAX : window.innerWidth
  return Math.max(220, Math.min(STAGE_MAX, vw - STAGE_GUTTER))
}

export default function CropModal({ src, onCancel, onConfirm }) {
  const [stage] = useState(stageMax)
  const [nat, setNat] = useState(null) // { w, h } natural size
  const [offset, setOffset] = useState(0) // crop position along the long axis, in NATURAL px
  const imgRef = useRef(null)
  const dragRef = useRef(null)

  useEffect(() => {
    const im = new Image()
    im.onload = () => {
      imgRef.current = im
      const w = im.naturalWidth
      const h = im.naturalHeight
      setNat({ w, h })
      setOffset(Math.round((Math.max(w, h) - Math.min(w, h)) / 2)) // start centered
    }
    im.src = src
    return () => {
      im.onload = null
    }
  }, [src])

  const landscape = nat ? nat.w >= nat.h : true
  const side = nat ? Math.min(nat.w, nat.h) : 0
  const range = nat ? Math.max(nat.w, nat.h) - side : 0
  const scale = nat ? stage / Math.max(nat.w, nat.h) : 1
  const dispW = nat ? Math.round(nat.w * scale) : 0
  const dispH = nat ? Math.round(nat.h * scale) : 0
  const dispSide = Math.round(side * scale)

  const clamp = (v) => Math.max(0, Math.min(range, Math.round(v)))

  const onPointerDown = (e) => {
    if (!nat || range === 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { start: landscape ? e.clientX : e.clientY, from: offset }
  }
  const onPointerMove = (e) => {
    if (!dragRef.current) return
    const now = landscape ? e.clientX : e.clientY
    setOffset(clamp(dragRef.current.from + (now - dragRef.current.start) / scale))
  }
  const endDrag = (e) => {
    if (!dragRef.current) return
    dragRef.current = null
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const onKeyDown = (e) => {
    if (!nat || range === 0) return
    const step = (e.shiftKey ? 4 : 1) * Math.max(1, Math.round(range / 20))
    const back = landscape ? 'ArrowLeft' : 'ArrowUp'
    const fwd = landscape ? 'ArrowRight' : 'ArrowDown'
    if (e.key === back) setOffset((o) => clamp(o - step))
    else if (e.key === fwd) setOffset((o) => clamp(o + step))
    else if (e.key === 'Home') setOffset(0)
    else if (e.key === 'End') setOffset(range)
    else return
    e.preventDefault()
  }

  const save = () => {
    const im = imgRef.current
    if (!im) return
    const canvas = document.createElement('canvas')
    canvas.width = side
    canvas.height = side
    const ctx = canvas.getContext('2d')
    ctx.drawImage(im, landscape ? offset : 0, landscape ? 0 : offset, side, side, 0, 0, side, side)
    canvas.toBlob((blob) => onConfirm(URL.createObjectURL(blob), side), 'image/jpeg', 0.92)
  }

  return (
    <Modal
      title={ka.crop.title}
      onClose={onCancel}
      className="acc-cropmodal"
      footer={
        <>
          <Button variant="tertiary" onClick={onCancel}>{ka.crop.cancel}</Button>
          <Button variant="primary" onClick={save} disabled={!nat}>{ka.crop.save}</Button>
        </>
      }
    >
      <p className="t-body-sm acc-desc">{ka.crop.hint}</p>
      <div className="acc-crop">
        {nat && (
          <div className="acc-crop__stage" style={{ width: dispW, height: dispH }}>
            <img className="acc-crop__img" src={src} alt="" draggable="false" />
            <div
              className="acc-crop__frame"
              style={{
                width: dispSide,
                height: dispSide,
                transform: landscape
                  ? `translateX(${Math.round(offset * scale)}px)`
                  : `translateY(${Math.round(offset * scale)}px)`,
                cursor: range === 0 ? 'default' : 'grab',
              }}
              tabIndex={0}
              role="slider"
              aria-label={ka.crop.frameLabel}
              aria-valuemin={0}
              aria-valuemax={range}
              aria-valuenow={offset}
              aria-orientation={landscape ? 'horizontal' : 'vertical'}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={onKeyDown}
            >
              <span className="acc-crop__circle" aria-hidden="true" />
            </div>
          </div>
        )}
        {nat && (
          <p className="t-caption acc-crop__size">
            {side}×{side} px
          </p>
        )}
      </div>
    </Modal>
  )
}
