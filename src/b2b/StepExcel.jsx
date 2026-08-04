import { useEffect, useMemo, useRef, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import Pagination from '../components/Pagination.jsx'
import FilterChips from '../components/FilterChips.jsx'
import FileDropzone from '../components/FileDropzone.jsx'
import StatTile from '../components/StatTile.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Badge from '../components/Badge.jsx'
import { Button, IconButton } from '../components/Button.jsx'
import Icon from '../lib/Icon.jsx'
import ImportRowDrawer, { rowRef } from './ImportRowDrawer.jsx'
import { kaB2B } from './strings.js'
import { contract, packageByValue, relationByValue, existingEmployees } from './data/addInsured.js'
import { TEMPLATE_DATA_URI, TEMPLATE_FILENAME } from './data/excelTemplate.js'
import {
  MAX_BYTES,
  readInsuredWorkbook,
  buildImport,
  revalidate,
  clearParseIssue,
  nextErrorId,
} from './data/insuredImport.js'

/* StepExcel — step 2 of the add-insured wizard in Excel mode.

   Three states on one screen, in one component, because they share the file
   chip: upload → validating → results. The dropzone stays mounted throughout,
   which is why focus never has to move when validation completes.

   The wizard owns the batch (`excel` state in AddInsuredScreen) so it survives
   step changes; this component owns only what is local to the results view —
   filter, page, sort, which row is open. */

const t = kaB2B.addIns
const x = t.excel
const f = t.form

const PAGE_SIZE = 20
const fmtGel = (n) => `₾ ${n.toFixed(2)}`
const fmtSize = (b) => (b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`)

/* ---- presentation shortcut -------------------------------------------------

   #/b2b/insured/add/excel?demo=errors  → a 20-person file with 7 broken rows
   #/b2b/insured/add/excel?demo=clean   → a 10-person file that validates

   A walkthrough should not open with someone hunting through Finder for a
   spreadsheet, so these links load a bundled sample through the SAME path a
   dropped file takes — the parser, the rules and the loading state are all
   real, only the file picker is skipped. The flag is read straight off the
   hash (the app's own idiom, see parseHashQuery in App.jsx) and adds no UI, so
   an ordinary visit to the screen behaves exactly as before. */

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

function demoKey() {
  const h = window.location.hash
  const qi = h.indexOf('?')
  if (qi === -1) return null
  const v = new URLSearchParams(h.slice(qi + 1)).get('demo')
  if (!v) return null
  /* ?demo alone and ?demo=1 mean the interesting one — the file with errors. */
  return v === 'clean' ? 'clean' : 'errors'
}

async function demoFile(key) {
  /* Dynamic import: the workbooks are ~7KB of base64 and have no business in
     the main bundle when nobody opened a demo link. */
  const { DEMO_FILES } = await import('./data/excelDemo.js')
  const spec = DEMO_FILES[key]
  /* Decoded by hand rather than fetch(dataUri): the single-file share build is
     opened from file://, and a demo that only works on the dev server is worse
     than no demo at all. */
  const bin = atob(spec.dataUri.slice(spec.dataUri.indexOf(',') + 1))
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i)
  return new File([bytes], spec.filename, { type: XLSX_MIME })
}

const BADGE = { error: 'error', warning: 'warning', exists: 'neutral', ok: 'success' }
const BADGE_ICON = { error: 'alert-circle', warning: 'alert-triangle', exists: 'info', ok: 'check' }
const STATUS_LABEL = {
  error: x.status.error,
  warning: x.status.warning,
  exists: x.exists.label,
  ok: x.status.ready,
}
const STATUS_ORDER = { error: 0, warning: 1, exists: 2, ok: 3 }
const SORT_FIRST_DIR = { row: 'asc', status: 'asc' }

/* Usability-study links (?study) are locked to one flow and go to participants —
   the demo bar must never appear there. */
const STUDY = new URLSearchParams(window.location.search).has('study')

/* DemoBar — a PROTOTYPE affordance, deliberately NOT a design-system component
   and deliberately not styled like one: dark pill, monospace, English labels,
   so nobody in the room mistakes it for part of the GPI interface. One click
   puts the screen in the uploaded state with real, broken rows to repair.
   Delete it (and .b2b-demobar) when the prototype stops being a demo. */
function DemoBar({ loaded, onLoad, onReset }) {
  return (
    <div className="b2b-demobar" role="group" aria-label="prototype demo controls">
      <span className="b2b-demobar__tag" aria-hidden="true">
        demo
      </span>
      <button type="button" className="b2b-demobar__btn" onClick={() => onLoad('errors')}>
        file with errors
      </button>
      <button type="button" className="b2b-demobar__btn" onClick={() => onLoad('clean')}>
        clean file
      </button>
      {loaded && (
        <button type="button" className="b2b-demobar__btn b2b-demobar__btn--ghost" onClick={onReset}>
          reset
        </button>
      )}
    </div>
  )
}

function ContractChip() {
  return (
    <div className="b2b-wiz__contract">
      <span className="b2b-wiz__contract-lbl">{t.contractLabel}:</span>
      <span className="b2b-wiz__contract-val">{contract.label}</span>
      <Badge color="success" size="sm">
        {contract.status}
      </Badge>
    </div>
  )
}

function NumberedStep({ num, title, body, children }) {
  return (
    <div className="b2b-xl__step">
      <span className="b2b-xl__stepnum" aria-hidden="true">
        {num}
      </span>
      <span className="b2b-xl__steptitle">{title}</span>
      <span className="b2b-xl__stepbody">{body}</span>
      {children}
    </div>
  )
}

export default function StepExcel({ excel, onImportState, startSeq, ctxToday }) {
  const { file, result } = excel
  const [phase, setPhase] = useState('idle') // idle | loading | error
  const [fileError, setFileError] = useState(null)
  const [live, setLive] = useState('')
  const [resultsLive, setResultsLive] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: 'row', dir: 'asc' })
  const [editing, setEditing] = useState(null)
  const [confirmReplace, setConfirmReplace] = useState(false)
  const [trayOpen, setTrayOpen] = useState(false)
  const dropRef = useRef(null)

  const ctx = useMemo(
    () => ({ startSeq, existingEmployees, today: ctxToday || new Date(), x, f }),
    [startSeq, ctxToday],
  )

  /* Send focus back to the file input whenever a file is rejected. This is
     repair, not focus stealing — the user just activated that control — and it
     makes the screen reader re-read the input now that aria-describedby points
     at the new error. It must run AFTER commit, so it is an effect rather than
     a requestAnimationFrame inside the handler. */
  useEffect(() => {
    if (fileError) dropRef.current?.focus()
  }, [fileError])

  const loadDemo = (key) => demoFile(key).then(handleFile)

  /* Load the demo workbook once per mount, and only if the step is still
     empty — coming BACK from the review step must not re-import over rows the
     presenter has already repaired. */
  useEffect(() => {
    const key = demoKey()
    if (!key || file || result) return
    let cancelled = false
    demoFile(key).then((f) => {
      if (!cancelled) handleFile(f)
    })
    return () => {
      cancelled = true
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const rows = result?.rows || []
  const counts = result?.counts

  const linkLabel = (r) => {
    if (!r.linkedTo) return '—'
    if (r.linkedTo.startsWith('b:')) {
      const target = rows.find((o) => `b:${o.id}` === r.linkedTo)
      return target ? `${target.firstName} ${target.lastName}`.trim() : '—'
    }
    return existingEmployees.find((e) => e.id === r.linkedTo)?.name || '—'
  }

  /* revalidate() returns only what it recomputes (rows, counts, premiumTotal).
     Merge it onto the existing result so the file-level facts — sheetName,
     notices, totalDataRows, extraColumns, nextSeq — survive every edit. */
  const setResult = (next) => onImportState({ file, result: { ...result, ...next } })

  /* ---- file handling ---- */

  const handleFile = async (picked) => {
    setFileError(null)
    setPhase('loading')
    setLive(x.live.selected(picked.name, fmtSize(picked.size)))
    onImportState({ file: picked, result: null })

    /* A short floor on the spinner: parsing 500 rows takes well under 100ms
       and registryLookup is synchronous, so without it the loading state is
       never perceivable and the screen appears to do nothing. */
    const [raw] = await Promise.all([
      readInsuredWorkbook(picked, ctx),
      new Promise((r) => setTimeout(r, 450)),
    ])
    const built = buildImport(raw, ctx)

    if (built.fileError) {
      setPhase('error')
      setFileError(built.fileError.message)
      onImportState({ file: null, result: null })
      setLive('')
      return
    }

    setPhase('idle')
    setLive('')
    onImportState({ file: picked, result: built })
    setFilter(built.counts.error > 0 ? 'errors' : 'all')
    setPage(1)
    setSort({ key: 'row', dir: 'asc' })
    setResultsLive(
      built.counts.importable === 0
        ? x.live.doneNone(built.counts.error)
        : built.counts.error === 0 && built.counts.warning === 0
          ? x.live.doneClean(built.counts.importable)
          : x.live.doneMixed(built.counts.total, built.counts.importable, built.counts.error, built.counts.warning),
    )
  }

  const handleReject = (reason, picked) => {
    setPhase('error')
    setFileError(
      reason === 'size'
        ? x.fileErr.size((picked.size / (1024 * 1024)).toFixed(1), 5)
        : picked.name.toLowerCase().endsWith('.csv')
          ? x.fileErr.csv
          : picked.name.toLowerCase().endsWith('.xls')
            ? x.fileErr.xls
            : x.fileErr.type,
    )
  }

  const handleClear = () => {
    onImportState({ file: null, result: null })
    setPhase('idle')
    setFileError(null)
    setEditing(null)
    setConfirmReplace(false)
    setFilter('all')
    setPage(1)
  }

  /* ---- row operations ---- */

  const removeRows = (ids) => {
    const set = new Set(ids)
    /* Mirrors the single form's removeRow: dropping an employee drops the
       family members linked to them. The difference is that here it is
       ANNOUNCED — at 100 rows a silent cascade is invisible data loss. */
    const cascade = rows
      .filter((r) => set.has(r.id) && r.who === 'employee')
      .flatMap((e) => rows.filter((fam) => fam.linkedTo === `b:${e.id}` && !fam.removed).map((fam) => fam.id))
    cascade.forEach((id) => set.add(id))
    setResult(revalidate(rows.map((r) => (set.has(r.id) ? { ...r, removed: true } : r)), ctx))
    setResultsLive(cascade.length ? x.live.removedCascade(set.size, cascade.length) : x.live.removed(set.size))
  }

  const restoreRow = (id) => {
    setResult(revalidate(rows.map((r) => (r.id === id ? { ...r, removed: false } : r)), ctx))
    setResultsLive(x.live.restored(1))
  }

  const removeAllErrors = () => removeRows(rows.filter((r) => !r.removed && r.status === 'error').map((r) => r.id))

  const applyEdit = (id, key, value) => {
    setResult(
      revalidate(
        rows.map((r) => {
          if (r.id !== id) return r
          /* The raw-text complaint for this cell is stale the moment the user
             supplies a real value — same rule as the single form's
             "editing a field clears its own error". */
          const cleared = clearParseIssue(r, key === 'linkedTo' ? 'linkPid' : key)
          const next = { ...cleared, [key]: value }
          if (key === 'linkedTo') next.linkPid = ''
          if (key === 'who' && value === 'employee') {
            next.linkedTo = ''
            next.relation = ''
            next.linkPid = ''
          }
          return next
        }),
        ctx,
      ),
    )
  }

  /* ---- derived view state ---- */

  const visible = rows.filter((r) => !r.removed)
  const filtered = visible.filter((r) =>
    filter === 'all' ? true
      : filter === 'errors' ? r.status === 'error'
        : filter === 'warnings' ? r.status === 'warning'
          : filter === 'exists' ? r.status === 'exists'
            : r.status === 'ok',
  )
  const sorted = [...filtered].sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1
    if (sort.key === 'status') {
      const d = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      return (d || a.excelRow - b.excelRow) * dir
    }
    return (a.excelRow - b.excelRow) * dir
  })
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const pageRows = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const onSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: SORT_FIRST_DIR[key] || 'asc' }))

  const changeFilter = (v) => {
    setFilter(v)
    setPage(1)
    const n = visible.filter((r) =>
      v === 'all' ? true
        : v === 'errors' ? r.status === 'error'
          : v === 'warnings' ? r.status === 'warning'
            : v === 'exists' ? r.status === 'exists'
              : r.status === 'ok',
    ).length
    setResultsLive(x.live.filtered(n))
  }

  const COLS = [
    {
      key: 'row',
      header: x.cols.row,
      rowHeader: true,
      sortable: true,
      width: 96,
      render: (r) => <span className="gpi-table__id">{r.excelRow}</span>,
    },
    {
      key: 'name',
      header: x.cols.name,
      render: (r) => (
        <div className="gpi-table__stack">
          <span>{`${r.firstName} ${r.lastName}`.trim() || '—'}</span>
          <span className="gpi-table__sub">
            {r.who === 'employee'
              ? t.batch.employeeTag
              : `${relationByValue(r.relation)?.label || t.who.family} → ${linkLabel(r)}`}
          </span>
        </div>
      ),
    },
    { key: 'pid', header: x.cols.pid, render: (r) => <span className="gpi-table__id">{r.pid || '—'}</span> },
    { key: 'birth', header: x.cols.birth, render: (r) => <span className="gpi-table__muted">{r.birth || '—'}</span> },
    {
      key: 'pkg',
      header: x.cols.package,
      render: (r) => {
        const pk = packageByValue(r.pkg)
        return pk ? `${pk.label} · ${fmtGel(pk.premium)}` : <span className="gpi-table__muted">—</span>
      },
    },
    {
      key: 'status',
      header: x.cols.status,
      sortable: true,
      render: (r) => (
        /* The WORD inside the badge is the signal; the icon is redundant shape
           and the row tint is decoration (SC 1.4.1). */
        <Badge color={BADGE[r.status]} size="sm">
          <Icon name={BADGE_ICON[r.status]} size={16} aria-hidden="true" />
          {STATUS_LABEL[r.status]}
        </Badge>
      ),
    },
    {
      key: 'issues',
      header: x.cols.issues,
      render: (r) =>
        !r.issues.length ? (
          <span className="gpi-table__muted">—</span>
        ) : r.issues.length === 1 ? (
          <span className={`b2b-xl__issues${r.issues[0].severity === 'error' ? ' b2b-hint-err' : ''}`}>
            {r.issues[0].message}
          </span>
        ) : (
          <ul className="b2b-xl__issues">
            {r.issues.map((i) => (
              <li key={i.ruleId} className={i.severity === 'error' ? 'b2b-hint-err' : undefined}>
                {i.message}
              </li>
            ))}
          </ul>
        ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: 108,
      render: (r) => (
        /* Every row has the same two buttons, so the accessible name must
           carry WHICH row — a screen reader lists them out of context. */
        <div className="b2b-xl__rowactions">
          <IconButton
            icon="pencil"
            tone="neutral"
            type="button"
            title={t.batch.edit}
            aria-label={`${t.batch.edit}: ${rowRef(r)}, ${x.cols.row} ${r.excelRow}`}
            onClick={() => setEditing(r.id)}
          />
          <IconButton
            icon="trash"
            tone="danger"
            type="button"
            title={t.batch.remove}
            aria-label={`${t.batch.remove}: ${rowRef(r)}, ${x.cols.row} ${r.excelRow}`}
            onClick={() => removeRows([r.id])}
          />
        </div>
      ),
    },
  ]

  const removed = rows.filter((r) => r.removed)
  const editingRow = editing ? rows.find((r) => r.id === editing) : null

  return (
    /* The rules side panel belongs to the UPLOAD state — it tells you what to
       put in the file. Once results are on screen the user is repairing rows,
       and the issue text is what they need; keeping a 300px panel there pushed
       the სტატუსი and შენიშვნა columns off the edge (measured: 240px clipped).
       So the results state takes the full canvas. */
    <div className={`b2b-wiz__cols b2b-xl${result ? ' b2b-xl--wide' : ''}`}>
      <div className="b2b-wiz__main">
        <ContractChip />

        {!result && (
          <>
            <h2 className="b2b-wiz__h">{x.heading}</h2>
            <div className="b2b-xl__steps">
              <NumberedStep num="1" title={x.step1} body={x.step1Body}>
                {/* A link, not a Button: Button renders <button> and cannot
                    carry href/download. The template is a data: URI so it also
                    works in the single-file share build, where public/ is not
                    copied. */}
                <a className="gpi-btn gpi-btn--secondary gpi-btn--md" href={TEMPLATE_DATA_URI} download={TEMPLATE_FILENAME}>
                  <Icon name="download" size={20} />
                  <span>{x.download}</span>
                </a>
              </NumberedStep>
              <NumberedStep num="2" title={x.step2} body={x.step2Body} />
            </div>
          </>
        )}

        <FileDropzone
          inputRef={dropRef}
          accept=".xlsx"
          acceptMime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          maxSizeBytes={MAX_BYTES}
          state={phase === 'loading' ? 'loading' : 'idle'}
          /* Results on screen → the dropzone shrinks to a one-line file strip
             (user, 2026-08-04: the table is the work, the file is not). */
          compact={!!result}
          file={file}
          error={fileError}
          announcement={live}
          onFile={handleFile}
          onReject={handleReject}
          onClear={result ? undefined : handleClear}
          title={x.dropTitle}
          browseLabel={x.dropBrowse}
          replaceLabel={x.dropReplace}
          hint={x.dropReqs}
          subhint={x.dropHint}
          loadingLabel={x.validating}
          clearLabel={x.clearFile}
          formatSize={fmtSize}
        />

        {!result && !fileError && (
          <InlineAlert tone="info" title={x.tipTitle}>
            {x.tipBody}
          </InlineAlert>
        )}

        {result && (
          <>
            <p className="b2b-xl__preflight">
              {x.readSummary(result.sheetName, result.totalDataRows)}
              {(result.notices || []).map((n) => ` · ${n.message}`).join('')}
            </p>

            {counts.error > 0 ? (
              <InlineAlert tone="error" title={x.blockTitle(counts.error)}>
                {x.blockBody}
              </InlineAlert>
            ) : (
              <InlineAlert tone="success" title={x.allClearTitle}>
                {x.allClearBody(counts.importable, fmtGel(result.premiumTotal))}
              </InlineAlert>
            )}

            <div className="b2b-xl__stats">
              <StatTile label={x.stats.total} value={counts.total} />
              <StatTile label={x.stats.ready} value={counts.importable} icon="check" tone="success" />
              <StatTile label={x.stats.errors} value={counts.error} icon="alert-circle" tone={counts.error ? 'danger' : 'default'} />
              <StatTile label={x.stats.premium} value={fmtGel(result.premiumTotal)} meta={t.batch.perMonth} />
            </div>

            <div className="b2b-xl__toolbar">
              <FilterChips
                label={x.filterLabel}
                value={filter}
                onChange={changeFilter}
                options={[
                  { id: 'all', label: x.filters.all, count: visible.length },
                  { id: 'errors', label: x.filters.errors, count: counts.error },
                  { id: 'warnings', label: x.filters.warnings, count: counts.warning },
                  { id: 'exists', label: x.filters.exists, count: counts.exists },
                  { id: 'ready', label: x.filters.ready, count: counts.ready },
                ]}
              />
              <div className="b2b-xl__toolactions">
                {counts.error > 0 && (
                  <Button variant="danger-tertiary" size="sm" type="button" leadingIcon="trash" onClick={removeAllErrors}>
                    {x.removeAllErrors(counts.error)}
                  </Button>
                )}
                <Button variant="tertiary" size="sm" type="button" leadingIcon="rotate-ccw" onClick={() => setConfirmReplace(true)}>
                  {x.replaceFile}
                </Button>
              </div>
            </div>

            <DataTable
              caption={x.tableCaption}
              columns={COLS}
              rows={pageRows}
              rowKey={(r) => r.id}
              sort={sort}
              onSort={onSort}
              rowClassName={(r) =>
                r.status === 'error' ? 'is-invalid' : r.status === 'warning' ? 'is-warn' : r.status === 'exists' ? 'is-exists' : undefined
              }
              empty={{
                icon: 'check',
                title: x.emptyFilterTitle,
                hint: x.emptyFilterHint,
                actionLabel: x.emptyFilterAction,
                onAction: () => changeFilter('all'),
              }}
            />

            {pages > 1 && (
              <div className="b2b-page__pagination">
                <Pagination current={current} total={pages} onChange={setPage} />
              </div>
            )}

            <p className="b2b-xl__ledger">{x.ledger(counts.importable, counts.removed)}</p>

            {removed.length > 0 && (
              <div className="b2b-batch">
                <div className="b2b-batch__hd b2b-xl__trayhd">
                  {x.removedTray(removed.length)}
                  <Button variant="tertiary" size="sm" type="button" aria-expanded={trayOpen} onClick={() => setTrayOpen((o) => !o)}>
                    {trayOpen ? x.removedHide : x.removedShow}
                  </Button>
                </div>
                {trayOpen &&
                  removed.map((r) => (
                    <div key={r.id} className="b2b-batch__row">
                      <div className="b2b-batch__txt">
                        <div className="b2b-batch__name">{rowRef(r)}</div>
                        <div className="b2b-batch__meta">
                          {x.cols.row} {r.excelRow} · {r.pid || '—'}
                        </div>
                      </div>
                      <div className="b2b-batch__actions">
                        <button
                          type="button"
                          className="b2b-batch__iconbtn"
                          aria-label={`${x.rowRestore}: ${rowRef(r)}`}
                          title={x.rowRestore}
                          onClick={() => restoreRow(r.id)}
                        >
                          <Icon name="rotate-ccw" size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                <div className="b2b-batch__total">
                  <span>{x.removedNote}</span>
                </div>
              </div>
            )}
          </>
        )}

        <span className="gpi-sr-only" role="status" aria-live="polite">
          {resultsLive}
        </span>
      </div>

      {!result && (
        <div className="b2b-wiz__side">
          <div className="b2b-wiz__sideplain">
            <span className="b2b-wiz__sidelbl">{t.contractLabel}</span>
            <span className="b2b-wiz__sideval">{contract.label}</span>
          </div>
          <div className="b2b-wiz__sidecard">
            <div className="b2b-wiz__sidehd">{t.side.rulesTitle}</div>
            <InlineAlert tone="success" title={t.side.ruleWindowTitle}>
              {t.side.ruleWindow}
            </InlineAlert>
            <InlineAlert tone="warning" title={t.side.rulePackageTitle}>
              {t.side.rulePackage}
            </InlineAlert>
            <InlineAlert tone="info" title={t.side.ruleWaitTitle}>
              {t.side.ruleWait}
            </InlineAlert>
          </div>
          <div className="b2b-wiz__sidetext">{t.side.nextBody}</div>
        </div>
      )}

      {/* Gated on !editing: the shared Modal and Drawer both listen for Escape
          on document, so stacking them would double-close. The drawer applies
          edits live and therefore never needs a confirm of its own. */}
      {confirmReplace && !editing && (
        <ConfirmDialog
          title={x.replaceTitle}
          body={x.replaceBody}
          confirmLabel={x.replaceYes}
          keepLabel={x.replaceKeep}
          onConfirm={handleClear}
          onClose={() => setConfirmReplace(false)}
        />
      )}

      {!STUDY && <DemoBar loaded={!!file || !!result} onLoad={loadDemo} onReset={handleClear} />}

      {editingRow && (
        <ImportRowDrawer
          row={editingRow}
          rows={rows}
          onChange={applyEdit}
          onRemove={(id) => {
            removeRows([id])
            setEditing(null)
          }}
          onNext={() => setEditing(nextErrorId(rows, editing))}
          hasNext={!!nextErrorId(rows, editing)}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
