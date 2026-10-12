

const storageKey = (dogId) => `pawlink.safeZone.${dogId}`

export function writeSafeZoneLocal(dogId, zone) {
  if (!dogId || !zone) return
  const centerLat = Number(zone.centerLat)
  const centerLng = Number(zone.centerLng)
  const radius = Number(zone.radius)
  if (
    !Number.isFinite(centerLat) ||
    !Number.isFinite(centerLng) ||
    !Number.isFinite(radius)
  ) {
    return
  }
  try {
    window.localStorage.setItem(
      storageKey(dogId),
      JSON.stringify({
        centerLat,
        centerLng,
        radius,
        savedAt: Date.now(),
      }),
    )
  } catch {
    
  }
}

export function readSafeZoneLocal(dogId) {
  if (!dogId) return null
  try {
    const raw = window.localStorage.getItem(storageKey(dogId))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const centerLat = Number(parsed?.centerLat)
    const centerLng = Number(parsed?.centerLng)
    const radius = Number(parsed?.radius)
    if (
      !Number.isFinite(centerLat) ||
      !Number.isFinite(centerLng) ||
      !Number.isFinite(radius)
    ) {
      return null
    }
    return { centerLat, centerLng, radius }
  } catch {
    return null
  }
}
