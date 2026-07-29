import { useEffect, useMemo, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import SearchField from './SearchField.jsx'
import { Button } from './Button.jsx'
import { MONTHS_FULL, WEEKDAYS } from '../data/booking.js'

/* FilterPopover — single-pane filter panel (design-system Filter Popover v1,
   BMLL-pattern, no-tabs variant agreed 2026-07-15). Left category rail +
   per-type value pane + footer (live staged count · clear · apply).
   Selections STAGE in a local draft; Apply commits via onApply and the
   parent closes. Closing any other way discards the draft.

   categories: [{ id, label, type: 'pills'|'multi'|'range',
                  options?: [{ id, label, count? }],      (pills/multi)
                  searchPlaceholder?,                      (multi)
                  presets?: [{ id, label, from, to }] }]   (range)
   value per category: pills/multi → string[] · range → { from: Date, to: Date|null } | null */

export function emptyDraft(categories) {
  const d = {}
  for (const c of categories) d[c.id] = c.type === 'range' ? null : []
  return d
}

export function activeValueCount(categories, value) {
  let n = 0
  for (const c of categories) {
    const v = value[c.id]
    if (c.type === 'range') n += v ? 1 : 0
    else n += v?.length || 0
  }
  return n
}

export const fmtDate = (d) =>
  `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`

/* Standard preset set for range categories (labels = t.filterBar.presets). */
export function datePresets(labels) {
  const now = new Date()
  const y = now.getFullYear()
  return [
    { id: 'last3m', label: labels.last3m, from: new Date(y, now.getMonth() - 3, now.getDate()), to: now },
    { id: 'last6m', label: labels.last6m, from: new Date(y, now.getMonth() - 6, now.getDate()), to: now },
    { id: 'last12m', label: labels.last12m, from: new Date(y - 1, now.getMonth(), now.getDate()), to: now },
    { id: 'thisYear', label: labels.thisYear, from: new Date(y, 0, 1), to: new Date(y, 11, 31) },
    { id: 'lastYear', label: labels.lastYear, from: new Date(y - 1, 0, 1), to: new Date(y - 1, 11, 31) },
  ]
}

/* dd.mm.yyyy (day/month may be 1 digit) → Date, or null. Rejects impossible
   dates (32.01…) by round-tripping through the Date constructor. */
const parseKaDate = (s) => {
  const m = /^\s*(\d{1,2})\.(\d{1,2})\.(\d{4})\s*$/.exec(s)
  if (!m) return null
  const [, d, mo, y] = m.map(Number)
  const date = new Date(y, mo - 1, d)
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : null
}

/* ---- pills / multi pane -------------------------------------------------- */

function TogglePills({ options, selected, onToggle }) {
  return (
    <div className="gpi-chips" role="group">
      {options.map((o) => {
        const on = selected.includes(o.id)
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            className={`gpi-chip${on ? ' is-selected' : ''}`}
            onClick={() => onToggle(o.id)}
          >
            {o.label}
            {o.count != null && <span className="gpi-chip__count">· {o.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

function MultiPane({ cat, selected, onToggle }) {
  const [q, setQ] = useState('')
  const shown = q
    ? cat.options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()))
    : cat.options
  return (
    <>
      <div className="gpi-fpop__multisearch">
        <SearchField value={q} onChange={setQ} placeholder={cat.searchPlaceholder} />
      </div>
      <TogglePills options={shown} selected={selected} onToggle={onToggle} />
    </>
  )
}

/* ---- range pane (compact dual-month calendar + presets) ------------------- */

const sameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

function RangeMonth({ year, month, range, onPick }) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7 // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const { from, to } = range || {}
  return (
    <div className="gpi-fcal__month">
      <div className="gpi-fcal__title">{MONTHS_FULL[month]} {year}</div>
      <div className="gpi-fcal__weekdays">
        {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
      </div>
      <div className="gpi-fcal__grid">
        {cells.map((d, i) => {
          if (d === null) return <span key={`e${i}`} />
          const date = new Date(year, month, d)
          const isFrom = sameDay(date, from)
          const isTo = sameDay(date, to)
          const inRange = from && to && date > from && date < to
          const cls = isFrom || isTo ? ' is-endpoint' : inRange ? ' is-inrange' : ''
          return (
            <button
              key={d}
              type="button"
              className={`gpi-fcal__day${cls}`}
              aria-pressed={isFrom || isTo || inRange}
              onClick={() => onPick(date)}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* Editable bound input (BMLL-aligned): free-typed dd.mm.yyyy commits LIVE once
   valid (so the footer count previews while typing); blur resyncs the text to
   the committed value; invalid text flags red on blur only. */
function BoundInput({ value, placeholder, label, onCommit }) {
  const [text, setText] = useState(value ? fmtDate(value) : '')
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    setText(value ? fmtDate(value) : '')
    setInvalid(false)
  }, [value ? value.getTime() : null])

  return (
    <input
      type="text"
      inputMode="numeric"
      className={`gpi-fcal__bound${invalid ? ' is-invalid' : ''}`}
      value={text}
      placeholder={placeholder}
      aria-label={label}
      aria-invalid={invalid}
      onChange={(e) => {
        setText(e.target.value)
        setInvalid(false)
        const d = parseKaDate(e.target.value)
        if (d) onCommit(d)
      }}
      onBlur={() => {
        if (text.trim() && !parseKaDate(text)) setInvalid(true)
        else {
          setText(value ? fmtDate(value) : '')
          setInvalid(false)
        }
      }}
    />
  )
}

function RangePane({ cat, range, onChange, t }) {
  /* Two months shown; with no selection = previous + current month (contract
     periods usually look BACK). Presets and typed dates NAVIGATE the view so
     the range start is always visible. */
  const now = new Date()
  const [view, setView] = useState(() =>
    range?.from
      ? new Date(range.from.getFullYear(), range.from.getMonth(), 1)
      : new Date(now.getFullYear(), now.getMonth() - 1, 1),
  )
  const goTo = (d) => setView(new Date(d.getFullYear(), d.getMonth(), 1))

  const pick = (date) => {
    if (!range?.from || (range.from && range.to)) onChange({ from: date, to: null })
    else if (date < range.from) onChange({ from: date, to: null })
    else onChange({ from: range.from, to: date })
  }
  const setFrom = (date) => {
    onChange({ from: date, to: range?.to && date > range.to ? null : range?.to || null })
    goTo(date)
  }
  const setTo = (date) => {
    if (range?.from && date >= range.from) onChange({ from: range.from, to: date })
    else onChange({ from: date, to: null })
  }

  const m2 = new Date(view.getFullYear(), view.getMonth() + 1, 1)
  return (
    <>
      <div className="gpi-fcal__range">
        <BoundInput value={range?.from || null} placeholder={t.datePlaceholder} label={t.rangeFrom} onCommit={setFrom} />
        <span className="gpi-fcal__dash" aria-hidden="true">—</span>
        <BoundInput value={range?.to || null} placeholder={t.datePlaceholder} label={t.rangeTo} onCommit={setTo} />
      </div>
      <div className="gpi-fcal">
        <button
          type="button"
          className="gpi-cal__nav gpi-fcal__nav gpi-fcal__nav--prev"
          aria-label={t.prevMonth}
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
        >
          <Icon name="chevron-left" size={16} />
        </button>
        <RangeMonth year={view.getFullYear()} month={view.getMonth()} range={range} onPick={pick} />
        <RangeMonth year={m2.getFullYear()} month={m2.getMonth()} range={range} onPick={pick} />
        <button
          type="button"
          className="gpi-cal__nav gpi-fcal__nav gpi-fcal__nav--next"
          aria-label={t.nextMonth}
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
        >
          <Icon name="chevron-right" size={16} />
        </button>
      </div>
      <div className="gpi-chips gpi-fpop__presets" role="group">
        {cat.presets.map((p) => {
          const on = range?.from && range?.to && sameDay(range.from, p.from) && sameDay(range.to, p.to)
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={!!on}
              className={`gpi-chip${on ? ' is-selected' : ''}`}
              onClick={() => {
                onChange({ from: p.from, to: p.to })
                goTo(p.from)
              }}
            >
              {p.label}
            </button>
          )
        })}
      </div>
    </>
  )
}

/* ---- popover ------------------------------------------------------------- */

export default function FilterPopover({ categories, applied, countRows, onApply, t }) {
  const [draft, setDraft] = useState(() => ({ ...emptyDraft(categories), ...applied }))
  const [activeId, setActiveId] = useState(categories[0].id)
  const active = categories.find((c) => c.id === activeId)

  const toggle = (catId, optId) =>
    setDraft((d) => {
      const cur = d[catId] || []
      return { ...d, [catId]: cur.includes(optId) ? cur.filter((x) => x !== optId) : [...cur, optId] }
    })

  /* An open-ended range (from picked, to pending) counts as a single day. */
  const counted = useMemo(() => {
    const v = { ...draft }
    for (const c of categories) {
      if (c.type === 'range' && v[c.id]?.from && !v[c.id].to) v[c.id] = { from: v[c.id].from, to: v[c.id].from }
    }
    return v
  }, [draft, categories])
  const n = countRows(counted)

  return (
    <div className="gpi-fpop" role="dialog" aria-label={t.filter}>
      <div className="gpi-fpop__body">
        <div className="gpi-fpop__rail" role="tablist" aria-orientation="vertical">
          {categories.map((c) => {
            const count = c.type === 'range' ? (draft[c.id] ? 1 : 0) : draft[c.id]?.length || 0
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={c.id === activeId}
                className={`gpi-fpop__cat${c.id === activeId ? ' is-active' : ''}`}
                onClick={() => setActiveId(c.id)}
              >
                {c.label}
                {count > 0 && <span className="gpi-fpop__catcount">{count}</span>}
              </button>
            )
          })}
        </div>
        <div className="gpi-fpop__pane" role="tabpanel">
          {active.type === 'pills' && (
            <TogglePills options={active.options} selected={draft[active.id] || []} onToggle={(o) => toggle(active.id, o)} />
          )}
          {active.type === 'multi' && (
            <MultiPane cat={active} selected={draft[active.id] || []} onToggle={(o) => toggle(active.id, o)} />
          )}
          {active.type === 'range' && (
            <RangePane cat={active} range={draft[active.id]} onChange={(r) => setDraft((d) => ({ ...d, [active.id]: r }))} t={t} />
          )}
        </div>
      </div>
      <div className="gpi-fpop__footer">
        <span className="gpi-fpop__count" aria-live="polite">{t.results(n)}</span>
        <Button variant="tertiary" size="sm" onClick={() => setDraft(emptyDraft(categories))}>
          {t.clear}
        </Button>
        <Button variant="primary" size="sm" onClick={() => onApply(counted)}>
          {t.apply}
        </Button>
      </div>
    </div>
  )
}
