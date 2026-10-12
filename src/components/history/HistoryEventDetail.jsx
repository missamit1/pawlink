import { useEffect, useId, useRef } from 'react'
import { CaretLeft } from '@phosphor-icons/react'
import { buildEventDetailModel } from '../../lib/historyEventDetail.js'

export default function HistoryEventDetail({
  alert,
  backLabel = 'Recorded moment',
  onBack,
  reducedMotion = false,
}) {
  const model = buildEventDetailModel(alert)
  const headingId = useId()
  const backRef = useRef(null)

  useEffect(() => {
    backRef.current?.focus?.()
  }, [alert?.id])

  if (!model) return null

  const Icon = model.Icon
  const metrics = model.metrics
  const comparison = model.comparison

  return (
    <div
      className={[
        'history-event',
        reducedMotion ? 'history-event--reduced' : null,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--sensor': model.color }}
      aria-labelledby={headingId}
      aria-live="polite"
    >
      <button
        ref={backRef}
        type="button"
        className="history-event__back"
        onClick={onBack}
      >
        <CaretLeft size={14} weight="regular" aria-hidden="true" />
        <span>{backLabel}</span>
      </button>

      <div className="history-event__identity">
        <span className="history-event__glyph" aria-hidden="true">
          {Icon ? (
            <Icon size={20} weight="regular" className="history-moment__glyph" />
          ) : null}
        </span>
        <p className="history-event__category">{model.category}</p>
      </div>

      <h3 id={headingId} className="history-event__title">
        {model.title}
      </h3>

      {metrics ? (
        <p className="history-event__hero-value">{metrics.valueLabel}</p>
      ) : null}

      <div className="history-event__when">
        <p className="history-event__date">{model.longDate}</p>
        <p className="history-event__hms">{model.hms}</p>
      </div>

      {model.severityLabel ? (
        <p className="history-event__severity">{model.severityLabel}</p>
      ) : null}

      {metrics ? (
        <div className="history-event__metrics">
          <div className="history-event__metric">
            <p className="history-event__metric-label">Event value</p>
            <p className="history-event__metric-value">{metrics.valueLabel}</p>
          </div>
          <div className="history-event__metric">
            <p className="history-event__metric-label">Baseline</p>
            <p className="history-event__metric-value">{metrics.baselineLabel}</p>
          </div>
          <div className="history-event__metric">
            <p className="history-event__metric-label">Deviation</p>
            <p className="history-event__metric-value">
              {metrics.deviationAbsLabel}
              <span className="history-event__metric-pct">
                {metrics.deviationPctLabel}
              </span>
            </p>
          </div>
        </div>
      ) : null}

      {metrics && comparison ? (
        <div
          className="history-event__compare"
          role="img"
          aria-label={`Baseline ${metrics.baselineLabel}, event ${metrics.valueLabel}`}
        >
          <div className="history-event__compare-labels">
            <span>Baseline</span>
            <span>Event</span>
          </div>
          <div className="history-event__compare-values">
            <span>{metrics.baselineLabel.replace(/\s.*$/, '')}</span>
            <span className="history-event__compare-event-num">
              {metrics.valueLabel.replace(/\s.*$/, '')}
            </span>
          </div>
          <div className="history-event__compare-track">
            <span className="history-event__compare-rail" />
            <span
              className="history-event__compare-mark history-event__compare-mark--baseline"
              style={{ left: `${comparison.baselineT * 100}%` }}
            />
            <span
              className="history-event__compare-mark history-event__compare-mark--event"
              style={{ left: `${comparison.eventT * 100}%` }}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
