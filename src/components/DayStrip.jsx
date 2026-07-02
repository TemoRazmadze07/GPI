import Icon from '../lib/Icon.jsx'

/* DayStrip — horizontal selectable days with a per-day availability dot.
   The dot colour = availability level (many / few / none). A calendar button
   is the hook for the month-popover (react-day-picker) added later. */
export default function DayStrip({ days, selected, onSelect, onOpenCalendar }) {
  return (
    <div className="gpi-daystrip">
      <button className="gpi-daystrip__nav" aria-label="წინა" disabled>
        <Icon name="chevron-down" size={20} className="gpi-rot-90" />
      </button>
      <div className="gpi-daystrip__days">
        {days.map((d) => (
          <button
            key={d.key}
            className={`gpi-day ${d.key === selected ? 'is-active' : ''} ${d.level === 'none' ? 'is-empty' : ''}`}
            onClick={() => onSelect(d.key)}
            aria-pressed={d.key === selected}
          >
            <span className="gpi-day__dow">{d.dow}</span>
            <span className="gpi-day__num">{d.num}</span>
            <span className={`gpi-day__dot gpi-lvl--${d.level}`} />
          </button>
        ))}
      </div>
      <button className="gpi-daystrip__nav" aria-label="შემდეგი">
        <Icon name="chevron-down" size={20} className="gpi-rot-270" />
      </button>
      <button className="gpi-daystrip__cal" aria-label="კალენდარი" onClick={onOpenCalendar}>
        <Icon name="calendar" size={20} />
      </button>
    </div>
  )
}
