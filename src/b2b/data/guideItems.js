/* Guide VERSION B (concept locked in chat 2026-08-17) — the guide becomes a
   feed of publishable ITEMS with two sendable types:
     · bundle — a GPI-Holding-prepared package (video + FAQ + instruction
       sections). Never authored in this portal; it appears here once GPI
       publishes it. The v A "onboarding kit" is the first bundle.
     · blog   — a single article page, also GPI-authored (fork locked
       2026-08-17: the portal stays distribution-only for both types).
   Each item has its own internal detail page (#/b2b/guide/<id>) and an
   EXTERNAL read-only page (#/guide/<id>) — the page an employee lands on from
   the SMS/email link. Whether that link is public or per-recipient tokenized
   is an OPEN stakeholder question; the mock assumes a plain deep link.
   Section content reuses the v A library (VIDEOS/FAQS) by id — one source. */
import { VIDEOS, FAQS } from './guide.js'

/* Same crop discipline as guide.js thumbs: change only the photo id. */
const unsplash = (id) => `https://images.unsplash.com/${id}?w=960&h=540&fit=crop&q=80`

export const GUIDE_ITEMS = [
  {
    id: 'remote-consult',
    type: 'blog',
    title: 'დისტანციური კონსულტაცია — ექიმი ერთი ზარის მოშორებით',
    excerpt:
      'ყველა კითხვა ექიმთან ვიზიტს არ საჭიროებს. როდის და როგორ გამოიყენოთ დისტანციური კონსულტაცია MyGPI-დან.',
    published: { iso: '2026-08-10', label: '10 აგვ' },
    img: unsplash('photo-1609220136736-443140cffec6'),
    tint: 'indigo',
    body: [
      {
        p: 'ყველა შეკითხვა კლინიკაში მისვლას არ საჭიროებს. დისტანციური კონსულტაციით ექიმს ესაუბრებით ვიდეოზარით — სახლიდან, ოფისიდან ან მოგზაურობიდან.',
      },
      { h: 'როდის გამოგადგებათ' },
      {
        list: [
          'როცა გჭირდებათ რეცეპტის განახლება ან ანალიზის პასუხის განხილვა',
          'როცა სიმპტომი მსუბუქია და გინდათ გაიგოთ, საჭიროა თუ არა ვიზიტი',
          'როცა ბავშვთან ერთად კლინიკაში მისვლა გართულებულია',
        ],
      },
      { h: 'როგორ დაჯავშნოთ' },
      {
        list: [
          'გახსენით MyGPI და აირჩიეთ „სპეციალისტის კონსულტაცია"',
          'მონიშნეთ „დისტანციური" და აირჩიეთ დრო',
          'ზარის ბმული SMS-ით მოგივათ ვიზიტამდე 10 წუთით ადრე',
        ],
      },
      {
        p: 'კონსულტაცია თქვენი პაკეტის პირობებით იფარება — დეტალები „ჩემი პაკეტის" განყოფილებაშია. კითხვების შემთხვევაში დაგვირეკეთ: 2 505 111 (24/7).',
      },
    ],
    engagement: null,
    history: [],
  },
  {
    id: 'travel-summer',
    type: 'blog',
    title: 'სამოგზაურო დაზღვევა — რა გავითვალისწინოთ გამგზავრებამდე',
    excerpt:
      'სამი მარტივი ნაბიჯი, რომ თქვენი სამოგზაურო დაზღვევა ნამდვილად მუშაობდეს იქ, სადაც მიემგზავრებით.',
    published: { iso: '2026-07-14', label: '14 ივლ' },
    img: unsplash('photo-1436491865332-7a61a109cc05'),
    tint: 'sun',
    body: [
      {
        p: 'ზაფხულის სეზონზე ყველაზე ხშირი შეკითხვა სამოგზაურო დაზღვევას ეხება: მოქმედებს თუ არა ჩემი პოლისი საზღვარგარეთ? მოქმედებს — თუ გამგზავრებამდე რამდენიმე წუთს დაუთმობთ.',
      },
      { h: 'გამგზავრებამდე — სამი ნაბიჯი' },
      {
        list: [
          'MyGPI-ის „სამოგზაურო" განყოფილებაში მიუთითეთ მოგზაურობის თარიღები',
          'გადმოწერეთ პოლისის PDF — ზოგი ქვეყანა საზღვარზე ითხოვს',
          'შეინახეთ ცხელი ხაზი ტელეფონში: +995 32 2 505 111',
        ],
      },
      { h: 'მოგზაურობისას' },
      {
        p: 'სამედიცინო საჭიროების შემთხვევაში ჯერ დაგვიკავშირდით — ოპერატორი მიგიყვანთ ქსელის კლინიკამდე და ადგილზევე აგიხსნით, რას ფარავს პაკეტი. ასე ხარჯს წინასწარ იცნობთ და ანაზღაურების პროცესიც მარტივდება.',
      },
    ],
    engagement: { sent: 248, openRate: 44, rating: { sum: 731, count: 172 } },
    history: [{ date: '21 ივლ', sentAt: '2026-07-21', to: 'CNT-2025-0128', count: 248, channel: 'email' }],
  },
  {
    id: 'onboarding',
    type: 'bundle',
    title: 'ონბორდინგის გზამკვლევი',
    excerpt:
      'ყველაფერი, რაც ახალ დაზღვეულს პირველი დღიდან სჭირდება — ვიდეოები, ხშირი კითხვები და ინსტრუქცია ერთ ბმულზე.',
    published: { iso: '2026-06-28', label: '28 ივნ' },
    img: unsplash('photo-1521737711867-e3b97375f902'),
    tint: 'lavender',
    sections: {
      videos: ['v1', 'v6'],
      faqs: ['f1', 'f3', 'f5', 'f7'],
      instruction: {
        title: 'პირველი ნაბიჯები',
        steps: [
          { t: 'ჩამოტვირთეთ MyGPI აპი', d: 'ხელმისაწვდომია App Store-სა და Google Play-ში — შესვლა პირადი ნომრით.' },
          { t: 'იპოვეთ ციფრული ბარათი', d: 'მთავარ გვერდზე, „ჩემი პოლისი" ბარათზე — ნომერი და ბარათი ერთ ადგილას.' },
          { t: 'გაეცანით პაკეტს', d: '„ჩემი პაკეტი" აჩვენებს დაფარვებს, ლიმიტებს და ლოდინის პერიოდებს.' },
          { t: 'აირჩიეთ პირადი ექიმი', d: 'ვიდეო-ინსტრუქცია ამ გვერდზეა — არჩევა 2 წუთს იკავებს.' },
          { t: 'შეინახეთ ცხელი ხაზი', d: '2 505 111 — 24/7, აპიდან პირდაპირ დარეკვაც შესაძლებელია.' },
        ],
      },
    },
    engagement: { sent: 252, openRate: 61, rating: { sum: 1043, count: 227 } },
    history: [
      { date: '28 ივლ', sentAt: '2026-07-28', to: 'ბოლოს დამატებულები', count: 5, channel: 'email' },
      { date: '02 ივლ', sentAt: '2026-07-02', to: 'ყველა დაზღვეული', count: 252, channel: 'email' },
    ],
  },
]

