/* Card — white surface panel with card elevation. Generic container. */
export default function Card({ className = '', padding = 24, children, ...rest }) {
  return (
    <section className={`gpi-card ${className}`} style={{ padding }} {...rest}>
      {children}
    </section>
  )
}
