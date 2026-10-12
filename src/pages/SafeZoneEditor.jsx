import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelectedDog } from '../context/SelectedDogProvider.jsx'
import { supabase } from '../services/supabase.js'
import {
  readSafeZoneLocal,
  writeSafeZoneLocal,
} from '../lib/safeZoneStore.js'
import './SafeZoneEditor.css'

function SafeZoneEditor() {
  const navigate = useNavigate()
  const routeLocation = useLocation()
  const { selectedDog } = useSelectedDog()
  const [status, setStatus] = useState('Author the safe space on the map.')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const frameRef = useRef(null)
  const hydratePayloadRef = useRef(null)

  const buildHydratePayload = useCallback(async () => {
    const focus = routeLocation.state?.userLocation
    const focusLat = Number(focus?.lat)
    const focusLng = Number(focus?.lng)
    if (Number.isFinite(focusLat) && Number.isFinite(focusLng)) {
      return {
        type: 'pawlink:safe-zone-focus',
        center: { lat: focusLat, lng: focusLng },
      }
    }

    const dogId = selectedDog?.id
    if (!dogId) return null

    const fromNav = routeLocation.state?.safeZone
    const fromLocal = readSafeZoneLocal(dogId)
    let centerLat = Number(fromNav?.centerLat ?? fromLocal?.centerLat)
    let centerLng = Number(fromNav?.centerLng ?? fromLocal?.centerLng)
    let radius = Number(fromNav?.radius ?? fromLocal?.radius)

    if (
      !Number.isFinite(centerLat) ||
      !Number.isFinite(centerLng) ||
      !Number.isFinite(radius)
    ) {
      const { data, error } = await supabase
        .from('safe_zone')
        .select('center_lat, center_lng, radius')
        .eq('dog_id', dogId)
        .order('created_at', { ascending: false })
        .limit(1)
      if (error) {
        console.log('SAFE ZONE HYDRATE LOAD ERROR:', error.message)
      } else if (data?.[0]) {
        centerLat = Number(data[0].center_lat)
        centerLng = Number(data[0].center_lng)
        radius = Number(data[0].radius)
        writeSafeZoneLocal(dogId, {
          centerLat,
          centerLng,
          radius,
        })
      }
    }

    if (
      !Number.isFinite(centerLat) ||
      !Number.isFinite(centerLng) ||
      !Number.isFinite(radius)
    ) {
      return null
    }

    const radiusM = Math.max(1, Math.round(radius * 111320))
    const navRay = routeLocation.state?.ray
    let ray = null
    if (
      Number.isFinite(navRay?.lat) &&
      Number.isFinite(navRay?.lng)
    ) {
      ray = { lat: navRay.lat, lng: navRay.lng }
    } else {
      const { data: telemetry } = await supabase
        .from('telemetry')
        .select('latitude, longitude')
        .eq('dog_id', dogId)
        .order('created_at', { ascending: false })
        .limit(1)
      const row = telemetry?.[0]
      if (
        Number.isFinite(row?.latitude) &&
        Number.isFinite(row?.longitude)
      ) {
        ray = { lat: row.latitude, lng: row.longitude }
      }
    }

    return {
      type: 'pawlink:safe-zone-hydrate',
      home: { lat: centerLat, lng: centerLng },
      radiusM,
      ray,
    }
  }, [selectedDog?.id, routeLocation.state])

  const postHydrate = useCallback((win, payload) => {
    if (!win || !payload) return
    win.postMessage(payload, window.location.origin)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const payload = await buildHydratePayload()
      if (cancelled) return
      hydratePayloadRef.current = payload
      if (payload?.type === 'pawlink:safe-zone-focus') {
        setStatus('You are here. Tap the map to place the safe zone.')
        const win = frameRef.current?.contentWindow
        if (win) postHydrate(win, payload)
      } else if (payload) {
        setStatus('Showing your saved safe zone. Start over to rewrite.')
        const win = frameRef.current?.contentWindow
        if (win) postHydrate(win, payload)
      } else {
        setStatus('Author the safe space on the map.')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [buildHydratePayload, postHydrate])

  useEffect(() => {
    function onMessage(event) {
      if (event.origin !== window.location.origin) return
      const data = event.data
      if (!data) return

      if (data.type === 'pawlink:safe-zone-ready') {
        const win = frameRef.current?.contentWindow
        if (hydratePayloadRef.current) {
          postHydrate(win, hydratePayloadRef.current)
        }
        return
      }

      if (data.type !== 'pawlink:safe-zone-set') return
      if (!selectedDog?.id) {
        setStatus('No selected dog — cannot save.')
        return
      }

      const lat = Number(data.home?.lat)
      const lng = Number(data.home?.lng)
      const radiusM = Number(data.radiusM)
      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        !Number.isFinite(radiusM)
      ) {
        setStatus('Invalid safe zone from map.')
        return
      }

      
      const radiusDegrees = radiusM / 111320

      setSaving(true)
      setStatus('Saving safe zone…')

      
      supabase
        .from('safe_zone')
        .delete()
        .eq('dog_id', selectedDog.id)
        .then(({ error: deleteError }) => {
          if (deleteError) {
            setSaving(false)
            setStatus(`Could not clear old zone: ${deleteError.message}`)
            return
          }
          return supabase.from('safe_zone').insert([
            {
              dog_id: selectedDog.id,
              center_lat: lat,
              center_lng: lng,
              radius: radiusDegrees,
            },
          ])
        })
        .then((result) => {
          if (!result) return
          setSaving(false)
          const { error } = result
          if (error) {
            setStatus(`Could not save: ${error.message}`)
            return
          }
          writeSafeZoneLocal(selectedDog.id, {
            centerLat: lat,
            centerLng: lng,
            radius: radiusDegrees,
          })
          // Snap live GPS to the new Home so Dashboard never shows a stale dog
          // left behind from an older zone / dead simulator tick.
          fetch('/api/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dog_id: selectedDog.id,
              heart_rate: 88,
              activity: 35,
              temperature: 38.2,
              activity_state: 'resting',
              hydration: 74,
              latitude: lat,
              longitude: lng,
            }),
          }).catch(() => {})
          setSaved(true)
          setStatus('Safe zone saved. Returning to Dashboard…')
          window.setTimeout(
            () =>
              navigate('/dashboard', {
                state: {
                  refreshedSafeZone: {
                    centerLat: lat,
                    centerLng: lng,
                    radius: radiusDegrees,
                  },
                },
              }),
            700,
          )
        })
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [selectedDog?.id, navigate, postHydrate])

  if (!selectedDog) {
    return (
      <div className="safe-zone-editor">
        <p>Choose a dog first.</p>
        <Link to="/my-dogs">My Dogs</Link>
      </div>
    )
  }

  return (
    <div className="safe-zone-editor">
      <header className="safe-zone-editor__bar">
        <div>
          <p className="safe-zone-editor__brand">PawLink</p>
          <p className="safe-zone-editor__dog">
            Safe zone · {selectedDog.name}
          </p>
        </div>
        <div className="safe-zone-editor__actions">
          <p className="safe-zone-editor__status" aria-live="polite">
            {status}
          </p>
          <button
            type="button"
            className="safe-zone-editor__back"
            disabled={saving}
            onClick={() => navigate('/dashboard')}
          >
            {saved ? 'Back to Dashboard' : 'Cancel'}
          </button>
        </div>
      </header>

      <iframe
        ref={frameRef}
        className="safe-zone-editor__frame"
        title="Set safe zone"
        src="/safe-zone.html"
        onLoad={(event) => {
          const win = event.currentTarget.contentWindow
          if (!win) return
          requestAnimationFrame(() => {
            win.postMessage(
              { type: 'pawlink:map-resize' },
              window.location.origin,
            )
            if (hydratePayloadRef.current) {
              postHydrate(win, hydratePayloadRef.current)
            }
          })
        }}
      />
    </div>
  )
}

export default SafeZoneEditor
