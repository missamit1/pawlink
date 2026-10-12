import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { CaretLeft, X } from '@phosphor-icons/react'
import HistoryDateRail from './HistoryDateRail.jsx'
import HistoryMomentCluster from './HistoryMomentCluster.jsx'
import HistoryEventDetail from './HistoryEventDetail.jsx'
import HistoryTimeWindowMark from './HistoryTimeWindowMark.jsx'
import HistoryDensityFilament from './HistoryDensityFilament.jsx'
import {
  dayNumber,
  isToday,
  localTimezoneLabel,
  monthLong,
  weekdayLong,
  yearOf,
} from '../../lib/historyDateRange.js'
import { fetchAlertsForLocalDay } from '../../lib/historyAlerts.js'
import { clusterAlertsIntoMoments } from '../../lib/historyMoments.js'
import {
  buildMomentLensColumns,
  buildSignalColumn,
  groupLabelForType,
  INDIVIDUAL_SIGNAL_LIMIT,
} from '../../lib/historyMomentLens.js'
import {
  DENSE_FIXTURE_ENABLED,
  GROUP_SIGNAL_BATCH,
  buildDenseMomentFixtureAlerts,
} from '../../lib/historyDenseFixture.js'
import {
  buildDayDensityLayout,
  buildTimeWindowFromMoments,
  timeWindowFromFilamentBin,
  usableTrackHeight,
  WINDOW_MOMENT_BATCH,
} from '../../lib/historyDayDensity.js'
import {
  ACTIVE_DAY_DENSITY_FIXTURE,
  buildDayDensityFixtureAlerts,
} from '../../lib/historyDayDensityFixture.js'
import './HistoryWorkspace.css'

const DAY_HOURS = ['00', '03', '06', '09', '12', '15', '18', '21', '24']
const DAY_SCALE = ['00', '06', '12', '18', '24']

