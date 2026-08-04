/* Tiny nav helpers for the mobile-app section. Two demo states live in the hash
   query and must survive page-to-page navigation, so all screens navigate
   through go():
     ?day=visit — visit-day mode (F-01 live queue)
     ?v=2       — NAV VERSION 2: three-tab switcher (Auto | Health | კურაციო),
                  Curatio as its own dashboard with an OTP-locked zone.
   V1 (no ?v) stays the canonical two-tab + Curatio-block model. */

export function hashQuery() {
  const h = window.location.hash
  const qi = h.indexOf('?')
  return new URLSearchParams(qi === -1 ? '' : h.slice(qi + 1))
}

export function isVisitDay() {
  return hashQuery().get('day') === 'visit'
}

export function isV2() {
  return hashQuery().get('v') === '2'
}

export function go(section, { day = isVisitDay(), v2 = isV2(), p = null, sec = null } = {}) {
  const q = []
  if (day) q.push('day=visit')
  if (v2) q.push('v=2')
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
