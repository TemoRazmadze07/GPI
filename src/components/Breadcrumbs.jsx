/* Breadcrumbs — page-hierarchy trail (design-system Breadcrumbs v1).
   Global rule (2026-07-02): top-level pages render NO breadcrumb — pass an empty
   items array and the component returns null. Crumbs appear only when the page
   has real ancestors: items = [{ label, href? }]. A parent gets href ONLY when
   it has a page of its own (pure nav groups stay plain text). The current page
   is gray, non-interactive, and marked aria-current="page". */
export default function Breadcrumbs({ items = [], current, label }) {
  if (items.length === 0) return null
  return (
    <nav className="gpi-crumbs" aria-label={label}>
      <ol>
        {items.map((it) => (
          <li key={it.label}>
            {it.href ? <a href={it.href}>{it.label}</a> : <span>{it.label}</span>}
            <span className="gpi-crumbs__sep" aria-hidden="true">
              /
            </span>
          </li>
        ))}
        <li>
          <span className="gpi-crumbs__current" aria-current="page">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  )
}
