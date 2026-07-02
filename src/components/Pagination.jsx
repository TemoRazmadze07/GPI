import Icon from '../lib/Icon.jsx'

/* Pagination — page list with prev/next. Compact ellipsis for long ranges. */
function pageList(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1, 2, 3]
  if (current > 3) pages.push('…')
  if (!pages.includes(total)) pages.push(total)
  return pages
}

export default function Pagination({ current = 1, total = 10, onChange = () => {} }) {
  return (
    <nav className="gpi-pagination" aria-label="pagination">
      <button
        className="gpi-page gpi-page--nav"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        aria-label="previous"
      >
        <Icon name="chevron-down" size={20} className="gpi-rot-90" />
      </button>
      {pageList(current, total).map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="gpi-page gpi-page--gap">…</span>
        ) : (
          <button
            key={p}
            className={`gpi-page ${p === current ? 'is-active' : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}
      <button
        className="gpi-page gpi-page--nav"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
        aria-label="next"
      >
        <Icon name="chevron-down" size={20} className="gpi-rot-270" />
      </button>
    </nav>
  )
}
