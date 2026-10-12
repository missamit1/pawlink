import { useId } from 'react'
import { Heart, Drop, Thermometer, PawPrint } from '@phosphor-icons/react'
import './TelemetryDock.css'

const HR_BASELINE = 82
const TEMP_BASELINE = 38.2

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function liveNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function heartCycle(heartRate, x0) {
  const hr = Number.isFinite(heartRate) ? heartRate : HR_BASELINE
  const amp = clamp((hr - HR_BASELINE) / 28, -0.35, 1.15)
  const mid = 18
  const spike = mid - 11 * (0.45 + amp * 0.55)
  const dip = mid + 5 * (0.35 + amp * 0.4)
  return [
    `M${x0} ${mid}`,
    `L${x0 + 10} ${mid}`,
    `L${x0 + 14} ${mid - 2.2}`,
    `L${x0 + 18} ${spike}`,
    `L${x0 + 23} ${dip}`,
    `L${x0 + 28} ${mid - 1}`,
    `L${x0 + 40} ${mid}`,
    `L${x0 + 48} ${mid}`,
    `L${x0 + 52} ${mid - 1.8}`,
    `L${x0 + 56} ${spike + 2}`,
    `L${x0 + 61} ${dip - 0.8}`,
    `L${x0 + 66} ${mid}`,
    `L${x0 + 100} ${mid}`,
  ].join(' ')
}

function heartWavePath(heartRate) {
  return `${heartCycle(heartRate, 0)} ${heartCycle(heartRate, 100)}`
}

function hydrationCurvePath(hydration) {
  const h = Number.isFinite(hydration) ? hydration : 70
  const lift = clamp((h - 45) / 55, 0.12, 1)
  const yHigh = 22 - lift * 14
  const yMid = 22 - lift * 8
  return `M0 26 C14 ${yMid}, 28 ${yHigh}, 44 ${yHigh + 2} S70 ${yMid}, 100 20`
}

function tempCurvePath(temperature) {
  const t = Number.isFinite(temperature) ? temperature : TEMP_BASELINE
  const d = clamp((t - TEMP_BASELINE) / 2.5, -0.85, 1.25)
  const peak = 20 - d * 10
  return `M0 22 L20 22 Q40 22, 50 ${peak} T80 22 L100 22`
}

function activityProfile(activityState) {
  const state = String(activityState ?? '').toLowerCase()
  if (state === 'running') {
    return { bars: [0.45, 0.85, 0.55, 1, 0.7], cadenceMs: 380 }
  }
  if (state === 'walking') {
    return { bars: [0.35, 0.65, 0.45, 0.8, 0.5], cadenceMs: 640 }
  }
  if (state === 'resting') {
    return { bars: [0.2, 0.28, 0.22, 0.3, 0.24], cadenceMs: 2400 }
  }
  if (state === 'sleeping') {
    return { bars: [0.12, 0.15, 0.12, 0.14, 0.13], cadenceMs: 3800 }
  }
  const n = liveNumber(activityState)
  if (n != null) {
    const e = clamp(n / 250, 0.15, 1)
    return {
      bars: [e * 0.4, e * 0.75, e * 0.5, e, e * 0.65],
      cadenceMs: Math.round(2000 - e * 1400),
    }
  }
  return { bars: [0.22, 0.32, 0.26, 0.36, 0.28], cadenceMs: 1600 }
}

