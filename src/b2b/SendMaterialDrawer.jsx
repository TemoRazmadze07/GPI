import { useState } from 'react'
import Drawer from '../components/Drawer.jsx'
import Radio from '../components/Radio.jsx'
import Select from '../components/Select.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { Button } from '../components/Button.jsx'
import Icon from '../lib/Icon.jsx'
import { kaB2B } from './strings.js'
import { RECIPIENTS } from './data/guide.js'

/* SendMaterialDrawer — THE one send flow for every "გაგზავნა" on the guide
   screen (kit, video, FAQ, handbook). Replaces the team prototype's per-card
   Email/SMS button spam with: what → recipients → channel → preview → confirm.
   Guards (concept 2026-08-06): the submit button always carries the recipient
   count, a ConfirmDialog (primary variant — consequential, not destructive)
   restates count + channel, and re-sending to a group that already got this
   material raises a warning note (group-level "already received", v1 scope —
   individual recipient picking is deferred). The preview shows the actual
   message the employee receives — trust-critical for SMS (phishing wariness). */

const TYPE_ICON = { kit: 'graduation-cap', video: 'play', faq: 'message-circle', handbook: 'file-text' }

export default function SendMaterialDrawer({ material, history, onSent, onClose }) {
  const t = kaB2B
  const s = t.guide.send
  const [group, setGroup] = useState('all')
  const [contractId, setContractId] = useState(RECIPIENTS.contracts[0].id)
  const [channel, setChannel] = useState('email')
  const [confirming, setConfirming] = useState(false)
  const [sent, setSent] = useState(false)

  const contract = RECIPIENTS.contracts.find((c) => c.id === contractId)
  const count = group === 'all' ? RECIPIENTS.all : group === 'recent' ? RECIPIENTS.recent : contract.insured
  const toLabel = group === 'all' ? 'ყველა დაზღვეული' : group === 'recent' ? 'ბოლოს დამატებულები' : contract.id

  /* Group-level re-send guard: same material to the same audience. */
  const prior = history.find((h) => h.material === material.title && h.to === toLabel)

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
      channel,
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
            <Button variant="primary" size="md" onClick={() => setConfirming(true)}>
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
          </section>

          <section>
            <h4 className="b2b-gsend__h">{s.to}</h4>
            <div className="b2b-gsend__opts" role="radiogroup" aria-label={s.toLabel}>
              <Radio name="gsend-to" value="all" checked={group === 'all'} onChange={setGroup} label={s.groupAll(RECIPIENTS.all)} />
              <Radio name="gsend-to" value="recent" checked={group === 'recent'} onChange={setGroup} label={s.groupRecent(RECIPIENTS.recent)} />
              <Radio name="gsend-to" value="contract" checked={group === 'contract'} onChange={setGroup} label={s.groupContract} />
            </div>
            {group === 'contract' && (
              <div className="b2b-gsend__contract">
                <Select
                  value={contractId}
                  onChange={setContractId}
                  ariaLabel={s.groupContract}
                  options={RECIPIENTS.contracts.map((c) => ({
                    value: c.id,
                    label: `${c.label} · ${s.contractMeta(c.insured)}`,
                  }))}
                />
              </div>
            )}
            {prior && (
              <p className="b2b-gsend__warn">
                <Icon name="alert-triangle" size={16} />
                {s.alreadySent(prior.date)}
              </p>
            )}
          </section>

          <section>
            <h4 className="b2b-gsend__h">{s.channel}</h4>
            <div className="b2b-gsend__opts b2b-gsend__opts--row" role="radiogroup" aria-label={s.channelLabel}>
              <Radio name="gsend-ch" value="email" checked={channel === 'email'} onChange={setChannel} label={s.channels.email} />
              <Radio name="gsend-ch" value="sms" checked={channel === 'sms'} onChange={setChannel} label={s.channels.sms} />
            </div>
          </section>

          <section>
            <h4 className="b2b-gsend__h">{s.preview}</h4>
            <div className="b2b-gsend__preview">
              <div className="b2b-gsend__pv-from">
                <Icon name={channel === 'email' ? 'mail' : 'smartphone'} size={16} />
                {channel === 'email' ? s.previewFromEmail : s.previewFromSms}
              </div>
              {channel === 'email' && <div className="b2b-gsend__pv-subject">{s.previewSubject}</div>}
              <p className="b2b-gsend__pv-body">{s.previewBody(t.topbar.client, material.title)}</p>
              <span className="b2b-gsend__pv-link">{s.previewLink}</span>
            </div>
          </section>
        </div>
      </Drawer>

      {confirming && (
        <ConfirmDialog
          variant="primary"
          title={s.confirmTitle}
          body={s.confirmBody(count, s.confirmChannel[channel])}
          confirmLabel={s.confirmSend}
          keepLabel={s.keep}
          onConfirm={doSend}
          onClose={() => setConfirming(false)}
        />
      )}
    </>
  )
}
