/* Excel import engine for the B2B add-insured wizard.

   Pure: no React, no DOM, no Georgian literals. Every user-facing message
   arrives through `ctx.x` (kaB2B.addIns.excel) and `ctx.f` (kaB2B.addIns.form),
   so the importer and the single-person form always speak the same words.

   Three stages:
     readInsuredWorkbook(file, ctx)  async — touches the library, never throws
     buildImport(raw, ctx)           sync  — header mapping + rows + validation
     revalidate(rows, ctx)           sync  — re-runs every rule after an edit

   The rows this produces carry the SAME 13 keys as emptyDraft(), so `toPerson`
   can hand them to the wizard's `people[]` untouched. */

/* The package has NO root export — only the `/browser`, `/node`, `/universal`
   and `/web-worker` subpaths. The default export resolves to every sheet as
   { sheet, data }, which is why we call it once and read both the sheet name
   and the matrix from one result. */
import readXlsxFile from 'read-excel-file/browser'
import {
  packages,
  relations,
  existingEmployees,
  employeeByPid,
  registryLookup,
  emptyDraft,
} from './addInsured.js'
import { COLUMNS, TEMPLATE_SHEET } from './importColumns.js'

export const MAX_BYTES = 5 * 1024 * 1024
export const MAX_ROWS = 500
const MIN_HEADER_HITS = 7

/* ---- normalisation ---------------------------------------------------------

   NFC is load-bearing for Georgian: visually identical Mkhedruli text coming
   from different editors can differ byte-wise, and would then fail an equality
   test against our vocabulary. toLowerCase() is a NO-OP for Georgian (Mkhedruli
   is unicameral) — it is here only for the Latin aliases. Do not remove either
   call thinking the other covers it. */
