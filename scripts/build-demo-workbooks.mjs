/* Authoring script — run BY HAND, never in CI or at build time.

     node scripts/build-demo-workbooks.mjs

   Emits the two SAMPLE workbooks used to demo the Excel import in a live
   walkthrough, so nobody has to hand-fill a spreadsheet on stage:

     public/downloads/gpi-insured-demo-errors.xlsx   20 people, 7 broken rows
     public/downloads/gpi-insured-demo-clean.xlsx    10 people, all valid
     src/b2b/data/excelDemo.js                       the same bytes as data:
                                                     URIs, lazily imported by
                                                     StepExcel's ?demo= flag

   Same data:-URI reasoning as the template (see build-insured-template.mjs):
   the B2B single-file share build sets copyPublicDir:false, so a public/ path
   would 404 there. The module is imported dynamically, so these bytes only
   reach the browser when someone actually opens a ?demo= link.

   The header row is generated from the SAME COLUMNS contract the parser reads,
   so these files cannot drift from the template. Every defect below is
   deliberate and maps to a named rule in data/insuredImport.js — the comment on
   each row says which one. */

import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import writeXlsxFile from 'write-excel-file/node'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

const { COLUMNS, TEMPLATE_SHEET } = await import('../src/b2b/data/importColumns.js')

const HEADER_STYLE = { fontWeight: 'bold', backgroundColor: '#eef0fb', align: 'left', wrap: true }

/* An HR export almost always carries a column we do not know. Keeping one here
   exercises the "extra columns were ignored" notice — it is informational, not
   a failure, and that is worth showing. */
const EXTRA_HEADER = 'დეპარტამენტი'

const headerRow = (extra) => [
  ...COLUMNS.map((c) => ({ value: c.required ? `${c.header} *` : c.header, type: String, ...HEADER_STYLE })),
  ...(extra ? [{ value: EXTRA_HEADER, type: String, ...HEADER_STYLE }] : []),
]

/* A row is written as plain values keyed by column; `pidNumber` writes the
   personal ID as a NUMBER instead of text, which is exactly how Excel eats a
   leading zero in the wild. */
const toCells = (p, extra) => [
  ...COLUMNS.map((c) => {
    if (c.key === 'pid' && p.pidNumber != null) return { value: p.pidNumber, type: Number }
    const v = p[c.key]
    return { value: v === undefined || v === '' ? null : v, type: String }
  }),
  ...(extra ? [{ value: p.dept || null, type: String }] : []),
]

const EMP = 'თანამშრომელი'
const FAM = 'ოჯახის წევრი'
const GE = 'საქართველოს მოქალაქე'
const M = 'მამრობითი'
const F = 'მდედრობითი'

/* ---- demo 1: the mixed file (the one a walkthrough should open) ------------ */

