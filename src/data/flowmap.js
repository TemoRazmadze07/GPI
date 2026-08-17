/* Flow Map data — the internal index of every app → feature → flow, and the
   three links per flow:
     · figma  → the design frame in the GPI Foundation file
     · share  → the public production URL (to send to coworkers)
     · dev    → the local dev server (works whenever `npx vite` is running)

   The Map screen (src/screens/MapScreen.jsx) renders this generically, so
   adding a flow is just a new entry here — no UI changes needed.

   A flow gets a `share`/`dev` link only when it has a `hash` (i.e. it's built
   in the prototype), and a `figma` link only when it has a `figma` node query
   (i.e. a design frame exists). Flows with neither show "— not built".

   status: 'done' | 'in-progress' | 'planned' */

export const LINK_BASE = {
  // Figma Foundation file — append each flow's `figma` node query (e.g. ?node-id=104-8241).
  figma: 'https://www.figma.com/design/0tM9lZKxEjYLT35DbWBrVy/GPI-Foundation-File',
  // Production deploy for sharing with coworkers — GitHub Pages (repo TemoRazmadze07/GPI,
  // served under the /GPI/ subpath). Built + published by .github/workflows/deploy.yml on
  // every push to main. Study links become https://temorazmadze07.github.io/GPI/?study=1#<hash>.
  share: 'https://temorazmadze07.github.io/GPI',
  // Local dev server. Derived from the CURRENT origin at runtime so the copied
  // link always matches whatever port the server was assigned (autoPort), not a
  // stale hardcoded one. Falls back to :5173 only in a non-browser context.
  dev: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
}