export const norm = (v) =>
  String(v ?? '')
    .normalize('NFC')
    .replace(/[​‌‍﻿ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const normHeader = (v) => norm(v).replace(/[*＊]+$/, '').trim().toLowerCase()

const fold = (v) => norm(v).toLowerCase()

/* Column contract lives in its own dependency-free module so the node-side
   template generator can import it too — see data/importColumns.js. */
export { COLUMNS, TEMPLATE_SHEET }

/* Explicit, auditable aliases only. Fuzzy matching is deliberately FORBIDDEN:
   a wrong guess loads data into the wrong field silently, which is strictly
   worse than a clear error naming the column we could not find. */
const ALIASES = {
  who: ['ტიპი', 'type', 'კატეგორია'],
  citizen: ['მოქალაქეობა', 'რეზიდენტობა', 'citizenship', 'residency'],
  pid: ['პირადი ნომერი', 'პირადი №', 'პირადი nomeri', 'პ/ნ', 'personal id', 'personal number', 'pid'],
  birth: ['დაბადების თარიღი', 'დაბ. თარიღი', 'birth date', 'date of birth', 'dob'],
  firstName: ['სახელი', 'first name', 'name'],
  lastName: ['გვარი', 'last name', 'surname'],
  gender: ['სქესი', 'gender', 'sex'],
  linkPid: ['თანამშრომლის პირადი ნომერი', 'თანამშრომლის პ/ნ', 'employee personal id', 'employee id'],
  relation: ['კავშირი', 'ნათესაური კავშირი', 'relation', 'relationship'],
  mobile: ['მობილური', 'ტელეფონი', 'mobile', 'phone'],
  email: ['ელ-ფოსტა', 'ელ. ფოსტა', 'ელფოსტა', 'email', 'e-mail'],
  address: ['მისამართი', 'address'],
  pkg: ['სადაზღვევო პაკეტი', 'პაკეტი', 'package', 'plan'],
}

const REQUIRED_KEYS = COLUMNS.filter((c) => c.required).map((c) => c.key)
const HEADER_BY_KEY = Object.fromEntries(COLUMNS.map((c) => [c.key, c.header]))

/* ---- value vocabularies ----------------------------------------------------
   Georgian labels are read from data/addInsured.js at runtime so the copy can
   never drift from the dropdowns the single form offers. */
const WHO_VOCAB = [
  { value: 'employee', words: ['თანამშრომელი', 'employee', 'staff'] },
  { value: 'family', words: ['ოჯახის წევრი', 'ოჯახის', 'family', 'dependent'] },
]
const CITIZEN_VOCAB = [
  { value: 'resident', words: ['საქართველოს მოქალაქე', 'რეზიდენტი', 'მოქალაქე', 'resident', 'ge'] },
  { value: 'nonresident', words: ['არარეზიდენტი', 'არა რეზიდენტი', 'nonresident', 'non-resident'] },
]
/* Single Georgian letters are rejected for gender: "მ" prefixes BOTH
   მამრობითი and მდედრობითი. Latin m/f are unambiguous and common in HR
   exports, so those are allowed. */
const GENDER_VOCAB = [
  { value: 'male', words: ['მამრობითი', 'male', 'm'] },
  { value: 'female', words: ['მდედრობითი', 'female', 'f'] },
]
const REL_VOCAB = () =>
  relations.map((r) => ({
    value: r.value,
    words: [r.label, { spouse: 'spouse', child: 'child', parent: 'parent', other: 'other' }[r.value]].filter(Boolean),
  }))
const PKG_VOCAB = () =>
  packages.map((p) => ({
    value: p.value,
    words: [p.label, { basic: 'basic', optimal: 'optimal', premium: 'premium' }[p.value]].filter(Boolean),
  }))

const matchVocab = (vocab, raw) => {
  const v = fold(raw)
  if (!v) return null
  return vocab.find((o) => o.words.some((w) => fold(w) === v))?.value ?? null
}

const listLabels = (arr) => arr.map((a) => a.label).join(', ')

/* ---- dates -----------------------------------------------------------------
   Excel hands back a real Date for date-formatted cells; typed cells arrive as
   strings in any of three separator styles. Everything is normalised to
   DD/MM/YYYY so `draft.birth` round-trips byte-identically into registryLookup
   and into the single form. */
const pad2 = (n) => String(n).padStart(2, '0')
const fmtDate = (d, m, y) => `${pad2(d)}/${pad2(m)}/${y}`

function parseBirth(cell) {
  if (cell instanceof Date && !Number.isNaN(cell.getTime())) {
    return { ok: true, value: fmtDate(cell.getDate(), cell.getMonth() + 1, cell.getFullYear()), date: cell }
  }
  const s = norm(cell)
  if (!s) return { ok: false, reason: 'blank' }
  const m = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/)
  if (!m) return { ok: false, reason: 'format' }
  const d = +m[1]
  const mo = +m[2]
  const y = +m[3]
  const dt = new Date(y, mo - 1, d)
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) {
    return { ok: false, reason: 'invalid', value: fmtDate(d, mo, y) }
  }
  return { ok: true, value: fmtDate(d, mo, y), date: dt }
}

const yearsBetween = (from, to) => {
  let age = to.getFullYear() - from.getFullYear()
  const before = to.getMonth() < from.getMonth() || (to.getMonth() === from.getMonth() && to.getDate() < from.getDate())
  return before ? age - 1 : age
}

/* ---- stage 1: read the workbook -------------------------------------------- */

const fileErr = (code, message) => ({ fileError: { code, message }, sheetName: '', sheetCount: 0, matrix: [] })

