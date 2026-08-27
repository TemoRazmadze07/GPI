/* MyGPI mobile app copy — GEORGIAN (ka), the PRIMARY delivery language and the
   default. Chrome deliberately mirrors the LIVE app's mixed language (English chrome,
   Georgian content) — do not "fix" to all-Georgian without the user.

   BILINGUAL SINCE 2026-08-27. English lives in ./strings.en.js as a mirror of this
   table; the active one is resolved at the bottom of this file and exported as `M`,
   so every screen keeps its existing `import { M } from './strings.js'`. Georgian is
   untouched by that change and stays what a bare link renders.
   ⚠ Add/rename/remove ANYTHING here and mirror it in strings.en.js in the same place,
   with the same value TYPE — screens address keys by path, so a missing key is a
   crash, not a blank string. */

export const ka = {
  hello: 'Hello',
  userName: 'Anna',
  points: '120 pts',
  tabs: { auto: 'Auto insurance', health: 'Health insurance' },
  /* V2 (three-tab nav): full labels can't fit 390px three-up — short forms only. */
  tabsV2: { auto: 'Auto', health: 'Health', curatio: 'კურაციო' },
  healthSection: 'HEALTH INSURANCE',
  newAppointment: 'NEW APPOINTMENT',
  curatio: {
    title: 'ჩემი კურაციო',
    full: 'სრულად',
    doctor: 'ექიმი',
    history: 'ისტორია',
    reminders: 'შეხსენებები',
    prevention: 'პრევენცია',
  },
  bookings: {
    title: 'ჯავშნები',
    all: 'ყველა',
    today: 'დღეს',
    /* Neither „დღეს" nor „ხვალ" is true for a visit-day booking seen on an ordinary
       day — the first said the opposite of the lock note under it, the second named
       the wrong date. This says exactly what it is (audit 2026-08-18). */
    onVisitDay: 'ვიზიტის დღეს',
    clinic: 'კლინიკა',
    active: 'აქტიური',
    reschedule: 'გადაჯავშნა',
    cancel: 'გაუქმება',
    next: 'შემდეგი ჯავშანი',
    queueYour: 'თქვენი რიგი',
    queueWait: 'მოლოდინი',
    queueAhead: 'წინ',
    queuePatients: 'პაც.',
    queueLive: 'განახლდება რეალურ დროში',
    ticket: 'ბილეთის ნახვა',
    minutes: 'წთ',
  },
  referrals: {
    title: 'მიმართვები',
    all: 'ყველა',
    insured: 'დაზღვეული',
    number: 'მიმართვა:',
    inReview: 'განხილვაში',
    chronic: 'ქრონიკული',
    expiresIn: (d) => `ვადა იწურება ${d} დღეში`,
    request: 'მიმართვის მოთხოვნა +',
  },
  /* Split out of the მიმართვები card 2026-08-18 (user chose option B): a chronic
     prescription is not a referral, and stacking the two objects in one card is what
     made the row cramped. Wording follows #11 — renewal is a VISIT, not a one-tap
     request — so the same medication no longer promises two different mechanics on
     two screens. */
  chronicRx: {
    title: 'ქრონიკული რეცეპტი',
    state: 'ვადა იწურება',
    meta: (d) => `ქრონიკული · ${d} დღეში ამოიწურება`,
    note: 'განახლებისთვის საჭიროა ვიზიტი პირად ექიმთან',
    cta: 'ჩაეწერე განახლებისთვის',
  },
  nav: ['main', 'policies', 'purchase', 'Payments', 'more'],
  demo: {
    normal: 'ჩვეულებრივი დღე',
    visit: 'ვიზიტის დღე',
    docOn: 'ექიმი ჰყავს',
    docOff: 'ექიმი არ ჰყავს',
    insOn: 'დაზღვეული',
    insOff: 'დაუზღვეველი',
  },
  /* V2 — Curatio tab dashboard + OTP gate for history-class data. */
  dash: {
    ticketLink: 'ბილეთი',
    protectedTitle: 'დაცული ინფორმაცია',
    protectedHint: 'სანახავად საჭიროა ერთჯერადი კოდი',
    unlockedNote: 'განბლოკილია ამ სესიისთვის',
    relock: 'ჩაკეტვა',
    lockedHistoryHint: 'ანალიზები · დანიშნულებები · ვიზიტები · დოკუმენტები',
    transferTitle: 'ისტორიის გადატანა · ექიმის დეტალები',
    lockedTransferHint: 'სხვა კლინიკიდან გადმოტანა · ექიმის სრული პროფილი',
  },
  /* V2 stakeholder-parity dashboard (mygpi_v3 source of truth). */
  dash2: {
    personAria: 'დაზღვეული პირი',
    close: 'დახურვა',
    todayVisit: 'დღეს ვიზიტი',
    hero: 'დღევანდელი ვიზიტი',
    heroTime: 'ჩაწერის დრო',
    heroLive: 'რიგი მიმდინარეობს',
    heroCta: 'ბილეთის ნახვა',
    queueTitle: 'გაიაქტიურე ციფრული რიგის ბილეთი',
    queueHint: 'აირჩიე ჯავშნებიდან',
    docInfo: 'სრული ინფო',
    historyTitle: 'ჩემი სამედიცინო ისტორია',
    historyHint: 'ანალიზები და კვლევები · დანიშნულებები · ვიზიტები და კონსულტაციები',
    preventionHint: 'ვაქცინაცია, სქრინინგი და სახ. პროგრამები',
    preventionBadge: '2 შეხს.',
    /* #1 (2026-08-18) — doctor card, no-doctor variant. */
    docEmptyTitle: 'პირადი ექიმი ჯერ არ გყავს არჩეული',
    docEmptyHint: 'აირჩიე ოჯახის ექიმი კურაციოს ქსელიდან',
    docEmptyCta: 'აირჩიე პირადი ექიმი',
    noNextVisit: 'ვიზიტი ჯერ არ არის დანიშნული',
    /* #3 (2026-08-18) — the dash doctor card reuses A4's M.doc.bookClinic /
       bookPhone verbatim: same action, same words, and both fit the 297px card. */
  },
  /* A4 — personal doctor detail (F-03). #3 (2026-08-18, stakeholder): WhatsApp is
     GONE and the card now holds TWO bookings — clinic visit + remote consultation.
     In-app chat + „დატოვე შეტყობინება" stay out (messaging = MVP2). Both CTAs
     deep-link into the mobile booking flow with the doctor preselected and its
     „ვიზიტის ტიპი" radio prefilled (inclinic | remote); dead ends here until that
     flow exists in the prototype. */
  doc: {
    title: 'ჩემი პირადი ექიმი',
    onlineNow: 'Online · ხელმისაწვდომია ახლა' /* MVP2 — gated by ONLINE_STATUS_ENABLED (#4) */,
    basicInfo: 'ძირითადი ინფორმაცია',
    clinic: 'კლინიკა',
    cabinet: 'კაბინეტი / სართული',
    workDays: 'სამუშაო დღეები',
    workHours: 'სამუშაო საათები',
    nextVisit: 'შემდეგი ვიზიტი',
    /* TERMINOLOGY resolved 2026-08-20 (user): this label is now VERBATIM the booking
       flow's own radio option — „დისტანციური კონსულტაცია" (`remote`, EN "Online
       consultation") — the service named, not an instruction. Note the pair is
       deliberately asymmetric: bookClinic stayed a verb phrase at the user's scoping.
       Channel-neutral on purpose: the flow's hint calls it „ონლაინ ზარი" and the B2B
       guide describes it as a video call, so promising a PHONE here named a channel the
       flow cannot actually book. hist2.visitTypes still says „სატელეფონო" — deliberately
       left alone (scope was the buttons); see the note there. */
    bookClinic: 'ჩაეწერე ექიმთან კლინიკაში',
    bookPhone: 'დისტანციური კონსულტაცია',
    transferTitle: 'სამედიცინო ისტორიის გადატანა',
    transferBody: 'გადაიტანე შენი სამედიცინო ისტორია სხვა ექიმთან კურაციოს ქსელში',
    transferCta: 'ექიმის არჩევა და გადატანა',
  },
  /* #1 (2026-08-18) — personal-doctor selection: booking-flow page-1 list
     reused in select mode + confirm sheet with the history-access consent. */
  docsel: {
    title: 'აირჩიე პირადი ექიმი',
    sub: 'კურაციოს ქსელის ოჯახის ექიმები',
    searchPh: 'მოძებნე ექიმი სახელით',
    cityF: 'ქალაქი',
    clinicF: 'კლინიკა',
    empty: 'ექიმი ვერ მოიძებნა',
    emptyHint: 'შეცვალე ძებნა ან ფილტრები',
    exp: (y) => `${y} წლის გამოცდილება`,
    langs: 'ენები',
    clinicL: 'კლინიკა',
    hours: 'მიღების საათები',
    confirmTitle: 'პირადი ექიმის არჩევა',
    consent: 'ექიმი მიიღებს წვდომას შენს სამედიცინო ისტორიაზე კურაციოში',
    pick: 'აირჩიე პირადი ექიმად',
    cancel: 'გაუქმება',
    confirm: 'დადასტურება',
    successTitle: 'ექიმი არჩეულია',
    successBody: 'შენი პირადი ექიმია',
    bookFirst: 'ჩაეწერე პირველ ვიზიტზე',
    close: 'დახურვა',
  },
  /* A7 — prevention screen (stakeholder sc-prev parity, scope-filtered). */
  prev: {
    title: 'პრევენცია',
    vaccines: 'ვაქცინაცია',
    screenings: 'სქრინინგ კვლევები',
    screeningsLink: 'სახ. პროგ. ›',
    screeningsHint: 'სახელმწიფო პროგრამებისა და ასაკობრივი ნორმების შესაბამისი პრევენციული კვლევები',
    book: 'ჩაეწერე',
    done: 'შესრულებულია',
  },
  /* A6c — V2 history hub (menu page between dash and section pages). */
  histhub: {
    title: 'სამედიცინო ისტორია',
    /* claims only what the app does (the OTP gate) — see the note above hist2 */
    confid: 'სამედიცინო ისტორია დაცულია ერთჯერადი კოდით — წვდომა მხოლოდ ავტორიზაციის შემდეგაა შესაძლებელი',
    rows: {
      /* #7 (2026-08-18) — studies live here too, so the name says so.
         #8 — „ვიზიტები" became „ვიზიტები და კონსულტაციები": phone and online
         consultations file records here too (#10), and the pair now reads in the same
         „X და Y" shape as the analyses row. Chosen over „სამედიცინო ბარათი", which
         nests a near-identical name one level inside „სამედიცინო ისტორია".
         #13 — the დოკუმენტები row is GONE; uploads live in the two sections. */
      analyses: 'ანალიზები და კვლევები',
      prescriptions: 'დანიშნულებები',
      visits: 'ვიზიტები და კონსულტაციები',
    },
    metaAnalyses: (n, last) => `${n} ჩანაწერი · ბოლო ${last}`,
    metaPrescriptions: 'მედიკამენტები · კვლევები · მიმართვები',
    /* a member with nothing in a section: the row stays tappable (the empty state
       inside explains itself) — it just cannot claim a count or a last date */
    metaEmpty: 'ჩანაწერი არ არის',
    metaVisits: (n) => `${n} ჩანაწერი · 2025–2026`,
    expiry: (n) => `${n} ვადა`,
  },
  /* #7 (2026-08-18) — SourceTag labels. Label ALWAYS present: colour is
     reinforcement, never the signal (WCAG 1.4.1). `referral` is #9's variant. */
  src: {
    curatio: 'კურაციო',
    external: 'გარე',
    referral: 'რეფერალი',
  },
  /* #7 — in-context upload. Two steps: pick the file, then describe it. The
     category is preselected from whatever the section is filtered to, so the
     common case is a straight confirm. */
  upl: {
    /* User, 2026-08-18: „დოკუმენტის ატვირთვა" — and it is the more honest word:
       what lands here is not only a result (form 100, a referral, a discharge
       note). The sheet's own title matches the button that opened it. */
    entry: 'დოკუმენტის ატვირთვა',
    step: (n) => `${n} / 2`,
    pickTitle: 'დოკუმენტის ატვირთვა',
    pickHint: 'PDF, JPG, PNG · მაქს. 20MB',
    camera: 'გადაუღე ფოტო',
    gallery: 'აირჩიე გალერეიდან',
    file: 'აირჩიე ფაილი',
    metaTitle: 'დოკუმენტის დეტალები',
    name: 'სახელი',
    namePh: 'მაგ. ლიპიდური სპექტრი',
    clinic: 'კლინიკა',
    clinicPh: 'მაგ. BMSC',
    date: 'თარიღი',
    cat: 'კატეგორია',
    catPick: 'აირჩიე' /* the field is half-width — the long form ellipsized */,
    /* F-02's metadata list always said „name/clinic/date/TYPE" — until 2026-08-26 the
       type was only the ANALYSIS category, which is why every upload landed in
       analyses. Now type = which history section the document belongs to, and the
       record files there (user: „upload for all types of records and sections"). */
    kind: 'ტიპი',
    kinds: { analyses: 'ანალიზი / კვლევა', prescriptions: 'დანიშნულება / რეცეპტი', visits: 'ვიზიტის ჩანაწერი' },
    person: 'ვისთვის',
    consent: 'გავუზიაროთ პირად ექიმს?',
    consentOn: (doc) => `${doc} იხილავს ამ დოკუმენტს`,
    consentOff: 'დოკუმენტი მხოლოდ შენთვის იქნება ხილული',
    submit: 'ატვირთვა',
    cancel: 'გაუქმება',
    errName: 'შეავსე დოკუმენტის სახელი',
    errCat: 'აირჩიე კატეგორია',
    shared: 'ექიმს გაზიარებულია',
  },
  /* A6 — V2 history parity (F-02/F-03; charts OUT — PDF only). */
  /* Hub trust footnote (2026-08-26). Deliberately claims only what the APP does
     (the OTP gate) — nothing about sharing/visibility policy, which is a product/
     legal statement we have not been given (F-02 auto-shares uploads with Curatio
     doctors, so „only you can see this" would be FALSE). Re-check before dev. */
  hist2: {
    sections: { meds: 'მედიკამენტები', studies: 'კვლევები', referrals: 'მიმართვები' },
    groups: 'დანიშნულებების ჯგუფები',
    /* Empty states, 2026-08-27 — the person selector made them reachable: a member
       can genuinely own no records in a section. TWO messages, because the two
       causes ask for different things from the user: nothing exists (switch person,
       nothing to loosen) vs the filter cut everything (loosen the filter). One
       generic „ცარიელია" would leave them guessing which. */
    emptyPerson: 'ამ პირს ამ განყოფილებაში ჯერ არ აქვს ჩანაწერი',
    emptyFilter: 'არჩეულ ფილტრს ჩანაწერი არ შეესაბამება',
    filterPeriod: 'პერიოდი',
    filterCat: 'კატეგორია',
    filterYear: 'წელი',
    /* clinic-origin filter (2026-08-26 co-brand pass) — user's „inside/outside
       Curatio" ask. Labels mirror the SourceTag vocabulary — and since 2026-08-27
       „გარე" mirrors it EXACTLY. It was „გარე კლინიკები", which was the odd one out:
       every record card's origin chip has always said „გარე" (M.src.external), so the
       filter naming the same thing in two words contradicted its own stated rule.
       It also cost ~50px in a row that now shares its full width across three pills —
       with the long form, picking it truncated all three labels („1 წე…" included).
       One word fixes both. The sheet reads fine on one word too: next to „ყველა" and
       „კურაციო", „გარე" is unambiguous. Don't lengthen it back without re-measuring
       the row in GEORGIAN with „ინსტრუმენტული" also selected — that is the worst case. */
    filterClinic: 'კლინიკა',
    clinics: { all: 'ყველა', curatio: 'კურაციო', external: 'გარე' },
    medStates: { active: 'აქტიური', expiring: 'ვადა იწურება', chronic: 'ქრონიკული' },
    /* #11 (2026-08-18, stakeholder): renewal is no longer a REQUEST the patient
       files — it is a VISIT they book with their personal doctor. The note says so
       plainly rather than letting the CTA imply a one-tap refill. */
    renew: 'ჩაეწერე განახლებისთვის',
    renewNote: 'რეცეპტის განახლებისთვის საჭიროა ვიზიტი პირად ექიმთან',
    /* User, 2026-08-18: „what if patient do not need the medicament anymore?" — the
       row used to assume renewal was the only answer. This is the way out, and it is
       deliberately about the APP's prompts, not about clinical truth: it silences the
       renewal CTA + expiry reminders, says so, and is reversible. It does NOT claim
       the doctor was told — that is an open product question. */
    dismiss: 'აღარ მჭირდება',
    dismissed: 'აღარ მჭირდება',
    dismissedNote: 'განახლების შეხსენება გამორთულია',
    undo: 'დაბრუნება',
    book: 'ჩაეწერე ექიმთან',
    refStatuses: { booked: 'შეკვეთილია', waiting: 'მოლოდინში' },
    years: ['2026', '2025', '2024'],
    yearRange: 'თარიღი',
    visitStatuses: { done: 'დასრულებული' },
    /* #10 — icon AND label, never the icon alone: three encounter kinds are not
       guessable from a glyph. ⚠ OUT OF SYNC since 2026-08-20: the doctor CTA moved to
       „დისტანციური კონსულტაცია"; these RECORD labels were deliberately left as they are
       (the user scoped that change to the buttons). Still unresolved for dev: the booking
       flow offers ONE remote type while history files TWO (phone + online). */
    visitTypes: { visit: 'ვიზიტი კლინიკაში', phone: 'სატელეფონო კონსულტაცია', online: 'ონლაინ კონსულტაცია' },
    /* uploaded-documents cluster shown in prescriptions/visits (2026-08-26) */
    uploadedLbl: 'ატვირთული დოკუმენტები',
    /* per-record attach (2026-08-26): „…ამ ჩანაწერს" is what separates it from the
       section-level entry above the list — this document belongs to THIS record. */
    /* Short on purpose: as a BUTTON it shares the actions row (user, 2026-08-26 —
       „attach file like download button"). Measured: at 390 the row is 297 wide and
       „ფაილის მიმაგრება" (167.4) pairs with NOTHING — every card fell to one button
       per line. „მიმაგრება" pairs with the PDF action and the paperclip carries the
       rest of the meaning. Don't lengthen it without re-measuring the row. */
    attach: 'მიმაგრება',
    attached: (n) => `მიმაგრებული დოკუმენტი · ${n}`,
    uplPdf: 'დოკუმენტი PDF',
    downloadPdf: 'ჩანაწერი PDF',
    /* UNUSED since 2026-08-26 — the visit card's upload button was removed as a
       duplicate of attach. Kept as the wording of record if that action ever returns. */
    uploadResult: 'შედეგის ატვირთვა',
    /* record-card actions, per artifact (2026-08-26): a visit downloads its RECORD,
       an analysis its RESULT, a prescription-section entry its ORDER. */
    resultPdf: 'შედეგი PDF',
    rxPdf: 'დანიშნულება PDF',
  },
  /* A5 — history transfer (F-03: doctor list + confirmation overlay). */
  transfer: {
    title: 'ისტორიის გადატანა',
    sub: 'აირჩიე ექიმი კურაციოს ქსელიდან',
    online: 'Online',
    tomorrow: 'ხვალ',
    /* #8 rename reached this sibling screen too (audit 2026-08-18). */
    includes: 'გადაიტანება: ვიზიტები და კონსულტაციები, ანალიზები და კვლევები, დანიშნულებები',
    cancel: 'გაუქმება',
    confirm: 'დაადასტურე გადატანა',
    successTitle: 'გადატანა დადასტურდა',
    successBody: 'სამედიცინო ისტორია გადაეცა:',
    close: 'დახურვა',
  },
  /* A3 — digital queue-ticket activation (F-01). */
  qpick: {
    title: 'ციფრული ბილეთის გააქტიურება',
    today: 'დღეს',
    /* Neither „დღეს" nor „ხვალ" is true for a visit-day booking seen on an ordinary
       day — the first said the opposite of the lock note under it, the second named
       the wrong date. This says exactly what it is (audit 2026-08-18). */
    onVisitDay: 'ვიზიტის დღეს',
    tomorrow: 'ხვალ',
    /* Matches `ticket.live` (2026-08-20): the queue-picker badge and the e-ticket's
       status badge name the same live queue, so they use the same word. */
    queueOpen: 'მიმდინარე',
    activate: 'გაიაქტიურე ბილეთი',
    lockedTomorrow: 'ბილეთი ხელმისაწვდომი იქნება ხვალ 09:00-ზე',
    lockedFuture: 'ბილეთი ხელმისაწვდომი იქნება ვიზიტის დღეს 09:00-ზე',
    empty: 'ახლო ჯავშნები არ არის',
    emptyHint: 'ბილეთის აღება შესაძლებელია ჯავშნის დღეს',
  },
  otp: {
    title: 'დაცული ინფორმაცია',
    body: 'სამედიცინო ჩანაწერების სანახავად შეიყვანე ერთჯერადი კოდი — გამოგზავნილია SMS-ით ნომერზე ***23',
    confirm: 'დადასტურება',
    resendIn: (s) => `ხელახლა გაგზავნა 0:${String(s).padStart(2, '0')}`,
    resend: 'ხელახლა გაგზავნა',
    close: 'დახურვა',
    demoNote: 'დემო: ნებისმიერი 4 ციფრი გამოდგება',
  },
  ticket: {
    title: 'ელექტრონული რიგი',
    yourTicket: 'თქვენი ბილეთი',
    wait: 'მოლოდინი',
    ahead: 'წინ',
    status: 'სტატუსი',
    live: 'მიმდინარე',
    /* map CTA removed 2026-08-18 (review): maps are a dev pain point, deferred. */
    /* #5 (2026-08-18) — arrival check-in. */
    arriveTitle: 'კლინიკაში ხარ?',
    arriveHint: 'დააჭირე მისვლისთანავე — რიგი დაგიდასტურდება და ექიმი გაიგებს, რომ ადგილზე ხარ',
    arriveCta: 'მე მოვედი',
    arrivedTitle: 'მოსვლა დადასტურდა',
    arrivedAt: (t) => `დადასტურდა ${t}`,
    arrivedBadge: 'რიგში ხარ',
    arrivedNext: (cab) => `დაელოდე გამოძახებას — ${cab}`,
  },
  /* #12 (2026-08-18) — „მეტი" menu. Only the Curatio row is real; the rest are
     stand-ins so it is read in context (the production menu isn't ours to design). */
  more: {
    title: 'მეტი',
    rows: {
      curatio: 'ჩემი კურაციო',
      profile: 'პროფილი',
      notifications: 'შეტყობინებები',
      payments: 'გადახდები',
      help: 'დახმარება',
      settings: 'პარამეტრები',
    },
    hints: {
      curatio: 'პირადი ექიმი · სამედიცინო ისტორია · რიგის ბილეთი',
    },
  },
  /* #14 (2026-08-18) — uninsured mode. ⚠ PLACEHOLDER COPY: the cover list is shaped
     from the MVP1 spec, not confirmed by the business, and it deliberately says
     nothing about price or self-pay — both are open questions. */
  ins: {
    bannerTitle: 'GPI ჯანმრთელობის დაზღვევა არ გაქვს',
    bannerBody: 'შენი სამედიცინო ჩანაწერები ღიაა · ჩაწერა და კონსულტაციები — დაზღვევით',
    sheetTitle: 'ეს სერვისი დაზღვევით ხელმისაწვდომია',
    sheetBody: 'GPI-ს ჯანმრთელობის დაზღვევა ფარავს კურაციოს ქსელის სერვისებს. შენი სამედიცინო ისტორია დაზღვევის გარეშეც შენთანაა.',
    covers: [
      'ექიმთან ჩაწერა კურაციოს ქსელში',
      'სატელეფონო კონსულტაცია პირად ექიმთან',
      'რეცეპტის განახლება ვიზიტით',
      'პრევენციული სქრინინგები და ვაქცინაცია',
    ],
    cta: 'ნახე პაკეტები',
    later: 'მოგვიანებით',
  },
  hub: {
    title: 'ჩემი კურაციო',
    allPersons: 'ყველა',
    todayStrip: (spec, time, num) => `${spec} · ${time} · რიგი ${num}`,
    doctorLabel: 'ჩემი პირადი ექიმი',
    online: 'Online',
    nextVisit: 'შემდეგი ვიზიტი:',
    book: 'ჯავშანი',
    details: 'დეტალები',
    historyTitle: 'სამედიცინო ისტორია',
    historyCounts: (c) => `ანალიზები ${c.analyses} · დანიშნ. ${c.prescriptions} · ვიზიტები ${c.visits} · დოკ. ${c.docs}`,
    remindersTitle: 'შეხსენებები',
    manage: 'მართვა',
    preventionTitle: 'პრევენცია',
    soon: 'მალე: ონლაინ კონსულტაცია · ექიმთან ჩატი',
  },
  history: {
    title: 'სამედიცინო ისტორია',
    tabs: { analyses: 'ანალიზები', prescriptions: 'დანიშნ.', visits: 'ვიზიტები', docs: 'დოკ.' },
    periods: { m3: '3 თვე', m6: '6 თვე', y1: '1 წელი', range: 'თარიღი' },
    statuses: { norm: 'ნორმა', warn: 'ყურადღება', crit: 'კრიტიკული', uploaded: 'ატვირთული' },
    upload: 'ატვირთე სხვა კლინიკის დოკუმენტი',
    download: 'ჩამოტვირთვა',
  },
  /* Screen-reader-only labels. Extracted from the JSX 2026-08-27 when English was
     added: these were hard-coded Georgian aria-labels scattered across ten screens —
     invisible on screen, and therefore the easiest strings in the module to leave
     untranslated by accident. Anything a screen reader speaks belongs in here. */
  a11y: {
    back: 'უკან',
    patient: 'პაციენტი',
    period: 'პერიოდი',
    digit: (n) => `ციფრი ${n}`,
    language: 'ენა',
  },
}

/* ── LOCALE RESOLUTION ────────────────────────────────────────────────────────
   The choice itself is resolved ONCE, app-wide, in ../i18n/index.js (`?lang=en` in
   the page query → `lang=` inside the hash route → localStorage → 'ka'). This module
   only picks a table with it, so the mobile app, the desktop My-Cabinet and the
   student flow all obey ONE language switch and one stored preference.
   Load-time, like every other prototype flag (?study, ?v=1, ?day=visit): switching
   language reloads the page, which is what i18n's setLang() does. */
import { lang } from '../i18n/index.js'
import { en } from './strings.en.js'

export const M = lang === 'en' ? en : ka
