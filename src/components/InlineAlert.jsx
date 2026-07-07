import Icon from '../lib/Icon.jsx'

/* InlineAlert — soft-fill contextual notice (design-system component; Figma port
   pending). Read-only companion to Badge: same status/* semantic tokens, but a
   block-level container with icon + optional title + body. tone: success |
   warning | info | error. Error announces itself (role=alert); others are calm. */

const ICONS = {
  success: 'check',
  warning: 'alert-triangle',
  info: 'info',
  error: 'alert-circle',
}

export default function InlineAlert({ tone = 'info', title, children }) {
  return (
    <div className={`gpi-alert gpi-alert--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon name={ICONS[tone]} size={16} className="gpi-alert__icon" />
      <div className="gpi-alert__body">
        {title && <div className="gpi-alert__title">{title}</div>}
        {children && <div className="gpi-alert__text">{children}</div>}
      </div>
    </div>
  )
}
