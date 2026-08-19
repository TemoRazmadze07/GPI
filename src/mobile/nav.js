/* Tiny nav helpers for the mobile-app section. Two demo states live in the hash
   query and must survive page-to-page navigation, so all screens navigate
   through go():
     ?day=visit — visit-day mode (F-01 live queue)
     ?v=1       — ARCHIVED VERSION 1: the two-tab nav (Auto | Health) with Curatio as
                  a block inside the health dashboard. Kept reachable for reference
                  only — see below.
     ?doc=0     — NO personal doctor assigned (stakeholder comment #1,
                  2026-08-18): the V2 dash doctor card renders its empty
                  variant with the docselect CTA.
     ?ins=0     — UNINSURED (stakeholder comment #14, 2026-08-18): the user has a
                  Curatio health record but no GPI health cover, so insurance-funded
                  ACTIONS are gated while their own data stays open.
     ?from=<s>  — ORIGIN TAB for a cross-tab deep link (stakeholder comment #2,
                  2026-08-18): the Health dashboard's history row opens the
                  კურაციო tab's history hub, so back must return to Health and
                  not dump the user in another tab. Sticky like the rest, and
                  it evaporates once you navigate back to that origin.
   VERSION DEFAULT INVERTED 2026-08-18 (user, for stakeholder sharing): **V2 — the
   three-tab model — is what a bare link now renders**, because it is the concept
   under review. V1 is frozen archive behind an explicit `?v=1`. Every existing
   `?v=2` link keeps working (anything that is not `1` is V2), so nothing shared
   earlier breaks. */

export function hashQuery() {
  const h = window.location.hash
  const qi = h.indexOf('?')
  return new URLSearchParams(qi === -1 ? '' : h.slice(qi + 1))
}

export function isVisitDay() {
  return hashQuery().get('day') === 'visit'
}

export function isV2() {
  /* Not `=== '2'`: the bare link must render the canonical concept, and the old
     `?v=2` links already in circulation must keep landing on it. */
  return hashQuery().get('v') !== '1'
}

export function hasDoctor() {
  return hashQuery().get('doc') !== '0'
}

export function isInsured() {
  return hashQuery().get('ins') !== '0'
}

export function fromParam() {
  return hashQuery().get('from')
}

export function go(
  section,
  {
    day = isVisitDay(),
    v2 = isV2(),
    doc = hasDoctor(),
    ins = isInsured(),
    p = null,
    sec = null,
    from = fromParam(),
  } = {}
) {
  const q = []
  if (day) q.push('day=visit')
  if (!v2) q.push('v=1') /* only the archive needs marking now */
  if (!doc) q.push('doc=0')
  if (!ins) q.push('ins=0')
  /* Carried ONLY to its consumer. Previously it survived any navigation that was not
     the origin itself, so a stale `from=health` rode through more → curatio → hub and
     sent the hub's back button to the wrong tab (audit 2026-08-18). */
  if (from && section === 'histhub' && from !== section) q.push('from=' + from)
  if (p) q.push('p=' + p) /* V2: person scope for the e-ticket (dash → ticket) */
  if (sec) q.push('sec=' + sec) /* V2: history section (hub → section page) */
  window.location.hash = '#/mobile/' + section + (q.length ? '?' + q.join('&') : '')
}

/* Selected-person id carried in the hash query (V2 ticket scoping). */
export function personParam() {
  return hashQuery().get('p')
}

/* History section carried in the hash query (V2 hub → section page). */
export function sectionParam() {
  return hashQuery().get('sec')
}
