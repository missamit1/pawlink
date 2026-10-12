import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import { supabase } from '../services/supabase.js'
import PawLinkAuth from '../components/PawLinkAuth.jsx'

function AuthScreen({ mode }) {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  if (loading) return null
  
  if (user) return <Navigate to="/welcome-dog" replace />

  async function handleSignIn({ email, password }) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    navigate('/welcome-dog')
  }

  async function handleSignUp({ email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error

    if (data.session) {
      navigate('/welcome-dog')
      return
    }

    return {
      message: 'Check your email to confirm your account.',
    }
  }

  async function handleForgotPassword({ email }) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    if (error) throw error
  }

  async function handleOAuth(provider) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/welcome-dog`,
      },
    })
    if (error) throw error
  }

  function handleModeChange(next) {
    navigate(next === 'signup' ? '/signup' : '/login', { replace: true })
  }

  return (
    <PawLinkAuth
      initialMode={mode}
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onForgotPassword={handleForgotPassword}
      onOAuth={handleOAuth}
      onModeChange={handleModeChange}
      links={{
        home: '/',
        product: '/#collar',
        technology: '/#understanding',
        story: '/about.html',
        support: '/#join-pawlink',
      }}
    />
  )
}

export default AuthScreen
