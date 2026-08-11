import { useEffect, useMemo, useRef, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import Pagination from '../components/Pagination.jsx'
import FilterChips from '../components/FilterChips.jsx'
import FileDropzone from '../components/FileDropzone.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import DemoBar from '../components/DemoBar.jsx'
import Badge from '../components/Badge.jsx'
import { Button, IconButton } from '../components/Button.jsx'
import Icon from '../lib/Icon.jsx'
import ImportRowDrawer, { rowRef } from './ImportRowDrawer.jsx'
import ContractSelect from './ContractSelect.jsx'
import { kaB2B } from './strings.js'
import { packageByValue, relationByValue, existingEmployeesFor, employeeByPidFor } from './data/addInsured.js'
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

/* DemoBar moved to components/DemoBar.jsx 2026-08-10 (second consumer: the
   accounts console). The ?study guard moved with it, so this file no longer
   needs its own STUDY constant — a study participant still never sees the bar.
   One click here puts the screen in the uploaded state with real broken rows. */

export default function StepExcel({ excel, onImportState, startSeq, ctxToday, contract, onContract }) {
  const { file, result } = excel
  const [phase, setPhase] = useState('idle') // idle | loading | error
  const [fileError, setFileError] = useState(null)
  const [live, setLive] = useState('')
  const [resultsLive, setResultsLive] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: 'row', dir: 'asc' })
  const [editing, setEditing] = useState(null)
  /* The file picked while a batch is already on screen, held until confirmed. */
  const [pendingFile, setPendingFile] = useState(null)
  const [trayOpen, setTrayOpen] = useState(false)
  const dropRef = useRef(null)

  /* Contract-scoped context: already-insured + link-to-existing checks depend
     on the selected contract's employee roster. */
  const ctx = useMemo(
    () => ({
      startSeq,
      existingEmployees: existingEmployeesFor(contract.id),
      employeeByPid: employeeByPidFor(contract.id),
      today: ctxToday || new Date(),
      x,
      f,
    }),
    [startSeq, ctxToday, contract.id],
  )

  /* Send focus back to the file input whenever a file is rejected. This is
     repair, not focus stealing — the user just activated that control — and it
     makes the screen reader re-read the input now that aria-describedby points
     at the new error. It must run AFTER commit, so it is an effect rather than
     a requestAnimationFrame inside the handler. */
  useEffect(() => {
    if (fileError) dropRef.current?.focus()
  }, [fileError])

  /* Demo bar (dev/presentation aid) goes straight to runImport — picking a demo
     workbook IS the explicit intent, and it has its own reset. */
  const loadDemo = (key) => demoFile(key).then(runImport)

  /* Load the demo workbook once per mount, and only if the step is still
     empty — coming BACK from the review step must not re-import over rows the
     presenter has already repaired. */
  useEffect(() => {
    const key = demoKey()
    if (!key || file || result) return
    let cancelled = false
    demoFile(key).then((f) => {
      if (!cancelled) runImport(f)
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
    return ctx.existingEmployees.find((e) => e.id === r.linkedTo)?.name || '—'
  }

  /* revalidate() returns only what it recomputes (rows, counts, premiumTotal).
     Merge it onto the existing result so the file-level facts — sheetName,
     notices, totalDataRows, extraColumns, nextSeq — survive every edit. */
  const setResult = (next) => onImportState({ file, result: { ...result, ...next } })

  /* Contract switched with a validated file on screen (parent already ran the
     confirm): re-run the row rules against the new contract's roster. Keyed on
     contract.id via a ref so it never fires on mount; page resets because the
     error set — and with it the row order under the errors filter — can change. */
  const prevContractRef = useRef(contract.id)
  useEffect(() => {
    if (prevContractRef.current === contract.id) return
    prevContractRef.current = contract.id
    if (!result) return
    setResult(revalidate(result.rows, ctx))
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract.id])

  /* ---- file handling ---- */

  /* Replacing the file is ONE action with ONE control: the „სხვა ფაილის არჩევა"
     label on the file strip itself (user, 2026-08-06 — the file's controls belong
     with the file; the duplicate toolbar button was removed). Because that label
     is the native input's label, the OS picker opens before we can intervene —
     so the guard runs AFTER the pick, which also lets the dialog name the
     incoming file. Rejected files (wrong type/size) never reach here: the
     dropzone screens them and calls onReject instead. */
  const handleFile = (picked) => {
    if (result) return setPendingFile(picked)
    runImport(picked)
  }

  const runImport = async (picked) => {
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
    setPendingFile(null)
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

  /* Bulk remove also leaves the errors filter — it would otherwise strand the
     user on „შეცდომით · 0" with an empty table (audit 2026-08-06). Single-row
     repairs/removals keep the filter: mid-cleanup you want the remaining errors. */
  const removeAllErrors = () => {
    removeRows(rows.filter((r) => !r.removed && r.status === 'error').map((r) => r.id))
    changeFilter('all')
  }

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
        <ContractSelect contract={contract} onSelect={onContract} />

        {/* Guidance minimized 2026-08-06 (user): portal users are trained and know
            the flow by heart, so the two onboarding step cards were dropped — the
            dropzone IS the job and takes the hero position. The template survives
            as a quiet inline link beside the heading (an <a>, not a Button: Button
            renders <button> and cannot carry href/download; the data: URI also
            works in the single-file share build, where public/ is not copied).
            The "don't change the header row" warning was cut with the cards —
            the importer detects header drift at validation time and reports it. */}
        {!result && (
          <div className="b2b-xl__hd">
            <h2 className="b2b-wiz__h">{x.heading}</h2>
            <a className="gpi-link" href={TEMPLATE_DATA_URI} download={TEMPLATE_FILENAME}>
              <Icon name="download" size={16} />
              <span>{x.download}</span>
            </a>
          </div>
        )}

        <FileDropzone
          inputRef={dropRef}
          accept=".xlsx"
          acceptMime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          maxSizeBytes={MAX_BYTES}
          state={phase === 'loading' ? 'loading' : 'idle'}
          /* Results on screen → the dropzone shrinks to a one-line file strip
             (user, 2026-08-04: the table is the work, the file is not), and the
             import stats live INSIDE it (user, 2026-08-06 — they describe the
             file, so they sit with the file; frees a whole row above the table).
             შეცდომა renders only when > 0; the premium total only when the
             batch is CLEAN — a total over broken rows is provisional and reads
             as misleading. The footer hint keeps the fix-or-remove guidance. */
          compact={!!result}
          compactLabel={x.fileLabel}
          extra={
            result && counts ? (
              <span className="b2b-xl__filestats">
                <span className="b2b-xl__sumitem">
                  {x.stats.total} <strong>{counts.total}</strong>
                </span>
                <span className="b2b-xl__sumitem is-ok">
                  <Icon name="check" size={14} />
                  {x.stats.ready} <strong>{counts.importable}</strong>
                </span>
                {counts.error > 0 && (
                  <span className="b2b-xl__sumitem is-bad">
                    <Icon name="alert-circle" size={14} />
                    {x.stats.errors} <strong>{counts.error}</strong>
                  </span>
                )}
                {counts.error === 0 && (
                  <span className="b2b-xl__sumitem">
                    {x.stats.premium} <strong>{fmtGel(result.premiumTotal)}</strong> {t.batch.perMonth}
                  </span>
                )}
              </span>
            ) : null
          }
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

        {result && (
          <>
            {/* Routine read-out (sheet name, row count) dropped 2026-08-06 —
                the row count is in the strip's stats. Only the IRREGULARITIES
                (ignored columns, skipped blank rows, multi-sheet pick) still
                surface, and only when there are any. */}
            {(result.notices || []).length > 0 && (
              <p className="b2b-xl__preflight">{result.notices.map((n) => n.message).join(' · ')}</p>
            )}

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
              </div>
            </div>

            {/* No rowClassName tints since 2026-08-06 (user): the status badge +
                red note already carry the state; a full-row wash was noise.
                DataTable's rowClassName capability itself stays for other tables. */}
            <DataTable
              caption={x.tableCaption}
              columns={COLS}
              rows={pageRows}
              rowKey={(r) => r.id}
              sort={sort}
              onSort={onSort}
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

      {/* No contract read-out here (audit 2026-08-06): the selector chip at the
          top of the main column already names it on this same screen. */}
      {!result && (
        <div className="b2b-wiz__side">
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
      {pendingFile && !editing && (
        <ConfirmDialog
          title={x.replaceTitle}
          body={x.replaceBody(pendingFile.name)}
          confirmLabel={x.replaceYes}
          keepLabel={x.replaceKeep}
          onConfirm={() => {
            const next = pendingFile
            setPendingFile(null)
            runImport(next)
          }}
          onClose={() => setPendingFile(null)}
        />
      )}

      <DemoBar
        actions={[
          { label: 'file with errors', onClick: () => loadDemo('errors') },
          { label: 'clean file', onClick: () => loadDemo('clean') },
          ...(file || result ? [{ label: 'reset', onClick: handleClear, ghost: true }] : []),
        ]}
      />

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
          employees={ctx.existingEmployees}
        />
      )}
    </div>
  )
}
