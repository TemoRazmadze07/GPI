/* B2B CORPO portal strings — Georgian (ka). Kept separate from the My-Cabinet
   strings so the two platform contexts stay cleanly splittable (Rule 5). */
import { ASSETS } from '../lib/assets.js'

/* The message-body prompt is deliberately GENERAL: the same words serve a
   brand-new letter and a reply inside an open thread, so it is defined ONCE here
   and read by both the compose drawer (compose_.bodyPh) and the thread composer
   (msgs.msgPlaceholder) — Rule 1, never re-inline. */
const MSG_PLACEHOLDER = 'დაწერე შეტყობინება'

export const kaB2B = {
  /* Shared action labels — one action, one label, one string. The add-policy CTA
     appears in the topbar (global), on Contracts and on Policies; all three route to
     the add-insured wizard, so they MUST read identically (Rule 1). Never re-inline. */
  actions: {
    addPolicy: 'პოლისის დამატება',
  },
  topbar: {
    corpoTag: 'CORPO',
    client: 'შპს მაგალითი კომპანია',
    clientShort: 'მაგალითი კომპანია',
    clientMark: 'MK',
    // Per-client logo (production: each corporate account has its own). null → initials fallback.
    clientLogo: ASSETS.clientLogo,
    search: 'ძიება — პირი, პოლისი, ინვოისი…',
    searchClear: 'ძიების გასუფთავება',
    notifications: 'შეტყობინებები',
    home: 'GPI CORPO — მთავარ გვერდზე',
    user: 'გიორგი გვარიძე',
    role: 'ადმინი',
  },
  /* Company switcher — the client chip's dropdown (multi-company accounts). */
  switcher: {
    trigger: (name) => `აქტიური კომპანია — ${name}. კომპანიის შეცვლა`,
    heading: 'კომპანიები',
    meta: (taxId, n) => `ს/კ ${taxId} · ${n} დაზღვეული`,
  },
  nav: {
    home: 'მთავარი',
    policies: 'პოლისები',
    contracts: 'კონტრაქტები',
    requests: 'მოთხოვნები',
    claims: 'ზარალები',
    finances: 'ფინანსები',
    invoices: 'ინვოისები',
    statement: 'ამონაწერი',
    messages: 'მიმოწერა',
    service: 'სერვისი',
    guide: 'გზამკვლევი',
    offers: 'შეთავაზებები',
    admin: 'ადმინისტრირება',
    adminUsers: 'მომხმარებლები და როლები',
    adminOrg: 'ორგანიზაცია',
    collapse: 'ჩაკეცვა',
    expand: 'გაშლა',
  },
  launcher: {
    open: 'სერვის-მენეჯერთან დაკავშირება',
    title: 'თქვენი სერვის-მენეჯერი',
    name: 'ნინო ნინოძე',
    phone: '2 505 111',
    phoneHref: 'tel:+995322505111',
    email: 'n.ninodze@gpih.ge',
  },
  /* Notification center — bell popover (concept locked 2026-08-06).
     Category labels double as the row meta and the filter menu entries. */
  notif: {
    title: 'შეტყობინებები',
    bellUnread: (n) => `შეტყობინებები — ${n} წაუკითხავი`,
    markAll: 'ყველას წაკითხვა',
    filterAll: 'ყველა',
    filterUnread: 'წაუკითხავი',
    filterLabel: 'შეტყობინებების ფილტრი',
    statusLabel: 'სტატუსი',
    categoryLabel: 'კატეგორია',
    categoryAll: 'ყველა',
    categories: {
      requests: 'მოთხოვნები',
      finances: 'ფინანსები',
      contracts: 'კონტრაქტები / პოლისები',
      claims: 'ზარალები',
      other: 'სხვა',
    },
    chips: {
      action: 'საჭიროებს მოქმედებას',
      renewal: 'განახლების პერიოდი',
    },
    unreadMark: 'წაუკითხავი',
    emptyInbox: 'შეტყობინებები არ არის',
    emptyUnread: 'ყველაფერი წაკითხულია',
    emptyFilter: 'ამ კატეგორიაში შეტყობინებები არ არის',
    clearFilter: 'ფილტრის გასუფთავება',
  },
  /* Messaging (მიმოწერა) — org↔GPI conversations. Category labels are NOT
     duplicated here: messaging reuses kaB2B.notif.categories verbatim (one
     taxonomy, Rule 1). „შეტყობინებები" stays the bell's word; two-way threads
     are „მიმოწერა" — the two surfaces must never share a name. */
  msgs: {
    title: 'მიმოწერა',
    iconUnread: (n) => `მიმოწერა — ${n} წაუკითხავი`,
    compose: 'ახალი წერილი',
    viewAll: 'ყველას ნახვა',
    search: 'ძიება თემით…',
    searchClear: 'ძიების გასუფთავება',
    subtitle: (n) => `${n} მიმოწერა GPI-სთან`,
    you: 'თქვენ',
    gpi: 'GPI',
    unreadMark: 'წაუკითხავი',
    attachedMark: 'დანართით',
    filterLabel: 'წერილების ფილტრი',
    statusLabel: 'სტატუსი',
    categoryLabel: 'კატეგორია',
    filterAll: 'ყველა',
    filterUnread: 'წაუკითხავი',
    categoryAll: 'ყველა',
    emptyList: 'მიმოწერა არ არის',
    emptyListHint: 'დაიწყეთ პირველი წერილი GPI-სთან',
    emptyUnread: 'ყველაფერი წაკითხულია',
    emptyFilter: 'ამ ფილტრით წერილები არ არის',
    clearFilter: 'ფილტრის გასუფთავება',
    emptyThread: 'აირჩიეთ მიმოწერა სიიდან',
    emptyThreadHint: 'ან დაიწყეთ ახალი წერილი',
    msgPlaceholder: MSG_PLACEHOLDER,
    replyLabel: 'პასუხი',
    send: 'გაგზავნა',
    attach: 'დანართის დამატება',
    removeAttachment: (name) => `დანართის მოხსნა — ${name}`,
    /* Sent-attachment card: the name opens a preview, the ↓ downloads, the ⋮ holds
       both as explicit labels (Slack's grammar — open and download stay separate). */
    att: {
      openLabel: (name) => `${name} — გახსნა`,
      open: 'გახსნა',
      close: 'დახურვა',
      download: 'ჩამოტვირთვა',
      downloadLabel: (name) => `${name} — ჩამოტვირთვა`,
      actions: (name) => `${name} — მოქმედებები`,
      noFile: 'ფაილი მიუწვდომელია',
      noFileHint: 'ამ დემო დანართს ფაილი არ ახლავს — პროტოტიპში ვიდეო არ გენერირდება.',
      previewUnsupported: 'ამ ტიპის ფაილის ნახვა ბრაუზერში ვერ ხდება',
      previewUnsupportedHint: 'ჩამოტვირთეთ და გახსენით შესაბამის პროგრამაში.',
      sheetRows: (n) => `ნაჩვენებია პირველი ${n} სტრიქონი`,
      sheetEmpty: 'ფაილი ცარიელია',
      sheetError: 'ფაილის წაკითხვა ვერ მოხერხდა',
      loading: 'იტვირთება…',
    },
    catSettings: 'კატეგორიების ჩვენება',
    catSettingsHint: 'რომელი კატეგორიების წერილები გაჩვენოთ?',
    catHiddenNote: 'დამალული კატეგორიის წერილები არ იკარგება — მხოლოდ თქვენ არ გიჩანთ.',
    /* Compact, ALWAYS-present counter beside the ⚙ trigger: shown/total. Replaced the
       „N კატეგორია დამალულია" chip, which wrapped to two lines and shifted the footer.
       Numbers are decorative — catCountLabel carries the meaning for assistive tech. */
    catCount: (shown, total) => `${shown}/${total}`,
    catCountLabel: (shown, total) => `${total}-დან ${shown} კატეგორია ჩანს`,
    compose_: {
      title: 'ახალი წერილი',
      category: 'კატეგორია',
      categoryPh: 'აირჩიეთ კატეგორია',
      subject: 'თემა',
      subjectPh: 'მოკლედ აღწერეთ საკითხი',
      body: 'წერილი',
      bodyPh: MSG_PLACEHOLDER,
      attachTitle: 'ჩააგდეთ ფაილი აქ',
      attachBrowse: 'ფაილის არჩევა',
      attachHint: 'PDF, Word, Excel ან ვიდეო (MP4/MOV) · მაქს. 25 MB',
      attachTypeErr: 'ფაილის ეს ტიპი მხარდაჭერილი არ არის',
      attachSizeErr: 'ფაილი აღემატება 25 MB-ს',
      cancel: 'გაუქმება',
      send: 'გაგზავნა',
      required: 'სავალდებულო ველი',
      discard: 'წერილი არ გაიგზავნება — დახუროთ?',
      sideTitle: 'როგორ მუშაობს',
      sideBody:
        'წერილი გადაეცემა თქვენს მომსახურე გუნდს GPI-ში. პასუხი ჩვეულებრივ 1 სამუშაო დღეშია — შეტყობინებას აქვე მიიღებთ.',
    },
  },
  crumbsLabel: 'გვერდის მდებარეობა',
  stub: {
    placeholder: 'გვერდის კონტენტი — შემდეგი ეტაპი',
    export: 'ექსპორტი',
  },
  /* Filter Bar / Filter Popover — the common table-toolbar pattern (2026-07-15).
     Shared by every B2B table; component takes all text via this block. */
  filterBar: {
    filter: 'ფილტრი',
    apply: 'გაფილტვრა',
    clear: 'გასუფთავება',
    results: (n) => `${n} შედეგი`,
    export: 'CSV ექსპორტი',
    appliedLabel: 'აქტიური ფილტრები',
    remove: 'მოხსნა',
    rangeFrom: 'თარიღიდან',
    rangeTo: 'თარიღამდე',
    datePlaceholder: 'დდ.თთ.წწწწ',
    prevMonth: 'წინა თვე',
    nextMonth: 'შემდეგი თვე',
    /* generic date presets — shared by every range filter */
    presets: {
      last3m: 'ბოლო 3 თვე',
      last6m: 'ბოლო 6 თვე',
      last12m: 'ბოლო 12 თვე',
      thisYear: 'მიმდინარე წელი',
      lastYear: 'გასული წელი',
    },
  },
  /* Customize-table dialog — shared by every Data Table (2026-07-16) */
  tableCustomize: {
    title: 'ცხრილის მორგება',
    save: 'შენახვა',
    cancel: 'გაუქმება',
    always: 'ყოველთვის ჩანს',
    move: 'გადაადგილება',
  },
  policies: {
    subtitle: (n, p) => `${n} პოლისი · ${p} პროდუქტი`,
    tabsLabel: 'პროდუქტი',
    status: { active: 'აქტიური', ended: 'დასრულებული', canceled: 'გაუქმებული' },
    relation: { employee: 'თანამშრომელი', spouse: 'მეუღლე', child: 'შვილი', parent: 'მშობელი' },
    familyGroup: 'ოჯახის წევრი',
    perMonth: '/ თვე',
    filterCats: {
      status: 'სტატუსი',
      contract: 'კონტრაქტი',
      package: 'პაკეტი',
      relation: 'კავშირი',
      period: 'პერიოდი',
      type: 'ტიპი',
    },
    cols: {
      insured: 'დაზღვეული',
      person: 'სახელი გვარი',
      pid: 'პირადი №',
      relation: 'კავშირი',
      package: 'პაკეტი',
      premium: 'პრემია',
      contract: 'კონტრაქტი №',
      policy: 'პოლისი №',
      start: 'დაწყება',
      end: 'დასრულება',
      status: 'სტატუსი',
      plate: 'სახ. ნომერი',
      vehicle: 'ავტომობილი',
      owner: 'მფლობელი',
      period: 'პერიოდი',
      object: 'ობიექტი',
      type: 'ტიპი',
      sum: 'სად. თანხა',
    },
    search: {
      health: 'ძიება — სახელი, პირადი № ან პოლისი',
      auto: 'ძიება — ნომერი, მოდელი ან მფლობელი',
      travel: 'ძიება — სახელი, პირადი № ან პოლისი',
      property: 'ძიება — მისამართი ან პოლისი',
    },
    actions: {
      menu: 'მოქმედებები',
      details: 'დეტალურად',
      /* One action, one label (Rule 1): used by the ⋮ menu AND the view-mode
         drawer footer — both flip the drawer into edit mode. */
      edit: 'პოლისის ცვლილება',
      pdf: 'PDF-ის გაგზავნა',
      cancel: 'პოლისის გაუქმება',
    },
    emptyTitle: 'პოლისი ვერ მოიძებნა',
    emptyHint: 'შეცვალეთ ან გაასუფთავეთ ფილტრები და ძიება',
    emptyAction: 'ყველას ჩვენება',
    /* Edit-insured drawer (2026-08-11): row click / „დეტალურად" on the HEALTH
       tab opens the step-2 form pre-populated; save = change REQUEST to GPI
       (no review step in the UI, but the async pipeline stays — the info alert
       reuses addIns.side.nextBody so the two flows describe it identically). */
    editDrawer: {
      title: 'დაზღვეულის რედაქტირება',
      /* View mode (2026-08-11): „დეტალურად" / row click open READ-ONLY facts
         first; the edit form is behind the explicit „პოლისის ცვლილება". */
      viewTitle: 'დაზღვეულის დეტალები',
      close: 'დახურვა',
      policyLabel: 'პოლისი',
      introTitle: 'რა მოხდება შენახვის შემდეგ',
      save: 'შენახვა',
      cancel: 'გაუქმება',
      closeConfirm: 'შეტანილი ცვლილებები დაიკარგება. დახურავთ?',
      pending: 'მუშავდება',
      successTitle: 'მოთხოვნა გაიგზავნა',
      successBody: (no, name) => `${name} — ცვლილებების მოთხოვნა ${no} მიღებულია. პასუხი ≤ 24 საათში.`,
    },
    /* Remove-policy confirmation (2026-08-11): the ⋮ „პოლისის გაუქმება" action
       opens a ConfirmDialog (danger variant — red confirm + safe keep). The
       keep label is „დატოვება", NOT „გაუქმება" — the destructive verb itself
       is გაუქმება here, so a გაუქმება cancel button would read as confirming. */
    removeDialog: {
      title: 'პოლისის გაუქმება',
      body: (subject, id) =>
        `${subject} — პოლისი ${id} გაუქმდება და დაზღვევა შეწყდება. გაუქმების შემდეგ დაბრუნება ვერ ხერხდება — საჭიროებისას პოლისს თავიდან დაამატებთ.`,
      confirm: 'პოლისის გაუქმება',
      keep: 'დატოვება',
      pending: 'უქმდება',
      successBody: (no, subject) => `${subject} — პოლისის გაუქმების მოთხოვნა ${no} მიღებულია. პასუხი ≤ 24 საათში.`,
    },
  },
  contracts: {
    all: 'ყველა',
    subtitle: (n, p) => `${n} კონტრაქტი · ${p} პროდუქტი`,
    searchPlaceholder: 'ძიება — № ან პროდუქტი',
    productSearch: 'პროდუქტის ძიება…',
    filterCats: { status: 'სტატუსი', product: 'პროდუქტი', period: 'პერიოდი' },
    cols: {
      number: 'კონტრაქტის №',
      product: 'პროდუქტი',
      start: 'დაწყება',
      end: 'დასრულება',
      insured: 'დაზღვეული',
      status: 'სტატუსი',
    },
    status: { active: 'აქტიური', ended: 'დასრულებული' },
    actions: {
      menu: 'მოქმედებები',
      details: 'დეტალურად',
      viewPolicies: 'პოლისების ნახვა',
    },
    emptyTitle: 'კონტრაქტი ვერ მოიძებნა',
    emptyHint: 'შეცვალეთ ან გაასუფთავეთ ფილტრები და ძიება',
    emptyAction: 'ყველას ჩვენება',
    /* Contract-details drawer (shared Drawer shell, 2026-07-16). Title is
       GENERIC on purpose — every detail drawer reads "<record> დეტალები" and
       record identity lives in the body, unifying the drawer experience. */
    drawer: {
      title: 'კონტრაქტის დეტალები',
      name: 'დასახელება',
      number: 'კონტრაქტის №',
      period: 'პერიოდი',
      insured: 'დაზღვეული',
      premium: 'წლიური პრემია',
      schedule: 'გადახდის გრაფიკი',
      included: 'რა შედის კონტრაქტში',
      documents: 'დოკუმენტები',
      contractPdf: 'კონტრაქტი (PDF)',
      download: 'ჩამოტვირთვა',
      close: 'დახურვა',
    },
  },
  /* Invoices — the finances index (concept agreed 2026-07-20). */
  invoices: {
    subtitle: (n, overdue) => `${n} ინვოისი · ${overdue} ვადაგადაცილებული`,
    summary: {
      overdue: 'ვადაგადაცილებული',
      due: 'გადასახდელი',
      paidYtd: 'გადახდილი (წელს)',
      invoicesN: (n) => `${n} ინვოისი`,
      nextDue: (d) => `მომდევნო ვადა ${d}`,
      none: 'ყველა გადახდილია',
    },
    filterCats: { status: 'სტატუსი', product: 'პროდუქტი', contract: 'კონტრაქტი', period: 'პერიოდი' },
    searchPlaceholder: 'ძიება — ინვოისის № ან კონტრაქტი',
    productSearch: 'პროდუქტის ძიება…',
    cols: {
      invoice: 'ინვოისი',
      subject: 'კონტრაქტი / პერიოდი',
      due: 'გადახდის ვადა',
      amount: 'თანხა',
      status: 'სტატუსი',
    },
    status: { overdue: 'ვადაგადაცილებული', due: 'გადასახდელი', paid: 'გადახდილი', credited: 'გაუქმებული' },
    rel: {
      overdue: (n) => `${n} დღით ვადაგადაცილ.`,
      due: (n) => `${n} დღეში`,
      paid: 'გადახდილი',
    },
    actions: { menu: 'მოქმედებები', details: 'დეტალურად', pay: 'გადახდა', pdf: 'PDF-ის ჩამოტვირთვა' },
    /* Invoice-details drawer — shares the contract-drawer language + adds an
       amount hero and a "what it covers" breakdown. */
    drawer: {
      title: 'ინვოისის დეტალები',
      amountDue: 'გადასახდელი თანხა',
      amountPaid: 'გადახდილი თანხა',
      dueOverdue: (d, n) => `ვადა ${d} · ${n} დღით ვადაგადაცილებული`,
      dueSoon: (d, n) => `ვადა ${d} · ${n} დღეში`,
      paidOn: (d) => `გადახდილია ${d}`,
      canceled: 'გაუქმებული ინვოისი',
      contract: 'კონტრაქტი',
      product: 'პროდუქტი',
      period: 'პერიოდი',
      issued: 'გამოწერის თარიღი',
      due: 'გადახდის ვადა',
      paidDate: 'გადახდის თარიღი',
      breakdown: 'რას მოიცავს',
      illustrative: '(საილუსტრაციო)',
      colItem: 'პოზიცია',
      colQty: 'რაოდ.',
      colAmount: 'თანხა',
      total: 'სულ',
      documents: 'დოკუმენტები',
      invoicePdf: 'ინვოისი (PDF)',
      download: 'ჩამოტვირთვა',
      close: 'დახურვა',
    },
    emptyTitle: 'ინვოისი ვერ მოიძებნა',
    emptyHint: 'შეცვალეთ ან გაასუფთავეთ ფილტრები და ძიება',
    emptyAction: 'ყველას ჩვენება',
  },
  /* Statement — read-only per-insured premium ledger (concept agreed 2026-07-20). */
  statement: {
    subtitle: (n) => `${n} ჩანაწერი · პრემიის განაწილება (კომპანია / თანამშრომელი) · მხოლოდ ჯანმრთელობა`,
    filterCats: { period: 'პერიოდი', contract: 'კონტრაქტი', package: 'პაკეტი', status: 'სტატუსი' },
    searchPlaceholder: 'ძიება — სახელი, პირადი № ან კონტრაქტი',
    cols: {
      insured: 'დაზღვეული',
      pid: 'პირადი №',
      contract: 'კონტრაქტი №',
      package: 'პაკეტი',
      period: 'პერიოდი',
      premium: '₾ / თვე',
      paid: 'გადახდილი',
      companyPct: 'კომპ. %',
      companyGel: 'კომპ. ₾',
      employeePct: 'თანამშ. %',
      employeeGel: 'თანამშ. ₾',
      status: 'სტატუსი',
    },
    status: { paid: 'გადახდილი', due: 'გადასახდელი' },
    emptyTitle: 'ჩანაწერი ვერ მოიძებნა',
    emptyHint: 'შეცვალეთ ან გაასუფთავეთ ფილტრები და ძიება',
    emptyAction: 'ყველას ჩვენება',
  },
  addIns: {
    /* Matches actions.addPolicy — the CTA label and the page it lands on must read
       the same. Step copy below stays person-centred (you add people; the result is
       policies), which is deliberate. */
    title: 'პოლისის დამატება',
    crumbParent: 'პოლისები',
    cancel: 'გაუქმება',
    cancelConfirm: 'შეყვანილი მონაცემები დაიკარგება. დატოვებთ გვერდს?',
    steps: { method: 'მეთოდი', data: 'მონაცემები', review: 'გადახედვა' },
    contractLabel: 'კონტრაქტი',
    contractSingle: 'ერთი აქტიური კონტრაქტი',
    /* Inline contract selector (2026-08-06): value = dropdown trigger when >1
       eligible contract; plain text otherwise. Switching with data present
       re-validates against the new contract's rules after a confirm. */
    contractSelect: 'კონტრაქტის არჩევა',
    contractInsured: (n) => `${n} დაზღვეული`,
    contractSwitch: {
      title: 'კონტრაქტის შეცვლა',
      bodyForm: 'შეყვანილი პირები შენარჩუნდება და შემოწმდება ახალი კონტრაქტის წესებით.',
      bodyExcel: 'ატვირთული ფაილი ხელახლა შემოწმდება ახალი კონტრაქტის წესებით — შედეგები შეიძლება შეიცვალოს.',
      confirm: 'შეცვლა',
      cancel: 'გაუქმება',
    },
    method: {
      heading: 'როგორ გსურთ თანამშრომლების დამატება?',
      single: { title: 'ერთი პირის დამატება', meta: 'ფორმით — ოჯახის წევრებთან ერთად' },
      excel: { title: 'Excel ატვირთვა', meta: 'სტანდარტული შაბლონი · ვალიდაცია' },
      link: { title: 'ბმულის გაგზავნა', meta: 'თანამშრომლები თავად შეავსებენ ფორმას' },
      hr: { title: 'HR სისტემიდან', meta: 'BambooHR, API ინტეგრაცია' },
      later: 'მოგვიანებით',
      soon: 'მალე',
      headcount: 'გჭირდებათ ჯამური რაოდენობის შემოწმება?',
      headcountBody: 'შეადარეთ შემოსავლების სამსახურის მონაცემებს — დარწმუნდით, რომ არავინ გამოგრჩათ.',
    },
    /* Excel import (step 2, Excel mode). Count-interpolating strings are arrow
       functions, matching this file's convention. Georgian nouns do not inflect
       after numerals, so `${n} სტრიქონი` is correct for every n — no plural
       helper. No Georgian ordinals anywhere: the formation is irregular
       (პირველ / მეორე / მესამე / მე-N) and a naive template produces wrong
       Georgian. */
    excel: {
      heading: 'ატვირთეთ თანამშრომლების სია',
      /* Step cards + the leading-zero tip removed 2026-08-06 (trained users; the
         validator catches header drift and padded PIDs anyway). Template = quiet
         inline link beside the heading. */
      download: 'შაბლონის ჩამოტვირთვა (.xlsx)',
      dropTitle: 'გადმოათრიეთ ფაილი აქ',
      dropBrowse: 'აირჩიეთ ფაილი',
      dropReplace: 'სხვა ფაილის არჩევა',
      dropReqs: '.xlsx · მაქსიმუმ 5 MB · მაქსიმუმ 500 სტრიქონი',
      dropHint: 'ოჯახის წევრი დაუკავშირეთ თანამშრომელს პირადი ნომრით.',
      clearFile: 'ფაილის მოხსნა',

      validating: 'მიმდინარეობს შემოწმება…',

      /* readSummary removed 2026-08-06 — row count lives in the strip stats;
         only notices (irregularities) still print, and only when present. */
      fileLabel: 'ფაილი',
      /* Fires AFTER the new file is picked (the strip's label opens the OS picker
         directly), so the dialog names the incoming file. 2026-08-06. */
      replaceTitle: 'ახალი ფაილის ატვირთვა?',
      replaceBody: (name) =>
        `„${name}" ჩაანაცვლებს ამჟამინდელ ფაილს — შეტანილი შესწორებები და წაშლილი სტრიქონები დაიკარგება.`,
      replaceYes: 'ატვირთვა',
      replaceKeep: 'დატოვება',
      switchConfirm: 'მეთოდის შეცვლისას შეყვანილი მონაცემები დაიკარგება. გავაგრძელოთ?',
      tableCaption: 'ატვირთული ფაილის სტრიქონები',
      filterLabel: 'სტრიქონების ფილტრი',
      ledger: (send, removed) => `გასაგზავნი: ${send} · წაშლილი: ${removed}`,

      stats: {
        total: 'სულ სტრიქონი',
        ready: 'გასაგზავნი',
        errors: 'შეცდომა',
        premium: 'ჯამური პრემია',
      },
      filters: {
        all: 'ყველა',
        errors: 'შეცდომით',
        warnings: 'გაფრთხილებით',
        exists: 'უკვე დაზღვეული',
        ready: 'მზადაა',
      },
      status: {
        ready: 'მზადაა',
        warning: 'გაფრთხილება',
        error: 'შეცდომა',
      },
      cols: {
        row: 'სტრ. №',
        name: 'სახელი გვარი',
        pid: 'პირადი №',
        birth: 'დაბ. თარიღი',
        package: 'პაკეტი',
        status: 'სტატუსი',
        issues: 'შენიშვნა',
      },

      rowRemove: 'სტრიქონის წაშლა',
      rowRestore: 'დაბრუნება',
      removeAllErrors: (n) => `ყველა შეცდომიანის წაშლა (${n})`,
      removedTray: (n) => `წაშლილი სტრიქონები (${n})`,
      removedShow: 'ჩვენება',
      removedHide: 'დამალვა',
      removedNote: 'წაშლილი სტრიქონები არ გაიგზავნება — მათი ცალკე ატვირთვა მოგვიანებით შეგიძლიათ.',

      emptyFilterTitle: 'ამ ფილტრში სტრიქონი აღარ არის',
      emptyFilterHint: 'ყველა შესწორდა ან წაიშალა.',
      emptyFilterAction: 'ყველას ჩვენება',

      /* blockTitle/blockBody/allClearTitle/allClearBody removed 2026-08-06 —
         the one-line summary + footer hint replaced both banners. */
      continueDisabled: (n) => `ჯერ გაასწორეთ ან წაშალეთ ${n} სტრიქონი`,
      continueEmpty: 'ატვირთეთ შევსებული ფაილი',

      drawer: {
        title: 'სტრიქონის გასწორება',
        close: 'დახურვა',
        next: 'შემდეგი შეცდომა',
        issuesTitle: 'რა უნდა გასწორდეს',
      },

      live: {
        selected: (name, size) => `ფაილი არჩეულია: ${name}, ${size}. მიმდინარეობს შემოწმება…`,
        doneClean: (n) => `შემოწმება დასრულდა. ${n} სტრიქონი მზადაა შეცდომების გარეშე.`,
        doneMixed: (total, ok, err, warn) =>
          `შემოწმება დასრულდა. ${total} სტრიქონი: ${ok} მზადაა, ${err} შეცდომა, ${warn} გაფრთხილება. სია გაფილტრულია შეცდომიან სტრიქონებზე.`,
        doneNone: (err) => `შემოწმება დასრულდა. ვერცერთი სტრიქონი ვერ დაემატება — ${err} შეცდომა.`,
        removed: (n) => `${n} სტრიქონი ამოღებულია. დაბრუნება შესაძლებელია წაშლილების სიიდან.`,
        removedCascade: (n, fam) => `${n} სტრიქონი ამოღებულია, მათ შორის ${fam} დაკავშირებული ოჯახის წევრი.`,
        restored: (n) => `${n} სტრიქონი დაბრუნებულია.`,
        filtered: (n) => `ნაჩვენებია ${n} სტრიქონი.`,
      },

      fileErr: {
        type: 'ფაილის ფორმატი არ არის მხარდაჭერილი. ატვირთეთ .xlsx ფაილი.',
        xls: 'ძველი ფორმატი (.xls). გახსენით Excel-ში და შეინახეთ როგორც .xlsx.',
        csv: 'CSV ფაილში ქართული ასოები ზიანდება. გახსენით Excel-ში და შეინახეთ როგორც .xlsx.',
        size: (mb, max) => `ფაილის ზომაა ${mb} MB — მაქსიმუმ ${max} MB.`,
        unreadable:
          'ფაილი ვერ წავიკითხეთ — შესაძლოა დაზიანებულია ან პაროლითაა დაცული. მოხსენით დაცვა, შეინახეთ ხელახლა .xlsx ფორმატში და სცადეთ თავიდან.',
        empty: 'ფაილი ცარიელია — შევსებული სტრიქონი ვერ ვიპოვეთ. შეავსეთ შაბლონი და ხელახლა ატვირთეთ.',
        wrongTemplate: (cols) =>
          `ეს GPI-ის შაბლონი არ არის — ვერ ვიპოვეთ სვეტები: ${cols}. ჩამოტვირთეთ შაბლონი და მონაცემები მასში გადაიტანეთ.`,
        headers: (cols) => `ვერ მოიძებნა სავალდებულო სვეტი: ${cols}. სვეტის სახელი ზუსტად უნდა ემთხვეოდეს შაბლონს.`,
        headerDup: (h) => `სვეტი „${h}" ორჯერაა — წაშალეთ დუბლიკატი და ხელახლა ატვირთეთ.`,
        tooManyRows: (n, max) =>
          `ფაილში ${n} სტრიქონია — მაქსიმუმ ${max}. დაყავით რამდენიმე ფაილად და ატვირთეთ ცალ-ცალკე.`,
      },

      notice: {
        multiSheet: (n, name) => `ფაილში ${n} ფურცელია — წავიკითხეთ მხოლოდ „${name}"`,
        extraCols: (cols) => `დამატებითი სვეტები არ გავითვალისწინეთ: ${cols}`,
        skippedEmpty: (n) => `${n} ცარიელი სტრიქონი გამოვტოვეთ`,
      },

      err: {
        who: (v) => `უცნობი ტიპი „${v}". დასაშვებია: თანამშრომელი, ოჯახის წევრი.`,
        whoInferred: 'ტიპი ცარიელია — ჩაითვალა „ოჯახის წევრად".',
        citizen: (v) => `უცნობი მოქალაქეობა „${v}" — ჩაითვალა „საქართველოს მოქალაქედ".`,
        pidLeadingZero: (pid) => `პირად ნომერს დაემატა წინა ნული — გადაამოწმეთ: ${pid}`,
        pidNonResident: 'არარეზიდენტის დოკუმენტის ნომერი უნდა შედგებოდეს 5–20 ასო-ციფრისგან.',
        date: 'თარიღი ჩაწერეთ ფორმატით დდ/თთ/წწწწ — მაგ. 05/03/1990.',
        dateInvalid: 'ასეთი თარიღი არ არსებობს — გადაამოწმეთ.',
        dateFuture: 'დაბადების თარიღი მომავალშია — გადაამოწმეთ.',
        dateOdd: 'დაბადების თარიღი უჩვეულოა — გადაამოწმეთ.',
        minorEmployee: 'თანამშრომელი 16 წელზე ნაკლებია — გადაამოწმეთ.',
        gender: (v) => `უცნობი მნიშვნელობა „${v}". დასაშვებია: მამრობითი, მდედრობითი.`,
        package: (v, list) => `უცნობი პაკეტი „${v}". დასაშვებია: ${list}.`,
        relation: (v, list) => `უცნობი კავშირი „${v}". დასაშვებია: ${list}.`,
        relationIgnored: 'თანამშრომელს კავშირი არ სჭირდება — ეს უჯრა არ გავითვალისწინეთ.',
        linkMissing: 'ოჯახის წევრს უნდა მიეთითოს თანამშრომლის პირადი ნომერი.',
        linkNotFound: (pid) => `თანამშრომელი პირადი ნომრით ${pid} ვერ მოიძებნა — ვერც ფაილში და ვერც უკვე დაზღვეულებში.`,
        linkSelf: 'პირი საკუთარ თავს ვერ დაუკავშირდება.',
        linkIsFamily: 'ბმა უნდა მიუთითებდეს თანამშრომელზე, არა ოჯახის წევრზე.',
        linkCascade: (n) => `დაკავშირებულ თანამშრომელს (სტრ. № ${n}) აქვს შეცდომა — ჯერ ის გაასწორეთ.`,
        dupInFile: (row) => `პირადი ნომერი ფაილში მეორდება (სტრ. № ${row}) — დატოვეთ ერთი.`,
        email: 'ელ-ფოსტის ფორმატი საეჭვოა — გადაამოწმეთ.',
        mobile: 'მობილურის ფორმატი საეჭვოა — მაგ. +995 5XX XXX XXX.',
      },

      exists: {
        label: 'უკვე დაზღვეულია',
        body: 'ეს პირი უკვე დაზღვეულია ამ კონტრაქტით — ხელახლა არ დაემატება.',
      },
    },
    who: {
      label: 'ვის ამატებთ?',
      employee: 'თანამშრომელი',
      employeeMeta: 'კომპანიის დასაქმებული',
      family: 'ოჯახის წევრი',
      familyMeta: 'თანამშრომელთან დაკავშირებული პირი',
    },
    form: {
      citizen: 'მოქალაქეობა',
      resident: 'საქართველოს მოქალაქე',
      nonresident: 'არარეზიდენტი',
      personalId: 'პირადი ნომერი',
      personalIdPh: 'მაგ. 01001001234',
      birthDate: 'დაბადების თარიღი',
      birthDatePh: 'დდ/თთ/წწწწ',
      found: 'მოიძებნა შემოსავლების სამსახურში',
      notFound: 'ამ მონაცემებით პირი ვერ მოიძებნა — შეავსეთ ველები ხელით.',
      firstName: 'სახელი',
      lastName: 'გვარი',
      gender: 'სქესი',
      genderPh: 'აირჩიეთ',
      male: 'მამრობითი',
      female: 'მდედრობითი',
      linkedTo: 'თანამშრომელი (ბმა)',
      linkedToPh: 'აირჩიეთ თანამშრომელი',
      linkedNew: 'ახალი:',
      relation: 'კავშირი',
      relationPh: 'აირჩიეთ კავშირი',
      mobile: 'მობილური',
      mobilePh: '+995 5XX XXX XXX',
      email: 'ელ-ფოსტა',
      emailPh: 'name@mail.ge',
      address: 'მისამართი',
      addressPh: 'ქ. თბილისი, ...',
      package: 'სადაზღვევო პაკეტი',
      packagePh: 'აირჩიეთ პაკეტი',
      policyType: 'პოლისის ტიპი',
      premium: 'ყოველთვიური პრემია',
      systemTag: 'სისტემიდან',
      policyTypeValue: 'ჯანმრთ. CORPO Standard',
      addToList: 'სიაში დამატება',
      updateInList: 'განახლება',
      clearForm: 'გასუფთავება',
      errRequired: 'სავალდებულო ველი',
      errPid: 'პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან.',
    },
    batch: {
      heading: 'სიაშია',
      empty: 'ჯერ არავინ დაგიმატებიათ — შეავსეთ ფორმა და დაამატეთ სიაში.',
      addFamily: 'ოჯახის წევრი',
      edit: 'რედაქტირება',
      remove: 'წაშლა',
      employeeTag: 'თანამშრომელი',
      perMonth: '₾/თვე',
    },
    side: {
      rulesTitle: 'კონტრაქტის წესები',
      rulesAuto: 'აქტიურდება ავტომატურად',
      ruleWindowTitle: 'დამატების ფანჯარა',
      ruleWindow: 'ყოველი თვის 1–25 რიცხვი',
      rulePackageTitle: 'პაკეტი',
      rulePackage: 'კონტრაქტიდან 3 თვის შემდეგ ახალი პირისთვის — მხოლოდ „ბაზისი"',
      ruleWaitTitle: 'ლოდინის პერიოდი',
      ruleWait: 'ორსულობა / მშობიარობა — 9 თვე',
      nextTitle: 'რა მოხდება შემდეგ',
      nextBody: 'ავტო-ვალიდაცია → GPI ბექ-ოფისი (≤ 24 სთ) → შეტყობინება',
      bulkTip: '10+ პირი? დაბრუნდით პირველ ნაბიჯზე და აირჩიეთ „Excel ატვირთვა".',
    },
    review: {
      heading: 'გადახედეთ და გააგზავნეთ',
      people: 'პირი',
      total: 'ჯამი',
      totalNote: 'დაემატება მომდევნო ინვოისს',
      submit: 'მოთხოვნის გაგზავნა',
    },
    done: {
      title: 'მოთხოვნა შეიქმნა',
      requestNo: 'მოთხოვნა #43512',
      status: 'დამუშავების პროცესში',
      meta: 'პასუხი ≤ 24 საათში — მიიღებთ შეტყობინებას',
      viewRequest: 'მოთხოვნის ნახვა',
      addMore: 'კიდევ დამატება',
      home: 'მთავარი გვერდი',
    },
  },
  /* Guide (გზამკვლევი) — employee-education hub (concept locked 2026-08-06).
     The admin's jobs: onboard new hires (kit), find-and-send material (library
     + one shared send flow), minimal monitoring (2 actionable stats + log). */
  guide: {
    title: 'გზამკვლევი',
    subtitle: 'ვიდეოები, FAQ და სახელმძღვანელოები თანამშრომლებისთვის',
    report: 'ჩართულობის ანგარიში',
    stats: {
      engagement: 'ჩართულობა MyGPI-ში',
      engagementMeta: (a, t) => `${a} / ${t} აქტიური მომხმარებელი`,
      openQ: 'ღია კითხვა',
      openQMeta: 'პასუხს ამზადებს GPI',
      allAnswered: 'ყველა კითხვას გაეცა პასუხი',
    },
    kit: {
      title: 'ახალი თანამშრომლის გზამკვლევი',
      lead: 'ერთი პაკეტი ყველაფრით, რაც ახალ დაზღვეულს პირველი დღიდან სჭირდება.',
      send: 'გაგზავნა',
      lastSent: (d, n) => `ბოლოს გაიგზავნა: ${d} · ${n} პირი`,
    },
    questions: {
      title: 'თანამშრომლების კითხვები',
      pending: 'პასუხის მოლოდინში',
      answered: 'პასუხი გაცემულია',
      note: 'კითხვებს პასუხობს GPI-ის გუნდი — აქ სტატუსი ჩანს.',
    },
    library: {
      search: 'ძებნა ყველა მასალაში — ვიდეო, FAQ, სახელმძღვანელო…',
      tabs: { videos: 'ვიდეოები', faqs: 'FAQ', handbooks: 'სახელმძღვანელოები' },
      tabsLabel: 'მასალის ტიპი',
      watch: 'ნახვა',
      send: 'გაგზავნა',
      sendTo: (title) => `გაგზავნა — ${title}`,
      download: 'ჩამოტვირთვა',
      helpful: (p) => `${p}% სასარგებლო`,
      flags: { top: 'პოპულარული', new: 'ახალი' },
      results: (n) => `ნაპოვნია ${n} მასალა`,
      noResults: 'ვერაფერი მოიძებნა',
      noResultsHint: 'სცადეთ სხვა საძიებო სიტყვა',
      /* bundle/blog = version-B item types; the shared send drawer labels them.
         'bundle' is the TECHNICAL key only — the user-facing label is
         „გზამკვლევი" (user, 2026-08-17). */
      types: { video: 'ვიდეო', faq: 'FAQ', handbook: 'PDF', kit: 'კიტი', bundle: 'გზამკვლევი', blog: 'ბლოგი' },
      expand: 'პასუხის ნახვა',
    },
    history: {
      title: 'გაგზავნების ისტორია',
      caption: 'გაგზავნილი მასალების ისტორია',
      cols: { date: 'თარიღი', material: 'მასალა', to: 'მიმღები', channel: 'არხი', status: 'სტატუსი' },
      people: (n) => `${n} პირი`,
      delivered: 'ჩაბარებულია',
      today: 'დღეს',
      actions: {
        menu: 'მოქმედებები',
        resend: 'ხელახლა გაგზავნა',
        viewMaterial: 'მასალის ნახვა',
      },
    },
    send: {
      title: 'მასალის გაგზავნა',
      what: 'რა იგზავნება',
      to: 'ვის',
      toLabel: 'მიმღებები',
      groupAll: (n) => `ყველა დაზღვეული (${n})`,
      groupRecent: (n) => `ბოლოს დამატებულები (${n})`,
      groupContract: 'კონტრაქტის მიხედვით',
      contractMeta: (n) => `${n} დაზღვეული`,
      alreadySent: (d) => `ამ ჯგუფს ეს მასალა უკვე გაეგზავნა — ${d}`,
      channel: 'არხი',
      channelLabel: 'გაგზავნის არხი',
      channels: { email: 'ელ. ფოსტა', sms: 'SMS' },
      preview: 'რას მიიღებს თანამშრომელი',
      previewFromEmail: 'GPI Holding · noreply@gpih.ge',
      previewFromSms: 'GPI',
      previewSubject: 'სასარგებლო მასალა თქვენი დაზღვევის შესახებ',
      previewBody: (company, title) => `გამარჯობა! „${company}" გიზიარებთ: „${title}". იხილეთ ბმულზე:`,
      previewLink: 'gpih.ge/g/a7x2k9',
      cancel: 'გაუქმება',
      submit: (n) => `გაგზავნა · ${n} პირი`,
      confirmTitle: 'მასალის გაგზავნა',
      confirmBody: (n, ch) => `მასალა გაეგზავნება ${n} ადამიანს ${ch}. გავაგრძელოთ?`,
      confirmChannel: { email: 'ელ. ფოსტით', sms: 'SMS-ით' },
      confirmSend: 'გაგზავნა',
      keep: 'გადახედვა',
      successTitle: 'მასალა გაიგზავნა',
      successBody: (n) => `მასალა გაეგზავნა ${n} ადამიანს. ჩართულობის ანგარიში ხელმისაწვდომი იქნება 24 საათში.`,
      close: 'დახურვა',
    },
    /* VERSION B (concept locked 2026-08-17) — feed of GPI-published items
       (bundles + blogs), per-item detail pages, external employee page.
       v A strings above stay untouched; the demo A/B switch is DemoBar. */
    b: {
      subtitle: 'გზამკვლევები და ბლოგები თანამშრომლებისთვის — გაგზავნეთ და თვალი ადევნეთ ჩართულობას',
      filters: { all: 'ყველა', bundle: 'გზამკვლევები', blog: 'ბლოგები' },
      filtersLabel: 'მასალის ტიპი',
      /* Named by scope — the library card below has its own material search. */
      search: 'ძებნა გზამკვლევებსა და ბლოგებში…',
      libraryTitle: 'მასალების ბიბლიოთეკა',
      libraryHint: 'ცალკეული ვიდეო, FAQ და სახელმძღვანელო — იგზავნება გზამკვლევის გარეშეც',
      by: 'GPI Holding',
      publishedAt: (d) => `გამოქვეყნდა ${d}`,
      open: 'გახსნა',
      openTo: (title) => `გახსნა — ${title}`,
      sentMeta: (n, p) => `გაეგზავნა ${n} თანამშრომელს · გახსნა ${p}%`,
      notSent: 'ჯერ არ გაგზავნილა',
      stats: {
        sends: 'გაგზავნილი მასალა',
        lastSend: (d) => `ბოლო გაგზავნა — ${d}`,
        noSends: 'გაგზავნები ჯერ არ არის',
      },
      item: {
        sections: { videos: 'ვიდეოები', faqs: 'ხშირი კითხვები', instruction: 'ინსტრუქცია' },
        engagement: 'ჩართულობა',
        /* „შეფასება" replaced „სასარგებლო %" 2026-08-17: the number now comes
           from the employees' 5-star votes on the external page, so it is a
           real average, not an invented percentage. */
        engRows: { sent: 'გაეგზავნა', open: 'გახსნა', rating: 'შეფასება' },
        engPeople: (n) => `${n} პირი`,
        ratingValue: (avg) => `${avg} / 5`,
        ratingCount: (n) => `${n} შეფასება`,
        noRating: 'ჯერ არ არის შეფასებული',
        engNote: 'განახლდება გაგზავნიდან 24 საათში',
        historyEmpty: 'ეს მასალა ჯერ არ გაგზავნილა — გააგზავნეთ პირველად.',
        viewAs: 'ნახვა როგორც თანამშრომელმა',
        notFound: 'მასალა ვერ მოიძებნა',
        backToGuide: 'გზამკვლევზე დაბრუნება',
      },
      /* v B send flow (user feedback 2026-08-17): one audience Select,
         email+SMS checkboxes, editable SMS text, copyable guide link. */
      send2: {
        audience: 'აუდიტორია',
        channels: 'არხები',
        atLeastOne: 'აირჩიეთ მინიმუმ ერთი არხი',
        both: 'ელ. ფოსტა + SMS',
        confirmBoth: 'ელ. ფოსტით და SMS-ით',
        smsLabel: 'SMS ტექსტი',
        smsHint: 'სტანდარტული ტექსტია — შეცვალეთ საჭიროებისას.',
        chars: (n) => `${n} სიმბოლო`,
        linkNote: 'ბმული ავტომატურად დაემატება',
        copyLink: 'ბმულის კოპირება',
        /* Toast text — success feedback lives beside the flow, the link
           controls themselves never change (user rule 2026-08-17). */
        linkCopied: 'ბმული დაკოპირდა',
        copyFailed: 'კოპირება ვერ მოხერხდა — მონიშნეთ ბმული ხელით',
      },
      /* External-page rating (user 2026-08-17): ONE click = the vote; the
         follow-up question appears only on a low score, so a happy reader is
         never asked twice. */
      rate: {
        q: 'რამდენად სასარგებლო იყო ეს გზამკვლევი?',
        hint: 'შეფასება ანონიმურია',
        star: (n) => `${n} ვარსკვლავი`,
        scaleLabel: 'შეფასება 5-დან',
        thanks: 'გმადლობთ გამოხმაურებისთვის',
        yours: (n) => `თქვენი შეფასება — ${n}/5`,
        lowTitle: 'რა დააკლდა?',
        lowPh: 'მოკლედ აღწერეთ — არასავალდებულოა',
        send: 'გაგზავნა',
        commentThanks: 'თქვენი კომენტარი გადაეცა GPI-ს',
      },
      pub: {
        tagline: 'თანამშრომლის გზამკვლევი',
        from: (c) => `„${c}" გიზიარებთ სასარგებლო მასალას`,
        onThisPage: 'ამ გვერდზე',
        footHelp: 'კითხვები დაზღვევაზე? ცხელი ხაზი 24/7:',
        hotline: '2 505 111',
        footNote: '© GPI Holding',
      },
    },
  },
  pages: {
    home: { title: 'მთავარი გვერდი', subtitle: 'მიმოხილვა და შეხსენებები' },
    contracts: { title: 'კონტრაქტები' },
    requests: { title: 'მოთხოვნები', subtitle: '7 მიმდინარე მოთხოვნა' },
    claims: { title: 'ზარალები', subtitle: '3 ელოდება თქვენს დადასტურებას' },
    invoices: { title: 'ინვოისები', subtitle: '1 ვადაგადაცილებული · ₾ 6,450' },
    statement: { title: 'ამონაწერი', subtitle: 'პრემიის განაწილება — კომპანია / თანამშრომელი' },
    /* guide: real screen since 2026-08-06 — its strings live in the top-level
       `guide` block, so no stub entry (one label, one string; Rule 1). */
    offers: { title: 'შეთავაზებები', subtitle: 'შეთავაზებები კომპანიისა და თანამშრომლებისთვის' },
    adminUsers: { title: 'მომხმარებლები და როლები', subtitle: 'წვდომის მართვა' },
    adminOrg: { title: 'ორგანიზაცია', subtitle: 'კომპანიის მონაცემები' },
  },
}
