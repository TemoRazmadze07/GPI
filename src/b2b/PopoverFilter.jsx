import { Fragment } from 'react'
import Icon from '../lib/Icon.jsx'
import { kaB2B } from './strings.js'

/* PopoverFilter — the grouped live-apply filter menu behind a [ფილტრი ▾ +N]
   trigger (concept locked on the notification popover, 2026-08-06 v3).

   PROMOTED to a shared B2B component 2026-08-15: the messaging popover +
   page are the second and third consumers (this codebase's stated trigger —
   see the DemoBar precedent). The CSS classes keep their `.b2b-notif__f*`
   names for now: renaming them is pure churn until the Figma port names the
   component properly; the provenance comment in b2b.css marks them as shared.

   Options apply LIVE and the menu STAYS OPEN, so status + category are one
   visit. The consumer owns all state (open/values) and outside-click closing —
   it must attach `anchorRef` to detect clicks off the anchor. */

function FilterOption({ selected, label, count = 0, onPick }) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      className={`b2b-notif__fopt ${selected ? 'is-sel' : ''}`}
      onClick={onPick}
    >
      <span className="b2b-notif__foptlabel">{label}</span>
      {selected ? (
        <Icon name="check" size={16} />
      ) : (
        count > 0 && <span className="b2b-notif__foptcount">{count}</span>
      )}
    </button>
  )
}

/* groups = [{ label, options: [{ id, label, count, selected, onPick }] }]
   `iconOnly` (2026-08-15, messages page): a compact square trigger for
   toolbars where the labelled button doesn't fit — same menu, same grammar;
   the active-count bubble is its only adornment. `align='right'` anchors the
   menu to the trigger's right edge (for triggers at a pane's right edge). */
export default function PopoverFilter({
  open,
  onToggle,
  anchorRef,
  activeCount,
  menuLabel,
  groups,
  iconOnly = false,
  align = 'left',
}) {
  return (
    <span className="b2b-notif__fanchor" ref={anchorRef}>
      {iconOnly ? (
        <button
          type="button"
          className={`b2b-popf-iconbtn${activeCount ? ' has-active' : ''}`}
          aria-label={`${kaB2B.filterBar.filter}${activeCount ? ` (${activeCount})` : ''}`}
          title={kaB2B.filterBar.filter}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={onToggle}
        >
          <Icon name="filter" size={16} />
          {activeCount > 0 && <span className="gpi-filterbar__count">{activeCount}</span>}
        </button>
      ) : (
        <button
          type="button"
          className={`gpi-btn gpi-btn--secondary gpi-btn--sm gpi-filterbar__btn${activeCount ? ' has-active' : ''}`}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={onToggle}
        >
          <Icon name="filter" size={16} />
          <span>{kaB2B.filterBar.filter}</span>
          {activeCount > 0 && <span className="gpi-filterbar__count">{activeCount}</span>}
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
        </button>
      )}
      {open && (
        <div
          className={`b2b-notif__fmenu${align === 'right' ? ' b2b-notif__fmenu--right' : ''}`}
          role="menu"
          aria-label={menuLabel}
        >
          {groups.map((g, i) => (
            <Fragment key={g.label}>
              <div className={`b2b-notif__fgroup${i > 0 ? ' b2b-notif__fgroup--divided' : ''}`}>
                {g.label}
              </div>
              {g.options.map((o) => (
                <FilterOption
                  key={o.id}
                  selected={o.selected}
                  label={o.label}
                  count={o.count}
                  onPick={o.onPick}
                />
              ))}
            </Fragment>
          ))}
        </div>
      )}
    </span>
  )
}