export async function readInsuredWorkbook(file, ctx) {
  const x = ctx.x
  const name = (file?.name || '').toLowerCase()

  if (name.endsWith('.xls')) return fileErr('F_TYPE_XLS', x.fileErr.xls)
  if (name.endsWith('.csv') || name.endsWith('.tsv')) return fileErr('F_TYPE_CSV', x.fileErr.csv)
  if (!name.endsWith('.xlsx')) return fileErr('F_TYPE_OTHER', x.fileErr.type)
  if (file.size > MAX_BYTES) {
    return fileErr('F_SIZE', x.fileErr.size((file.size / (1024 * 1024)).toFixed(1), 5))
  }

  try {
    /* One call returns every sheet as { sheet, data } — we need the name for
       the pre-flight line and the count for the multi-sheet notice, and
       `readSheet` would give us neither. */
    const sheets = await readXlsxFile(file)
    const list = Array.isArray(sheets) ? sheets : []
    /* Prefer the sheet the template ships with; otherwise fall back to the
       first one, so a user who renamed the tab is not dead in the water. */
    const chosen = list.find((s) => norm(s.sheet) === TEMPLATE_SHEET) || list[0]
    return {
      fileError: null,
      sheetName: chosen?.sheet || '',
      sheetCount: list.length || 1,
      matrix: Array.isArray(chosen?.data) ? chosen.data : [],
    }
  } catch (err) {
    const code = err?.code
    if (code === 'XLS_FILE_NOT_SUPPORTED') return fileErr('F_TYPE_XLS', x.fileErr.xls)
    if (code === 'FILE_NOT_SUPPORTED') return fileErr('F_TYPE_OTHER', x.fileErr.type)
    if (code === 'NO_DATA') return fileErr('F_EMPTY_FILE', x.fileErr.empty)
    /* INVALID_ZIP and every other throw (password-protected workbooks land
       here) collapse into one honest "we could not read it" message. */
    return fileErr('F_UNREADABLE', x.fileErr.unreadable)
  }
}

/* ---- stage 2: headers ------------------------------------------------------ */

function mapHeaders(headerRow, x) {
  const index = {}
  const dup = []
  const extra = []
  const seen = new Set()

  headerRow.forEach((cell, i) => {
    const h = normHeader(cell)
    if (!h) return
    const key = Object.keys(ALIASES).find((k) => ALIASES[k].some((a) => normHeader(a) === h))
    if (!key) {
      extra.push(norm(cell))
      return
    }
    if (seen.has(key)) {
      dup.push(HEADER_BY_KEY[key])
      return
    }
    seen.add(key)
    index[key] = i
  })

  if (dup.length) return { fileError: { code: 'F_HEADER_DUP', message: x.fileErr.headerDup(dup[0]) } }
  if (seen.size < MIN_HEADER_HITS) {
    const missing = COLUMNS.filter((c) => !(c.key in index)).map((c) => c.header)
    return { fileError: { code: 'F_TEMPLATE', message: x.fileErr.wrongTemplate(missing.slice(0, 4).join(', ')) } }
  }
  const missingReq = REQUIRED_KEYS.filter((k) => !(k in index)).map((k) => HEADER_BY_KEY[k])
  if (missingReq.length) {
    return { fileError: { code: 'F_HEADERS', message: x.fileErr.headers(missingReq.join(', ')) } }
  }
  return { index, extra }
}

/* ---- stage 2: build + validate --------------------------------------------- */

const EMPTY_RESULT = {
  notices: [],
  sheetName: '',
  sheetCount: 0,
  totalDataRows: 0,
  skippedEmpty: 0,
  extraColumns: [],
  rows: [],
  counts: { total: 0, ready: 0, warning: 0, error: 0, exists: 0, removed: 0, importable: 0 },
  premiumTotal: 0,
  nextSeq: 1,
}

