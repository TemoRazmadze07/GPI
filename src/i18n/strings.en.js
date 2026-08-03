/* Centralised UI strings — English (en) is the SECOND locale, added alongside the
   Georgian primary (`ka` in ./strings.js) for usability testing with non-Georgian
   speakers. Georgian is untouched and stays the default.

   STRUCTURE MUST STAY IN LOCKSTEP WITH `ka`. Components read the resolved table as
   `t` and address keys by path, so a key that exists in `ka` but not here (or is
   renamed here) is a runtime crash, not a missing translation. When you add, remove
   or rename anything in strings.js, mirror it here in the same place, in the same
   order, with the same value TYPE (string vs. function).

   Copy conventions (locked for this build):
   - International/British English (cancelled, personalise), EXCEPT medical specialty
     names, which use the simplified international forms (Gynecologist, specialty).
   - Sentence case everywhere — buttons, labels, chips, headers, modal titles.
   - "Appointment" is the only noun for the thing booked; "book" is the verb.
     "Booking" only ever appears as a gerund in prose, never as a countable noun.
   - Dates render `D MMM` / `D MMM YYYY`; times are 24-hour.
   - Georgian person, clinic and street names are transliterated, never anglicised.
   - No button label may wrap to two lines at 390px or 320px. Where the literal
     English would overflow, the shortened form here is deliberate — do not "restore"
     the fuller wording without re-checking the narrow viewports. */

