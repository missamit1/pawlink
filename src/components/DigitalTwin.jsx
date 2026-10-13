import { useEffect, useRef } from 'react'
import './DigitalTwin.css'

/**
 * Temporary isolation shell: embeds the Codex Twin runtime in a same-origin iframe.
 * Host owns latest / alerts / Supabase — this wrapper does not fetch or subscribe.
 * selectedDog / selectedDog.modelUrl prepared for a later breed/model phase —
 * current Dalmatian Twin GLB stays locked (no visual switch in P1).
 */
export default function DigitalTwin({
  telemetry = null,
  archiveMode = false,
  selectedDog = null,
  src = '/digital-twin/twin.html',
  className = '',
  style,
  onHologramChange,
  apiRef = null,
}) {
  const frameRef = useRef(null)

  function getApi() {
    return frameRef.current?.contentWindow?.pawlinkDigitalTwin ?? null
  }

  function pushTelemetry() {
    const api = getApi()
    // Never push null/empty — that cleared activity_state and froze the walk cycle.
    if (!api || !telemetry) return
    api.updateTelemetry(telemetry)
  }

  function pushArchiveMode() {
    const api = getApi()
    if (!api?.setArchiveMode) return
    api.setArchiveMode(Boolean(archiveMode))
  }

  function syncFrame() {
    pushTelemetry()
    pushArchiveMode()
    if (apiRef) {
      apiRef.current = {
        returnFromHologram() {
          const api = getApi()
          if (!api) return
          api.setHologram?.(false)
          api.returnToRay?.()
        },
      }
    }
  }

  useEffect(() => {
    pushTelemetry()
  }, [telemetry])

  useEffect(() => {
    pushArchiveMode()
    // Cue may mount after ready — brief retry while Archive is open.
    if (!archiveMode) return undefined
    const id = window.setInterval(() => pushArchiveMode(), 400)
    const stop = window.setTimeout(() => window.clearInterval(id), 2500)
    return () => {
      window.clearInterval(id)
      window.clearTimeout(stop)
    }
  }, [archiveMode])

  useEffect(() => {
    function onMessage(event) {
      if (event.origin !== window.location.origin) return
      if (event.data?.type !== 'pawlink:hologram') return
      onHologramChange?.(Boolean(event.data.active))
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [onHologramChange])

  return (
    <section className={`digital-twin ${className}`.trim()}>
      <h2>Digital Twin</h2>
      <iframe
        ref={frameRef}
        src={src}
        title={
          selectedDog?.name
            ? `${selectedDog.name}’s Digital Twin`
            : "Your companion’s Digital Twin"
        }
        className="digital-twin__frame"
        style={style}
        data-dog-id={selectedDog?.id || undefined}
        data-model-url={selectedDog?.modelUrl || undefined}
        onLoad={syncFrame}
      />
    </section>
  )
}
