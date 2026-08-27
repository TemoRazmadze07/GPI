/* Shared single-choice FILTER controls (pill + bottom sheet), lifted out of
   History2Screen on 2026-08-18 (#7): three screens now use them — the history
   sections, docselect (#1) and the upload sheet (#7) — and leaving them in a
   screen module meant the upload sheet would have imported its own parent.
   Same components, same markup; only the address changed. */

import Icon from '../lib/Icon.jsx'
import { M } from './strings.js'

/* Bottom-sheet single-choice picker for a filter pill (mga-sheet grammar).
   Exported: docselect (#1) reuses both, same as the booking flow reuses its
   own filter controls across steps. */
export function FilterSheet({ title, options, value, onPick, onClose }) {
  return (
    <div className="mga-sheetwrap" role="dialog" aria-modal="true" aria-label={title}>
      <button className="mga-sheetwrap__scrim" aria-label={M.otp.close} onClick={onClose} />
      <div className="mga-sheet">
        <div className="mga-sheet__grab" aria-hidden="true" />
        <div className="mga-sheet__head">
          <h2 className="mga-sheet__title">{title}</h2>
        </div>
        <div className="mga-fsheet">
          {options.map((o) => (
            <button
              key={o.id}
              className={'mga-fopt' + (value === o.id ? ' mga-fopt--on' : '')}
              aria-pressed={value === o.id}
              onClick={() => {
                onPick(o.id)
                onClose()
              }}
            >
              <span>{o.label}</span>
              {value === o.id && <Icon name="check" size={15} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FilterPill({ label, value, onOpen }) {
  /* One of two words, never both (user, 2026-08-26): the LABEL while the filter is
     at its „ყველა" default („კატეგორია ▾" = unset), the VALUE alone once something
     is chosen („კურაციო ▾"). „კლინიკა: გარე კლინიკები" pushed the row past the
     frame; a chosen value already names its own filter, so the prefix was paying
     width for nothing. `label` is optional — callers that always carry a value
     (period, year, docselect) simply show it. */
  return (
    <button className="mga-chip mga-fpill" onClick={onOpen}>
      <span>{value || label}</span>
      <Icon name="chevron-down" size={12} />
    </button>
  )
}
