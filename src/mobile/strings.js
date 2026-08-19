/* MyGPI mobile app copy. Chrome deliberately mirrors the LIVE app's mixed language
   (English chrome, Georgian content) — do not "fix" to all-Georgian without the user. */

export const M = {
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
    renew: 'განახლება',
    request: 'მიმართვის მოთხოვნა +',
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
     GONE and the card now holds TWO bookings — clinic visit + phone consultation.
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
    /* ⚠ TERMINOLOGY: the booking flow's own radio calls the second option
       „დისტანციური კონსულტაცია" (value `remote`). The stakeholder wording is kept
       here; one of the two has to move before dev — and item #10 needs to know
       whether remote covers phone AND video or phone only. */
    bookClinic: 'ჩაეწერე ექიმთან კლინიკაში',
    bookPhone: 'ჩაეწერე სატელეფონო კონსულტაციაზე',
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
  hist2: {
    sections: { meds: 'მედიკამენტები', studies: 'კვლევები', referrals: 'მიმართვები' },
    groups: 'დანიშნულებების ჯგუფები',
    filterPeriod: 'პერიოდი',
    filterCat: 'კატეგორია',
    filterYear: 'წელი',
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
       guessable from a glyph. Wording follows #3's CTA („სატელეფონო"), which is still
       pending the flow's own „დისტანციური" — change both together. */
    visitTypes: { visit: 'ვიზიტი კლინიკაში', phone: 'სატელეფონო კონსულტაცია', online: 'ონლაინ კონსულტაცია' },
    downloadPdf: 'ჩანაწერი PDF',
    uploadResult: 'შედეგის ატვირთვა',
  },
  /* A5 — history transfer (F-03: doctor list + confirmation overlay). */
  transfer: {
    title: 'ისტორიის გადატანა',
    sub: 'აირჩიე ექიმი კურაციოს ქსელიდან',
    online: 'Online',
    tomorrow: 'ხვალ',
    includes: 'გადაიტანება: ვიზიტების ისტორია, ანალიზები, მიმართვები, მედიკამენტები',
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
    tomorrow: 'ხვალ',
    queueOpen: 'რიგი ღიაა',
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
    live: 'ცოცხალი',
    /* map CTA removed 2026-08-18 (review): maps are a dev pain point, deferred. */
    /* #5 (2026-08-18) — arrival check-in. */
    arriveTitle: 'კლინიკაში ხარ?',
    arriveHint: 'დააჭირე მისვლისთანავე — რიგი დაგიდასტურდება და ექიმი გაიგებს, რომ ადგილზე ხარ',
    arriveCta: 'მე მოვედი',
    arriveGeo: 'კლინიკასთან მიახლოებისას ავტომატურ შეხსენებასაც მიიღებ',
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
}
