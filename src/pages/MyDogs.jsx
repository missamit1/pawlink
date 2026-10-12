import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import { useSelectedDog } from '../context/SelectedDogProvider.jsx'
import { BREED_PORTRAITS, resolveDogVisuals } from '../lib/companionsCatalog.js'
import { createOwnedDog } from '../lib/selectedDog.js'
import './MyDogs.css'

const NAV = ['Overview', 'My Dogs', 'Activity', 'Settings']

function MyDogs() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    ownedDogs,
    selectedDog,
    setSelectedDog,
    status,
    refreshOwnedDogs,
  } = useSelectedDog()

  const [activeId, setActiveId] = useState(null)
  const [adding, setAdding] = useState(false)
  const [dogName, setDogName] = useState('')
  const [breedKey, setBreedKey] = useState(BREED_PORTRAITS[0].key)
  const [saving, setSaving] = useState(false)
  const [addError, setAddError] = useState(null)

  useEffect(() => {
    if (ownedDogs.length === 0) {
      setActiveId(null)
      return
    }

    const stillThere =
      activeId && ownedDogs.some((dog) => dog.id === activeId)
    if (stillThere) return

    const prefer =
      selectedDog && ownedDogs.some((dog) => dog.id === selectedDog.id)
        ? selectedDog.id
        : ownedDogs[0].id

    setActiveId(prefer)
  }, [ownedDogs, selectedDog, activeId])

  const activeDog = useMemo(
    () => ownedDogs.find((dog) => dog.id === activeId) || null,
    [ownedDogs, activeId],
  )

  const activeVisuals = useMemo(
    () => resolveDogVisuals(activeDog),
    [activeDog],
  )

  const selectedPortrait = useMemo(
    () =>
      BREED_PORTRAITS.find((p) => p.key === breedKey) || BREED_PORTRAITS[0],
    [breedKey],
  )

  if (status === 'no-dog' && !adding) {
    return <Navigate to="/welcome-dog" replace />
  }

  function handleContinue() {
    if (!activeDog) return
    setSelectedDog({
      ...activeDog,
      avatarUrl: activeDog.avatarUrl || activeVisuals.avatar,
    })
    navigate('/dashboard')
  }

  async function handleAddDog(event) {
    event.preventDefault()
    if (!user?.id || saving) return

    setSaving(true)
    setAddError(null)

    try {
      const created = await createOwnedDog({
        name: dogName,
        ownerUserId: user.id,
        breed: selectedPortrait.breedLabel,
        avatarUrl: selectedPortrait.avatar,
      })

      const dogs = await refreshOwnedDogs()
      setActiveId(created.id)
      setDogName('')
      setAdding(false)

      if (dogs?.some((d) => d.id === created.id)) {
        setActiveId(created.id)
      }
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Could not add dog')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="my-dogs">
      <header className="my-dogs__header">
        <Link className="my-dogs__logo" to="/">
          PawLink
        </Link>

        <nav className="my-dogs__nav" aria-label="Account">
          {NAV.map((label) => (
            <span
              key={label}
              className={
                label === 'My Dogs'
                  ? 'my-dogs__nav-item is-active'
                  : 'my-dogs__nav-item'
              }
            >
              {label}
            </span>
          ))}
        </nav>
      </header>

      <div className="my-dogs__layout">
        <section className="my-dogs__panel" aria-labelledby="my-dogs-title">
          <p className="my-dogs__eyebrow">Your companions</p>
          <h1 id="my-dogs-title">
            Every dog.
            <br />
            A world of their own.
          </h1>

          {status === 'loading' ? (
            <p className="my-dogs__status">Loading your dogs…</p>
          ) : null}

          {status === 'error' ? (
            <p className="my-dogs__status my-dogs__status--error">
              Could not load owned dogs. Is the server on 3001?
            </p>
          ) : null}

          {status !== 'loading' && ownedDogs.length === 0 ? (
            <p className="my-dogs__status">
              No dogs yet. Add a dog and choose their name.
            </p>
          ) : null}

          <ul className="my-dogs__list" role="listbox" aria-label="Your dogs">
            {ownedDogs.map((dog) => {
              const selected = dog.id === activeId
              const visuals = resolveDogVisuals(dog)
              return (
                <li key={dog.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={
                      selected ? 'my-dogs__row is-selected' : 'my-dogs__row'
                    }
                    onClick={() => setActiveId(dog.id)}
                  >
                    <img
                      className="my-dogs__avatar"
                      src={visuals.avatar}
                      alt=""
                    />
                    <span className="my-dogs__name">{dog.name}</span>
                    {selected ? (
                      <span className="my-dogs__selected-mark">
                        <span
                          className="my-dogs__selected-dot"
                          aria-hidden="true"
                        />
                        Selected
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>

          {!adding ? (
            <button
              className="my-dogs__add"
              type="button"
              onClick={() => {
                setAdding(true)
                setAddError(null)
              }}
            >
              <span className="my-dogs__add-icon" aria-hidden="true">
                +
              </span>
              Add a dog
            </button>
          ) : (
            <form className="my-dogs__add-form" onSubmit={handleAddDog}>
              <label className="my-dogs__add-field">
                <span>Dog name</span>
                <input
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  placeholder="e.g. Luna"
                  required
                  autoFocus
                  disabled={saving}
                />
              </label>

              <label className="my-dogs__add-field">
                <span>Look</span>
                <select
                  value={breedKey}
                  onChange={(e) => setBreedKey(e.target.value)}
                  disabled={saving}
                >
                  {BREED_PORTRAITS.map((portrait) => (
                    <option key={portrait.key} value={portrait.key}>
                      {portrait.breedLabel}
                    </option>
                  ))}
                </select>
              </label>

              {addError ? (
                <p className="my-dogs__status my-dogs__status--error">
                  {addError}
                </p>
              ) : null}

              <div className="my-dogs__add-actions">
                <button type="submit" disabled={saving || !dogName.trim()}>
                  {saving ? 'Saving…' : 'Save dog'}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setAdding(false)
                    setAddError(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <button
            className="my-dogs__continue"
            type="button"
            disabled={!activeDog}
            onClick={handleContinue}
          >
            Continue
            <span aria-hidden="true">→</span>
          </button>
        </section>

        <aside className="my-dogs__stage" aria-live="polite">
          <p className="my-dogs__stage-note">
            Different dogs
            <br />
            richer tomorrows
          </p>

          {activeDog ? (
            <>
              <img
                className="my-dogs__hero"
                src={activeVisuals.hero}
                alt={activeDog.name}
              />
              <div className="my-dogs__stage-caption">
                <h2>{activeDog.name}</h2>
                <span className="my-dogs__stage-rule" aria-hidden="true" />
              </div>
            </>
          ) : (
            <div className="my-dogs__stage-empty" aria-hidden="true" />
          )}
        </aside>
      </div>
    </div>
  )
}

export default MyDogs
