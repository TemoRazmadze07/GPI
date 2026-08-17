import Icon from '../lib/Icon.jsx'
import ActionMenu from '../components/ActionMenu.jsx'
import { kaB2B } from './strings.js'
import {
  attachmentExt,
  attachmentUrl,
  hasAttachmentFile,
  downloadAttachment,
} from './data/messages.js'

/* AttachmentCard — a SENT attachment inside a message bubble, following Slack's
   file-row grammar (2026-08-17, user: "we should be able to download and/or open
   the file"):

     [icon]  filename            (button → in-app preview)
             XLSX · 18 KB        [↓] [⋮]

   open and download stay SEPARATE actions, as Slack keeps them: the name opens a
   preview, ↓ downloads immediately, and ⋮ spells both out as labelled items for
   anyone who did not guess the icons. The ⋮ is the shared ActionMenu (Rule 1).

   Actions reveal on hover, and on focus-within so keyboard users get them too;
   where hover does not exist (touch) they are always visible — see
   .b2b-msg__att--card in b2b.css. The download is a real <a download> rather than
   a scripted click, so it needs no JS and lands in the browser's own download UI.

   An attachment with no bytes (today only the seeded .mp4 — encoding a video
   needs ffmpeg) offers NO download: the card stays openable and the preview
   explains why, rather than presenting a button that does nothing. */
export default function AttachmentCard({ a, onOpen }) {
  const t = kaB2B.msgs.att
  const ext = attachmentExt(a)
  const hasFile = hasAttachmentFile(a)
  const url = hasFile ? attachmentUrl(a) : null

  const items = [
    { id: 'open', label: t.open, onSelect: () => onOpen(a) },
    ...(hasFile ? [{ id: 'download', label: t.download, onSelect: () => downloadAttachment(a) }] : []),
  ]

  return (
    <span className="b2b-msg__att b2b-msg__att--sent b2b-msg__att--card">
      <Icon name={a.kind === 'video' ? 'video' : 'file-text'} size={16} />
      <button
        type="button"
        className="b2b-msg__attmain"
        onClick={() => onOpen(a)}
        aria-label={t.openLabel(a.name)}
      >
        <span className="b2b-msg__attname">{a.name}</span>
        <span className="b2b-msg__attmeta">
          {ext.toUpperCase()} · {a.size}
        </span>
      </button>
      <span className="b2b-msg__attacts">
        {url && (
          <a
            className="b2b-msg__attbtn"
            href={url}
            download={a.name}
            aria-label={t.downloadLabel(a.name)}
            title={t.download}
          >
            <Icon name="download" size={16} />
          </a>
        )}
        <ActionMenu items={items} label={t.actions(a.name)} />
      </span>
    </span>
  )
}
