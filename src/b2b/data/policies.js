/* Mock policies per product (POL-…). Volumes mirror the contracts data
   (health 248 · auto 34 · travel 62 · property 16). Generated with a seeded
   LCG — deterministic, so rows are stable across reloads (important for
   usability testing + screenshots).
   EVERY row carries the SAME shared fields (2026-07-16, aligned with the
   team prototype's policy tables): `contract` (CNT-… it belongs to) +
   `start`/`end` (policy period). Ended policies hang off the previous-year
   contract; active/canceled off the current one.
   onco + accident REMOVED 2026-07-16 (no corporate policy types for them). */

let seed = 7
const rnd = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648
  return seed / 2147483648
}
const pick = (arr) => arr[Math.floor(rnd() * arr.length)]
const digits = (n) => Array.from({ length: n }, () => Math.floor(rnd() * 10)).join('')
const pad2 = (n) => String(n).padStart(2, '0')

const FIRST = [
  'ნინო', 'გიორგი', 'თამარ', 'ლუკა', 'ანა', 'დავით', 'მარიამ', 'ლევან', 'სალომე', 'ირაკლი',
  'ნიკა', 'ელენე', 'ზურაბ', 'ქეთევან', 'ალექსანდრე', 'ნათია', 'ვახტანგ', 'სოფო', 'გურამ', 'ლიკა',
]
const LAST = [
  'ბერიძე', 'კაპანაძე', 'გელაშვილი', 'მაისურაძე', 'წიკლაური', 'ჩხეიძე', 'ლომიძე', 'ხარატიშვილი',
  'ჯავახიშვილი', 'მამულაშვილი', 'ქავთარაძე', 'დოლიძე', 'ნადირაძე', 'აბაშიძე', 'გოგოლაძე', 'კვარაცხელია',
]

/* ~80% active · ~12% ended · ~8% canceled */
const status = () => {
  const r = rnd()
  return r < 0.8 ? 'active' : r < 0.92 ? 'ended' : 'canceled'
}

let polSeq = 1000
const polNo = () => `POL-2025-${polSeq++}`
const personName = () => `${pick(FIRST)} ${pick(LAST)}`
const pid = () => `01${digits(9)}`

const dateInYear = (y) => `${pad2(1 + Math.floor(rnd() * 28))}.${pad2(1 + Math.floor(rnd() * 12))}.${y}`

/* ---- health: employees + linked family members.
   Policy year follows the contract: ended → 2024 contract, else 2025. */
const HEALTH_CNT = { current: 'CNT-2025-0128', previous: 'CNT-2024-0089' }
const healthShared = () => {
  const st = status()
  const y = st === 'ended' ? 2024 : 2025
  return {
    id: polNo(),
    status: st,
    contract: st === 'ended' ? HEALTH_CNT.previous : HEALTH_CNT.current,
    start: dateInYear(y),
    end: `31.12.${y}`,
  }
}
/* Monthly premium follows the package (₾/თვე, "from the core system") */
const HEALTH_PREMIUM = {
  'ბაზისი': () => 30 + Math.floor(rnd() * 16),
  'ოპტიმალი': () => 50 + Math.floor(rnd() * 21),
  'პრემიუმი': () => 80 + Math.floor(rnd() * 31),
}
const health = []
const employees = []
for (let i = 0; i < 178; i++) {
  const name = personName()
  employees.push(name)
  const pkg = pick(['ბაზისი', 'ბაზისი', 'ოპტიმალი', 'ოპტიმალი', 'ოპტიმალი', 'პრემიუმი'])
  health.push({
    ...healthShared(),
    name,
    pid: pid(),
    relation: 'employee',
    linkedTo: null,
    package: pkg,
    premium: HEALTH_PREMIUM[pkg](),
  })
}
for (let i = 0; i < 70; i++) {
  const employee = pick(employees)
  const relation = pick(['spouse', 'child', 'child', 'parent'])
  const surname = employee.split(' ')[1]
  const pkg = pick(['ბაზისი', 'ბაზისი', 'ოპტიმალი'])
  health.push({
    ...healthShared(),
    name: `${pick(FIRST)} ${relation === 'spouse' ? pick(LAST) : surname}`,
    pid: pid(),
    relation,
    linkedTo: employee,
    package: pkg,
    premium: HEALTH_PREMIUM[pkg](),
  })
}

