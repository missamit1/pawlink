import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import Navigation from '../components/Navigation.jsx'
import LocationField from '../components/LocationField.jsx'
import DigitalTwin from '../components/DigitalTwin.jsx'
import LiveEvents from '../components/LiveEvents.jsx'
import TelemetryDock from '../components/TelemetryDock.jsx'
import HistoryWorkspace from '../components/history/HistoryWorkspace.jsx'
import AccountChip from '../components/AccountChip.jsx'
import { supabase } from '../services/supabase.js'
import { useSelectedDog } from '../context/SelectedDogProvider.jsx'
import {
  isValidDateKey,
  todayKey,
} from '../lib/historyDateRange.js'
import {
  SAFE_ZONE_CENTER_LAT,
  SAFE_ZONE_CENTER_LNG,
  SAFE_ZONE_RADIUS,
  SAFE_ZONE_RADIUS_METERS,
} from '../../safeZoneConfig.js'
import {
  readSafeZoneLocal,
  writeSafeZoneLocal,
} from '../lib/safeZoneStore.js'
import './Dashboard.css'

const TRAIL_MAX = 24
const APPROVED_DOCK_WIDTH = 1360

function metersBetween(a, b) {
  const toRad = (d) => (d * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

/**
 * Composition-space Events presentation (desktop hero only).
 * Compact when the hero cannot host the approved Dock beside the side UI.
 */
function measureEventsPresentation(viewportWidth) {
  if (viewportWidth <= 900) return 'rail'
  const leftReserve = Math.min(320, viewportWidth * 0.18) + 36
  const eventsReserve = Math.min(248, viewportWidth * 0.22) + 22
  const freeHeroWidth =
    viewportWidth - leftReserve - eventsReserve - 56
  return freeHeroWidth < APPROVED_DOCK_WIDTH ? 'compact' : 'rail'
}

function getAlertLabel(anomalyType, dogName) {
  const name = dogName || 'Dog'
  if (anomalyType === 'safe_zone') return `${name} left the safe zone`
  if (anomalyType === 'heart_rate') return `${name}: unusual heart rate`
  if (anomalyType === 'activity') return `${name}: unusual activity`
  if (anomalyType === 'temperature') return `${name}: unusual temperature`
  return anomalyType ?? 'unknown'
}

function pushTrailPoint(trail, row) {
  if (!Number.isFinite(row?.latitude) || !Number.isFinite(row?.longitude)) {
    return trail
  }
  const next = [...trail, { lat: row.latitude, lng: row.longitude }]
  return next.length > TRAIL_MAX ? next.slice(next.length - TRAIL_MAX) : next
}

function Dashboard() {
  const navigate = useNavigate()
  const routeLocation = useLocation()
  const { selectedDog, status: dogStatus, error: dogError } =
    useSelectedDog()
  const dogId = selectedDog?.id ?? null
  const dogName = selectedDog?.name ?? ''

  const [searchParams, setSearchParams] = useSearchParams()
  const historyOpen = searchParams.get('history') === '1'
  const dateParam = searchParams.get('date')
  const eventParam = searchParams.get('event')
  const selectedHistoryDate =
    dateParam && isValidDateKey(dateParam) ? dateParam : todayKey()

  const historyNavRef = useRef(null)

  const [alerts, setAlerts] = useState([])
  const [latest, setLatest] = useState(null)
  const [liveAlert, setLiveAlert] = useState(null)
  /** Bumps on alerts realtime INSERT — History TODAY refetch only (no second channel). */
  const [todayAlertSignal, setTodayAlertSignal] = useState(0)
  const [trail, setTrail] = useState([])
  const [homeZone, setHomeZone] = useState({
    centerLat: SAFE_ZONE_CENTER_LAT,
    centerLng: SAFE_ZONE_CENTER_LNG,
    radius: SAFE_ZONE_RADIUS,
  })
  /** Bumps only when we intentionally re-fetch zone from DB (not optimistic SET). */
  const [homeZoneEpoch, setHomeZoneEpoch] = useState(0)
  /** Prevents a slow DB load from overwriting a fresher SET / USE MY LOCATION. */
  const homeZoneGenRef = useRef(0)
  const [locationStatus, setLocationStatus] = useState('')
  const [hologramActive, setHologramActive] = useState(false)
  const twinApiRef = useRef(null)
  const [eventsPresentation, setEventsPresentation] = useState(() =>
    typeof window !== 'undefined'
      ? measureEventsPresentation(window.innerWidth)
      : 'rail',
  )

  // Instant apply after Safe Zone SET (don't wait only on DB round-trip).
  useEffect(() => {
    const zone = routeLocation.state?.refreshedSafeZone
    if (!zone) return
    if (
      !Number.isFinite(zone.centerLat) ||
      !Number.isFinite(zone.centerLng) ||
      !Number.isFinite(zone.radius)
    ) {
      return
    }
    homeZoneGenRef.current += 1
    setHomeZone({
      centerLat: zone.centerLat,
      centerLng: zone.centerLng,
      radius: zone.radius,
    })
    setTrail([])
    if (dogId) writeSafeZoneLocal(dogId, zone)
    setLocationStatus('Safe zone updated on the live map.')
    navigate('.', { replace: true, state: {} })
  }, [routeLocation.state, navigate, dogId])

  const openHistory = useCallback(
    (open = true) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (open) {
            next.set('history', '1')
            if (!next.get('date') || !isValidDateKey(next.get('date'))) {
              next.set('date', todayKey())
            }
          } else {
            next.delete('history')
            next.delete('date')
            next.delete('event')
          }
          return next
        },
        { replace: false },
      )
    },
    [setSearchParams],
  )

  const setHistoryDate = useCallback(
    (dateKey) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('history', '1')
          next.set('date', dateKey)
          next.delete('event')
          return next
        },
        { replace: false },
      )
    },
    [setSearchParams],
  )

  const setHistoryEvent = useCallback(
    (id) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (id) next.set('event', id)
          else next.delete('event')
          return next
        },
        { replace: false },
      )
    },
    [setSearchParams],
  )

  useEffect(() => {
    function onResize() {
      setEventsPresentation(measureEventsPresentation(window.innerWidth))
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Dog-scoped loads + realtime. Re-subscribe when selectedDog changes.
  useEffect(() => {
    if (!dogId) return undefined

    let cancelled = false

    async function loadAlerts() {
      const { data } = await supabase
        .from('alerts')
        .select('anomaly_type, severity, value, baseline, created_at, dog_id')
        .eq('dog_id', dogId)
        .order('created_at', { ascending: false })
        .limit(12)
      if (!cancelled) setAlerts(data ?? [])
    }

    async function loadLatest() {
      const { data } = await supabase
        .from('telemetry')
        .select(
          'heart_rate, activity, temperature, activity_state, hydration, latitude, longitude, created_at, dog_id',
        )
        .eq('dog_id', dogId)
        .order('created_at', { ascending: false })
        .limit(TRAIL_MAX)

      if (cancelled) return
      const rows = data ?? []
      setLatest(rows[0] ?? null)
      const localZone = readSafeZoneLocal(dogId)
      const keepM = localZone
        ? Math.max((localZone.radius ?? SAFE_ZONE_RADIUS) * 111320, 80) * 4
        : null
      setTrail(
        [...rows]
          .reverse()
          .filter((r) => Number.isFinite(r.latitude) && Number.isFinite(r.longitude))
          .filter((r) => {
            if (keepM == null || !localZone) return true
            return (
              metersBetween(
                { lat: localZone.centerLat, lng: localZone.centerLng },
                { lat: r.latitude, lng: r.longitude },
              ) <= keepM
            )
          })
          .map((r) => ({ lat: r.latitude, lng: r.longitude })),
      )
    }

    async function loadHomeZone() {
      const genAtStart = homeZoneGenRef.current
      const local = readSafeZoneLocal(dogId)
      if (local && genAtStart === homeZoneGenRef.current) {
        setHomeZone(local)
      }

      const { data, error } = await supabase
        .from('safe_zone')
        .select('center_lat, center_lng, radius, dog_id')
        .eq('dog_id', dogId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (cancelled) return
      // A newer SET / USE MY LOCATION won — don't overwrite it with stale fetch.
      if (genAtStart !== homeZoneGenRef.current) return
      if (error) {
        console.log('SAFE ZONE LOAD ERROR:', error.message)
        if (!local) {
          setLocationStatus(`Could not load safe zone: ${error.message}`)
        }
        return
      }
      if (data?.[0]) {
        const fromDb = {
          centerLat: data[0].center_lat,
          centerLng: data[0].center_lng,
          radius: data[0].radius ?? SAFE_ZONE_RADIUS,
        }
        setHomeZone(fromDb)
        writeSafeZoneLocal(dogId, fromDb)
      } else if (!local) {
        setLocationStatus('No saved safe zone yet — use Enter Map to set one.')
      }
    }

    loadAlerts()
    loadLatest()
    loadHomeZone()

    const alertsChannel = supabase
      .channel(`alerts-realtime-${dogId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts',
          filter: `dog_id=eq.${dogId}`,
        },
        (payload) => {
          if (payload.new?.dog_id && payload.new.dog_id !== dogId) return
          setAlerts((current) => [payload.new, ...current])
          setLiveAlert(payload.new)
          setTodayAlertSignal((n) => n + 1)
        },
      )
      .subscribe()

    const telemetryChannel = supabase
      .channel(`telemetry-realtime-${dogId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'telemetry',
          filter: `dog_id=eq.${dogId}`,
        },
        (payload) => {
          if (payload.new?.dog_id && payload.new.dog_id !== dogId) return
          setLatest(payload.new)
          setTrail((current) => pushTrailPoint(current, payload.new))
        },
      )
      .subscribe()

    // Live map must move even if Realtime INSERT is delayed/off — poll with the collar.
    const pollLive = window.setInterval(async () => {
      if (cancelled) return
      const { data } = await supabase
        .from('telemetry')
        .select(
          'heart_rate, activity, temperature, activity_state, hydration, latitude, longitude, created_at, dog_id',
        )
        .eq('dog_id', dogId)
        .order('created_at', { ascending: false })
        .limit(1)
      const row = data?.[0]
      if (!row || cancelled) return
      setLatest((prev) =>
        prev?.created_at === row.created_at ? prev : row,
      )
      setTrail((current) => {
        const last = current[current.length - 1]
        if (
          last &&
          last.lat === row.latitude &&
          last.lng === row.longitude
        ) {
          return current
        }
        return pushTrailPoint(current, row)
      })
    }, 4000)

    return () => {
      cancelled = true
      window.clearInterval(pollLive)
      supabase.removeChannel(alertsChannel)
      supabase.removeChannel(telemetryChannel)
    }
  }, [dogId, homeZoneEpoch])

  /**
   * USE MY LOCATION — GPS only. Does not write safe_zone.
   * The circle is saved later on SET in the big map.
   */
  function useMyLocationAsHome() {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported in this browser.')
      return
    }
    setLocationStatus('Asking for your location…')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setLocationStatus(
          `Found you · ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        )
        navigate('/safe-zone', {
          state: {
            userLocation: { lat, lng },
          },
        })
      },
      (geoError) => {
        const hint =
          geoError.code === 1
            ? 'Permission denied — allow location for this site.'
            : geoError.code === 2
              ? 'Position unavailable.'
              : geoError.code === 3
                ? 'Location request timed out.'
                : geoError.message
        setLocationStatus(`Location failed: ${hint}`)
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    )
  }

  const radiusMeters = Math.round(
    (homeZone.radius ?? SAFE_ZONE_RADIUS) * 111320,
  )
  const hasAttention = alerts.some((alert) => alert.severity === 'Significant')
  const navActive = historyOpen ? 'history' : 'ray'

  if (dogStatus === 'loading' || dogStatus === 'idle') {
    return (
      <div className="product-screen" data-dog-bootstrap="loading">
        <p className="product-screen__status">Loading companion…</p>
      </div>
    )
  }

  if (dogStatus === 'error' || !selectedDog) {
    return (
      <div className="product-screen" data-dog-bootstrap="error">
        <p className="product-screen__status product-screen__status--attention">
          Could not load selected dog
          {dogError?.message ? `: ${dogError.message}` : '.'}
        </p>
        <p className="product-screen__status">
          <Link to="/my-dogs">Choose a dog</Link>
        </p>
      </div>
    )
  }

  return (
    <div
      className="product-screen"
      data-events-layout={eventsPresentation}
      data-history={historyOpen ? 'open' : 'closed'}
      data-dog-id={selectedDog.id}
    >
      <div className="product-screen__twin" id="ray">
        <DigitalTwin
          src="/digital-twin/twin.html?embed=1&v=127"
          archiveMode={historyOpen}
          selectedDog={selectedDog}
          apiRef={twinApiRef}
          onHologramChange={setHologramActive}
          telemetry={
            latest
              ? {
                  heart_rate: latest.heart_rate ?? null,
                  hydration: latest.hydration ?? null,
                  activity: latest.activity ?? null,
                  activity_state: latest.activity_state ?? null,
                  temperature: latest.temperature ?? null,
                  created_at: latest.created_at ?? null,
                }
              : null
          }
        />
        <div className="product-screen__vignette" aria-hidden="true" />
      </div>

      {hologramActive ? (
        <button
          type="button"
          className="product-screen__return-ray"
          onClick={() => {
            twinApiRef.current?.returnFromHologram?.()
            setHologramActive(false)
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
            <path d="M9 7 4 12l5 5M4 12h10a6 6 0 0 0 6-6" />
          </svg>
          <span>Return to Ray</span>
        </button>
      ) : null}

      <aside className="dashboard-rail" data-origin="location">
        <LocationField
          dogName={dogName}
          latitude={latest?.latitude}
          longitude={latest?.longitude}
          centerLat={homeZone.centerLat}
          centerLng={homeZone.centerLng}
          radiusMeters={radiusMeters || SAFE_ZONE_RADIUS_METERS}
          trail={trail}
          onUseMyLocation={useMyLocationAsHome}
          onEditSafeZone={() =>
            navigate('/safe-zone', {
              state: {
                safeZone: homeZone,
                ray:
                  Number.isFinite(latest?.latitude) &&
                  Number.isFinite(latest?.longitude)
                    ? {
                        lat: latest.latitude,
                        lng: latest.longitude,
                      }
                    : null,
              },
            })
          }
          locationStatus={locationStatus}
          updatedAt={latest?.created_at ?? null}
          onOpenHistory={openHistory}
        >
          <Link to="/" className="paw-panel__logo">
            PawLink
          </Link>
          <Navigation
            ref={historyNavRef}
            active={navActive}
            onOpenHistory={openHistory}
            dogName={dogName}
          />
        </LocationField>
      </aside>

      <div className="product-screen__top-right">
        <p
          className={
            hasAttention
              ? 'product-screen__status product-screen__status--attention'
              : 'product-screen__status'
          }
        >
          {hasAttention ? 'Attention' : 'Normal'}
        </p>
        <AccountChip />
      </div>

      <div className="product-screen__events" id="events-rail">
        <LiveEvents
          alerts={alerts}
          liveAlert={liveAlert}
          dogName={dogName}
          getAlertLabel={(type) => getAlertLabel(type, dogName)}
          presentation={eventsPresentation}
          onOpenHistory={openHistory}
        />
      </div>

      <div className="product-screen__dock">
        <TelemetryDock
          latest={latest}
          dogName={dogName}
          alertCount={alerts.filter((a) => a.severity === 'Significant').length}
        />
      </div>

      <HistoryWorkspace
        open={historyOpen}
        dogId={dogId}
        dogName={dogName}
        selectedDate={selectedHistoryDate}
        onSelectDate={setHistoryDate}
        onClose={() => openHistory(false)}
        returnFocusRef={historyNavRef}
        todayAlertSignal={todayAlertSignal}
        eventId={eventParam}
        onSelectEvent={setHistoryEvent}
      />
    </div>
  )
}

export default Dashboard
