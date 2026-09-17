/* Dashboard host (#/dash) — copy table.

   Georgian is the delivery language; English is the second locale, resolved by
   the SHARED language switch (src/i18n/index.js), so ?lang=en flips this table
   along with the rest of the prototype. The strings themselves live here rather
   than in src/i18n/strings.js because this is its own project (Rule 5) — the
   My-Cabinet booking app must stay splittable from it.

   ⚠️ SOURCE COPY: the design shots are written in ENGLISH. `en` below is that
   copy verbatim; `ka` is a translation, and the terms it reuses are the ones the
   prototype already uses elsewhere, never new synonyms (Rule 1):
     ჯავშნები · მიმართვები · ანაზღაურება · ექიმთან ჩაწერა · მიმდინარე · განხილვაში
   ⚠️ The auto card's loyalty paragraph is PLACEHOLDER product copy in the design
   ("…you can do this and that"). Real Bruno/Voovly wording must come from GPI. */

import { lang } from '../i18n/index.js'

export const kaDash = {
  meta: { title: 'GPI — ჩემი კაბინეტი' },

  topbar: {
    points: (n) => `${n} ქულა`,
    pointsA11y: 'Bruno ქულები',
    mail: 'შეტყობინებები',
    user: 'თემური',
    menu: 'მენიუ',
  },

  nav: {
    home: 'მთავარი',
    policies: 'პოლისები',
    payments: 'გადახდები',
    booking: 'ექიმთან ჩაწერა',
    referrals: 'მიმართვები',
    reimbursement: 'ანაზღაურება',
    coverage: 'დაფარვები და გახარჯვები',
    dental: 'სტომატოლოგიური კლინიკები',
    buy: 'შეიძინე დაზღვევა',
    /* Overflow trigger — the nav collapses whatever will not fit into this. */
    more: 'მეტი',
  },

  sections: { active: 'აქტიური პოლისები' },

  /* One link label, two shapes: with a count on section heads, bare inside a card. */
  viewAll: (n) => (n == null ? 'ყველა' : `ყველა ${n}`),

  policy: {
    insured: 'დაზღვეული',
    vehicle: 'ავტომობილი',
    open: 'პოლისის ნახვა',
    nextPayment: 'შემდეგი გადახდა',
    renews: (d) => `აქტიური · განახლდება ${d}`,
    actives: (n) => `${n} აქტიური`,
    switchPerson: 'აირჩიე დაზღვეული',
  },

  health: {
    limits: {
      outpatient: 'ამბულატორიული ლიმიტი',
      dental: 'სტომატოლოგიური ლიმიტი',
      remaining: (v) => `დარჩა ${v}`,
      used: 'გამოყენებული ლიმიტი',
    },
    actions: {
      book: 'ექიმთან ჩაწერა',
      referral: 'მიმართვა',
      claim: 'ანაზღაურება',
    },
    doctorRole: 'პირადი ექიმი',
    doctorCta: 'ჩაწერა',
    expertise: {
      title: 'სამედიცინო ექსპერტიზა საზღვრებს გარეთ',
      sub: 'გაიარე კონსულტაცია მსოფლიო დონის სპეციალისტებთან',
      cta: 'დეტალურად',
    },
    bookings: 'ჯავშნები',
    referrals: 'მიმართვები',
    referralsEmpty: 'აქტიური მიმართვები არ გაქვს',
    bookingsEmpty: 'მიმდინარე ჯავშნები არ გაქვს',
  },

  auto: {
    title: 'ავტოდაზღვევა',
    /* PLACEHOLDER — see the file header. */
    loyalty:
      'GPI-ის ლოიალობის პროგრამის ფარგლებში შეგიძლია დახარჯო Bruno ქულები და ისარგებლო ბენეფიტებით. Bruno-ს სტატუსის ასამაღლებლად შეგიძლია ესა და ეს.',
    actions: {
      assistant: 'ავტოასისტენტი',
      points: 'ქულების გამოყენება',
      claim: 'ანაზღაურება',
    },
    chatWith: (n) => `მიწერე ${n}-ს`,
    chatCta: 'მიწერე ასისტენტს',
    voovly: 'ჩემი Voovly ბენეფიტები',
    bruno: 'ჩემი Bruno ბენეფიტები',
  },

  /* ---- Post-payment Visa benefit page (#/dash/visa-benefit, 2026-09-08) ----
     ⚠️ DRAFT copy. Consent = legal wording to be confirmed by GPI; modal steps +
     wallet-number hint are placeholders until the partner's instructions
     arrive. Product terms reuse the campaign's own words (რეცხვა ·
     ტექდათვალიერება · საწვავი, ბრუნოს ქულები). Tier names stay in Latin. */
  visa: {
    title: 'გადახდის დადასტურება',
    /* v2 (2026-09-08): tracker + one-line strip + one claim card. */
    claimTitle: 'Visa-ს ბენეფიტის მიღება',
    crumb: 'Visa-ს ბენეფიტი',
    strip: { bought: (p) => `${p} შეძენილია`, receipt: 'ქვითარი გამოგზავნილია SMS-ით.' },
    pending: 'ბენეფიტი ჯერ არ არის აქტიური — შეიყვანე საფულის ნომერი და დაადასტურე თანხმობა.',
    reward: {
      label: 'შენი ბენეფიტი',
      points: (n) => `+${n} ბრუნოს ქულა`,
      perks: 'რეცხვა · ტექდათვალიერება · საწვავი',
    },
    success: {
      title: 'გადახდა წარმატებულია',
      policy: 'პოლისი',
      vehicle: 'ავტომობილი',
      amount: 'თანხა',
      method: 'გადახდის მეთოდი',
      date: 'თარიღი',
      receipt: 'ქვითარი გამოგზავნილია SMS-ით.',
    },
    offer: {
      badge: 'პირობები დაკმაყოფილებულია',
      title: 'ამ გადახდისთვის Visa-ს ბენეფიტი გეკუთვნის',
      body: (tier) => `გადახდა ${tier} ბარათით შესრულდა — Visa-ს კამპანიის პირობები დაკმაყოფილებულია.`,
      listTitle: 'რას მიიღებ',
      points: 'ბრუნოს ქულები',
      pointsVal: (n) => `+${n} ქულა`,
      wash: 'უფასო რეცხვა',
      inspection: 'ტექდათვალიერება',
      fuel: 'საწვავის ფასდაკლება',
      terms: 'დეტალურად',
    },
    claim: {
      title: 'დარჩა ორი ნაბიჯი',
      intro: 'ბენეფიტს პარტნიორი კომპანია ააქტიურებს. ამისთვის საჭიროა:',
      step1: 'მიუთითე საფულის ნომერი',
      walletLabel: 'საფულის ნომერი',
      walletHint: 'ნომერი პარტნიორის აპლიკაციიდან',
      walletPh: 'შეიყვანე ნომერი',
      howTo: 'როგორ ვიპოვნო ნომერი?',
      step2: 'დაადასტურე თანხმობა',
      consent:
        'ვეთანხმები, რომ GPI-მ ჩემი პირადი ნომერი გადასცეს პარტნიორ კომპანიას ბენეფიტის მიღების უფლების შესამოწმებლად.',
      consentHelp: 'მონაცემები გამოიყენება მხოლოდ ამ შემოწმებისთვის.',
      submit: 'ბენეფიტის გააქტიურება',
      later: 'მოგვიანებით',
    },
    errors: {
      required: 'სავალდებულო ველი',
      consent: 'თანხმობის გარეშე ბენეფიტის გააქტიურება ვერ მოხერხდება',
    },
    done: {
      title: 'მოთხოვნა მიღებულია',
      body: 'პარტნიორი კომპანია გადაამოწმებს მონაცემებს და ბენეფიტი რამდენიმე სამუშაო დღეში გააქტიურდება. შეტყობინებას SMS-ით მიიღებ.',
      wallet: 'საფულის ნომერი',
      benefit: 'ბენეფიტი',
      home: 'მთავარზე დაბრუნება',
    },
    modal: {
      title: 'როგორ ვიპოვნო საფულის ნომერი',
      intro: 'ნომერი პარტნიორის აპლიკაციაშია:',
      steps: [
        'გახსენი აპლიკაცია და შედი ანგარიშზე',
        'გადადი პროფილში, „საფულის" განყოფილებაში',
        'დააკოპირე საფულის ნომერი და ჩასვი ველში',
      ],
      note: 'ინსტრუქცია განახლდება პარტნიორის მითითებების მიხედვით.',
      close: 'გასაგებია',
    },
  },

  benefit: { free: 'უფასო', noLimit: 'ულიმიტო' },
  status: { ongoing: 'მიმდინარე', review: 'განხილვაში', expiring: 'ვადა იწურება' },
  chat: { open: 'დაგვიკავშირდი' },
  /* ---- ჩემი კურაციო (web) --------------------------------------------------
     Terminology is REUSED VERBATIM from the mobile module (Rule 1): section
     names are V2's post-#13 set (docs row killed — uploads live in sections),
     „დისტანციური კონსულტაცია" is the locked remote-consult term, the renewal
     CTA is #11's visit-booking wording, clinic filter labels mirror SourceTag. */
  cur: {
    title: 'ჩემი კურაციო',
    nav: 'კურაციო',
    open: 'გახსნა',
    /* Card intro — DRAFT copy (2026-09-04), not GPI-approved: says what the block
       holds so a first-time visitor knows what to expect (user's ask). */
    intro: 'შენი და ოჯახის წევრების სამედიცინო ისტორია ერთ სივრცეში — ანალიზები, დანიშნულებები და ვიზიტები კურაციოს ქსელიდან და ატვირთული დოკუმენტებიდან.',
    personAria: 'დაზღვეული პირი',
    alerts: { todayVisit: 'დღეს ვიზიტი' },
    /* v2 section page (2026-09-04): the ticket box beside the doctor. */
    /* E-ticket (2026-09-08): hero/time/live are the mobile კურაციო-dash hero's words
       (`M.dash2.hero*`), the stats labels the mobile ticket's (`M.ticket.*`) — VERBATIM,
       so the two platforms say the same things. „კაბინეტი" stays this module's wording. */
    ticket: {
      today: 'ბილეთი · დღეს', next: 'შემდეგი ჯავშანი', upcoming: 'მომავალი ჯავშნები',
      none: 'ჯავშანი არ გაქვს', noneHint: 'ჩაეწერე პირად ექიმთან ან სხვა სპეციალისტთან',
      hero: 'დღევანდელი ვიზიტი',
      time: 'ჩაწერის დრო',
      live: 'რიგი მიმდინარეობს',
      who: (doc, role) => `${doc} · ${role}`,
      where: (addr, cab, floor) => `${addr} · კაბინეტი ${cab} · ${floor}`,
      number: 'რიგის ნომერი', /* was ბილეთი — user 2026-09-10: it is the queue number */
      wait: 'მოლოდინი',
      ahead: 'წინ',
      status: 'სტატუსი',
      statusLive: 'მიმდინარე',
      minutes: 'წთ',
      patients: 'პაც.',
    },
    /* Quick-action tiles (restored 2026-09-04). „მალე" is the term the B2B
       console already uses for a not-yet-shipped entry (Rule 1). */
    tiles: {
      history: 'სამედიცინო ისტორია',
      appointments: 'ჯავშნები',
      prevention: 'პრევენცია',
      /* Uninsured account (2026-09-10): the appointments tile becomes this locked one. */
      doctorBooking: 'პირადი ექიმი და ჩაწერა',
    },
    tileMeta: {
      locked: 'დაცული',
      records: (n) => `${n} ჩანაწერი`,
      bookings: (n) => (n ? `${n} მომავალი` : 'ჯავშანი არ არის'),
      soon: 'მალე',
      insured: 'დაზღვევით',
    },
    recent: {
      title: 'ბოლო ჩანაწერები',
      lockedBody: 'ჩანაწერების სანახავად შეიყვანე ერთჯერადი კოდი',
      /* Locked, PER SECTION (user, 2026-09-16): the section tabs stay visible behind
         the gate so the user learns what each one will hold; this line, under the
         padlock, names it for the active tab. Still no counts — the gate leaks nothing. */
      lockedSections: {
        analyses: 'აქ გამოჩნდება შენი ანალიზები და კვლევები',
        meds: 'აქ გამოჩნდება ექიმის დანიშნულებები და რეცეპტები',
        visits: 'აქ გამოჩნდება ვიზიტები და კონსულტაციები',
      },
      enter: 'კოდის შეყვანა',
      none: 'ამ განყოფილებაში ჩანაწერები ჯერ არ არის',
    },
    /* Ticket BANNER (2026-09-10) — the visit-day ticket at the top of the dashboard
       and of the Curatio page. ka reuses the ticket vocabulary; only the new labels
       live here. „რიგის ნომერი" (user): the value is the queue number, „ბილეთი"
       named the artifact. */
    banner: {
      aria: 'დღევანდელი ვიზიტი',
      kicker: (person) => `დღევანდელი ვიზიტი · ${person}`,
      queue: 'რიგის ნომერი',
      location: 'ლოკაცია',
      where: (clinic, addr, cab, floor) => `${clinic} · ${addr} · კაბინეტი ${cab} · ${floor}`,
      details: 'დეტალები',
      ongoing: (num) => `ბილეთი მიმდინარეობს · ${num}`,
      /* The action slot (2026-09-16): one slot, one next step. */
      activate: 'ბილეთის გააქტიურება',
      activateFrom: (t) => `გააქტიურება ${t}-დან`,
      todayAt: (t) => `დღეს ვიზიტი · ${t}`,
    },
    strip: {
      meta: (num, ahead, cab) => `რიგი ${num} · ${ahead} პაციენტი შენს წინ · კაბინეტი ${cab}`,
      phone: 'ბილეთი ტელეფონშია — SMS ბმულით',
    },
    /* Arrival check-in — mobile stakeholder comment #5, ported 2026-09-07.
       ka is VERBATIM from mobile (`M.ticket.arrive*`) so the two platforms say
       the same words; „კაბინეტი" follows THIS module's strip.meta, not mobile's
       „ოთახი", because it is the wording already on screen two lines above.
       `early` is the one NEW string — the web-only time gate has no mobile twin. */
    arrive: {
      title: 'კლინიკაში ხარ?',
      hint: 'დააჭირე მისვლისთანავე — რიგი დაგიდასტურდება და ექიმი გაიგებს, რომ ადგილზე ხარ',
      cta: 'მე მოვედი',
      early: (t) => `ჩეკ-ინი გაიხსნება ${t}-ზე — ან დაადასტურე ტელეფონიდან`,
      doneTitle: 'მოსვლა დადასტურდა',
      badge: 'რიგში ხარ',
      next: (cab) => `დაელოდე გამოძახებას — კაბინეტი ${cab}`,
    },
    otp: {
      title: 'დაცული ინფორმაცია',
      body: 'სამედიცინო ჩანაწერების სანახავად შეიყვანე ერთჯერადი კოდი — გამოგზავნილია SMS-ით ნომერზე ***23',
      confirm: 'დადასტურება',
      resendIn: (s) => `ხელახლა გაგზავნა 0:${String(s).padStart(2, '0')}`,
      resend: 'ხელახლა გაგზავნა',
      demoNote: 'დემო: ნებისმიერი 4 ციფრი გამოდგება',
    },
    doctor: {
      role: 'პირადი ექიმი',
      nextVisit: (d) => `შემდეგი ვიზიტი: ${d}`,
      book: 'ჩაწერა',
      transfer: 'ისტორიის გადატანა',
      /* Accessible name of the kebab that holds the two actions above (2026-09-08). */
      more: 'მეტი მოქმედება',
      /* Change-doctor CONCEPT (2026-09-16, comparison variant): the kebab returns with
         TWO items — details + change — so it is never a one-item menu. A freshly
         chosen doctor has no visit yet: the row says so and Book becomes „first visit". */
      details: 'ექიმის დეტალები',
      change: 'პირადი ექიმის შეცვლა',
      noVisit: 'ვიზიტი ჯერ არ არის',
      bookFirst: 'პირველი ვიზიტის ჩაწერა',
    },
    uninsured: {
      note: 'ჩაწერა და კონსულტაცია საჭიროებს ჯანმრთელობის დაზღვევას',
      cta: 'ნახე პაკეტები',
      /* Section-page banner (2026-09-10) — ⚠ DRAFT copy. First body sentence is
         mobile's `ins.sheetBody` verbatim (#14); the rest lists what the policy
         adds. Says nothing about price / self-pay — still the open question. */
      title: 'პირადი ექიმი და ჩაწერა — ჯანმრთელობის დაზღვევით',
      body: 'შენი სამედიცინო ისტორია დაზღვევის გარეშეც შენთანაა. დაზღვევა გიხსნის პირად ექიმს, ჩაწერას კურაციოს ქსელში და დისტანციურ კონსულტაციას.',
    },
    person: 'დაზღვეული',
    hist: {
      title: 'სამედიცინო ისტორია',
      sections: {
        analyses: 'ანალიზები და კვლევები',
        meds: 'დანიშნულებები',
        visits: 'ვიზიტები და კონსულტაციები',
      },
      /* Short labels for COMPACT controls only (the dashboard card's segmented
         control). The canonical names above stay untouched — „ვიზიტები და
         კონსულტაციები" is stakeholder comment #8 (2026-08-18): phone and online
         consultations file records there too (#10), so the full name must keep
         claiming them on the history page's rail and shelf rows.
         Only override what actually differs; the rest falls back to `sections`. */
      sectionsShort: {
        visits: 'ვიზიტები',
      },
      transfer: 'ისტორიის გადატანა',
      search: 'ძებნა ჩანაწერებში',
      filters: { period: 'პერიოდი', cat: 'კატეგორია', clinic: 'კლინიკა' },
      periods: { all: 'ყველა', m3: '3 თვე', m6: '6 თვე', y1: '1 წელი' },
      cats: { all: 'ყველა', blood: 'სისხლი', biochem: 'ბიოქიმია', hormones: 'ჰორმონები', urine: 'შარდი' },
      /* Category filter on EVERY tab (user, 2026-09-16: „it should be in every category").
         Options are per section and data-backed, nothing invented: prescriptions
         = the three states the table's own badges already show (mobile `medStates`,
         Rule 6); visits = the record's `kind`, worded like the web booking CTA. */
      medCats: { all: 'ყველა', active: 'აქტიური', expiring: 'ვადა იწურება', chronic: 'ქრონიკული' },
      visitCats: { all: 'ყველა', inclinic: 'ვიზიტი კლინიკაში', remote: 'დისტანციური კონსულტაცია' },
      clinics: { all: 'ყველა', curatio: 'კურაციო', external: 'გარე კლინიკები' },
      cols: {
        date: 'თარიღი',
        name: 'კვლევა',
        med: 'მედიკამენტი',
        visit: 'ვიზიტი',
        clinic: 'კლინიკა',
        status: 'სტატუსი',
        expiry: 'ვადა',
      },
      statuses: { norm: 'ნორმა', warn: 'ყურადღება', crit: 'კრიტიკული', uploaded: 'ატვირთული', done: 'დასრულებული' },
      chronic: 'ქრონიკული',
      expiring: 'ვადა იწურება',
      active: 'აქტიური',
      expiryIn: (n) => `${n} დღეში`,
      renew: 'ჩაეწერე განახლებისთვის',
      renewNote: 'რეცეპტის განახლებისთვის საჭიროა ვიზიტი პირად ექიმთან',
      form100: 'ფორმა 100',
      /* The row's eye (2026-09-17): opens the document in a new tab — the accessible name says so. */
      view: 'ნახვა',
      newTab: 'იხსნება ახალ ფანჯარაში',
      expiryBadge: (n) => `${n} ვადა`,
      empty: 'ჩანაწერები ვერ მოიძებნა',
      emptyHint: 'შეცვალე ფილტრები ან ძებნის ტექსტი',
      /* Unread (2026-09-17): the section counters' accessible reading + the row mark. */
      unread: { tab: (n) => `${n} ახალი`, row: 'ახალი ჩანაწერი' },
    },
    /* History transfer (2026-09-09) — the doctor-row action, finally wired. ONE flow
       for both entry points: full history OR a checklist of records, to the personal
       doctor (preselected) or another Curatio doctor. Names are never declined —
       „გადაეცა: ნ. ნინოშვილი" — because a name-declension table for every doctor
       in the network would be wrong the first time it met a new surname. Copy is a
       DRAFT for GPI sign-off (share vs transfer is still open with the stakeholders). */
    /* პირადი ექიმის შეცვლა (2026-09-16) — the concept drawer. The consent line is
       the mobile docsel wording (Rule 6); „წვდომას აღარ ექნება" follows from the PO's
       rule itself. DRAFT until GPI signs it off; the PO discussion is 2026-09-17. */
    change: {
      title: 'პირადი ექიმის შეცვლა',
      ctx: (person, doc) => `${person} · ახლანდელი პირადი ექიმი: ${doc}`,
      /* 2026-09-17 change request (after the PO discussion): the handover is AUTOMATIC — no
         record picker. The rule is stated ONCE, up front, as an info alert; then the clinic,
         then the doctors who practise there. Headings stay instructions without numbers
         (round 3). ⚠️ „გადაეცემა" (transfer) — share-vs-transfer wording is still the open
         stakeholder question; the toast uses the same verb. */
      info: 'ახალი პირადი ექიმის არჩევის შემდეგ შენი სამედიცინო ისტორია მას ავტომატურად გადაეცემა.',
      clinic: 'აირჩიე კლინიკა',
      clinicPh: 'კურაციოს კლინიკა',
      pick: 'აირჩიე ახალი პირადი ექიმი',
      noDoctor: 'ამ კლინიკაში სხვა პირადი ექიმი არ არის',
      cancel: 'გაუქმება',
      confirm: 'ექიმის შეცვლა',
      /* NOT the headings' words (round 3) — an error that repeats the heading verbatim
         reads as an echo, not as a fix. */
      errClinic: 'აირჩიე კლინიკა სიიდან',
      errDoctor: 'აირჩიე ექიმი სიიდან',
      doneHist: (doc) => `პირადი ექიმი შეიცვალა: ${doc} · სრული ისტორია გადატანილია`,
    },
    transfer: {
      title: 'ისტორიის გადატანა',
      scope: 'რა გადავიტანოთ',
      full: 'სრული ისტორია',
      selected: 'არჩეული ჩანაწერები',
      selectedCount: (n) => `არჩეულია ${n}`,
      search: 'ძებნა ჩანაწერებში',
      selectAll: 'ყველას მონიშვნა',
      clearAll: 'მოხსნა',
      noMatch: 'ჩანაწერები ვერ მოიძებნა',
      to: 'ვის',
      personal: 'პირადი ექიმი',
      other: 'სხვა ექიმი კურაციოს ქსელიდან',
      /* Uninsured (2026-09-10): no personal doctor exists, so the only target is a network doctor. */
      network: 'ექიმი კურაციოს ქსელიდან',
      pickDoctor: 'აირჩიე ექიმი',
      errNone: 'აირჩიე მინიმუმ ერთი ჩანაწერი',
      errDoctor: 'აირჩიე ექიმი',
      cancel: 'გაუქმება',
      confirm: (n) => `გადატანა · ${n} ჩანაწერი`,
      confirmNone: 'გადატანა',
      confirmFull: 'სრული ისტორიის გადატანა',
      doneFull: (doc) => `სრული ისტორია გადაეცა: ${doc}`,
      done: (n, doc) => `${n} ჩანაწერი გადაეცა: ${doc}`,
      visible: (docs) => `ხილვადია: ${docs}`,
      rowAction: 'ექიმთან გადატანა',
      rowShared: 'ხილვადია პირადი ექიმისთვის',
      attachShared: 'ხილვადია პირადი ექიმისთვის',
      /* Drawer rework (2026-09-10): doctor first, one selection, no scope switch. */
      otherShort: 'სხვა ექიმი',
      docSearch: 'ექიმის ან სპეციალობის ძებნა',
      noDoctor: 'ექიმი ვერ მოიძებნა',
      fullLink: (n) => `სრული ისტორია · ${n}`,
      clearFull: 'ყველას მოხსნა',
      catHead: (label, n, total) => `${label} · არჩეულია ${n} / ${total}`,
      totalLine: (n) => `სულ არჩეულია ${n}`,
      totalNone: 'არაფერია არჩეული',
    },
    upl: {
      title: 'დოკუმენტის ატვირთვა',
      hint: 'PDF, JPG, PNG · მაქს. 20MB',
      browse: 'აირჩიე ფაილი',
      replace: 'შეცვალე ფაილი',
      name: 'სახელი',
      namePh: 'მაგ. ლიპიდური სპექტრი',
      clinic: 'კლინიკა',
      clinicPh: 'მაგ. BMSC',
      consent: 'გავუზიაროთ პირად ექიმს?',
      consentOn: (doc) => `${doc} იხილავს ამ დოკუმენტს`,
      consentOff: 'დოკუმენტი მხოლოდ შენთვის იქნება ხილული',
      cancel: 'გაუქმება',
      errFile: 'აირჩიე ფაილი',
      errName: 'შეავსე დოკუმენტის სახელი',
      /* Per-record attach (2026-09-04) — wording VERBATIM from mobile hist2.attach /
         hist2.attached: the paperclip hangs a document off an existing record. */
      attach: 'მიმაგრება',
      attachTitle: 'დოკუმენტის მიმაგრება',
      attachTo: (rec) => `ჩანაწერი: ${rec}`,
    },
    rebook: 'გადაჯავშნა',
    crumbHome: 'მთავარი',
  },
}