export const apps = [
  {
    id: 'desktop',
    label: 'desktop',
    icon: 'monitor',
    sub: 'My Cabinet — web',
    features: [
      {
        id: 'appointments',
        label: 'appointments',
        status: 'in-progress',
        flows: [
          { id: 'list',   path: 'desktop/appointments',          label: 'all appointments',       status: 'done',        hash: '/desktop/appointments' },
          { id: 'book1',  path: '…/book',                        label: 'step 1 — insured',       status: 'done',        hash: '/desktop/appointments/book',          figma: '?node-id=89-1112' },
          { id: 'book2',  path: '…/book/schedule',               label: 'step 2 — doctor & time', status: 'done',        hash: '/desktop/appointments/book/schedule', figma: '?node-id=104-8241' },
          { id: 'book3',  path: '…/book/review',                 label: 'step 3 — review',        status: 'in-progress', hash: '/desktop/appointments/book/review' },
          { id: 'bookFirst', path: 'desktop/appointments/empty', label: 'first-time — empty state', status: 'in-progress', hash: '/desktop/appointments/empty', figma: '?node-id=89-1619' },
          { id: 'bookErr',   path: '…/book?state=error',         label: 'error states',           status: 'planned' },
        ],
      },
      { id: 'policies', label: 'policies', status: 'planned', flows: [] },
      { id: 'claims',   label: 'claims',   status: 'planned', flows: [] },
    ],
  },
  {
    id: 'mobile',
    label: 'mobile',
    icon: 'smartphone',
    sub: 'consumer — iOS / Android',
    features: [
      {
        id: 'curatio',
        label: 'ჩემი კურაციო — Curatio',
        status: 'in-progress',
        flows: [
          { id: 'mHealth',  path: 'mobile/health',  label: 'home — health dashboard',  status: 'in-progress', hash: '/mobile/health' },
          { id: 'mHub',     path: 'mobile/curatio', label: 'Curatio hub',              status: 'in-progress', hash: '/mobile/curatio' },
          { id: 'mTicket',  path: 'mobile/ticket',  label: 'e-ticket / queue (F-01)',  status: 'in-progress', hash: '/mobile/ticket' },
          { id: 'mHistory', path: 'mobile/history', label: 'medical history (F-02)',   status: 'in-progress', hash: '/mobile/history' },
        ],
      },
      {
        id: 'appointments-m',
        label: 'appointments',
        status: 'in-progress',
        flows: [
          // Same wizard route as desktop — the mobile UI lives in mobile.css (≤767).
          // ?ui=flat is the de-boxed comparison variant (2026-07-27); open on a phone.
          { id: 'book2Flat', path: '…/book/schedule?ui=flat', label: 'step 2 — de-boxed variant', status: 'in-progress', hash: '/desktop/appointments/book/schedule?ui=flat' },
          { id: 'bookM', path: 'mobile/appointments/book', label: 'book (mobile)', status: 'planned' },
        ],
      },
    ],
  },
  {
    id: 'b2b',
    label: 'b2b',
    icon: 'building-2',
    sub: 'business — web (CORPO)',
    features: [
      {
        id: 'shell',
        label: 'app shell',
        status: 'in-progress',
        flows: [
          { id: 'shell', path: 'b2b', label: 'navigation & layout', status: 'in-progress', hash: '/b2b' },
        ],
      },
      {
        id: 'contracts',
        label: 'contracts',
        status: 'in-progress',
        flows: [
          { id: 'list', path: 'b2b/contracts', label: 'contracts list', status: 'in-progress', hash: '/b2b/contracts' },
        ],
      },
      {
        id: 'policies',
        label: 'policies',
        status: 'in-progress',
        flows: [
          // One entry: the four product tabs (health/auto/travel/property) are
          // in-page navigation, so this link opens the whole section.
          { id: 'list', path: 'b2b/policies/health', label: 'policies list — 4 product tabs', status: 'in-progress', hash: '/b2b/policies/health' },
        ],
      },
      {
        id: 'insured',
        label: 'insured',
        status: 'in-progress',
        flows: [
          { id: 'addInsured', path: 'b2b/insured/add', label: 'add insured (wizard)', status: 'in-progress', hash: '/b2b/insured/add' },
          { id: 'excel', path: 'b2b/insured/add/excel', label: 'excel import — upload', status: 'in-progress', hash: '/b2b/insured/add/excel' },
          // ?demo= loads a bundled sample workbook straight into the validator —
          // the demo links for a live walkthrough (no file picking on stage).
          { id: 'excelDemo', path: '…/excel?demo=errors', label: 'excel import — demo file (7 errors)', status: 'in-progress', hash: '/b2b/insured/add/excel?demo=errors' },
          { id: 'excelDemoClean', path: '…/excel?demo=clean', label: 'excel import — demo file (all valid)', status: 'in-progress', hash: '/b2b/insured/add/excel?demo=clean' },
        ],
      },
      {
        id: 'finances',
        label: 'finances',
        status: 'in-progress',
        flows: [
          { id: 'invoices', path: 'b2b/invoices', label: 'invoices', status: 'in-progress', hash: '/b2b/invoices' },
          { id: 'statement', path: 'b2b/statement', label: 'statement (ამონაწერი)', status: 'in-progress', hash: '/b2b/statement' },
        ],
      },
      {
        id: 'guide',
        label: 'guide',
        status: 'in-progress',
        flows: [
          { id: 'guide', path: 'b2b/guide', label: 'employee guide — library & send (A|B via demo pill)', status: 'in-progress', hash: '/b2b/guide' },
          // Version B (2026-08-17): per-item detail + the EXTERNAL employee page
          // (#/guide/… — the SMS/email deep link, deliberately outside the shell).
          { id: 'guideItem', path: 'b2b/guide/onboarding', label: 'guide v B — bundle detail (internal)', status: 'in-progress', hash: '/b2b/guide/onboarding' },
          { id: 'guidePublic', path: 'guide/onboarding', label: 'guide v B — external employee page', status: 'in-progress', hash: '/guide/onboarding' },
        ],
      },
      {
        id: 'messages',
        label: 'messages',
        status: 'in-progress',
        flows: [
          { id: 'messages', path: 'b2b/messages', label: 'მიმოწერა — org↔GPI conversations', status: 'in-progress', hash: '/b2b/messages' },
          { id: 'thread', path: 'b2b/messages/c1', label: 'thread view (deep-link)', status: 'in-progress', hash: '/b2b/messages/c1' },
        ],
      },
    ],
  },
  {
    id: 'accounts',
    label: 'accounts',
    icon: 'user',
    sub: 'devaccounts.gpih.ge — identity console',
    features: [
      {
        id: 'console',
        label: 'account console',
        status: 'in-progress',
        flows: [
          /* V2 is a SINGLE page, so /accounts/personal and /accounts/security
             render the same screen — listing them as separate flows sent the
             reviewer to the same place three times. One entry per real
             destination: the live console, and the V1 sidebar kept for
             comparison (Rule 4). Responsive — same links on desktop + mobile. */
          { id: 'profile', path: 'accounts',       label: 'profile console (desktop + mobile)', status: 'in-progress', hash: '/accounts' },
          { id: 'v1',      path: 'accounts?v=1',   label: 'v1 sidebar console — comparison',    status: 'in-progress', hash: '/accounts?v=1' },
          /* Credential-linking states. Same `?demo=` quick-link idiom as the
             B2B excel import: the box is otherwise unreachable once dismissed
             („მოგვიანებით" writes a session flag), and the PHONE variant is
             unreachable full stop, since the seed data ships the phone linked.
             A demo link overrides the dismissal flag on purpose. */
          { id: 'linkEmail', path: 'accounts?demo=email',  label: 'linking — email not linked (box shown)', status: 'in-progress', hash: '/accounts?demo=email' },
          { id: 'linkPhone', path: 'accounts?demo=phone',  label: 'linking — phone not linked (box shown)', status: 'in-progress', hash: '/accounts?demo=phone' },
          { id: 'linkDone',  path: 'accounts?demo=linked', label: 'linking — both linked (no box)',         status: 'in-progress', hash: '/accounts?demo=linked' },
        ],
      },
    ],
  },
  {
    id: 'student',
    label: 'student',
    icon: 'graduation-cap',
    sub: 'Foreign Student Insurance — English-language purchase flow',
    features: [
      {
        id: 'purchase',
        label: 'buy a policy',
        status: 'in-progress',
        /* ONE destination: the wizard holds its step in React state rather than
           the URL (steps 2/3 are reached with Continue), so a per-step entry
           here would send the reviewer to the same screen three times — the
           stale-flow-map trap hit on the accounts console. Revisit if the steps
           ever get their own routes. */
        flows: [
          { id: 'flow', path: 'student', label: 'purchase wizard — step 1 built, step 3 built', status: 'in-progress', hash: '/student' },
        ],
      },
    ],
  },
]

