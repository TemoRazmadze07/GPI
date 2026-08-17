import { useSyncExternalStore } from 'react'
import { NOTIF_CATEGORIES, CATEGORY_ICON } from './notifications.js'
import { DEMO_ATTACHMENTS } from './demoAttachments.js'

/* B2B messaging (მიმოწერა) — data + a tiny session store (concept locked in
   chat, 2026-08-15). A conversation is an org↔GPI thread: any org user may
   write, but bubbles carry only TWO identities (org mark / GPI mark) with the
   author as small meta text — per-person avatars are deliberately absent.

   Read state is PER-USER (locked decision): this store models the CURRENT
   user's session only; a colleague's portal would hold their own read set.
   Category taxonomy = the notification taxonomy, on purpose (one vocabulary,
   GPI routes each category to the right department).

   The store is module-level (not React state) because THREE surfaces share
   it live: the topbar popover, the nav badge and the full page. Session-only
   by design — prototype. */

export const MSG_CATEGORIES = NOTIF_CATEGORIES
export { CATEGORY_ICON }

/* Attachment policy — ONE definition for compose + reply (PDF/Word/Excel +
   screen recordings as files; in-app recording is out of scope). */
export const ATTACH_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.mp4,.mov'
export const ATTACH_MAX_BYTES = 25 * 1024 * 1024
export const fmtSize = (b) =>
  b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`
/* `file` keeps the real File so a sent attachment can actually be opened and
   downloaded (2026-08-17). Session-only, like the rest of this store. */
export const fileToAttachment = (f) => ({
  name: f.name,
  size: fmtSize(f.size),
  kind: /\.(mp4|mov)$/i.test(f.name) ? 'video' : 'file',
  file: f,
})

/* ---------- attachment open / download ----------
   Two sources of real bytes: a File the user attached this session, or a
   generated stand-in for a SEEDED attachment (scripts/build-demo-attachments.mjs).
   Anything else — today only the seeded .mp4, which needs a real encoder — has no
   bytes, and the UI must say so rather than offer a dead action. */
export const attachmentExt = (a) => (a.name.split('.').pop() || '').toLowerCase()

const EXT_MIME = {
  pdf: 'application/pdf',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
}
export const attachmentMime = (a) =>
  a.file?.type || DEMO_ATTACHMENTS[a.name]?.mime || EXT_MIME[attachmentExt(a)] || 'application/octet-stream'

/* Object URLs are created once per attachment and cached for the session. They
   are deliberately NOT revoked: the same file can be reopened any number of
   times, and a revoked URL would break every later open. */
const urlCache = new WeakMap()

export const attachmentBlob = (a) => {
  if (a.file) return a.file
  const demo = DEMO_ATTACHMENTS[a.name]
  if (!demo) return null
  const bin = atob(demo.base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new Blob([bytes], { type: demo.mime })
}

export const attachmentUrl = (a) => {
  if (urlCache.has(a)) return urlCache.get(a)
  const blob = attachmentBlob(a)
  const url = blob ? URL.createObjectURL(blob) : null
  urlCache.set(a, url)
  return url
}

export const hasAttachmentFile = (a) => Boolean(a.file || DEMO_ATTACHMENTS[a.name])

/* What the in-app preview can actually render. Office documents can't be shown
   without a converter, EXCEPT spreadsheets — read-excel-file is already a runtime
   dependency (the Excel importer uses it), so those get a real table preview. */
export const previewKind = (a) => {
  if (!hasAttachmentFile(a)) return 'none'
  const ext = attachmentExt(a)
  /* Inline PDF needs a built-in viewer. Chrome/Safari/Firefox have one; some
     mobile in-app browsers do not, and there an <iframe> renders a blank void.
     `undefined` means the browser predates the flag — assume it can. */
  if (ext === 'pdf') {
    const noViewer = typeof navigator !== 'undefined' && navigator.pdfViewerEnabled === false
    return noViewer ? 'unsupported' : 'pdf'
  }
  if (ext === 'mp4' || ext === 'mov') return 'video'
  if (ext === 'xlsx' || ext === 'xls') return 'sheet'
  return 'unsupported'
}

export const downloadAttachment = (a) => {
  const url = attachmentUrl(a)
  if (!url) return false
  const el = document.createElement('a')
  el.href = url
  el.download = a.name
  document.body.appendChild(el)
  el.click()
  el.remove()
  return true
}

/* Attachment `kind` drives the chip icon only: video → 'video', else file. */
const seed = [
  {
    id: 'c1',
    category: 'requests',
    subject: 'დაზღვეულთა სიის შესწორება — მოთხოვნა №43488',
    unread: true,
    messages: [
      {
        id: 'c1m1',
        from: 'org',
        author: 'გიორგი გვარიძე',
        time: 'გუშინ, 15:40',
        text: 'გამარჯობა, მოთხოვნა №43488-ში ორი სტრიქონი შესასწორებელია. გიგზავნით განახლებულ სიას — გადაამოწმეთ, გთხოვთ.',
        attachments: [{ name: 'დაზღვეულები-შესწორება.xlsx', size: '18 KB', kind: 'file' }],
      },
      {
        id: 'c1m2',
        from: 'gpi',
        author: 'თამარ კვირიკაშვილი',
        time: 'დღეს, 09:15',
        text: 'გამარჯობა! სია მივიღეთ, ორივე შესწორება გატარდა. განახლებული პოლისები ხვალიდან იქნება აქტიური.',
        attachments: [],
      },
    ],
  },
  {
    id: 'c2',
    category: 'finances',
    subject: 'ინვოისი INV-2026-071 — გადახდის ვადის გადაწევა',
    unread: true,
    messages: [
      {
        id: 'c2m1',
        from: 'org',
        author: 'ნინო მაღრაძე',
        time: 'გუშინ, 11:05',
        text: 'გთხოვთ განიხილოთ INV-2026-071-ის გადახდის ვადის 10 დღით გადაწევა — ბიუჯეტის დამტკიცება გვიგვიანდება.',
        attachments: [],
      },
      {
        id: 'c2m2',
        from: 'gpi',
        author: 'თამარ კვირიკაშვილი',
        time: 'დღეს, 08:30',
        text: 'ვადა გადაწეულია 25 აგვისტომდე. თან გიგზავნით განახლებულ ინვოისს.',
        attachments: [{ name: 'INV-2026-071-განახლებული.pdf', size: '240 KB', kind: 'file' }],
      },
    ],
  },
  {
    id: 'c3',
    category: 'claims',
    subject: 'ზარალი CLM-2418 — დამატებითი მასალა',
    unread: false,
    messages: [
      {
        id: 'c3m1',
        from: 'gpi',
        author: 'ლევან წიკლაური',
        time: '12 აგვ, 14:02',
        text: 'CLM-2418-ის განსახილველად გვჭირდება შემთხვევის ადგილის ფოტო ან ვიდეო მასალა, ასეთის არსებობის შემთხვევაში.',
        attachments: [],
      },
      {
        id: 'c3m2',
        from: 'org',
        author: 'გიორგი გვარიძე',
        time: '13 აგვ, 10:20',
        text: 'გიგზავნით პარკინგის კამერის ჩანაწერს — ინციდენტი 00:42-ზეა.',
        attachments: [{ name: 'პარკინგი-ჩანაწერი.mp4', size: '14.8 MB', kind: 'video' }],
      },
    ],
  },
  {
    id: 'c4',
    category: 'contracts',
    subject: 'CNT-2025-0112 — განახლების პირობები',
    unread: false,
    messages: [
      {
        id: 'c4m1',
        from: 'org',
        author: 'გიორგი გვარიძე',
        time: '8 აგვ, 16:10',
        text: 'კონტრაქტი ოქტომბერში იწურება — შეგვიძლია წინასწარ ვნახოთ განახლების პირობები?',
        attachments: [],
      },
      {
        id: 'c4m2',
        from: 'gpi',
        author: 'თამარ კვირიკაშვილი',
        time: '9 აგვ, 12:45',
        text: 'რა თქმა უნდა. თან გიგზავნით სამ ვარიანტს შედარებით — განვიხილოთ ზარზეც, თუ მოგესწრებათ.',
        attachments: [{ name: 'განახლების-ვარიანტები.docx', size: '96 KB', kind: 'file' }],
      },
    ],
  },
  {
    id: 'c5',
    category: 'other',
    subject: 'თანამშრომლების პორტალზე დაშვება',
    unread: false,
    messages: [
      {
        id: 'c5m1',
        from: 'org',
        author: 'ნინო მაღრაძე',
        time: '1 აგვ, 10:00',
        text: 'როგორ მივცეთ ახალ HR თანამშრომელს პორტალზე დაშვება მხოლოდ ამონაწერის ნახვის უფლებით?',
        attachments: [],
      },
      {
        id: 'c5m2',
        from: 'gpi',
        author: 'თამარ კვირიკაშვილი',
        time: '1 აგვ, 13:25',
        text: 'როლების მართვა ადმინისტრირების განყოფილებაშია. ინსტრუქცია თან ერთვის.',
        attachments: [{ name: 'როლების-მართვა.pdf', size: '310 KB', kind: 'file' }],
      },
    ],
  },
]

/* ---- store ---------------------------------------------------------------- */

let conversations = seed
let readIds = new Set()
let hiddenCats = new Set()
let version = 0
let nextId = 6
const listeners = new Set()

function emit() {
  version += 1
  listeners.forEach((l) => l())
}
function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
const getVersion = () => version

/* Components call this once; any store mutation re-renders them. */
export function useMessages() {
  return useSyncExternalStore(subscribe, getVersion)
}

export const allConversations = () => conversations
/* Hidden categories are FILTERED OUT everywhere, counts included — otherwise
   the accountant carries a permanent unread dot they can't see the cause of. */
export const visibleConversations = () =>
  conversations.filter((c) => !hiddenCats.has(c.category))
export const isUnread = (c) => c.unread && !readIds.has(c.id)
export const unreadCount = () => visibleConversations().filter(isUnread).length
export const getHiddenCats = () => hiddenCats
export const lastMessage = (c) => c.messages[c.messages.length - 1]
/* NO conversation status. A waiting/answered badge was derived from the last
   sender and shown in the thread head until 2026-08-17, when the user removed it:
   it restated what the last bubble and the list row's „GPI · …" / „თქვენ · …" meta
   already carry. If a status filter is ever wanted, the derivation is one line —
   `lastMessage(c).from === 'org' ? 'waiting' : 'answered'` — but don't reintroduce
   the badge without asking. Thread lifecycle/close is still a stakeholder question. */

export function markRead(id) {
  if (readIds.has(id)) return
  readIds = new Set(readIds).add(id)
  emit()
}

export function toggleCategory(cat) {
  const next = new Set(hiddenCats)
  if (next.has(cat)) next.delete(cat)
  else next.add(cat)
  hiddenCats = next
  emit()
}

export function sendReply(convId, text, attachments = []) {
  conversations = conversations.map((c) =>
    c.id === convId
      ? {
          ...c,
          messages: [
            ...c.messages,
            {
              id: `${convId}m${c.messages.length + 1}`,
              from: 'org',
              author: 'გიორგი გვარიძე',
              time: 'ახლა',
              text,
              attachments,
            },
          ],
        }
      : c
  )
  emit()
}

export function createConversation({ category, subject, text, attachments = [] }) {
  const id = `c${nextId}`
  nextId += 1
  conversations = [
    {
      id,
      category,
      subject,
      unread: false, // the author has obviously read their own opener
      messages: [
        {
          id: `${id}m1`,
          from: 'org',
          author: 'გიორგი გვარიძე',
          time: 'ახლა',
          text,
          attachments,
        },
      ],
    },
    ...conversations,
  ]
  emit()
  return id
}
