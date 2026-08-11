import Field from '../components/Field.jsx'
import Select from '../components/Select.jsx'
import FormSection from './FormSection.jsx'
import { COUNTRIES, UNIVERSITIES } from './data.js'
import { en as t } from './strings.js'

/* Step 1 — Insured & policyholder.

   Same fields, same order, same grouping and same two-column layout as the
   source mockup (user: "the first screen is correct… just align the visual
   styling"). What changed is only HOW it is built: the mockup's fake read-only
   divs are now real .gpi-input / Select instances inside the shared Field, so
   the screen is actually fillable and keyboard-operable. */
export default function StepInsured({ value, onChange }) {
  const s = t.step1
  const set = (k) => (e) => onChange(k, e.target.value)
  const pick = (k) => (v) => onChange(k, v)

  return (
    <section className="gpi-card stu-card">
      <p className="t-overline stu-eyebrow">{s.eyebrow}</p>
      <h2 className="t-h4 stu-title">{s.title}</h2>
      <p className="t-body-sm stu-subtitle">{s.subtitle}</p>

      <FormSection n={1} title={s.groups.personal}>
        <div className="stu-grid">
          <Field label={s.firstName} required>
            <input className="gpi-input" value={value.firstName} placeholder={s.enter} onChange={set('firstName')} />
          </Field>
          <Field label={s.lastName} required>
            <input className="gpi-input" value={value.lastName} placeholder={s.enter} onChange={set('lastName')} />
          </Field>
          <Field label={s.dob} required>
            <input className="gpi-input" value={value.dob} placeholder={s.dobPh} onChange={set('dob')} />
          </Field>
          <Field label={s.personalNumber} required>
            <input className="gpi-input" value={value.personalNumber} placeholder={s.enter} onChange={set('personalNumber')} />
          </Field>
          <Field label={s.citizenship} required wide>
            <Select
              value={value.citizenship}
              placeholder={s.select}
              options={COUNTRIES}
              onChange={pick('citizenship')}
              ariaLabel={s.citizenship}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection n={2} title={s.groups.contact}>
        <div className="stu-grid">
          <Field label={s.address} required wide>
            <input className="gpi-input" value={value.address} placeholder={s.enter} onChange={set('address')} />
          </Field>
          <Field label={s.phone} required>
            <input className="gpi-input" type="tel" value={value.phone} placeholder={s.enter} onChange={set('phone')} />
          </Field>
          <Field label={s.email} required>
            <input className="gpi-input" type="email" value={value.email} placeholder={s.enter} onChange={set('email')} />
          </Field>
        </div>
      </FormSection>

      <FormSection n={3} title={s.groups.university}>
        <div className="stu-grid">
          <Field label={s.university} required wide hint={s.universityNote}>
            <Select
              value={value.university}
              placeholder={s.select}
              options={UNIVERSITIES}
              onChange={pick('university')}
              ariaLabel={s.university}
            />
          </Field>
        </div>
      </FormSection>
    </section>
  )
}
