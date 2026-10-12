import { forwardRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './Navigation.css'

const Navigation = forwardRef(function Navigation(
  { active = 'ray', onOpenHistory, dogName = 'Dog' },
  historyButtonRef,
) {
  const destinations = useMemo(
    () => [
      { id: 'home', index: '01', label: 'HOME', kind: 'link', to: '/my-dogs' },
      {
        id: 'ray',
        index: '02',
        label: String(dogName || 'Dog').toUpperCase(),
        kind: 'anchor',
        href: '#ray',
      },
      {
        id: 'health',
        index: '03',
        label: 'HEALTH',
        kind: 'anchor',
        href: '#health',
      },
      {
        id: 'location',
        index: '04',
        label: 'LOCATION',
        kind: 'anchor',
        href: '#location',
      },
      { id: 'history', index: '05', label: 'HISTORY', kind: 'button' },
    ],
    [dogName],
  )

  return (
    <nav className="paw-panel__nav" aria-label="PawLink">
      <ol>
        {destinations.map((dest) => {
          const isActive = active === dest.id
          const body = (
            <>
              <span className="nav-pearl" aria-hidden="true" />
              <span className="nav-number">{dest.index}</span>
              <span className="nav-label">{dest.label}</span>
            </>
          )

          if (dest.kind === 'link') {
            return (
              <li key={dest.id} className={isActive ? 'is-active' : undefined}>
                <Link to={dest.to} className="paw-panel__nav-item">
                  {body}
                </Link>
              </li>
            )
          }

          if (dest.kind === 'button') {
            return (
              <li key={dest.id} className={isActive ? 'is-active' : undefined}>
                <button
                  ref={historyButtonRef}
                  type="button"
                  className="paw-panel__nav-item"
                  aria-pressed={isActive}
                  onClick={() => onOpenHistory?.(true)}
                >
                  {body}
                </button>
              </li>
            )
          }

          return (
            <li key={dest.id} className={isActive ? 'is-active' : undefined}>
              <a
                href={dest.href}
                className="paw-panel__nav-item"
                onClick={(e) => {
                  if (
                    dest.id === 'ray' &&
                    active === 'history' &&
                    typeof onOpenHistory === 'function'
                  ) {
                    e.preventDefault()
                    onOpenHistory(false)
                  }
                }}
              >
                {body}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
})

export default Navigation
