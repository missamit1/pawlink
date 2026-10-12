

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, NavigationArrow } from '@phosphor-icons/react'
import { Map, MercatorCoordinate, setWorkerUrl } from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapLibreOverlay } from '@deck.gl/maplibre'
import { PathLayer, IconLayer, ScatterplotLayer } from '@deck.gl/layers'
import { createMembraneLayer } from '../../prototypes/safe-zone-membrane/membrane-layer.js'
import {
  buildRayPresenceIcon,
  presenceForLens,
} from '../../prototypes/safe-zone-membrane/ray-presence.js'
import {
  SAFE_ZONE_CENTER_LAT,
  SAFE_ZONE_CENTER_LNG,
  SAFE_ZONE_RADIUS_METERS,
} from '../../safeZoneConfig.js'
import './LocationField.css'

setWorkerUrl(maplibreWorkerUrl)

function haversineMeters(a, b) {
  const toRad = (d) => (d * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

function circlePath(home, radiusM, segments = 96) {
  const METERS_PER_DEG_LAT = 111320
  const path = []
  const R = Math.max(1, radiusM)
  for (let i = 0; i <= segments; i += 1) {
    const a = (i / segments) * Math.PI * 2
    const east = Math.cos(a) * R
    const north = Math.sin(a) * R
    const dLat = north / METERS_PER_DEG_LAT
    const dLng =
      east / (METERS_PER_DEG_LAT * Math.cos((home.lat * Math.PI) / 180))
    path.push([home.lng + dLng, home.lat + dLat])
  }
  return path
}

function fitLensToWorld(map, { home, ray, radiusM }) {
  if (!map || !home || !Number.isFinite(home.lat) || !Number.isFinite(home.lng)) {
    return
  }
  const pad = Math.max(Number(radiusM) || 120, 80) * 1.25
  const dLat = pad / 111320
  const cos = Math.max(0.2, Math.cos((home.lat * Math.PI) / 180))
  const dLng = pad / (111320 * cos)
  let west = home.lng - dLng
  let east = home.lng + dLng
  let south = home.lat - dLat
  let north = home.lat + dLat
  if (Number.isFinite(ray?.lat) && Number.isFinite(ray?.lng)) {
    const distM = haversineMeters(home, ray)
    const keepRayM = Math.max(Number(radiusM) || 120, 80) * 4
    if (distM <= keepRayM) {
      const rPadLat = dLat * 0.4
      const rPadLng = dLng * 0.4
      west = Math.min(west, ray.lng - rPadLng)
      east = Math.max(east, ray.lng + rPadLng)
      south = Math.min(south, ray.lat - rPadLat)
      north = Math.max(north, ray.lat + rPadLat)
    }
  }
  map.fitBounds(
    [
      [west, south],
      [east, north],
    ],
    { padding: 28, duration: 750, maxZoom: 16.2, essential: true },
  )
}

function syncNativeZone(map, home, radiusM) {
  if (!map?.getSource || !home) return
  const ring = circlePath(home, Math.max(1, radiusM))
  const poly = ring.length ? [...ring, ring[0]] : ring
  const data = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { kind: 'fill' },
        geometry: { type: 'Polygon', coordinates: [poly] },
      },
      {
        type: 'Feature',
        properties: { kind: 'line' },
        geometry: { type: 'LineString', coordinates: ring },
      },
    ],
  }
  const source = map.getSource('pawlink-safe-zone')
  if (source) {
    source.setData(data)
  } else {
    map.addSource('pawlink-safe-zone', { type: 'geojson', data })
    map.addLayer({
      id: 'pawlink-safe-zone-fill',
      type: 'fill',
      source: 'pawlink-safe-zone',
      filter: ['==', '$type', 'Polygon'],
      paint: {
        'fill-color': '#6b2c2e',
        'fill-opacity': 0.1,
      },
    })
    map.addLayer({
      id: 'pawlink-safe-zone-line',
      type: 'line',
      source: 'pawlink-safe-zone',
      filter: ['==', '$type', 'LineString'],
      paint: {
        'line-color': '#6b2c2e',
        'line-width': 2.8,
        'line-opacity': 0.92,
      },
    })
  }

  const homeData = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [home.lng, home.lat],
    },
  }
  const homeSource = map.getSource('pawlink-home-point')
  if (homeSource) {
    homeSource.setData(homeData)
  } else {
    map.addSource('pawlink-home-point', { type: 'geojson', data: homeData })
    map.addLayer({
      id: 'pawlink-home-dot',
      type: 'circle',
      source: 'pawlink-home-point',
      paint: {
        'circle-radius': 5,
        'circle-color': '#e0b49c',
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#5a322d',
      },
    })
  }
}

