/* FormSection — numbered group heading inside a wizard card ("① Personal
   details"), plus its content block.

   NEW component (flagged to the user 2026-08-10). The source mockup groups a
   long form into 3 numbered blocks and step 2 repeats the pattern, so this is a
   real repeating element rather than a one-off — hence a component, not inline
   markup. Purely presentational; all colour/size comes from tokens and t-*
   styles. The number is decorative (the heading text carries the meaning), so
   it is hidden from assistive tech. */
export default function FormSection({ n, title, children }) {
  return (
    <section className="stu-group">
      <h3 className="t-label stu-group__title">
        <span className="stu-group__n" aria-hidden="true">{n}</span>
        {title}
      </h3>
      {children}
    </section>
  )
}
