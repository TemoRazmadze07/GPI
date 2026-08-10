import Icon from '../lib/Icon.jsx'
import { kaAcc as ka } from './strings.js'

/* Personal info — read-only by product decision (doc requirement 4). The
   lavender note answers the dead-end the current console leaves open: where
   does this data come from, and what do I do if it's wrong. Styled with the
   login screen's info-box tokens (alert-info), not the sky status-info tone. */
const ROWS = [
  ['firstName', ka.user.firstName],
  ['lastName', ka.user.lastName],
  ['pid', ka.user.pid],
  ['sex', ka.user.sex],
  ['phone', ka.user.phone],
  ['email', ka.user.email],
]

export default function PersonalInfoScreen() {
  return (
    <>
      <header className="acc-head">
        <h1 className="t-h2 acc-title">{ka.personal.title}</h1>
      </header>
      <section className="acc-card">
        <dl className="acc-rows">
          {ROWS.map(([key, value]) => (
            <div key={key} className="acc-row">
              <dt className="t-body acc-row__lbl">{ka.personal.fields[key]}</dt>
              <dd className="t-body acc-row__val">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="acc-note" role="note">
          <Icon name="info" size={16} />
          <p className="t-body-sm">{ka.personal.note}</p>
        </div>
      </section>
    </>
  )
}