/* Resolve a flow's three links (null where the flow can't offer that link).
   · share = ISOLATED study/participant link. The `?study` flag locks the app to
     THIS flow — no hub, no access to other (in-development) flows. This is the
     link you hand to usability-study participants.
   · dev   = full app on localhost (hub + all flows + start buttons) for developers.
   · download = link to a self-contained STATIC HTML snapshot of the flow (markup +
     inlined CSS; images/fonts load from the live host). One file per flow under
     /downloads/<slug>.html — for the dev team to open/save locally. Generated from
     the rendered app (see scripts, session log 2026-07-06), NOT hand-written. */
export function flowLinks(flow) {
  const slug = flow.hash ? flow.hash.replace(/^\//, '').replace(/\//g, '-') : null
  return {
    figma: flow.figma ? LINK_BASE.figma + flow.figma : null,
    share: flow.hash ? `${LINK_BASE.share}/?study=1#${flow.hash}` : null,
    dev: flow.hash ? `${LINK_BASE.dev}/#${flow.hash}` : null,
    download: slug ? `${LINK_BASE.share}/downloads/${slug}.html` : null,
  }
}

/* Count flows by status for an app (drives the metric tiles). */
export function countFlows(app) {
  const c = { total: 0, done: 0, 'in-progress': 0, planned: 0 }
  app.features.forEach((f) => f.flows.forEach((fl) => { c.total += 1; c[fl.status] += 1 }))
  return c
}
