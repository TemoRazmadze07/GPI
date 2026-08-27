/* Dashboard host (#/dash) — demo data, transcribed from the design shots.

   Everything here is ILLUSTRATIVE. Policy numbers, limits, plates, referral
   numbers and the personal-doctor name are the design's own sample values, not
   real customer data. Product names (MEDI EXCLUSIVE, AUTO ACTIVE) and loyalty
   tiers (Compact / Starter Bruno, Voovly) are GPI's and stay in Latin in both
   locales — they are brand names, not UI copy.

   Photos come from the same Unsplash pattern the rest of the prototype uses
   (w/h 96, crop=faces) so faces render without shipping binaries. */

import { lang } from '../i18n/index.js'

const L = (ka, en) => (lang === 'en' ? en : ka)
const face = (id) => `https://images.unsplash.com/${id}?w=96&h=96&fit=crop&crop=faces&auto=format&q=60`

/* Loyalty tiers. `tone` keys the Bruno mark's colour (see marks.jsx). */
export const TIERS = {
  compact: { label: 'Compact Bruno', tone: 'blue' },
  starter: { label: 'Starter Bruno', tone: 'green' },
}

export const USER = { points: 120 }

/* ---- ACTIVE POLICIES strip ------------------------------------------------
   `count` is the true number of policies on the account; the strip shows the
   first three and the section head links to the rest. */
export const POLICY_COUNT = 5

export const POLICIES = [
  {
    id: 'p-health',
    kind: 'health',
    name: 'MEDI EXCLUSIVE',
    no: 'OMI 406786/26',
    metaKey: 'insured',
    metaValue: L('გიორგი გიორგაძე', 'Giorgi Giorgadze'),
  },
  {
    id: 'p-auto-1',
    kind: 'auto',
    name: 'AUTO ACTIVE',
    no: 'OMI 406786/26',
    metaKey: 'vehicle',
    metaValue: 'AA-612-BB',
    tier: 'compact',
  },
  {
    id: 'p-auto-2',
    kind: 'auto',
    name: 'AUTO ACTIVE',
    no: 'OMI 406786/26',
    metaKey: 'vehicle',
    metaValue: 'DR-100-UM',
    tier: 'starter',
  },
]

/* ---- Health policy card --------------------------------------------------- */
export const HEALTH = {
  person: L('გიორგი გიორგაძე', 'Giorgi Giorgadze'),
  renews: L('12 იან 2026', '12 Jan 2026'),
  nextPayment: L('5 მარ, 2026', '5 Mar, 2026'),
  /* Currency stays a suffix so the numeral grouping is identical in both
     locales; ₾ is the Georgian lari sign, "GEL" the design's English form. */
  limits: [
    { id: 'outpatient', used: 820, total: 3000 },
    { id: 'dental', used: 1400, total: 1500 },
  ],
  doctor: {
    name: L('ნინო ნინოშვილი', 'Nino Ninoshvili'),
    photo: face('photo-1559839734-2b71ea197ec2'),
  },
}

export const money = (n) => `${n.toLocaleString('en-US')} ${L('₾', 'GEL')}`

export const BOOKINGS_COUNT = 8
export const BOOKINGS = [
  {
    id: 'b1',
    apptId: 'a1',
    doctor: L('ნინო ნინოშვილი', 'Nino Ninoshvili'),
    photo: face('photo-1559839734-2b71ea197ec2'),
    when: L('12 ნოე, 2025 · 11:30 — 12:00', '12 Nov, 2025 · 11:30 — 12:00'),
    person: L('გიორგი გიორგაძე', 'Giorgi Giorgadze'),
    status: 'ongoing',
  },
  {
    id: 'b2',
    doctor: L('ნინო ნინოშვილი', 'Nino Ninoshvili'),
    photo: face('photo-1559839734-2b71ea197ec2'),
    when: L('12 ნოე, 2025 · 11:30 — 12:00', '12 Nov, 2025 · 11:30 — 12:00'),
    person: L('გიორგი გიორგაძე', 'Giorgi Giorgadze'),
    status: 'ongoing',
  },
  {
    id: 'b3',
    doctor: L('ნინო ნინოშვილი', 'Nino Ninoshvili'),
    photo: face('photo-1559839734-2b71ea197ec2'),
    when: L('12 ნოე, 2025 · 11:30 — 12:00', '12 Nov, 2025 · 11:30 — 12:00'),
    person: L('გიორგი გიორგაძე', 'Giorgi Giorgadze'),
    status: 'ongoing',
  },
]

export const REFERRALS_COUNT = 5
/* r0 is the enhance-in-place row (locked hybrid model): an expiring chronic
   referral surfaces its deadline + the renewal path RIGHT IN the rail, instead
   of a separate Curatio list duplicating it. Wording is mobile #11's — renewal
   is a VISIT you book, not a request you file. */
export const REFERRALS = [
  {
    id: 'r0',
    person: L('გიორგი გიორგაძე', 'Giorgi Giorgadze'),
    no: 'EED 336 128 / 23',
    status: 'expiring',
    expiryDays: 7,
    chronic: true,
  },
  { id: 'r1', person: L('სახელი გვარი', 'Name Surname'), no: 'EED 336 135 / 23', status: 'review' },
  { id: 'r2', person: L('სახელი გვარი', 'Name Surname'), no: 'EED 336 135 / 23', status: 'review' },
  { id: 'r3', person: L('სახელი გვარი', 'Name Surname'), no: 'EED 336 135 / 23', status: 'review' },
]

/* ---- Auto policy card ----------------------------------------------------- */
export const AUTO = {
  tier: 'compact',
  nextPayment: L('5 მარ, 2026', '5 Mar, 2026'),
  actives: 2,
  assistant: {
    name: L('მარიამ', 'Mariam'),
    phone: '+995 591 001 002',
    photo: face('photo-1573497019940-1c28c88b4f3e'),
  },
}

export const VOOVLY_COUNT = 35
export const VOOVLY = [
  { id: 'v1', icon: 'phone', label: L('24/7 ქოლ-ცენტრი', '24/7 call center'), free: true, value: 'noLimit' },
  { id: 'v2', icon: 'wrench', label: L('24/7 ავტოექსპერტი', '24/7 Auto expert'), free: true, value: 'noLimit' },
]

export const BRUNO_COUNT = 5
export const BRUNO = [
  {
    id: 'br1',
    mark: 'bruno',
    tone: 'blue',
    label: L('120 ქულა · Compact Bruno', '120 pts - Compact Bruno'),
    plate: 'DR-100-UM',
  },
  {
    id: 'br2',
    icon: 'droplets',
    label: L('პრემიუმ ავტოსამრეცხაო', 'Premium car wash'),
    free: true,
    plate: 'AA-612-BB',
    tier: 'starter',
  },
  {
    id: 'br3',
    icon: 'check-circle',
    tint: 'green',
    label: 'GreenWay',
    free: true,
    plate: 'AA-612-BB',
    tier: 'starter',
  },
]
