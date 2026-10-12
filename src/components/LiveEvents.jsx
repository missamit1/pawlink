import { useEffect, useRef, useState } from 'react'
import {
  Heartbeat,
  PawPrint,
  Thermometer,
  ThermometerHot,
  ThermometerCold,
  MapPinSimpleArea,
  X,
} from '@phosphor-icons/react'
import { createDisturbanceField } from '../lib/disturbanceField.js'
import { sensorColorForAlert } from '../lib/sensorSystem.js'
import './LiveEvents.css'

function severityTone(severity) {
  if (severity === 'Significant' || severity === 'Attention') return 'attention'
  if (severity === 'Ok' || severity === 'OK' || severity === 'Normal') return 'ok'
  return 'unknown'
}

function severityLabel(tone, severity) {
  if (tone === 'attention') return 'Attention'
  if (tone === 'ok') return 'Ok'
  return severity ?? null
}

function temperatureIcon(alert) {
  const value = Number(alert?.value)
  const baseline = Number(alert?.baseline)
  if (!Number.isFinite(value) || !Number.isFinite(baseline)) return Thermometer
  if (value > baseline) return ThermometerHot
  if (value < baseline) return ThermometerCold
  return Thermometer
}

function eventMeta(alert) {
  const anomalyType = alert?.anomaly_type
  if (anomalyType === 'heart_rate') {
    return {
      title: 'Elevated heart rate',
      category: 'Rhythm',
      Icon: Heartbeat,
    }
  }
  if (anomalyType === 'activity') {
    return {
      title: 'Activity increase',
      category: 'Movement',
      Icon: PawPrint,
    }
  }
  if (anomalyType === 'temperature') {
    return {
      title: 'Temperature shift',
      category: 'Temperature',
      Icon: temperatureIcon(alert),
    }
  }
  if (anomalyType === 'safe_zone') {
    return {
      title: 'Left safe zone',
      category: 'Location',
      Icon: MapPinSimpleArea,
    }
  }
  return {
    title: anomalyType ?? 'Event',
    category: null,
    Icon: null,
  }
}

function eventDetail(alert) {
  if (!alert) return null
  const v = Number(alert.value)
  if (alert.anomaly_type === 'heart_rate' && Number.isFinite(v)) {
    return `${Math.round(v)}`
  }
  if (alert.anomaly_type === 'safe_zone' && Number.isFinite(v) && v > 0) {
    return `${Math.round(v)}m`
  }
  return null
}

function relativeTime(createdAt) {
  if (!createdAt) return null
  const t = new Date(createdAt).getTime()
  if (!Number.isFinite(t)) return null
  const sec = Math.max(0, Math.floor((Date.now() - t) / 1000))
  if (sec < 45) return 'just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} min ago`
  const hr = Math.floor(min / 60)
  if (hr < 48) return hr === 1 ? '1 hr ago' : `${hr} hr ago`
  const days = Math.floor(hr / 24)
  return days === 1 ? '1 day ago' : `${days} days ago`
}

function originSelector(anomalyType) {
  if (anomalyType === 'heart_rate') return '[data-origin="heart"]'
  if (anomalyType === 'safe_zone') return '[data-origin="location"]'
  if (anomalyType === 'temperature') return '[data-origin="temperature"]'
  return '[data-origin="heart"]'
}

function formatMoment(alert, getAlertLabel) {
  if (!alert) return ''
  if (alert.anomaly_type === 'heart_rate') {
    const v = alert.value
    const b = alert.baseline
    if (Number.isFinite(v) && Number.isFinite(b)) {
      const d = Math.round(v - b)
      const sign = d > 0 ? '+' : ''
      return `HEART RATE · ${sign}${d} BPM`
    }
    return 'HEART RATE'
  }
  return (getAlertLabel(alert.anomaly_type) || 'EVENT').toUpperCase()
}

function hasAttentionSeverity(severity) {
  return severity === 'Significant' || severity === 'Attention'
}