export default function TelemetryDock({ latest, dogName = 'Dog' }) {
  const uid = useId().replace(/:/g, '')
  const heartGradientId = `heart-gradient-${uid}`
  const heartGlowId = `heart-glow-${uid}`
  const hydrationGradientId = `hydration-gradient-${uid}`
  const hydrationGlowId = `hydration-glow-${uid}`
  const temperatureGradientId = `temperature-gradient-${uid}`
  const temperatureGlowId = `temperature-glow-${uid}`
  const activityGradientId = `activity-gradient-${uid}`

  const hr = liveNumber(latest?.heart_rate)
  const hydration = liveNumber(latest?.hydration)
  const temperature = liveNumber(latest?.temperature)
  const activityRaw = latest?.activity_state ?? latest?.activity
  const { bars, cadenceMs } = activityProfile(activityRaw)

  const beatMs = hr != null && hr > 0 ? Math.round(60000 / hr) : 730
  const fluidLift = hydration != null ? clamp((hydration - 45) / 55, 0.2, 1) : 0.5
  const tempDrift =
    temperature != null
      ? clamp(0.35 + Math.abs(temperature - TEMP_BASELINE) / 2.2, 0.35, 1)
      : 0.45

  return (
    <div className="telemetry-dock" id="health">
      <div className="telemetry-dock__capsule" aria-label={`${dogName} health metrics`}>
        {/* HEART */}
        <article className="telemetry-dock__cell" data-origin="heart">
          <div className="telemetry-dock__zone telemetry-dock__zone--icon">
            <span className="telemetry-dock__icon" aria-hidden="true">
              <Heart size={22} weight="regular" />
            </span>
          </div>

          <div className="telemetry-dock__zone telemetry-dock__zone--data">
            <p className="telemetry-dock__label" data-warp="0.55">
              Heart Rate
            </p>
            <div className="telemetry-dock__reading">
              <span className="telemetry-dock__num">
                {hr != null ? Math.round(hr) : '—'}
              </span>
              <span className="telemetry-dock__unit">BPM</span>
            </div>
          </div>

          <div
            className="telemetry-dock__zone telemetry-dock__zone--viz"
            style={{ '--beat-ms': `${beatMs}ms` }}
            aria-hidden="true"
          >
            <div className="telemetry-dock__ecg-window">
              <svg
                className="telemetry-dock__ecg-track"
                viewBox="0 0 200 36"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id={heartGradientId}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#E7A18F" stopOpacity="0.28" />
                    <stop offset="28%" stopColor="#E8897F" stopOpacity="0.78" />
                    <stop offset="62%" stopColor="#F0A092" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#F6C3AD" stopOpacity="0.22" />
                  </linearGradient>
                  <filter
                    id={heartGlowId}
                    x="-40%"
                    y="-100%"
                    width="180%"
                    height="300%"
                  >
                    <feGaussianBlur stdDeviation="2.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d={heartWavePath(hr)}
                  fill="none"
                  stroke={`url(#${heartGradientId})`}
                  filter={`url(#${heartGlowId})`}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </article>

        <span className="telemetry-dock__divider" aria-hidden="true" />

        {}
        <article className="telemetry-dock__cell">
          <div className="telemetry-dock__zone telemetry-dock__zone--icon">
            <span className="telemetry-dock__icon" aria-hidden="true">
              <Drop size={22} weight="regular" />
            </span>
          </div>

          <div className="telemetry-dock__zone telemetry-dock__zone--data">
            <p className="telemetry-dock__label">Hydration</p>
            <div className="telemetry-dock__reading">
              <span className="telemetry-dock__num">
                {hydration != null ? Math.round(hydration) : '—'}
              </span>
              <span className="telemetry-dock__unit">%</span>
            </div>
          </div>

          <div
            className="telemetry-dock__zone telemetry-dock__zone--viz"
            style={{ '--fluid-lift': String(fluidLift) }}
            aria-hidden="true"
          >
            <svg className="telemetry-dock__viz-svg" viewBox="0 0 100 36">
              <defs>
                <linearGradient
                  id={hydrationGradientId}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#D7E1DF" stopOpacity="0.20" />
                  <stop offset="34%" stopColor="#F7EEE7" stopOpacity="0.88" />
                  <stop offset="68%" stopColor="#FFFFFF" stopOpacity="0.94" />
                  <stop offset="100%" stopColor="#D9C8BF" stopOpacity="0.20" />
                </linearGradient>
                <filter
                  id={hydrationGlowId}
                  x="-40%"
                  y="-150%"
                  width="180%"
                  height="400%"
                >
                  <feGaussianBlur stdDeviation="1.7" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                className="telemetry-dock__fluid-path"
                d={hydrationCurvePath(hydration)}
                fill="none"
                stroke={`url(#${hydrationGradientId})`}
                filter={`url(#${hydrationGlowId})`}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </article>

        <span className="telemetry-dock__divider" aria-hidden="true" />

        {}
        <article className="telemetry-dock__cell" data-origin="temperature">
          <div className="telemetry-dock__zone telemetry-dock__zone--icon">
            <span className="telemetry-dock__icon" aria-hidden="true">
              <Thermometer size={22} weight="regular" />
            </span>
          </div>

          <div className="telemetry-dock__zone telemetry-dock__zone--data">
            <p className="telemetry-dock__label" data-warp="0.55">
              Temp
            </p>
            <div className="telemetry-dock__reading">
              <span className="telemetry-dock__num">
                {temperature != null ? temperature.toFixed(1) : '—'}
              </span>
              <span className="telemetry-dock__unit">°C</span>
            </div>
          </div>

          <div
            className="telemetry-dock__zone telemetry-dock__zone--viz"
            style={{ '--temp-drift': String(tempDrift) }}
            aria-hidden="true"
          >
            <svg className="telemetry-dock__viz-svg" viewBox="0 0 100 36">
              <defs>
                <linearGradient
                  id={temperatureGradientId}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#D99386" stopOpacity="0.18" />
                  <stop offset="38%" stopColor="#E99C8D" stopOpacity="0.70" />
                  <stop offset="68%" stopColor="#F3B09D" stopOpacity="0.92" />
                  <stop offset="100%" stopColor="#F7D4C4" stopOpacity="0.16" />
                </linearGradient>
                <filter
                  id={temperatureGlowId}
                  x="-40%"
                  y="-150%"
                  width="180%"
                  height="400%"
                >
                  <feGaussianBlur stdDeviation="1.6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <line
                x1="0"
                y1="22"
                x2="100"
                y2="22"
                className="telemetry-dock__temp-base"
              />
              <path
                className="telemetry-dock__temp-path"
                d={tempCurvePath(temperature)}
                fill="none"
                stroke={`url(#${temperatureGradientId})`}
                filter={`url(#${temperatureGlowId})`}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </article>

        <span className="telemetry-dock__divider" aria-hidden="true" />

        {}
        <article className="telemetry-dock__cell">
          <div className="telemetry-dock__zone telemetry-dock__zone--icon">
            <span className="telemetry-dock__icon" aria-hidden="true">
              <PawPrint size={22} weight="regular" />
            </span>
          </div>

          <div className="telemetry-dock__zone telemetry-dock__zone--data">
            <p className="telemetry-dock__label">Activity</p>
            <div className="telemetry-dock__reading telemetry-dock__reading--word">
              <span className="telemetry-dock__num">
                {activityRaw != null && String(activityRaw).trim() !== ''
                  ? String(activityRaw)
                  : '—'}
              </span>
            </div>
          </div>

          <div
            className="telemetry-dock__zone telemetry-dock__zone--viz"
            style={{ '--cadence-ms': `${cadenceMs}ms` }}
            aria-hidden="true"
          >
            <div className="telemetry-dock__bars">
              <svg className="telemetry-dock__paint" aria-hidden="true">
                <defs>
                  <linearGradient
                    id={activityGradientId}
                    x1="0%"
                    y1="100%"
                    x2="0%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#A98277" stopOpacity="0.30" />
                    <stop offset="55%" stopColor="#D99989" stopOpacity="0.68" />
                    <stop offset="100%" stopColor="#F1B39E" stopOpacity="0.92" />
                  </linearGradient>
                </defs>
              </svg>
              {bars.map((h, i) => (
                <svg
                  key={i}
                  className="telemetry-dock__bar"
                  viewBox="0 0 6 34"
                  preserveAspectRatio="none"
                  style={{
                    '--bar-h': `${Math.round(h * 100)}%`,
                    animationDelay: `${i * 100}ms`,
                  }}
                >
                  <rect
                    x="0"
                    y="0"
                    width="6"
                    height="34"
                    rx="1.5"
                    fill={`url(#${activityGradientId})`}
                  />
                </svg>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