const ERRORS_ROWS = [
  // — clean employees ————————————————————————————————————————————————
  { who: EMP, citizen: GE, pid: '01008012345', birth: '14/05/1988', firstName: 'ნინო', lastName: 'ბერიძე', gender: F,
    mobile: '+995 555 12 34 56', email: 'nino.beridze@company.ge', address: 'ქ. თბილისი, ვაჟა-ფშაველას 12', pkg: 'ოპტიმალი', dept: 'გაყიდვები' },
  { who: EMP, citizen: GE, pid: '01017023456', birth: '02/11/1991', firstName: 'ლევან', lastName: 'ჩიქოვანი', gender: M,
    mobile: '+995 599 44 55 66', email: 'levan.chikovani@company.ge', address: 'ქ. თბილისი, ჭავჭავაძის 45', pkg: 'პრემიუმი', dept: 'IT' },
  { who: EMP, citizen: GE, pid: '01029034567', birth: '27/07/1985', firstName: 'მარიამ', lastName: 'ხუციშვილი', gender: F,
    mobile: '+995 577 10 20 30', email: 'mariam.khutsishvili@company.ge', pkg: 'ბაზისი', dept: 'ფინანსები' },
  { who: EMP, citizen: GE, pid: '01003045678', birth: '19/02/1979', firstName: 'დავით', lastName: 'კვარაცხელია', gender: M,
    mobile: '+995 555 88 77 66', email: 'davit.kvaratskhelia@company.ge', pkg: 'ოპტიმალი', dept: 'ლოჯისტიკა' },

  // W_PID_PADDED — the ID was stored as a number, so Excel dropped the leading 0.
  { who: EMP, citizen: GE, pidNumber: 1008045678, birth: '08/12/1993', firstName: 'ქეთევან', lastName: 'სიხარულიძე', gender: F,
    mobile: '+995 591 30 40 50', email: 'ketevan.sikharulidze@company.ge', pkg: 'ბაზისი', dept: 'HR' },

  // — family members that resolve inside the file —————————————————————
  { who: FAM, citizen: GE, pid: '01008098765', birth: '03/09/2016', firstName: 'გიორგი', lastName: 'ბერიძე', gender: M,
    linkPid: '01008012345', relation: 'შვილი', pkg: 'ბაზისი' },
  { who: FAM, citizen: GE, pid: '01017076543', birth: '21/04/1992', firstName: 'ნათია', lastName: 'ჩიქოვანი', gender: F,
    linkPid: '01017023456', relation: 'მეუღლე', pkg: 'ოპტიმალი' },

  // E_PKG_UNKNOWN — a package name that is not on the contract.
  { who: EMP, citizen: GE, pid: '01015056789', birth: '05/06/1990', firstName: 'სოფიო', lastName: 'წიკლაური', gender: F,
    mobile: '+995 558 12 12 12', email: 'sofio.tsiklauri@company.ge', pkg: 'ოქროს', dept: 'მარკეტინგი' },

  // E_REQ_LAST — surname cell left empty.
  { who: EMP, citizen: GE, pid: '01021067890', birth: '11/03/1987', firstName: 'თემურ', lastName: '', gender: M,
    mobile: '+995 555 99 11 22', pkg: 'ბაზისი', dept: 'წარმოება' },

  // E_BIRTH_INVALID — 31 February does not exist.
  { who: EMP, citizen: GE, pid: '01033078901', birth: '31/02/1992', firstName: 'ანა', lastName: 'მჭედლიშვილი', gender: F,
    email: 'ana.mchedlishvili@company.ge', pkg: 'ოპტიმალი', dept: 'ფინანსები' },

  // E_GENDER_UNKNOWN — free text instead of the two accepted words.
  { who: EMP, citizen: GE, pid: '01047089012', birth: '30/01/1983', firstName: 'ზურაბ', lastName: 'ლომიძე', gender: 'კაცი',
    mobile: '+995 593 45 45 45', pkg: 'ბაზისი', dept: 'უსაფრთხოება' },

  // E_DUP_IN_FILE — the same person pasted twice; row 2 keeps the number.
  { who: EMP, citizen: GE, pid: '01008012345', birth: '14/05/1988', firstName: 'ნინო', lastName: 'ბერიძე', gender: F,
    mobile: '+995 555 12 34 56', email: 'nino.beridze@company.ge', pkg: 'ოპტიმალი', dept: 'გაყიდვები' },

  // E_LINK_UNKNOWN — linked to an employee who is in neither the file nor the contract.
  { who: FAM, citizen: GE, pid: '01041090123', birth: '17/08/1994', firstName: 'ეკა', lastName: 'ჯანელიძე', gender: F,
    linkPid: '01055099999', relation: 'მეუღლე', pkg: 'ოპტიმალი' },

  // E_PID_FORMAT — seven digits.
  { who: EMP, citizen: GE, pid: '0102303', birth: '22/10/1990', firstName: 'ირაკლი', lastName: 'ფარცხალაძე', gender: M,
    mobile: '+995 574 60 60 60', pkg: 'ბაზისი', dept: 'IT' },

  // W_EMAIL + W_MOBILE — both are warnings: the person still imports.
  { who: EMP, citizen: GE, pid: '01062001234', birth: '09/09/1986', firstName: 'ვასილ', lastName: 'ნადირაძე', gender: M,
    mobile: '5551234', email: 'vasil.company.ge', pkg: 'პრემიუმი', dept: 'გაყიდვები' },

  // X_ALREADY_INSURED — this PID is already on the contract (existingEmployees e1).
  { who: EMP, citizen: GE, pid: '01024001122', birth: '12/12/1984', firstName: 'გიორგი', lastName: 'გვარიძე', gender: M,
    mobile: '+995 555 33 44 55', pkg: 'ბაზისი', dept: 'ადმინისტრაცია' },

  null, // a blank separator row — exercises the "skipped empty rows" notice

  { who: EMP, citizen: GE, pid: '01072012345', birth: '25/05/1996', firstName: 'თინათინ', lastName: 'აბაშიძე', gender: F,
    mobile: '+995 596 70 70 70', email: 'tinatin.abashidze@company.ge', pkg: 'ოპტიმალი', dept: 'მარკეტინგი' },
  { who: EMP, citizen: GE, pid: '01084023456', birth: '07/07/1989', firstName: 'ბექა', lastName: 'მეგრელიშვილი', gender: M,
    mobile: '+995 555 81 81 81', email: 'beka.megrelishvili@company.ge', pkg: 'ბაზისი', dept: 'ლოჯისტიკა' },
  { who: EMP, citizen: GE, pid: '01096034567', birth: '16/01/1998', firstName: 'ლიკა', lastName: 'ღოღობერიძე', gender: F,
    mobile: '+995 592 22 33 44', email: 'lika.ghoghoberidze@company.ge', pkg: 'ოპტიმალი', dept: 'HR' },
  { who: FAM, citizen: GE, pid: '01003087654', birth: '30/11/2012', firstName: 'ნიკოლოზ', lastName: 'კვარაცხელია', gender: M,
    linkPid: '01003045678', relation: 'შვილი', pkg: 'ბაზისი' },
]

/* ---- demo 2: the clean file (the happy path) ------------------------------- */

