

import { formatLocalHm } from './historyTimeline.js'

export const MOMENT_NODE_PX = 28
export const TIMELINE_INSET_PX = 28

export const MIN_CENTER_GAP_PX = 40

export const MAX_WINDOW_SPAN_PX = MIN_CENTER_GAP_PX * 2.25

export const HIGH_OCCUPANCY_RATIO = 2

export const DENSITY_BIN_MINUTES = 5

export const WINDOW_MOMENT_BATCH = 16

export function usableTrackHeight(fieldHeightPx) {
  const h = Number(fieldHeightPx)
  if (!Number.isFinite(h) || h <= 0) return 0
  return Math.max(0, h - 2 * TIMELINE_INSET_PX)
}

function momentSignalCount(moment) {
  return Array.isArray(moment?.events) ? moment.events.length : 0
}

function yForT(t, usable) {
  return usable * Math.min(1, Math.max(0, t))
}

export function maxLocalDensityPx(moments, usable) {
  if (!moments.length || usable <= 0) return 0
  const ys = moments
    .map((m) => yForT(m.t, usable))
    .sort((a, b) => a - b)
  let max = 1
  let left = 0
  for (let right = 0; right < ys.length; right += 1) {
    while (ys[right] - ys[left] > MIN_CENTER_GAP_PX) left += 1
    max = Math.max(max, right - left + 1)
  }
  return max
}

export function packMomentClusters(moments, usable) {
  const sorted = [...moments].sort((a, b) => a.t - b.t || a.anchorMs - b.anchorMs)
  const clusters = []
  let current = null

  for (const moment of sorted) {
    const y = yForT(moment.t, usable)
    if (!current) {
      current = {
        moments: [moment],
        firstY: y,
        lastY: y,
      }
      clusters.push(current)
      continue
    }
    if (
      y - current.lastY < MIN_CENTER_GAP_PX &&
      y - current.firstY <= MAX_WINDOW_SPAN_PX
    ) {
      current.moments.push(moment)
      current.lastY = y
    } else {
      current = {
        moments: [moment],
        firstY: y,
        lastY: y,
      }
      clusters.push(current)
    }
  }

  return clusters.map((c, index) => finalizeCluster(c, index))
}

function finalizeCluster(raw, index) {
  const moments = raw.moments
  const first = moments[0]
  const last = moments[moments.length - 1]
  const signalCount = moments.reduce((n, m) => n + momentSignalCount(m), 0)
  const singleton = moments.length === 1
  const tMid = (first.t + last.t) / 2
  return {
    id: singleton
      ? `mark-moment-${first.id}`
      : `mark-window-${first.id}-${last.id}-${index}`,
    kind: singleton ? 'moment' : 'window',
    moments,
    momentIds: moments.map((m) => m.id),
    alertIds: moments.flatMap((m) =>
      (m.events || []).map((e) => e.id).filter((id) => id != null),
    ),
    momentCount: moments.length,
    signalCount,
    
    startCreatedAt: first.anchorCreatedAt,
    endCreatedAt: last.anchorCreatedAt,
    startHm: formatLocalHm(first.anchorCreatedAt),
    endHm: formatLocalHm(last.anchorCreatedAt),
    t: singleton ? first.t : tMid,
    tStart: first.t,
    tEnd: last.t,
  }
}

export function buildDensityFilament(moments) {
  const binCount = Math.ceil(1440 / DENSITY_BIN_MINUTES)
  const bins = Array.from({ length: binCount }, (_, i) => {
    const startMin = i * DENSITY_BIN_MINUTES
    const endMin = Math.min(1440, startMin + DENSITY_BIN_MINUTES)
    return {
      index: i,
      startMin,
      endMin,
      tStart: startMin / 1440,
      tEnd: endMin / 1440,
      tMid: (startMin + endMin) / 2 / 1440,
      momentCount: 0,
      signalCount: 0,
      moments: [],
    }
  })

  for (const moment of moments) {
    const minutes = moment.t * 1440
    const idx = Math.min(
      binCount - 1,
      Math.max(0, Math.floor(minutes / DENSITY_BIN_MINUTES)),
    )
    const bin = bins[idx]
    bin.momentCount += 1
    bin.signalCount += momentSignalCount(moment)
    bin.moments.push(moment)
  }

  const peak = bins.reduce((m, b) => Math.max(m, b.momentCount), 0)
  return { bins, peak: peak || 1 }
}

function formatHmFromMinutes(min) {
  const m = Math.max(0, Math.min(1439, Math.floor(min)))
  const hh = String(Math.floor(m / 60)).padStart(2, '0')
  const mm = String(m % 60).padStart(2, '0')
  return `${hh}:${mm}`
}

