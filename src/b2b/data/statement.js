/* Statement (ამონაწერი) — per-insured monthly premium ledger with the
   company / employee cost split. READ-ONLY view (concept agreed 2026-07-20):
   the % split is DISPLAY-only here; managing/editing the split (the prototype's
   inline inputs + apply/save) is a later feature, intentionally not built now.
   Cost-sharing is a HEALTH concept → rows = ACTIVE health insured, derived
   deterministically from POLICIES.health and replicated across the last 3
   statement periods so the period filter is meaningful. */

import { POLICIES } from './policies.js'

export const STATEMENT_PERIODS = [
  { id: '2026-04', label: 'აპრილი 2026', date: '01.04.2026', current: true },
  { id: '2026-03', label: 'მარტი 2026', date: '01.03.2026' },
  { id: '2026-02', label: 'თებერვალი 2026', date: '01.02.2026' },
]

/* Default split = company 70 / employee 30; a deterministic minority get
   overrides (100/0 fully covered · 50/50) so the read-only columns show the
   variety the prototype's editable inputs produced. Keyed off the pid's last
   digit → stable across reloads. */
function companyShare(pid) {
  const d = Number(pid[pid.length - 1])
  if (d === 0) return 100
  if (d === 1 || d === 2) return 50
  return 70
}

const active = POLICIES.health.filter((p) => p.status === 'active')

export const STATEMENT = []
for (const per of STATEMENT_PERIODS) {
  active.forEach((p, i) => {
    const companyPct = companyShare(p.pid)
    const companyGel = Math.round((p.premium * companyPct) / 100)
    /* Current period = a realistic paid/unpaid mix; prior periods settled. */
    const status = per.current ? (i % 5 === 0 ? 'due' : 'paid') : 'paid'
    STATEMENT.push({
      id: `${p.id}-${per.id}`,
      name: p.name,
      pid: p.pid,
      contract: p.contract,
      package: p.package,
      period: per.label,
      periodDate: per.date,
      premium: p.premium,
      paid: status === 'paid' ? p.premium : 0,
      companyPct,
      companyGel,
      employeePct: 100 - companyPct,
      employeeGel: p.premium - companyGel,
      status,
    })
  })
}
