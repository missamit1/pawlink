import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { supabase } from '../services/supabase.js'

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  error: null,
  signOut: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (cancelled) return
      if (sessionError) {
        setError(sessionError)
        setSession(null)
        setUser(null)
        setLoading(false)
        return
      }
      setSession(data.session ?? null)
      setUser(data.session?.user ?? null)
      setError(null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (cancelled) return
      setSession(nextSession ?? null)
      setUser(nextSession?.user ?? null)
      setError(null)
      setLoading(false)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const signOut = useCallback(async () => {
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      setError(signOutError)
      return { error: signOutError }
    }
    return { error: null }
  }, [])

  const value = useMemo(
    () => ({ user, session, loading, error, signOut }),
    [user, session, loading, error, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