export function buildImport(raw, ctx) {
  const x = ctx.x
  if (raw.fileError) return { ...EMPTY_RESULT, fileError: raw.fileError, nextSeq: ctx.startSeq }

  const matrix = raw.matrix || []
  if (!matrix.length) {
    return { ...EMPTY_RESULT, fileError: { code: 'F_EMPTY_FILE', message: x.fileErr.empty }, nextSeq: ctx.startSeq }
  }

  const mapped = mapHeaders(matrix[0] || [], x)
  if (mapped.fileError) return { ...EMPTY_RESULT, fileError: mapped.fileError, nextSeq: ctx.startSeq }
  const { index, extra } = mapped

  const body = matrix.slice(1)
  const isEmptyRow = (r) => !r || r.every((c) => !norm(c))
  let skippedEmpty = 0
  const kept = []
  body.forEach((r, i) => {
    if (isEmptyRow(r)) {
      skippedEmpty += 1
      return
    }
    kept.push({ cells: r, excelRow: i + 2 }) // header is row 1
  })

  if (!kept.length) {
    return { ...EMPTY_RESULT, fileError: { code: 'F_EMPTY', message: x.fileErr.empty }, nextSeq: ctx.startSeq }
  }
  if (kept.length > MAX_ROWS) {
    return {
      ...EMPTY_RESULT,
      fileError: { code: 'F_ROWS', message: x.fileErr.tooManyRows(kept.length, MAX_ROWS) },
      nextSeq: ctx.startSeq,
    }
  }

  const cellAt = (cells, key) => (index[key] == null ? '' : cells[index[key]])
  let seq = ctx.startSeq

  const rows = kept.map(({ cells, excelRow }) => {
    const rawVals = {}
    for (const c of COLUMNS) rawVals[c.key] = cellAt(cells, c.key)

    const row = {
      ...emptyDraft(),
      id: `p${seq++}`,
      excelRow,
      removed: false,
      parseIssues: [],
      issues: [],
      status: 'ok',
      raw: {},
      linkPid: '',
    }

    /* --- who (needed first: it decides which fields are required) --- */
    const whoRaw = norm(rawVals.who)
    const relRaw = norm(rawVals.relation)
    const linkRaw = norm(rawVals.linkPid)
    row.linkPid = linkRaw
    if (whoRaw) {
      const w = matchVocab(WHO_VOCAB, whoRaw)
      if (w) row.who = w
      else row.parseIssues.push({ ruleId: 'E_WHO_UNKNOWN', field: 'who', severity: 'error', message: x.err.who(whoRaw) })
    } else if (linkRaw || relRaw) {
      row.who = 'family'
      row.parseIssues.push({ ruleId: 'W_WHO_INFERRED', field: 'who', severity: 'warning', message: x.err.whoInferred })
    }

    /* --- citizenship --- */
    const citRaw = norm(rawVals.citizen)
    if (citRaw) {
      const c = matchVocab(CITIZEN_VOCAB, citRaw)
      if (c) row.citizen = c
      else row.parseIssues.push({ ruleId: 'W_CITIZEN_UNKNOWN', field: 'citizen', severity: 'warning', message: x.err.citizen(citRaw) })
    }

    /* --- personal id ---
       A NUMBER here means Excel already ate the leading zero. Pad and warn
       rather than reject: the user cannot see what Excel did to their cell. */
    const pidCell = rawVals.pid
    let pid = norm(pidCell)
    if (typeof pidCell === 'number' && /^\d{10}$/.test(String(pidCell))) {
      pid = '0' + String(pidCell)
      row.parseIssues.push({ ruleId: 'W_PID_PADDED', field: 'pid', severity: 'warning', message: x.err.pidLeadingZero(pid) })
    }
    row.pid = pid
    row.raw.pid = pid

    /* --- names, gender --- */
    row.firstName = norm(rawVals.firstName)
    row.lastName = norm(rawVals.lastName)
    const genderRaw = norm(rawVals.gender)
    if (genderRaw) {
      const g = matchVocab(GENDER_VOCAB, genderRaw)
      if (g) row.gender = g
      else row.parseIssues.push({ ruleId: 'E_GENDER_UNKNOWN', field: 'gender', severity: 'error', message: x.err.gender(genderRaw) })
    }

    /* --- birth date --- */
    const b = parseBirth(rawVals.birth)
    if (b.ok) {
      row.birth = b.value
      if (b.date > ctx.today) {
        row.parseIssues.push({ ruleId: 'E_BIRTH_FUTURE', field: 'birth', severity: 'error', message: x.err.dateFuture })
      } else {
        const age = yearsBetween(b.date, ctx.today)
        if (age > 100 || b.date.getFullYear() < 1920) {
          row.parseIssues.push({ ruleId: 'W_BIRTH_OLD', field: 'birth', severity: 'warning', message: x.err.dateOdd })
        }
        if (row.who === 'employee' && age < 16) {
          row.parseIssues.push({ ruleId: 'W_BIRTH_MINOR_EMP', field: 'birth', severity: 'warning', message: x.err.minorEmployee })
        }
      }
    } else if (b.reason === 'invalid') {
      row.birth = b.value
      row.parseIssues.push({ ruleId: 'E_BIRTH_INVALID', field: 'birth', severity: 'error', message: x.err.dateInvalid })
    } else if (b.reason === 'format') {
      row.birth = norm(rawVals.birth)
      row.parseIssues.push({ ruleId: 'E_BIRTH_FORMAT', field: 'birth', severity: 'error', message: x.err.date })
    }

    /* --- package --- */
    const pkgRaw = norm(rawVals.pkg)
    if (pkgRaw) {
      const p = matchVocab(PKG_VOCAB(), pkgRaw)
      if (p) row.pkg = p
      else row.parseIssues.push({ ruleId: 'E_PKG_UNKNOWN', field: 'pkg', severity: 'error', message: x.err.package(pkgRaw, listLabels(packages)) })
    }

    /* --- relation --- */
    if (relRaw) {
      const r = matchVocab(REL_VOCAB(), relRaw)
      if (r) row.relation = r
      else row.parseIssues.push({ ruleId: 'E_REL_UNKNOWN', field: 'relation', severity: 'error', message: x.err.relation(relRaw, listLabels(relations)) })
      if (row.who === 'employee') {
        row.parseIssues.push({ ruleId: 'W_REL_IGNORED', field: 'relation', severity: 'warning', message: x.err.relationIgnored })
        row.relation = ''
      }
    }

    /* --- optional contact fields --- */
    row.mobile = norm(rawVals.mobile)
    row.email = norm(rawVals.email)
    row.address = norm(rawVals.address)

    for (const c of COLUMNS) if (row.raw[c.key] === undefined) row.raw[c.key] = norm(rawVals[c.key])
    return row
  })

  const ctx2 = { ...ctx, startSeq: ctx.startSeq }
  const result = runRowRules(rows, ctx2)
  return {
    ...result,
    fileError: null,
    sheetName: raw.sheetName,
    sheetCount: raw.sheetCount,
    totalDataRows: kept.length,
    skippedEmpty,
    extraColumns: extra,
    notices: buildNotices({ sheetCount: raw.sheetCount, sheetName: raw.sheetName, extra, skippedEmpty }, x),
    nextSeq: seq,
  }
}

