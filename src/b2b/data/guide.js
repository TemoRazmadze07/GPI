/* Guide (გზამკვლევი) — employee-education hub mock data (concept locked in
   chat 2026-08-06). The library content mirrors the team prototype's topics
   (B2B_BRIEF.md flow #7); numbers are scaled to OUR mock company (252 health
   insured = 248 on CNT-2025-0128 + 4 on CNT-2026-0341), not the prototype's
   1,942. Card-level stats (helpfulness %) are GPI-GLOBAL across all corporate
   clients; the StatTiles are company-scoped — the global-vs-company data split
   is an open stakeholder question, so the screen is designed to work either way. */
import { eligibleContracts } from './addInsured.js'

/* Company-scoped engagement (MyGPI adoption among this company's insured). */
export const GUIDE_STATS = { active: 184, total: 252, pct: 73 }

/* Recipient groups the send flow offers (v1: groups only — individual picking
   is a deferred capability). `recent` = the people added by the last add-policy
   request; production would resolve this from the request history. */
export const RECIPIENTS = {
  all: 252,
  recent: 5,
  contracts: eligibleContracts,
}

/* Thumbnails: `img` renders as a cover photo, `tint` stays as the fallback
   surface underneath (so a card survives a blocked/slow image — and the share
   build if it ever goes offline). Photos are Unsplash placeholders chosen to
   match each topic; production swaps in real video stills. To change one, edit
   only the photo id in the URL — the `w/h/fit/crop/q` params keep every thumb
   the same crop + weight. */
const unsplash = (id) => `https://images.unsplash.com/${id}?w=640&h=360&fit=crop&q=80`

export const VIDEOS = [
  { id: 'v1', title: 'ექიმთან ჩაწერა MyGPI-ში', dur: '2:34', helpful: 95, tint: 'lavender', flag: 'top', img: unsplash('photo-1576091160399-112ba8d25d1d') },
  /* No visible English text and no specific currency on purpose — the first
     pick here was a US tax form, which distracts in a Georgian portal. */
  { id: 'v2', title: 'თანხის ანაზღაურების მოთხოვნა', dur: '3:12', helpful: 92, tint: 'pink', img: unsplash('photo-1563013544-824ae1b704d3') },
  { id: 'v3', title: 'საგარანტიო წერილის მოთხოვნა', dur: '1:45', helpful: 98, tint: 'mint', img: unsplash('photo-1450101499163-c8848c66ca85') },
  { id: 'v4', title: 'სპეციალისტის კონსულტაცია', dur: '2:58', helpful: 89, tint: 'sun', flag: 'new', img: unsplash('photo-1631217868264-e5b90bb7e133') },
  { id: 'v5', title: 'დისტანციური დადასტურება', dur: '4:22', helpful: 91, tint: 'indigo', img: unsplash('photo-1593642532842-98d0fd5ebc1a') },
  { id: 'v6', title: 'პირადი ექიმის არჩევა', dur: '2:10', helpful: 97, tint: 'slate', img: unsplash('photo-1622253692010-333f2da6031d') },
]

export const FAQS = [
  { id: 'f1', q: 'სად ვნახო ჩემი პოლისის ნომერი?', a: 'MyGPI აპის მთავარ გვერდზე, „ჩემი პოლისი" ბარათზე — ნომერი და დაზღვევის ბარათი ერთ ადგილას არის.' },
  { id: 'f2', q: 'როგორ შევარჩიო კლინიკა?', a: 'MyGPI-ში „კლინიკები" განყოფილება აჩვენებს ქსელის კლინიკებს მისამართით და თქვენი პაკეტის დაფარვით.' },
  { id: 'f3', q: 'როგორ შევიძინო მედიკამენტები დაზღვევით?', a: 'აფთიაქში წარადგინეთ დაზღვევის ბარათი (ფიზიკური ან ციფრული). დაფარვის პროცენტი პაკეტზეა დამოკიდებული.' },
  { id: 'f4', q: 'როგორ გავააქტიურო სამოგზაურო დაზღვევა?', a: 'მოგზაურობის დაწყებამდე MyGPI-ში „სამოგზაურო" განყოფილებაში მიუთითეთ მოგზაურობის თარიღები.' },
  { id: 'f5', q: 'როგორ დავუკავშირდე მხარდაჭერას?', a: 'ცხელი ხაზი 2 505 111 — 24/7. აპიდან პირდაპირ დარეკვა და ჩატიც შესაძლებელია.' },
  { id: 'f6', q: 'ოჯახის წევრის დამატება როგორ ხდება?', a: 'ოჯახის წევრს ამატებს თქვენი კომპანიის ადმინისტრატორი — მიმართეთ HR-ს. დამატება ხელშეკრულების პირობებით რეგულირდება.' },
  { id: 'f7', q: 'რა შედის ჩემს პაკეტში?', a: 'MyGPI-ში „ჩემი პაკეტი" განყოფილება აჩვენებს დაფარვებს, ლიმიტებს და ლოდინის პერიოდებს.' },
  { id: 'f8', q: 'ვიზიტის გაუქმება ან გადატანა სად შემიძლია?', a: 'MyGPI-ში „ჩემი ვიზიტები" განყოფილებიდან — გაუქმება და ახალი დროის არჩევა იქვეა.' },
]

