

export function minutesSinceLocalMidnight(createdAt) {
  const d = new Date(createdAt)
  if (!Number.isFinite(d.getTime())) return null
  return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60 + d.getMilliseconds() / 60000
}

export function alertTemporalT(createdAt) {
  const minutes = minutesSinceLocalMidnight(createdAt)
  if (minutes == null) return null
  return Math.min(1, Math.max(0, minutes / 1440))
}

export function formatLocalHm(createdAt) {
  const d = new Date(createdAt)
  if (!Number.isFinite(d.getTime())) return '—'
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

export function formatLocalHms(createdAt) {
  const d = new Date(createdAt)
  if (!Number.isFinite(d.getTime())) return '—'
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}
