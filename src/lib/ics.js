/* Build and download an .ics calendar file for confirmed appointments.
   Slot ranges like "10:00 - 10:30" become DTSTART/DTEND on the row's dateKey
   (floating local time — no TZ conversion for the prototype). */
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => '\\' + c)

function dt(dateKey, hm) {
  const [y, m, d] = dateKey.split('-')
  const [h, min] = hm.trim().split(':')
  return `${y}${m}${d}T${h.padStart(2, '0')}${min.padStart(2, '0')}00`
}

export function downloadIcs(rows, filename = 'gpi-appointments.ics') {
  const events = rows.map((r) => {
    const [start, end] = r.slot.split(/\s*[–-]\s*/)
    return [
      'BEGIN:VEVENT',
      `UID:gpi-proto-${r.id}@mygpi.ge`,
      `DTSTART:${dt(r.dateKey, start)}`,
      `DTEND:${dt(r.dateKey, end || start)}`,
      `SUMMARY:${esc(`ექიმთან ვიზიტი — ${r.doctor.name}`)}`,
      `LOCATION:${esc(`${r.clinic.name}, ${r.clinic.address}`)}`,
      'END:VEVENT',
    ].join('\r\n')
  })
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//GPI//MyCabinet Prototype//KA', ...events, 'END:VCALENDAR'].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
