import { Fragment } from 'react'
import Icon from '../lib/Icon.jsx'

/* Stepper — horizontal progress for the booking wizard. Data-driven so the
   journey can grow from 2 → N steps. `steps` = [{id, label}], `current` = index. */
export default function Stepper({ steps, current = 0 }) {
  return (
    <div className="gpi-stepper" role="list" aria-label="ნაბიჯები">
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'todo'
        return (
          <Fragment key={s.id}>
            <div className={`gpi-step gpi-step--${state}`} role="listitem" aria-current={state === 'active'}>
              <span className="gpi-step__num">
                {state === 'done' ? <Icon name="check" size={16} /> : i + 1}
              </span>
              <span className="gpi-step__label">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <span className={`gpi-step__bar ${i < current ? 'is-done' : ''}`} />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
