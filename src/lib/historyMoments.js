import {
  Heartbeat,
  PawPrint,
  Thermometer,
  ThermometerHot,
  ThermometerCold,
  MapPinSimpleArea,
} from '@phosphor-icons/react'
import { alertTemporalT, formatLocalHm } from './historyTimeline.js'

export const MOMENT_CLUSTER_WINDOW_MS = 60_000

export function clusterAlertsIntoMoments(alerts) {
  const rows = Array.isArray(alerts) ? alerts : []
  const moments = []
  let current = null

  for (const alert of rows) {
    if (alert?.id == null || !alert.created_at) continue
    const ts = new Date(alert.created_at).getTime()
    if (!Number.isFinite(ts)) continue

    if (
      !current ||
      ts - current.anchorMs > MOMENT_CLUSTER_WINDOW_MS
    ) {
      current = {
        id: `moment-${alert.id}`,
        anchorId: alert.id,
        anchorMs: ts,
        anchorCreatedAt: alert.created_at,
        hm: formatLocalHm(alert.created_at),
        t: alertTemporalT(alert.created_at),
        events: [alert],
      }
      if (current.t != null) moments.push(current)
      else current = null
      continue
    }

    current.events.push(alert)
  }

  return moments
}

function temperatureIcon(alert) {
  const value = Number(alert?.value)
  const baseline = Number(alert?.baseline)
  if (!Number.isFinite(value) || !Number.isFinite(baseline)) return Thermometer
  if (value > baseline) return ThermometerHot
  if (value < baseline) return ThermometerCold
  return Thermometer
}

export function momentEventPresentation(alert) {
  const type = alert?.anomaly_type
  if (type === 'heart_rate') {
    return {
      title: 'Elevated heart rate',
      category: 'Rhythm',
      Icon: Heartbeat,
      typeKey: 'heart_rate',
    }
  }
  if (type === 'activity') {
    return {
      title: 'Activity increase',
      category: 'Movement',
      Icon: PawPrint,
      typeKey: 'activity',
    }
  }
  if (type === 'temperature') {
    return {
      title: 'Temperature shift',
      category: 'Temperature',
      Icon: temperatureIcon(alert),
      typeKey: 'temperature',
    }
  }
  if (type === 'safe_zone') {
    return {
      title: 'Left safe zone',
      category: 'Location',
      Icon: MapPinSimpleArea,
      typeKey: 'safe_zone',
    }
  }
  return {
    title: type ?? 'Event',
    category: null,
    Icon: null,
    typeKey: type ?? 'unknown',
  }
}

export function momentSeverityLabel(severity) {
  if (severity === 'Significant' || severity === 'Attention') return 'Attention'
  if (severity === 'Ok' || severity === 'OK' || severity === 'Normal') return 'Ok'
  return severity ?? null
}

export function momentValueLines(alert) {
  const type = alert?.anomaly_type
  const v = Number(alert?.value)
  const b = Number(alert?.baseline)
  if (type === 'heart_rate' && Number.isFinite(v)) {
    const lines = [`${Math.round(v)} BPM`]
    if (Number.isFinite(b)) lines.push(`Baseline ${Math.round(b)} BPM`)
    return lines
  }
  if (type === 'temperature' && Number.isFinite(v)) {
    const lines = [`${v.toFixed(1)}°C`]
    if (Number.isFinite(b)) lines.push(`Baseline ${b.toFixed(1)}°C`)
    return lines
  }
  return []
}

export function momentTypeKeys(events) {
  const keys = []
  for (const ev of events) {
    const k = ev?.anomaly_type
    if (k && !keys.includes(k)) keys.push(k)
  }
  return keys
}