function buildNotices({ sheetCount, sheetName, extra, skippedEmpty }, x) {
  const out = []
  if (sheetCount > 1) out.push({ code: 'F_MULTISHEET', severity: 'warning', message: x.notice.multiSheet(sheetCount, sheetName) })
  if (extra.length) out.push({ code: 'F_EXTRA_COLS', severity: 'info', message: x.notice.extraCols(extra.join(', ')) })
  if (skippedEmpty > 0) out.push({ code: 'F_SKIPPED_EMPTY', severity: 'info', message: x.notice.skippedEmpty(skippedEmpty) })
  return out
}

/* ---- cross-row + per-row rules that must re-run after every edit ------------

   A row carries TWO classes of issue and the distinction is load-bearing:

   · parseIssues — facts about the RAW cell that no amount of re-running rules
     can rediscover, because the typed row no longer holds the offending text
     ("ოქროს" is not a package; "31/02/1990" is not a date). They are computed
     once, in buildImport, and survive every revalidate.
   · rule issues — everything derivable from the typed row (required fields,
     formats, links, duplicates, registry). Recomputed from scratch each time so
     a fixed field's error disappears immediately.

   When the drawer edits a field, the UI calls clearParseIssue() for that field:
   the user has now supplied a real value, so the raw-text complaint is stale.
   This mirrors the single form's "editing a field clears its own error" rule. */