export function buildTimeWindowFromMoments(moments, idSuffix = 'sel') {
  const sorted = [...moments].sort((a, b) => a.t - b.t || a.anchorMs - b.anchorMs)
  if (!sorted.length) return null
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const signalCount = sorted.reduce((n, m) => n + momentSignalCount(m), 0)
  return {
    id: `window-${first.id}-${last.id}-${idSuffix}`,
    kind: 'window',
    moments: sorted,
    momentIds: sorted.map((m) => m.id),
    alertIds: sorted.flatMap((m) =>
      (m.events || []).map((e) => e.id).filter((id) => id != null),
    ),
    momentCount: sorted.length,
    signalCount,
    startCreatedAt: first.anchorCreatedAt,
    endCreatedAt: last.anchorCreatedAt,
    startHm: formatLocalHm(first.anchorCreatedAt),
    endHm: formatLocalHm(last.anchorCreatedAt),
    t: (first.t + last.t) / 2,
    tStart: first.t,
    tEnd: last.t,
    spanLabel:
      first.hm === last.hm
        ? first.hm
        : `${formatLocalHm(first.anchorCreatedAt)} — ${formatLocalHm(last.anchorCreatedAt)}`,
  }
}

export function timeWindowFromFilamentBin(bins, binIndex) {
  if (!bins?.length) return null
  let idx = Math.min(bins.length - 1, Math.max(0, binIndex))
  if (bins[idx].momentCount === 0) {
    let best = -1
    let bestDist = Infinity
    for (let i = 0; i < bins.length; i += 1) {
      if (bins[i].momentCount === 0) continue
      const d = Math.abs(i - idx)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    }
    if (best < 0) return null
    idx = best
  }
  const bin = bins[idx]
  const window = buildTimeWindowFromMoments(bin.moments, `bin-${idx}`)
  if (!window) return null
  
  window.binStartHm = formatHmFromMinutes(bin.startMin)
  window.binEndHm = formatHmFromMinutes(bin.endMin)
  window.spanLabel =
    window.momentCount === 1
      ? window.startHm
      : `${window.startHm} — ${window.endHm}`
  window.overviewLabel = `${window.binStartHm} — ${window.binEndHm}`
  return window
}

export function buildDayDensityLayout(moments, usableTrackHeightPx) {
  const rows = Array.isArray(moments) ? moments : []
  const usable = Math.max(0, Number(usableTrackHeightPx) || 0)
  const totalMoments = rows.length

  const empty = {
    mode: 'low',
    usableTrackHeight: usable,
    momentCount: 0,
    collisionCount: 0,
    collisionRatio: 0,
    occupiedPixelRatio: 0,
    maxLocalDensity: 0,
    marks: [],
    filament: null,
    metrics: {},
  }

  if (!totalMoments) return empty

  
  if (usable <= 0) {
    const provisional = packMomentClusters(rows, 10000)
    return {
      ...empty,
      mode: 'low',
      momentCount: totalMoments,
      marks: provisional.filter((c) => c.kind === 'moment'),
      metrics: { provisional: true },
    }
  }

  const requiredMarkSpace = totalMoments * MIN_CENTER_GAP_PX
  const occupiedPixelRatio = requiredMarkSpace / usable
  const localDensity = maxLocalDensityPx(rows, usable)

  
  const sorted = [...rows].sort((a, b) => a.t - b.t)
  let collidingMomentIds = new Set()
  for (let i = 1; i < sorted.length; i += 1) {
    const y0 = yForT(sorted[i - 1].t, usable)
    const y1 = yForT(sorted[i].t, usable)
    if (y1 - y0 < MIN_CENTER_GAP_PX) {
      collidingMomentIds.add(sorted[i - 1].id)
      collidingMomentIds.add(sorted[i].id)
    }
  }
  const collisionCount = collidingMomentIds.size
  const collisionRatio = collisionCount / totalMoments

  const packed = packMomentClusters(rows, usable)
  const absorbedIntoMulti = packed
    .filter((c) => c.kind === 'window')
    .reduce((n, c) => n + c.momentCount, 0)
  const multiWindowAbsorptionRatio = absorbedIntoMulti / totalMoments

  
  const highByOccupancy = occupiedPixelRatio >= HIGH_OCCUPANCY_RATIO

  let mode = 'low'
  if (highByOccupancy) mode = 'high'
  else if (collisionCount > 0) mode = 'medium'
  else mode = 'low'

  const filament = mode === 'high' ? buildDensityFilament(rows) : null

  let marks = []
  if (mode === 'low') {
    marks = packed.filter((c) => c.kind === 'moment')
  } else if (mode === 'medium') {
    
    marks = packed
  } else {
    marks = [] 
  }

  return {
    mode,
    usableTrackHeight: usable,
    momentCount: totalMoments,
    collisionCount,
    collisionRatio,
    occupiedPixelRatio,
    maxLocalDensity: localDensity,
    multiWindowAbsorptionRatio,
    marks,
    filament,
    metrics: {
      requiredMarkSpace,
      packedMarkCount: packed.length,
      visibleMarkCount: marks.length,
      highByOccupancy,
      minCenterGapPx: MIN_CENTER_GAP_PX,
      densityBinMinutes: DENSITY_BIN_MINUTES,
      maxWindowSpanPx: MAX_WINDOW_SPAN_PX,
    },
  }
}
