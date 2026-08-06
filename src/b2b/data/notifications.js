/* B2B notification center — seed data (concept locked in chat, 2026-08-06).
   Every notification is the return channel of an async flow the portal already
   has (requests → back-office ≤24h, invoices, contract renewals, claims).
   `target` = deep-link hash; null = deliberately inert (system notices, and
   claims until that section is built — an honest dead row beats a dead end).
   `chip` marks urgency (action = must act, renewal = window opening) and is
   independent of read state. Times are static labels — prototype only. */

export const NOTIF_CATEGORIES = ['requests', 'finances', 'contracts', 'claims', 'other']

export const CATEGORY_ICON = {
  requests: 'arrow-right-left',
  finances: 'credit-card',
  contracts: 'file-text',
  claims: 'shield-check',
  other: 'info',
}

export const NOTIFICATIONS = [
  {
    id: 'n1',
    category: 'claims',
    title: 'საჭიროა თქვენი დადასტურება — ზარალი №CLM-2418',
    detail: 'გიორგი მაისურაძე',
    time: 'დღეს, 09:40',
    unread: true,
    chip: 'action',
    target: null,
  },
  {
    id: 'n2',
    category: 'finances',
    title: 'ინვოისი INV-2026-071 ვადაგადაცილებულია — ₾4 120',
    detail: null,
    time: 'დღეს, 08:15',
    unread: true,
    chip: 'action',
    target: '#/b2b/invoices',
  },
  {
    id: 'n3',
    category: 'requests',
    title: 'მოთხოვნა №43512 შესრულდა',
    detail: '5 დაზღვეული დაემატა',
    time: 'დღეს, 08:02',
    unread: true,
    chip: null,
    target: '#/b2b/requests',
  },
  {
    id: 'n4',
    category: 'contracts',
    title: 'კონტრაქტი CNT-2025-0112 იწურება 30 დღეში',
    detail: 'ჯანმრთელობა',
    time: 'გუშინ, 14:05',
    unread: true,
    chip: 'renewal',
    target: '#/b2b/contracts',
  },
  {
    id: 'n5',
    category: 'requests',
    title: 'მოთხოვნა №43488 საჭიროებს შესწორებას',
    detail: '2 სტრიქონი',
    time: 'გუშინ, 11:20',
    unread: false,
    chip: 'action',
    target: '#/b2b/requests',
  },
  {
    id: 'n6',
    category: 'finances',
    title: 'ივლისის ამონაწერი მზადაა',
    detail: null,
    time: '1 აგვ, 10:12',
    unread: false,
    chip: null,
    target: '#/b2b/statement',
  },
  {
    id: 'n7',
    category: 'contracts',
    title: '5 ახალი პოლისი გააქტიურდა',
    detail: 'ჯანმრთელობა · მოთხოვნა №43512',
    time: '31 ივლ, 09:05',
    unread: false,
    chip: null,
    target: '#/b2b/policies/health',
  },
  {
    id: 'n8',
    category: 'other',
    icon: 'tag',
    title: 'ახალი შეთავაზება თქვენი კომპანიისთვის',
    detail: null,
    time: '28 ივლ, 16:30',
    unread: false,
    chip: null,
    target: '#/b2b/offers',
  },
  {
    id: 'n9',
    category: 'other',
    title: 'დაგეგმილი ტექნიკური სამუშაოები — 10 აგვ, 02:00–04:00',
    detail: null,
    time: '27 ივლ, 18:00',
    unread: false,
    chip: null,
    target: null,
  },
]
