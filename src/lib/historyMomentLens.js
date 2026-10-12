

import {
  Heartbeat,
  PawPrint,
  Thermometer,
  ThermometerHot,
  ThermometerCold,
  MapPinSimpleArea,
} from '@phosphor-icons/react'
import {
  momentEventPresentation,
  momentSeverityLabel,
  momentValueLines,
} from './historyMoments.js'
import { SENSOR_COLORS, sensorColorForAlert } from './historySensorColor.js'
import { formatLocalHms } from './historyTimeline.js'

export const INDIVIDUAL_SIGNAL_LIMIT = 6

const GROUPED_SENSORS = [
  {
    type: 'heart_rate',
    label: 'HEART',
    Icon: Heartbeat,
    color: SENSOR_COLORS.heart_rate,
  },
  {
    type: 'temperature',
    label: 'TEMPERATURE',
    Icon: Thermometer,
    color: SENSOR_COLORS.temperature,
  },
  {
    type: 'activity',
    label: 'ACTIVITY',
    Icon: PawPrint,
    color: SENSOR_COLORS.activity,
  },
  {
    type: 'safe_zone',
    label: 'LOCATION',
    Icon: MapPinSimpleArea,
    color: SENSOR_COLORS.safe_zone,
  },
]

function categoryLabel(alert, meta) {
  const type = alert?.anomaly_type
  if (type === 'activity') return 'ACTIVITY'
  if (type === 'temperature') return 'TEMPERATURE'
  if (type === 'safe_zone') return 'LOCATION'
  if (type === 'heart_rate') return 'HEART'
  return (meta.category || type || 'SIGNAL').toUpperCase()
}

function individualPrimary(alert, meta) {
  const type = alert?.anomaly_type
  if (type === 'temperature' || type === 'heart_rate') {
    const values = momentValueLines(alert)
    if (values[0]) return values[0]
  }
  if (type === 'activity') return 'Activity event'
  return meta.title
}

function individualLines(alert) {
  const hms = formatLocalHms(alert.created_at)
  const type = alert?.anomaly_type
  const lines = [hms]
  if (type === 'temperature' || type === 'heart_rate') {
    const values = momentValueLines(alert)
    if (values[1]) {
      lines.push(values[1].replace(/^Baseline\s+/i, 'baseline '))
    }
  } else if (type === 'safe_zone') {
    const severity = momentSeverityLabel(alert.severity)
    if (severity) lines.push(severity)
  }
  return lines
}

export function buildSignalColumn(alert) {
  const meta = momentEventPresentation(alert)
  return {
    id: alert.id,
    alert,
    kind: 'signal',
    category: categoryLabel(alert, meta),
    Icon: meta.Icon,
    color: sensorColorForAlert(alert),
    primary: individualPrimary(alert, meta),
    lines: individualLines(alert),
  }
}

function temperatureGroupIdentity(events) {
  let highCount = 0
  let lowCount = 0
  for (const alert of events) {
    const value = Number(alert?.value)
    const baseline = Number(alert?.baseline)
    if (!Number.isFinite(value) || !Number.isFinite(baseline)) continue
    if (value > baseline) highCount += 1
    else if (value < baseline) lowCount += 1
  }

  const comparable = highCount + lowCount > 0
  if (highCount > 0 && lowCount === 0) {
    return {
      highCount,
      lowCount,
      comparable,
      Icon: ThermometerHot,
      color: SENSOR_COLORS.temperature_high,
    }
  }
  if (lowCount > 0 && highCount === 0) {
    return {
      highCount,
      lowCount,
      comparable,
      Icon: ThermometerCold,
      color: SENSOR_COLORS.temperature_low,
    }
  }
  return {
    highCount,
    lowCount,
    comparable,
    Icon: Thermometer,
    color: SENSOR_COLORS.temperature,
  }
}

function timeRangeLine(events) {
  if (!events.length) return null
  const first = events[0]
  const last = events[events.length - 1]
  if (!first?.created_at || !last?.created_at) return null
  const a = formatLocalHms(first.created_at)
  const b = formatLocalHms(last.created_at)
  if (a === b) return a
  return `${a} — ${b}`
}

export function buildMomentLensColumns(events) {
  const rows = Array.isArray(events) ? events : []
  if (rows.length <= INDIVIDUAL_SIGNAL_LIMIT) {
    return {
      mode: 'individual',
      columns: rows.map((alert) => buildSignalColumn(alert)),
    }
  }

  const columns = []
  for (const sensor of GROUPED_SENSORS) {
    const matched = rows.filter((e) => e.anomaly_type === sensor.type)
    if (matched.length === 0) continue

    let Icon = sensor.Icon
    let color = sensor.color
    const lines = []
    const range = timeRangeLine(matched)
    if (range) lines.push(range)

    let highCount = 0
    let lowCount = 0
    if (sensor.type === 'temperature') {
      const temp = temperatureGroupIdentity(matched)
      Icon = temp.Icon
      color = temp.color
      highCount = temp.highCount
      lowCount = temp.lowCount
      if (temp.comparable && highCount > 0 && lowCount > 0) {
        lines.push(`${highCount} HIGH · ${lowCount} LOW`)
      }
    }

    columns.push({
      id: `group-${sensor.type}`,
      kind: 'group',
      type: sensor.type,
      category: sensor.label,
      Icon,
      color,
      primary: `${matched.length} ${matched.length === 1 ? 'SIGNAL' : 'SIGNALS'}`,
      lines,
      count: matched.length,
      highCount,
      lowCount,
      
      events: matched,
    })
  }

  return { mode: 'grouped', columns }
}

export function groupLabelForType(type) {
  const found = GROUPED_SENSORS.find((s) => s.type === type)
  return found?.label ?? String(type || 'GROUP').toUpperCase()
}
