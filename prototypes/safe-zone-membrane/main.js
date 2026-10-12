

import { Map, MercatorCoordinate, setWorkerUrl } from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapLibreOverlay } from '@deck.gl/maplibre'
import { TripsLayer } from '@deck.gl/geo-layers'
import { IconLayer, PathLayer, ScatterplotLayer } from '@deck.gl/layers'
import {
  buildTrail,
  sampleAlongTrail,
  haversineMeters,
  isInsideZone,
  circlePath,
} from './fake-gps.js'
import { createMembraneLayer } from './membrane-layer.js'
import {
  buildRayPresenceIcon,
  presenceByZoom,
  presenceForLens,
} from './ray-presence.js'

setWorkerUrl(maplibreWorkerUrl)

const DEFAULT_CENTER = { lat: 32.0853, lng: 34.7818 }
const BIRTH_RADIUS_M = 38
const MIN_RADIUS_M = 38
const MAX_RADIUS_M = 900
const BOUNDARY_HIT_M = 28
const SETTLE_MS = 520

let phase = 'place'

let zone =  (
  null
)

let draftHome =  (null)
let draftRadiusM = BIRTH_RADIUS_M

let stretch = 0
let stretchTarget = 0
let displayRadiusM = BIRTH_RADIUS_M
let settleFrom = BIRTH_RADIUS_M
let settleTo = BIRTH_RADIUS_M
let settleStartedAt = 0
let settling = false

let dragging = false
let mapPanWasEnabled = true

let trail = null
let loopOrigin = 0
let rayLngLat = { ...DEFAULT_CENTER }

let useLiveRay = false
let proximity = 0
let crossing = 0
let crossingTravel = 0
let wasInside = true
let crossingStartedAt = 0
const CROSSING_MS = 2400

const inkHistory = []
const INK_MAX = 48

const elPhase = document.getElementById('phase-kicker')
const elPlace = document.getElementById('place')
const elMeters = document.getElementById('meters')
const elReadout = document.getElementById('readout')
const btnLocate = document.getElementById('btn-locate')
const btnSet = document.getElementById('btn-set')
const btnReset = document.getElementById('btn-reset')
const mapEl = document.getElementById('map')

const map = new Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/positron',
  center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
  zoom: 15.35,
  pitch: 52,
  bearing: -18,
  attributionControl: false,
  interactive: true,
  fadeDuration: 0,
})

map.dragRotate.enable()
map.touchZoomRotate.enableRotation()

function toneBasemap() {
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
        if (map.getPaintProperty(id, 'icon-opacity') != null) {
          map.setPaintProperty(id, 'icon-opacity', 0.15)
        }
      }
    } catch {
      
    }
  }
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

function clampRadius(m) {
  return Math.max(MIN_RADIUS_M, Math.min(MAX_RADIUS_M, m))
}

function activeHome() {
  if (phase === 'active' && zone) return zone.home
  return draftHome
}

function activeRadius() {
  if (phase === 'active' && zone) return zone.radiusM
  return displayRadiusM
}

function syncChrome() {
  mapEl.dataset.phase = phase
  mapEl.dataset.dragging = dragging ? 'true' : 'false'

  if (phase === 'place') {
    elPhase.textContent = 'Location · Place Home'
    elPlace.textContent = 'Tap the map to place Home'
    elMeters.hidden = true
    elReadout.textContent = 'Where should Ray come home to?'
    elReadout.dataset.near = 'false'
    btnLocate.hidden = false
    btnSet.hidden = true
    btnReset.hidden = true
    return
  }

  if (phase === 'expand') {
    elPhase.textContent = 'Location · Expand'
    elPlace.textContent = 'Pull the membrane outward'
    elMeters.hidden = false
    elMeters.textContent = `${Math.round(displayRadiusM)} m`
    elReadout.textContent = dragging
      ? 'Stretching the boundary…'
      : 'Drag the edge · then set the space'
    elReadout.dataset.near = dragging ? 'true' : 'false'
    btnLocate.hidden = true
    btnSet.hidden = false
    btnReset.hidden = false
    return
  }

  
  elPhase.textContent = 'Location · Living Field'
  elPlace.textContent = 'Ray’s safe space'
  elMeters.hidden = false
  elMeters.textContent = `${Math.round(zone.radiusM)} m`
  btnLocate.hidden = true
  btnSet.hidden = true
  btnReset.hidden = false
}

