import { useEffect, useState } from 'react'
import Modal from '../components/Modal.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import { Button } from '../components/Button.jsx'
import { kaB2B } from './strings.js'
import { attachmentUrl, attachmentBlob, previewKind, downloadAttachment } from './data/messages.js'

/* FilePreviewModal — opens a message attachment in-app (Slack's file-preview
   overlay), on the SHARED Modal frame so it inherits Esc / overlay-click / × and
   the one dialog shell (Rule 1). Footer always carries a real download, so a
   type we cannot render is still a dead end for nobody.

   Render matrix (see previewKind in data/messages.js):
     pdf         → <iframe> on the blob URL, which Chrome renders natively
     mp4/mov     → <video controls>
     xlsx/xls    → parsed with read-excel-file (already a runtime dep, lazily
                   imported exactly as the Excel importer does) into a table
     unsupported → Word etc.: honest message + download
     none        → no bytes exist (the seeded .mp4); download is not offered

   Promote out of b2b/ when a second consumer appears — the house rule is to
   promote at the SECOND consumer (see Checkbox.jsx). */

const SHEET_ROW_LIMIT = 20

function SheetPreview({ a, t }) {
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    let live = true
    const blob = attachmentBlob(a)
    if (!blob) return setState({ status: 'error' })
    /* Lazy import so the parser stays out of the initial bundle — same pattern
       the Excel importer uses. The browser build's default export returns ALL
       sheets as [{sheet, data}]. */
    import('read-excel-file/browser')
      .then((m) => m.default(blob))
      .then((res) => {
        if (!live) return
        const rows = Array.isArray(res) && res[0]?.data ? res[0].data : res
        setState({ status: 'ok', rows: rows || [] })
      })
      .catch(() => live && setState({ status: 'error' }))
    return () => {
      live = false
    }
  }, [a])

  if (state.status === 'loading') return <div className="b2b-fp__note">{t.loading}</div>
  if (state.status === 'error') return <InlineAlert tone="error">{t.sheetError}</InlineAlert>
  if (!state.rows.length) return <div className="b2b-fp__note">{t.sheetEmpty}</div>

  const [head, ...body] = state.rows
  const shown = body.slice(0, SHEET_ROW_LIMIT)
  return (
    <>
      <div className="b2b-fp__sheetwrap">
        <table className="b2b-fp__sheet">
          <thead>
            <tr>
              {head.map((c, i) => (
                <th key={i} scope="col">
                  {c == null ? '' : String(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((row, i) => (
              <tr key={i}>
                {head.map((_, j) => (
                  <td key={j}>{row[j] == null ? '' : String(row[j])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {body.length > shown.length && <div className="b2b-fp__note">{t.sheetRows(shown.length)}</div>}
    </>
  )
}

export default function FilePreviewModal({ a, onClose }) {
  const t = kaB2B.msgs.att
  const kind = previewKind(a)
  const url = attachmentUrl(a)

  return (
    <Modal
      title={a.name}
      onClose={onClose}
      className="b2b-fp"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t.close}
          </Button>
          {kind !== 'none' && (
            <Button variant="primary" leadingIcon="download" onClick={() => downloadAttachment(a)}>
              {t.download}
            </Button>
          )}
        </>
      }
    >
      {kind === 'pdf' && <iframe className="b2b-fp__frame" src={url} title={a.name} />}
      {kind === 'video' && <video className="b2b-fp__video" src={url} controls preload="metadata" />}
      {kind === 'sheet' && <SheetPreview a={a} t={t} />}
      {kind === 'unsupported' && (
        <InlineAlert tone="info" title={t.previewUnsupported}>
          {t.previewUnsupportedHint}
        </InlineAlert>
      )}
      {kind === 'none' && (
        <InlineAlert tone="warning" title={t.noFile}>
          {t.noFileHint}
        </InlineAlert>
      )}
    </Modal>
  )
}
