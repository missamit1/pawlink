import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import { useSelectedDog } from '../context/SelectedDogProvider.jsx'
import { BREED_PORTRAITS } from '../lib/companionsCatalog.js'
import { createOwnedDog } from '../lib/selectedDog.js'
import './WelcomeDog.css'

const DEFAULT_PORTRAIT = BREED_PORTRAITS[0] 

function WelcomeDog() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { ownedDogs, status, setSelectedDog, refreshOwnedDogs } =
    useSelectedDog()

  const [dogName, setDogName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  if (status === 'loading') {
    return (
      <div className="welcome-dog">
        <p className="welcome-dog__status">Loading…</p>
      </div>
    )
  }

  
  if (status === 'ready' && ownedDogs.length > 0) {
    return <Navigate to="/my-dogs" replace />
  }

  if (status === 'error') {
    return (
      <div className="welcome-dog">
        <p className="welcome-dog__status welcome-dog__status--error">
          Could not load your dogs. Is the server on 3001?
        </p>
      </div>
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!user?.id || saving) return

    const name = dogName.trim()
    if (!name) return

    setSaving(true)
    setError(null)

    try {
      const created = await createOwnedDog({
        name,
        ownerUserId: user.id,
        breed: DEFAULT_PORTRAIT.breedLabel,
        avatarUrl: DEFAULT_PORTRAIT.avatar,
      })

      await refreshOwnedDogs()
      setSelectedDog({
        ...created,
        avatarUrl: created.avatarUrl || DEFAULT_PORTRAIT.avatar,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save dog')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="welcome-dog">
      <header className="welcome-dog__header">
        <Link className="welcome-dog__logo" to="/">
          PawLink
        </Link>
      </header>

      <main className="welcome-dog__main">
        <div className="welcome-dog__card">
          <p className="welcome-dog__eyebrow">Your world begins</p>
          <h1>What&apos;s your dog&apos;s name?</h1>
          <p className="welcome-dog__lead">
            One name. Their own space in PawLink.
          </p>

          <form className="welcome-dog__form" onSubmit={handleSubmit}>
            <label className="welcome-dog__field">
              <span className="welcome-dog__visually-hidden">Dog name</span>
              <input
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                placeholder="e.g. Luna"
                required
                autoFocus
                autoComplete="off"
                disabled={saving}
                maxLength={40}
              />
            </label>

            {error ? (
              <p className="welcome-dog__status welcome-dog__status--error">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={saving || !dogName.trim()}
            >
              {saving ? 'Opening…' : 'Enter their world'}
              <span aria-hidden="true"> →</span>
            </button>
          </form>
        </div>

        <aside className="welcome-dog__stage" aria-hidden="true">
          <img
            src={DEFAULT_PORTRAIT.hero}
            alt=""
            className="welcome-dog__hero"
          />
        </aside>
      </main>
    </div>
  )
}

export default WelcomeDog
