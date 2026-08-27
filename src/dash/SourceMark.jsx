import CuratioMark from '../lib/CuratioMark.jsx'

/* SourceMark — a record's clinic-of-origin, the web twin of mobile's SourceTag:
   Curatio rows carry the real brand mark in Curatio blue, external rows read
   plain. Label ALWAYS present — colour is reinforcement, never the signal
   (WCAG 1.4.1), same rule the mobile component documents. */
export default function SourceMark({ src, label }) {
  return (
    <span className={`dash-srcmark${src === 'curatio' ? ' dash-srcmark--curatio' : ''}`}>
      {src === 'curatio' && <CuratioMark size={14} />}
      <span>{label}</span>
    </span>
  )
}
