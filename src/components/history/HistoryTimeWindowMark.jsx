

import { ArrowRight } from '@phosphor-icons/react'

export default function HistoryTimeWindowMark({
  mark,
  selected = false,
  onSelect,
  reducedMotion = false,
}) {
  const span =
    mark.startHm === mark.endHm
      ? mark.startHm
      : `${mark.startHm} — ${mark.endHm}`

  const tStart = mark.tStart ?? mark.t
  const tEnd = mark.tEnd ?? mark.t
  const tMid = (tStart + tEnd) / 2

  const momentsLabel = mark.momentCount === 1 ? 'Moment' : 'Moments'
  const signalsLabel = mark.signalCount === 1 ? 'Signal' : 'Signals'

  return (
    <div
      className={[
        'history-window-mark',
        selected ? 'history-window-mark--selected' : null,
        reducedMotion ? 'history-window-mark--reduced' : null,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        '--t-start': tStart,
        '--t-end': tEnd,
        '--t-mid': tMid,
      }}
      data-window-id={mark.id}
    >
      {}
      <span className="history-window-mark__span" aria-hidden="true">
        <span className="history-window-mark__fill" />
        <span className="history-window-mark__spine" />
        <span className="history-window-mark__endpoint history-window-mark__endpoint--start" />
        <span className="history-window-mark__endpoint history-window-mark__endpoint--end" />
      </span>

      <span className="history-window-mark__entry" aria-hidden="true">
        <span className="history-window-mark__connector" />
        <span className="history-window-mark__label">
          <span className="history-window-mark__range">{span}</span>
          <span className="history-window-mark__meta">
            <span className="history-window-mark__num">{mark.momentCount}</span>{' '}
            {momentsLabel}
            <span className="history-window-mark__dot" aria-hidden="true">
              ·
            </span>
            <span className="history-window-mark__num">{mark.signalCount}</span>{' '}
            {signalsLabel}
          </span>
          <span className="history-window-mark__explore">
            Explore
            <ArrowRight
              className="history-window-mark__explore-icon"
              size={11}
              weight="bold"
              aria-hidden="true"
            />
          </span>
        </span>
      </span>

      <button
        type="button"
        className="history-window-mark__hit"
        aria-pressed={selected}
        aria-label={`Time window ${span}, ${mark.momentCount} ${momentsLabel.toLowerCase()}, ${mark.signalCount} ${signalsLabel.toLowerCase()}. Explore recorded window`}
        onClick={() => onSelect?.(mark)}
      />
    </div>
  )
}
