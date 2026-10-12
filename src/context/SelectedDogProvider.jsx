import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthProvider.jsx'
import { fetchOwnedDogs } from '../lib/selectedDog.js'

const SelectedDogContext = createContext({
  selectedDog: null,
  setSelectedDog: () => {},
  ownedDogs: [],
  status: 'idle',
  error: null,
  refreshOwnedDogs: async () => {},
})

export function SelectedDogProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [selectedDog, setSelectedDogState] = useState(null)
  const [ownedDogs, setOwnedDogs] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  const setSelectedDog = useCallback((next) => {
    setSelectedDogState(next)
  }, [])

  const refreshOwnedDogs = useCallback(async () => {
    if (!user?.id) {
      setOwnedDogs([])
      setSelectedDogState(null)
      setStatus('signed-out')
      return []
    }

    setStatus('loading')
    try {
      const dogs = await fetchOwnedDogs(user.id)
      setOwnedDogs(dogs)
      setError(null)

      if (dogs.length === 0) {
        setSelectedDogState(null)
        setStatus('no-dog')
        return dogs
      }

      setSelectedDogState((current) => {
        const stillOwned = current && dogs.some((d) => d.id === current.id)
        return stillOwned ? current : dogs[0]
      })
      setStatus('ready')
      return dogs
    } catch (err) {
      setOwnedDogs([])
      setSelectedDogState(null)
      setStatus('error')
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to load owned dogs — is server on 3001?'),
      )
      throw err
    }
  }, [user?.id])

  useEffect(() => {
    if (authLoading) {
      setStatus('loading')
      return
    }

    if (!user?.id) {
      setOwnedDogs([])
      setSelectedDogState(null)
      setStatus('signed-out')
      setError(null)
      return
    }

    refreshOwnedDogs().catch(() => {})
  }, [authLoading, user?.id, refreshOwnedDogs])

  const value = useMemo(
    () => ({
      selectedDog,
      setSelectedDog,
      ownedDogs,
      status,
      error,
      refreshOwnedDogs,
    }),
    [selectedDog, setSelectedDog, ownedDogs, status, error, refreshOwnedDogs],
  )

  return (
    <SelectedDogContext.Provider value={value}>
      {children}
    </SelectedDogContext.Provider>
  )
}

export function useSelectedDog() {
  return useContext(SelectedDogContext)
}
