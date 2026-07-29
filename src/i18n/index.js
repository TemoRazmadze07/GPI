/* Locale resolution for the My-Cabinet prototype.

   Georgian (ka) is the primary delivery language; English (en) is the second locale,
   added for usability testing with non-Georgian speakers. `ka` stays the default —
   absent an explicit choice, nothing about the Georgian build changes.

   The active language is resolved ONCE at module load and exported as `t`, so every
   component can keep doing `import { t } from '../i18n/index.js'` with no context or
   hook plumbing. The trade-off is that switching language reloads the page — which is
   what `setLang` does. That matches how the rest of this prototype already behaves
   (`?ui=flat`, `?study=1`, `?internal` are all load-time flags) and keeps the language
   in the URL, so a tester can be sent straight to an English session.

   Resolution order:
     1. `?lang=` in the page query string      → ?lang=en#/desktop/appointments
     2. `?lang=` inside the hash route's query → #/desktop/appointments?lang=en
     3. the last choice persisted in localStorage
     4. 'ka'
*/

import { ka } from './strings.js'
import { en } from './strings.en.js'

export const LANGS = ['ka', 'en']
const STORAGE_KEY = 'gpi.lang'
const DEFAULT_LANG = 'ka'

const isLang = (v) => LANGS.includes(v)

/* The hash carries its own query string (e.g. #/…/book/schedule?from=a5), so `lang`
   has to be looked for there as well as in the page-level query. */
function fromHash() {
  const q = (window.location.hash || '').indexOf('?')
  if (q === -1) return null
  return new URLSearchParams(window.location.hash.slice(q + 1)).get('lang')
}

function stored() {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null // private mode / storage disabled — fall through to the default
  }
}

function resolveLang() {
  if (typeof window === 'undefined') return DEFAULT_LANG
  const fromQuery = new URLSearchParams(window.location.search).get('lang')
  for (const candidate of [fromQuery, fromHash(), stored()]) {
    if (isLang(candidate)) return candidate
  }
  return DEFAULT_LANG
}

export const lang = resolveLang()

/* The active string table. Components import this as `t`. */
export const t = lang === 'en' ? en : ka

/* The language the toggle switches TO (there are only two). */
export const otherLang = lang === 'en' ? 'ka' : 'en'

/* Screen readers and the browser's own UI need to know what language the page is in;
   it also drives correct hyphenation and font fallback. */
if (typeof document !== 'undefined') {
  document.documentElement.lang = lang
  document.title = t.misc.appTitle
}

/* Switch language. Persists the choice, writes it into the URL so the session can be
   shared or reloaded in the same language, then reloads to re-resolve the string table. */
export function setLang(next) {
  if (!isLang(next) || next === lang) return
  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Non-fatal: the URL parameter below still carries the choice.
  }
  const url = new URL(window.location.href)
  url.searchParams.set('lang', next)
  window.location.replace(url.toString())
}
