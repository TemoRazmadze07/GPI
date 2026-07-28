import { Button } from './Button.jsx'
import { ka } from '../i18n/strings.js'

/* WizardFooter — sticky bottom action bar for the booking wizard.
   Full-bleed; inner content aligns to the 1280 grid. */
export default function WizardFooter({
  onBack,
  onContinue,
  canContinue = true,
  continueLabel,
  continueIcon = 'arrow-right',
  hint = null,
}) {
  const t = ka.wizard.footer
  // Hint explains WHY continue is blocked (e.g. an unfinished draft). MOBILE
  // swaps the dead disabled button for the hint (see mobile.css); desktop keeps
  // the disabled button and never shows the hint (base CSS hides it).
  const showHint = !!hint && !canContinue
  return (
    <div className="gpi-wizard-footer">
      <div className={`gpi-wizard-footer__inner ${showHint ? 'has-hint' : ''}`}>
        <Button variant="tertiary" size="md" leadingIcon="arrow-left" onClick={onBack}>
          {t.back}
        </Button>
        {showHint && <span className="gpi-wizard-footer__hint">{hint}</span>}
        <Button
          variant="primary"
          size="md"
          trailingIcon={continueIcon}
          onClick={onContinue}
          disabled={!canContinue}
        >
          {continueLabel || t.continue}
        </Button>
      </div>
    </div>
  )
}
