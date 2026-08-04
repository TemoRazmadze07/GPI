/* The Excel template's column contract — the single source of truth shared by
   the parser (data/insuredImport.js) and the template generator
   (scripts/build-insured-template.mjs).

   It lives in its own module with NO dependencies so the node-side authoring
   script can import it: insuredImport.js pulls in read-excel-file/browser,
   which node cannot load. Change a column here and re-run the generator —
   template and validator then cannot drift apart.

   `key` matches emptyDraft() in addInsured.js, except `linkPid`, which the
   parser resolves into `linkedTo`. */

export const TEMPLATE_SHEET = 'დაზღვეულები'

export const COLUMNS = [
  { key: 'who', header: 'ტიპი', required: true, example: 'თანამშრომელი' },
  { key: 'citizen', header: 'მოქალაქეობა', required: false, example: 'საქართველოს მოქალაქე' },
  { key: 'pid', header: 'პირადი ნომერი', required: true, example: '01001001234', text: true },
  { key: 'birth', header: 'დაბადების თარიღი', required: true, example: '05/03/1990', text: true },
  { key: 'firstName', header: 'სახელი', required: true, example: 'ნინო' },
  { key: 'lastName', header: 'გვარი', required: true, example: 'კაპანაძე' },
  { key: 'gender', header: 'სქესი', required: true, example: 'მდედრობითი' },
  { key: 'linkPid', header: 'თანამშრომლის პირადი ნომერი', required: false, example: '', text: true },
  { key: 'relation', header: 'კავშირი', required: false, example: '' },
  { key: 'mobile', header: 'მობილური', required: false, example: '+995 555 12 34 56' },
  { key: 'email', header: 'ელ-ფოსტა', required: false, example: 'nino@mail.ge' },
  { key: 'address', header: 'მისამართი', required: false, example: 'ქ. თბილისი, ვაჟა-ფშაველას 12' },
  { key: 'pkg', header: 'სადაზღვევო პაკეტი', required: true, example: 'ოპტიმალი' },
]
