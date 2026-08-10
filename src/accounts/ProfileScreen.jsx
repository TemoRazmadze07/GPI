import { useRef, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { Button, IconButton } from '../components/Button.jsx'
import Badge from '../components/Badge.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import PasswordModal from './PasswordModal.jsx'
import CropModal from './CropModal.jsx'
import ContactModal from './ContactModal.jsx'
import { kaAcc as ka } from './strings.js'

const MIN_PHOTO = 200 // px — shortest edge; matches the stated upload spec

/* ProfileScreen — V2 single-page console. Order: profile header (avatar +
   name; the "signed in as" line was REMOVED 2026-08-10 — the email already
   lives in the details and the header chip) → MyGPI hero → (linking, when
   enabled) → personal info → security row (PasswordModal) → privacy.

   Personal info splits in two (user direction 2026-08-10):
   · identity rows (name / surname / personal ID / sex) — read-only, from the
     GPI base; the lavender note explains how to change them.
   · CONTACT rows (phone / email) — editable HERE, each with a verified badge;
     editing or verifying goes through ContactModal's OTP step. Demo state:
     phone verified, email not — so both badge states are visible. */
const IDENTITY_ROWS = [
  ['firstName', ka.user.firstName],
  ['lastName', ka.user.lastName],
  ['pid', ka.user.pid],
  ['sex', ka.user.sex],
]

export default function ProfileScreen({ linked, linking, onOpenLink, photo, onPhoto }) {
  const [pwOpen, setPwOpen] = useState(false)
  const [cropSrc, setCropSrc] = useState(null)
  const [uploadErr, setUploadErr] = useState(null)
  const [contacts, setContacts] = useState({
    phone: { value: ka.user.phone, verified: true },
    email: { value: ka.user.email, verified: false },
  })
  const [contactModal, setContactModal] = useState(null) // { type: 'phone'|'email', mode: 'edit'|'verify' }
  const fileRef = useRef(null)

  /* Upload gate: type → minimum size → shape. A square image needs no crop and
     goes straight in; anything else opens CropModal (user rule: crop, never resize). */
  const onFile = (e) => {
    const f = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!f) return
    if (!/^image\/(png|jpeg)$/.test(f.type)) {
      setUploadErr(ka.crop.wrongType)
      return
    }
    const url = URL.createObjectURL(f)
    const im = new Image()
    im.onload = () => {
      if (Math.min(im.naturalWidth, im.naturalHeight) < MIN_PHOTO) {
        setUploadErr(ka.crop.tooSmall)
        URL.revokeObjectURL(url)
        return
      }
      setUploadErr(null)
      if (im.naturalWidth === im.naturalHeight) onPhoto(url)
      else setCropSrc(url)
    }
    im.onerror = () => {
      setUploadErr(ka.crop.wrongType)
      URL.revokeObjectURL(url)
    }
    im.src = url
  }

  const closeCrop = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
  }

  const confirmContact = (value) => {
    setContacts((prev) => ({ ...prev, [contactModal.type]: { value, verified: true } }))
    setContactModal(null)
  }

  const contactRow = (type, label) => {
    const c = contacts[type]
    return (
      <div className="acc-row" key={type}>
        <dt className="t-body acc-row__lbl">{label}</dt>
        <dd className="t-body acc-row__val acc-row__val--contact">
          <span>{c.value}</span>
          <Badge color={c.verified ? 'success' : 'warning'} size="sm">
            {c.verified ? ka.contact.verified : ka.contact.unverified}
          </Badge>
          {!c.verified && (
            <button
              type="button"
              className="acc-link t-caption"
              onClick={() => setContactModal({ type, mode: 'verify' })}
            >
              {ka.contact.verify}
            </button>
          )}
          <IconButton
            icon="pencil"
            title={ka.contact.edit}
            onClick={() => setContactModal({ type, mode: 'edit' })}
          />
        </dd>
      </div>
    )
  }

  return (
    <>
      <section className="acc-profile">
        <div className="acc-avatar">
          {photo ? (
            <img className="acc-avatar__img" src={photo} alt="" />
          ) : (
            <span className="acc-avatar__init" aria-hidden="true">{ka.user.initials}</span>
          )}
          <button
            type="button"
            className="acc-avatar__edit"
            title={`${ka.profile.editPhoto} · ${ka.profile.photoHint}`}
            aria-label={ka.profile.editPhoto}
            onClick={() => fileRef.current && fileRef.current.click()}
          >
            <Icon name="camera" size={16} />
          </button>
          <input
            ref={fileRef}
            className="gpi-sr-only"
            type="file"
            accept="image/png,image/jpeg"
            onChange={onFile}
            aria-label={ka.profile.editPhoto}
            tabIndex={-1}
          />
        </div>
        <h1 className="t-h2 acc-title">{ka.user.firstName} {ka.user.lastName}</h1>
        {uploadErr && (
          <div className="acc-uploaderr">
            <InlineAlert tone="error">{uploadErr}</InlineAlert>
          </div>
        )}
      </section>

      <section className="acc-card acc-hero">
        <div className="acc-hero__txt">
          <h2 className="t-h4 acc-title">{ka.home.mygpiTitle}</h2>
          <p className="t-body acc-desc">{ka.home.mygpiDesc}</p>
        </div>
        <Button variant="primary" size="lg" trailingIcon="arrow-right">{ka.home.mygpiCta}</Button>
      </section>

      {linking && (linked ? (
        <InlineAlert tone="success" title={ka.home.linkedTitle}>{ka.home.linkedText}</InlineAlert>
      ) : (
        <section className="acc-card acc-hero">
          <div className="acc-hero__txt">
            <h2 className="t-h4 acc-title">{ka.home.linkTitle}</h2>
            <p className="t-body acc-desc">{ka.home.linkDesc}</p>
            <p className="t-caption acc-once">
              <Icon name="info" size={14} />
              {ka.home.linkOnce}
            </p>
          </div>
          <Button variant="secondary" size="lg" onClick={onOpenLink}>{ka.home.linkCta}</Button>
        </section>
      ))}

      <section className="acc-card">
        <h2 className="t-h4 acc-title acc-sectitle">{ka.personal.title}</h2>
        <dl className="acc-rows">
          {IDENTITY_ROWS.map(([key, value]) => (
            <div key={key} className="acc-row">
              <dt className="t-body acc-row__lbl">{ka.personal.fields[key]}</dt>
              <dd className="t-body acc-row__val">{value}</dd>
            </div>
          ))}
          {contactRow('phone', ka.personal.fields.phone)}
          {contactRow('email', ka.personal.fields.email)}
        </dl>
        <div className="acc-note" role="note">
          <Icon name="info" size={16} />
          <p className="t-body-sm">{ka.personal.noteIdentity}</p>
        </div>
      </section>

      <section className="acc-card acc-shortcuts acc-shortcuts--single">
        <button type="button" className="acc-short" onClick={() => setPwOpen(true)}>
          <span className="acc-short__ic"><Icon name="lock" size={20} /></span>
          <span className="acc-short__txt">
            <span className="t-body acc-short__lbl">{ka.home.shortSecurity}</span>
            <span className="t-caption acc-short__hint">{ka.home.shortSecurityHint}</span>
          </span>
          <Icon name="chevron-right" size={20} className="acc-short__chev" />
        </button>
      </section>

      <p className="t-caption acc-privacy">
        {ka.home.privacy}{' '}
        <a className="acc-link" href="#/accounts" onClick={(e) => e.preventDefault()}>{ka.home.privacyMore}</a>
      </p>

      {pwOpen && <PasswordModal onClose={() => setPwOpen(false)} />}

      {contactModal && (
        <ContactModal
          type={contactModal.type}
          mode={contactModal.mode}
          current={contacts[contactModal.type].value}
          onCancel={() => setContactModal(null)}
          onConfirm={confirmContact}
        />
      )}

      {cropSrc && (
        <CropModal
          src={cropSrc}
          onCancel={closeCrop}
          onConfirm={(url) => {
            onPhoto(url)
            closeCrop()
          }}
        />
      )}
    </>
  )
}
