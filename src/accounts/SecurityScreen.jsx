import PasswordForm from './PasswordForm.jsx'
import { kaAcc as ka } from './strings.js'

/* Security — V1 (sidebar console) page shell around the shared PasswordForm.
   V2 opens the same form in a modal instead (PasswordModal). */
export default function SecurityScreen() {
  return (
    <>
      <header className="acc-head">
        <h1 className="t-h2 acc-title">{ka.security.title}</h1>
      </header>
      <section className="acc-card">
        <PasswordForm />
      </section>
    </>
  )
}