/* ---- auto: vehicles (plate = the unique identifier); annual policies ---- */
const PLATE_LETTERS = ['AA', 'BB', 'CC', 'DD', 'GG', 'HH', 'KK', 'LL', 'MM', 'NN', 'QQ', 'RR', 'SS', 'TT']
const VEHICLES = [
  'Toyota Camry', 'Toyota RAV4', 'Toyota Corolla', 'Hyundai Tucson', 'Hyundai Santa Fe',
  'KIA Sportage', 'KIA Sorento', 'BMW X3', 'Mercedes C 200', 'Mercedes GLC', 'VW Golf',
  'VW Tiguan', 'Ford Transit', 'Honda CR-V', 'Mazda CX-5', 'Škoda Octavia',
]
const auto = []
for (let i = 0; i < 34; i++) {
  const st = status()
  const y = st === 'ended' ? 2024 : 2025
  const d = 1 + Math.floor(rnd() * 28)
  const m = 1 + Math.floor(rnd() * 12)
  auto.push({
    id: polNo(),
    status: st,
    contract: st === 'ended' ? 'CNT-2024-0117' : pick(['CNT-2025-0131', 'CNT-2025-0182']),
    plate: `${pick(PLATE_LETTERS)}-${digits(3)}-${pick(PLATE_LETTERS)}`,
    vehicle: pick(VEHICLES),
    owner: personName(),
    start: `${pad2(d)}.${pad2(m)}.${y}`,
    end: `${pad2(d)}.${pad2(m)}.${y + 1}`,
    premium: (90 + Math.floor(rnd() * 240)) * 10, // annual CASCO ₾900–3,290
  })
}

/* ---- travel: per-person trip windows ---- */
const travel = []
for (let i = 0; i < 62; i++) {
  const st = status()
  const y = st === 'ended' ? 2024 : 2025
  const from = new Date(y, Math.floor(rnd() * 12), 1 + Math.floor(rnd() * 28))
  const to = new Date(from)
  to.setDate(to.getDate() + 7 + Math.floor(rnd() * 21))
  travel.push({
    id: polNo(),
    status: st,
    contract: st === 'ended' ? 'CNT-2024-0152' : 'CNT-2025-0094',
    name: personName(),
    pid: pid(),
    start: `${pad2(from.getDate())}.${pad2(from.getMonth() + 1)}.${from.getFullYear()}`,
    end: `${pad2(to.getDate())}.${pad2(to.getMonth() + 1)}.${to.getFullYear()}`,
    premium: 30 + Math.floor(rnd() * 160), // one-off per trip ₾30–189
  })
}

/* ---- property: insured objects; policy period = the contract year ---- */
const STREETS = [
  'ჭავჭავაძის გამზ. 34', 'რუსთაველის გამზ. 12', 'აღმაშენებლის გამზ. 156', 'პეკინის ქ. 28',
  'ვაჟა-ფშაველას გამზ. 71', 'წერეთლის გამზ. 116', 'კაზბეგის გამზ. 24', 'გორგასლის ქ. 89',
  'თამარ მეფის გამზ. 3', 'ბერბუკის ქ. 7', 'მოსაშვილის ქ. 16', 'აბაშიძის ქ. 42',
  'ლეონიძის ქ. 5', 'ბარათაშვილის ქ. 8', 'მელიქიშვილის ქ. 19', 'ყაზბეგის გამზ. 47',
]
const PROP_TYPES = ['ოფისი', 'საწყობი', 'მაღაზია', 'ფილიალი']
const property = STREETS.map((address) => {
  const st = status()
  const prev = st === 'ended'
  const sum = (2 + Math.floor(rnd() * 28)) * 50000
  return {
    id: polNo(),
    status: st,
    contract: prev ? 'CNT-2024-0201' : 'CNT-2025-0162',
    start: prev ? '01.07.2024' : '01.07.2025',
    end: prev ? '30.06.2025' : '30.06.2026',
    address: `თბილისი, ${address}`,
    type: pick(PROP_TYPES),
    sum,
    premium: Math.round(sum * 0.004 / 10) * 10, // annual ≈ 0.4% of the insured sum
  }
})