function beginExpand(home) {
  draftHome = home
  draftRadiusM = BIRTH_RADIUS_M
  displayRadiusM = BIRTH_RADIUS_M
  stretch = 0
  stretchTarget = 0
  settling = false
  phase = 'expand'
  zone = null
  trail = null
  inkHistory.length = 0
  proximity = 0
  crossing = 0
  crossingTravel = 0
  syncChrome()
  map.easeTo({
    center: [home.lng, home.lat],
    zoom: Math.max(map.getZoom(), 15.4),
    duration: 700,
  })
}

function startSettle(fromM, toM) {
  settleFrom = fromM
  settleTo = toM
  settleStartedAt = performance.now()
  settling = true
  stretchTarget = 0
}

function setZone() {
  if (!draftHome) return
  const radiusM = Math.round(clampRadius(displayRadiusM))
  zone = {
    home: { lat: draftHome.lat, lng: draftHome.lng },
    radiusM,
  }
  
  window.__pawlinkSafeZone = { ...zone, setAt: new Date().toISOString() }
  console.info('[prototype] safe zone set', window.__pawlinkSafeZone)
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(
      {
        type: 'pawlink:safe-zone-set',
        home: zone.home,
        radiusM: zone.radiusM,
        setAt: window.__pawlinkSafeZone.setAt,
      },
      window.location.origin,
    )
  }

  phase = 'active'
  stretch = 0
  stretchTarget = 0
  settling = false
  displayRadiusM = radiusM
  draftRadiusM = radiusM
  useLiveRay = false

  trail = buildTrail(zone.home, zone.radiusM, 0)
  loopOrigin = performance.now()
  wasInside = true
  crossing = 0
  crossingTravel = 0
  crossingStartedAt = 0
  inkHistory.length = 0
  rayLngLat = { lng: zone.home.lng, lat: zone.home.lat }

  syncChrome()
}

function focusUserLocation(payload) {
  const lat = Number(payload?.center?.lat)
  const lng = Number(payload?.center?.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false
  map.flyTo({ center: [lng, lat], zoom: 15.6, duration: 900 })
  elReadout.textContent = 'You are here — tap the map to place Home'
  return true
}

function hydrateExistingZone(payload) {
  const lat = Number(payload?.home?.lat)
  const lng = Number(payload?.home?.lng)
  const radiusM = Number(payload?.radiusM)
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    !Number.isFinite(radiusM) ||
    radiusM <= 0
  ) {
    return false
  }

  const home = { lat, lng }
  const r = Math.round(clampRadius(radiusM))
  draftHome = home
  draftRadiusM = r
  displayRadiusM = r
  stretch = 0
  stretchTarget = 0
  settling = false
  dragging = false
  zone = { home: { ...home }, radiusM: r }
  phase = 'active'
  window.__pawlinkSafeZone = { ...zone, setAt: new Date().toISOString() }

  trail = buildTrail(zone.home, zone.radiusM, 0)
  loopOrigin = performance.now()
  wasInside = true
  crossing = 0
  crossingTravel = 0
  crossingStartedAt = 0
  inkHistory.length = 0
  proximity = 0

  const rayLat = Number(payload?.ray?.lat)
  const rayLng = Number(payload?.ray?.lng)
  if (Number.isFinite(rayLat) && Number.isFinite(rayLng)) {
    useLiveRay = true
    rayLngLat = { lat: rayLat, lng: rayLng }
  } else {
    useLiveRay = false
    rayLngLat = { lng: home.lng, lat: home.lat }
  }

  
  const pad = Math.max(r, 80) * 1.35
  const dLat = pad / 111320
  const cos = Math.max(0.2, Math.cos((home.lat * Math.PI) / 180))
  const dLng = pad / (111320 * cos)
  let west = home.lng - dLng
  let east = home.lng + dLng
  let south = home.lat - dLat
  let north = home.lat + dLat
  if (useLiveRay) {
    west = Math.min(west, rayLngLat.lng - dLng * 0.25)
    east = Math.max(east, rayLngLat.lng + dLng * 0.25)
    south = Math.min(south, rayLngLat.lat - dLat * 0.25)
    north = Math.max(north, rayLngLat.lat + dLat * 0.25)
  }
  map.fitBounds(
    [
      [west, south],
      [east, north],
    ],
    { padding: 56, duration: 900, maxZoom: 16, essential: true },
  )

  syncChrome()
  elReadout.textContent = useLiveRay
    ? 'Your saved boundary · Ray is live'
    : 'Your saved boundary · Start over to rewrite'
  return true
}

