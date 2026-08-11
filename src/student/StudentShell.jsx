import { ASSETS } from '../lib/assets.js'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import { lang, setLang } from '../i18n/index.js'

/* StudentShell — the purchase flow's own chrome, 1:1 with the reference design.

   NOT AppShell. The reference top bar carries ONLY the logo and the language
   switcher: no primary nav, no messages bell, no account chip. That is correct
   for a checkout — a purchase flow should not offer eight ways to leave it —
   but it is the opposite of My-Cabinet's shell, so this is a separate component
   rather than a pile of flags on the shared one (Rule 5: separate surfaces).

   Metrics read off the design: bar height 72, hairline `link/25` (the design's
   #F1F0FF exactly), logo 40 tall, content column 1216 centred — which is the
   existing `layout-max-width` 1280 minus the 32px page gutters, so the shared
   grid already lands on the design's 112px left edge. */
export default function StudentShell({ children }) {
  return (
    <div className="stu-shell">
      <header className="stu-topbar">
        <div className="stu-topbar__inner">
          <a className="stu-logo" href="#" aria-label="GPI — Vienna Insurance Group">
            <img className="stu-logo__img" src={ASSETS.logo} alt="GPI — Vienna Insurance Group" />
          </a>
          <LanguageSwitcher value={lang} onChange={setLang} />
        </div>
      </header>

      <main className="stu-main">
        <div className="stu-main__inner">{children}</div>
      </main>
    </div>
  )
}