function formatUpdatedLabel(iso) {
  if (!iso) return null
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return null
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000))
  if (mins < 1) return 'Updated just now'
  if (mins === 1) return 'Updated 1 min ago'
  if (mins < 60) return `Updated ${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours === 1) return 'Updated 1 hr ago'
  if (hours < 24) return `Updated ${hours} hr ago`
  return `Updated ${new Date(iso).toLocaleDateString()}`
}

function toneBasemap(map) {
  const layers = map.getStyle().layers || []
  for (const layer of layers) {
    const id = layer.id
    try {
      if (layer.type === 'background') {
        map.setPaintProperty(id, 'background-color', '#ebe4d8')
      }
      if (layer.type === 'fill') {
        if (/water|ocean|lake|river/i.test(id)) {
          map.setPaintProperty(id, 'fill-color', '#d4cbc0')
          map.setPaintProperty(id, 'fill-opacity', 0.85)
        } else if (/building|landuse|park|grass|wood/i.test(id)) {
          map.setPaintProperty(id, 'fill-color', '#ddd4c8')
          map.setPaintProperty(id, 'fill-opacity', 0.55)
        }
      }
      if (layer.type === 'line') {
        if (/road|street|path|bridge|tunnel|highway/i.test(id)) {
          map.setPaintProperty(id, 'line-color', '#8a7e72')
          map.setPaintProperty(id, 'line-opacity', 0.5)
        } else {
          map.setPaintProperty(id, 'line-opacity', 0.25)
        }
      }
      if (layer.type === 'symbol') {
        map.setPaintProperty(id, 'text-opacity', 0.22)
        map.setPaintProperty(id, 'text-color', '#6b6158')
        map.setPaintProperty(id, 'text-halo-color', '#f4efe6')
        map.setPaintProperty(id, 'text-halo-width', 1)
      }
    } catch {
      
    }
  }
}

export default function LocationField({
  dogName = 'Ray',
  latitude,
  longitude,
  centerLat = SAFE_ZONE_CENTER_LAT,
  centerLng = SAFE_ZONE_CENTER_LNG,
  radiusMeters = SAFE_ZONE_RADIUS_METERS,
  trail = [],
  onUseMyLocation,
  onEditSafeZone,
  locationStatus,
  updatedAt = null,
  onOpenHistory,
  children,
}) {
  const containerRef = useRef(null)
  const hostRef = useRef(null)
  const mapRef = useRef(null)
  const overlayRef = useRef(null)
  const [liveFlash, setLiveFlash] = useState(false)
  const [inspectOpen, setInspectOpen] = useState(false)
  const stateRef = useRef({
    home: { lat: centerLat, lng: centerLng },
    radiusM: radiusMeters,
    ray: { lat: centerLat, lng: centerLng },
    trail: [],
    proximity: 0,
    crossing: 0,
    crossingTravel: 0,
    wasInside: true,
    crossingStartedAt: 0,
    presenceIcon: null,
  })

  const home = useMemo(
    () => ({ lat: centerLat, lng: centerLng }),
    [centerLat, centerLng],
  )
  const hasRay =
    Number.isFinite(latitude) && Number.isFinite(longitude)
  const distanceFromHome = hasRay
    ? haversineMeters(home, { lat: latitude, lng: longitude })
    : null
  const isWithinSafeZone =
    distanceFromHome != null && distanceFromHome <= radiusMeters
  const realUpdatedLabel = formatUpdatedLabel(updatedAt)
  const distanceMeters =
    distanceFromHome != null ? Math.round(distanceFromHome) : null
  const distanceLabel =
    distanceMeters != null ? distanceMeters.toLocaleString('en-US') : '—'
  const radiusLabel = Math.round(radiusMeters).toLocaleString('en-US')

  useEffect(() => {
    setLiveFlash(true)
    const id = window.setTimeout(() => setLiveFlash(false), 450)
    return () => window.clearTimeout(id)
  }, [latitude, longitude, updatedAt])

  function toggleInspect() {
    setInspectOpen((open) => !open)
  }

  function closeInspect() {
    setInspectOpen(false)
  }

  function openLocationHistory() {
    setInspectOpen(false)
    onOpenHistory?.(true)
  }

  const signalLabel = realUpdatedLabel
    ? realUpdatedLabel.replace(/^Updated\s+/i, '')
    : '—'

  useEffect(() => {
    if (!inspectOpen) return undefined
    function onKey(e) {
      if (e.key === 'Escape') closeInspect()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [inspectOpen])

  
  useEffect(() => {
    const s = stateRef.current
    s.home = { lat: centerLat, lng: centerLng }
    s.radiusM = Math.max(1, radiusMeters)
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      s.ray = { lat: latitude, lng: longitude }
    }
    s.trail = trail
  }, [centerLat, centerLng, radiusMeters, latitude, longitude, trail])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const home = {
      lat: centerLat,
      lng: centerLng,
    }

    const map = new Map({
      container: containerRef.current,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: [home.lng, home.lat],
      zoom: 15.2,
      pitch: 28,
      bearing: -12,
      attributionControl: false,
      interactive: true,
      fadeDuration: 0,
    })
    mapRef.current = map
    map.dragRotate.enable()
    map.touchZoomRotate.enableRotation()

    let raf = 0
    let cancelled = false
    const CROSSING_MS = 2400
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            map.resize()
          })
        : null
    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    map.on('load', async () => {
      if (cancelled) return
      toneBasemap(map)
      map.resize()
      requestAnimationFrame(() => {
        if (!cancelled) map.resize()
      })

      const presenceIcon = await buildRayPresenceIcon()
      stateRef.current.presenceIcon = presenceIcon

      syncNativeZone(
        map,
        stateRef.current.home,
        stateRef.current.radiusM,
      )

      try {
        map.addLayer(
          createMembraneLayer(MercatorCoordinate, {
            getHome: () => stateRef.current.home,
            getRadiusM: () => stateRef.current.radiusM,
            getStretch: () => 0,
            getVisible: () => true,
            getAuthoring: () => false,
            getProximity: () => stateRef.current.proximity,
            getCrossing: () => stateRef.current.crossing,
            getCrossingTravel: () => stateRef.current.crossingTravel,
            getRayLocal: () => {
              const { home: h, ray } = stateRef.current
              const metersPerDegLat = 111320
              const metersPerDegLng =
                111320 * Math.cos((h.lat * Math.PI) / 180)
              const north = (ray.lat - h.lat) * metersPerDegLat
              const east = (ray.lng - h.lng) * metersPerDegLng
              return {
                east,
                north,
                angle: Math.atan2(north, east),
              }
            },
          }),
        )
      } catch (err) {
        console.warn('Membrane layer unavailable — using flat ring', err)
      }

      const overlay = new MapLibreOverlay({ interleaved: false, layers: [] })
      map.addControl(overlay)
      overlayRef.current = overlay

      fitLensToWorld(map, {
        home: stateRef.current.home,
        ray: stateRef.current.ray,
        radiusM: stateRef.current.radiusM,
      })

      const frame = (now) => {
        if (cancelled) return
        const s = stateRef.current
        const distHome = haversineMeters(s.home, s.ray)
        const toBoundary = s.radiusM - distHome
        const inside = distHome <= s.radiusM
        const edgeDist = Math.abs(toBoundary)
        s.proximity =
          1 - Math.max(0, Math.min(1, edgeDist / (s.radiusM * 0.35)))

        if (s.wasInside && !inside) {
          s.crossingStartedAt = now
        }
        s.wasInside = inside

        if (s.crossingStartedAt > 0) {
          const u = (now - s.crossingStartedAt) / CROSSING_MS
          if (u >= 1) {
            s.crossing = 0
            s.crossingTravel = 0
            s.crossingStartedAt = 0
          } else {
            s.crossing =
              u < 0.12 ? u / 0.12 : Math.max(0, 1 - (u - 0.12) / 0.88)
            s.crossingTravel = u
          }
        }

        
        if (now - (s._lastNativeSync || 0) > 400) {
          s._lastNativeSync = now
          syncNativeZone(map, s.home, s.radiusM)
        }

        const zoom = map.getZoom()
        const presence = presenceForLens(zoom)
        const pos = [s.ray.lng, s.ray.lat]
        const trailPath =
          s.trail.length > 1
            ? s.trail.map((p) => [p.lng, p.lat])
            : []

        const layers = [
          new PathLayer({
            id: 'zone-boundary-line',
            data: [{ path: circlePath(s.home, s.radiusM) }],
            getPath: (d) => d.path,
            getColor: [107, 44, 46, 220],
            widthMinPixels: 3,
            widthMaxPixels: 5.5,
            widthUnits: 'pixels',
            capRounded: true,
            jointRounded: true,
            billboard: false,
            updateTriggers: {
              getPath: [s.home.lat, s.home.lng, s.radiusM],
            },
          }),
          new ScatterplotLayer({
            id: 'home-point',
            data: [{ position: [s.home.lng, s.home.lat] }],
            getPosition: (d) => d.position,
            getFillColor: [224, 180, 156, 230],
            getLineColor: [90, 50, 45, 200],
            getRadius: 5,
            radiusUnits: 'meters',
            radiusMinPixels: 5,
            radiusMaxPixels: 8,
            stroked: true,
            filled: true,
            lineWidthUnits: 'pixels',
            getLineWidth: 1.5,
            updateTriggers: {
              getPosition: [s.home.lat, s.home.lng],
            },
          }),
        ]

        if (trailPath.length > 1) {
          layers.push(
            new PathLayer({
              id: 'ray-trail',
              data: [{ path: trailPath }],
              getPath: (d) => d.path,
              getColor: [107, 44, 46, 140],
              widthMinPixels: 2.2,
              widthMaxPixels: 4,
              capRounded: true,
              jointRounded: true,
              billboard: false,
            }),
          )
        }

        layers.push(
          new ScatterplotLayer({
            id: 'ray-gps-point',
            data: [{ position: pos }],
            getPosition: (d) => d.position,
            getFillColor: [107, 44, 46, 255],
            getRadius: 4.2,
            radiusUnits: 'meters',
            radiusMinPixels: 5,
            radiusMaxPixels: 9,
            stroked: false,
            updateTriggers: { getPosition: pos },
          }),
          new ScatterplotLayer({
            id: 'ray-gps-lip',
            data: [{ position: pos }],
            getPosition: (d) => d.position,
            getFillColor: [0, 0, 0, 0],
            getLineColor: [244, 239, 230, 220],
            getRadius: 7.5,
            radiusUnits: 'meters',
            radiusMinPixels: 7,
            radiusMaxPixels: 12,
            stroked: true,
            filled: false,
            lineWidthUnits: 'pixels',
            getLineWidth: 1.5,
            updateTriggers: { getPosition: pos },
          }),
        )

        if (presence.showPortrait && s.presenceIcon) {
          layers.push(
            new IconLayer({
              id: 'ray-presence-portrait',
              data: [{ position: pos }],
              getPosition: (d) => d.position,
              getIcon: () => ({
                url: s.presenceIcon.url,
                width: s.presenceIcon.width,
                height: s.presenceIcon.height,
                anchorY: s.presenceIcon.height,
                anchorX: s.presenceIcon.width / 2,
              }),
              getSize: presence.sizePx,
              sizeUnits: 'pixels',
              getPixelOffset: [0, -8],
              opacity: presence.opacity,
              billboard: true,
              updateTriggers: {
                getPosition: pos,
                getSize: presence.sizePx,
              },
            }),
          )
        }

        overlay.setProps({ layers })

        
        const mapCenter = map.getCenter()
        const rayFromCenter = haversineMeters(
          { lat: mapCenter.lat, lng: mapCenter.lng },
          s.ray,
        )
        const homeFromCenter = haversineMeters(
          { lat: mapCenter.lat, lng: mapCenter.lng },
          s.home,
        )
        const needsRefit =
          (Number.isFinite(s.ray.lat) &&
            rayFromCenter > Math.max(55, s.radiusM * 0.35)) ||
          homeFromCenter > Math.max(55, s.radiusM * 0.35)
        if (needsRefit && now - (s._lastFollowAt || 0) > 1600) {
          s._lastFollowAt = now
          fitLensToWorld(map, {
            home: s.home,
            ray: s.ray,
            radiusM: s.radiusM,
          })
        }

        raf = requestAnimationFrame(frame)
      }

      raf = requestAnimationFrame(frame)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      resizeObserver?.disconnect()
      map.remove()
      mapRef.current = null
      overlayRef.current = null
    }
    
    
  }, [])

  
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    fitLensToWorld(map, {
      home: { lat: centerLat, lng: centerLng },
      ray:
        Number.isFinite(latitude) && Number.isFinite(longitude)
          ? { lat: latitude, lng: longitude }
          : null,
      radiusM: radiusMeters,
    })
  }, [centerLat, centerLng, radiusMeters, latitude, longitude])

  
  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    const rail = host.closest('.dashboard-rail') || host.parentElement
    const screen = host.closest('.product-screen')

    function measure() {
      const nav = document.querySelector('.location-editorial-stage .paw-panel__nav')
      const dock =
        document.querySelector('.product-screen__dock') ||
        document.querySelector('#health')
      if (!rail || !nav || !dock) return

      const railBox = rail.getBoundingClientRect()
      const navBox = nav.getBoundingClientRect()
      const dockBox = dock.getBoundingClientRect()
      const gap = 24
      const top = Math.max(0, navBox.bottom - railBox.top + 10)
      const dockClearance = Math.max(0, railBox.bottom - dockBox.top)

      host.style.setProperty('--location-top', `${top}px`)
      host.style.setProperty('--telemetry-dock-height', `${dockClearance}px`)
      host.style.setProperty('--location-dock-gap', `${gap}px`)

      if (screen) {
        screen.style.setProperty('--location-top', `${top}px`)
        screen.style.setProperty('--telemetry-dock-height', `${dockClearance}px`)
        screen.style.setProperty('--location-dock-gap', `${gap}px`)
      }

      
      const instrument = host.querySelector('.location-instrument')
      const lens = host.querySelector('.ray-location__lens-system')
      const radar = host.querySelector('.home-radar')
      if (instrument && lens) {
        const hostBox = host.getBoundingClientRect()
        const lensBox = lens.getBoundingClientRect()
        if (hostBox.height > 0) {
          const lensBottomPct =
            ((lensBox.bottom - hostBox.top) / hostBox.height) * 100
          const lensTopPct =
            ((lensBox.top - hostBox.top) / hostBox.height) * 100
          instrument.style.setProperty(
            '--lens-bottom-pct',
            `${Math.min(72, Math.max(48, lensBottomPct + 1.5)).toFixed(2)}%`,
          )
          instrument.style.setProperty(
            '--lens-top-pct',
            `${lensTopPct.toFixed(2)}%`,
          )

          
          if (radar) {
            const radarHalfPct =
              ((radar.getBoundingClientRect().height / 2) / hostBox.height) *
              100
            const minHome = lensBottomPct + radarHalfPct + 4.5
            const maxHome = 100 - radarHalfPct - 6
            const homeTop = Math.min(maxHome, Math.max(minHome, 70))
            instrument.style.setProperty(
              '--home-top-pct',
              `${homeTop.toFixed(2)}%`,
            )
          }
        }
      }
    }

    measure()
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => measure())
        : null
    ro?.observe(rail)
    const dockEl =
      document.querySelector('.product-screen__dock') ||
      document.querySelector('#health')
    const navEl = document.querySelector(
      '.location-editorial-stage .paw-panel__nav',
    )
    if (dockEl) ro?.observe(dockEl)
    if (navEl) ro?.observe(navEl)
    const lensEl = host.querySelector('.ray-location__lens-system')
    if (lensEl) ro?.observe(lensEl)
    window.addEventListener('resize', measure)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const isLive = hasRay || Boolean(updatedAt)

  function enterMap() {
    if (typeof onEditSafeZone === 'function') {
      onEditSafeZone()
      return
    }
    toggleInspect()
  }

  return (
    <>
      <section className="location-editorial-stage" aria-label="PawLink chrome">
        {children}

        {}
        <div className="ray-location__editorial-block">
          <div className="ray-location__editorial">
            <h1>
              <span className="title-first">
                <span className="title-dog-name">{dogName}</span>
                <span className="title-verb"> is</span>
              </span>
              <span className="title-distance" aria-live="polite">
                <span>{distanceLabel}</span>
                {distanceMeters != null && <small>m</small>}
              </span>
              <span className="title-last">from home</span>
            </h1>
            <p className="paw-panel__caption">
              {distanceFromHome == null
                ? `Waiting for ${dogName || 'your dog'}’s signal.`
                : isWithinSafeZone
                  ? 'Within your safe world.'
                  : 'Beyond the safe boundary.'}
            </p>
          </div>
        </div>
      </section>

      <div className="location-instrument-host" ref={hostRef}>
        <section
          className="location-instrument"
          data-inspect={inspectOpen ? 'open' : 'closed'}
          aria-label={`${dogName || 'Dog'} location`}
          id="location"
        >
          <p className="ray-location__eyebrow">
            {(dogName || 'DOG').toUpperCase()} <span>/</span> LOCATION
          </p>

          <div className="location-track" aria-hidden="true">
            <span className="track-solid" />
            <span className="track-dotted" />
            <span className="track-bottom" />

            {isLive ? (
              <div
                className="track-live"
                data-flash={liveFlash ? 'true' : 'false'}
              >
                <span className="live-dot" />
                <span>LIVE</span>
              </div>
            ) : null}

            <div className="track-ray">
              <span className="ray-dot" />
              <span>{(dogName || 'DOG').toUpperCase()}</span>
            </div>

            <div className="home-radar">
              <span className="radar-ring radar-ring--outer" />
              <span className="radar-ring radar-ring--middle" />
              <span className="radar-ring radar-ring--glow" />
              <span className="radar-ring radar-ring--red" />
              <span className="radar-center" />
            </div>

            <div className="track-home">
              <p>HOME</p>
              <span>SAFE RADIUS</span>
              <strong>{radiusLabel} m</strong>
            </div>
          </div>

          <div className="ray-location__lens-system">
            <button
              type="button"
              className="ray-location__lens"
              aria-label={
                onEditSafeZone
                  ? `Enter map for ${dogName || 'dog'}`
                  : inspectOpen
                    ? 'Close location inspect'
                    : `Explore ${dogName || 'dog'}'s location`
              }
              aria-expanded={onEditSafeZone ? undefined : inspectOpen}
              onClick={enterMap}
            >
              <div className="ray-location__map" ref={containerRef} />
              <span
                className="ray-location__lens-reflection"
                aria-hidden="true"
              />
            </button>

            {!inspectOpen ? (
              <button
                type="button"
                className="location-explore"
                aria-expanded={false}
                onClick={enterMap}
              >
                <span>{onEditSafeZone ? 'ENTER MAP' : 'EXPLORE'}</span>
                <span className="location-explore__line" aria-hidden="true" />
                <span className="location-explore__arrow" aria-hidden="true">
                  <ArrowRight weight="regular" />
                </span>
              </button>
            ) : null}
          </div>

          {inspectOpen ? (
            <button
              type="button"
              className="location-explore"
              aria-expanded
              onClick={toggleInspect}
            >
              <span>CLOSE</span>
              <span className="location-explore__line" aria-hidden="true" />
              <span className="location-explore__arrow" aria-hidden="true">
                ×
              </span>
            </button>
          ) : null}

          <div
            className="location-inspect"
            data-open={inspectOpen ? 'true' : 'false'}
            aria-hidden={!inspectOpen}
          >
            <div
              className="location-inspect__metric"
              style={{ '--inspect-i': 0 }}
            >
              <span className="location-inspect__leader" aria-hidden="true" />
              <div>
                <span className="location-inspect__label">DISTANCE</span>
                <strong>
                  {distanceMeters != null ? `${distanceLabel} m` : '—'}
                </strong>
              </div>
            </div>
            <div
              className="location-inspect__metric"
              style={{ '--inspect-i': 1 }}
            >
              <span className="location-inspect__leader" aria-hidden="true" />
              <div>
                <span className="location-inspect__label">SAFE RADIUS</span>
                <strong>{radiusLabel} m</strong>
              </div>
            </div>
            <div
              className="location-inspect__metric"
              style={{ '--inspect-i': 2 }}
            >
              <span className="location-inspect__leader" aria-hidden="true" />
              <div>
                <span className="location-inspect__label">LAST SIGNAL</span>
                <strong>{signalLabel}</strong>
              </div>
            </div>
            <button
              type="button"
              className="location-inspect__history"
              style={{ '--inspect-i': 3 }}
              tabIndex={inspectOpen ? 0 : -1}
              onClick={openLocationHistory}
            >
              <span>LOCATION HISTORY</span>
              <ArrowRight weight="regular" aria-hidden="true" />
            </button>
          </div>

          <div className="location-use-current">
            {onEditSafeZone && (
              <button
                type="button"
                className="location-enter-map"
                onClick={onEditSafeZone}
              >
                Enter to the map
              </button>
            )}

            {onUseMyLocation && (
              <button
                type="button"
                className="location-use-current__btn"
                onClick={onUseMyLocation}
              >
                <NavigationArrow weight="regular" aria-hidden="true" />
                <span>USE MY LOCATION</span>
              </button>
            )}

            {locationStatus ? (
              <p className="location-use-current__status">{locationStatus}</p>
            ) : null}

            {realUpdatedLabel && !inspectOpen ? (
              <p className="location-use-current__updated">{realUpdatedLabel}</p>
            ) : null}
          </div>
        </section>
      </div>
    </>
  )
}
