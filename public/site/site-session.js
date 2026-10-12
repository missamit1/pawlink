

(() => {
  function readSession() {
    try {
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i)
        if (!key || !key.includes('-auth-token')) continue
        const raw = localStorage.getItem(key)
        if (!raw) continue
        const data = JSON.parse(raw)
        const token =
          data?.access_token ||
          data?.currentSession?.access_token ||
          data?.session?.access_token
        if (token) return true
      }
    } catch {
      
    }
    return false
  }

  function setLink(el, { href, label, html }) {
    if (!el) return
    el.href = href
    if (html != null) el.innerHTML = html
    else if (label != null) el.textContent = label
  }

  function applySignedIn() {
    document.documentElement.dataset.pawlinkSession = 'in'

    document.querySelectorAll('a.navlink-login').forEach((el) => {
      setLink(el, {
        href: '/my-dogs',
        html: 'Open app <span>↗</span>',
      })
      el.classList.add('navlink-open-app')
    })

    document.querySelectorAll('a.masthead-login').forEach((el) => {
      setLink(el, { href: '/my-dogs', label: 'Open app ↗' })
    })

    document.querySelectorAll('a.pl-app-login').forEach((el) => {
      setLink(el, {
        href: '/my-dogs',
        html: 'Enter your world <span>↗</span>',
      })
      el.classList.add('pl-app-open')
    })

    document.querySelectorAll('a.pl-app-signup').forEach((el) => {
      el.hidden = true
    })

    document.querySelectorAll('.pl-app-gate-note').forEach((el) => {
      el.textContent = 'Welcome back. Your dogs and Dashboard are ready when you are.'
    })

    
    document.querySelectorAll('a[href="/login"]').forEach((el) => {
      if (el.classList.contains('navlink-login')) return
      if (el.classList.contains('pl-app-login')) return
      if (el.classList.contains('masthead-login')) return
      if (el.classList.contains('pl-finale-login')) return
      const text = (el.textContent || '').trim().toUpperCase()
      if (text === 'LOG IN' || text === 'LOG IN ↗') {
        setLink(el, { href: '/my-dogs', label: 'OPEN APP ↗' })
      }
    })

    document.querySelectorAll('a.pl-finale-login').forEach((el) => {
      setLink(el, { href: '/my-dogs', label: 'Open app ↗' })
    })
  }

  function enhanceLateLinks() {
    if (document.documentElement.dataset.pawlinkSession !== 'in') return
    const join = document.querySelector('#pl-route a.pl-route-join')
    if (join && join.dataset.pawlinkOpenApp !== '1') {
      join.href = '/my-dogs'
      join.innerHTML = 'Open app<span>07 / ENTER ↗</span>'
      join.dataset.pawlinkOpenApp = '1'
    }
    document.querySelectorAll('a.pl-finale-login').forEach((el) => {
      if (el.dataset.pawlinkOpenApp === '1') return
      el.href = '/my-dogs'
      el.textContent = 'Open app ↗'
      el.dataset.pawlinkOpenApp = '1'
    })
  }

  function watchLateLinks() {
    const observer = new MutationObserver(() => enhanceLateLinks())
    observer.observe(document.body, { childList: true, subtree: true })
    
    setTimeout(enhanceLateLinks, 800)
    setTimeout(enhanceLateLinks, 2000)
  }

  if (readSession()) {
    applySignedIn()
    watchLateLinks()
  }
})()
