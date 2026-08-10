import Modal from '../components/Modal.jsx'
import PasswordForm from './PasswordForm.jsx'
import { kaAcc as ka } from './strings.js'

/* PasswordModal — V2: password change opens over the profile page instead of
   living on its own console page. Same shared PasswordForm as V1. */
export default function PasswordModal({ onClose }) {
  return (
    <Modal title={ka.security.title} onClose={onClose} className="acc-pwmodal">
      <PasswordForm />
    </Modal>
  )
}