export const clearParseIssue = (row, field) => ({
  ...row,
  parseIssues: (row.parseIssues || []).filter((i) => i.field !== field),
})

function runRowRules(rows, ctx) {
  const x = ctx.x
  const f = ctx.f
  /* Contract-scoped employee lookup (2026-08-06): the already-insured check and
     link-to-existing resolution depend on WHICH contract is selected. Callers
     pass ctx.employeeByPid from employeeByPidFor(contractId); the module-level
     default keeps pre-selector callers on the default contract. */
  const lookupEmployee = ctx.employeeByPid || employeeByPid
  const live = rows.filter((r) => !r.removed)

  /* Pass 1 — index the employees this file itself introduces. Family rows may
     legitimately sit ABOVE their employee, so resolution cannot be top-down. */
  const inFileByPid = new Map()
  for (const r of live) {
    if (r.who === 'employee' && r.pid && !inFileByPid.has(r.pid)) inFileByPid.set(r.pid, r.id)
  }
  const firstSeenAt = new Map()

  /* Pass 2 — per-row rules. */
  for (const r of rows) {
    r.issues = [...(r.parseIssues || [])]
    if (r.removed) {
      r.status = 'error'
      continue
    }

    const add = (ruleId, field, severity, message) => r.issues.push({ ruleId, field, severity, message })
    /* A field that already carries a specific parse complaint must not ALSO be
       reported as "required" — the specific message is the useful one, and two
       messages for one cell reads as two separate problems. */
    const parsed = new Set((r.parseIssues || []).map((i) => i.field))
    const req = (field, ruleId) => {
      if (parsed.has(field)) return false
      add(ruleId, field, 'error', f.errRequired)
      return true
    }

    if (!r.pid) add('E_REQ_PID', 'pid', 'error', f.errRequired)
    else if (r.citizen === 'resident' && !/^\d{11}$/.test(r.pid)) add('E_PID_FORMAT', 'pid', 'error', f.errPid)
    else if (r.citizen === 'nonresident' && !/^[A-Za-z0-9]{5,20}$/.test(r.pid)) {
      add('E_PID_FORMAT_NR', 'pid', 'error', x.err.pidNonResident)
    }

    if (!r.birth) req('birth', 'E_REQ_BIRTH')
    if (!r.firstName) req('firstName', 'E_REQ_FIRST')
    if (!r.lastName) req('lastName', 'E_REQ_LAST')
    if (!r.gender) req('gender', 'E_REQ_GENDER')
    if (!r.pkg) req('pkg', 'E_REQ_PKG')

    if (r.who === 'family') {
      if (!r.relation) req('relation', 'E_REQ_REL')
      const v = norm(r.linkPid)
      if (!v && !r.linkedTo) add('E_REQ_LINK', 'linkPid', 'error', x.err.linkMissing)
      else if (v && v === r.pid) add('E_LINK_SELF', 'linkPid', 'error', x.err.linkSelf)
      else if (v) {
        const inFileId = inFileByPid.get(v)
        const target = inFileId ? live.find((o) => o.id === inFileId) : null
        const existing = lookupEmployee(v)
        const asFamily = live.find((o) => o.pid === v && o.who === 'family')
        if (target) r.linkedTo = `b:${target.id}`
        else if (existing) r.linkedTo = existing.id
        else if (asFamily) add('E_LINK_TO_FAMILY', 'linkPid', 'error', x.err.linkIsFamily)
        else add('E_LINK_UNKNOWN', 'linkPid', 'error', x.err.linkNotFound(v))
      }
    } else {
      r.linkedTo = ''
      r.relation = ''
    }

    /* Duplicate PID: the FIRST occurrence stays clean, later ones are flagged
       and point back at the row that already owns the number. */
    if (r.pid) {
      const first = firstSeenAt.get(r.pid)
      if (first == null) firstSeenAt.set(r.pid, r.excelRow)
      else add('E_DUP_IN_FILE', 'pid', 'error', x.err.dupInFile(first))
    }

    if (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(r.email)) add('W_EMAIL', 'email', 'warning', x.err.email)
    if (r.mobile) {
      const digits = r.mobile.replace(/[\s\-()]/g, '')
      if (!/^\+?995\d{9}$/.test(digits) && !/^5\d{8}$/.test(digits)) add('W_MOBILE', 'mobile', 'warning', x.err.mobile)
    }

    if (r.citizen === 'resident' && /^\d{11}$/.test(r.pid) && r.birth && !registryLookup(r.pid, r.birth)) {
      add('W_REGISTRY_NOT_FOUND', 'pid', 'warning', f.notFound)
    }

    if (r.pid && lookupEmployee(r.pid)) add('X_ALREADY_INSURED', 'pid', 'info', x.exists.body)
  }

  /* Pass 3 — cascade: a family row whose employee is broken cannot be fixed on
     its own, and must say so rather than looking arbitrarily invalid. */
  for (const r of rows) {
    if (r.removed || r.who !== 'family' || !r.linkedTo?.startsWith('b:')) continue
    const target = rows.find((o) => `b:${o.id}` === r.linkedTo)
    if (target && !target.removed && target.issues.some((i) => i.severity === 'error')) {
      r.issues.push({ ruleId: 'E_LINK_CASCADE', field: 'linkPid', severity: 'error', message: x.err.linkCascade(target.excelRow) })
    }
  }

  for (const r of rows) r.status = deriveStatus(r)
  return { rows, counts: countRows(rows), premiumTotal: premiumOf(rows) }
}

