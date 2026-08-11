/* Accounts console (devaccounts.gpih.ge redesign) — Georgian copy.
   Separate surface, separate copy table (Rule 5) — NOT part of the My-Cabinet
   i18n system. User data mirrors the dev-environment screenshots from the
   stakeholder doc (MYGPI_ავტორიზაცია რეგისტრაცია, 2026-08-07). */

export const kaAcc = {
  brand: 'GPI ანგარიში',

  nav: {
    home: 'მთავარი გვერდი',
    personal: 'პერსონალური ინფორმაცია',
    security: 'უსაფრთხოება',
    logout: 'გამოსვლა',
    menu: 'მენიუ',
    close: 'დახურვა',
    language: 'ენა',
  },

  user: {
    firstName: 'მარიამ',
    lastName: 'ფასურიშვილი',
    initials: 'მფ',
    login: 'mpasurishvili@yahoo.com',
    pid: '01008055753',
    sex: 'ქალი',
    phone: '595 805 262',
    phoneMasked: '+995 5** *** *62',
    email: 'kkedo448@gmail.com',
  },

  home: {
    greeting: 'მოგესალმებით, მარიამ',
    signedInAs: 'შესული ხართ:',
    mygpiTitle: 'MyGPI — პირადი კაბინეტი',
    /* PRODUCT-NEUTRAL on purpose (user, 2026-08-10). The old line — „ჩაეწერეთ
       ექიმთან, მოითხოვეთ მიმართვა ან სამედიცინო ანაზღაურება." — described the
       HEALTH journey on the one card every customer sees, so an Auto Fix or
       Travel policyholder read "this isn't for me" at the exact moment we want
       them to cross into MyGPI. პოლისები is the only noun true for every
       product, and ანაზღაურება covers auto/travel claims as well as medical.
       OPEN with GPI: confirm MyGPI actually surfaces non-health policies — if
       it is health-only today, this over-promises and the fallback is
       „მართეთ თქვენი პოლისები ერთ სივრცეში." */
    mygpiDesc: 'იხილეთ თქვენი პოლისები, მართეთ დაზღვევა და მოითხოვეთ ანაზღაურება.',
    mygpiCta: 'კაბინეტში გადასვლა',
    linkTitle: 'ანგარიშის დაკავშირება',
    linkDesc: 'დაუკავშირეთ ანგარიში GPI-ის მონაცემებს, რომ თქვენი პოლისები და სერვისები ერთ სივრცეში გამოჩნდეს.',
    linkCta: 'დაკავშირება',
    linkOnce: 'საჭიროა მხოლოდ ერთხელ',
    linkedTitle: 'ანგარიში დაკავშირებულია',
    linkedText: 'თქვენი ანგარიში დაკავშირებულია GPI-ის მონაცემებთან.',
    shortPersonal: 'პერსონალური ინფორმაცია',
    shortPersonalHint: 'ნახეთ თქვენი მონაცემები',
    shortSecurity: 'პაროლის შეცვლა',
    shortSecurityHint: 'უსაფრთხოების პარამეტრები',
    privacy: 'თქვენს პარამეტრებს მხოლოდ თქვენ ხედავთ. GPI ზრუნავს თქვენი კონფიდენციალურობისა და უსაფრთხოების დაცვაზე.',
    privacyMore: 'შეიტყვეთ მეტი',
  },

  profile: {
    editPhoto: 'ფოტოს შეცვლა',
    photoHint: 'JPG ან PNG, მინ. 200×200',
  },

  crop: {
    title: 'ფოტოს მოჭრა',
    hint: 'გადაათრიეთ კვადრატი და აირჩიეთ, ფოტოს რომელი ნაწილი დარჩეს. ზომის შეცვლა შეუძლებელია.',
    frameLabel: 'მოსაჭრელი არე — გადაადგილეთ ისრებით',
    cancel: 'გაუქმება',
    save: 'შენახვა',
    tooSmall: 'ფოტო ძალიან პატარაა. საჭიროა მინიმუმ 200×200 პიქსელი.',
    wrongType: 'აირჩიეთ JPG ან PNG ფაილი.',
  },

  personal: {
    title: 'პერსონალური ინფორმაცია',
    fields: {
      firstName: 'სახელი',
      lastName: 'გვარი',
      pid: 'პირადი ნომერი',
      sex: 'სქესი',
      phone: 'ტელეფონის ნომერი',
      email: 'ელ.ფოსტა',
    },
    note: 'მონაცემები GPI-ის ბაზიდან მოდის და ამ გვერდზე მხოლოდ სანახავადაა. ცვლილებისთვის დაუკავშირდით მხარდაჭერას.',
    noteIdentity: 'სახელი, გვარი, პირადი ნომერი და სქესი GPI-ის ბაზიდან მოდის. ცვლილებისთვის დაუკავშირდით მხარდაჭერას.',
  },

  contact: {
    verified: 'დადასტურებული',
    unverified: 'დაუდასტურებელი',
    verify: 'დადასტურება',
    edit: 'შეცვლა',
    titles: {
      phoneEdit: 'ტელეფონის ნომრის შეცვლა',
      emailEdit: 'ელ.ფოსტის შეცვლა',
      phoneVerify: 'ნომრის დადასტურება',
      emailVerify: 'ელ.ფოსტის დადასტურება',
    },
    newPhone: 'ახალი ტელეფონის ნომერი',
    newEmail: 'ახალი ელ.ფოსტა',
    sendCode: 'კოდის გაგზავნა',
    // Grammar differs by channel (postposition on the target), so a function —
    // same convention as the My-Cabinet i18n rule.
    codeSent: (isPhone, target) =>
      isPhone ? `6-ნიშნა კოდი გაიგზავნა ნომერზე ${target}` : `6-ნიშნა კოდი გაიგზავნა მისამართზე ${target}`,
    codeLabel: 'დადასტურების კოდი',
    codeGroupLabel: '6-ნიშნა დადასტურების კოდი',
    // 1:1 with the shipped registration OTP screen: the SAME label stays put and
    // the countdown is appended as „ - M:SS" (bold) while it runs. SMS names its
    // channel there, so keep that when the target is a phone.
    resend: (isPhone) => (isPhone ? 'SMS კოდის ხელახლა გაგზავნა' : 'კოდის ხელახლა გაგზავნა'),
    resent: 'ახალი კოდი გაიგზავნა',
    confirm: 'დადასტურება',
    verifying: 'მოწმდება…',
    // Status line after a successful auto-submit. NOT `verified` — that key is
    // the badge adjective („დადასტურებული"); a duplicate key silently shadowed it.
    verifiedMsg: 'დადასტურდა',
    errPhone: 'ნომერი უნდა შედგებოდეს 9 ციფრისგან და იწყებოდეს 5-ით.',
    errEmail: 'შეიყვანეთ სწორი ელ.ფოსტის მისამართი.',
    errCode: 'კოდი არასწორია. სცადეთ ხელახლა.',
  },

  /* Per-channel credential linking (user model, 2026-08-10): a phone/email on
     the account may be CONTACT info only — linking makes it a SIGN-IN
     credential too. The offer lives in its own highlighted box, not in the
     info rows; the rows show one calm state (check = linked, nothing = not).
     Channel grammar differs (ნომრით/ელ.ფოსტით), so functions — the i18n rule. */
  linking: {
    titles: { phone: 'ნომრის დაკავშირება', email: 'ელ.ფოსტის დაკავშირება' },
    boxTitle: (isPhone) =>
      isPhone ? 'დაუკავშირეთ ტელეფონის ნომერი ანგარიშს' : 'დაუკავშირეთ ელ.ფოსტა ანგარიშს',
    boxBody: (isPhone, value) =>
      `${value} მითითებულია საკონტაქტოდ, თუმცა ანგარიშთან დაკავშირებული არ არის. დააკავშირეთ, რომ შეძლოთ ${isPhone ? 'ამ ნომრით' : 'ამ ელ.ფოსტით'} შესვლაც.`,
    cta: 'დაკავშირება',
    later: 'მოგვიანებით',
    linkedMsg: 'დაკავშირდა',
    successTitle: (isPhone) =>
      isPhone ? 'ტელეფონის ნომერი დაკავშირებულია' : 'ელ.ფოსტა დაკავშირებულია',
    successBody: (isPhone) =>
      `ახლა შეგიძლიათ ${isPhone ? 'ამ ნომრითაც' : 'ამ ელ.ფოსტითაც'} შეხვიდეთ ანგარიშზე.`,
    linkedTip: 'დაკავშირებულია ანგარიშთან',
  },

  security: {
    title: 'პაროლის ცვლილება',
    current: 'მიმდინარე პაროლი',
    forgot: 'დაგავიწყდათ პაროლი?',
    next: 'ახალი პაროლი',
    repeat: 'გაიმეორეთ ახალი პაროლი',
    submit: 'პაროლის შეცვლა',
    showPw: 'პაროლის ჩვენება',
    hidePw: 'პაროლის დამალვა',
    // 1:1 with the SHIPPED registration screen's info box — one sentence, not a
    // checklist, so both password surfaces state the rules identically (Rule 1).
    rulesNote:
      'პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს: დიდ ასოს (A-Z), პატარა ასოს (a-z), სპეციალურ სიმბოლოს (!@#$%^&*) და ციფრს (0-9).',
    rules: {
      len: 'მინიმუმ 8 სიმბოლო',
      upper: 'დიდი ასო (A-Z)',
      lower: 'პატარა ასო (a-z)',
      special: 'სპეციალური სიმბოლო (!@#$%^&*)',
      digit: 'ციფრი (0-9)',
    },
    errRequired: 'სავალდებულო ველი',
    errRules: 'პაროლი ვერ აკმაყოფილებს მოთხოვნებს.',
    errMatch: 'პაროლები არ ემთხვევა.',
    done: 'პაროლი წარმატებით შეიცვალა.',
  },

  linkModal: {
    title: 'დააკავშირეთ ანგარიში GPI-ის მონაცემებთან',
    body: 'GPI-ის ბაზაში მოიძებნა თქვენი ნომერი:',
    benefit: 'დაკავშირების შემდეგ თქვენი პოლისები და მონაცემები ავტომატურად გამოჩნდება MyGPI-ში.',
    confirm: 'დაკავშირება',
    later: 'მოგვიანებით',
  },
}
