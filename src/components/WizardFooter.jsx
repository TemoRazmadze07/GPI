import { Button } from './Button.jsx'
import { t as strings } from '../i18n/index.js'

/* WizardFooter — sticky bottom action bar for the booking wizard.
   Full-bleed; inner content aligns to the 1280 grid. */
export default function WizardFooter({
  onBack,
  onContinue,
  canContinue = true,
  continueLabel,
  continueIcon = 'arrow-right',
  continueLeadingIcon,
  backLabel,
  showBack = true,
  hint = null,
}) {
  const t = strings.wizard.footer
  // Hint explains WHY continue is blocked (e.g. an unfinished draft). MOBILE
  // swaps the dead disabled button for the hint (see mobile.css); desktop keeps
  // the disabled button and never shows the hint (base CSS hides it).
  const showHint = !!hint && !canContinue
  return (
    <div className="gpi-wizard-footer">
      <div className={`gpi-wizard-footer__inner ${showHint ? 'has-hint' : ''}`}>
        {/* First step of a flow has nothing to go back to. The inner is a
            space-between row, so the button is replaced by an empty span rather
            than removed — otherwise Continue would jump to the left edge.
            `backLabel` lets a non-booking flow name its own destination. */}
        {showBack ? (
          <Button variant="tertiary" size="md" leadingIcon="arrow-left" onClick={onBack}>
            {backLabel || t.back}
          </Button>
        ) : (
          <span />
        )}
        {showHint && <span className="gpi-wizard-footer__hint">{hint}</span>}
        {/* A terminal action (pay, confirm) reads better with a leading cue than a
            forward arrow — `continueIcon={null}` drops the arrow entirely. */}
        <Button
          variant="primary"
          size="md"
          leadingIcon={continueLeadingIcon}
          trailingIcon={continueIcon || undefined}
          onClick={onContinue}
          disabled={!canContinue}
        >
          {continueLabel || t.continue}
        </Button>
      </div>
    </div>
  )
}