function deriveStatus(r) {
  if (r.removed) return 'error'
  if (r.issues.some((i) => i.severity === 'error')) return 'error'
  if (r.issues.some((i) => i.ruleId === 'X_ALREADY_INSURED')) return 'exists'
  if (r.issues.some((i) => i.severity === 'warning')) return 'warning'
  return 'ok'
}

function countRows(rows) {
  const live = rows.filter((r) => !r.removed)
  return {
    total: rows.length,
    ready: live.filter((r) => r.status === 'ok').length,
    warning: live.filter((r) => r.status === 'warning').length,
    error: live.filter((r) => r.status === 'error').length,
    exists: live.filter((r) => r.status === 'exists').length,
    removed: rows.filter((r) => r.removed).length,
    importable: importable(rows).length,
  }
}

const premiumOf = (rows) =>
  importable(rows).reduce((s, r) => s + (packages.find((p) => p.value === r.pkg)?.premium || 0), 0)

/* ---- stage 3 ---------------------------------------------------------------- */

export function revalidate(rows, ctx) {
  const next = rows.map((r) => ({ ...r, issues: [...r.issues] }))
  const res = runRowRules(next, ctx)
  return { fileError: null, ...res }
}

/* ---- handoff ---------------------------------------------------------------- */

const DRAFT_KEYS = Object.keys(emptyDraft())

/* Importer bookkeeping (excelRow, issues, raw, status, removed, linkPid) must
   NOT reach people[] — StepReview and submit() consume those objects directly. */
export const toPerson = (r) => {
  const p = { ...emptyDraft(), id: r.id }
  for (const k of DRAFT_KEYS) p[k] = r[k]
  return p
}

export const importable = (rows) =>
  rows.filter((r) => !r.removed && r.status !== 'error' && r.status !== 'exists')

export const nextErrorId = (rows, currentId) => {
  const live = rows.filter((r) => !r.removed && r.status === 'error')
  if (!live.length) return null
  const at = live.findIndex((r) => r.id === currentId)
  if (at === -1) return live[0].id
  return live[(at + 1) % live.length].id === currentId ? null : live[(at + 1) % live.length].id
}

export { existingEmployees }
