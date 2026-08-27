/* Mock data for the MyGPI mobile health dashboard + Curatio pages — GEORGIAN (ka),
   the primary language. Names/numbers mirror the user's shared Home design.
   Medication names are ILLUSTRATIVE placeholders — real prescription display rules
   come from GPI/Curatio.

   SPLIT OUT OF data.js on 2026-08-27 when English was added. data.js still owns every
   locale-NEUTRAL constant (queue numbers, counts, feature flags) and all the session
   state; only the records a reader actually reads live here and in data.en.js.
   ⚠ The two tables must stay key-for-key identical — data.js re-exports by name, so a
   constant missing here or there is a crash. Keep the ORDER identical too; it makes a
   side-by-side diff readable, which is the only practical way to audit a translation. */

export const ka = {
  PERSONS: [
    { id: 'p1', name: 'Giorgi Giorgadze', short: 'გიორგი', ocin: 'OCIN 23213/22' },
    { id: 'p2', name: 'Elene Giorgadze', short: 'ელენე', ocin: 'OCIN 23213/22' },
  ],

  BOOKING: {
    specialty: 'კარდიოლოგი',
    doctor: 'მარიკა დვალიშვილი',
    clinic: 'კურაციო',
    date: '20 სექ',
    time: '11:30 - 12:00',
    timeShort: '11:30',
  },

  NEXT_BOOKING: { label: 'ოჯახის ექიმი', date: '29 სექ', time: '11:00' },

  CLINIC: {
    name: 'კლინიკა კურაციო',
    address: 'ლორთქიფანიძის 31 · IV სართ.',
    cabinet: 'კაბ. 208 · IV სართ.',
  },

  REFERRAL: { person: 'გიორგი გიორგაძე', number: 'EED 336 135 / 23' },

  CHRONIC: { med: 'ლიზინოპრილი 10 მგ', daysLeft: 7 },

  DOCTOR: {
    initial: 'ნ',
    name: 'ნინო გიგაური',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=96&h=96&fit=crop&crop=faces&auto=format&q=60',
    role: 'ოჯახის ექიმი · კურაციო',
    online: true /* rendered only when ONLINE_STATUS_ENABLED (MVP2) */,
    nextVisit: '29 სექ · 11:00',
    /* A4 doctor-detail additions (F-03 card fields). Clinic naming follows the
       BOOKING FLOW ("კურაციო საბურთალოზე"), not the stakeholder file's
       address style — the tested flow is the naming source of truth. */
    clinic: 'კურაციო საბურთალოზე',
    cabinet: 'კაბ. 208 · IV სართ.',
    workDays: 'ორ — პარ',
    workHours: '09:00 — 18:00',
  },

  /* The clinic-network name appended to a newly picked doctor's role line
     (setPickedDoctor in data.js). Was hard-coded there before the split. */
  NETWORK: 'კურაციო',

  /* Short month names, newest-first sorting (dateRank in data.js). Order = Jan…Dec.
     ⚠ Every `date` string in this table must use these exact abbreviations, or the
     record sorts to the bottom. */
  MONTHS: ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'],

  /* Default date prefilled in the upload sheet's metadata step. */
  UPLOAD_DEFAULT_DATE: '18 აგვ',

  /* ── V2 stakeholder-parity data (source of truth: reference/mygpi_v3_stakeholder_
     prototype.html). V1 data stays untouched. No relation labels by design — the
     system only knows policyholder (sorted first = default) vs members. ── */
  /* Photos are Unsplash stand-ins on the same URL grammar as the Curatio doctors
     (w/h 96, crop=faces) — `initial` stays as the fallback when a photo is absent.
     Every candidate was checked at the real 34px avatar size before being picked:
     `crop=faces` does NOT rescue a full-body shot, it just crops it, so a figure
     standing in a wide frame lands as an unreadable speck in the circle.
     The cast follows the demo records: ნიკა has a პედიატრი visit (V2_HISTORY),
     so he reads as a child; ანი has no records, and is cast as a second child so
     the switcher tells a family-policy story. Swap freely — nothing keys on age. */
  V2_PERSONS: [
    { id: 'tp', name: 'თამარ გიორგაძე', initial: 'თ', ocin: 'OCIN 00142897', holder: true, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
    { id: 'np', name: 'ნიკა გიორგაძე', initial: 'ნ', ocin: 'OCIN 00142911', photo: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
    { id: 'ap', name: 'ანი გიორგაძე', initial: 'ა', ocin: 'OCIN 00142912', photo: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
  ],

  /* Today's visit per person — exists only in the visit-day demo mode. */
  V2_TODAY: {
    /* #5: the cabinet is now surfaced in the arrival confirmation, so the
       stakeholder file's „კაბ. XXX" placeholder became visible — real number. */
    tp: { proc: 'ექოსკოპია', place: 'ლორთქიფანიძის 31 · კაბ. 312 · IV სართ.', time: '10:30', queue: 'A042' },
    np: { proc: 'პედიატრი', place: 'ლორთქიფანიძის 31 · კაბ. 115 · II სართ.', time: '12:30', queue: 'B017' },
  },

  /* History-row alert badge per person — counts are sensitive, shown only after OTP unlock. */
  V2_HISTORY_ALERT: { tp: '1 ვადა', np: null, ap: null },

  /* Queue-picker bookings per person (F-01: today / tomorrow / near future).
     `when: 'today'` entries are ACTIVATABLE only in visit-day mode; everything
     else stays locked until 09:00 of its own visit day. */
  V2_BOOKINGS: {
    tp: [
      { when: 'today', date: '28 აპრ 2026', proc: 'ექოსკოპია', place: 'კლ. კურაციო · კაბ. 214 · IV სართ.', time: '10:30' },
      { when: 'tomorrow', date: '29 აპრ 2026', proc: 'ოჯახის ექიმი', place: 'ნ. გიგაური · კაბ. 208 · IV სართ.', time: '11:00' },
    ],
    np: [{ when: 'today', date: '28 აპრ 2026', proc: 'პედიატრი', place: 'კლ. კურაციო · კაბ. 115 · II სართ.', time: '12:30' }],
    ap: [],
  },

  NEXT_REMINDER: { text: 'მიმართვის ვადა — 7 დღეში', tone: 'amber' },

  PREVENTION_NEXT: { text: 'გრიპის ვაქცინა · ოქტ · უფასოა GPI პოლისით' },

  /* A5 — history-transfer targets (F-03). The CURRENT personal doctor is
     deliberately excluded — transferring to yourself is meaningless (fix vs
     the stakeholder file, which listed her). avail: online | tomorrow */
  TRANSFER_DOCTORS: [
    { id: 'd1', initial: 'გ', name: 'გიორგი მამულაძე', spec: 'კარდიოლოგი', clinic: 'კლ. კურაციო — ლორთქიფანიძის 31', avail: 'online' },
    { id: 'd2', initial: 'ა', name: 'ანა კობახიძე', spec: 'ენდოკრინოლოგი', clinic: 'კლ. კურაციო — შეშელიძის 6', avail: 'tomorrow' },
    { id: 'd3', initial: 'დ', name: 'დავით ჩხეიძე', spec: 'ნევროლოგი', clinic: 'კლ. კურაციო — შეშელიძის 6', avail: 'online' },
  ],

  /* ── A7 — prevention screen dataset (stakeholder sc-prev parity, scope-filtered).
     status drives the row action: due/missed → booking CTA (dead until F-04),
     done → badge. note tones: red = missed, amber = due soon. ── */
  V2_PREVENTION: {
    reminder: {
      title: 'შეხსენება — ექოსკოპია',
      body: 'გამეორება 3 თვეში (ივნ 2026) — დანიშნულება: გ. გიგაური 14 მარ',
    },
    vaccines: [
      { id: 'flu', icon: 'syringe', tile: 'lav', name: 'გრიპის ვაქცინა', meta: 'სეზონური ვაქცინაცია · ოქტ 2026', extra: 'GPI პოლისით დაფარულია · უფასოდ', status: 'due' },
      { id: 'covid', icon: 'check', tile: 'green', name: 'COVID-19 ბუსტერი', meta: '2025 — კლინიკა კურაციო', status: 'done' },
    ],
    screenings: [
      { id: 'breast', icon: 'microscope', tile: 'pink', name: 'მკერდის ჯირკვლის სქრინინგი', meta: 'სახ. პროგრამა · ყოველ 2 წელიწადში · 40+', note: '2024 — ჩატარება გამოტოვებულია', tone: 'red', status: 'due' },
      { id: 'annual', icon: 'stethoscope', tile: 'teal', name: 'წლიური პრევენციული გამოკვლევა', meta: 'სისხლის საერთო + ეკგ + შარდი · მარ 2026', status: 'done' },
      { id: 'vision', icon: 'eye', tile: 'amber', name: 'მხედველობის სქრინინგი', meta: 'გლაუკომის სქრინინგი · ყოველ 2 წელიწადში', note: '2025 — ვადა ახლოვდება', tone: 'amber', status: 'due' },
    ],
  },

  V2_ANALYSIS_CATS: [
    { id: 'all', label: 'ყველა' },
    { id: 'blood', label: 'სისხლი' },
    { id: 'bio', label: 'ბიოქიმია' },
    { id: 'thyroid', label: 'ფარისებრი' },
    { id: 'lipid', label: 'ლიპიდები' },
    /* #13 (2026-08-18) — every upload must map to a category in one of the two
       remaining sections; imaging/instrumental studies had none, and the section is
       „ანალიზები და კვლევები" precisely so they belong here. */
    { id: 'imaging', label: 'ინსტრუმენტული' },
  ],

  /* ── A6 — V2 history dataset (stakeholder parity minus charts; F-02/F-03).
     V1 keeps HISTORY below untouched. ── */
  V2_HISTORY: {
    /* #7 (2026-08-18): `src` is now the ORIGIN ENUM behind SourceTag (curatio |
       external | referral), not a display string — origin and clinical status are
       different axes and used to be conflated. The externally-uploaded row lost its
       `status: 'uploaded'` badge for the same reason: GPI cannot read an external
       result (OCR is MVP2), so it has NO clinical status to show. `shared` = the
       per-upload consent from the upload sheet. */
    analyses: [
      { title: 'სისხლის საერთო', cat: 'blood', date: '22 აპრ', src: 'curatio', person: 'თამარ', status: 'norm' },
      /* HIDDEN 2026-08-26 at the user's request — this abnormal-result sample was a
         distraction during stakeholder demos („the team was a bit stressed when I
         presented this"). It is DEMO DATA ONLY; nothing about real records changes.
         ⚠️ It was also the ONLY analyses record exercising `status:'warn'`, `note` and
         `book:true`, so with it commented out the section no longer demonstrates the
         attention badge, the clinical note or the „ჩაეწერე ექიმთან" CTA. Restore this
         one line to get that coverage back (or swap in a calmer sample) before any
         review where those states matter. ⚠️ Mirrored, commented, in data.en.js.
      { title: 'ბიოქიმია', cat: 'bio', date: '14 აპრ', src: 'curatio', person: 'თამარ', status: 'warn', note: 'ALT/AST ამაღლებულია — საჭიროა ექიმის კონსულტაცია', book: true },
      */
      { title: 'ფარისებრი (TSH)', cat: 'thyroid', date: '3 აპრ', src: 'curatio', person: 'თამარ', status: 'norm' },
      { title: 'ლიპიდური სპექტრი', cat: 'lipid', date: '15 თებ', src: 'external', clinic: 'BMSC კლინიკა', person: 'თამარ', shared: true },
      { title: 'სისხლის საერთო', cat: 'blood', date: '2 მარ', src: 'curatio', person: 'ნიკა', status: 'norm' },
      /* Re-homed from the deleted დოკუმენტები tab (#13) — they were always analyses
         and studies, filed in a drawer only because uploads had nowhere else to go. */
      { title: 'ბიოქიმია', cat: 'bio', date: '14 აპრ', src: 'external', clinic: 'BMSC კლინიკა', person: 'თამარ', shared: true },
      { title: 'MRI — თავის ტვინი', cat: 'imaging', date: '2 მარ', src: 'external', clinic: 'EMC', person: 'თამარ', shared: false },
    ],
    /* `person` added 2026-08-27 with the person selector: these three carried none,
       so a person-scoped list had nothing to cut on. D3 is ნიკა's deliberately —
       switching member on დანიშნულებები then SHOWS a different record instead of
       emptying the page, which is what proves the scope works in a demo. */
    meds: [
      { name: 'ვიტამინი D3 2000 IU', how: 'დღეში 1 კაფსულა · 15 ივნისამდე', by: 'ნ. გიგაური', src: 'curatio', person: 'ნიკა', state: 'active' },
      { name: 'Metformin 500mg', how: 'დღეში 2 აბი', by: 'ნ. გიგაური', src: 'curatio', person: 'თამარ', expiry: 'ვადა: 30 აპრ · 6 დღეში', state: 'expiring' },
      { name: 'Atorvastatin 20mg', how: 'საღამოს 1 აბი · 1 სექტემბრამდე', by: 'გ. მამულაძე', src: 'external', clinic: 'EMC', person: 'თამარ', state: 'chronic' },
    ],
    studies: [
      {
        src: 'referral',
        title: 'ექოსკოპია — მუცლის ღრუ',
        person: 'თამარ',
        meta: 'დანიშნა ნ. გიგაურმა · 14 მარ',
        prep: 'მომზადება: 4–6 სთ მარხვა, ბუშტი სავსე',
        repeat: 'გამეორება 3 თვეში · ივნ 2026',
      },
    ],
    /* #9 — referrals come FROM the family doctor: that is their origin, and SourceTag
       renders it with the same enum the analyses and the card use. */
    referrals: [
      { title: 'ლაბორატორიული — ბიოქიმია', number: 'EED 336 135 / 23', expiry: 'ვადა: 14 ივლ 2026', prep: 'მომზადება: 8–12 სთ მარხვა, მხოლოდ წყალი', src: 'referral', person: 'თამარ', status: 'booked' },
      { title: 'კარდიოლოგის კონსულტაცია', number: 'EED 336 218 / 23', expiry: 'ვადა: 8 ივლ 2026', src: 'referral', person: 'თამარ', status: 'waiting' },
    ],
    /* #10 (2026-08-18) — the card holds every ENCOUNTER, not only in-clinic visits:
       phone and online consultations produce records too, and a patient scanning the
       list needs to know which kind each was. `type` drives an icon + LABEL (never the
       icon alone). `src` is #9's origin, same enum as everywhere else. */
    visits: [
      { title: 'ოჯახის ექიმი', type: 'visit', person: 'თამარ', date: '18 აპრ 2026', by: 'ნ. გიგაური', clinic: 'კურაციო საბურთალოზე', src: 'curatio', summary: 'ბიოქიმია — ყურადღება · Metformin-ის მიმართვა განახლდა', year: '2026' },
      { title: 'ოჯახის ექიმი', type: 'phone', person: 'თამარ', date: '2 აპრ 2026', by: 'ნ. გიგაური', clinic: 'კურაციო', src: 'curatio', summary: 'ანალიზების შედეგების განხილვა · დოზა უცვლელი', year: '2026' },
      { title: 'პედიატრი', type: 'visit', person: 'ნიკა', date: '2 მარ 2026', by: 'თ. ბერიძე', clinic: 'კურაციო ვაკეში', src: 'curatio', summary: 'გეგმიური შემოწმება — ნორმა', year: '2026' },
      { title: 'დერმატოლოგი', type: 'online', person: 'თამარ', date: '20 იან 2026', by: 'ლ. ჩიქოვანი', clinic: 'კურაციო', src: 'curatio', summary: 'კანის გამონაყარი — ადგილობრივი მკურნალობა', year: '2026' },
      { title: 'კარდიოლოგი', type: 'visit', person: 'თამარ', date: '14 დეკ 2025', by: 'გ. მამულაძე', clinic: 'EMC', src: 'external', summary: 'ეკგ ნორმა · Atorvastatin გაგრძელდა', year: '2025' },
    ],
  },

  /* Medical history rows per tab (V1, frozen archive). status: norm | warn | crit | uploaded */
  HISTORY: {
    analyses: [
      { title: 'სისხლის საერთო ანალიზი', date: '22 აპრ', src: 'კურაციო', person: 'გიორგი', status: 'norm' },
      { title: 'ბიოქიმია', date: '18 აპრ', src: 'კურაციო', person: 'გიორგი', status: 'warn' },
      { title: 'ფარისებრი ჯირკვალი (TSH)', date: '02 მარ', src: 'კურაციო', person: 'ელენე', status: 'norm' },
      { title: 'ლიპიდური სპექტრი', date: '15 თებ', src: 'სხვა კლინიკა', person: 'გიორგი', status: 'uploaded' },
    ],
    prescriptions: [
      { title: 'ლიზინოპრილი 10 მგ', date: '01 აპრ', src: 'ნ. გიგაური', person: 'გიორგი', status: 'warn', note: 'ქრონიკული · ვადა 7 დღეში' },
      { title: 'ვიტამინი D 2000 IU', date: '18 აპრ', src: 'ნ. გიგაური', person: 'ელენე', status: 'norm' },
    ],
    visits: [
      { title: 'კარდიოლოგი · მარიკა დვალიშვილი', date: '20 სექ', src: 'კურაციო', person: 'გიორგი', status: 'norm' },
      { title: 'ოჯახის ექიმი · ნინო გიგაური', date: '03 აპრ', src: 'კურაციო', person: 'გიორგი', status: 'norm' },
      { title: 'ენდოკრინოლოგი · ანა კობახიძე', date: '12 მარ', src: 'კურაციო', person: 'ელენე', status: 'norm' },
    ],
    docs: [
      { title: 'ფორმა 100', date: '22 აპრ', src: 'კურაციო', person: 'გიორგი', status: 'norm' },
      { title: 'ლიპიდური სპექტრი (PDF)', date: '15 თებ', src: 'სხვა კლინიკა', person: 'გიორგი', status: 'uploaded' },
    ],
  },

  /* ── #1 (stakeholder comments 2026-08-18) — personal-doctor selection. ──
     The docselect screen REUSES the booking flow's page-1 doctor list (that flow
     is usability-tested and already in development) opened in "select personal
     doctor" mode — FAMILY DOCTORS only. ნინო გიგაური IS listed here (unlike
     TRANSFER_DOCTORS): with no doctor assigned there is no "current" to exclude.
     Filters MIRROR the booking flow's selection controls (city · clinic; its
     calendar/slots stay out — availability is booking info, not selection info,
     user call 2026-08-18). langs = the flow's Geo/Eng/Rus doctor-card chips.
     Photos: Unsplash portraits (prototype stand-ins only — production uses real
     Curatio doctor photos). */
  DOCSEL_CITIES: [
    { id: 'tbilisi', label: 'თბილისი' },
    { id: 'batumi', label: 'ბათუმი' },
  ],
  DOCSEL_CLINICS: [
    { id: 'all', label: 'ყველა კლინიკა' },
    { id: 'sab', label: 'კურაციო საბურთალოზე' },
    { id: 'vake', label: 'კურაციო ვაკეში' },
    { id: 'bat', label: 'კურაციო ბათუმში' },
  ],
  SELECT_DOCTORS: [
    { id: 's1', initial: 'ნ', name: 'ნინო გიგაური', spec: 'ოჯახის ექიმი', city: 'tbilisi', clinicId: 'sab', clinic: 'კურაციო საბურთალოზე', exp: 12, hours: 'ორ — პარ · 09:00—18:00', langs: ['Geo', 'Eng'], photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
    { id: 's2', initial: 'გ', name: 'გიორგი კაპანაძე', spec: 'ოჯახის ექიმი', city: 'tbilisi', clinicId: 'vake', clinic: 'კურაციო ვაკეში', exp: 8, hours: 'ორ — შაბ · 10:00—17:00', langs: ['Geo', 'Rus'], photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
    { id: 's3', initial: 'თ', name: 'თამარ ბერიძე', spec: 'ოჯახის ექიმი', city: 'tbilisi', clinicId: 'sab', clinic: 'კურაციო საბურთალოზე', exp: 21, hours: 'ორ — პარ · 14:00—20:00', langs: ['Geo', 'Eng', 'Rus'], photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
    { id: 's4', initial: 'ლ', name: 'ლევან წიკლაური', spec: 'ოჯახის ექიმი', city: 'batumi', clinicId: 'bat', clinic: 'კურაციო ბათუმში', exp: 5, hours: 'ორ — პარ · 09:00—15:00', langs: ['Geo'], photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=96&h=96&fit=crop&crop=faces&auto=format&q=60' },
  ],
}
