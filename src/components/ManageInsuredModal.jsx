import Modal from './Modal.jsx'
import Avatar from './Avatar.jsx'
import { Button } from './Button.jsx'
import { t as strings } from '../i18n/index.js'

/* ManageInsuredModal — housekeeping for the Step-1 insured list.
   Everyone except the POLICY HOLDER is removable; the holder owns this cabinet,
   so they're named in the closing note rather than rendered as an inert row the
   user can't act on.
   Removal is confirmed by ConfirmDialog upstream — this modal only reports the
   intent, it never mutates. */
export default function ManageInsuredModal({ people, onRemove, onClose }) {
  const t = strings.wizard.insured.modal
  const removable = people.filter((p) => p.relation !== 'owner')
  const holder = people.find((p) => p.relation === 'owner')

  return (
    <Modal
      title={t.title}
      closeLabel={t.close}
      onClose={onClose}
      footer={<Button variant="secondary" size="md" onClick={onClose}>{t.close}</Button>}
    >
      <p className="gpi-manage__intro">{t.intro}</p>

      <ul className="gpi-manage__list">
        {removable.map((p) => (
          <li className="gpi-manage__row" key={p.id}>
            <Avatar name={p.name} seed={p.avatar} size={40} />
            <span className="gpi-manage__meta">
              <span className="t-body gpi-manage__name">{p.name}</span>
              <span className="t-caption gpi-manage__id">{p.metaId || p.policyId}</span>
            </span>
            <Button
              variant="danger-tertiary"
              size="sm"
              leadingIcon="trash"
              aria-label={t.removeLabel(p.name)}
              onClick={() => onRemove(p)}
            >
              {t.remove}
            </Button>
          </li>
        ))}
      </ul>

      {holder && <p className="gpi-manage__note">{t.holder(holder.name)}</p>}
    </Modal>
  )
}
