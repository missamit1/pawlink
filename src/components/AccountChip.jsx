import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthProvider.jsx'
import './AccountChip.css'

function accountInitial(user) {
  const letter = String(user?.email || '').trim().charAt(0)
  return letter ? letter.toUpperCase() : '?'
}

function AccountChip() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!user) return null

  const email = user.email || 'Account'
  const photo = user.user_metadata?.avatar_url || user.user_metadata?.picture
  const initial = accountInitial(user)

  async function handleSignOut() {
    setOpen(false)
    await signOut()
    
    window.location.assign('/')
  }

  return (
    <div className="account-chip" ref={rootRef}>
      <button
        type="button"
        className="account-chip__avatar"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account · ${email}`}
        onClick={() => setOpen((value) => !value)}
      >
        {photo ? (
          <img src={photo} alt="" className="account-chip__photo" />
        ) : (
          <span aria-hidden="true">{initial}</span>
        )}
      </button>
      {open && (
        <div className="account-chip__menu" role="menu">
          <p className="account-chip__email">{email}</p>
          <button
            type="button"
            role="menuitem"
            className="account-chip__sign-out"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default AccountChip
