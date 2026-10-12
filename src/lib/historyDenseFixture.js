

export const DENSE_FIXTURE_ENABLED = false

export const GROUP_SIGNAL_BATCH = 16

export function buildDenseMomentFixtureAlerts(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const anchor = new Date(y, m - 1, d, 12, 0, 0, 0)
  const counts = {
    heart_rate: 84,
    temperature: 61,
    activity: 38,
    safe_zone: 17,
  }
  const alerts = []
  let seq = 900000
  let offsetMs = 0

  function push(type, value, baseline) {
    const created = new Date(anchor.getTime() + offsetMs)
    offsetMs += 280
    if (offsetMs > 58_000) offsetMs = 58_000
    alerts.push({
      id: seq++,
      anomaly_type: type,
      severity: 'Significant',
      value,
      baseline,
      created_at: created.toISOString(),
    })
  }

  for (let i = 0; i < counts.heart_rate; i += 1) {
    push('heart_rate', 140 + (i % 20), 104)
  }
  for (let i = 0; i < counts.temperature; i += 1) {
    
    if (i % 2 === 0) push('temperature', 40.2 + (i % 5) * 0.1, 38.6)
    else push('temperature', 36.0 + (i % 4) * 0.1, 38.6)
  }
  for (let i = 0; i < counts.activity; i += 1) {
    push('activity', 180 + (i % 15), 90)
  }
  for (let i = 0; i < counts.safe_zone; i += 1) {
    push('safe_zone', null, null)
  }

  alerts.sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )
  return alerts
}
