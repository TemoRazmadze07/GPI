import { useMemo, useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import Badge from '../components/Badge.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import CardTable from '../components/CardTable.jsx'
import FileDropzone from '../components/FileDropzone.jsx'
import Field from '../components/Field.jsx'
import Modal from '../components/Modal.jsx'
import Pagination from '../components/Pagination.jsx'
import SearchField from '../components/SearchField.jsx'
import SegmentedControl from '../components/SegmentedControl.jsx'
import Select from '../components/Select.jsx'
import Switch from '../components/Switch.jsx'
import { Button } from '../components/Button.jsx'
import Icon from '../lib/Icon.jsx'
import { ASSETS } from '../lib/assets.js'
import SourceMark from './SourceMark.jsx'
import { useTransfer } from './CuratioTransfer.jsx'
import { useGate } from './gate.jsx'
import { D } from './strings.js'
import { uc } from './text.js'
import { PERSONS, DOCTOR, ANALYSES, MEDS, VISITS, forPerson, getAttachments, addAttachment, dateWithYear, shortName, shareName } from './curatioData.js'

/* #/dash/curatio?sec= — F-02/F-03 on the surface they were made for.
   One page, three sections (a SEGMENTED CONTROL on the title line is the hub
   since 2026-09-10 — the left rail scrolled out of view beside a 10-row list
   and cost the rows 240px; the dashboard card already switches these three
   sections with the same control): analyses / prescriptions / visits, the
   mobile V2 post-#13 set. The
   L1 sketch showed a fourth „დოკუმენტები" row; built as THREE because mobile
   stakeholder comment #13 (2026-08-18) explicitly killed the docs row — uploads
   live inside the sections they belong to. Flagged, not silently chosen.

   The list is the shared CardTable (2026-09-10 — was DataTable): the
   appointments-list grammar, which brings mobile's in-network highlight (left
   Curatio stripe + tinted hairline) with it; filters are Selects + SearchField;
   upload is the mobile 2-step (file → metadata) as one modal. NO CHARTS — MVP1
   is PDF-only, and that rule survives the platform move. */

const PAGE = 10 /* user 2026-09-08: paginate past 10 records */

/* Section glyphs for the switch (user, 2026-09-10): the record family, not the
   row's per-record glyph (visits rows show in-person/remote; the SECTION is
   „consultations", so the stethoscope). */
const SEC_ICON = { analyses: 'file-text', meds: 'pill', visits: 'stethoscope' }

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

/* The section-level „დოკუმენტის ატვირთვა" (file a NEW record) was REMOVED
   2026-09-04 at the user's request. What replaced it is mobile's pattern (user,
   2026-08-26: „document upload for each card"): a paperclip on EVERY record that
   hangs a supporting document off that record. Same 2-step shape as the old
   modal — file, then name/clinic + the share consent — minus the category, which
   the record already decides. The `uploaded` status/badge stays for data that may
   still carry it. */
function AttachModal({ record, onClose, onAdd }) {
  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [clinic, setClinic] = useState('')
  const [share, setShare] = useState(true)
  const [errs, setErrs] = useState({})

  const submit = () => {
    const e = {}
    if (!file) e.file = D.cur.upl.errFile
    if (!name.trim()) e.name = D.cur.upl.errName
    setErrs(e)
    if (Object.keys(e).length) return
    onAdd({ title: name.trim(), clinic: clinic.trim(), shared: share })
    onClose()
  }

  return (
    <Modal
      title={D.cur.upl.attachTitle}
      onClose={onClose}
      className="dash-uplmodal"
      footer={
        <>
          <Button variant="tertiary" size="md" onClick={onClose}>{D.cur.upl.cancel}</Button>
          <Button variant="primary" size="md" onClick={submit}>{D.cur.upl.attach}</Button>
        </>
      }
    >
      <p className="dash-upl__rec">{D.cur.upl.attachTo(record.name)}</p>
      <Field label={D.cur.upl.title} wide>
        <FileDropzone
          onFile={(f) => { setFile(f); if (errs.file) setErrs((x) => ({ ...x, file: undefined })) }}
          state={file ? 'done' : 'idle'}
          error={errs.file}
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
          {/* Red text + red border, and the error clears the moment the field is edited (rule 2026-07-06; audit A3). */}
          <input className={`gpi-input${errs.name ? ' is-error' : ''}`} aria-invalid={errs.name ? true : undefined} value={name} placeholder={D.cur.upl.namePh} onChange={(e) => { setName(e.target.value); if (errs.name) setErrs((x) => ({ ...x, name: undefined })) }} />
        </Field>
        <Field label={D.cur.upl.clinic}>
          <input className="gpi-input" value={clinic} placeholder={D.cur.upl.clinicPh} onChange={(e) => setClinic(e.target.value)} />
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

/* embedded (2026-09-04, v2 section page): no crumbs/title of its own, person
   scope comes from the host page, section links stay on the host route. */
/* `transfer` (2026-09-09): the section page owns the transfer flow (useTransfer)
   and hands it down, so its doctor row and these table rows open ONE dialog and
   read ONE shares store. Standalone, the table runs its own instance. */
export default function CuratioHistory({ embedded = false, personId: personProp = null, route = '#/dash/curatio/history', transfer: transferProp = null }) {
  const gate = useGate()
  const sec = currentSec()
  const [personState, setPersonId] = useState('g')
  const personId = personProp ?? personState
  const ownTransfer = useTransfer({ personId })
  const trf = transferProp ?? ownTransfer
  const [period, setPeriod] = useState('all')
  const [cat, setCat] = useState('all')
  const [clinic, setClinic] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  /* Per-record attach: which record the modal is for, and the attached docs. */
  const [attachTo, setAttachTo] = useState(null)
  const [attachments, setAttachments] = useState(getAttachments)

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
  const rows = useMemo(() => {
    let r = forPerson(base, personId)
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
  }, [base, personId, period, cat, clinic, search, sec])

  const secList = [
    { id: 'analyses', label: D.cur.hist.sections.analyses, count: forPerson(ANALYSES, personId).length },
    { id: 'meds', label: D.cur.hist.sections.meds, count: forPerson(MEDS, personId).length },
    { id: 'visits', label: D.cur.hist.sections.visits, count: forPerson(VISITS, personId).length },
  ]
  /* The section switch (user, 2026-09-10) — replaces the left rail. Full names
     (stakeholder comment #8) + counts + the family glyph; `short` = the card's
     labels, swapped in ≤767 where the row scrolls sideways. Hidden while
     locked: the counts are record data, and the rail never showed them either. */
  const sectionSwitch = gate.unlocked ? (
    <SegmentedControl
      className="dash-hist__switch"
      size="md"
      variant="soft" /* the dashboard card's look (user, 2026-09-10): white hairline track, pale-indigo pill */
      value={sec}
      onChange={(id) => {
        setPage(1)
        setCat('all')
        window.location.hash = `${route}${route.includes('?') ? '&' : '?'}sec=${id}`
      }}
      options={secList.map((s) => ({
        value: s.id,
        label: s.label,
        short: D.cur.hist.sectionsShort?.[s.id],
        icon: SEC_ICON[s.id],
        count: s.count,
      }))}
    />
  ) : null
  /* Embedded (v2): this IS the section head — title + switch on one line, the
     dashboard card's head grammar. Standalone keeps its page head + crumbs. */
  const head = embedded ? (
    <div className="dash-sechead dash-cur2__histhead">
      <h3 className="dash-sechead__title" id="dash-cur2-hist">{uc(D.cur.hist.title)}</h3>
      {sectionSwitch}
    </div>
  ) : (
    <header className="dash-pagehead">
      {crumbs}
      <div className="dash-sechead">
        <h2 className="dash-sechead__title">{D.cur.hist.title}</h2>
        {sectionSwitch}
      </div>
    </header>
  )

  /* Locked: the page renders its chrome but NO records — deep links gate in
     place. This return sits BELOW every hook: an early return above the
     useMemo crashes React („fewer hooks than expected") the moment ჩაკეტვა
     flips unlocked→locked on this very page. */
  if (!gate.unlocked) {
    return (
      <>
        {head}
        {/* Aligned with the dashboard card's gated rail (user, 2026-09-08): the SAME
            padlock illustration and the same body copy — it was meant to replace the
            lock glyph in both states on 09-04 and only ever landed on the card.
            The title renders ONLY standalone: embedded, the „სამედიცინო ისტორია"
            section head sits directly above and is the heading (the card's rail head
            plays exactly that part) — a second title under it was the h2-in-h3 the
            audit's A5 had to patch. Standalone there is no head, so the card keeps
            its own h2 and the page keeps a heading.
            The CTA stays a primary Button, unlike the card's text link: here it is
            the page's only action, not one line in a preview rail. */}
        <section className="gpi-card dash-histlock">
          <img className="dash-lockillus" src={ASSETS.curatioLocked} alt="" />
          {!embedded && <h2 className="dash-rsec__title">{D.cur.otp.title}</h2>}
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
  /* Record lead (user, 2026-09-10): the dashboard card's record rows open with a
     40px tinted disc + a document glyph (`.dash-lrow__disc`, Rule 1) — the same
     lead here, so the history reads as the same list. 40 = the row's floor
     (16 + 40 + 16), so the disc adds NO height. Colour follows ORIGIN: in-network
     = the Curatio tint (with the stripe it is one voice), external = the disc's
     neutral default. Glyph per section: document / pill / the visit's kind. */
  const recLead = (r, glyph) => (
    <span className={`dash-lrow__disc${r.src === 'curatio' ? ' dash-lrow__disc--curatio' : ''}`} aria-hidden="true">
      <Icon name={glyph} size={20} />
    </span>
  )
  /* Download is the paperclip's twin (user, 2026-09-04): icon-only ghost, the
     document type („PDF" / „ფორმა 100") kept in the tooltip + accessible name. */
  const pdf = (label, recName) => (
    <button
      type="button"
      className="gpi-iconbtn gpi-iconbtn--neutral gpi-iconbtn--ghost dash-hist__attach"
      aria-label={recName ? `${label} — ${recName}` : label}
      title={label}
      onClick={() => {}}
    >
      <Icon name="download" size={16} />
      <span className="gpi-iconbtn__label">{label}</span>
    </button>
  )
  /* Icon-only, so the label names the ACTION AND THE RECORD — the only thing that
     makes a column of identical paperclips usable on a screen reader (mobile rule). */
  const attachBtn = (r) => (
    <button
      type="button"
      className="gpi-iconbtn gpi-iconbtn--neutral gpi-iconbtn--ghost dash-hist__attach"
      aria-label={`${D.cur.upl.attach} — ${r.name}`}
      title={D.cur.upl.attach}
      onClick={() => setAttachTo(r)}
    >
      <Icon name="paperclip" size={16} />
      <span className="gpi-iconbtn__label">{D.cur.upl.attach}</span>
    </button>
  )
  /* Transfer (2026-09-09), the third action: send glyph until the record is
     visible to the PERSONAL doctor, then a check — the glyph changes, not just the
     colour, and the status text lives under the record name (sharedMark). Still a
     button either way: a shared record can go to another doctor too, so the
     accessible name stays the ACTION; the title carries the state. */
  const shareBtn = (r) => {
    const docs = trf.shares[r.id] || []
    const withPersonal = docs.some((d) => d.id === DOCTOR.id)
    return (
      <button
        type="button"
        className={`gpi-iconbtn gpi-iconbtn--neutral gpi-iconbtn--ghost dash-hist__attach dash-hist__share${withPersonal ? ' is-shared' : ''}`}
        aria-label={`${D.cur.transfer.rowAction} — ${r.name}`}
        title={withPersonal ? D.cur.transfer.rowShared : D.cur.transfer.rowAction}
        onClick={() => trf.open(r)}
      >
        <Icon name={withPersonal ? 'check' : 'send'} size={16} />
        <span className="gpi-iconbtn__label">{D.cur.transfer.rowAction}</span>
      </button>
    )
  }
  /* `.gpi-row__actions` = the CardTable phone-stack hook: at ≤767 the three
     icon-only buttons become the labelled footer row the appointments cards
     have (labels ship in the DOM, hidden on desktop — rule 2026-07-28). */
  const actions = (r, dl) => (
    <span className="gpi-row__actions dash-hist__rowactions">
      {dl}
      {attachBtn(r)}
      {shareBtn(r)}
    </span>
  )
  /* „ხილვადია: ნ. ნინოშვილი" under the record — the visibility state in words,
     one line however many doctors, in the same slot the attached documents use. */
  const sharedMark = (r) => {
    const docs = trf.shares[r.id] || []
    if (!docs.length) return null
    return (
      <span className="dash-shared">
        <Icon name="eye" size={12} />
        <span>{D.cur.transfer.visible(docs.map((d) => shortName(shareName(d))).join(', '))}</span>
      </span>
    )
  }
  /* Attached docs list FIRST under the record (proof the upload landed — a file
     that vanishes reads as a failure), same as the mobile card foot. */
  const attachedDocs = (r) => {
    const docs = attachments[r.id] || []
    if (!docs.length) return null
    return (
      <span className="dash-attach">
        {docs.map((d, i) => (
          <span key={d.title + i} className="dash-attach__row">
            <Icon name="paperclip" size={12} />
            <span className="dash-attach__name">{d.title}</span>
            {d.clinic && <span className="dash-attach__clinic">{d.clinic}</span>}
            {/* Uploaded with the consent switch ON = the same visibility state the
                transfer creates; one mark for both, so the table has one vocabulary. */}
            {d.shared && (
              <span className="dash-attach__shared" title={D.cur.transfer.attachShared}>
                <Icon name="eye" size={12} />
                <span className="gpi-sr-only">{D.cur.transfer.attachShared}</span>
              </span>
            )}
          </span>
        ))}
      </span>
    )
  }

  /* Column order (user 2026-09-08): the RECORD NAME leads — it is what the row is
     about and what you scan for; the date is context, so it follows. Same order in
     all three sections, or the same table would read differently per tab (Rule 1).
     The date carries the year now, derived in curatioData — see dateWithYear. */
  /* `icon` = the ≤767 leading meta glyph (CardTable): the date and the clinic /
     expiry lose their column header there and get the marker instead. */
  const dateCol = { key: 'date', header: D.cur.hist.cols.date, width: '108px', icon: 'calendar', render: (r) => dateWithYear(r) }
  const columns = {
    analyses: [
      {
        key: 'name', header: D.cur.hist.cols.name, rowHeader: true,
        render: (r) => (
          <span className="dash-rec">
            {recLead(r, 'file-text')}
            <span className="dash-medcell">
              <span>{r.name}</span>
              {sharedMark(r)}
              {attachedDocs(r)}
            </span>
          </span>
        ),
      },
      dateCol,
      /* 220 (was 172): „კურაციო საბურთალოზე" + the mark wrapped to two lines at
         172 and stretched the card (user, 2026-09-10). The name column yields. */
      { key: 'clinic', header: D.cur.hist.cols.clinic, width: '220px', icon: 'map-pin', render: clinicCell },
      /* ⚠️ The სტატუსი column (norm/warn/crit) was REMOVED at the user's request
         2026-09-08. The result signal is no longer surfaced anywhere in this table
         — flagged in chat; StatusBadge is still used by the meds expiry cell. */
      { key: 'pdf', header: '', width: '116px', align: 'right', render: (r) => actions(r, pdf('PDF', r.name)) },
    ],
    meds: [
      {
        key: 'name', header: D.cur.hist.cols.med, rowHeader: true,
        render: (r) => (
          <span className="dash-rec">
            {recLead(r, 'pill')}
            <span className="dash-medcell">
              <span>{r.name}</span>
              <span className="dash-medcell__meta">
                {r.ref} · {r.doctor}
                {r.chronic && <Badge color="brand" size="sm">{D.cur.hist.chronic}</Badge>}
              </span>
              {sharedMark(r)}
              {attachedDocs(r)}
            </span>
          </span>
        ),
      },
      dateCol,
      {
        key: 'expiry', header: D.cur.hist.cols.expiry, width: '196px', icon: 'clock',
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
      { key: 'pdf', header: '', width: '116px', align: 'right', render: (r) => actions(r, pdf('PDF', r.name)) },
    ],
    visits: [
      {
        key: 'name', header: D.cur.hist.cols.visit, rowHeader: true,
        render: (r) => (
          <span className="dash-rec">
            {/* the visit's kind (in person / remote) IS the glyph — it used to sit
                inline before the name; the disc is its one home now */}
            {recLead(r, r.kind === 'remote' ? 'phone' : 'building-2')}
            <span className="dash-medcell">
              <span>{r.name}</span>
              <span className="dash-medcell__meta">{r.doctor}</span>
              {sharedMark(r)}
              {attachedDocs(r)}
            </span>
          </span>
        ),
      },
      dateCol,
      { key: 'clinic', header: D.cur.hist.cols.clinic, width: '220px', icon: 'map-pin', render: clinicCell },
      {
        key: 'pdf', header: '', width: '116px', align: 'right',
        render: (r) => actions(r, r.form100 ? pdf(D.cur.hist.form100, r.name) : <span className="dash-cell-muted">—</span>),
      },
    ],
  }[sec]

  return (
    <>
      {head}

      {/* ONE column since 2026-09-10 — the rail (section nav + standalone tools)
          is gone; the switch sits in the head, the standalone tools in the
          filter row. The list gets the full width. */}
      <div className="dash-hist">
        <div className="dash-hist__main">
          <div className="dash-hist__filters">
            {!embedded && (
              <Select
                value={personId}
                onChange={(v) => { setPersonId(v); setPage(1) }}
                ariaLabel={D.cur.person}
                options={PERSONS.map((p) => ({ value: p.id, label: p.name, sub: p.ocin, lead: <Avatar src={p.photo} name={p.name} size={34} /> }))}
              />
            )}
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
            {/* Embedded on v2 the doctor row already carries this action — one home per action (audit B4). */}
            {!embedded && (
              <Button variant="tertiary" size="md" leadingIcon="arrow-right-left">
                {D.cur.hist.transfer}
              </Button>
            )}
          </div>

          <section className="gpi-card gpi-card--table dash-hist__table">
            {/* In-network highlight = mobile's rule: a Curatio-origin record gets the
                stripe + tinted edge; status outranks brand, so an EXPIRING
                prescription (the web reading of mobile's warn card) is excluded. */}
            <CardTable
              caption={`${D.cur.hist.title} — ${secList.find((s) => s.id === sec).label}`}
              columns={columns}
              rows={slice}
              rowKey={(r) => r.id}
              rowClassName={(r) =>
                r.src === 'curatio' && !(sec === 'meds' && r.expiryDays != null && r.expiryDays <= 14)
                  ? 'dash-row--curatio'
                  : undefined
              }
              empty={{ icon: 'search', title: D.cur.hist.empty, hint: D.cur.hist.emptyHint }}
            />
            {/* Centred under the rows in the appointments footer (user, 2026-09-10) —
                bare in this flex column it sat at the left edge. */}
            {pages > 1 && (
              <div className="gpi-table__footer">
                <Pagination current={cur} total={pages} onChange={setPage} />
              </div>
            )}
          </section>
        </div>
      </div>

      {attachTo && (
        <AttachModal
          record={attachTo}
          onClose={() => setAttachTo(null)}
          onAdd={(doc) => {
            addAttachment(attachTo.id, doc)
            setAttachments(getAttachments())
          }}
        />
      )}
      {gate.modal}
      {!transferProp && ownTransfer.modal}
      {!transferProp && ownTransfer.toast}
    </>
  )
}