export default function LiveEvents({
  alerts,
  liveAlert,
  getAlertLabel,
  dogName = 'Dog',
  presentation = 'rail',
  onOpenHistory,
}) {
  const stageRef = useRef(null)
  const fieldRef = useRef(null)
  const quietRef = useRef(null)
  const toggleRef = useRef(null)
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const wasOpenRef = useRef(false)
  const [phase, setPhase] = useState('quiet')
  const [momentText, setMomentText] = useState('')
  const [open, setOpen] = useState(false)
  const pendingRef = useRef(null)
  const lastKeyRef = useRef('')

  const isCompact = presentation === 'compact'
  const drawerOpen = isCompact && open

  useEffect(() => {
    if (!isCompact && open) setOpen(false)
  }, [isCompact, open])

  useEffect(() => {
    const stage =
      document.querySelector('.product-screen') || stageRef.current
    if (!stage) return

    const collect = () =>
      [...stage.querySelectorAll('[data-warp]')].map((el) => ({
        el,
        weight: Number(el.dataset.warp) || 1,
      }))

    const field = createDisturbanceField({
      stageEl: stage,
      nodes: collect(),
      onSettled() {
        const pending = pendingRef.current
        if (pending) {
          setMomentText(pending)
          setPhase('informed')
          pendingRef.current = null
        }
      },
    })
    fieldRef.current = field

    return () => {
      field.reset()
      fieldRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!liveAlert || !fieldRef.current) return

    const key = `${liveAlert.anomaly_type}-${liveAlert.created_at ?? ''}-${liveAlert._demo ?? liveAlert.value ?? ''}-${liveAlert.severity}`
    if (key === lastKeyRef.current) return
    lastKeyRef.current = key

    const stage =
      document.querySelector('.product-screen') || stageRef.current
    if (!stage) return

    const text = formatMoment(liveAlert, getAlertLabel)
    pendingRef.current = text
    setPhase('disturbance')
    setMomentText('')

    const stageBox = stage.getBoundingClientRect()
    const sel = originSelector(liveAlert.anomaly_type)
    const originEl = document.querySelector(sel)
    const box = originEl?.getBoundingClientRect()
    const x = box
      ? box.left + box.width * 0.28 - stageBox.left
      : stageBox.width * 0.55
    const y = box
      ? box.top + box.height * 0.55 - stageBox.top
      : stageBox.height * 0.35

    fieldRef.current.setNodes(
      [...stage.querySelectorAll('[data-warp]')].map((el) => ({
        el,
        weight: Number(el.dataset.warp) || 1,
      })),
    )
    fieldRef.current.impact({
      x,
      y,
      kind: liveAlert.anomaly_type || 'heart',
    })
  }, [liveAlert, getAlertLabel])

  useEffect(() => {
    if (!drawerOpen) return

    
    const focusTimer = window.setTimeout(() => {
      closeRef.current?.focus()
    }, 16)

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
      }
    }

    function onPointerDown(event) {
      const target = event.target
      if (!(target instanceof Node)) return
      if (panelRef.current?.contains(target)) return
      if (toggleRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [drawerOpen])

  useEffect(() => {
    if (wasOpenRef.current && !open && isCompact) {
      toggleRef.current?.focus()
    }
    wasOpenRef.current = open
  }, [open, isCompact])

  const items = alerts.slice(0, 8)
  const feedAttention = alerts.some((alert) =>
    hasAttentionSeverity(alert.severity),
  )
  const eventCount = alerts.length

  const rootClass = [
    'live-events',
    isCompact ? 'live-events--compact' : null,
    drawerOpen ? 'live-events--open' : null,
  ]
    .filter(Boolean)
    .join(' ')

  const controlClass = [
    'live-events__control',
    phase === 'disturbance' ? 'live-events__control--live' : null,
    feedAttention ? 'live-events__control--attention' : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={rootClass} aria-label="Live events" id="events" ref={stageRef}>
      {isCompact ? (
        <button
          ref={toggleRef}
          type="button"
          className={controlClass}
          aria-expanded={open}
          aria-controls="live-events-panel"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="live-events__control-copy">
            <span className="live-events__control-label">Live Events</span>
            <span className="live-events__control-count">{eventCount}</span>
          </span>
          {feedAttention ? (
            <span className="live-events__control-dot" aria-hidden="true" />
          ) : null}
        </button>
      ) : null}

      <div
        ref={panelRef}
        id="live-events-panel"
        className="live-events__glass"
        hidden={isCompact && !open}
      >
        <div className="live-events__inner">
          <header className="live-events__head">
            <p className="live-events__kicker" data-warp="0.35">
              Live Events
            </p>
            <div className="live-events__head-actions">
              <span
                className={
                  phase === 'disturbance'
                    ? 'live-events__signal live-events__signal--live'
                    : 'live-events__signal'
                }
                aria-hidden="true"
              />
              {isCompact ? (
                <button
                  ref={closeRef}
                  type="button"
                  className="live-events__close"
                  aria-label="Close live events"
                  onClick={() => setOpen(false)}
                >
                  <X size={14} weight="regular" />
                </button>
              ) : null}
            </div>
          </header>

          <div className="live-events__moment" aria-live="polite">
            {phase === 'quiet' && (
              <p className="live-events__moment-idle" ref={quietRef} data-warp="1">
                Listening for {dogName}…
              </p>
            )}
            {phase === 'disturbance' && (
              <p className="live-events__moment-idle" data-warp="1.1">
                —
              </p>
            )}
            {phase === 'informed' && momentText && (
              <p className="live-events__moment-title" data-warp="1.05">
                {momentText}
              </p>
            )}
          </div>

          <ul className="live-events__list">
            {items.length === 0 ? (
              <li className="live-event live-event--empty" data-warp="0.4">
                No events yet
              </li>
            ) : (
              items.map((alert, index) => {
                const tone = severityTone(alert.severity)
                const label = severityLabel(tone, alert.severity)
                const meta = eventMeta(alert)
                const Icon = meta.Icon
                const when = relativeTime(alert.created_at)
                const detail = eventDetail(alert)
                const sensor = sensorColorForAlert(alert)
                const fresh =
                  liveAlert &&
                  index === 0 &&
                  liveAlert.anomaly_type === alert.anomaly_type

                return (
                  <li
                    key={`${alert.anomaly_type}-${alert.severity}-${alert.created_at ?? index}`}
                    className={`live-event live-event--${tone}${fresh ? ' live-event--fresh' : ''}`}
                    data-warp={index === 0 ? 0.85 : 0.45}
                  >
                    <div
                      className="live-event__mark"
                      style={{ '--sensor': sensor }}
                      aria-hidden="true"
                    >
                      {Icon ? <Icon size={21} weight="regular" /> : null}
                      {detail ? (
                        <span className="live-event__detail">{detail}</span>
                      ) : null}
                    </div>

                    <div className="live-event__body">
                      <p className="live-event__title">{meta.title}</p>
                      <p className="live-event__meta">
                        {[when, meta.category].filter(Boolean).join(' · ')}
                      </p>
                    </div>

                    {label ? (
                      <span
                        className={`live-event__badge live-event__badge--${tone}`}
                      >
                        {label}
                      </span>
                    ) : null}
                  </li>
                )
              })
            )}
          </ul>

          {typeof onOpenHistory === 'function' ? (
            <button
              type="button"
              className="live-events__history"
              onClick={() => onOpenHistory(true)}
            >
              <span>VIEW RAY&apos;S HISTORY</span>
              <span aria-hidden="true">→</span>
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  )
}
