import {
  sensorColorForAlert,
  uniqueSensorSignatures,
} from '../../lib/historySensorColor.js'
import { momentEventPresentation } from '../../lib/historyMoments.js'

function arcPath(cx, cy, r, startDeg, endDeg) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const x1 = cx + r * Math.cos(toRad(startDeg))
  const y1 = cy + r * Math.sin(toRad(startDeg))
  const x2 = cx + r * Math.cos(toRad(endDeg))
  const y2 = cy + r * Math.sin(toRad(endDeg))
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

function HistoryMomentCluster({
  moment,
  selected,
  onToggle,
  reducedMotion = false,
}) {
  const count = moment.events.length
  const isolated = count === 1
  const signatures = uniqueSensorSignatures(moment.events)
  const multiSignal = signatures.length > 1
  const isolatedMeta = isolated
    ? momentEventPresentation(moment.events[0])
    : null
  const IsolatedIcon = isolatedMeta?.Icon
  const isolatedColor = isolated
    ? sensorColorForAlert(moment.events[0])
    : null

  const ariaLabel = isolated
    ? `${moment.hm}, 1 recorded signal, ${isolatedMeta.title}`
    : `${moment.hm}, ${count} recorded signals`

  return (
    <div
      className={[
        'history-moment',
        selected ? 'history-moment--selected' : 'history-moment--idle',
        isolated ? 'history-moment--isolated' : null,
        multiSignal ? 'history-moment--multi' : null,
        reducedMotion ? 'history-moment--reduced' : null,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--t': moment.t }}
      data-moment-id={moment.id}
      data-anchor-id={moment.anchorId}
    >
      <div className="history-moment__anchor">
        <time className="history-moment__time" dateTime={moment.anchorCreatedAt}>
          {moment.hm}
        </time>

        <button
          type="button"
          className="history-moment__node"
          aria-pressed={selected}
          aria-label={ariaLabel}
          onClick={() => onToggle(moment.id)}
        >
          <span
            className="history-moment__core"
            aria-hidden="true"
            style={
              !multiSignal && isolatedColor
                ? {
                    boxShadow: `0 0 0 3px rgba(246, 236, 227, 0.72), 0 0 0 1px ${isolatedColor}88, 0 2px 8px rgba(100, 55, 45, 0.12)`,
                  }
                : undefined
            }
          />
          {multiSignal ? (
            <svg
              className="history-moment__arcs"
              viewBox="0 0 28 28"
              width="28"
              height="28"
              aria-hidden="true"
            >
              {signatures.slice(0, 4).map((sig, index, arr) => {
                const n = arr.length
                const gap = 18
                const sweep = 360 / n - gap
                const start = -90 + index * (360 / n) + gap / 2
                const end = start + sweep
                return (
                  <path
                    key={sig.key}
                    className="history-moment__arc"
                    d={arcPath(14, 14, 11.5, start, end)}
                    stroke={sig.color}
                    fill="none"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                )
              })}
            </svg>
          ) : null}
        </button>

        {isolated ? (
          <p className="history-moment__solo">
            {IsolatedIcon ? (
              <IsolatedIcon
                className="history-moment__solo-glyph"
                size={14}
                weight="regular"
                aria-hidden="true"
                style={{ color: isolatedColor }}
              />
            ) : null}
            <span className="history-moment__solo-title">{isolatedMeta.title}</span>
          </p>
        ) : (
          <p className="history-moment__count">
            <span className="history-moment__count-num">{count}</span>
            <span className="history-moment__count-label">Signals</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default HistoryMomentCluster
