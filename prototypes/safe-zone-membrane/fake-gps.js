

const METERS_PER_DEG_LAT = 111320

export function offsetMeters(lat, lng, eastM, northM) {
  const dLat = northM / METERS_PER_DEG_LAT
  const dLng = eastM / (METERS_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180))
  return { lat: lat + dLat, lng: lng + dLng }
}

export function haversineMeters(a, b) {
  const toRad = (d) => (d * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

function noise(i) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function buildTrail(home, radiusM, nowMs = performance.now()) {
  const path = []
  const timestamps = []
  const duration = 80000
  const steps = 160
  const R = Math.max(40, radiusM)

  let east = R * 0.17
  let north = -R * 0.07
  let heading = 0.6

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps
    const n1 = noise(i)
    const n2 = noise(i + 40)
    const n3 = noise(i + 90)

    let stepM = 2.2 + n1 * 4.8
    if (t > 0.22 && t < 0.28) stepM *= 0.25
    if (t > 0.48 && t < 0.52) stepM *= 0.35
    if (t > 0.7 && t < 0.78) stepM *= 1.55

    let turn = (n2 - 0.5) * 0.55
    if (t < 0.35) {
      turn += 0.08
    } else if (t < 0.62) {
      const outward = Math.atan2(north, east)
      turn += (outward - heading) * 0.12 + (n3 - 0.5) * 0.25
    } else if (t < 0.74) {
      const outward = Math.atan2(north, east)
      turn += (outward - heading) * 0.35
      stepM *= 1.25
    } else {
      const inward = Math.atan2(-north, -east)
      turn += (inward - heading) * 0.18 + (n2 - 0.5) * 0.2
    }

    heading += turn
    east += Math.cos(heading) * stepM
    north += Math.sin(heading) * stepM * (0.88 + n3 * 0.2)

    const dist = Math.hypot(east, north)
    const maxR = t > 0.68 && t < 0.78 ? R * 1.14 : R * 0.94
    if (dist > maxR) {
      const s = maxR / dist
      east *= s
      north *= s
    }

    const p = offsetMeters(home.lat, home.lng, east, north)
    path.push([p.lng, p.lat])
    timestamps.push(nowMs + t * duration)
  }

  return { path, timestamps, duration, startMs: nowMs }
}

export function sampleAlongTrail(trail, timeMs, fallback) {
  const { path, timestamps } = trail
  if (!path || path.length < 2) {
    return { lng: fallback.lng, lat: fallback.lat }
  }

  if (timeMs <= timestamps[0]) {
    return { lng: path[0][0], lat: path[0][1] }
  }
  if (timeMs >= timestamps[timestamps.length - 1]) {
    const last = path[path.length - 1]
    return { lng: last[0], lat: last[1] }
  }

  let i = 0
  while (i < timestamps.length - 1 && timestamps[i + 1] < timeMs) i += 1
  const t0 = timestamps[i]
  const t1 = timestamps[i + 1]
  const u = (timeMs - t0) / (t1 - t0)
  const a = path[i]
  const b = path[i + 1]
  return {
    lng: a[0] + (b[0] - a[0]) * u,
    lat: a[1] + (b[1] - a[1]) * u,
  }
}

export function isInsideZone(home, radiusM, position) {
  return haversineMeters(home, position) <= radiusM
}

export function circlePath(home, radiusM, segments = 96) {
  const path = []
  const R = Math.max(1, radiusM)
  for (let i = 0; i <= segments; i += 1) {
    const a = (i / segments) * Math.PI * 2
    const p = offsetMeters(
      home.lat,
      home.lng,
      Math.cos(a) * R,
      Math.sin(a) * R,
    )
    path.push([p.lng, p.lat])
  }
  return path
}
