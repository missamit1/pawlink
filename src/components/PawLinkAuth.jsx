import { useEffect, useRef, useState } from 'react'
import './PawLinkAuth.css'

function Icon({ name, ...props }) {
  const paths = {
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.12H3.04v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.92A6 6 0 0 1 6.08 12c0-.67.11-1.32.31-1.92V7.49H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.51l3.35-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.79.5 3.83 1.5l2.87-2.88A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.96 5.49l3.35 2.59C7.18 7.72 9.39 5.96 12 5.96Z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.1 12.5c0-2 1.64-3 1.72-3.05-.94-1.38-2.4-1.57-2.91-1.59-1.23-.13-2.42.74-3.05.74-.64 0-1.6-.73-2.64-.71-1.35.02-2.61.8-3.3 2.02-1.42 2.44-.36 6.05 1 8.03.67.97 1.46 2.05 2.51 2.01 1.02-.04 1.4-.65 2.63-.65 1.22 0 1.57.65 2.64.63 1.09-.02 1.78-.97 2.42-1.95.77-1.12 1.08-2.22 1.1-2.28-.03-.01-2.12-.81-2.12-3.2ZM15.1 6.54c.54-.68.92-1.6.82-2.54-.8.04-1.8.55-2.37 1.22-.51.59-.97 1.55-.85 2.45.9.07 1.83-.46 2.4-1.13Z" />
    </svg>
  )
}

