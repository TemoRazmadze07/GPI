import { useState } from 'react'
import Drawer from '../components/Drawer.jsx'
import Field from '../components/Field.jsx'
import Select from '../components/Select.jsx'
import FileDropzone from '../components/FileDropzone.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import Icon from '../lib/Icon.jsx'
import { Button } from '../components/Button.jsx'
import { kaB2B } from './strings.js'
import {
  MSG_CATEGORIES,
  createConversation,
  ATTACH_ACCEPT,
  ATTACH_MAX_BYTES,
  fmtSize,
  fileToAttachment,
} from './data/messages.js'

/* ComposeMessageDrawer — start a new org→GPI conversation (shared Drawer, so
   the flow is identical from the topbar popover and the messages page).
   Category is REQUIRED — it is how GPI routes the thread to the right
   department; the taxonomy is the notification taxonomy (Rule 1, one
   vocabulary). Subject is required too: it is the only thing a list row can
   show, and what GPI's operators triage by.

   Attachments: the shared FileDropzone adds ONE file per pick; picked files
   collect in a chip list below (remove = ×), and the dropzone itself stays in
   its idle state so the next pick needs no reset. Validation follows the
   global form pattern: validate on send, per-field inline errors, errors
   clear LIVE the moment a field is edited. */

export default function ComposeMessageDrawer({ onClose, onSent }) {
  const t = kaB2B.msgs.compose_
  const cats = kaB2B.notif.categories
  const [category, setCategory] = useState(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [files, setFiles] = useState([])
  const [fileErr, setFileErr] = useState(null)
  const [errors, setErrors] = useState({})

  const dirty = category || subject.trim() || body.trim() || files.length > 0
  const requestClose = () => {
    if (dirty && !window.confirm(t.discard)) return
    onClose()
  }

  const clearErr = (k) => setErrors((e) => (e[k] ? { ...e, [k]: false } : e))

  const send = () => {
    const errs = {
      category: !category,
      subject: !subject.trim(),
      body: !body.trim(),
    }
    setErrors(errs)
    if (errs.category || errs.subject || errs.body) return
    const id = createConversation({
      category,
      subject: subject.trim(),
      text: body.trim(),
      attachments: files.map(fileToAttachment),
    })
    onSent(id)
  }

  return (
    <Drawer
      title={t.title}
      onClose={requestClose}
      className="b2b-msg__compose"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={requestClose}>
            {t.cancel}
          </Button>
          <Button variant="primary" size="md" leadingIcon="send" onClick={send}>
            {t.send}
          </Button>
        </>
      }
    >
      <InlineAlert tone="info" title={t.sideTitle}>
        {t.sideBody}
      </InlineAlert>

      {/* Same field grid as EditInsuredDrawer / ImportRowDrawer — one definition of
          form rhythm (Rule 1). This form was the only one missing it, so its fields
          had NO row gap. Every field here is `wide`, so it reads as one column. */}
      <div className="b2b-wiz__grid b2b-drawer__grid">
        <Field label={t.category} required errorMsg={errors.category ? t.required : null} wide>
          <Select
            value={category}
            placeholder={t.categoryPh}
            error={errors.category}
            options={MSG_CATEGORIES.map((c) => ({ value: c, label: cats[c] }))}
            onChange={(v) => {
              setCategory(v)
              clearErr('category')
            }}
            ariaLabel={t.category}
          />
        </Field>

        <Field label={t.subject} required errorMsg={errors.subject ? t.required : null} wide>
          <input
            className={`gpi-input ${errors.subject ? 'is-error' : ''}`}
            value={subject}
            placeholder={t.subjectPh}
            maxLength={120}
            onChange={(e) => {
              setSubject(e.target.value)
              clearErr('subject')
            }}
          />
        </Field>

        <Field label={t.body} required errorMsg={errors.body ? t.required : null} wide>
          <textarea
            className={`gpi-input b2b-msg__textarea ${errors.body ? 'is-error' : ''}`}
            value={body}
            placeholder={t.bodyPh}
            rows={6}
            onChange={(e) => {
              setBody(e.target.value)
              clearErr('body')
            }}
          />
        </Field>

        <Field label={kaB2B.msgs.attach} wide>
          <FileDropzone
            onFile={(f) => {
              setFileErr(null)
              setFiles((fs) => [...fs, f])
            }}
            accept={ATTACH_ACCEPT}
            maxSizeBytes={ATTACH_MAX_BYTES}
            onReject={(why) => setFileErr(why === 'size' ? t.attachSizeErr : t.attachTypeErr)}
            error={fileErr}
            title={t.attachTitle}
            browseLabel={t.attachBrowse}
            hint={t.attachHint}
          />
          {files.length > 0 && (
            <ul className="b2b-msg__attlist">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`} className="b2b-msg__att">
                  <Icon name={/\.(mp4|mov)$/i.test(f.name) ? 'video' : 'file-text'} size={16} />
                  <span className="b2b-msg__attname">{f.name}</span>
                  <span className="b2b-msg__attsize">{fmtSize(f.size)}</span>
                  <button
                    type="button"
                    className="b2b-msg__attx"
                    aria-label={kaB2B.msgs.removeAttachment(f.name)}
                    onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))}
                  >
                    <Icon name="x" size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Field>
      </div>
    </Drawer>
  )
}
