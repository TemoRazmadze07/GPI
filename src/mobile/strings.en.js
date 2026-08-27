/* MyGPI mobile app copy — ENGLISH (en), the SECOND locale. Georgian (`ka` in
   ./strings.js) stays the primary and the default; nothing here changes it.

   STRUCTURE MUST STAY IN LOCKSTEP WITH `ka`. Screens read the resolved table as `M`
   and address keys by path, so a key that exists in `ka` but not here — or is renamed,
   or changes TYPE (string vs. function vs. array) — is a runtime crash, not a missing
   translation. When you touch strings.js, mirror it here in the same place, same order.

   Copy conventions (inherited from the desktop EN table, i18n/strings.en.js):
   - International English, sentence case everywhere — buttons, labels, chips, headers.
   - "Appointment" is the noun for the thing booked; "book" is the verb.
   - Dates render `D MMM` / `D MMM YYYY`; times are 24-hour.
   - Georgian person, clinic and street names are TRANSLITERATED, never anglicised
     (თამარ გიორგაძე → Tamar Giorgadze). Medical terms get real English terms.
   - No label may wrap at 390px. Where the literal English would overflow, the short
     form here is deliberate — don't "restore" the fuller wording without re-measuring.

   MIXED CHROME IS PRESERVED: `hello`, `userName`, `points`, `tabs`, `healthSection`,
   `newAppointment` and `nav` are already English in `ka` because the LIVE app ships
   them that way. They are identical here on purpose — this is not an oversight. */

