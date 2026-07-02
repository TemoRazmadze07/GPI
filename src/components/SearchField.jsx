import Icon from '../lib/Icon.jsx'

/* SearchField — text input with a leading search glyph. Token-driven; mirrors
   the Figma Text Input field styling (md, neutral/400 border). */
export default function SearchField({ value, onChange, placeholder }) {
  return (
    <div className="gpi-search">
      <Icon name="search" size={16} />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
    </div>
  )
}
