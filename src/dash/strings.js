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
    open: 'ყველა',
    lock: 'ჩაკეტვა',
    tiles: {
      history: 'სამედიცინო ისტორია',
      prevention: 'პრევენცია',
      reminders: 'შეხსენებები',
    },
    tileMeta: {
      locked: 'დაცული',
      records: (n) => `${n} ჩანაწერი`,
      due: (n) => `${n} მოსალოდნელი`,
      on: (n) => `${n} ჩართული`,
    },
    recent: {
      title: 'ბოლო ჩანაწერები',
      lockedBody: 'ჩანაწერების სანახავად შეიყვანე ერთჯერადი კოდი',
      enter: 'კოდის შეყვანა',
    },
    strip: {
      today: (t, doc) => `დღეს ${t} · ${doc}`,
      meta: (num, ahead, cab) => `რიგი ${num} · ${ahead} პაციენტი შენს წინ · კაბინეტი ${cab}`,
      phone: 'ბილეთი ტელეფონშია — SMS ბმულით',
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
      remote: 'დისტანციური კონსულტაცია',
      transfer: 'ისტორიის გადაცემა',
    },
    uninsured: {
      note: 'ჩაწერა და კონსულტაცია საჭიროებს ჯანმრთელობის დაზღვევას',
      cta: 'ნახე პაკეტები',
    },
    person: 'დაზღვეული',
    hist: {
      title: 'სამედიცინო ისტორია',
      sections: {
        analyses: 'ანალიზები და კვლევები',
        meds: 'დანიშნულებები',
        visits: 'ვიზიტები და კონსულტაციები',
      },
      upload: 'დოკუმენტის ატვირთვა',
      transfer: 'ისტორიის გადაცემა',
      search: 'ძებნა ჩანაწერებში',
      filters: { period: 'პერიოდი', cat: 'კატეგორია', clinic: 'კლინიკა' },
      periods: { all: 'ყველა', m3: '3 თვე', m6: '6 თვე', y1: '1 წელი' },
      cats: { all: 'ყველა', blood: 'სისხლი', biochem: 'ბიოქიმია', hormones: 'ჰორმონები', urine: 'შარდი' },
      clinics: { all: 'ყველა', curatio: 'კურაციო', external: 'გარე კლინიკები' },
      cols: {
        date: 'თარიღი',
        name: 'კვლევა',
        med: 'მედიკამენტი',
        visit: 'ვიზიტი',
        clinic: 'კლინიკა',
        doctor: 'ექიმი',
        status: 'სტატუსი',
        expiry: 'ვადა',
        doc: 'დოკუმენტი',
      },
      statuses: { norm: 'ნორმა', warn: 'ყურადღება', crit: 'კრიტიკული', uploaded: 'ატვირთული', done: 'დასრულებული' },
      chronic: 'ქრონიკული',
      expiring: 'ვადა იწურება',
      active: 'აქტიური',
      expiryIn: (n) => `${n} დღეში`,
      renew: 'ჩაეწერე განახლებისთვის',
      renewNote: 'რეცეპტის განახლებისთვის საჭიროა ვიზიტი პირად ექიმთან',
      form100: 'ფორმა 100',
      download: 'ჩამოტვირთვა',
      expiryBadge: (n) => `${n} ვადა`,
      today: 'დღეს',
      empty: 'ჩანაწერები ვერ მოიძებნა',
      emptyHint: 'შეცვალე ფილტრები ან ძებნის ტექსტი',
    },
    upl: {
      title: 'დოკუმენტის ატვირთვა',
      step: (n) => `${n} / 2`,
      hint: 'PDF, JPG, PNG · მაქს. 20MB',
      browse: 'აირჩიე ფაილი',
      replace: 'შეცვალე ფაილი',
      name: 'სახელი',
      namePh: 'მაგ. ლიპიდური სპექტრი',
      clinic: 'კლინიკა',
      clinicPh: 'მაგ. BMSC',
      date: 'თარიღი',
      cat: 'კატეგორია',
      catPick: 'აირჩიე',
      consent: 'გავუზიაროთ პირად ექიმს?',
      consentOn: (doc) => `${doc} იხილავს ამ დოკუმენტს`,
      consentOff: 'დოკუმენტი მხოლოდ შენთვის იქნება ხილული',
      submit: 'ატვირთვა',
      cancel: 'გაუქმება',
      errFile: 'აირჩიე ფაილი',
      errName: 'შეავსე დოკუმენტის სახელი',
      errCat: 'აირჩიე კატეგორია',
      added: 'დოკუმენტი ატვირთულია',
    },
    prevTitle: 'პრევენცია',
    prevBook: 'ჩაეწერე',
    prevStatus: { due: 'მოსალოდნელი', missed: 'გადაცილებული', done: 'გავლილი' },
    remTitle: 'შეხსენებები',
    remChannels: 'Push · SMS · Email — ტიპის მიხედვით',
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

  benefit: { free: 'Free', noLimit: 'No limit' },
  status: { ongoing: 'Ongoing', review: 'Under review', expiring: 'Expiring' },
  chat: { open: 'Contact us' },
  cur: {
    title: 'My Curatio',
    nav: 'Curatio',
    open: 'View all',
    lock: 'Lock',
    tiles: {
      history: 'Medical history',
      prevention: 'Prevention',
      reminders: 'Reminders',
    },
    tileMeta: {
      locked: 'Protected',
      records: (n) => `${n} records`,
      due: (n) => `${n} due`,
      on: (n) => `${n} enabled`,
    },
    recent: {
      title: 'Recent records',
      lockedBody: 'Enter a one-time code to view your records',
      enter: 'Enter code',
    },
    strip: {
      today: (t, doc) => `Today ${t} · ${doc}`,
      meta: (num, ahead, cab) => `Queue ${num} · ${ahead} patients ahead · Cabinet ${cab}`,
      phone: 'Your ticket is on your phone — via SMS link',
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
      remote: 'Online consultation',
      transfer: 'Transfer history',
    },
    uninsured: {
      note: 'Booking and consultations require health insurance',
      cta: 'See packages',
    },
    person: 'Insured',
    hist: {
      title: 'Medical history',
      sections: {
        analyses: 'Analyses & studies',
        meds: 'Prescriptions',
        visits: 'Visits & consultations',
      },
      upload: 'Upload a document',
      transfer: 'Transfer history',
      search: 'Search records',
      filters: { period: 'Period', cat: 'Category', clinic: 'Clinic' },
      periods: { all: 'All', m3: '3 months', m6: '6 months', y1: '1 year' },
      cats: { all: 'All', blood: 'Blood', biochem: 'Biochemistry', hormones: 'Hormones', urine: 'Urine' },
      clinics: { all: 'All', curatio: 'Curatio', external: 'External clinics' },
      cols: {
        date: 'Date',
        name: 'Study',
        med: 'Medication',
        visit: 'Visit',
        clinic: 'Clinic',
        doctor: 'Doctor',
        status: 'Status',
        expiry: 'Expiry',
        doc: 'Document',
      },
      statuses: { norm: 'Norm', warn: 'Attention', crit: 'Critical', uploaded: 'Uploaded', done: 'Finished' },
      chronic: 'Chronic',
      expiring: 'Expiring',
      active: 'Active',
      expiryIn: (n) => `in ${n} days`,
      renew: 'Book a renewal visit',
      renewNote: 'Renewing a prescription requires a visit to your personal doctor',
      form100: 'Form 100',
      download: 'Download',
      expiryBadge: (n) => `${n} expiring`,
      today: 'Today',
      empty: 'No records found',
      emptyHint: 'Change the filters or the search text',
    },
    upl: {
      title: 'Upload a document',
      step: (n) => `${n} / 2`,
      hint: 'PDF, JPG, PNG · max 20MB',
      browse: 'Choose a file',
      replace: 'Replace file',
      name: 'Name',
      namePh: 'e.g. Lipid panel',
      clinic: 'Clinic',
      clinicPh: 'e.g. BMSC',
      date: 'Date',
      cat: 'Category',
      catPick: 'Choose',
      consent: 'Share with your personal doctor?',
      consentOn: (doc) => `${doc} will see this document`,
      consentOff: 'The document will be visible only to you',
      submit: 'Upload',
      cancel: 'Cancel',
      errFile: 'Choose a file',
      errName: 'Fill in the document name',
      errCat: 'Choose a category',
      added: 'Document uploaded',
    },
    prevTitle: 'Prevention',
    prevBook: 'Book',
    prevStatus: { due: 'Due', missed: 'Missed', done: 'Done' },
    remTitle: 'Reminders',
    remChannels: 'Push · SMS · Email — per type',
    rebook: 'Reschedule',
    crumbHome: 'Home',
  },
}


export const D = lang === 'en' ? enDash : kaDash