export const en = {
  topbar: {
    // Names the language the toggle switches TO — so the EN build offers Georgian.
    // Left in Georgian script on purpose: an endonym is what a Georgian speaker scans for.
    language: 'ქართული',
    user: 'Mari',
    menu: 'Menu',
  },
  nav: {
    home: 'Home',
    policies: 'Policies',
    payments: 'Payments',
    booking: 'Book a doctor',
    referrals: 'Referrals',
    reimbursement: 'Reimbursement',
    coverage: 'Coverage and spending',
    dental: 'Dental clinics',
    internal: 'Internal insurance', // GPI-specific product — confirm the official EN name
  },
  banner: {
    title: 'Book a doctor',
    subtitle: "Book a test or a doctor's consultation at a time that suits you",
    cta: 'Book',
  },
  bookings: {
    emptyTitle: 'You have no upcoming appointments',
    emptyCta: 'Book a doctor',
  },
  table: {
    heading: 'Appointments',
    col: {
      doctor: 'Doctor',
      datetime: 'Date and time',
      clinic: 'Clinic',
      status: 'Status',
      patient: 'Insured person',
      actions: '',
    },
  },
  status: {
    ongoing: 'Upcoming',
    cancelled: 'Cancelled',
    finished: 'Completed',
  },
  actions: {
    edit: 'Edit',
    cancel: 'Cancel appointment', // cancels a REAL booking — never the bare "Cancel"
    rebook: 'Rebook',
    close: 'Close',
  },
  cancelModal: {
    title: 'Cancel this appointment?',
    body: "Once you cancel, the time is released and someone else may take it. To book again, you'll need to find a new available time.",
    confirm: 'Cancel appointment',
    keep: 'Keep appointment',
  },
  wizard: {
    steps: {
      insured: 'Insured person',
      booking: 'Book a doctor',
      review: 'Review',
    },
    insured: {
      title: 'Choose the insured person',
      add: 'Add insured person',
      manage: 'Manage',
      modal: {
        title: 'Manage insured people',
        intro: "Deleting someone from the list doesn't cancel their insurance — they simply stop appearing when you book.",
        remove: 'Delete',
        removeLabel: (name) => `Delete ${name} from the list`,
        holder: (name) => `The policy holder (${name}) can't be deleted — this cabinet belongs to them.`,
        close: 'Close',
      },
      removeConfirm: {
        title: 'Delete from the list?',
        body: (name) =>
          `${name} will no longer appear in your list of insured people. Their insurance stays active and you can add them back at any time.`,
        bodyCart: (name) =>
          `${name} will no longer appear in your list of insured people, and the appointments you prepared for them will be discarded. Their insurance stays active and you can add them back at any time.`,
        confirm: 'Delete',
        keep: 'Cancel',
      },
    },
    promo: {
      line: 'Insure a family member and get',
      highlight: '25% off',
    },
    footer: {
      back: 'Back',
      continue: 'Continue',
      confirm: 'Confirm',
      finishDraft: 'Finish this appointment first', // mobile: why continue is blocked
    },
    // Reservation hold countdown — appears only in the final minutes before the
    // 15-min doctor hold is released. Tiered labels = calm → warning → urgent.
    countdown: {
      calm: 'Session expiring',
      warning: 'Session expiring',
      urgent: 'Session expiring',
      aria: (t) => `${t} left to finish booking`,
      // Explanation shown when the user clicks the countdown (popover). DRAFT — refine.
      info: {
        title: 'Session expiring',
        body: "If you don't finish booking in time, the doctor's time we're holding for you is released. It won't be available any more and you'll have to book again.",
      },
      expired: {
        title: 'Session expired',
        body: "The doctor's time we were holding has been released. The insured person is saved — just choose a doctor again and finish booking.",
        restart: 'Start over',
      },
    },
    review: {
      heading: 'Check the details and confirm your appointment',
      insured: 'Insured person',
      name: 'Full name:',
      policy: 'Policy number:',
      relation: 'Relationship:',
      doctor: 'Doctor:',
      direction: 'Specialty:',
      study: 'Test:',
      when: 'Date and time:',
      format: 'Visit type:',
      clinic: 'Clinic:',
      address: 'Address:',
      note: "We'll send the confirmation to the insured person by SMS and email. You can cancel or change the appointment at any time.",
    },
    success: {
      title: 'Appointment confirmed',
      subtitle: "We've sent a confirmation by SMS and email",
      // PLACEHOLDER policy copy — swap for GPI's real arrival/cancellation rules.
      note: 'Arrive at the clinic 15 minutes before your appointment · You can cancel or change it from the appointments page',
      calendar: 'Add to calendar',
      toList: 'My appointments',
      // Floating research launcher (off-system) — opens the current-state
      // notifications the insured receives. NOT part of the product UI.
      // "research" here is literal research scaffolding, NOT the Georgian კვლევა
      // (= diagnostic test) that appears everywhere else. Do not "correct" it.
      peek: {
        tag: 'Sample notifications',
        aria: 'Sample of the notifications sent — research only',
        email: 'Email',
        sms: 'SMS',
      },
      // Research artifact — mirrors GPI's LIVE booking SMS (real screenshot,
      // 2026-06-17). Translated faithfully, NOT rewritten: the study question is
      // whether the CURRENT message is understood, not whether we can improve it.
      // Assembled in SmsPreview.smsBody().
      // The date+time clause is the `when(date, time)` function rather than a bare
      // preposition, because Georgian საათზე is a POSTposition that also carries the
      // full stop, while English needs "at" BEFORE the time. See the matching note
      // in strings.js — do not collapse it back to a string.
      sms: {
        modalTitle: 'SMS sent',
        hint: 'This is a sample of the SMS the insured person receives when an appointment is confirmed.',
        received: 'Wed 17 Jun, 18:52',
        hello: 'Hello,',
        // No "doctor"/"Dr" before the name: "with doctor Nino Ninoshvili" is not
        // idiomatic English, and the glossary bans the "Dr" prefix (Georgian omits it too).
        lead: 'your appointment with',
        leadRemote: 'your online consultation with',
        booked: 'is booked for',
        // See the ka note: Georgian puts the time marker AFTER the time, English before it.
        when: (date, time) => `${date} at ${time}.`,
        entrance: 'Entrance',
      },
      // Research artifact — mirrors GPI's LIVE confirmation-email template
      // (real Gmail screenshot, 2026-07-09). Keep the copy as-is: the study
      // question is whether the CURRENT email is clear, not a redesign.
      email: {
        modalTitle: 'Email sent',
        hint: 'This is a sample of the email the insured person receives when an appointment is confirmed.',
        letter: 'Message',
        subject: "Your doctor's appointment",
        hello: 'Hello',
        intro: 'Your in-clinic visit is booked.',
        introRemote: 'Your online consultation is booked.',
        detailsTitle: 'Appointment details:',
        specialty: 'Specialty',
        doctor: 'Doctor',
        date: 'Date',
        time: 'Time',
        clinicName: 'Clinic name',
        clinicAddress: 'Clinic address',
      },
    },
    step2: {
      title: 'Book a doctor',
      subtitle: 'Book one or several doctors in one go',
      add: 'Book a doctor',
      addMore: 'Add another', // short on purpose — must not wrap at 320px
      considerTitle: 'Good to know',
      note: 'Specialists and tests — Curatio clinics only · max. 1 family doctor',
      newEntry: 'New appointment',
      entry: 'Appointment', // rendered as "Appointment 1", "Appointment 2", …
      typeLabel: 'Appointment type',
      patient: 'Patient',
      policyOwner: 'Policyholder',
      personalTaken: 'Family doctor already added (max. 1)',
    },
    // Segmented control — three labels sit side by side on desktop and in a narrow
    // mobile dropdown. THE most length-critical strings in the flow. The long
    // Georgian "…კონსულტაცია" forms are deliberately not carried over; keep these
    // identical to `wizard.types` below so the type reads the same everywhere.
    typeSeg: {
      personal: 'Family doctor',
      specialist: 'Specialist',
      instrumental: 'Diagnostic test',
    },
    visit: {
      label: 'Visit type',
      inclinic: 'In-clinic visit',
      remote: 'Online consultation',
      remoteHint: 'Online call — no need to travel to the clinic',
    },
    relation: {
      owner: 'Policyholder',
      spouse: 'Spouse',
      child: 'Child',
      parent: 'Parent',
      other: 'Other',
      family: 'Family member',
    },
    addInsured: {
      title: 'Add insured person',
      // Kept short deliberately: the segmented control's items are `white-space: nowrap`
      // and so cannot shrink below their content width — "By personal details" /
      // "By policy number" overflow the modal track at 320px and clip.
      tabs: { personal: 'Personal ID', policy: 'Policy number' },
      personalIntro: "Enter their personal ID number and date of birth — we'll find them on your policy.",
      policyIntro: 'Enter their policy number.',
      fields: {
        personalId: 'Personal ID number',
        personalIdPh: 'e.g. 01001012345',
        personalIdHint: '11-digit personal ID number',
        birth: 'Date of birth',
        birthPh: 'DD / MM / YYYY',
        policy: 'Policy number',
        policyPh: 'e.g. GPIH G3512',
        firstName: 'First name',
        lastName: 'Last name',
        relation: 'Relationship to you',
        relationPh: 'Choose',
      },
      search: 'Search',
      searchAgain: 'Search again',
      confirmIntro: 'We found this person. Check the details and add them to your list.',
      activePolicy: 'Active policy',
      remember: 'Remember this person',
      rememberHelp: 'Next time you can choose them straight from the list',
      add: 'Add',
      cancel: 'Cancel', // dismisses the form — nothing booked yet, so bare "Cancel" is correct
      searchOther: 'Find someone else',
      manualLink: "Can't find the person? Add their details manually",
      manualBack: 'Back to search',
      manualIntro: "We couldn't find them — fill in their details manually.",
      relationOpts: { spouse: 'Spouse', child: 'Child', parent: 'Parent', other: 'Other' },
      // Required-field errors stay terse; format errors state the exact rule.
      errors: {
        invalidId: 'The personal ID number must be 11 digits.',
        invalidDate: 'Enter the date of birth.',
        notFound: 'No insured person matches these details. Check the personal ID number and date of birth.',
        invalidPolicy: 'Enter the policy number.',
        policyNotFound: 'No policy found with this number. Check the policy number.',
        alreadyAdded: 'This person is already on your list.',
        manualIncomplete: 'Fill in all required fields (first name, last name, 11-digit personal ID number).',
      },
    },
    // Entry title + workspace column header — must match `typeSeg` word for word.
    types: {
      personal: 'Family doctor',
      specialist: 'Specialist',
      instrumental: 'Diagnostic test',
    },
    filters: {
      city: 'City',
      specialty: 'Choose a specialty',
      study: 'Choose a test type',
      clinic: 'Clinic',
      clinics: 'Clinics',
      allClinics: 'All clinics',
      searchDoctor: 'Search doctors',
      sortSoonest: 'Soonest',
      sortByDoctor: 'By doctor',
    },
    cols: {
      doctor: 'Doctor',
      date: 'Date',
      time: 'Time',
    },
    bio: {
      title: 'Doctor details',
      specialty: 'Specialty',
      languages: 'Languages',
      close: 'Close',
      select: 'Choose doctor',
    },
    book: {
      save: 'Save',
      add: 'Add',
      cancel: 'Cancel', // discards an unsaved draft card — nothing booked yet
      info: 'Details',
      selected: 'Selected',
      sortBy: 'Soonest',
      doctorsCount: 'doctors', // rendered after a number, e.g. "12 doctors"
      pickDoctor: 'Choose a doctor',
      pickDirection: 'Choose a specialty',
      pickStudy: 'Choose a test type',
      pickDay: 'Choose an available day',
      doctorLocked: "Your family doctor can't be changed",
      // Reassurance shown when the assigned family doctor has no near-term slots:
      // the point is that booking someone else does NOT reassign their family doctor.
      fallbackWeek: "Your family doctor has no available times in the next 7 days. These are other doctors at the same clinic — this is a one-off appointment and doesn't change your family doctor.",
      noDates: 'No available times found',
      noDoctors: 'No doctors found — change your search or filters',
      noSlots: 'No times on this day',
      languages: 'Languages',
      clinicsTitle: 'Clinics',
      experience: 'yrs experience', // rendered after a number, e.g. "12 yrs experience"
      reviews: 'reviews', // rendered after a number, e.g. "(48 reviews)"
    },
  },
  /* Screen-reader labels for icon-only controls. These were previously hardcoded in
     the components; they live here so both locales stay in one place. */
  a11y: {
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    // The day strip scrolls a RANGE of days, so it is deliberately not "Previous/Next"
    // — that would collide with the calendar's month chevrons for a screen-reader user.
    prevDays: 'Previous days',
    nextDays: 'Next days',
    calendar: 'Calendar',
    doctorDetails: 'Doctor details',
    removeDoctor: 'Remove doctor',
    close: 'Close',
    steps: 'Steps',
    // The bell is the notifications inbox — "Message" is already taken as the
    // rendering of წერილი in success.email.letter.
    messages: 'Notifications',
    switchLanguage: 'Switch language',
  },
  /* Strings rendered outside the screens themselves. */
  misc: {
    appTitle: 'GPI — My Cabinet',
    // SUMMARY line of the .ics file from "Add to calendar" — the doctor's name is
    // appended, so this is the prefix only.
    calendarEvent: "Doctor's appointment",
    // Empty state on a doctor result row (distinct from book.noSlots, which is the
    // empty state for the whole day column).
    noSlotsDoctor: 'No times on this day',
    // Research scaffolding: shown when ?study= is opened without a valid route.
    studyFallback: 'Use the link you were sent to open the prototype.',
  },
}
