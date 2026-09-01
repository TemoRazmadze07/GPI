/* Payment portal (devpayment.gpih.ge redesign) — Georgian copy. Own Rule 5
   surface. Georgian-only for now; structured for an EN mirror later (same
   pattern as i18n/strings.en.js) if the portal goes bilingual. */
export const P = {
  shell: {
    logout: 'გასვლა',
    logoAlt: 'GPI — ჯიპიაი ჰოლდინგი',
  },
  login: {
    title: 'გადაიხადე პოლისის შენატანი',
    lead: 'იპოვე შენი პოლისები პირადი ნომრით — ანგარიშის შექმნა საჭირო არ არის.',
    pid: 'პირადი ნომერი',
    pidPh: '01001000000',
    dob: 'დაბადების თარიღი',
    dobPh: 'დდ/თთ/წწწწ',
    cta: 'გადამოწმება',
    required: 'სავალდებულო ველი',
    pidFormat: 'პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან.',
    dobFormat: 'მიუთითე თარიღი ფორმატით დდ/თთ/წწწწ.',
    help: 'პრობლემა გაქვს? დაგვიკავშირდი 032 2 505 111',
  },
  otp: {
    title: 'დაადასტურე ნომერი',
    sent: 'ერთჯერადი კოდი გამოგზავნილია ნომერზე',
    label: 'ერთჯერადი კოდი',
    cta: 'ავტორიზაცია',
    expiresIn: 'კოდი აქტიურია',
    expired: 'კოდს ვადა გაუვიდა.',
    resend: 'ხელახლა გაგზავნა',
    resent: 'ახალი კოდი გამოგზავნილია.',
    wrong: 'კოდი არასწორია. სცადე ხელახლა.',
    demoHint: 'პროტოტიპი: ნებისმიერი 4 ციფრი მუშაობს (0000 — შეცდომის ჩვენება).',
  },
  policies: {
    title: 'რომელი პოლისი გსურს გადაიხადო?',
    lead: 'აირჩიე პოლისი და გადადი გადახდაზე.',
    due: 'დავალიანება',
    noDue: 'დავალიანება არ არის',
    active: 'მოქმედი',
    cta: 'გაგრძელება',
    total: 'სულ დავალიანება',
  },
  pay: {
    title: 'გადახდა',
    back: 'უკან',
    dueLabel: 'გადასახდელი',
    active: 'მოქმედი',
    orCard: 'ან ბარათით გადახდა',
    /* Visa campaign — benefit wording is a PLACEHOLDER („მეტი ქულა") until the
       user clarifies the real mechanics (2026-08-31). Keep the block modular. */
    /* Copy taken verbatim from GPI's own campaign banner (Figma
       "Frame 1321316779", exported 2026-09-01) — it is the approved wording and
       is presumably cleared with Visa, so it is not ours to paraphrase. */
    promoTitle: 'მიიღე დამატებითი ბენეფიტები',
    promoBody: 'გადაიხადე VISA ბარათით და მიიღე დამატებითი ბენეფიტები ყველა გადახდაზე',
    /* Tier choice (user's mock, 2026-09-01). Sub-labels show the computed
       POINT AMOUNT — never the percentage (explicit campaign requirement). */
    promoChoose: 'აირჩიეთ რომელი ბარათით გადაიხდით',
    promoOther: 'სხვა ბარათი',
    promoTierDesc: (pts) => `+${pts} ბრუნოს ქულა ან ბენეფიტ-პაკეტი`,
    promoTerms: 'აქციის სრული დეტალები',
    promoTermsLink: 'იხილეთ ბმულზე',
    /* No longer claims the card WILL be saved — saving is now an explicit,
       unticked choice (see saveCard). If GPI confirms that every payment
       must store the card, delete the checkbox and put that fact back here. */
    newUserInfo: 'ბარათის მონაცემებს შეიყვან ლიბერთი ბანკის დაცულ გვერდზე.',
    saveCard: 'დაიმახსოვრე ბარათი',
    saveCardHint: 'მომდევნო გადახდები ერთი შეხებით. ბარათის მონაცემებს ინახავს ბანკი, არა GPI.',
    methodsLabel: 'აირჩიე გადახდის მეთოდი',
    benefitBadge: '+ მეტი ქულა',
    newCard: 'ახალი ბარათით გადახდა',
    newCardSub: 'ბანკის დაცული გვერდი · Visa — მეტი ქულა',
    ctaPay: 'გადახდა',
    ctaPayCard: 'ბარათით გადახდა',
    /* Consent copy is TBC — depends on whether auto-pay enrollment really is
       bundled with every payment (open question to GPI). */
    consent: 'გადახდის დადასტურებით აქტიურდება ყოველთვიური ავტომატური გადახდა შერჩეული ბარათიდან.',
    linkCard: 'ბარათის მიბმა გადახდის გარეშე',
    trust: 'გადახდას იცავს ლიბერთი ბანკი · Visa Secure · Mastercard SecureCode',
    linkedAlert: 'ბარათი წარმატებით მიება — შემდეგ ჯერზე გამოჩნდება შენახულ ბარათებში.',
    walletAria: { apple: 'Apple Pay-ით გადახდა', google: 'Google Pay-ით გადახდა' },
  },
  bank: {
    tag: 'ბანკის გვერდი — იმიტაცია',
    note: 'ამ გვერდს აჩვენებს ლიბერთი ბანკი — მისი დიზაინი ამ პროექტის ნაწილი არ არის. პროტოტიპში მხოლოდ იმიტაციაა.',
    merchant: 'მიმღები',
    merchantValue: 'GPI ONLY RECCURING',
    amount: 'თანხა',
    cardPan: 'ბარათის ნომერი',
    month: 'თვე',
    year: 'წელი',
    simulateOk: 'წარმატებული გადახდის იმიტაცია',
    backToPay: 'უკან დაბრუნება',
  },
  done: {
    title: 'გადახდა წარმატებულია',
    amount: 'თანხა',
    policy: 'პოლისი',
    method: 'გადახდის მეთოდი',
    date: 'თარიღი',
    newCardMethod: 'ახალი ბარათი — Visa •••• 7712',
    autopayTitle: 'ავტომატური გადახდა გააქტიურდა',
    autopayBody: 'ყოველთვიური დავალიანება ავტომატურად ჩამოიჭრება ამ ბარათიდან.',
    /* Campaign outcome — three honest cases, because GPI cannot control which
       card the customer actually types on the bank's page. */
    visaOkTitle: 'Visa-ს კამპანია გააქტიურდა',
    visaOkBody: (pts) => `დაგერიცხება ${pts} ბრუნოს ქულა ან არჩეული ბენეფიტები — რამდენიმე სამუშაო დღეში.`,
    visaMissTitle: 'Visa-ს კამპანია არ გააქტიურდა',
    visaMissBody: 'გადახდა სხვა ბარათით შესრულდა. შემდეგ ჯერზე აირჩიე Visa ბარათი.',
    visaWalletTitle: 'Visa-ს კამპანია',
    visaWalletBody: 'თუ საფულეში Visa ბარათი იყო მიბმული, ქულები ან ბენეფიტები დაგერიცხება.',
    receipt: 'ქვითარი გამოგზავნილია SMS-ით.',
    cta: 'დასრულება',
  },
}
