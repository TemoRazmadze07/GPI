import B2BShell from './B2BShell.jsx'
import ContractsScreen from './ContractsScreen.jsx'
import AddInsuredScreen from './AddInsuredScreen.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { Button } from '../components/Button.jsx'
import { kaB2B } from './strings.js'
import { NAV_MAIN, parentOf } from './nav.js'

const SCREENS = { contracts: ContractsScreen }

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
  /* Global breadcrumb rule: top-level pages get no crumbs. A parent crumb gets a
     link only once it has a landing page of its own (nav groups don't, today). */
  const crumbItems = parent ? [{ label: LABELS[parent] }] : []

  return (
    <>
      <Breadcrumbs items={crumbItems} current={page.title} label={t.crumbsLabel} />
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
  const navigate = (id) => {
    window.location.hash = id === 'home' ? '#/b2b' : `#/b2b/${id}`
  }

  /* Add-insured wizard: #/b2b/insured/add[/data|/review|/done]. The wizard is a
     canvas page inside the shell (concept 2026-07-06); nav highlights the
     insured group for context. Same element position on every sub-step so the
     React instance — and the batch state — survives step changes. */
  const segs = section.split('/')
  if (segs[0] === 'insured' && segs[1] === 'add') {
    return (
      <B2BShell active="persons" onNavigate={navigate}>
        <AddInsuredScreen step={segs[2] || 'method'} />
      </B2BShell>
    )
  }

  const valid = section in LABELS ? section : 'home'
  const Screen = SCREENS[valid]
  return (
    <B2BShell active={valid} onNavigate={navigate}>
      {Screen ? <Screen /> : <StubPage section={valid} />}
    </B2BShell>
  )
}
