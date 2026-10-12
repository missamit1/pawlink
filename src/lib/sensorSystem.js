

export const SENSOR_COLORS = {
  heart_rate: '#B95F62',
  hydration: '#809EAD',
  temperature_high: '#D8896F',
  temperature_low: '#7F9DA8',
  
  temperature: '#A89080',
  activity: '#9A819D',
  safe_zone: '#6F9690',
  unknown: 'rgba(107, 70, 58, 0.55)',
}

export function temperatureSignatureKey(value, baseline) {
  const v = Number(value)
  const b = Number(baseline)
  if (!Number.isFinite(v) || !Number.isFinite(b)) return 'temperature'
  if (v > b) return 'temperature_high'
  if (v < b) return 'temperature_low'
  return 'temperature'
}

export function sensorSignatureKey(alert) {
  const type = alert?.anomaly_type
  if (type === 'temperature') {
    return temperatureSignatureKey(alert?.value, alert?.baseline)
  }
  if (
    type === 'heart_rate' ||
    type === 'activity' ||
    type === 'safe_zone' ||
    type === 'hydration'
  ) {
    return type
  }
  return 'unknown'
}

export function sensorColorForAlert(alert) {
  const key = sensorSignatureKey(alert)
  return SENSOR_COLORS[key] ?? SENSOR_COLORS.unknown
}

export function sensorColor(key) {
  return SENSOR_COLORS[key] ?? SENSOR_COLORS.unknown
}

export function uniqueSensorSignatures(events) {
  const rows = Array.isArray(events) ? events : []
  const seen = new Set()
  const out = []
  for (const alert of rows) {
    const key = sensorSignatureKey(alert)
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ key, color: SENSOR_COLORS[key] ?? SENSOR_COLORS.unknown })
  }
  return out
}
