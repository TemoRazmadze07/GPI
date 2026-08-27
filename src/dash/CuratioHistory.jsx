import { useMemo, useState } from 'react'
import Badge from '../components/Badge.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import DataTable from '../components/DataTable.jsx'
import FileDropzone from '../components/FileDropzone.jsx'
import Field from '../components/Field.jsx'
import Modal from '../components/Modal.jsx'
import Pagination from '../components/Pagination.jsx'
import SearchField from '../components/SearchField.jsx'
import Select from '../components/Select.jsx'
import Switch from '../components/Switch.jsx'
import { Button } from '../components/Button.jsx'
import Icon from '../lib/Icon.jsx'
import SourceMark from './SourceMark.jsx'
import { useGate } from './gate.jsx'
import { D } from './strings.js'
import { PERSONS, DOCTOR, ANALYSES, MEDS, VISITS, forPerson } from './curatioData.js'

/* #/dash/curatio/history?sec= — F-02/F-03 on the surface they were made for.
   One page, three sections (the LEFT RAIL is the hub — desktop needs no hub
   page): analyses / prescriptions / visits, the mobile V2 post-#13 set. The
   L1 sketch showed a fourth „დოკუმენტები" row; built as THREE because mobile
   stakeholder comment #13 (2026-08-18) explicitly killed the docs row — uploads
   live inside the sections they belong to. Flagged, not silently chosen.

   The table is the shared DataTable; filters are Selects + SearchField; upload
   is the mobile 2-step (file → metadata) as one modal. NO CHARTS — MVP1 is
   PDF-only, and that rule survives the platform move. */

const PAGE = 8

const go = (hash) => () => {
  window.location.hash = hash
}

/* ?sec= inside the hash. Re-read on every render — App re-renders on hashchange. */
function currentSec() {
  const h = window.location.hash
  const q = h.indexOf('?')
  const sec = q === -1 ? null : new URLSearchParams(h.slice(q + 1)).get('sec')
  return ['analyses', 'meds', 'visits'].includes(sec) ? sec : 'analyses'
}

function StatusBadge({ s }) {
  const tone = { norm: 'success', warn: 'warning', crit: 'error', uploaded: 'info', done: 'neutral' }[s]
  return <Badge color={tone} size="sm">{D.cur.hist.statuses[s]}</Badge>
}

function UploadModal({ onClose, onAdd, personId }) {
  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [clinic, setClinic] = useState('')
  const [cat, setCat] = useState(null)
  const [share, setShare] = useState(true)
  const [errs, setErrs] = useState({})

  const submit = () => {
    const e = {}
    if (!file) e.file = D.cur.upl.errFile
    if (!name.trim()) e.name = D.cur.upl.errName
    if (!cat) e.cat = D.cur.upl.errCat
    setErrs(e)
    if (Object.keys(e).length) return
    onAdd({ sec: cat, name: name.trim(), clinic: clinic.trim(), personId })
    onClose()
  }

  return (
    <Modal
      title={D.cur.upl.title}
      onClose={onClose}
      className="dash-uplmodal"
      footer={
        <>
          <Button variant="tertiary" size="md" onClick={onClose}>{D.cur.upl.cancel}</Button>
          <Button variant="primary" size="md" onClick={submit}>{D.cur.upl.submit}</Button>
        </>
      }
    >
      <Field label={D.cur.upl.title} errorMsg={errs.file} wide>
        <FileDropzone
          onFile={(f) => setFile(f)}
          state={file ? 'done' : 'idle'}
          file={file}
          accept=".pdf,.jpg,.jpeg,.png"
          acceptMime="application/pdf,image/jpeg,image/png"
          title={D.cur.upl.title}
          browseLabel={D.cur.upl.browse}
          replaceLabel={D.cur.upl.replace}
          hint={D.cur.upl.hint}
          onClear={() => setFile(null)}
          clearLabel={D.cur.upl.cancel}
          compact
        />
      </Field>
      <div className="dash-upl__grid">
        <Field label={D.cur.upl.name} required errorMsg={errs.name}>
          <input
            className="gpi-input"
            value={name}
            placeholder={D.cur.upl.namePh}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label={D.cur.upl.clinic}>
          <input
            className="gpi-input"
            value={clinic}
            placeholder={D.cur.upl.clinicPh}
            onChange={(e) => setClinic(e.target.value)}
          />
        </Field>
        <Field label={D.cur.upl.cat} required errorMsg={errs.cat}>
          <Select
            value={cat}
            placeholder={D.cur.upl.catPick}
            onChange={setCat}
            options={[
              { value: 'analyses', label: D.cur.hist.sections.analyses },
              { value: 'meds', label: D.cur.hist.sections.meds },
              { value: 'visits', label: D.cur.hist.sections.visits },
            ]}
          />
        </Field>
      </div>
      <div className="dash-upl__consent">
        <Switch
          name="upl-share"
          checked={share}
          onChange={setShare}
          label={D.cur.upl.consent}
          help={share ? D.cur.upl.consentOn(DOCTOR.name) : D.cur.upl.consentOff}
        />
      </div>
    </Modal>
  )
}

