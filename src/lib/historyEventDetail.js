

import {
  momentEventPresentation,
  momentSeverityLabel,
} from './historyMoments.js'
import { sensorColorForAlert } from './historySensorColor.js'
import { formatLocalHms } from './historyTimeline.js'

export function formatEventLongDate(createdAt) {
  const d = new Date(createdAt)
  if (!Number.isFinite(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function eventComparableMetrics(alert) {
  const type = alert?.anomaly_type
  const value = Number(alert?.value)
  const baseline = Number(alert?.baseline)
  if (!Number.isFinite(value) || !Number.isFinite(baseline)) return null
  if (baseline === 0) return null

  if (type === 'heart_rate') {
    const abs = value - baseline
    const pct = (abs / baseline) * 100
    const sign = abs > 0 ? '+' : abs < 0 ? '-' : ''
    const absMag = Math.abs(Math.round(abs))
    return {
      valueLabel: `${Math.round(value)} BPM`,
      baselineLabel: `${Math.round(baseline)} BPM`,
      deviationAbsLabel: `${sign}${absMag} BPM`,
      deviationPctLabel: `${sign}${Math.abs(pct).toFixed(1)}%`,
      value,
      baseline,
    }
  }

  if (type === 'temperature') {
    const abs = value - baseline
    const pct = (abs / baseline) * 100
    const sign = abs > 0 ? '+' : abs < 0 ? '-' : ''
    return {
      valueLabel: `${value.toFixed(1)}°C`,
      baselineLabel: `${baseline.toFixed(1)}°C`,
      deviationAbsLabel: `${sign}${Math.abs(abs).toFixed(1)}°C`,
      deviationPctLabel: `${sign}${Math.abs(pct).toFixed(1)}%`,
      value,
      baseline,
    }
  }

  return null
}

/**
 * Positions for the restrained baseline comparison instrument (0–1).
 * Pads the range so a single-point delta still reads directionally.
 */
export function baselineComparisonLayout(value, baseline) {
  if (!Number.isFinite(value) || !Number.isFinite(baseline)) return null
  const span = Math.abs(value - baseline)
  const pad = Math.max(span * 0.55, Math.abs(baseline) * 0.02, 0.4)
  const min = Math.min(value, baseline) - pad
  const max = Math.max(value, baseline) + pad
  const width = max - min || 1
  return {
    baselineT: (baseline - min) / width,
    eventT: (value - min) / width,
    rising: value > baseline,
    falling: value < baseline,
  }
}

/**
 * Full Event Detail model for the right panel.
 */
export function buildEventDetailModel(alert) {
  if (!alert || alert.id == null) return null
  const meta = momentEventPresentation(alert)
  const metrics = eventComparableMetrics(alert)
  const layout = metrics
    ? baselineComparisonLayout(metrics.value, metrics.baseline)
    : null
  const severity = momentSeverityLabel(alert.severity)

  const type = alert.anomaly_type
  const category =
    type === 'heart_rate'
      ? 'HEART'
      : type === 'safe_zone'
        ? 'LOCATION'
        : type === 'activity'
          ? 'ACTIVITY'
          : type === 'temperature'
            ? 'TEMPERATURE'
            : 'SIGNAL'

  return {
    id: alert.id,
    anomalyType: type,
    color: sensorColorForAlert(alert),
    Icon: meta.Icon,
    category,
    title: meta.title,
    longDate: formatEventLongDate(alert.created_at),
    hms: formatLocalHms(alert.created_at),
    severityLabel: severity ? severity.toUpperCase() : null,
    metrics,
    comparison: layout,
    
    severityRaw: alert.severity,
    valueRaw: alert.value,
    baselineRaw: alert.baseline,
  }
}