export default function PawLinkAuth({
  initialMode = 'signin',
  onSignIn,
  onSignUp,
  onForgotPassword,
  onOAuth,
  onModeChange,
  links = {},
}) {
  const [mode, setMode] = useState(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(true)
  const [pending, setPending] = useState('')
  const [notice, setNotice] = useState(null)

  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const tabRefs = useRef([])
  const busyRef = useRef(false)

  useEffect(() => {
    setMode(initialMode)
    setNotice(null)
    setShowPassword(false)
    if (passwordRef.current) passwordRef.current.value = ''
  }, [initialMode])

  const signup = mode === 'signup'
  const busy = Boolean(pending)
  const submitHandler = signup ? onSignUp : onSignIn

  function changeMode(next) {
    if (busyRef.current) return
    setMode(next)
    setNotice(null)
    setShowPassword(false)
    if (passwordRef.current) passwordRef.current.value = ''
    onModeChange?.(next)
  }

  async function run(action, handler, payload, fallbackMessage) {
    if (busyRef.current || typeof handler !== 'function') return

    busyRef.current = true
    setPending(action)
    setNotice(null)

    try {
      const result = await handler(payload)

      if (result?.error) throw result.error

      const message = result?.message || fallbackMessage
      if (message) setNotice({ type: 'success', text: message })
    } catch (error) {
      setNotice({
        type: 'error',
        text: error?.message || 'Something went wrong. Please try again.',
      })
    } finally {
      busyRef.current = false
      setPending('')
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    run(
      mode,
      submitHandler,
      {
        email: String(data.get('email')).trim(),
        password: String(data.get('password')),
        ...(signup ? {} : { keepSignedIn }),
      },
      signup
        ? 'Your request was accepted. Check your email for any confirmation steps.'
        : undefined,
    )
  }

  function handleReset() {
    if (!emailRef.current?.reportValidity()) return

    run(
      'reset',
      onForgotPassword,
      { email: emailRef.current.value.trim() },
      'If an account exists for this email, you’ll receive reset instructions.',
    )
  }

  function handleTabKey(event, index) {
    let next

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      next = 1 - index
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = 1
    } else {
      return
    }

    event.preventDefault()
    changeMode(next === 0 ? 'signin' : 'signup')
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="paw-auth" dir="ltr">
      <div className="paw-scene" aria-hidden="true" />

      <header className="paw-header">
        <a className="paw-logo" href={links.home || '/'}>
          PawLink
        </a>

        <nav className="paw-nav" aria-label="Main navigation">
          {[
            ['Product', links.product],
            ['Technology', links.technology],
            ['Our Story', links.story],
            ['Support', links.support],
          ].map(([label, href]) =>
            href ? (
              <a key={label} href={href}>
                {label}
              </a>
            ) : (
              <span key={label}>{label}</span>
            ),
          )}
        </nav>

        <div className="paw-header__actions">
          <span className="paw-language" aria-label="Language: English">
            EN
          </span>

          <button
            className="paw-start"
            type="button"
            disabled={busy}
            onClick={() => {
              changeMode('signup')
              emailRef.current?.focus()
            }}
          >
            Get Started
          </button>
        </div>
      </header>

      <main className="paw-main">
        <section className="paw-hero" aria-labelledby="paw-headline">
          <p className="paw-eyebrow">Health · Safety · Freedom · Together</p>

          <h1 id="paw-headline">
            A more
            <br />
            attentive
            <br />
            <em>tomorrow.</em>
          </h1>

          <div className="paw-hero__description">
            <span className="paw-rule" />
            <p>
              Real connections.
              <br />
              Happier days.
            </p>
          </div>
        </section>

        <section className="paw-card" aria-label="Your PawLink account">
          <div className="paw-tabs" role="tablist" aria-label="Account access">
            {[
              ['signin', 'Sign In'],
              ['signup', 'Create Account'],
            ].map(([value, label], index) => (
              <button
                key={value}
                ref={(element) => {
                  tabRefs.current[index] = element
                }}
                id={`paw-tab-${value}`}
                type="button"
                role="tab"
                aria-selected={mode === value}
                aria-controls="paw-auth-panel"
                tabIndex={mode === value ? 0 : -1}
                disabled={busy}
                onClick={() => changeMode(value)}
                onKeyDown={(event) => handleTabKey(event, index)}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            id="paw-auth-panel"
            role="tabpanel"
            aria-labelledby={`paw-tab-${mode}`}
            aria-busy={busy}
          >
            <div className="paw-card__heading">
              <h2>{signup ? 'A New Beginning' : 'Welcome Back'}</h2>
              <p>
                {signup
                  ? 'A better tomorrow starts here.'
                  : 'Good to see you again.'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <fieldset className="paw-fields" disabled={busy}>
                <legend className="paw-sr-only">
                  {signup ? 'Create your account' : 'Sign in to your account'}
                </legend>

                <label className="paw-field">
                  <span className="paw-sr-only">Email address</span>
                  <Icon name="email" />
                  <input
                    ref={emailRef}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email address"
                    required
                    spellCheck={false}
                    autoCapitalize="none"
                  />
                </label>

                <label className="paw-field">
                  <span className="paw-sr-only">Password</span>
                  <Icon name="lock" />

                  <input
                    ref={passwordRef}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={signup ? 'new-password' : 'current-password'}
                    placeholder="Password"
                    required
                  />

                  <button
                    className="paw-password-toggle"
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    <Icon name="eye" />
                  </button>
                </label>

                {!signup && (
                  <div className="paw-options">
                    <label className="paw-checkbox">
                      <input
                        type="checkbox"
                        checked={keepSignedIn}
                        onChange={(event) =>
                          setKeepSignedIn(event.target.checked)
                        }
                      />
                      <span>Keep me signed in</span>
                    </label>

                    <button
                      className="paw-text-button"
                      type="button"
                      disabled={!onForgotPassword}
                      onClick={handleReset}
                    >
                      {pending === 'reset' ? 'Sending…' : 'Forgot password?'}
                    </button>
                  </div>
                )}

                <button
                  className="paw-primary"
                  type="submit"
                  disabled={!submitHandler}
                >
                  <span>
                    {pending === mode
                      ? signup
                        ? 'Creating account…'
                        : 'Signing in…'
                      : signup
                        ? 'Create Account'
                        : 'Sign In'}
                  </span>
                  <Icon name="arrow" />
                </button>
              </fieldset>

              <div className="paw-feedback" aria-live="polite" aria-atomic="true">
                {notice && (
                  <p
                    className={`paw-notice paw-notice--${notice.type}`}
                    role={notice.type === 'error' ? 'alert' : undefined}
                  >
                    {notice.text}
                  </p>
                )}
              </div>
            </form>

            <div className="paw-divider">
              <span />
              <p>or continue with</p>
              <span />
            </div>

            <div className="paw-socials">
              <button
                type="button"
                disabled={busy || !onOAuth}
                onClick={() => run('apple', onOAuth, 'apple')}
              >
                <AppleIcon />
                <span>{pending === 'apple' ? 'Connecting…' : 'Apple'}</span>
              </button>

              <button
                type="button"
                disabled={busy || !onOAuth}
                onClick={() => run('google', onOAuth, 'google')}
              >
                <GoogleIcon />
                <span>{pending === 'google' ? 'Connecting…' : 'Google'}</span>
              </button>
            </div>

            <p className="paw-card__footer">
              {signup ? 'Already part of PawLink?' : 'New to PawLink?'}{' '}
              <button
                className="paw-text-button"
                type="button"
                disabled={busy}
                onClick={() => changeMode(signup ? 'signin' : 'signup')}
              >
                {signup ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </div>
        </section>

        <aside className="paw-side-note" aria-hidden="true">
          Same
          <br />
          love.
          <br />
          More
          <br />
          adventures.
          <span />
        </aside>
      </main>

      <footer className="paw-footer">
        <small>© {new Date().getFullYear()} PawLink. All rights reserved.</small>
        <span aria-hidden="true">01 / 03</span>
      </footer>
    </div>
  )
}
