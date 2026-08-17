/* Generates REAL, tiny stand-in files for the seeded messaging attachments and
   writes them into src/b2b/data/demoAttachments.js as base64.

   Hand-run:  node scripts/build-demo-attachments.mjs
   Re-run after changing the seeded attachment names in b2b/data/messages.js.

   Why base64 in a module rather than files in public/: the B2B single-file share
   build sets copyPublicDir:false, so a public/ path 404s there. Same reasoning as
   data/excelTemplate.js and data/excelDemo.js — see those files.

   Why generate at all: the seeded attachments used to be metadata only, so the
   download/open actions had nothing to hand over. These are deliberately TINY
   (a few KB) while the chips keep their authored, realistic size labels — the
   label is demo metadata, the bytes are a real openable file.

   NOT generated here: .mp4. Encoding a valid video needs ffmpeg (absent) and a
   video bitstream cannot be hand-authored. Drop a real short clip in as
   src/b2b/data/demoVideo.<ext> + wire it below if a playable demo video is wanted.

   Output is byte-stable: fixed ZIP timestamps, no Date.now(), so re-running
   produces an identical file and a clean diff. */
import { writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import writeXlsxFile from 'write-excel-file/node'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '../src/b2b/data/demoAttachments.js')

/* ---------- minimal PDF (no deps) ----------
   Helvetica is one of the base-14 fonts, which carry NO Georgian glyphs, so the
   page text is ASCII only. Offsets are computed from the assembled bytes, so the
   xref table is always correct. */
