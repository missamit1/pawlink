

const DAY_MS = 24 * 60 * 60 * 1000

export function toDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isValidDateKey(key) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return (
    dt.getFullYear() === y &&
    dt.getMonth() === m - 1 &&
    dt.getDate() === d
  )
}

export function parseDateKey(key) {
  if (!isValidDateKey(key)) return null
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function localDayBoundsISO(key) {
  const start = parseDateKey(key)
  if (!start) return null
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return {
    startISO: start.toISOString(),
    endISO: end.toISOString(),
  }
}

export function todayKey() {
  return toDateKey(new Date())
}

export function isToday(key) {
  return key === todayKey()
}

export function addDays(key, delta) {
  const base = parseDateKey(key)
  if (!base) return todayKey()
  base.setDate(base.getDate() + delta)
  return toDateKey(base)
}

export function dayWindow(selectedKey, radius = 3) {
  const today = todayKey()
  const center = isValidDateKey(selectedKey) ? selectedKey : today
  const days = []
  for (let i = -radius; i <= radius; i += 1) {
    const key = addDays(center, i)
    if (key <= today) days.push(key)
  }
  
  while (days.length < radius * 2 + 1) {
    const first = days[0]
    if (!first) break
    days.unshift(addDays(first, -1))
  }
  return days
}

export function weekdayLong(key, locale = undefined) {
  const d = parseDateKey(key)
  if (!d) return ''
  return d.toLocaleDateString(locale, { weekday: 'long' })
}

export function monthLong(key, locale = undefined) {
  const d = parseDateKey(key)
  if (!d) return ''
  return d.toLocaleDateString(locale, { month: 'long' }).toUpperCase()
}

export function monthShort(key, locale = undefined) {
  const d = parseDateKey(key)
  if (!d) return ''
  return d.toLocaleDateString(locale, { month: 'short' }).toUpperCase()
}

export function yearOf(key) {
  const d = parseDateKey(key)
  return d ? String(d.getFullYear()) : ''
}

export function dayNumber(key) {
  const d = parseDateKey(key)
  return d ? d.getDate() : 0
}

/** Days from today (negative = past). */
export function daysFromToday(key) {
  const a = parseDateKey(todayKey())
  const b = parseDateKey(key)
  if (!a || !b) return 0
  return Math.round((b.getTime() - a.getTime()) / DAY_MS)
}

export function localTimezoneLabel() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local time'
  } catch {
    return 'Local time'
  }
}