export const POLICIES = { health, auto, travel, property }
export const PROP_TYPE_ORDER = PROP_TYPES

/* Status → Badge colour, shared by the policies table and the edit drawer. */
export const STATUS_BADGE = { active: 'success', ended: 'neutral', canceled: 'error' }

/* ---- edit-insured drawer: pre-populated draft for a health policy row ------
   The table rows don't carry birth/gender/contacts (the back office does), so
   the drawer derives them DETERMINISTICALLY from the row's pid — same person,
   same values, every reload. Deliberately computed on demand and OUTSIDE the
   seeded LCG above: inserting extra rnd() calls into the generator would
   reshuffle every downstream table (names, plates, addresses). */

const hash = (s) => {
  let h = 0
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 999983
  return h
}

/* Practical Georgian → Latin transliteration, enough for the name pools. */
const TRANSLIT = {
  ა: 'a', ბ: 'b', გ: 'g', დ: 'd', ე: 'e', ვ: 'v', ზ: 'z', თ: 't', ი: 'i',
  კ: 'k', ლ: 'l', მ: 'm', ნ: 'n', ო: 'o', პ: 'p', ჟ: 'zh', რ: 'r', ს: 's',
  ტ: 't', უ: 'u', ფ: 'p', ქ: 'k', ღ: 'gh', ყ: 'q', შ: 'sh', ჩ: 'ch',
  ც: 'ts', ძ: 'dz', წ: 'ts', ჭ: 'ch', ხ: 'kh', ჯ: 'j', ჰ: 'h', '-': '-',
}
const translit = (s) => [...s].map((ch) => TRANSLIT[ch] ?? '').join('')

/* Table rows store the package by its Georgian LABEL; the form draft stores
   the value key (data/addInsured.js `packages`). */
const PKG_VALUE = { 'ბაზისი': 'basic', 'ოპტიმალი': 'optimal', 'პრემიუმი': 'premium' }

export function insuredDraftFor(row) {
  const h = hash(row.pid)
  const [first = '', last = ''] = row.name.split(' ')
  const employee = row.relation === 'employee'
  /* Family birth years skew younger/older by relation; employees 1965–1999. */
  const year =
    row.relation === 'child' ? 2005 + (h % 15) : row.relation === 'parent' ? 1950 + (h % 12) : 1965 + (h % 35)
  const pad2 = (n) => String(n).padStart(2, '0')
  return {
    who: employee ? 'employee' : 'family',
    citizen: 'resident',
    pid: row.pid,
    birth: `${pad2(1 + (h % 28))}/${pad2(1 + ((h >> 5) % 12))}/${year}`,
    firstName: first,
    lastName: last,
    gender: h % 2 === 0 ? 'female' : 'male',
    linkedTo: row.linkedTo || '',
    relation: employee ? '' : row.relation,
    mobile: `+995 5${row.pid.slice(2, 4)} ${row.pid.slice(4, 7)} ${row.pid.slice(7, 10)}`,
    email: `${translit(first)}.${translit(last)}@mail.ge`,
    address: `თბილისი, ${STREETS[h % STREETS.length]}`,
    pkg: PKG_VALUE[row.package] || '',
  }
}
