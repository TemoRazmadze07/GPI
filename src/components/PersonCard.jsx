import Avatar from './Avatar.jsx'

/* PersonCard — selectable insured-person card (Radio-Card pattern + avatar).
   Whole card is the radio target. */
export default function PersonCard({ person, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`gpi-person ${selected ? 'is-selected' : ''}`}
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(person.id)}
    >
      <Avatar name={person.name} seed={person.avatar} size={40} />
      <span className="gpi-person__meta">
        <span className="t-body gpi-person__name">{person.name}</span>
        <span className="t-caption gpi-person__id">{person.policyId}</span>
      </span>
      <span className="gpi-radio" aria-hidden="true">
        {selected && <span className="gpi-radio__dot" />}
      </span>
    </button>
  )
}