function HistoryWorkspace({
  open,
  dogId = null,
  dogName = 'Dog',
  selectedDate,
  onSelectDate,
  onClose,
  returnFocusRef,
  todayAlertSignal = 0,
  eventId = null,
  onSelectEvent,
}) {
  const titleId = useId()
  const closeRef = useRef(null)
  const fieldRef = useRef(null)
  const signalFocusIdRef = useRef(null)
  const [phase, setPhase] = useState('idle')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [fieldPulse, setFieldPulse] = useState(0)
  const [fieldHeightPx, setFieldHeightPx] = useState(0)
  const visible = phase !== 'idle'
  const prevDateRef = useRef(selectedDate)

  const [queryStatus, setQueryStatus] = useState('idle')
  const [dayAlerts, setDayAlerts] = useState([])
  const [queryBounds, setQueryBounds] = useState(null)
  const [queryError, setQueryError] = useState(null)
  const [retryToken, setRetryToken] = useState(0)
  const [expandedMomentId, setExpandedMomentId] = useState(null)
  const [selectedGroupType, setSelectedGroupType] = useState(null)
  const [groupVisibleCount, setGroupVisibleCount] = useState(GROUP_SIGNAL_BATCH)
  const [selectedWindow, setSelectedWindow] = useState(null)
  const [windowVisibleCount, setWindowVisibleCount] = useState(WINDOW_MOMENT_BATCH)
  const fetchGen = useRef(0)

  const clearEvent = useCallback(() => {
    onSelectEvent?.(null)
  }, [onSelectEvent])

  const openEvent = useCallback(
    (alertId) => {
      if (alertId == null) return
      signalFocusIdRef.current = String(alertId)
      onSelectEvent?.(alertId)
    },
    [onSelectEvent],
  )

  const loadDay = useCallback(async (dateKey) => {
    const gen = ++fetchGen.current
    setQueryStatus('loading')
    setQueryError(null)
    setExpandedMomentId(null)
    setSelectedGroupType(null)
    setGroupVisibleCount(GROUP_SIGNAL_BATCH)
    setSelectedWindow(null)
    setWindowVisibleCount(WINDOW_MOMENT_BATCH)

    if (import.meta.env.DEV && ACTIVE_DAY_DENSITY_FIXTURE) {
      if (gen !== fetchGen.current) return
      const fixture = buildDayDensityFixtureAlerts(dateKey)
      setQueryBounds({
        startISO: `day-density-${ACTIVE_DAY_DENSITY_FIXTURE}`,
        endISO: 'fixture',
      })
      setDayAlerts(fixture ?? [])
      setQueryStatus('ready')
      return
    }

    if (import.meta.env.DEV && DENSE_FIXTURE_ENABLED) {
      if (gen !== fetchGen.current) return
      const fixture = buildDenseMomentFixtureAlerts(dateKey)
      setQueryBounds({ startISO: 'fixture', endISO: 'fixture' })
      setDayAlerts(fixture)
      setQueryStatus('ready')
      return
    }

    if (!dogId) {
      if (gen !== fetchGen.current) return
      setDayAlerts([])
      setQueryError(new Error('Missing dogId for History'))
      setQueryStatus('error')
      return
    }

    const { data, error, bounds } = await fetchAlertsForLocalDay(dateKey, dogId)
    if (gen !== fetchGen.current) return
    setQueryBounds(bounds)
    if (error) {
      setDayAlerts([])
      setQueryError(error)
      setQueryStatus('error')
      return
    }
    setDayAlerts(data)
    setQueryStatus('ready')
  }, [dogId])

  useEffect(() => {
    if (!open || !visible) return undefined
    loadDay(selectedDate)
    return undefined
  }, [open, visible, selectedDate, retryToken, loadDay])

  useEffect(() => {
    if (!open || !visible) return
    if (!isToday(selectedDate)) return
    if (!todayAlertSignal) return
    if (import.meta.env.DEV && ACTIVE_DAY_DENSITY_FIXTURE) return
    if (import.meta.env.DEV && DENSE_FIXTURE_ENABLED) return
    loadDay(selectedDate)
  }, [todayAlertSignal, open, visible, selectedDate, loadDay])

  useEffect(() => {
    if (!visible) return undefined
    const el = fieldRef.current
    if (!el) return undefined
    const measure = () => setFieldHeightPx(el.clientHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [visible, queryStatus, fieldPulse])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    if (open) {
      setPhase(reducedMotion ? 'open' : 'entering')
      const t = window.setTimeout(
        () => setPhase('open'),
        reducedMotion ? 0 : 640,
      )
      return () => window.clearTimeout(t)
    }
    if (phase === 'idle') return undefined
    if (reducedMotion) {
      setPhase('idle')
      return undefined
    }
    setPhase('exiting')
    const t = window.setTimeout(() => setPhase('idle'), 480)
    return () => window.clearTimeout(t)
    
  }, [open, reducedMotion])

  useEffect(() => {
    if (phase !== 'open') return undefined
    if (eventId) return undefined
    closeRef.current?.focus?.()
    return undefined
  }, [phase, eventId])

  const moments = useMemo(
    () => clusterAlertsIntoMoments(dayAlerts),
    [dayAlerts],
  )

  const dayDensity = useMemo(
    () => buildDayDensityLayout(moments, usableTrackHeight(fieldHeightPx)),
    [moments, fieldHeightPx],
  )

  const selectedMoment = useMemo(
    () => moments.find((m) => m.id === expandedMomentId) ?? null,
    [moments, expandedMomentId],
  )

  const recordedMoment = useMemo(
    () =>
      selectedMoment
        ? buildMomentLensColumns(selectedMoment.events)
        : null,
    [selectedMoment],
  )

  
  const resolvedWindowMoments = useMemo(() => {
    if (!selectedWindow) return []
    if (dayDensity.mode !== 'high') return []
    return selectedWindow.moments
  }, [selectedWindow, dayDensity.mode])

  const openTimeWindow = useCallback(
    (windowModel) => {
      if (!windowModel) return
      clearEvent()
      setSelectedGroupType(null)
      setGroupVisibleCount(GROUP_SIGNAL_BATCH)
      setExpandedMomentId(null)
      setSelectedWindow(windowModel)
      setWindowVisibleCount(WINDOW_MOMENT_BATCH)
    },
    [clearEvent],
  )

  const clearTimeWindow = useCallback(() => {
    setSelectedWindow(null)
    setWindowVisibleCount(WINDOW_MOMENT_BATCH)
  }, [])

  const selectedGroup = useMemo(() => {
    if (!recordedMoment || recordedMoment.mode !== 'grouped') return null
    if (!selectedGroupType) return null
    return (
      recordedMoment.columns.find((c) => c.type === selectedGroupType) ?? null
    )
  }, [recordedMoment, selectedGroupType])

  const selectedAlert = useMemo(() => {
    if (eventId == null || eventId === '') return null
    const idStr = String(eventId)
    return dayAlerts.find((a) => String(a.id) === idStr) ?? null
  }, [dayAlerts, eventId])

  useEffect(() => {
    if (!open || !visible) return
    if (queryStatus !== 'ready') return

    if (eventId == null || eventId === '') return

    const idStr = String(eventId)
    const alert = dayAlerts.find((a) => String(a.id) === idStr)
    if (!alert) {
      clearEvent()
      return
    }

    const moment = moments.find((m) =>
      m.events.some((e) => String(e.id) === idStr),
    )
    if (!moment) {
      clearEvent()
      return
    }

    setExpandedMomentId(moment.id)
    if (moment.events.length > INDIVIDUAL_SIGNAL_LIMIT) {
      setSelectedGroupType(alert.anomaly_type)
      setGroupVisibleCount(GROUP_SIGNAL_BATCH)
    } else {
      setSelectedGroupType(null)
    }
  }, [
    open,
    visible,
    queryStatus,
    eventId,
    dayAlerts,
    moments,
    clearEvent,
  ])

  useEffect(() => {
    if (eventId != null && eventId !== '') return undefined
    const focusId = signalFocusIdRef.current
    if (!focusId) return undefined
    const t = window.setTimeout(() => {
      const el = document.querySelector(
        `button.history-recorded__row--signal[data-alert-id="${focusId}"]`,
      )
      el?.focus?.()
    }, 40)
    return () => window.clearTimeout(t)
  }, [eventId])

  const backFromEvent = useCallback(() => {
    clearEvent()
  }, [clearEvent])

  const backFromGroup = useCallback(() => {
    clearEvent()
    setSelectedGroupType(null)
    setGroupVisibleCount(GROUP_SIGNAL_BATCH)
  }, [clearEvent])

  useEffect(() => {
    if (!visible) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (eventId != null && eventId !== '') {
          clearEvent()
          return
        }
        if (selectedGroupType) {
          setSelectedGroupType(null)
          setGroupVisibleCount(GROUP_SIGNAL_BATCH)
          return
        }
        if (expandedMomentId) {
          setExpandedMomentId(null)
          return
        }
        if (selectedWindow) {
          clearTimeWindow()
          return
        }
        onClose()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        document
          .querySelector('.history-rail__step[aria-label="Previous day"]')
          ?.click?.()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        document
          .querySelector('.history-rail__step[aria-label="Next day"]')
          ?.click?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    visible,
    onClose,
    expandedMomentId,
    selectedGroupType,
    eventId,
    clearEvent,
    selectedWindow,
    clearTimeWindow,
  ])

  useEffect(() => {
    if (phase !== 'idle') return undefined
    if (!open && returnFocusRef?.current) {
      returnFocusRef.current.focus?.()
    }
    return undefined
  }, [phase, open, returnFocusRef])

  useEffect(() => {
    if (!visible) return
    if (prevDateRef.current === selectedDate) return
    prevDateRef.current = selectedDate
    setFieldPulse((n) => n + 1)
    setExpandedMomentId(null)
    setSelectedGroupType(null)
    setGroupVisibleCount(GROUP_SIGNAL_BATCH)
    setSelectedWindow(null)
    setWindowVisibleCount(WINDOW_MOMENT_BATCH)
  }, [selectedDate, visible])

  const toggleMoment = useCallback(
    (momentId) => {
      setExpandedMomentId((current) => {
        if (current === momentId) {
          clearEvent()
          setSelectedGroupType(null)
          setGroupVisibleCount(GROUP_SIGNAL_BATCH)
          return null
        }
        clearEvent()
        setSelectedGroupType(null)
        setGroupVisibleCount(GROUP_SIGNAL_BATCH)
        return momentId
      })
    },
    [clearEvent],
  )

  const eventBackLabel = selectedGroupType
    ? groupLabelForType(selectedGroupType)
    : selectedWindow
      ? 'Recorded window'
      : 'Recorded moment'

  const backFromMomentToWindow = useCallback(() => {
    clearEvent()
    setSelectedGroupType(null)
    setGroupVisibleCount(GROUP_SIGNAL_BATCH)
    setExpandedMomentId(null)
  }, [clearEvent])

  if (!visible) return null

  const selected = selectedDate
  const nowDay = isToday(selected)
  const tz = localTimezoneLabel()

  const groupSignals = selectedGroup?.events ?? []
  const visibleGroupSignals = groupSignals.slice(0, groupVisibleCount)
  const groupRemaining = Math.max(0, groupSignals.length - groupVisibleCount)

  function renderSignalButton(col) {
    const Icon = col.Icon
    return (
      <li
        key={col.id}
        className="history-recorded__item"
        style={{ '--sensor': col.color }}
      >
        <button
          type="button"
          className="history-recorded__row history-recorded__row--signal"
          data-alert-id={col.id}
          aria-label={`${col.category}: ${col.primary}`}
          onClick={() => openEvent(col.id)}
        >
          <span className="history-recorded__glyph" aria-hidden="true">
            {Icon ? (
              <Icon
                size={18}
                weight="regular"
                className="history-moment__glyph"
              />
            ) : null}
          </span>
          <span className="history-recorded__copy">
            <span className="history-recorded__cat">{col.category}</span>
            <span className="history-recorded__primary">{col.primary}</span>
            {col.lines.map((line) => (
              <span key={line} className="history-recorded__line">
                {line}
              </span>
            ))}
          </span>
        </button>
      </li>
    )
  }

  function renderRecordedIndex() {
    if (!recordedMoment) return null

    if (recordedMoment.mode === 'grouped') {
      return (
        <ul
          className={[
            'history-recorded__index',
            'history-recorded__index--grouped',
          ].join(' ')}
        >
          {recordedMoment.columns.map((col) => {
            const Icon = col.Icon
            return (
              <li
                key={col.id}
                className="history-recorded__item"
                style={{ '--sensor': col.color }}
              >
                <button
                  type="button"
                  className="history-recorded__row history-recorded__row--signal history-recorded__row--group"
                  aria-label={`${col.category}: ${col.primary}`}
                  onClick={() => {
                    clearEvent()
                    setSelectedGroupType(col.type)
                    setGroupVisibleCount(GROUP_SIGNAL_BATCH)
                  }}
                >
                  <span className="history-recorded__glyph" aria-hidden="true">
                    {Icon ? (
                      <Icon
                        size={18}
                        weight="regular"
                        className="history-moment__glyph"
                      />
                    ) : null}
                  </span>
                  <span className="history-recorded__copy">
                    <span className="history-recorded__cat">{col.category}</span>
                    <span className="history-recorded__primary">
                      {col.primary}
                    </span>
                    {col.lines.map((line) => (
                      <span key={line} className="history-recorded__line">
                        {line}
                      </span>
                    ))}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )
    }

    return (
      <ul
        className={[
          'history-recorded__index',
          'history-recorded__index--individual',
        ].join(' ')}
      >
        {recordedMoment.columns.map((col) => renderSignalButton(col))}
      </ul>
    )
  }

  function renderContextPanel() {
    if (selectedAlert) {
      return (
        <HistoryEventDetail
          alert={selectedAlert}
          backLabel={eventBackLabel}
          onBack={backFromEvent}
          reducedMotion={reducedMotion}
        />
      )
    }

    if (selectedMoment && selectedGroup) {
      const Icon = selectedGroup.Icon
      return (
        <div className="history-recorded history-recorded--group" aria-live="polite">
          <button
            type="button"
            className="history-event__back"
            onClick={backFromGroup}
          >
            <CaretLeft size={14} weight="regular" aria-hidden="true" />
            <span>Recorded moment</span>
          </button>

          <div
            className="history-recorded__group-head"
            style={{ '--sensor': selectedGroup.color }}
          >
            <span className="history-recorded__glyph" aria-hidden="true">
              {Icon ? (
                <Icon
                  size={18}
                  weight="regular"
                  className="history-moment__glyph"
                />
              ) : null}
            </span>
            <div>
              <p className="history-workspace__context-kicker">
                {selectedGroup.category}
              </p>
              <p className="history-recorded__time history-recorded__time--group">
                {selectedGroup.count} recorded{' '}
                {selectedGroup.count === 1 ? 'signal' : 'signals'}
              </p>
              {selectedGroup.lines[0] ? (
                <p className="history-recorded__count">{selectedGroup.lines[0]}</p>
              ) : null}
              {selectedGroup.lines[1] ? (
                <p className="history-recorded__count">{selectedGroup.lines[1]}</p>
              ) : null}
            </div>
          </div>

          <ul className="history-recorded__index history-recorded__index--individual">
            {visibleGroupSignals.map((alert) =>
              renderSignalButton(buildSignalColumn(alert)),
            )}
          </ul>

          {groupRemaining > 0 ? (
            <button
              type="button"
              className="history-recorded__more"
              onClick={() =>
                setGroupVisibleCount((n) => n + GROUP_SIGNAL_BATCH)
              }
            >
              Show {Math.min(GROUP_SIGNAL_BATCH, groupRemaining)} more ·{' '}
              {groupRemaining} remaining
            </button>
          ) : null}
        </div>
      )
    }

    if (selectedMoment && recordedMoment) {
      return (
        <div className="history-recorded" aria-live="polite">
          {selectedWindow ? (
            <button
              type="button"
              className="history-event__back"
              onClick={backFromMomentToWindow}
            >
              <CaretLeft size={14} weight="regular" aria-hidden="true" />
              <span>Recorded window</span>
            </button>
          ) : null}
          <p className="history-workspace__context-kicker">Recorded moment</p>
          <p className="history-recorded__time">{selectedMoment.hm}</p>
          <p className="history-recorded__count">
            {selectedMoment.events.length}{' '}
            {selectedMoment.events.length === 1 ? 'Signal' : 'Signals'}
          </p>
          {renderRecordedIndex()}
        </div>
      )
    }

    if (selectedWindow) {
      const windowMoments = selectedWindow.moments ?? []
      const visibleMoments = windowMoments.slice(0, windowVisibleCount)
      const remaining = Math.max(0, windowMoments.length - windowVisibleCount)
      const span =
        selectedWindow.spanLabel ||
        (selectedWindow.startHm === selectedWindow.endHm
          ? selectedWindow.startHm
          : `${selectedWindow.startHm} — ${selectedWindow.endHm}`)

      return (
        <div className="history-recorded history-recorded--window" aria-live="polite">
          <button
            type="button"
            className="history-event__back"
            onClick={clearTimeWindow}
          >
            <CaretLeft size={14} weight="regular" aria-hidden="true" />
            <span>Day</span>
          </button>
          <p className="history-workspace__context-kicker">Recorded window</p>
          <p className="history-recorded__time">{span}</p>
          <p className="history-recorded__count">
            {selectedWindow.momentCount}{' '}
            {selectedWindow.momentCount === 1 ? 'Moment' : 'Moments'}
            <span aria-hidden="true"> · </span>
            {selectedWindow.signalCount}{' '}
            {selectedWindow.signalCount === 1 ? 'Signal' : 'Signals'}
          </p>

          <ul className="history-recorded__index history-recorded__index--window">
            {visibleMoments.map((moment) => (
              <li key={moment.id} className="history-recorded__item">
                <button
                  type="button"
                  className="history-recorded__row history-recorded__row--signal"
                  aria-label={`${moment.hm}, ${moment.events.length} signals`}
                  onClick={() => toggleMoment(moment.id)}
                >
                  <span className="history-recorded__copy">
                    <span className="history-recorded__primary">{moment.hm}</span>
                    <span className="history-recorded__line">
                      {moment.events.length}{' '}
                      {moment.events.length === 1 ? 'Signal' : 'Signals'}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {remaining > 0 ? (
            <button
              type="button"
              className="history-recorded__more"
              onClick={() =>
                setWindowVisibleCount((n) => n + WINDOW_MOMENT_BATCH)
              }
            >
              Show {Math.min(WINDOW_MOMENT_BATCH, remaining)} more · {remaining}{' '}
              remaining
            </button>
          ) : null}
        </div>
      )
    }

    return (
      <>
        <p className="history-workspace__context-kicker">
          {nowDay ? 'Present day' : 'Archived day'}
        </p>

        <div className="history-workspace__date-hero">
          <p className="history-workspace__date-month">{monthLong(selected)}</p>
          <p className="history-workspace__date-day">{dayNumber(selected)}</p>
          <p className="history-workspace__date-year">{yearOf(selected)}</p>
        </div>

        <div className="history-workspace__date-meta">
          <p className="history-workspace__weekday">{weekdayLong(selected)}</p>
          <p className="history-workspace__tz">{tz}</p>
        </div>

        <div className="history-day-scale" aria-hidden="true">
          <p className="history-day-scale__kicker">Day scale</p>
          <ul className="history-day-scale__list">
            {DAY_SCALE.map((h) => (
              <li key={h} className="history-day-scale__row">
                <span className="history-day-scale__h">{h}</span>
                <span className="history-day-scale__bar" />
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  const contextLabel = selectedAlert
    ? 'Event detail'
    : selectedGroup
      ? 'Sensor group'
      : selectedMoment
        ? 'Recorded moment'
        : selectedWindow
          ? 'Recorded window'
          : 'Day context'

  return (
    <div
      className={`history-root history-root--${phase}${
        reducedMotion ? ' history-root--reduced' : ''
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-history-open={phase === 'open' ? 'true' : 'false'}
      data-history-query={queryStatus}
      data-history-depth={
        selectedAlert
          ? 'event'
          : selectedGroup
            ? 'group'
            : selectedMoment
              ? 'moment'
              : selectedWindow
                ? 'window'
                : 'day'
      }
      data-day-density={dayDensity.mode}
    >
      <div className="history-root__veil" aria-hidden="true" />

      <div className="history-root__axis-bleed" aria-hidden="true">
        <span className="history-root__axis-line" />
        <span className="history-root__axis-glow" />
      </div>

      <div className="history-workspace">
        <div className="history-workspace__glass history-workspace__glass--archive">
          <header className="history-workspace__header">
            <div className="history-workspace__titles">
              <p className="history-workspace__system">Pawlink / Archive</p>
              <h2 id={titleId} className="history-workspace__title">
                {dogName}&apos;s History
              </h2>
              <p className="history-workspace__editorial">
                Every signal. In context.
              </p>
            </div>

            <button
              ref={closeRef}
              type="button"
              className="history-workspace__close"
              aria-label="Close history"
              onClick={onClose}
            >
              <X size={16} weight="regular" />
            </button>
          </header>

          <div className="history-workspace__rail-plane">
            <HistoryDateRail
              selectedKey={selected}
              onSelectDate={onSelectDate}
              reducedMotion={reducedMotion}
            />
          </div>

          <div
            className="history-workspace__body"
            data-pulse={fieldPulse}
            key={`body-${selected}`}
          >
            <section
              className="history-workspace__main"
              aria-label="Twenty-four hour temporal field"
            >
              <div className="history-field" ref={fieldRef}>
                <div className="history-field__spine" aria-hidden="true">
                  <span className="history-field__spine-line" />
                  {DAY_HOURS.map((h) => (
                    <div
                      key={h}
                      className="history-field__mark"
                      style={{ '--t': Number(h) / 24 }}
                    >
                      <span className="history-field__tick" />
                      <span className="history-field__label">{h}</span>
                      <span className="history-field__guide" />
                    </div>
                  ))}
                </div>

                <div className="history-field__plane" aria-hidden="true">
                  {DAY_HOURS.map((h) => (
                    <span
                      key={`g-${h}`}
                      className="history-field__band"
                      style={{ '--t': Number(h) / 24 }}
                    />
                  ))}
                </div>

                {queryStatus === 'ready' &&
                dayDensity.mode === 'high' &&
                dayDensity.filament ? (
                  <HistoryDensityFilament
                    filament={dayDensity.filament}
                    selectedWindow={selectedWindow}
                    reducedMotion={reducedMotion}
                    onSelectBin={(binIndex) => {
                      const win = timeWindowFromFilamentBin(
                        dayDensity.filament.bins,
                        binIndex,
                      )
                      openTimeWindow(win)
                    }}
                  />
                ) : null}

                {queryStatus === 'ready' && moments.length > 0 ? (
                  <div
                    className="history-field__moments"
                    aria-label="Recorded moments for this day"
                    data-density-mode={dayDensity.mode}
                  >
                    {dayDensity.mode === 'high'
                      ? resolvedWindowMoments.map((moment) => (
                          <HistoryMomentCluster
                            key={moment.id}
                            moment={moment}
                            selected={expandedMomentId === moment.id}
                            onToggle={toggleMoment}
                            reducedMotion={reducedMotion}
                          />
                        ))
                      : dayDensity.marks.map((mark) => {
                          if (mark.kind === 'window') {
                            return (
                              <HistoryTimeWindowMark
                                key={mark.id}
                                mark={mark}
                                selected={selectedWindow?.id === mark.id}
                                reducedMotion={reducedMotion}
                                onSelect={(m) =>
                                  openTimeWindow(
                                    buildTimeWindowFromMoments(
                                      m.moments,
                                      m.id,
                                    ),
                                  )
                                }
                              />
                            )
                          }
                          const moment = mark.moments[0]
                          if (!moment) return null
                          return (
                            <HistoryMomentCluster
                              key={moment.id}
                              moment={moment}
                              selected={expandedMomentId === moment.id}
                              onToggle={toggleMoment}
                              reducedMotion={reducedMotion}
                            />
                          )
                        })}
                  </div>
                ) : null}

                {queryStatus === 'loading' ? (
                  <p className="history-field__status" aria-live="polite">
                    Retrieving day…
                  </p>
                ) : null}

                {queryStatus === 'error' ? (
                  <div
                    className="history-field__status history-field__status--error"
                    role="alert"
                  >
                    <p>History couldn&apos;t be loaded.</p>
                    <button
                      type="button"
                      className="history-field__retry"
                      onClick={() => setRetryToken((n) => n + 1)}
                    >
                      Retry
                    </button>
                  </div>
                ) : null}

                {queryStatus === 'ready' && moments.length === 0 ? (
                  <p className="history-field__status" aria-live="polite">
                    No events were recorded for this date.
                  </p>
                ) : null}
              </div>
            </section>

            <aside
              className={[
                'history-workspace__context',
                selectedMoment || selectedAlert || selectedWindow
                  ? 'history-workspace__context--moment'
                  : null,
                selectedAlert ? 'history-workspace__context--event' : null,
                selectedWindow && !selectedMoment && !selectedAlert
                  ? 'history-workspace__context--window'
                  : null,
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={contextLabel}
            >
              <div className="history-workspace__context-glass">
                {renderContextPanel()}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {import.meta.env.DEV && queryBounds ? (
        <pre className="history-dev-probe" hidden aria-hidden="true">
          {JSON.stringify(
            {
              date: selected,
              bounds: queryBounds,
              alertCount: dayAlerts.length,
              momentCount: moments.length,
              status: queryStatus,
              expandedMomentId,
              selectedGroupType,
              selectedWindowId: selectedWindow?.id ?? null,
              eventId,
              dayDensityFixture: ACTIVE_DAY_DENSITY_FIXTURE,
              denseFixture: DENSE_FIXTURE_ENABLED,
              dayDensity: {
                mode: dayDensity.mode,
                usableTrackHeight: dayDensity.usableTrackHeight,
                momentCount: dayDensity.momentCount,
                collisionCount: dayDensity.collisionCount,
                collisionRatio: dayDensity.collisionRatio,
                occupiedPixelRatio: dayDensity.occupiedPixelRatio,
                maxLocalDensity: dayDensity.maxLocalDensity,
                visibleMarkCount: dayDensity.marks.length,
                metrics: dayDensity.metrics,
              },
            },
            null,
            2,
          )}
        </pre>
      ) : null}
    </div>
  )
}

export default HistoryWorkspace
