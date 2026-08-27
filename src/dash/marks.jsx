import Icon from '../lib/Icon.jsx'

/* Brand marks used by the dashboard host.

   ⚠️ THREE OF THE FOUR ARE STAND-INS — see each one's note. They are drawn to
   the right SIZE, WEIGHT and COLOUR so the layout is honest, but they are not
   the real artwork. Swapping them is a one-file job: drop the real exports into
   src/assets/ and replace the body of the component that needs them.

   They live here rather than in lib/Icon.jsx on purpose: Icon is a stroke-only
   Lucide UI set, and a brand mark is a filled logo. One primitive per job. */

/* ---------------------------------------------------------------------------
   BrunoMark — GPI's loyalty mascot (a piggy bank), used at three tiers:
     pink  = the points chip in the top bar
     blue  = Compact Bruno
     green = Starter Bruno
   ⚠️ STAND-IN. Needs the real bruno-{pink,blue,green}.svg export from GPI. */
const BRUNO_TONE = {
  pink: 'var(--color-pink-500)',
  blue: 'var(--color-sky-400)',
  green: 'var(--color-green-300)',
  current: 'currentColor',
}

export function BrunoMark({ size = 20, tone = 'pink', className = '' }) {
  const fill = BRUNO_TONE[tone] || BRUNO_TONE.current
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* ear */}
      <path d="M6.2 7.4 8.4 4.6a.5.5 0 0 1 .89.3l.06 3.3z" fill={fill} />
      {/* body */}
      <ellipse cx="11.2" cy="13.2" rx="7.6" ry="5.8" fill={fill} />
      {/* legs */}
      <rect x="6.4" y="17.4" width="2.6" height="3.2" rx="1.1" fill={fill} />
      <rect x="13.6" y="17.4" width="2.6" height="3.2" rx="1.1" fill={fill} />
      {/* snout */}
      <ellipse cx="19.1" cy="13.4" rx="2.7" ry="2.3" fill={fill} />
      <circle cx="18.4" cy="13.4" r="0.5" fill="#fff" />
      <circle cx="20" cy="13.4" r="0.5" fill="#fff" />
      {/* eye + coin slot, knocked out so the mark reads on any ground */}
      <circle cx="14.4" cy="11" r="0.85" fill="#fff" />
      <rect x="8.6" y="8.9" width="5.2" height="1.35" rx="0.68" fill="#fff" />
    </svg>
  )
}

/* ---------------------------------------------------------------------------
   VoovlyMark — GPI's auto-assistance brand. In the design it is the Georgian
   wordmark „ვევი" reversed out of a navy disc.
   ⚠️ STAND-IN: this is TYPESET, not the logo. It matches the design's shape,
   colours and optical weight, but the real lockup has its own letterforms.
   Needs voovly.svg from GPI. */
export function VoovlyMark({ size = 44, className = '' }) {
  return (
    <span
      className={`dash-mark dash-mark--voovly ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.3) }}
      aria-hidden="true"
    >
      ვევი
    </span>
  )
}

/* ---------------------------------------------------------------------------
   ExpertiseMark — the second-opinion partner behind „Medical Expertise Beyond
   Your Borders". The design shows a muted teal disc with a circular glyph.
   ⚠️ STAND-IN: a neutral globe on the partner's disc colour, because the
   partner has not been named to us. Do not ship this to production — either
   the partner's logo goes here or the row loses its mark. */
export function ExpertiseMark({ size = 44, className = '' }) {
  return (
    <span
      className={`dash-mark dash-mark--expertise ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Icon name="globe" size={Math.round(size * 0.55)} />
    </span>
  )
}

/* ---------------------------------------------------------------------------
   WhatsAppMark — third-party mark, drawn from the official glyph rather than
   approximated: a wrong WhatsApp logo is the one placeholder a reviewer will
   read as a bug. Colour is WhatsApp's own #25D366, which is outside our
   palette by design — a partner mark is not a semantic colour. */
export function WhatsAppMark({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#25D366"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  )
}
