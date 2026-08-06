import { ASSETS } from '../../lib/assets.js'

/* Companies the logged-in administrator can act for (concept locked in chat,
   2026-08-06). A corporate account may span several legal entities of one
   holding; the topbar chip switches between them. With a single entry the
   chip renders static (no dropdown affordance).

   `insured` doubles as the "which one is the big one" cue in the switcher
   row; the first company's 252 matches the mock org used across the portal
   (guide/statement numbers). NOTE (prototype): the mock data is NOT
   per-company — switching changes the chrome context only. */
export const COMPANIES = [
  {
    id: 'mk',
    name: 'შპს მაგალითი კომპანია',
    short: 'მაგალითი კომპანია',
    mark: 'MK',
    logo: ASSETS.clientLogo,
    taxId: '404404404',
    insured: 252,
  },
  {
    id: 'mf',
    name: 'შპს მაგალითი ფარმა',
    short: 'მაგალითი ფარმა',
    mark: null,
    logo: null,
    taxId: '405112233',
    insured: 61,
  },
  {
    id: 'mj',
    name: 'შპს მაგალითი ჯგუფი',
    short: 'მაგალითი ჯგუფი',
    mark: null,
    logo: null,
    taxId: '406998877',
    insured: 512,
  },
]

export const DEFAULT_COMPANY_ID = 'mk'
