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
        id: 'appointments-m',
        label: 'appointments',
        status: 'planned',
        flows: [
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
    ],
  },
]

/* Resolve a flow's three links (null where the flow can't offer that link).
   · share = ISOLATED study/participant link. The `?study` flag locks the app to
     THIS flow — no hub, no access to other (in-development) flows. This is the
     link you hand to usability-study participants.
   · dev   = full app on localhost (hub + all flows + start buttons) for developers. */
export function flowLinks(flow) {
  return {
    figma: flow.figma ? LINK_BASE.figma + flow.figma : null,
    share: flow.hash ? `${LINK_BASE.share}/?study=1#${flow.hash}` : null,
    dev: flow.hash ? `${LINK_BASE.dev}/#${flow.hash}` : null,
  }
}

/* Count flows by status for an app (drives the metric tiles). */
export function countFlows(app) {
  const c = { total: 0, done: 0, 'in-progress': 0, planned: 0 }
  app.features.forEach((f) => f.flows.forEach((fl) => { c.total += 1; c[fl.status] += 1 }))
  return c
}
