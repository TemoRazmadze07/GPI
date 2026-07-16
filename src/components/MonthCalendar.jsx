import Icon from '../lib/Icon.jsx'

/* MonthCalendar — rebuilt to match the Step-2 design (Calendar instance
   I104:8769) exactly: 7 fixed 40px-wide cells with 2px gaps (=292px), each day
   a 40×32 PILL. Available days = a clinic-colour pill RING (conic gradient when
   a day spans multiple clinics); unavailable = light-grey number; selected =
   solid navy fill. Numbers = 14px navy (#0a1c5a); weekdays = 10px navy.
   Both the weekday row and the day grid use the SAME 7×40px grid so the
   columns line up precisely. */

export const KA_MONTHS_FULL = [
  'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
  'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი',
]
export const WEEKDAYS = ['ორშ', 'სამშ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვ']

function ringBackground(tones) {
  if (!tones || !tones.length) return null
  const colors = tones.map((t) => `var(--clinic-${t})`)
  if (colors.length === 1) return colors[0]
  const seg = 100 / colors.length
  const stops = colors.map((c, i) => `${c} ${i * seg}% ${(i + 1) * seg}%`).join(', ')
  return `conic-gradient(${stops})`
}

export default function MonthCalendar({ month, onPrevMonth, onNextMonth, isAvailable, getTones, selected, onSelect, canPrev = true, canNext = true }) {
  const year = month.getFullYear()
  const m = month.getMonth()
  const offset = (new Date(year, m, 1).getDay() + 6) % 7 // Monday-first
  const daysInMonth = new Date(year, m + 1, 0).getDate()
  const keyOf = (d) => `${year}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const cells = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="gpi-cal">
      <div className="gpi-cal__hd">
        <button className="gpi-cal__nav" onClick={onPrevMonth} disabled={!canPrev} aria-label="წინა თვე"><Icon name="chevron-left" size={20} /></button>
        <span className="gpi-cal__title">{KA_MONTHS_FULL[m]} {year}</span>
        <button className="gpi-cal__nav" onClick={onNextMonth} disabled={!canNext} aria-label="შემდეგი თვე"><Icon name="chevron-right" size={20} /></button>
      </div>

      <div className="gpi-cal__weekdays">
        {WEEKDAYS.map((w) => <span key={w} className="gpi-cal__dow">{w}</span>)}
      </div>
      <span className="gpi-cal__sep" />

      <div className="gpi-cal__grid">
        {cells.map((d, i) => {
          if (d === null) return <span key={`e${i}`} className="gpi-cal__cell" />
          const key = keyOf(d)
          if (!isAvailable(key)) {
            return <span key={key} className="gpi-cal__cell"><span className="gpi-cal__day gpi-cal__day--off">{d}</span></span>
          }
          const sel = key === selected
          if (sel) {
            return (
              <span key={key} className="gpi-cal__cell">
                <button className="gpi-cal__day gpi-cal__day--sel" onClick={() => onSelect(key)} aria-pressed>{d}</button>
              </span>
            )
          }
          const bg = ringBackground(getTones(key))
          return (
            <span key={key} className="gpi-cal__cell">
              <button className="gpi-cal__day gpi-cal__day--avail" onClick={() => onSelect(key)} aria-pressed={false}>
                <span className="gpi-cal__ring" style={bg ? { background: bg } : undefined}>
                  <span className="gpi-cal__num">{d}</span>
                </span>
              </button>
            </span>
          )
        })}
      </div>
    </div>
  )
}
