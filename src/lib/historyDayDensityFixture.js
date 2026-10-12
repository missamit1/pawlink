

import { alertTemporalT } from './historyTimeline.js'

export const ACTIVE_DAY_DENSITY_FIXTURE = null

function atLocal(dateKey, h, m, s = 0) {
  const [y, mo, d] = dateKey.split('-').map(Number)
  return new Date(y, mo - 1, d, h, m, s, 0)
}

function alertRow(id, dateKey, h, m, s, type = 'activity') {
  const created = atLocal(dateKey, h, m, s)
  return {
    id,
    anomaly_type: type,
    severity: 'Significant',
    value: type === 'temperature' ? 39.2 : type === 'heart_rate' ? 140 : null,
    baseline: type === 'temperature' ? 38.6 : type === 'heart_rate' ? 104 : null,
    created_at: created.toISOString(),
  }
}

function fixtureA(dateKey) {
  return [
    alertRow(1001, dateKey, 1, 6, 27, 'activity'),
    alertRow(1002, dateKey, 1, 6, 27, 'temperature'),
    alertRow(1003, dateKey, 1, 6, 28, 'temperature'),
    alertRow(1004, dateKey, 1, 6, 53, 'safe_zone'),
  ]
}

function fixtureB(dateKey) {
  const alerts = []
  let id = 2000
  for (let i = 0; i < 20; i += 1) {
    const minutes = Math.round((i + 0.5) * (1440 / 20))
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    alerts.push(alertRow(id++, dateKey, h, m, 0, 'activity'))
  }
  return alerts
}

function fixtureC(dateKey) {
  const alerts = []
  let id = 3000
  for (let i = 0; i < 20; i += 1) {
    const totalSec = 14 * 3600 + 7 * 60 + i * 90
    const h = Math.floor(totalSec / 3600)
    const rem = totalSec % 3600
    const m = Math.floor(rem / 60)
    const s = rem % 60
    alerts.push(alertRow(id++, dateKey, h, m, s, i % 2 ? 'heart_rate' : 'activity'))
  }
  return alerts
}

function fixtureD(dateKey) {
  const alerts = []
  let id = 4000
  for (let i = 0; i < 200; i += 1) {
    const minutes = (i / 200) * 1440
    const h = Math.floor(minutes / 60) % 24
    const m = Math.floor(minutes % 60)
    const s = Math.floor((minutes * 60) % 60)
    alerts.push(alertRow(id++, dateKey, h, m, s, 'activity'))
  }
  return alerts
}

function fixtureE(dateKey) {
  const alerts = []
  let id = 5000
  
  let sparse = 0
  for (let i = 0; sparse < 80; i += 1) {
    const minutes = (i * 11) % 1440
    if (minutes >= 14 * 60 && minutes < 16 * 60) continue
    const h = Math.floor(minutes / 60) % 24
    const m = Math.floor(minutes % 60)
    alerts.push(alertRow(id++, dateKey, h, m, 0, sparse % 2 ? 'activity' : 'heart_rate'))
    sparse += 1
  }
  
  for (let i = 0; i < 120; i += 1) {
    const offsetSec = i * 61 
    const totalSec = 14 * 3600 + offsetSec
    const h = Math.floor(totalSec / 3600)
    const rem = totalSec % 3600
    const m = Math.floor(rem / 60)
    const s = rem % 60
    alerts.push(
      alertRow(
        id++,
        dateKey,
        h,
        m,
        s,
        i % 3 === 0 ? 'temperature' : i % 3 === 1 ? 'heart_rate' : 'activity',
      ),
    )
  }
  alerts.sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )
  return alerts
}

const BUILDERS = {
  A: fixtureA,
  B: fixtureB,
  C: fixtureC,
  D: fixtureD,
  E: fixtureE,
}

export function buildDayDensityFixtureAlerts(dateKey, which = ACTIVE_DAY_DENSITY_FIXTURE) {
  if (!which || !BUILDERS[which]) return null
  const rows = BUILDERS[which](dateKey)
  
  return rows.filter((a) => alertTemporalT(a.created_at) != null)
}
