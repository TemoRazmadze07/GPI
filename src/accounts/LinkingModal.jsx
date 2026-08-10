import Icon from '../lib/Icon.jsx'
import Modal from '../components/Modal.jsx'
import { Button } from '../components/Button.jsx'
import { kaAcc as ka } from './strings.js'

/* LinkingModal — the one-time account-linking offer (doc requirements 1 + 2).
   Auto-opened once per session by AccountsApp for unlinked accounts (the
   "migration popup"), and re-openable any time from the overview card.
   The verification step (OTP or other) is NOT designed yet — mechanics TBC
   with the dev team; confirming here just marks the account linked. */
export default function LinkingModal({ onConfirm, onClose }) {
  return (
    <Modal
      title={ka.linkModal.title}
      onClose={onClose}
      className="acc-linkmodal"
      footer={
        <>
          <Button variant="tertiary" onClick={onClose}>{ka.linkModal.later}</Button>
          <Button variant="primary" onClick={onConfirm}>{ka.linkModal.confirm}</Button>
        </>
      }
    >
      <p className="t-body acc-desc">{ka.linkModal.body}</p>
      <div className="acc-phone">
        <Icon name="phone" size={20} />
        <span className="t-h4">{ka.user.phoneMasked}</span>
      </div>
      <p className="t-body-sm acc-desc">{ka.linkModal.benefit}</p>
    </Modal>
  )
}
