import { useState } from 'react'
import Drawer from '../components/Drawer.jsx'
import Checkbox from '../components/Checkbox.jsx'
import Select from '../components/Select.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Toast from '../components/Toast.jsx'
import { Button } from '../components/Button.jsx'
import Icon from '../lib/Icon.jsx'
import copyText from '../lib/copyText.js'
import { kaB2B } from './strings.js'
import { RECIPIENTS } from './data/guide.js'

/* SendMaterialDrawerB — VERSION B of the send flow (user feedback 2026-08-17,
   forked so v A's drawer stays untouched; merge when B wins):
   1. recipients SIMPLIFIED — the 3-radio group + conditional contract Select
      collapsed into ONE audience Select (scales past 3 groups; individual
      picking stays a deferred capability / stakeholder question);
   2. channels = CHECKBOXES — email and SMS can go out together (≥1 required,
      validated on submit per the global validation pattern);
   3. the SMS text is EDITABLE — prefilled with the standard template, the
      admin adjusts it when needed; email keeps the fixed template for now;
   4. the guide link inside the message is COPYABLE — for items with an
      external page (#/guide/<id>) the real link shows with a copy button, so
      HR can paste it into their own channels (intranet, chat) too.
   Library materials (video/FAQ/PDF) have no external page yet — they keep the
   static short-link preview. */

const TYPE_ICON = { kit: 'graduation-cap', video: 'play', faq: 'message-circle', handbook: 'file-text', bundle: 'graduation-cap', blog: 'file-text' }

