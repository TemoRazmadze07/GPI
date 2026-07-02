import { useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { apps, flowLinks, countFlows } from '../data/flowmap.js'

/* Flow Map — internal copy-console (route #/map). Pick an app → feature →
   copy a flow's figma / share / dev link. Mono, green-accented, compact.
   NOT a customer-facing screen; a wayfinding tool for daily work. */

const STATUS_LABEL = { done: 'done', 'in-progress': 'in progress', planned: 'planned' }

function CopyBtn({ label, url }) {
  const [done, setDone] = useState(false)
  if (!url) return <span className="gpi-fmap__nolink" aria-hidden="true">·</span>

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch (e) {
      /* clipboard may be blocked in some contexts — visual feedback still fires */
    }
    setDone(true)
    setTimeout(() => setDone(false), 1100)
  }

  return (
    <button
      type="button"
      className={'gpi-fmap__cp' + (done ? ' is-copied' : '')}
      onClick={copy}
      title={url}
      aria-label={`copy ${label} link`}
    >
      <Icon name={done ? 'check' : 'copy'} size={16} />
      {done ? 'copied' : label}
    </button>
  )
}

/* Launch a flow in-app (same tab) — hash is like "/desktop/appointments/book". */
function startFlow(hash) {
  window.location.hash = hash
}

function FlowRow({ flow }) {
  const links = flowLinks(flow)
  const hasAny = flow.hash || links.figma
  return (
    <div className="gpi-fmap__row">
      <span className={'gpi-fmap__dot is-' + flow.status} />
      <span className="gpi-fmap__path" title={flow.path}>
        <span className="gpi-fmap__pathmono">{flow.path}</span>
        <span className="gpi-fmap__label"> · {flow.label}</span>
      </span>
      {hasAny ? (
        <>
          {flow.hash ? (
            <button
              type="button"
              className="gpi-fmap__start"
              onClick={() => startFlow(flow.hash)}
              aria-label={`start ${flow.label}`}
            >
              <Icon name="play" size={14} /> start
            </button>
          ) : (
            <span className="gpi-fmap__nolink" aria-hidden="true">·</span>
          )}
          <CopyBtn label="figma" url={links.figma} />
          <CopyBtn label="share" url={links.share} />
          <CopyBtn label="dev" url={links.dev} />
        </>
      ) : (
        <span className="gpi-fmap__notbuilt">— not built</span>
      )}
    </div>
  )
}

function Metric({ label, value, tone }) {
  return (
    <div className="gpi-fmap__metric">
      <div className="gpi-fmap__metriclabel">{label}</div>
      <div className={'gpi-fmap__metricnum is-' + tone}>{value}</div>
    </div>
  )
}

export default function MapScreen() {
  const [appId, setAppId] = useState(apps[0].id)
  const app = apps.find((a) => a.id === appId)
  const m = countFlows(app)

  return (
    <div className="gpi-fmap">
      <div className="gpi-fmap__head">
        <div className="gpi-fmap__brand">
          <Icon name="terminal" size={20} className="gpi-fmap__brand-ic" />
          <span className="gpi-fmap__title">gpi/flow-map</span>
        </div>
        <span className="gpi-fmap__sub">pick app · feature · copy link</span>
      </div>

      <div className="gpi-fmap__legend">
        <span><b>start</b> open the flow</span>
        <span><b>figma</b> design</span>
        <span><b>share</b> study link · one flow only · deploy pending</span>
        <span><b>dev</b> localhost</span>
      </div>

      <div className="gpi-fmap__metrics">
        <Metric label="flows" value={m.total} tone="main" />
        <Metric label="done" value={m.done} tone="success" />
        <Metric label="in progress" value={m['in-progress']} tone="warning" />
        <Metric label="planned" value={m.planned} tone="muted" />
      </div>

      <div className="gpi-fmap__tabs" role="tablist" aria-label="applications">
        {apps.map((a) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={a.id === appId}
            className={'gpi-fmap__tab' + (a.id === appId ? ' is-active' : '')}
            onClick={() => setAppId(a.id)}
          >
            <Icon name={a.icon} size={16} />
            {a.label}
          </button>
        ))}
      </div>

      <div className="gpi-fmap__appsub">{app.sub}</div>

      {app.features.length === 0 && <div className="gpi-fmap__empty">features TBD</div>}

      {app.features.map((f) => (
        <section className="gpi-fmap__feat" key={f.id}>
          <div className="gpi-fmap__feathd">
            <Icon name="folder" size={16} className={'gpi-fmap__folder is-' + f.status} />
            <span className="gpi-fmap__featname">{f.label}</span>
            <span className={'gpi-fmap__pill is-' + f.status}>{STATUS_LABEL[f.status]}</span>
            {f.flows.length > 0 && (
              <span className="gpi-fmap__featmeta">{f.flows.length} flows</span>
            )}
          </div>
          {f.flows.map((fl) => (
            <FlowRow flow={fl} key={fl.id} />
          ))}
        </section>
      ))}
    </div>
  )
}
