import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { Button } from '../components/Button.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import { kaAcc as ka } from './strings.js'

/* PasswordForm — the password-change form, extracted so BOTH homes share one
   implementation: the V1 security page (SecurityScreen) and the V2 modal
   (PasswordModal). Global form-validation pattern (2026-07-06): per-field
   inline errors on submit-attempt, errors clear LIVE on edit, success renders
   green. The rules checklist validates live against the new password. */
const RULES = [
  ['len', (v) => v.length >= 8],
  ['upper', (v) => /[A-Z]/.test(v)],
  ['lower', (v) => /[a-z]/.test(v)],
  ['special', (v) => /[!@#$%^&*]/.test(v)],
  ['digit', (v) => /\d/.test(v)],
]

function PwField({ id, label, value, onChange, error }) {
  const [show, setShow] = useState(false)
  return (
    <div className="gpi-field">
      <label className="gpi-field__lbl" htmlFor={id}>
        {label}
        <span className="gpi-field__req">*</span>
      </label>
      <div className="acc-pw">
        <input
          id={id}
          className={`gpi-input acc-pw__input${error ? ' is-error' : ''}`}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />
        <button
          type="button"
          className="acc-pw__toggle"
          aria-label={show ? ka.security.hidePw : ka.security.showPw}
          aria-pressed={show}
          onClick={() => setShow((v) => !v)}
        >
          <Icon name={show ? 'eye-off' : 'eye'} size={20} />
        </button>
      </div>
      {error && <p className="acc-err t-caption" role="alert">{error}</p>}
    </div>
  )
}

export default function PasswordForm() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [repeat, setRepeat] = useState('')
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  const edit = (setter, key) => (e) => {
    setter(e.target.value)
    setDone(false)
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }))
  }

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!current) errs.current = ka.security.errRequired
    if (!next) errs.next = ka.security.errRequired
    else if (!RULES.every(([, test]) => test(next))) errs.next = ka.security.errRules
    if (!repeat) errs.repeat = ka.security.errRequired
    else if (repeat !== next) errs.repeat = ka.security.errMatch
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      setCurrent('')
      setNext('')
      setRepeat('')
      setDone(true)
    }
  }

  return (
    <form className="acc-form" onSubmit={submit} noValidate>
      <PwField
        id="acc-pw-current"
        label={ka.security.current}
        value={current}
        onChange={edit(setCurrent, 'current')}
        error={errors.current}
      />
      <p className="t-caption acc-forgot">
        <a className="acc-link" href="#/accounts" onClick={(e) => e.preventDefault()}>
          {ka.security.forgot}
        </a>
      </p>
      <PwField
        id="acc-pw-next"
        label={ka.security.next}
        value={next}
        onChange={edit(setNext, 'next')}
        error={errors.next}
      />
      <PwField
        id="acc-pw-repeat"
        label={ka.security.repeat}
        value={repeat}
        onChange={edit(setRepeat, 'repeat')}
        error={errors.repeat}
      />
      {/* Requirements stated once, as a note — mirrors the registration screen. */}
      <div className="acc-note" role="note">
        <Icon name="info" size={16} />
        <p className="t-body-sm">{ka.security.rulesNote}</p>
      </div>
      {done && <InlineAlert tone="success">{ka.security.done}</InlineAlert>}
      <div className="acc-form__ft">
        <Button type="submit" variant="primary" size="lg">{ka.security.submit}</Button>
      </div>
    </form>
  )
}