export default function SendMaterialDrawerB({ material, history, onSent, onClose }) {
  const t = kaB2B
  const s = t.guide.send
  const s2 = t.guide.b.send2
  const [audience, setAudience] = useState('all')
  const [channels, setChannels] = useState({ email: true, sms: false })
  const [chError, setChError] = useState(false)
  const [smsText, setSmsText] = useState(s.previewBody(t.topbar.client, material.title))
  const [confirming, setConfirming] = useState(false)
  const [sent, setSent] = useState(false)
  /* Copy success = a Toast; the link controls themselves never change (user
     rule 2026-08-17). Fresh object per fire so a re-copy restarts the timer. */
  const [toast, setToast] = useState(null)

  const contract = RECIPIENTS.contracts.find((c) => c.id === audience)
  const count = audience === 'all' ? RECIPIENTS.all : audience === 'recent' ? RECIPIENTS.recent : contract.insured
  const toLabel = audience === 'all' ? 'ყველა დაზღვეული' : audience === 'recent' ? 'ბოლოს დამატებულები' : contract.id

  const audienceOptions = [
    { value: 'all', label: s.groupAll(RECIPIENTS.all) },
    { value: 'recent', label: s.groupRecent(RECIPIENTS.recent) },
    ...RECIPIENTS.contracts.map((c) => ({ value: c.id, label: `${c.label} · ${s.contractMeta(c.insured)}` })),
  ]

  /* Real, shareable deep link for published items; static stub otherwise. */
  const link = material.id
    ? `${window.location.origin}${window.location.pathname}#/guide/${material.id}`
    : null

  const copyLink = async () => {
    const ok = await copyText(link || s.previewLink)
    setToast(ok ? { text: s2.linkCopied } : { text: s2.copyFailed, tone: 'warning' })
  }

  const toggleChannel = (ch) => (on) => {
    setChannels((c) => ({ ...c, [ch]: on }))
    setChError(false)
  }
  const picked = Object.keys(channels).filter((ch) => channels[ch])
  const channelKey = picked.length === 2 ? 'both' : picked[0]

  /* Group-level re-send guard: same material to the same audience. */
  const prior = history.find((h) => h.material === material.title && h.to === toLabel)

  const trySubmit = () => {
    if (picked.length === 0) {
      setChError(true)
      return
    }
    setConfirming(true)
  }

  const doSend = () => {
    setConfirming(false)
    setSent(true)
    onSent({
      id: `s-${Date.now()}`,
      date: t.guide.history.today,
      material: material.title,
      type: material.type,
      to: toLabel,
      count,
      channel: channelKey,
    })
  }

  if (sent) {
    return (
      <Drawer
        title={s.title}
        onClose={onClose}
        footer={
          <Button variant="secondary" size="md" onClick={onClose}>
            {s.close}
          </Button>
        }
      >
        <div className="b2b-gsend__done">
          <span className="b2b-gsend__done-ic">
            <Icon name="check" size={28} />
          </span>
          <h4 className="b2b-gsend__done-title">{s.successTitle}</h4>
          <p className="b2b-gsend__done-body">{s.successBody(count)}</p>
        </div>
      </Drawer>
    )
  }

  return (
    <>
      <Drawer
        title={s.title}
        onClose={onClose}
        footer={
          <>
            <Button variant="secondary" size="md" onClick={onClose}>
              {s.cancel}
            </Button>
            <Button variant="primary" size="md" onClick={trySubmit}>
              {s.submit(count)}
            </Button>
          </>
        }
      >
        <div className="b2b-gsend">
          <section>
            <h4 className="b2b-gsend__h">{s.what}</h4>
            <div className="b2b-gsend__mat">
              <span className="b2b-gsend__mat-ic">
                <Icon name={TYPE_ICON[material.type]} size={20} />
              </span>
              <span className="b2b-gsend__mat-meta">
                <span className="b2b-gsend__mat-title">{material.title}</span>
                <span className="b2b-gsend__mat-type">{t.guide.library.types[material.type]}</span>
              </span>
            </div>
            {link && (
              <div className="b2b-gsend__linkrow">
                <span className="b2b-gsend__linkurl">{link}</span>
                <Button variant="tertiary" size="sm" leadingIcon="copy" onClick={copyLink}>
                  {s2.copyLink}
                </Button>
              </div>
            )}
          </section>

          <section>
            <h4 className="b2b-gsend__h">{s.to}</h4>
            <Select value={audience} onChange={setAudience} ariaLabel={s2.audience} options={audienceOptions} />
            {prior && (
              <p className="b2b-gsend__warn">
                <Icon name="alert-triangle" size={16} />
                {s.alreadySent(prior.date)}
              </p>
            )}
          </section>

          <section>
            <h4 className="b2b-gsend__h">{s2.channels}</h4>
            <div className="b2b-gsend__opts" role="group" aria-label={s.channelLabel}>
              <Checkbox name="gsend-ch-email" checked={channels.email} onChange={toggleChannel('email')} label={s.channels.email} />
              <Checkbox name="gsend-ch-sms" checked={channels.sms} onChange={toggleChannel('sms')} label={s.channels.sms} />
            </div>
            {chError && (
              <p className="b2b-gsend__warn b2b-gsend__warn--err" role="alert">
                <Icon name="alert-triangle" size={16} />
                {s2.atLeastOne}
              </p>
            )}
          </section>

          {channels.email && (
            <section>
              <h4 className="b2b-gsend__h">{s.preview}</h4>
              <div className="b2b-gsend__preview">
                <div className="b2b-gsend__pv-from">
                  <Icon name="mail" size={16} />
                  {s.previewFromEmail}
                </div>
                <div className="b2b-gsend__pv-subject">{s.previewSubject}</div>
                <p className="b2b-gsend__pv-body">{s.previewBody(t.topbar.client, material.title)}</p>
                {/* The preview's link chip copies too (user, 2026-08-17). */}
                <button
                  type="button"
                  className="b2b-gsend__pv-link b2b-gsend__pv-link--btn"
                  title={s2.copyLink}
                  onClick={copyLink}
                >
                  <Icon name="copy" size={14} />
                  {link || s.previewLink}
                </button>
              </div>
            </section>
          )}

          {channels.sms && (
            <section>
              <h4 className="b2b-gsend__h">{s2.smsLabel}</h4>
              <p className="b2b-gsend__smshint">{s2.smsHint}</p>
              <textarea
                className="gpi-input b2b-gsend__smsedit"
                value={smsText}
                rows={4}
                aria-label={s2.smsLabel}
                onChange={(e) => setSmsText(e.target.value)}
              />
              <div className="b2b-gsend__smsfoot">
                <span className="b2b-gsend__smsnote">
                  <Icon name="link" size={14} />
                  {s2.linkNote}
                </span>
                <span className="b2b-gsend__smscount">{s2.chars(smsText.length)}</span>
              </div>
            </section>
          )}
        </div>
      </Drawer>

      <Toast toast={toast} onDone={() => setToast(null)} />

      {confirming && (
        <ConfirmDialog
          variant="primary"
          title={s.confirmTitle}
          body={s.confirmBody(count, channelKey === 'both' ? s2.confirmBoth : s.confirmChannel[channelKey])}
          confirmLabel={s.confirmSend}
          keepLabel={s.keep}
          onConfirm={doSend}
          onClose={() => setConfirming(false)}
        />
      )}
    </>
  )
}
