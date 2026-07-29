import Icon from '../lib/Icon.jsx'

/* Button — token-driven, mirrors the Figma Button component.
   variant: primary | secondary | tertiary. size: sm | md | lg. */
const ICON_BY_SIZE = { sm: 16, md: 20, lg: 24 } // icon/sm · icon/md · icon/lg tokens

export function Button({
  variant = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  children,
  ...rest
}) {
  const iconSize = ICON_BY_SIZE[size] || 20
  return (
    <button className={`gpi-btn gpi-btn--${variant} gpi-btn--${size}`} {...rest}>
      {leadingIcon && <Icon name={leadingIcon} size={iconSize} />}
      <span>{children}</span>
      {trailingIcon && <Icon name={trailingIcon} size={iconSize} />}
    </button>
  )
}

/* IconButton — square quick-action button used in table rows.
   tone: neutral | danger.
   The label ships in the DOM but is hidden by default (see .gpi-iconbtn__label).
   Mobile opts it back in where the button becomes a labelled card action: touch
   has no `title` tooltip, so an icon-only destructive action reads as a guess. */
export function IconButton({ icon, tone = 'neutral', title, ...rest }) {
  return (
    <button
      className={`gpi-iconbtn gpi-iconbtn--${tone}`}
      title={title}
      aria-label={title}
      {...rest}
    >
      <Icon name={icon} size={16} />
      {title && <span className="gpi-iconbtn__label">{title}</span>}
    </button>
  )
}
