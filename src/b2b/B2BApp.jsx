import B2BShell from './B2BShell.jsx'
import { Button } from '../components/Button.jsx'
import { kaB2B } from './strings.js'
import { NAV_MAIN, parentOf } from './nav.js'

/* B2BApp — routes #/b2b/<sectionId> to a stub page inside the shell.
   Real flows replace stubs one by one (per the agreed priority order). */

const LABELS = {}
for (const item of NAV_MAIN) {
  LABELS[item.id] = item.label
  item.children?.forEach((c) => (LABELS[c.id] = c.label))
}

function StubPage({ section }) {
  const t = kaB2B
  const page = t.pages[section] || { title: LABELS[section] || section, subtitle: '' }
  const parent = parentOf(section)
  const crumbs = [t.stub.breadcrumbRoot, parent && LABELS[parent], page.title].filter(Boolean)

  return (
    <>
      <div className="b2b-page__crumbs">{crumbs.join(' / ')}</div>
      <div className="b2b-page__head">
        <div>
          <h1 className="b2b-page__title">{page.title}</h1>
          {page.subtitle && <div className="b2b-page__subtitle">{page.subtitle}</div>}
        </div>
        <Button variant="secondary" size="md" leadingIcon="download">
          {t.stub.export}
        </Button>
      </div>
      <div className="b2b-page__stub">{t.stub.placeholder}</div>
    </>
  )
}

export default function B2BApp({ section = 'home' }) {
  const valid = section in LABELS ? section : 'home'
  return (
    <B2BShell
      active={valid}
      onNavigate={(id) => {
        window.location.hash = id === 'home' ? '#/b2b' : `#/b2b/${id}`
      }}
    >
      <StubPage section={valid} />
    </B2BShell>
  )
}
