import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CaretLeft, CaretRight, CalendarBlank } from '@phosphor-icons/react'
import {
  addDays,
  dayNumber,
  daysFromToday,
  dayWindow,
  isToday,
  monthShort,
  todayKey,
  yearOf,
} from '../../lib/historyDateRange.js'

const RAIL_RADIUS = 3

function HistoryDateRail({ selectedKey, onSelectDate, reducedMotion }) {
  const trackRef = useRef(null)
  const dayRefs = useRef(new Map())
  const [lens, setLens] = useState({ left: 0, width: 44, ready: false })
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef(null)
  const calendarRef = useRef(null)

  const days = dayWindow(selectedKey, RAIL_RADIUS)
  const today = todayKey()

  const measureLens = () => {
    const track = trackRef.current
    const btn = dayRefs.current.get(selectedKey)
    if (!track || !btn) return
    const t = track.getBoundingClientRect()
    const b = btn.getBoundingClientRect()
    setLens({
      left: b.left - t.left + track.scrollLeft,
      width: b.width,
      ready: true,
    })
  }

  useLayoutEffect(() => {
    measureLens()
  }, [selectedKey, days.join('|')])

  useEffect(() => {
    const onResize = () => measureLens()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [selectedKey])

  const setDayRef = (key) => (el) => {
    if (el) dayRefs.current.set(key, el)
    else dayRefs.current.delete(key)
  }

  const go = (key) => {
    if (key !== selectedKey) onSelectDate(key)
  }

  const onTrackPointerDown = (e) => {
    if (e.button !== 0) return
    if (e.target.closest('button[data-day]')) return
    const track = trackRef.current
    if (!track) return
    track.setPointerCapture(e.pointerId)
    dragRef.current = {
      startX: e.clientX,
      originKey: selectedKey,
      moved: false,
    }
    setDragging(true)
  }

  const onTrackPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) < 28) return
    d.moved = true
    const step = Math.round(dx / 56)
    if (step === 0) return
    const next = addDays(d.originKey, step)
    
    const capped = next > today ? today : next
    if (capped !== selectedKey) onSelectDate(capped)
  }

  const onTrackPointerUp = (e) => {
    if (!dragRef.current) return
    const track = trackRef.current
    if (track?.hasPointerCapture?.(e.pointerId)) {
      track.releasePointerCapture(e.pointerId)
    }
    dragRef.current = null
    setDragging(false)
  }

  const monthLabel = (() => {
    const d = selectedKey
    return `${monthShort(d)} ${yearOf(d)}`
  })()

  return (
    <div className="history-rail" data-dragging={dragging ? 'true' : 'false'}>
      <div className="history-rail__meta">
        <p className="history-rail__month" aria-live="polite">
          {monthLabel}
        </p>
        <p className="history-rail__axis-label">Temporal axis</p>
      </div>

      <div className="history-rail__controls">
        <button
          type="button"
          className="history-rail__step"
          aria-label="Previous day"
          onClick={() => go(addDays(selectedKey, -1))}
        >
          <CaretLeft size={16} weight="regular" />
        </button>

        <div
          className="history-rail__track-wrap"
          ref={trackRef}
          onPointerDown={onTrackPointerDown}
          onPointerMove={onTrackPointerMove}
          onPointerUp={onTrackPointerUp}
          onPointerCancel={onTrackPointerUp}
          role="listbox"
          aria-label="Select a day"
          aria-orientation="horizontal"
        >
          <div className="history-rail__axis" aria-hidden="true" />

          <div
            className={`history-rail__lens${lens.ready ? ' history-rail__lens--ready' : ''}${
              reducedMotion ? ' history-rail__lens--instant' : ''
            }`}
            style={{
              transform: `translateX(${lens.left}px)`,
              width: `${lens.width}px`,
            }}
            aria-hidden="true"
          >
            <span className="history-rail__lens-core" />
          </div>

          <div className="history-rail__days">
            {days.map((key) => {
              const n = dayNumber(key)
              const selected = key === selectedKey
              const now = isToday(key)
              const dist = Math.abs(daysFromToday(key))
              const depth =
                dist === 0 ? 'now' : dist <= 2 ? 'near' : dist <= 5 ? 'mid' : 'far'
              const showMonthTick =
                n === 1 || (key === days[0] && monthShort(key) !== monthShort(addDays(key, -1)))

              return (
                <button
                  key={key}
                  ref={setDayRef(key)}
                  type="button"
                  role="option"
                  data-day={key}
                  aria-selected={selected}
                  aria-label={`${monthShort(key)} ${n}, ${yearOf(key)}${now ? ', today' : ''}`}
                  className={`history-rail__day history-rail__day--${depth}${
                    selected ? ' history-rail__day--selected' : ''
                  }${now ? ' history-rail__day--today' : ''}`}
                  onClick={() => go(key)}
                >
                  <span className="history-rail__tick" aria-hidden="true" />
                  {showMonthTick ? (
                    <span className="history-rail__month-chip">{monthShort(key)}</span>
                  ) : (
                    <span className="history-rail__month-chip history-rail__month-chip--ghost">
                      &nbsp;
                    </span>
                  )}
                  <span className="history-rail__num">{n}</span>
                  {now ? <span className="history-rail__now-dot" aria-hidden="true" /> : null}
                </button>
              )
            })}
          </div>
        </div>

        <button
          type="button"
          className="history-rail__step"
          aria-label="Next day"
          disabled={selectedKey >= today}
          onClick={() => {
            const next = addDays(selectedKey, 1)
            go(next > today ? today : next)
          }}
        >
          <CaretRight size={16} weight="regular" />
        </button>
      </div>

      <div className="history-rail__actions">
        <button
          type="button"
          className={`history-rail__origin${isToday(selectedKey) ? ' history-rail__origin--active' : ''}`}
          onClick={() => go(today)}
          aria-label="Return to today — live present"
        >
          <span className="history-rail__origin-stack">
            <span className="history-rail__origin-kicker">Now</span>
            <span className="history-rail__origin-mark" aria-hidden="true" />
            <span className="history-rail__origin-label">Today</span>
          </span>
        </button>

        <button
          type="button"
          className="history-rail__calendar"
          aria-label="Jump to date"
          onClick={() => calendarRef.current?.showPicker?.() || calendarRef.current?.click()}
        >
          <CalendarBlank size={15} weight="regular" />
        </button>
        <input
          ref={calendarRef}
          type="date"
          className="history-rail__date-input"
          value={selectedKey}
          max={today}
          onChange={(e) => {
            const v = e.target.value
            if (v) go(v)
          }}
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export default HistoryDateRail