export const en = {
  hello: 'Hello',
  userName: 'Anna',
  points: '120 pts',
  tabs: { auto: 'Auto insurance', health: 'Health insurance' },
  /* V2 (three-tab nav): full labels can't fit 390px three-up — short forms only. */
  tabsV2: { auto: 'Auto', health: 'Health', curatio: 'Curatio' },
  healthSection: 'HEALTH INSURANCE',
  newAppointment: 'NEW APPOINTMENT',
  curatio: {
    title: 'My Curatio',
    full: 'See all',
    doctor: 'Doctor',
    history: 'History',
    reminders: 'Reminders',
    prevention: 'Prevention',
  },
  bookings: {
    title: 'Appointments',
    all: 'All',
    today: 'Today',
    /* Mirrors ka: neither "today" nor "tomorrow" is true for a visit-day booking
       seen on an ordinary day. This names exactly what it is. */
    onVisitDay: 'On visit day',
    clinic: 'Clinic',
    active: 'Active',
    reschedule: 'Reschedule',
    cancel: 'Cancel',
    next: 'Next appointment',
    queueYour: 'Your number',
    queueWait: 'Wait',
    queueAhead: 'Ahead',
    /* Follows the count („3 people"), unlike queueAhead which is the stat's label.
       NOT "pts" — that already means points in the top bar. */
    queuePatients: 'people',
    queueLive: 'Updates in real time',
    ticket: 'View ticket',
    minutes: 'min',
  },
  referrals: {
    title: 'Referrals',
    all: 'All',
    insured: 'Insured person',
    number: 'Referral:',
    inReview: 'In review',
    chronic: 'Chronic',
    expiresIn: (d) => `Expires in ${d} days`,
    request: 'Request a referral +',
  },
  chronicRx: {
    title: 'Chronic prescription',
    state: 'Expiring',
    meta: (d) => `Chronic · expires in ${d} days`,
    note: 'Renewal requires a visit to your personal doctor',
    cta: 'Book a renewal visit',
  },
  nav: ['main', 'policies', 'purchase', 'Payments', 'more'],
  demo: {
    normal: 'Ordinary day',
    visit: 'Visit day',
    docOn: 'Has a doctor',
    docOff: 'No doctor',
    insOn: 'Insured',
    insOff: 'Uninsured',
  },
  /* V2 — Curatio tab dashboard + OTP gate for history-class data. */
  dash: {
    ticketLink: 'Ticket',
    protectedTitle: 'Protected information',
    protectedHint: 'A one-time code is required to view this',
    unlockedNote: 'Unlocked for this session',
    relock: 'Lock',
    lockedHistoryHint: 'Tests · Prescriptions · Visits · Documents',
    transferTitle: 'Transfer history · Doctor details',
    lockedTransferHint: 'Transfer from another clinic · Full doctor profile',
  },
  /* V2 stakeholder-parity dashboard (mygpi_v3 source of truth). */
  dash2: {
    personAria: 'Insured person',
    close: 'Close',
    todayVisit: 'Visit today',
    hero: "Today's visit",
    heroTime: 'Appointment time',
    heroLive: 'Queue in progress',
    heroCta: 'View ticket',
    queueTitle: 'Activate your digital queue ticket',
    queueHint: 'Pick from your appointments',
    docInfo: 'Full profile',
    historyTitle: 'My medical history',
    historyHint: 'Tests and studies · Prescriptions · Visits and consultations',
    preventionHint: 'Vaccination, screening and state programmes',
    preventionBadge: '2 rem.',
    /* #1 (2026-08-18) — doctor card, no-doctor variant. */
    docEmptyTitle: "You haven't chosen a personal doctor yet",
    docEmptyHint: 'Pick a family doctor from the Curatio network',
    docEmptyCta: 'Choose a personal doctor',
    noNextVisit: 'No visit scheduled yet',
  },
  /* A4 — personal doctor detail (F-03). */
  doc: {
    title: 'My personal doctor',
    onlineNow: 'Online · available now' /* MVP2 — gated by ONLINE_STATUS_ENABLED (#4) */,
    basicInfo: 'Basic information',
    clinic: 'Clinic',
    cabinet: 'Room / floor',
    workDays: 'Working days',
    workHours: 'Working hours',
    nextVisit: 'Next visit',
    /* TERMINOLOGY (2026-08-20): verbatim the booking flow's own radio option — the
       SERVICE named, not an instruction. The pair is deliberately asymmetric, exactly
       as in ka: bookClinic stayed a verb phrase. Channel-neutral on purpose — do not
       "restore" a phone-only wording; the flow books `remote`, not a phone slot. */
    bookClinic: 'Book a clinic visit',
    bookPhone: 'Online consultation',
    transferTitle: 'Transfer your medical history',
    transferBody: 'Move your medical history to another doctor in the Curatio network',
    transferCta: 'Choose a doctor and transfer',
  },
  /* #1 (2026-08-18) — personal-doctor selection. */
  docsel: {
    title: 'Choose your personal doctor',
    sub: 'Family doctors in the Curatio network',
    searchPh: 'Search for a doctor by name',
    cityF: 'City',
    clinicF: 'Clinic',
    empty: 'No doctor found',
    emptyHint: 'Change your search or filters',
    exp: (y) => `${y} years of experience`,
    langs: 'Languages',
    clinicL: 'Clinic',
    hours: 'Consulting hours',
    confirmTitle: 'Choose a personal doctor',
    consent: 'The doctor will get access to your medical history at Curatio',
    pick: 'Set as personal doctor',
    cancel: 'Cancel',
    confirm: 'Confirm',
    successTitle: 'Doctor selected',
    successBody: 'Your personal doctor is',
    bookFirst: 'Book your first visit',
    close: 'Close',
  },
  /* A7 — prevention screen. */
  prev: {
    title: 'Prevention',
    vaccines: 'Vaccination',
    screenings: 'Screening tests',
    screeningsLink: 'State prog. ›',
    screeningsHint:
      'Preventive tests matching state programmes and your age group',
    book: 'Book',
    done: 'Completed',
  },
  /* A6c — V2 history hub (menu page between dash and section pages). */
  histhub: {
    title: 'Medical history',
    /* claims only what the app does (the OTP gate) — see the note above hist2 */
    confid:
      'Your medical history is protected by a one-time code — it can only be opened after verification',
    rows: {
      analyses: 'Tests and studies',
      prescriptions: 'Prescriptions',
      visits: 'Visits and consultations',
    },
    metaAnalyses: (n, last) => `${n} records · last ${last}`,
    metaPrescriptions: 'Medications · Studies · Referrals',
    metaEmpty: 'No records',
    metaVisits: (n) => `${n} records · 2025–2026`,
    expiry: (n) => `${n} expiring`,
  },
  /* #7 — SourceTag labels. Label ALWAYS present: colour is reinforcement, never
     the signal (WCAG 1.4.1). */
  src: {
    curatio: 'Curatio',
    external: 'External',
    referral: 'Referral',
  },
  /* #7 — in-context upload, two steps. */
  upl: {
    entry: 'Upload a document',
    step: (n) => `${n} / 2`,
    pickTitle: 'Upload a document',
    pickHint: 'PDF, JPG, PNG · max 20MB',
    camera: 'Take a photo',
    gallery: 'Choose from gallery',
    file: 'Choose a file',
    metaTitle: 'Document details',
    name: 'Name',
    namePh: 'e.g. Lipid panel',
    clinic: 'Clinic',
    clinicPh: 'e.g. BMSC',
    date: 'Date',
    cat: 'Category',
    catPick: 'Select' /* the field is half-width — the long form ellipsized */,
    kind: 'Type',
    kinds: {
      analyses: 'Test / study',
      prescriptions: 'Prescription / order',
      visits: 'Visit record',
    },
    person: 'For whom',
    consent: 'Share with your personal doctor?',
    consentOn: (doc) => `${doc} will see this document`,
    consentOff: 'The document will be visible only to you',
    submit: 'Upload',
    cancel: 'Cancel',
    errName: 'Enter a document name',
    errCat: 'Choose a category',
    shared: 'Shared with doctor',
  },
  /* A6 — V2 history parity (F-02/F-03; charts OUT — PDF only). */
  hist2: {
    sections: { meds: 'Medications', studies: 'Studies', referrals: 'Referrals' },
    groups: 'Prescription groups',
    /* TWO empty-state messages, because the two causes ask for different things:
       nothing exists (switch person) vs the filter cut everything (loosen it). */
    emptyPerson: 'This person has no records in this section yet',
    emptyFilter: 'No records match the selected filter',
    filterPeriod: 'Period',
    filterCat: 'Category',
    filterYear: 'Year',
    /* clinic-origin filter — labels mirror the SourceTag vocabulary EXACTLY: the
       record cards' origin chip says "External" (src.external), so the filter says
       "External" too. It was "External clinics"; see the ka note for the full
       reasoning (consistency, plus ~50px back in a row that now fills its width). */
    filterClinic: 'Clinic',
    clinics: { all: 'All', curatio: 'Curatio', external: 'External' },
    medStates: { active: 'Active', expiring: 'Expiring', chronic: 'Chronic' },
    /* #11 — renewal is a VISIT the patient books, not a one-tap refill request. */
    renew: 'Book a renewal visit',
    renewNote: 'Renewing a prescription requires a visit to your personal doctor',
    /* The way out for a medication the patient no longer takes. Deliberately about
       the APP's prompts, not clinical truth: it silences the renewal CTA and expiry
       reminders, says so, and is reversible. It does NOT claim the doctor was told. */
    dismiss: 'No longer needed',
    dismissed: 'No longer needed',
    dismissedNote: 'Renewal reminder turned off',
    undo: 'Undo',
    book: 'Book a doctor',
    refStatuses: { booked: 'Booked', waiting: 'Waiting' },
    years: ['2026', '2025', '2024'],
    yearRange: 'Date',
    visitStatuses: { done: 'Completed' },
    /* #10 — icon AND label, never the icon alone. ⚠ Same known ka mismatch carried
       over deliberately: history files TWO remote encounter kinds (phone + online)
       while the booking flow offers ONE. Re-cut together with ka before dev. */
    visitTypes: {
      visit: 'Clinic visit',
      phone: 'Phone consultation',
      online: 'Online consultation',
    },
    uploadedLbl: 'Uploaded documents',
    /* Short on purpose: as a BUTTON it shares the actions row, and at 390px the row
       is 297 wide. "Attach a file" pairs with nothing — every card fell to one button
       per line. Don't lengthen it without re-measuring the row. */
    attach: 'Attach',
    attached: (n) => `Attached documents · ${n}`,
    uplPdf: 'Document PDF',
    downloadPdf: 'Record PDF',
    /* UNUSED since 2026-08-26 — kept as the wording of record, same as in ka. */
    uploadResult: 'Upload a result',
    resultPdf: 'Result PDF',
    rxPdf: 'Prescription PDF',
  },
  /* A5 — history transfer (F-03). */
  transfer: {
    title: 'Transfer history',
    sub: 'Choose a doctor from the Curatio network',
    online: 'Online',
    tomorrow: 'Tomorrow',
    includes:
      'Transferred: visits and consultations, tests and studies, prescriptions',
    cancel: 'Cancel',
    confirm: 'Confirm transfer',
    successTitle: 'Transfer confirmed',
    successBody: 'Medical history was passed to:',
    close: 'Close',
  },
  /* A3 — digital queue-ticket activation (F-01). */
  qpick: {
    title: 'Activate your digital ticket',
    today: 'Today',
    onVisitDay: 'On visit day',
    tomorrow: 'Tomorrow',
    /* Matches `ticket.live`: the queue-picker badge and the e-ticket's status badge
       name the same live queue, so they use the same word. */
    queueOpen: 'Live',
    activate: 'Activate ticket',
    lockedTomorrow: 'The ticket becomes available tomorrow at 09:00',
    lockedFuture: 'The ticket becomes available at 09:00 on your visit day',
    empty: 'No upcoming appointments',
    emptyHint: 'A ticket can be taken on the day of your appointment',
  },
  otp: {
    title: 'Protected information',
    body: 'To view your medical records, enter the one-time code sent by SMS to ***23',
    confirm: 'Confirm',
    resendIn: (s) => `Resend in 0:${String(s).padStart(2, '0')}`,
    resend: 'Resend',
    close: 'Close',
    demoNote: 'Demo: any 4 digits will do',
  },
  ticket: {
    title: 'Digital queue',
    yourTicket: 'Your ticket',
    wait: 'Wait',
    ahead: 'Ahead',
    status: 'Status',
    live: 'Live',
    /* #5 — arrival check-in. */
    arriveTitle: 'Are you at the clinic?',
    arriveHint:
      'Tap as soon as you arrive — your place is confirmed and the doctor knows you are here',
    arriveCta: "I've arrived",
    arrivedTitle: 'Arrival confirmed',
    arrivedAt: (t) => `Confirmed at ${t}`,
    arrivedBadge: "You're in the queue",
    arrivedNext: (cab) => `Wait to be called — ${cab}`,
  },
  /* #12 — the More menu. Only the Curatio row is real; the rest are stand-ins. */
  more: {
    title: 'More',
    rows: {
      curatio: 'My Curatio',
      profile: 'Profile',
      notifications: 'Notifications',
      payments: 'Payments',
      help: 'Help',
      settings: 'Settings',
    },
    hints: {
      curatio: 'Personal doctor · Medical history · Queue ticket',
    },
  },
  /* #14 — uninsured mode. ⚠ PLACEHOLDER COPY in ka too: the cover list is shaped
     from the MVP1 spec, not confirmed by the business, and deliberately says nothing
     about price or self-pay. */
  ins: {
    bannerTitle: "You don't have GPI health insurance",
    bannerBody:
      'Your medical records stay open · Booking and consultations need cover',
    sheetTitle: 'This service is available with insurance',
    sheetBody:
      'GPI health insurance covers services across the Curatio network. Your medical history stays yours, with or without cover.',
    covers: [
      'Booking a doctor in the Curatio network',
      'Phone consultation with your personal doctor',
      'Prescription renewal by visit',
      'Preventive screening and vaccination',
    ],
    cta: 'See the plans',
    later: 'Later',
  },
  hub: {
    title: 'My Curatio',
    allPersons: 'All',
    todayStrip: (spec, time, num) => `${spec} · ${time} · queue ${num}`,
    doctorLabel: 'My personal doctor',
    online: 'Online',
    nextVisit: 'Next visit:',
    book: 'Book',
    details: 'Details',
    historyTitle: 'Medical history',
    historyCounts: (c) =>
      `Tests ${c.analyses} · Presc. ${c.prescriptions} · Visits ${c.visits} · Docs ${c.docs}`,
    remindersTitle: 'Reminders',
    manage: 'Manage',
    preventionTitle: 'Prevention',
    soon: 'Soon: online consultation · chat with your doctor',
  },
  history: {
    title: 'Medical history',
    tabs: { analyses: 'Tests', prescriptions: 'Presc.', visits: 'Visits', docs: 'Docs' },
    periods: { m3: '3 months', m6: '6 months', y1: '1 year', range: 'Date' },
    statuses: { norm: 'Normal', warn: 'Attention', crit: 'Critical', uploaded: 'Uploaded' },
    upload: 'Upload a document from another clinic',
    download: 'Download',
  },
  /* Screen-reader-only labels, extracted from the JSX 2026-08-27 with the EN build.
     They were hard-coded Georgian aria-labels — invisible on screen, and therefore
     the easiest strings in the module to leave untranslated by accident. */
  a11y: {
    back: 'Back',
    patient: 'Patient',
    period: 'Period',
    digit: (n) => `Digit ${n}`,
    language: 'Language',
  },
}
