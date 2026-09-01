import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import Field from '../components/Field.jsx'
import { Button } from '../components/Button.jsx'
import { P } from './strings.js'

/* LoginScreen — the redesigned /Account/Login. Same two fields the live portal
   asks for (personal number + birth date); everything else is new:

   · CONTEXT. The live screen says only „შეიყვანეთ მონაცემები" — a bare pair of
     fields reached from an SMS link is indistinguishable from phishing. The
     heading names the task and the lead line says no account is needed, which
     is the single most common reason people abandon this flow.
   · VALIDATION follows the locked pattern (2026-07-06): validate on submit,
     per-field inline messages, and each error clears the moment its own field
     is edited — never a generic "fix the marked fields" summary. */
export default function LoginScreen() {
  const [pid, setPid] = useState('')
  const [dob, setDob] = useState('')
  const [errors, setErrors] = useState({})

  const digits = (s) => s.replace(/\D/g, '')

  const onPid = (e) => {
    setPid(digits(e.target.value).slice(0, 11))
    if (errors.pid) setErrors((x) => ({ ...x, pid: undefined }))
  }

  /* Auto-slashes as you type — a date mask is the one place where letting the
     user type separators produces more errors than inserting them. */
  const onDob = (e) => {
    const d = digits(e.target.value).slice(0, 8)
    const parts = [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean)
    setDob(parts.join('/'))
    if (errors.dob) setErrors((x) => ({ ...x, dob: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!pid) next.pid = P.login.required
    else if (pid.length !== 11) next.pid = P.login.pidFormat
    if (!dob) next.dob = P.login.required
    else if (dob.length !== 10) next.dob = P.login.dobFormat
    setErrors(next)
    if (!Object.keys(next).length) window.location.hash = '#/pay/otp'
  }

  return (
    <form className="pay-card pay-stack" onSubmit={submit} noValidate>
      <div className="pay-stack__head">
        <h1 className="pay-h1">{P.login.title}</h1>
        <p className="pay-lead">{P.login.lead}</p>
      </div>

      <Field label={P.login.pid} required errorMsg={errors.pid}>
        <input
          className={`gpi-input${errors.pid ? ' is-error' : ''}`}
          value={pid}
          onChange={onPid}
          placeholder={P.login.pidPh}
          inputMode="numeric"
          autoComplete="off"
          aria-invalid={errors.pid ? true : undefined}
        />
      </Field>

      <Field label={P.login.dob} required errorMsg={errors.dob}>
        <input
          className={`gpi-input${errors.dob ? ' is-error' : ''}`}
          value={dob}
          onChange={onDob}
          placeholder={P.login.dobPh}
          inputMode="numeric"
          autoComplete="off"
          aria-invalid={errors.dob ? true : undefined}
        />
      </Field>

      <Button size="lg" className="pay-block" type="submit">
        {P.login.cta}
      </Button>

      <p className="pay-trust">
        <Icon name="lock" size={16} />
        <span>{P.pay.trust}</span>
      </p>
      <p className="pay-help">{P.login.help}</p>
    </form>
  )
}