export const enDash = {
  meta: { title: 'GPI — My Cabinet' },

  topbar: {
    points: (n) => `${n} pts`,
    pointsA11y: 'Bruno points',
    mail: 'Messages',
    user: 'Temuri',
    menu: 'Menu',
  },

  nav: {
    home: 'Home',
    policies: 'Policies',
    payments: 'Payments',
    booking: 'Book a doctor',
    referrals: 'Referrals',
    reimbursement: 'Reimbursement',
    coverage: 'Coverage & spending',
    dental: 'Dental clinics',
    buy: 'Buy insurance',
    more: 'More',
  },

  sections: { active: 'Active policies' },

  viewAll: (n) => (n == null ? 'View all' : `View all ${n}`),

  policy: {
    insured: 'Insured',
    vehicle: 'Vehicle',
    open: 'Open policy',
    nextPayment: 'Next payment',
    renews: (d) => `Active · renews ${d}`,
    actives: (n) => `${n} actives`,
    switchPerson: 'Choose insured person',
  },

  health: {
    limits: {
      outpatient: 'Outpatient limit',
      dental: 'Dental limit',
      remaining: (v) => `${v} remaining`,
      used: 'Limit used',
    },
    actions: { book: 'Book a doctor', referral: 'Referral', claim: 'File a claim' },
    doctorRole: 'Personal doctor',
    doctorCta: 'Book appointment',
    expertise: {
      title: 'Medical Expertise Beyond Your Borders',
      sub: 'Consult your medical condition with world-class specialists',
      cta: 'View Details',
    },
    bookings: 'Bookings',
    referrals: 'Referrals',
    referralsEmpty: 'You do not have active referrals',
    bookingsEmpty: 'You do not have active bookings',
  },

  auto: {
    title: 'Auto insurance',
    loyalty:
      "As part of the GPI's loyalty program you are eligible to spend Bruno points and use benefits. To upgrade your Bruno status you can do this and that.",
    actions: { assistant: 'Auto Assistant', points: 'Use points', claim: 'File a claim' },
    chatWith: (n) => `Chat with ${n}`,
    chatCta: 'Chat with assistant',
    voovly: 'My Voovly benefits',
    bruno: 'My Bruno benefits',
  },

  visa: {
    title: 'Payment confirmation',
    claimTitle: 'Claim your Visa benefit',
    crumb: 'Visa benefit',
    strip: { bought: (p) => `${p} purchased`, receipt: 'The receipt has been sent by SMS.' },
    pending: 'The benefit is not active yet. Enter your wallet number and give your consent.',
    reward: {
      label: 'Your benefit',
      points: (n) => `+${n} Bruno points`,
      perks: 'Wash · Inspection · Fuel',
    },
    success: {
      title: 'Payment successful',
      policy: 'Policy',
      vehicle: 'Vehicle',
      amount: 'Amount',
      method: 'Payment method',
      date: 'Date',
      receipt: 'The receipt has been sent by SMS.',
    },
    offer: {
      badge: 'Conditions met',
      title: 'This payment qualifies for a Visa benefit',
      body: (tier) => `You paid with a ${tier} card, so the Visa campaign conditions are met.`,
      listTitle: 'What you get',
      points: 'Bruno points',
      pointsVal: (n) => `+${n} points`,
      wash: 'Free car wash',
      inspection: 'Technical inspection',
      fuel: 'Fuel discount',
      terms: 'Details',
    },
    claim: {
      title: 'Two more steps',
      intro: 'The benefit is activated by a partner company. It needs:',
      step1: 'Enter your wallet number',
      walletLabel: 'Wallet number',
      walletHint: 'The number from the partner app',
      walletPh: 'Enter the number',
      howTo: 'How do I find it?',
      step2: 'Give your consent',
      consent:
        'I agree that GPI passes my personal number to the partner company to verify my eligibility for the benefit.',
      consentHelp: 'The data is used for this check only.',
      submit: 'Activate benefit',
      later: 'Later',
    },
    errors: {
      required: 'Required field',
      consent: 'The benefit cannot be activated without your consent',
    },
    done: {
      title: 'Request received',
      body: 'The partner company will verify the details and activate the benefit within a few working days. You will get an SMS.',
      wallet: 'Wallet number',
      benefit: 'Benefit',
      home: 'Back to dashboard',
    },
    modal: {
      title: 'How to find your wallet number',
      intro: 'The number is in the partner app:',
      steps: [
        'Open the app and sign in',
        'Go to your profile, then the "Wallet" section',
        'Copy the wallet number and paste it into the field',
      ],
      note: 'These instructions will be updated with the partner\'s own guidance.',
      close: 'Got it',
    },
  },

  benefit: { free: 'Free', noLimit: 'No limit' },
  status: { ongoing: 'Ongoing', review: 'Under review', expiring: 'Expiring' },
  chat: { open: 'Contact us' },
  cur: {
    title: 'My Curatio',
    nav: 'Curatio',
    open: 'Open',
    intro: 'Your and your family\'s medical history in one place — tests, prescriptions and visits from the Curatio network and your uploaded documents.',
    personAria: 'Insured person',
    alerts: { todayVisit: 'Visit today' },
    ticket: {
      today: 'Ticket · today', next: 'Next appointment', upcoming: 'Upcoming appointments',
      none: 'No upcoming appointments', noneHint: 'Book your personal doctor or another specialist',
      hero: "Today's visit",
      time: 'Appointment time',
      live: 'Queue in progress',
      who: (doc, role) => `${doc} · ${role}`,
      where: (addr, cab, floor) => `${addr} · Cabinet ${cab} · ${floor}`,
      number: 'Queue number',
      wait: 'Wait',
      ahead: 'Ahead',
      status: 'Status',
      statusLive: 'Live',
      minutes: 'min',
      patients: 'people',
    },
    tiles: {
      history: 'Medical history',
      appointments: 'Appointments',
      prevention: 'Prevention',
      doctorBooking: 'Personal doctor & booking',
    },
    tileMeta: {
      locked: 'Protected',
      records: (n) => `${n} records`,
      bookings: (n) => (n ? `${n} upcoming` : 'No appointments'),
      soon: 'Soon',
      insured: 'With insurance',
    },
    recent: {
      title: 'Recent records',
      lockedBody: 'Enter a one-time code to view your records',
      lockedSections: {
        analyses: 'Your analyses and studies will appear here',
        meds: "Your doctor's prescriptions will appear here",
        visits: 'Your visits and consultations will appear here',
      },
      enter: 'Enter code',
      none: 'No records in this section yet',
    },
    banner: {
      aria: "Today's visit",
      kicker: (person) => `Today's visit · ${person}`,
      queue: 'Queue number',
      location: 'Location',
      where: (clinic, addr, cab, floor) => `${clinic} · ${addr} · Cabinet ${cab} · ${floor}`,
      details: 'Details',
      ongoing: (num) => `Ticket in progress · ${num}`,
      activate: 'Activate ticket',
      activateFrom: (t) => `Activate from ${t}`,
      todayAt: (t) => `Visit today · ${t}`,
    },
    strip: {
      meta: (num, ahead, cab) => `Queue ${num} · ${ahead} patients ahead · Cabinet ${cab}`,
      phone: 'Your ticket is on your phone — via SMS link',
    },
    /* see the ka note: verbatim from mobile, except `early` (web-only time gate) */
    arrive: {
      title: 'Are you at the clinic?',
      hint: 'Tap as soon as you arrive — your place is confirmed and the doctor knows you are here',
      cta: "I've arrived",
      early: (t) => `Check-in opens at ${t} — or confirm from your phone`,
      doneTitle: 'Arrival confirmed',
      badge: "You're in the queue",
      next: (cab) => `Wait to be called — cabinet ${cab}`,
    },
    otp: {
      title: 'Protected information',
      body: 'Enter the one-time code to view medical records — sent by SMS to ***23',
      confirm: 'Confirm',
      resendIn: (s) => `Resend in 0:${String(s).padStart(2, '0')}`,
      resend: 'Resend',
      demoNote: 'Demo: any 4 digits work',
    },
    doctor: {
      role: 'Personal doctor',
      nextVisit: (d) => `Next visit: ${d}`,
      book: 'Book',
      transfer: 'Transfer history',
      details: 'Doctor details',
      change: 'Change personal doctor',
      noVisit: 'No visit booked yet',
      bookFirst: 'Book first visit',
      more: 'More actions',
    },
    uninsured: {
      note: 'Booking and consultations require health insurance',
      cta: 'See packages',
      title: 'Personal doctor and booking — with health insurance',
      body: 'Your medical history stays with you without insurance. Insurance adds a personal doctor, booking across the Curatio network and remote consultations.',
    },
    person: 'Insured',
    hist: {
      title: 'Medical history',
      sections: {
        analyses: 'Analyses & studies',
        meds: 'Prescriptions',
        visits: 'Visits & consultations',
      },
      /* see the ka note: short labels for compact controls only */
      sectionsShort: {
        visits: 'Visits',
      },
      transfer: 'Transfer history',
      search: 'Search records',
      filters: { period: 'Period', cat: 'Category', clinic: 'Clinic' },
      periods: { all: 'All', m3: '3 months', m6: '6 months', y1: '1 year' },
      cats: { all: 'All', blood: 'Blood', biochem: 'Biochemistry', hormones: 'Hormones', urine: 'Urine' },
      medCats: { all: 'All', active: 'Active', expiring: 'Expiring', chronic: 'Chronic' },
      visitCats: { all: 'All', inclinic: 'Clinic visit', remote: 'Online consultation' },
      clinics: { all: 'All', curatio: 'Curatio', external: 'External clinics' },
      cols: {
        date: 'Date',
        name: 'Study',
        med: 'Medication',
        visit: 'Visit',
        clinic: 'Clinic',
        status: 'Status',
        expiry: 'Expiry',
      },
      statuses: { norm: 'Norm', warn: 'Attention', crit: 'Critical', uploaded: 'Uploaded', done: 'Finished' },
      chronic: 'Chronic',
      expiring: 'Expiring',
      active: 'Active',
      expiryIn: (n) => `in ${n} days`,
      renew: 'Book a renewal visit',
      renewNote: 'Renewing a prescription requires a visit to your personal doctor',
      form100: 'Form 100',
      view: 'View',
      newTab: 'opens in a new tab',
      expiryBadge: (n) => `${n} expiring`,
      empty: 'No records found',
      emptyHint: 'Change the filters or the search text',
      unread: { tab: (n) => `${n} new`, row: 'New record' },
    },
    /* see the ka note — one flow, two entry points; draft copy */
    change: {
      title: 'Change personal doctor',
      ctx: (person, doc) => `${person} · current personal doctor: ${doc}`,
      info: 'After you choose a new personal doctor, your medical history is transferred to them automatically.',
      clinic: 'Choose a clinic',
      clinicPh: 'Curatio clinic',
      pick: 'Choose a new personal doctor',
      noDoctor: 'No other personal doctor at this clinic',
      cancel: 'Cancel',
      confirm: 'Change doctor',
      errClinic: 'Choose a clinic from the list',
      errDoctor: 'Choose a doctor from the list',
      doneHist: (doc) => `Personal doctor changed to ${doc} · full history transferred`,
    },
    transfer: {
      title: 'Transfer history',
      scope: 'What to transfer',
      full: 'Full history',
      selected: 'Selected records',
      selectedCount: (n) => `${n} selected`,
      search: 'Search records',
      selectAll: 'Select all',
      clearAll: 'Clear',
      noMatch: 'No records found',
      to: 'To whom',
      personal: 'Personal doctor',
      other: 'Another doctor in the Curatio network',
      network: 'A doctor from the Curatio network',
      pickDoctor: 'Choose a doctor',
      errNone: 'Select at least one record',
      errDoctor: 'Choose a doctor',
      cancel: 'Cancel',
      confirm: (n) => `Transfer · ${n} ${n === 1 ? 'record' : 'records'}`,
      confirmNone: 'Transfer',
      confirmFull: 'Transfer full history',
      doneFull: (doc) => `Full history transferred to ${doc}`,
      done: (n, doc) => `${n} ${n === 1 ? 'record' : 'records'} transferred to ${doc}`,
      visible: (docs) => `Visible to: ${docs}`,
      rowAction: 'Transfer to a doctor',
      rowShared: 'Visible to your personal doctor',
      attachShared: 'Visible to your personal doctor',
      otherShort: 'Other doctor',
      docSearch: 'Search doctor or specialty',
      noDoctor: 'No doctor found',
      fullLink: (n) => `Full history · ${n}`,
      clearFull: 'Clear all',
      catHead: (label, n, total) => `${label} · ${n} of ${total} selected`,
      totalLine: (n) => `${n} selected in total`,
      totalNone: 'Nothing selected',
    },
    upl: {
      title: 'Upload a document',
      hint: 'PDF, JPG, PNG · max 20MB',
      browse: 'Choose a file',
      replace: 'Replace file',
      name: 'Name',
      namePh: 'e.g. Lipid panel',
      clinic: 'Clinic',
      clinicPh: 'e.g. BMSC',
      consent: 'Share with your personal doctor?',
      consentOn: (doc) => `${doc} will see this document`,
      consentOff: 'The document will be visible only to you',
      cancel: 'Cancel',
      errFile: 'Choose a file',
      errName: 'Fill in the document name',
      attach: 'Attach',
      attachTitle: 'Attach a document',
      attachTo: (rec) => `Record: ${rec}`,
    },
    rebook: 'Reschedule',
    crumbHome: 'Home',
  },
}


export const D = lang === 'en' ? enDash : kaDash