export const itemById = (id) => GUIDE_ITEMS.find((x) => x.id === id) || null

export const bundleVideos = (item) => item.sections.videos.map((id) => VIDEOS.find((v) => v.id === id)).filter(Boolean)
export const bundleFaqs = (item) => item.sections.faqs.map((id) => FAQS.find((f) => f.id === id)).filter(Boolean)

/* Flattened send log across items — seeds the feed screen's session history
   (drawer dup-warning matches on material title + group label, same as v A). */
export const allSends = () =>
  GUIDE_ITEMS.flatMap((item) =>
    item.history.map((h, i) => ({ id: `${item.id}-h${i}`, material: item.title, type: item.type, ...h }))
  ).sort((a, b) => String(b.sentAt).localeCompare(String(a.sentAt)))

/* ---- Employee ratings (2026-08-17) ------------------------------------------
   The external page's 5-star vote. Stored in localStorage, NOT sessionStorage,
   on purpose: „ნახვა როგორც თანამშრომელმა" opens the employee page in a NEW
   TAB, so the demo loop (vote as an employee → see the admin rail move) only
   closes if both tabs share the store. `myVote` also makes the vote
   idempotent — a rated page never asks again.
   Production: this is a server-side aggregate; the store here just makes the
   loop demonstrable. */
const RATINGS_KEY = 'gpi.guideRatings'

function readVotes() {
  try {
    return JSON.parse(localStorage.getItem(RATINGS_KEY)) || {}
  } catch {
    return {}
  }
}

export function myVote(itemId) {
  return readVotes()[itemId]?.mine || 0
}

export function addVote(itemId, stars) {
  const all = readVotes()
  const cur = all[itemId] || { sum: 0, count: 0, mine: 0 }
  /* One vote per person: re-rating replaces the previous one. */
  all[itemId] = { sum: cur.sum - cur.mine + stars, count: cur.mine ? cur.count : cur.count + 1, mine: stars }
  try {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(all))
  } catch {
    /* storage unavailable — the vote simply isn't remembered */
  }
}

export function clearVotes() {
  try {
    localStorage.removeItem(RATINGS_KEY)
  } catch {
    /* nothing to clear */
  }
}

/* Base (seeded) numbers + any votes cast in this prototype. */
export function ratingFor(item) {
  const base = item.engagement?.rating || { sum: 0, count: 0 }
  const local = readVotes()[item.id] || { sum: 0, count: 0 }
  const sum = base.sum + local.sum
  const count = base.count + local.count
  return count ? { avg: (sum / count).toFixed(1), count } : null
}

/* Demo-only A/B switch (DemoBar idiom): session-scoped, never product UI. */
const VERSION_KEY = 'gpi.guideVersion'
export function guideVersion() {
  try {
    return sessionStorage.getItem(VERSION_KEY) === 'B' ? 'B' : 'A'
  } catch {
    return 'A'
  }
}
export function setGuideVersion(v) {
  try {
    sessionStorage.setItem(VERSION_KEY, v)
  } catch {
    /* storage unavailable (file:// edge) — switch still works in-memory */
  }
}
