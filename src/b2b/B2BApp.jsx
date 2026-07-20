import B2BShell from './B2BShell.jsx'
import ContractsScreen from './ContractsScreen.jsx'
import PoliciesScreen from './PoliciesScreen.jsx'
import InvoicesScreen from './InvoicesScreen.jsx'
import StatementScreen from './StatementScreen.jsx'
import AddInsuredScreen from './AddInsuredScreen.jsx'
import { PRODUCT_ORDER } from './data/contracts.js'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { Button } from '../components/Button.jsx'
import { kaB2B } from './strings.js'
import { NAV_MAIN, parentOf } from './nav.js'

const SCREENS = { contracts: ContractsScreen, invoices: InvoicesScreen, statement: StatementScreen }

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

export default function B2BApp({ section = 'home', contract = null }) {
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
      <B2BShell active="policies" onNavigate={navigate}>
        <AddInsuredScreen step={segs[2] || 'method'} />
      </B2BShell>
    )
  }

  /* Policies: #/b2b/policies/<product> — key remounts the screen per tab so
     filter/search/page state starts clean on every product. Legacy kind-based
     routes (persons/vehicles/objects) map to their product tab. */
  const LEGACY_KIND = { persons: 'health', vehicles: 'auto', objects: 'property' }
  if (segs[0] === 'policies' || LEGACY_KIND[segs[0]]) {
    const product = LEGACY_KIND[segs[0]] || (PRODUCT_ORDER.includes(segs[1]) ? segs[1] : 'health')
    /* key includes the deep-linked contract so arriving from a contract row
       (?contract=CNT-…) remounts + reseeds the filter cleanly. */
    return (
      <B2BShell active="policies" onNavigate={navigate}>
        <PoliciesScreen key={`${product}:${contract || ''}`} product={product} initialContract={contract} />
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
