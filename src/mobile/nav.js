/* Tiny nav helpers for the mobile-app section. The demo day-state (?day=visit)
   lives in the hash query and must survive page-to-page navigation, so all
   screens navigate through go(). */

export function hashQuery() {
  const h = window.location.hash
  const qi = h.indexOf('?')
  return new URLSearchParams(qi === -1 ? '' : h.slice(qi + 1))
}

export function isVisitDay() {
  return hashQuery().get('day') === 'visit'
}

export function go(section, { day = isVisitDay() } = {}) {
  window.location.hash = '#/mobile/' + section + (day ? '?day=visit' : '')
}
