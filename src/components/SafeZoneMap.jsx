import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  SAFE_ZONE_CENTER_LAT,
  SAFE_ZONE_CENTER_LNG,
  SAFE_ZONE_RADIUS_METERS
} from '../../safeZoneConfig.js'
import './SafeZoneMap.css'

function haversineMeters(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function SafeZoneMap({
  latitude,
  longitude,
  centerLat = SAFE_ZONE_CENTER_LAT,
  centerLng = SAFE_ZONE_CENTER_LNG,
  radiusMeters = SAFE_ZONE_RADIUS_METERS,
  trail = [],
  onUseMyLocation,
  locationStatus
}) {
  const mapBoxRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const circleRef = useRef(null)
  const trailRef = useRef(null)
  const homeRef = useRef(null)

  useEffect(() => {
    if (!mapBoxRef.current || mapRef.current) return

    const map = L.map(mapBoxRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([centerLat, centerLng], 16)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    circleRef.current = L.circle([centerLat, centerLng], {
      radius: radiusMeters,
      color: '#e8a0a0',
      weight: 2,
      fillColor: '#c45c5a',
      fillOpacity: 0.14,
    }).addTo(map)

    homeRef.current = L.circleMarker([centerLat, centerLng], {
      radius: 5,
      color: '#f4e8dc',
      weight: 1,
      fillColor: '#f4e8dc',
      fillOpacity: 0.9,
    }).addTo(map)

    trailRef.current = L.polyline([], {
      color: '#f0a0a8',
      weight: 3,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map)

    mapRef.current = map
    requestAnimationFrame(() => map.invalidateSize())

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
      circleRef.current = null
      trailRef.current = null
      homeRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const circle = circleRef.current
    const home = homeRef.current
    if (!map || !circle) return

    circle.setLatLng([centerLat, centerLng])
    circle.setRadius(radiusMeters)
    home?.setLatLng([centerLat, centerLng])
    map.setView([centerLat, centerLng], 16)
  }, [centerLat, centerLng, radiusMeters])

  useEffect(() => {
    const map = mapRef.current
    if (!map || latitude == null || longitude == null) return

    const position = [latitude, longitude]

    if (!markerRef.current) {
      const icon = L.divIcon({
        className: 'ray-live-marker',
        html: '<span class="ray-live-marker__core"></span><span class="ray-live-marker__pulse"></span>',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      })
      markerRef.current = L.marker(position, { icon }).addTo(map)
    } else {
      markerRef.current.setLatLng(position)
    }
  }, [latitude, longitude])

  useEffect(() => {
    if (!trailRef.current) return
    const pts = trail
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
      .map((p) => [p.lat, p.lng])
    trailRef.current.setLatLngs(pts)
  }, [trail])

  const distance =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Number.isFinite(centerLat) &&
    Number.isFinite(centerLng)
      ? Math.round(haversineMeters(centerLat, centerLng, latitude, longitude))
      : null

  return (
    <div className="safe-zone" data-origin="location">
      <div className="safe-zone__meta">
        <p className="safe-zone__place" data-warp="0.4">
          Rishon LeZion, IL
        </p>
        <p className="safe-zone__distance" data-warp="0.55">
          {distance != null
            ? `Distance from home · ${distance} m`
            : 'Awaiting location'}
        </p>
      </div>

      <div className="safe-zone__organic">
        <svg className="safe-zone__mask-def" aria-hidden="true" width="0" height="0">
          <defs>
            <clipPath id="pawlink-safe-zone-clip" clipPathUnits="objectBoundingBox">
              <path d="M0.52 0.02 C0.78 0.00 0.98 0.14 0.99 0.38 C1.00 0.62 0.90 0.86 0.68 0.96 C0.48 1.04 0.22 0.98 0.08 0.80 C-0.02 0.64 0.00 0.38 0.10 0.20 C0.22 0.02 0.36 0.03 0.52 0.02 Z" />
            </clipPath>
          </defs>
        </svg>
        <div className="safe-zone__stone" aria-hidden="true" />
        <div ref={mapBoxRef} className="safe-zone__map" />
        <div className="safe-zone__rim" aria-hidden="true" />
        <svg
          className="safe-zone__bloom"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="safe-zone__bloom-path"
            d="M52 2 C78 0 98 14 99 38 C100 62 90 86 68 96 C48 104 22 98 8 80 C-2 64 0 38 10 20 C22 2 36 3 52 2 Z"
          />
        </svg>
      </div>

      <div className="safe-zone__actions">
        <button type="button" className="safe-zone__btn" onClick={onUseMyLocation}>
          Use my location
        </button>
        {locationStatus && (
          <p className="safe-zone__status">{locationStatus}</p>
        )}
      </div>
    </div>
  )
}

export default SafeZoneMap
