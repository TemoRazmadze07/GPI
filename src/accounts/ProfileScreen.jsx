import { useEffect, useRef, useState } from 'react'
import Icon from '../lib/Icon.jsx'
import { Button, IconButton } from '../components/Button.jsx'
import Tooltip from '../components/Tooltip.jsx'
import DemoBar from '../components/DemoBar.jsx'
import InlineAlert from '../components/InlineAlert.jsx'
import PasswordModal from './PasswordModal.jsx'
import CropModal from './CropModal.jsx'
import ContactModal from './ContactModal.jsx'
import { kaAcc as ka } from './strings.js'

const MIN_PHOTO = 200 // px — shortest edge; matches the stated upload spec

/* `?demo=` inside the hash — the same shareable-quick-link idiom as B2B's
   `#/b2b/insured/add/excel?demo=errors`, registered in the Flow Map so the
   states are FINDABLE without knowing the URL by heart.
     email  → email is contact-only (the default seed)
     phone  → phone is contact-only (exercises the „ამ ნომრით" grammar, which
              the seed data can never reach)
     linked → both linked, no box
   A demo link also OVERRIDES the „მოგვიანებით" session flag: the whole point of
   the link is to show the box, so a dismissal from earlier in the tab must not
   silently win. */
function demoKey() {
  const h = window.location.hash
  const qi = h.indexOf('?')
  if (qi === -1) return null
  const v = new URLSearchParams(h.slice(qi + 1)).get('demo')
  return v === 'phone' || v === 'linked' || v === 'email' ? v : null
}

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
  /* `linked` = usable as a SIGN-IN credential, not merely reachable (user
     model, 2026-08-10). Every account has ≥1 linked channel — that's how they
     log in at all. Demo: phone linked, email contact-only, so the linking box
     has something to offer on first load. */
  /* Exactly ONE channel is contact-only in each demo state — never both. An
     account with nothing linked could not log in, so it is not a state the
     product can be in, and the box would otherwise offer the phone while the
     email silently lost its check too. */
  const [contacts, setContacts] = useState(() => {
    const d = demoKey()
    return {
      phone: { value: ka.user.phone, linked: d !== 'phone' },
      email: { value: ka.user.email, linked: d === 'phone' || d === 'linked' },
    }
  })
  const [contactModal, setContactModal] = useState(null) // { type: 'phone'|'email', mode: 'edit'|'verify', intent?: 'link' }
  /* „მოგვიანებით" hides the box for THIS SESSION only — the locked decision is
     that the offer persists until linked, but a user who said "not now" isn't
     nagged within the same visit. */
  const [linkLater, setLinkLater] = useState(
    () => !demoKey() && sessionStorage.getItem('gpi.acc.linkLater') === '1',
  )
  const [justLinked, setJustLinked] = useState(null) // 'phone' | 'email' — success alert until reload
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

  /* Linking flips `linked`; editing swaps the VALUE and deliberately keeps the
     linked flag as it was. The edit OTP proves possession of the new address —
     it does not decide whether that address is a login credential. So editing
     an unlinked email leaves the linking box standing, now offering the new
     address; editing a linked one keeps it a credential. */
  const confirmContact = () => {
    const { type, intent } = contactModal
    setContactModal(null)
    if (intent === 'link') {
      setContacts((prev) => ({ ...prev, [type]: { ...prev[type], linked: true } }))
      setJustLinked(type)
    }
  }

  const confirmEdit = (value) => {
    const { type } = contactModal
    setContacts((prev) => ({ ...prev, [type]: { ...prev[type], value } }))
    setContactModal(null)
  }

  /* Demo jumps. The linking box is the one state a demo cannot get back to on
     its own: „მოგვიანებით" writes a session flag, and after a successful link
     the only reset is a new tab. These set both channels explicitly and always
     clear the flag + the success alert, so each jump lands on a clean,
     predictable screen rather than whatever was left over. */
  const setLinkState = (phoneLinked, emailLinked) => {
    sessionStorage.removeItem('gpi.acc.linkLater')
    setLinkLater(false)
    setJustLinked(null)
    setContactModal(null)
    setContacts((prev) => ({
      phone: { ...prev.phone, linked: phoneLinked },
      email: { ...prev.email, linked: emailLinked },
    }))
  }
  const demoState = (phoneLinked, emailLinked) => () => setLinkState(phoneLinked, emailLinked)

  /* Re-apply on hashchange, not just at mount: the SPA keeps this component
     mounted when only the hash QUERY changes, so a `?demo=` link clicked from
     the Flow Map (or swapped in the address bar) would otherwise show whatever
     state was already on screen. useState initialisers run once — this is the
     part that makes the quick links actually work as links. */
  useEffect(() => {
    const apply = () => {
      const d = demoKey()
      if (d) setLinkState(d !== 'phone', d === 'phone' || d === 'linked')
    }
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [])

  const contactRow = (type, label) => {
    const c = contacts[type]
    return (
      <div className="acc-row" key={type}>
        <dt className="t-body acc-row__lbl">{label}</dt>
        <dd className="t-body acc-row__val acc-row__val--contact">
          {/* ONE calm state (user, 2026-08-10): a leading check = linked as a
              sign-in credential, nothing = contact-only. The row states a
              fact; the CALL TO ACTION lives in the linking box above, so the
              amber icon and the inline „დადასტურება" link are gone. The label
              is never hover-only — the sr-only span keeps it in the a11y tree
              for touch (see the Tooltip contract). */}
          {c.linked && (
            <Tooltip label={ka.linking.linkedTip}>
              <span className="acc-status acc-status--ok">
                <Icon name="check-circle" size={18} />
                <span className="gpi-sr-only">{ka.linking.linkedTip}</span>
              </span>
            </Tooltip>
          )}
          <span>{c.value}</span>
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

      {/* ---- Per-channel credential linking (user model, 2026-08-10) --------
          Shown only when a channel is contact-only AND the user hasn't said
          „მოგვიანებით" this session. Highlighted (info surface) because it is
          the ONE actionable exception on the page — the rows stay calm. After
          OTP success it resolves to a green alert until reload. */}
      {justLinked && (
        <InlineAlert tone="success" title={ka.linking.successTitle(justLinked === 'phone')}>
          {ka.linking.successBody(justLinked === 'phone')}
        </InlineAlert>
      )}
      {(() => {
        const unlinkedType = !contacts.phone.linked ? 'phone' : !contacts.email.linked ? 'email' : null
        if (!unlinkedType || linkLater) return null
        const isPhone = unlinkedType === 'phone'
        return (
          <section className="acc-card acc-linkbox">
            <h2 className="t-h4 acc-linkbox__title">
              <Icon name="link" size={20} />
              {ka.linking.boxTitle(isPhone)}
            </h2>
            <p className="t-body acc-linkbox__body">
              {ka.linking.boxBody(isPhone, contacts[unlinkedType].value)}
            </p>
            <div className="acc-linkbox__actions">
              <Button
                variant="secondary"
                onClick={() => setContactModal({ type: unlinkedType, mode: 'verify', intent: 'link' })}
              >
                {ka.linking.cta}
              </Button>
              <Button
                variant="tertiary"
                onClick={() => {
                  sessionStorage.setItem('gpi.acc.linkLater', '1')
                  setLinkLater(true)
                }}
              >
                {ka.linking.later}
              </Button>
            </div>
          </section>
        )
      })()}

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
          intent={contactModal.intent}
          current={contacts[contactModal.type].value}
          onCancel={() => setContactModal(null)}
          onConfirm={contactModal.mode === 'edit' ? confirmEdit : confirmContact}
        />
      )}

      {/* Both single-unlinked states are offered because the box's copy is
          grammar-switched per channel („ამ ნომრით" vs „ამ ელ.ფოსტით") — the
          phone variant is otherwise unreachable in the demo, since the seed
          data has the phone already linked. */}
      <DemoBar
        actions={[
          { label: 'email not linked', onClick: demoState(true, false) },
          { label: 'phone not linked', onClick: demoState(false, true) },
          { label: 'both linked', onClick: demoState(true, true), ghost: true },
        ]}
      />

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
