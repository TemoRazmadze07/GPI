/* Authoring script — run BY HAND, never in CI or at build time.

     node scripts/build-insured-template.mjs

   Emits the downloadable add-insured Excel template. Two outputs, both
   committed:
     public/downloads/gpi-insured-template-v1.xlsx   reviewable by GPI ops
     src/b2b/data/excelTemplate.js                   the same bytes as a data:
                                                     URI, which is what the app
                                                     actually serves

   Why a data: URI and not just the public/ file: the B2B single-file share
   build sets copyPublicDir:false, so anything in public/ is missing from that
   bundle and its download link would 404. One embedded copy works in dev, on
   Pages, and from file:// alike.

   The column list comes from data/insuredImport.js, so the template and the
   parser can never drift apart. `write-excel-file` is a devDependency and
   never enters the app bundle. */

import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import writeXlsxFile from 'write-excel-file/node'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

/* Imported through a loader-free path: insuredImport.js pulls in
   read-excel-file/browser, which node cannot load, so the column list is
   duplicated-by-import from a tiny shared module instead. See COLUMNS below. */
const { COLUMNS, TEMPLATE_SHEET } = await import('../src/b2b/data/importColumns.js')

const VERSION = 'v1'
const FILENAME = `gpi-insured-template-${VERSION}.xlsx`
const LEGEND_SHEET = 'მაგალითი'

const HEADER_STYLE = {
  fontWeight: 'bold',
  backgroundColor: '#eef0fb',
  align: 'left',
  wrap: true,
}

/* Sheet 1 — the sheet people actually fill in. Header row, then one worked
   example so the expected shape of every cell is visible. */
const headerRow = COLUMNS.map((c) => ({
  value: c.required ? `${c.header} *` : c.header,
  type: String,
  ...HEADER_STYLE,
}))

const exampleRow = COLUMNS.map((c) => ({
  value: c.example || null,
  /* Personal-ID and date columns are written as TEXT so Excel cannot eat the
     leading zero of 01001001234 or reformat the date into a serial number.
     This is the single highest-value thing the template does. */
  type: String,
}))

const familyExample = {
  who: 'ოჯახის წევრი',
  citizen: 'საქართველოს მოქალაქე',
  pid: '01001005678',
  birth: '12/06/2015',
  firstName: 'ლუკა',
  lastName: 'კაპანაძე',
  gender: 'მამრობითი',
  linkPid: '01001001234',
  relation: 'შვილი',
  mobile: '',
  email: '',
  address: '',
  pkg: 'ბაზისი',
}
const familyRow = COLUMNS.map((c) => ({ value: familyExample[c.key] || null, type: String }))

const dataSheet = [headerRow, exampleRow, familyRow]

/* Sheet 2 — the legend. Carries the version stamp in A1, which lets the parser
   reject an outdated template with a specific message instead of a wall of
   column errors. */
const L = (value, opts = {}) => ({ value, type: String, ...opts })
const bold = { fontWeight: 'bold' }

const legendSheet = [
  [L(`GPI შაბლონი ${VERSION}`, bold)],
  [],
  [L('სავალდებულო სვეტები აღნიშნულია ვარსკვლავით (*).')],
  [L('პირველი სტრიქონი სვეტების სათაურებია — არ წაშალოთ და არ გადაარქვათ.')],
  [L('ორი შევსებული სტრიქონი მაგალითია — წაშალეთ და თქვენი მონაცემები ჩაწერეთ.')],
  [],
  [L('დასაშვები მნიშვნელობები', bold)],
  [L('ტიპი'), L('თანამშრომელი / ოჯახის წევრი')],
  [L('მოქალაქეობა'), L('საქართველოს მოქალაქე / არარეზიდენტი')],
  [L('სქესი'), L('მამრობითი / მდედრობითი')],
  [L('კავშირი'), L('მეუღლე / შვილი / მშობელი / სხვა')],
  [L('სადაზღვევო პაკეტი'), L('ბაზისი / ოპტიმალი / პრემიუმი')],
  [],
  [L('ფორმატები', bold)],
  [L('დაბადების თარიღი'), L('დდ/თთ/წწწწ — მაგ. 05/03/1990')],
  [L('პირადი ნომერი'), L('11 ციფრი. უჯრა ტექსტის ფორმატში დატოვეთ, რომ პირველი ნული არ დაიკარგოს.')],
  [L('მობილური'), L('+995 5XX XXX XXX')],
  [],
  [L('ოჯახის წევრი', bold)],
  [L('თანამშრომლის პირადი ნომერი'), L('მიუთითეთ იმ თანამშრომლის პირადი ნომერი, ვისთანაც არის დაკავშირებული.')],
  [L(''), L('თანამშრომელი შეიძლება იმავე ფაილში იყოს ან უკვე დაზღვეული.')],
  [],
  [L('ლიმიტები', bold)],
  [L('ფაილის ზომა'), L('მაქსიმუმ 5 MB')],
  [L('სტრიქონები'), L('მაქსიმუმ 500')],
]

const columnWidths = COLUMNS.map((c) => ({ width: Math.min(34, Math.max(14, c.header.length + 4)) }))

const outXlsx = resolve(ROOT, 'public/downloads', FILENAME)
await mkdir(dirname(outXlsx), { recursive: true })

await writeXlsxFile(
  [
    { data: dataSheet, sheet: TEMPLATE_SHEET, columns: columnWidths, headerStyle: HEADER_STYLE },
    { data: legendSheet, sheet: LEGEND_SHEET, columns: [{ width: 32 }, { width: 62 }] },
  ],
).toFile(outXlsx)

const bytes = await readFile(outXlsx)
const b64 = bytes.toString('base64')

const moduleSource = `/* GENERATED — do not edit by hand.
   Produced by scripts/build-insured-template.mjs; re-run that script after
   changing COLUMNS in data/importColumns.js.

   The template ships as a data: URI rather than a public/ file because the B2B
   single-file share build sets copyPublicDir:false — a public/ path would 404
   there. The same .xlsx is also committed to public/downloads/${FILENAME}
   as the human-reviewable source of truth. */

export const TEMPLATE_VERSION = '${VERSION}'
export const TEMPLATE_FILENAME = '${FILENAME}'
export const TEMPLATE_DATA_URI =
  'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${b64}'
`

await writeFile(resolve(ROOT, 'src/b2b/data/excelTemplate.js'), moduleSource, 'utf8')

console.log(`wrote ${outXlsx}`)
console.log(`  ${bytes.length} bytes · ${COLUMNS.length} columns · sheets: ${TEMPLATE_SHEET}, ${LEGEND_SHEET}`)
console.log(`wrote src/b2b/data/excelTemplate.js (${b64.length} base64 chars)`)
