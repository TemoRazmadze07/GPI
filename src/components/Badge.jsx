/* Badge — soft-fill status pill, mirroring the Figma Badge component.
   color: success | warning | error | info | neutral | brand. size: sm | md. */
export default function Badge({ color = 'neutral', size = 'md', dot = false, children }) {
  return (
    <span className={`gpi-badge gpi-badge--${color} gpi-badge--${size}`}>
      {dot && <span className="gpi-badge__dot" />}
      {children}
    </span>
  )
}