export const HANDBOOKS = [
  { id: 'h1', title: 'პოლისის პირობების მოკლე გზამკვლევი', size: '1.2 MB' },
  { id: 'h2', title: 'MyGPI აპის სახელმძღვანელო', size: '3.4 MB' },
  { id: 'h3', title: 'ანაზღაურების პროცესი — ნაბიჯ-ნაბიჯ', size: '0.8 MB' },
  { id: 'h4', title: 'კლინიკების ქსელი 2026', size: '2.1 MB' },
]

/* The onboarding kit — one bundle covering an employee's first day. */
export const KIT = {
  items: [
    'მისასალმებელი წერილი',
    'პირადი დაზღვევის ბარათი (PDF + ციფრული)',
    'ვიდეო „MyGPI აპის გამოყენება" (1:45)',
    'ვიდეო „პირადი ექიმის არჩევა" (2:10)',
    'პოლისის პირობების მოკლე გზამკვლევი (PDF)',
    'FAQ — 20 ხშირად დასმული კითხვა',
    'ცხელი ხაზი და კონტაქტები',
  ],
  lastSent: { date: '28 ივლ', count: 5 },
}

/* Employee feedback needing eyes. Ownership of ANSWERING is an open stakeholder
   question (GPI service team vs the employer's HR) — until settled the card is
   STATUS-ONLY: no answer composer on the admin side. */
export const QUESTIONS = [
  { id: 'q1', name: 'გიორგი მაისურაძე', when: '2 დღის წინ', source: 'FAQ — მედიკამენტები', text: 'სად ვნახო, რომელ აფთიაქებში მოქმედებს ჩემი ბარათი?', status: 'pending' },
  { id: 'q2', name: 'ანა ქარიძე', when: '3 დღის წინ', source: 'ვიდეო — ანაზღაურება', text: 'დაზიანებული ბარათის შეცვლა როგორ მოვითხოვო?', status: 'pending' },
  { id: 'q3', name: 'ნინო ლომიძე', when: '4 დღის წინ', source: 'FAQ — კლინიკები', text: 'რეგიონებში რომელი კლინიკებია ქსელში ჩართული?', status: 'pending' },
  { id: 'q4', name: 'დავით ბერიძე', when: '6 დღის წინ', source: 'ვიდეო — ჩაწერა', text: 'ჯავშნის გაუქმება სად შემიძლია?', status: 'answered' },
]

/* Send log (absorbs the team prototype's separate "მოთხოვნილი SMS" nav item).
   `sentAt` (ISO) is the sort key; `date` is only the display label — sorting on
   the Georgian short label would order it alphabetically, not chronologically.
   A new send prepends a row (session-only, like the notification read state). */
export const SEND_HISTORY = [
  { id: 's1', sentAt: '2026-07-28', date: '28 ივლ', material: 'ახალი თანამშრომლის გზამკვლევი', type: 'kit', to: 'ბოლოს დამატებულები', count: 5, channel: 'email' },
  { id: 's2', sentAt: '2026-07-21', date: '21 ივლ', material: 'თანხის ანაზღაურების მოთხოვნა', type: 'video', to: 'CNT-2026-0341', count: 4, channel: 'sms' },
  { id: 's3', sentAt: '2026-07-02', date: '02 ივლ', material: 'ახალი თანამშრომლის გზამკვლევი', type: 'kit', to: 'ყველა დაზღვეული', count: 252, channel: 'email' },
  { id: 's4', sentAt: '2026-06-18', date: '18 ივნ', material: 'როგორ გავააქტიურო სამოგზაურო დაზღვევა?', type: 'faq', to: 'CNT-2025-0128', count: 248, channel: 'email' },
]
