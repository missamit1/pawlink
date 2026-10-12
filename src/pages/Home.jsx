import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'

function Home() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (user) return <Navigate to="/welcome-dog" replace />

  if (typeof window !== 'undefined') {
    window.location.replace('/site/')
  }

  return null
}

export default Home
