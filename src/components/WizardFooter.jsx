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
}) {
  const t = ka.wizard.footer
  return (
    <div className="gpi-wizard-footer">
      <div className="gpi-wizard-footer__inner">
        <Button variant="tertiary" size="md" leadingIcon="arrow-left" onClick={onBack}>
          {t.back}
        </Button>
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