const CLEAN_ROWS = [
  { who: EMP, citizen: GE, pid: '01008012345', birth: '14/05/1988', firstName: 'ნინო', lastName: 'ბერიძე', gender: F,
    mobile: '+995 555 12 34 56', email: 'nino.beridze@company.ge', address: 'ქ. თბილისი, ვაჟა-ფშაველას 12', pkg: 'ოპტიმალი' },
  { who: EMP, citizen: GE, pid: '01017023456', birth: '02/11/1991', firstName: 'ლევან', lastName: 'ჩიქოვანი', gender: M,
    mobile: '+995 599 44 55 66', email: 'levan.chikovani@company.ge', address: 'ქ. თბილისი, ჭავჭავაძის 45', pkg: 'პრემიუმი' },
  { who: EMP, citizen: GE, pid: '01029034567', birth: '27/07/1985', firstName: 'მარიამ', lastName: 'ხუციშვილი', gender: F,
    mobile: '+995 577 10 20 30', email: 'mariam.khutsishvili@company.ge', pkg: 'ბაზისი' },
  { who: EMP, citizen: GE, pid: '01003045678', birth: '19/02/1979', firstName: 'დავით', lastName: 'კვარაცხელია', gender: M,
    mobile: '+995 555 88 77 66', email: 'davit.kvaratskhelia@company.ge', pkg: 'ოპტიმალი' },
  { who: EMP, citizen: GE, pid: '01072012345', birth: '25/05/1996', firstName: 'თინათინ', lastName: 'აბაშიძე', gender: F,
    mobile: '+995 596 70 70 70', email: 'tinatin.abashidze@company.ge', pkg: 'ოპტიმალი' },
  { who: EMP, citizen: GE, pid: '01084023456', birth: '07/07/1989', firstName: 'ბექა', lastName: 'მეგრელიშვილი', gender: M,
    mobile: '+995 555 81 81 81', email: 'beka.megrelishvili@company.ge', pkg: 'ბაზისი' },
  { who: EMP, citizen: GE, pid: '01096034567', birth: '16/01/1998', firstName: 'ლიკა', lastName: 'ღოღობერიძე', gender: F,
    mobile: '+995 592 22 33 44', email: 'lika.ghoghoberidze@company.ge', pkg: 'ოპტიმალი' },
  { who: EMP, citizen: GE, pid: '01062001234', birth: '09/09/1986', firstName: 'ვასილ', lastName: 'ნადირაძე', gender: M,
    mobile: '+995 555 60 70 80', email: 'vasil.nadiradze@company.ge', pkg: 'პრემიუმი' },
  { who: FAM, citizen: GE, pid: '01008098765', birth: '03/09/2016', firstName: 'გიორგი', lastName: 'ბერიძე', gender: M,
    linkPid: '01008012345', relation: 'შვილი', pkg: 'ბაზისი' },
  { who: FAM, citizen: GE, pid: '01017076543', birth: '21/04/1992', firstName: 'ნათია', lastName: 'ჩიქოვანი', gender: F,
    linkPid: '01017023456', relation: 'მეუღლე', pkg: 'ოპტიმალი' },
]

/* ---- emit ------------------------------------------------------------------ */

const columnWidths = (extra) => [
  ...COLUMNS.map((c) => ({ width: Math.min(34, Math.max(14, c.header.length + 4)) })),
  ...(extra ? [{ width: 18 }] : []),
]

const FILES = [
  { key: 'errors', filename: 'gpi-insured-demo-errors.xlsx', rows: ERRORS_ROWS, extra: true },
  { key: 'clean', filename: 'gpi-insured-demo-clean.xlsx', rows: CLEAN_ROWS, extra: false },
]

const out = {}

for (const spec of FILES) {
  const sheet = [headerRow(spec.extra), ...spec.rows.map((r) => (r ? toCells(r, spec.extra) : []))]
  const path = resolve(ROOT, 'public/downloads', spec.filename)
  await mkdir(dirname(path), { recursive: true })
  await writeXlsxFile([{ data: sheet, sheet: TEMPLATE_SHEET, columns: columnWidths(spec.extra) }]).toFile(path)
  const bytes = await readFile(path)
  out[spec.key] = { filename: spec.filename, b64: bytes.toString('base64'), rows: spec.rows.filter(Boolean).length }
  console.log(`wrote ${path} · ${bytes.length} bytes · ${out[spec.key].rows} people`)
}

const moduleSource = `/* GENERATED — do not edit by hand.
   Produced by scripts/build-demo-workbooks.mjs.

   Sample workbooks for demoing the Excel import without hunting for a file:
   StepExcel imports this module LAZILY when the hash carries ?demo=errors or
   ?demo=clean, so these bytes stay out of the main bundle. Same data:-URI
   reasoning as the template — the single-file share build does not copy
   public/. Human-reviewable copies live in public/downloads/. */

export const DEMO_FILES = {
${FILES.map(
  (s) => `  ${s.key}: {
    filename: '${out[s.key].filename}',
    people: ${out[s.key].rows},
    dataUri:
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${out[s.key].b64}',
  },`,
).join('\n')}
}
`

await writeFile(resolve(ROOT, 'src/b2b/data/excelDemo.js'), moduleSource, 'utf8')
console.log(`wrote src/b2b/data/excelDemo.js`)