function applyLiveRay(payload) {
  const lat = Number(payload?.lat ?? payload?.ray?.lat)
  const lng = Number(payload?.lng ?? payload?.ray?.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
  useLiveRay = true
  rayLngLat = { lat, lng }
}

function resetAll() {
  phase = 'place'
  zone = null
  draftHome = null
  draftRadiusM = BIRTH_RADIUS_M
  displayRadiusM = BIRTH_RADIUS_M
  stretch = 0
  stretchTarget = 0
  settling = false
  dragging = false
  trail = null
  inkHistory.length = 0
  proximity = 0
  crossing = 0
  useLiveRay = false
  window.__pawlinkSafeZone = null
  if (!mapPanWasEnabled) {
    map.dragPan.enable()
    mapPanWasEnabled = true
  }
  syncChrome()
}

function eventLngLat(e) {
  
  if (e.lngLat) return { lng: e.lngLat.lng, lat: e.lngLat.lat }
  const p = e.point || { x: e.clientX, y: e.clientY }
  const ll = map.unproject(p)
  return { lng: ll.lng, lat: ll.lat }
}

function distToBoundary(lngLat) {
  if (!draftHome) return Infinity
  const d = haversineMeters(draftHome, lngLat)
  return Math.abs(d - displayRadiusM)
}

function nearBoundary(lngLat) {
  return distToBoundary(lngLat) <= BOUNDARY_HIT_M
}

function onPointerDown(e) {
  if (phase !== 'expand' || !draftHome) return
  const ll = eventLngLat(e)
  if (!nearBoundary(ll)) return

  dragging = true
  stretchTarget = 1
  settling = false
  mapPanWasEnabled = map.dragPan.isEnabled()
  map.dragPan.disable()
  mapEl.dataset.dragging = 'true'
  e.preventDefault()
}

function onPointerMove(e) {
  if (phase !== 'expand' || !dragging || !draftHome) return
  const ll = eventLngLat(e)
  const d = haversineMeters(draftHome, ll)
  draftRadiusM = clampRadius(d)
  displayRadiusM = draftRadiusM
  stretchTarget = 1
  syncChrome()
}

function onPointerUp() {
  if (!dragging) return
  dragging = false
  mapEl.dataset.dragging = 'false'
  if (mapPanWasEnabled) map.dragPan.enable()
  startSettle(displayRadiusM, draftRadiusM)
  syncChrome()
}

map.on('load', async () => {
  toneBasemap()
  syncChrome()
  map.resize()

  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return
    const data = event.data
    if (!data || typeof data !== 'object') return
    if (data.type === 'pawlink:map-resize') {
      map.resize()
      return
    }
    if (data.type === 'pawlink:safe-zone-hydrate') {
      hydrateExistingZone(data)
      map.resize()
      return
    }
    if (data.type === 'pawlink:safe-zone-focus') {
      focusUserLocation(data)
      map.resize()
      return
    }
    if (data.type === 'pawlink:ray-update') {
      applyLiveRay(data)
    }
  })

  
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(
      { type: 'pawlink:safe-zone-ready' },
      window.location.origin,
    )
  }

  const presenceIcon = await buildRayPresenceIcon()

  map.addLayer(
    createMembraneLayer(MercatorCoordinate, {
      getHome: () => activeHome(),
      getRadiusM: () => activeRadius(),
      getStretch: () => stretch,
      getVisible: () => phase === 'expand' || phase === 'active',
      getAuthoring: () => phase === 'expand',
      getProximity: () => (phase === 'active' ? proximity : stretch * 0.55),
      getCrossing: () => (phase === 'active' ? crossing : 0),
      getCrossingTravel: () => (phase === 'active' ? crossingTravel : 0),
      getRayLocal: () => {
        const home = activeHome()
        if (!home || phase !== 'active') {
          return { east: 0, north: 0, angle: 0 }
        }
        const metersPerDegLat = 111320
        const metersPerDegLng =
          111320 * Math.cos((home.lat * Math.PI) / 180)
        const north = (rayLngLat.lat - home.lat) * metersPerDegLat
        const east = (rayLngLat.lng - home.lng) * metersPerDegLng
        return {
          east,
          north,
          angle: Math.atan2(north, east),
        }
      },
    }),
  )

  const overlay = new MapLibreOverlay({
    interleaved: true,
    layers: [],
  })
  map.addControl(overlay)

  let lastInkPush = 0

  
  map.on('click', (e) => {
    if (phase !== 'place') return
    beginExpand({ lat: e.lngLat.lat, lng: e.lngLat.lng })
  })

  
  map.on('mousedown', onPointerDown)
  map.on('mousemove', onPointerMove)
  map.on('mouseup', onPointerUp)
  map.on('mouseleave', onPointerUp)

  map.on('touchstart', (e) => {
    if (phase !== 'expand' || !e.points?.[0]) return
    const ll = map.unproject(e.points[0])
    if (!nearBoundary({ lng: ll.lng, lat: ll.lat })) return
    dragging = true
    stretchTarget = 1
    settling = false
    mapPanWasEnabled = map.dragPan.isEnabled()
    map.dragPan.disable()
    mapEl.dataset.dragging = 'true'
  })
  map.on('touchmove', (e) => {
    if (!dragging || phase !== 'expand' || !draftHome || !e.points?.[0]) return
    const ll = map.unproject(e.points[0])
    const d = haversineMeters(draftHome, { lng: ll.lng, lat: ll.lat })
    draftRadiusM = clampRadius(d)
    displayRadiusM = draftRadiusM
    stretchTarget = 1
    syncChrome()
  })
  map.on('touchend', onPointerUp)

  
  map.on('mousemove', (e) => {
    if (phase !== 'expand' || dragging) return
    mapEl.style.cursor = nearBoundary(eventLngLat(e)) ? 'grab' : 'default'
  })

  btnLocate.addEventListener('click', () => {
    if (phase !== 'place') return
    if (!navigator.geolocation) {
      elReadout.textContent = 'Location not available — tap the map instead'
      return
    }
    elReadout.textContent = 'Finding you…'
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const home = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        map.flyTo({ center: [home.lng, home.lat], zoom: 15.6, duration: 900 })
        beginExpand(home)
      },
      () => {
        elReadout.textContent = 'Couldn’t use location — tap the map instead'
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  })

  btnSet.addEventListener('click', () => {
    if (phase === 'expand') setZone()
  })

  btnReset.addEventListener('click', () => {
    resetAll()
  })

  function syncDeck(timeMs) {
    
    stretch += (stretchTarget - stretch) * 0.12

    if (settling) {
      const u = Math.min(1, (timeMs - settleStartedAt) / SETTLE_MS)
      const e = easeOutCubic(u)
      displayRadiusM = settleFrom + (settleTo - settleFrom) * e
      
      if (u >= 1) {
        settling = false
        displayRadiusM = settleTo
      }
      syncChrome()
    }

    const layers = []

    
    const ringHome = activeHome()
    const ringR = activeRadius()
    if (ringHome && (phase === 'expand' || phase === 'active')) {
      const authoring = phase === 'expand'
      layers.push(
        new PathLayer({
          id: 'zone-boundary-line',
          data: [{ path: circlePath(ringHome, ringR) }],
          getPath: (d) => d.path,
          getColor: authoring
            ? [107, 44, 46, dragging ? 230 : 200]
            : [107, 44, 46, 190],
          widthMinPixels: authoring ? (dragging ? 3.5 : 2.8) : 2.4,
          widthMaxPixels: authoring ? 5 : 4,
          widthUnits: 'pixels',
          capRounded: true,
          jointRounded: true,
          billboard: false,
        }),
      )
    }

    if (phase === 'active' && zone && trail) {
      let localT = 0
      let tripTimestamps = []

      if (!useLiveRay) {
        if (timeMs - loopOrigin > trail.duration) {
          loopOrigin = timeMs
          trail = buildTrail(zone.home, zone.radiusM, 0)
          wasInside = true
          crossing = 0
          crossingTravel = 0
          inkHistory.length = 0
        }

        localT = timeMs - loopOrigin
        tripTimestamps = trail.path.map(
          (_, i) => (i / (trail.path.length - 1)) * trail.duration,
        )

        rayLngLat = sampleAlongTrail(
          { path: trail.path, timestamps: tripTimestamps },
          localT,
          zone.home,
        )
      }

      if (timeMs - lastInkPush > 180) {
        lastInkPush = timeMs
        inkHistory.push([rayLngLat.lng, rayLngLat.lat])
        if (inkHistory.length > INK_MAX) inkHistory.shift()
      }

      const distHome = haversineMeters(zone.home, rayLngLat)
      const toBoundary = zone.radiusM - distHome
      const inside = isInsideZone(zone.home, zone.radiusM, rayLngLat)

      const edgeDist = Math.abs(toBoundary)
      proximity =
        1 - Math.max(0, Math.min(1, edgeDist / (zone.radiusM * 0.35)))

      if (wasInside && !inside) {
        crossingStartedAt = timeMs
      }
      wasInside = inside

      if (crossingStartedAt > 0) {
        const u = (timeMs - crossingStartedAt) / CROSSING_MS
        if (u >= 1) {
          crossing = 0
          crossingTravel = 0
          crossingStartedAt = 0
        } else {
          crossing = u < 0.12 ? u / 0.12 : Math.max(0, 1 - (u - 0.12) / 0.88)
          crossingTravel = u
        }
      }

      const zoom = map.getZoom()
      
      const presence = useLiveRay
        ? presenceForLens(zoom)
        : presenceByZoom(zoom)
      const pos = [rayLngLat.lng, rayLngLat.lat]

      if (!useLiveRay) {
        layers.push(
          new TripsLayer({
            id: 'ray-ink-live',
            data: [{ path: trail.path, timestamps: tripTimestamps }],
            getPath: (d) => d.path,
            getTimestamps: (d) => d.timestamps,
            getColor: [107, 44, 46, 160],
            currentTime: localT,
            trailLength: trail.duration * 0.35,
            widthMinPixels: 2.2,
            widthMaxPixels: 4.5,
            capRounded: true,
            jointRounded: true,
            shadowEnabled: false,
            fadeTrail: true,
          }),
        )
      }

      layers.push(
        new PathLayer({
          id: 'ray-ink-body',
          data:
            inkHistory.length > 2
              ? [{ path: inkHistory.map((p) => [...p]) }]
              : [],
          getPath: (d) => d.path,
          getColor: [107, 44, 46, 55],
          widthMinPixels: 5,
          widthMaxPixels: 9,
          capRounded: true,
          jointRounded: true,
          billboard: false,
        }),
        new ScatterplotLayer({
          id: 'ray-gps-point',
          data: [{ position: pos }],
          getPosition: (d) => d.position,
          getFillColor: [107, 44, 46, 255],
          getRadius: 4.2,
          radiusUnits: 'meters',
          radiusMinPixels: 4,
          radiusMaxPixels: 7,
          stroked: false,
          pickable: false,
        }),
        new ScatterplotLayer({
          id: 'ray-gps-lip',
          data: [{ position: pos }],
          getPosition: (d) => d.position,
          getFillColor: [0, 0, 0, 0],
          getLineColor: [244, 239, 230, 220],
          getRadius: 6.2,
          radiusUnits: 'meters',
          radiusMinPixels: 5.5,
          radiusMaxPixels: 9,
          stroked: true,
          filled: false,
          lineWidthUnits: 'pixels',
          getLineWidth: 1.25,
          pickable: false,
        }),
      )

      if (presence.showPortrait) {
        layers.push(
          new IconLayer({
            id: 'ray-presence-portrait',
            data: [{ position: pos }],
            getPosition: (d) => d.position,
            getIcon: () => ({
              url: presenceIcon.url,
              width: presenceIcon.width,
              height: presenceIcon.height,
              anchorY: presenceIcon.height,
              anchorX: presenceIcon.width / 2,
            }),
            getSize: presence.sizePx,
            sizeUnits: 'pixels',
            getPixelOffset: [0, -10],
            opacity: presence.opacity,
            billboard: true,
            pickable: false,
          }),
        )
      }

      const near = proximity > 0.55
      const crossed = crossing > 0.05
      elReadout.dataset.near = near || crossed ? 'true' : 'false'
      if (crossed) {
        elReadout.textContent = `Boundary · presence noted · ${Math.round(distHome)} m from home`
      } else if (near) {
        elReadout.textContent = `Near edge · ${Math.round(Math.max(0, toBoundary))} m · ${Math.round(distHome)} m from home`
      } else {
        elReadout.textContent = `${Math.round(distHome)} m from home · ${Math.round(Math.max(0, toBoundary))} m to edge`
      }
    }

    overlay.setProps({ layers })
  }

  function frame(now) {
    syncDeck(now)
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
})

map.on('error', (e) => {
  console.error('MapLibre error', e.error || e)
  window.__lastMapError = String(e.error?.message || e.error || e.message || e)
  elReadout.textContent = 'Map failed to load — check console'
})