function pdf(lines) {
  const esc = (s) => s.replace(/([\\()])/g, '\\$1')
  const content =
    'BT /F1 18 Tf 60 780 Td (' +
    esc(lines[0]) +
    ') Tj ET\n' +
    lines
      .slice(1)
      .map((l, i) => `BT /F1 11 Tf 60 ${744 - i * 20} Td (${esc(l)}) Tj ET`)
      .join('\n')
  const objs = [
    '<</Type/Catalog/Pages 2 0 R>>',
    '<</Type/Pages/Kids[3 0 R]/Count 1>>',
    '<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>',
    '<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>',
    `<</Length ${Buffer.byteLength(content)}>>\nstream\n${content}\nendstream`,
  ]
  let out = '%PDF-1.4\n'
  const offsets = []
  objs.forEach((body, i) => {
    offsets.push(Buffer.byteLength(out))
    out += `${i + 1} 0 obj\n${body}\nendobj\n`
  })
  const startxref = Buffer.byteLength(out)
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`
  for (const o of offsets) out += `${String(o).padStart(10, '0')} 00000 n \n`
  out += `trailer\n<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${startxref}\n%%EOF\n`
  return Buffer.from(out, 'latin1')
}

/* ---------- minimal ZIP writer, STORED (no deps) ----------
   A .docx is a ZIP of XML parts. Stored (method 0) entries need only a CRC32, so
   no deflate is involved and the output stays reproducible. */
const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()
const crc32 = (buf) => {
  let c = 0 ^ -1
  for (const b of buf) c = (c >>> 8) ^ CRC_TABLE[(c ^ b) & 0xff]
  return (c ^ -1) >>> 0
}

function zip(entries) {
  const DOS_TIME = 0 // fixed → byte-stable output
  const DOS_DATE = 0x2821 // 2020-01-01
  const locals = []
  const centrals = []
  let offset = 0
  for (const [name, text] of entries) {
    const nameBuf = Buffer.from(name, 'utf8')
    const data = Buffer.from(text, 'utf8')
    const crc = crc32(data)
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(0, 6)
    local.writeUInt16LE(0, 8) // stored
    local.writeUInt16LE(DOS_TIME, 10)
    local.writeUInt16LE(DOS_DATE, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(nameBuf.length, 26)
    local.writeUInt16LE(0, 28)
    locals.push(local, nameBuf, data)

    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(20, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(0, 8)
    central.writeUInt16LE(0, 10)
    central.writeUInt16LE(DOS_TIME, 12)
    central.writeUInt16LE(DOS_DATE, 14)
    central.writeUInt32LE(crc, 16)
    central.writeUInt32LE(data.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(nameBuf.length, 28)
    central.writeUInt32LE(offset, 42)
    centrals.push(central, nameBuf)
    offset += local.length + nameBuf.length + data.length
  }
  const centralBuf = Buffer.concat(centrals)
  const eocd = Buffer.alloc(22)
  eocd.writeUInt32LE(0x06054b50, 0)
  eocd.writeUInt16LE(entries.length, 8)
  eocd.writeUInt16LE(entries.length, 10)
  eocd.writeUInt32LE(centralBuf.length, 12)
  eocd.writeUInt32LE(offset, 16)
  return Buffer.concat([Buffer.concat(locals), centralBuf, eocd])
}

const xmlEsc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function docx(paragraphs) {
  const body = paragraphs
    .map(
      (p, i) =>
        `<w:p><w:pPr>${i === 0 ? '<w:pStyle w:val="Title"/>' : ''}</w:pPr>` +
        `<w:r><w:t xml:space="preserve">${xmlEsc(p)}</w:t></w:r></w:p>`
    )
    .join('')
  return zip([
    [
      '[Content_Types].xml',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        '</Types>',
    ],
    [
      '_rels/.rels',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        '</Relationships>',
    ],
    [
      'word/document.xml',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
        `<w:body>${body}</w:body></w:document>`,
    ],
  ])
}

/* ---------- the five seeded attachments ---------- */
const MIME = {
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

/* write-excel-file/node returns a writer, not bytes — go via a temp file and read
   it back, the same way scripts/build-insured-template.mjs does. */
const tmpXlsx = join(tmpdir(), 'gpi-demo-attachment.xlsx')
await writeXlsxFile(
  [
    [
      { value: 'სახელი, გვარი', fontWeight: 'bold' },
      { value: 'პირადი №', fontWeight: 'bold' },
      { value: 'პაკეტი', fontWeight: 'bold' },
      { value: 'შენიშვნა', fontWeight: 'bold' },
    ],
    [{ value: 'ნათია ბერიძე' }, { value: '01019087654' }, { value: 'ვერცხლი' }, { value: 'შესწორებული პაკეტი' }],
    [{ value: 'ლევან ჩხეიძე' }, { value: '01024512398' }, { value: 'ოქრო' }, { value: 'შესწორებული პირადი №' }],
  ],
).toFile(tmpXlsx)
const xlsxBuf = readFileSync(tmpXlsx)
rmSync(tmpXlsx, { force: true })

const FILES = {
  'დაზღვეულები-შესწორება.xlsx': { mime: MIME.xlsx, buf: xlsxBuf },
  'INV-2026-071-განახლებული.pdf': {
    mime: MIME.pdf,
    buf: pdf([
      'GPI CORPO',
      'Invoice INV-2026-071 (updated)',
      'Demo attachment generated for the B2B prototype.',
      'Payment term moved to 25 August 2026.',
      'Note: this page is ASCII-only because the base-14 PDF fonts',
      'carry no Georgian glyphs.',
    ]),
  },
  'როლების-მართვა.pdf': {
    mime: MIME.pdf,
    buf: pdf([
      'GPI CORPO',
      'Roles and permissions - overview',
      'Demo attachment generated for the B2B prototype.',
      'Admin / HR / Viewer role matrix placeholder.',
    ]),
  },
  'განახლების-ვარიანტები.docx': {
    mime: MIME.docx,
    buf: docx([
      'განახლების ვარიანტები',
      'დემო დანართი B2B პროტოტიპისთვის.',
      'ვარიანტი 1 — მოქმედი პირობების გაგრძელება 12 თვით.',
      'ვარიანტი 2 — გაფართოებული სტომატოლოგიური ლიმიტი.',
      'ვარიანტი 3 — ოჯახის წევრების დამატება ფასდაკლებით.',
    ]),
  },
}

const body = Object.entries(FILES)
  .map(
    ([name, { mime, buf }]) =>
      `  ${JSON.stringify(name)}: {\n    mime: ${JSON.stringify(mime)},\n` +
      `    bytes: ${buf.length},\n    base64:\n      '${buf.toString('base64')}',\n  },`
  )
  .join('\n')

writeFileSync(
  OUT,
  `/* GENERATED — do not edit by hand.
   Produced by scripts/build-demo-attachments.mjs; re-run that script after
   changing the seeded attachment names in b2b/data/messages.js.

   Real, tiny stand-in files for the seeded messaging attachments, so the
   open/download actions on an attachment chip hand over a file that genuinely
   opens. Base64 rather than public/ because the B2B share build sets
   copyPublicDir:false (same reasoning as excelTemplate.js).

   The chips keep their authored size labels (e.g. "18 KB") — that is demo
   metadata; \`bytes\` below is the real length of the stand-in.

   .mp4 is absent on purpose: encoding a video needs ffmpeg and a bitstream
   cannot be hand-authored. Attachments with no entry here are treated as
   "no file available" by the UI rather than offering a dead download. */

export const DEMO_ATTACHMENTS = {
${body}
}
`
)

console.log('wrote', OUT)
for (const [name, { buf }] of Object.entries(FILES)) console.log(' ', name, buf.length, 'bytes')
