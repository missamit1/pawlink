import { useCallback, useState } from 'react'
import { TIMELINE_INSET_PX } from '../../lib/historyDayDensity.js'

export default function HistoryDensityFilament({
  filament,
  selectedWindow = null,
  onSelectBin,
  reducedMotion = false,
}) {
  const [hover, setHover] = useState(null)

  const peak = filament?.peak || 1
  const bins = filament?.bins || []

  const onMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const y = e.clientY - rect.top
      const usable = rect.height - 2 * TIMELINE_INSET_PX
      if (usable <= 0) return
      const t = Math.min(1, Math.max(0, (y - TIMELINE_INSET_PX) / usable))
      const idx = Math.min(
        bins.length - 1,
        Math.max(0, Math.floor(t * bins.length)),
      )
      const bin = bins[idx]
      if (!bin || bin.momentCount === 0) {
        let best = null
        let bestD = Infinity
        for (const b of bins) {
          if (!b.momentCount) continue
          const d = Math.abs(b.tMid - t)
          if (d < bestD) {
            bestD = d
            best = b
          }
        }
        setHover(best)
        return
      }
      setHover(bin)
    },
    [bins],
  )

  const onLeave = useCallback(() => setHover(null), [])

  const onClick = useCallback(() => {
    if (hover) onSelectBin?.(hover.index)
  }, [hover, onSelectBin])

  if (!bins.length) return null

  const selectedStart = selectedWindow?.tStart
  const selectedEnd = selectedWindow?.tEnd

  function hm(min) {
    return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
  }

  return (
    <div
      className={[
        'history-filament',
        reducedMotion ? 'history-filament--reduced' : null,
        selectedWindow ? 'history-filament--resolved' : null,
      ]
        .filter(Boolean)
        .join(' ')}
      role="img"
      aria-label="Temporal density across the day"
    >
      <span className="history-filament__spine" aria-hidden="true" />

      <div className="history-filament__samples" aria-hidden="true">
        {bins.map((b) => {
          if (!b.momentCount) return null
          const intensity = b.momentCount / peak
          const inSelection =
            selectedWindow &&
            b.tEnd > selectedStart &&
            b.tStart < selectedEnd
          return (
            <span
              key={b.index}
              className={[
                'history-filament__sample',
                inSelection ? 'history-filament__sample--active' : null,
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                '--t': b.tMid,
                '--intensity': intensity,
              }}
            />
          )
        })}
      </div>

      <button
        type="button"
        className="history-filament__hit"
        aria-label="Inspect temporal density"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onClick}
      />

      {hover && hover.momentCount > 0 ? (
        <div
          className="history-filament__tip"
          style={{ '--t': hover.tMid }}
          aria-live="polite"
        >
          <p className="history-filament__tip-span">
            {hm(hover.startMin)} — {hm(hover.endMin)}
          </p>
          <p className="history-filament__tip-meta">
            {hover.momentCount}{' '}
            {hover.momentCount === 1 ? 'Moment' : 'Moments'}
            <span aria-hidden="true"> · </span>
            {hover.signalCount}{' '}
            {hover.signalCount === 1 ? 'Signal' : 'Signals'}
          </p>
        </div>
      ) : null}
    </div>
  )
}