export default function CuratioHistory() {
  const gate = useGate()
  const sec = currentSec()
  const [personId, setPersonId] = useState('g')
  const [period, setPeriod] = useState('all')
  const [cat, setCat] = useState('all')
  const [clinic, setClinic] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [upl, setUpl] = useState(false)
  const [added, setAdded] = useState([])

  const crumbs = (
    <Breadcrumbs
      items={[
        { label: D.cur.crumbHome, href: '#/dash' },
        { label: D.cur.title, href: '#/dash/curatio' },
      ]}
      current={D.cur.hist.title}
      label={D.cur.hist.title}
    />
  )

  const base = { analyses: ANALYSES, meds: MEDS, visits: VISITS }[sec]
  const uploads = added.filter((r) => r.sec === sec && r.p === personId)
  const rows = useMemo(() => {
    /* Uploads first: they are stamped „დღეს" — the list reads newest-down, so
       appending them would file today's document behind last February's. */
    let r = uploads.concat(forPerson(base, personId))
    if (period !== 'all') {
      const cap = { m3: 3, m6: 6, y1: 12 }[period]
      r = r.filter((x) => (x.monthsAgo ?? 0) < cap)
    }
    if (sec === 'analyses' && cat !== 'all') r = r.filter((x) => x.cat === cat)
    if (clinic !== 'all') r = r.filter((x) => x.src === clinic)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      r = r.filter((x) => `${x.name} ${x.clinic || ''} ${x.doctor || ''}`.toLowerCase().includes(q))
    }
    return r
  }, [base, personId, period, cat, clinic, search, sec, added])

  /* Locked: the page renders its chrome but NO records — deep links gate in
     place. This return sits BELOW every hook: an early return above the
     useMemo crashes React („fewer hooks than expected") the moment ჩაკეტვა
     flips unlocked→locked on this very page. */
  if (!gate.unlocked) {
    return (
      <>
        <header className="dash-pagehead">{crumbs}</header>
        <section className="gpi-card dash-histlock">
          <Icon name="lock" size={32} />
          <h2 className="dash-rsec__title">{D.cur.otp.title}</h2>
          <p>{D.cur.recent.lockedBody}</p>
          <Button variant="primary" size="md" onClick={gate.request}>{D.cur.recent.enter}</Button>
        </section>
        {gate.modal}
      </>
    )
  }

  const pages = Math.max(1, Math.ceil(rows.length / PAGE))
  const cur = Math.min(page, pages)
  const slice = rows.slice((cur - 1) * PAGE, cur * PAGE)

  const clinicCell = (r) => <SourceMark src={r.src} label={r.clinic} />
  const pdf = (label) => (
    <button type="button" className="gpi-link dash-link" onClick={() => {}}>
      <Icon name="download" size={16} />
      {label}
    </button>
  )

  const columns = {
    analyses: [
      { key: 'date', header: D.cur.hist.cols.date, width: '70px', render: (r) => r.date },
      { key: 'name', header: D.cur.hist.cols.name, rowHeader: true, render: (r) => r.name },
      { key: 'clinic', header: D.cur.hist.cols.clinic, width: '172px', render: clinicCell },
      { key: 'status', header: D.cur.hist.cols.status, width: '104px', render: (r) => <StatusBadge s={r.status} /> },
      { key: 'pdf', header: '', width: '84px', align: 'right', render: () => pdf('PDF') },
    ],
    meds: [
      { key: 'date', header: D.cur.hist.cols.date, width: '70px', render: (r) => r.date },
      {
        key: 'name', header: D.cur.hist.cols.med, rowHeader: true,
        render: (r) => (
          <span className="dash-medcell">
            <span>{r.name}</span>
            <span className="dash-medcell__meta">
              {r.ref} · {r.doctor}
              {r.chronic && <Badge color="brand" size="sm">{D.cur.hist.chronic}</Badge>}
            </span>
          </span>
        ),
      },
      {
        key: 'expiry', header: D.cur.hist.cols.expiry, width: '196px',
        render: (r) =>
          r.status === 'uploaded' ? <StatusBadge s="uploaded" /> :
          r.expiryDays == null ? <span className="dash-cell-muted">—</span> :
          r.expiryDays <= 14 ? (
            <span className="dash-medcell">
              <Badge color="warning" size="sm">{D.cur.hist.expiring} · {D.cur.hist.expiryIn(r.expiryDays)}</Badge>
              <button type="button" className="gpi-link dash-link" title={D.cur.hist.renewNote} onClick={go('#/desktop/appointments/book')}>
                {D.cur.hist.renew}
              </button>
            </span>
          ) : (
            <Badge color="success" size="sm">{D.cur.hist.active}</Badge>
          ),
      },
      { key: 'pdf', header: '', width: '84px', align: 'right', render: () => pdf('PDF') },
    ],
    visits: [
      { key: 'date', header: D.cur.hist.cols.date, width: '70px', render: (r) => r.date },
      {
        key: 'name', header: D.cur.hist.cols.visit, rowHeader: true,
        render: (r) => (
          <span className="dash-medcell">
            <span className="dash-visitname">
              <Icon name={r.kind === 'remote' ? 'video' : 'building-2'} size={16} />
              {r.name}
            </span>
            <span className="dash-medcell__meta">{r.doctor}</span>
          </span>
        ),
      },
      { key: 'clinic', header: D.cur.hist.cols.clinic, width: '172px', render: clinicCell },
      {
        key: 'pdf', header: '', width: '112px', align: 'right',
        render: (r) => (r.form100 ? pdf(D.cur.hist.form100) : <span className="dash-cell-muted">—</span>),
      },
    ],
  }[sec]

  const secList = [
    { id: 'analyses', label: D.cur.hist.sections.analyses, count: forPerson(ANALYSES, personId).length },
    { id: 'meds', label: D.cur.hist.sections.meds, count: forPerson(MEDS, personId).length },
    { id: 'visits', label: D.cur.hist.sections.visits, count: forPerson(VISITS, personId).length },
  ]

  return (
    <>
      <header className="dash-pagehead">
        {crumbs}
        <div className="dash-sechead">
          <h2 className="dash-sechead__title">{D.cur.hist.title}</h2>
          <button type="button" className="gpi-link dash-link dash-link--quiet" onClick={gate.relock}>
            <Icon name="lock" size={16} />
            {D.cur.lock}
          </button>
        </div>
      </header>

      <div className="dash-hist">
        <aside className="dash-hist__rail">
          <Select
            value={personId}
            onChange={(v) => { setPersonId(v); setPage(1) }}
            ariaLabel={D.cur.person}
            options={PERSONS.map((p) => ({ value: p.id, label: `${p.name} · ${p.ocin}` }))}
            renderValue={(o) => o.label.split(' · ')[0]}
          />
          <nav className="gpi-card dash-hist__nav" aria-label={D.cur.hist.title}>
            {secList.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`dash-hist__navitem${s.id === sec ? ' is-active' : ''}`}
                aria-current={s.id === sec ? 'page' : undefined}
                onClick={() => { setPage(1); setCat('all'); window.location.hash = `#/dash/curatio/history?sec=${s.id}` }}
              >
                <span>{s.label}</span>
                <span className="dash-hist__count">{s.count}</span>
              </button>
            ))}
          </nav>
          <Button variant="secondary" size="md" leadingIcon="upload" className="dash-hist__action" onClick={() => setUpl(true)}>
            {D.cur.upl.title}
          </Button>
          <Button variant="tertiary" size="md" leadingIcon="arrow-right-left" className="dash-hist__action">
            {D.cur.hist.transfer}
          </Button>
        </aside>

        <div className="dash-hist__main">
          <div className="dash-hist__filters">
            <Select
              value={period}
              onChange={(v) => { setPeriod(v); setPage(1) }}
              ariaLabel={D.cur.hist.filters.period}
              options={Object.entries(D.cur.hist.periods).map(([value, label]) => ({ value, label }))}
              renderValue={(o) => `${D.cur.hist.filters.period}: ${o.label}`}
            />
            {sec === 'analyses' && (
              <Select
                value={cat}
                onChange={(v) => { setCat(v); setPage(1) }}
                ariaLabel={D.cur.hist.filters.cat}
                options={Object.entries(D.cur.hist.cats).map(([value, label]) => ({ value, label }))}
                renderValue={(o) => `${D.cur.hist.filters.cat}: ${o.label}`}
              />
            )}
            <Select
              value={clinic}
              onChange={(v) => { setClinic(v); setPage(1) }}
              ariaLabel={D.cur.hist.filters.clinic}
              options={Object.entries(D.cur.hist.clinics).map(([value, label]) => ({ value, label }))}
              renderValue={(o) => `${D.cur.hist.filters.clinic}: ${o.label}`}
            />
            <SearchField value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder={D.cur.hist.search} />
          </div>

          <section className="gpi-card gpi-card--table dash-hist__table">
            <DataTable
              caption={`${D.cur.hist.title} — ${secList.find((s) => s.id === sec).label}`}
              columns={columns}
              rows={slice}
              rowKey={(r) => r.id}
              empty={{ icon: 'search', title: D.cur.hist.empty, hint: D.cur.hist.emptyHint }}
            />
            {pages > 1 && <Pagination current={cur} total={pages} onChange={setPage} />}
          </section>
        </div>
      </div>

      {upl && (
        <UploadModal
          personId={personId}
          onClose={() => setUpl(false)}
          onAdd={({ sec: s, name, clinic: cl }) =>
            setAdded((a) => [
              {
                id: `up${a.length + 1}`, p: personId, sec: s,
                date: D.cur.hist.today,
                monthsAgo: 0, name, cat: 'blood', kind: 'inclinic', doctor: '',
                clinic: cl || (D.cur.hist.clinics.external), src: 'external',
                status: 'uploaded', expiryDays: null, chronic: false, form100: false,
              },
              ...a,
            ])
          }
        />
      )}
      {gate.modal}
    </>
  )
}
