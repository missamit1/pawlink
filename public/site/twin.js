(() => {
  try {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const twinCopy = {
      heart: [
        'HEART RATE',
        '96 <small>bpm</small>',
        'A heartbeat. Not just a number.',
        'Touch the heart to see the pulse. In the app, his personal history gives this reading context.',
      ],
      activity: [
        'ACTIVITY',
        '1,280 <small>steps</small>',
        'Every little adventure, reflected.',
        'The digital twin connects movement with activity. This short walking animation illustrates how that interaction could feel.',
      ],
      temperature: [
        'BODY TEMPERATURE',
        '38.4 <small>°C</small>',
        'His warmth. With context.',
        'Temperature is one of his signals. The app compares readings with his own history to help you notice meaningful changes.',
      ],
    }

    let twinMode = false
    let organ = 'heart'
    let twinLoaded = false
    let originalMaterials = []

    const dog = () => document.querySelector('#digitalDog')
    const twinScene = () => document.querySelector('.twin-scene')
    const revealTwin = () => document.querySelector('#twinReveal')

    function revealStage() {
      document.querySelector('.twin-stage')?.classList.add('is-ready')
      const loading = document.querySelector('.twin-loading')
      if (loading) loading.hidden = true
    }

    function paintTwin() {
      const d = dog()
      if (!twinLoaded || !d?.model?.materials) return
      d.model.materials.forEach((m, i) => {
        const o = originalMaterials[i]
        if (!o) return
        m.pbrMetallicRoughness.setBaseColorFactor(
          twinMode ? [0.54, 0.72, 0.61, 0.75] : o.base,
        )
        m.setEmissiveFactor(twinMode ? [0.12, 0.2, 0.14] : o.emissive)
        m.setAlphaMode(twinMode ? 'BLEND' : o.alpha)
      })
      d.shadowIntensity = twinMode ? 0.1 : 0.65
    }

    function setTwin(on) {
      twinMode = !!on
      const scene = twinScene()
      const btn = revealTwin()
      scene?.classList.toggle('is-twin', twinMode)
      btn?.setAttribute('aria-pressed', String(twinMode))
      if (btn) {
        btn.innerHTML = twinMode
          ? 'Back to the dog you know <span>↙</span>'
          : 'Meet his digital twin <span>↗</span>'
      }
      const modeLabel = document.querySelector('#twinModeLabel')
      if (modeLabel) {
        modeLabel.textContent = twinMode
          ? 'HIS DIGITAL REFLECTION'
          : 'THE DOG YOU KNOW'
      }
      ensureTwinReady()
      paintTwin()
      const d = dog()
      if (twinLoaded && d) {
        if (twinMode && organ === 'activity' && !reduce) d.play?.()
        else d.pause?.()
      }
    }

    function selectOrgan(key) {
      if (!twinCopy[key]) return
      organ = key
      setTwin(true)
      const scene = twinScene()
      if (scene) scene.dataset.activeOrgan = key
      document.querySelectorAll('[data-organ]').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.organ === key))
      })
      const c = twinCopy[key]
      const a = document.querySelector('#twinMetricLabel')
      const b = document.querySelector('#twinMetric')
      const t = document.querySelector('#twinInsightTitle')
      const p = document.querySelector('#twinInsightBody')
      if (a) a.textContent = c[0]
      if (b) b.innerHTML = c[1]
      if (t) t.textContent = c[2]
      if (p) p.textContent = c[3]
    }

    function onTwinReady() {
      const d = dog()
      if (twinLoaded || !d?.model) return
      twinLoaded = true
      revealStage()
      try {
        originalMaterials = d.model.materials.map((m) => ({
          base: [...m.pbrMetallicRoughness.baseColorFactor],
          emissive: [...m.emissiveFactor],
          alpha: m.getAlphaMode(),
        }))
        const dim = d.getDimensions()
        const c = d.getBoundingBoxCenter()
        d.updateHotspot({
          name: 'hotspot-heart',
          position: `${c.x - dim.x * 0.2} ${c.y + dim.y * 0.05} ${c.z + dim.z * 0.24}`,
          normal: '0 0 1',
        })
        d.updateHotspot({
          name: 'hotspot-legs',
          position: `${c.x + dim.x * 0.27} ${c.y - dim.y * 0.3} ${c.z + dim.z * 0.2}`,
          normal: '0 0 1',
        })
      } catch {}
      paintTwin()
    }

    function ensureTwinReady() {
      const d = dog()
      if (!d) return false
      if (d.loaded) revealStage()
      if (d.model) {
        onTwinReady()
        return true
      }
      return false
    }

        document.addEventListener(
      'click',
      (e) => {
        const btn = e.target.closest('#twinReveal')
        if (btn) {
          e.preventDefault()
          setTwin(!twinMode)
          return
        }
        const organBtn = e.target.closest('[data-organ]')
        if (organBtn && organBtn.closest('.twin-scene, .twin-interface, model-viewer')) {
          selectOrgan(organBtn.dataset.organ)
        }
      },
      true,
    )

    const scene = twinScene()
    if (scene) scene.dataset.activeOrgan = 'heart'
    revealStage()

    const d = dog()
    if (d) {
      d.addEventListener('load', ensureTwinReady)
      d.addEventListener('model-visibility', ensureTwinReady)
      d.addEventListener('error', () => {
        const err = document.querySelector('#twinError')
        if (err) err.hidden = false
        revealStage()
      })
            if (!d.loaded) {
        const src = d.getAttribute('src')
        if (src) {
          d.setAttribute('src', '')
          requestAnimationFrame(() => d.setAttribute('src', src))
        }
      }
    }

    let ticks = 0
    const poll = setInterval(() => {
      ticks += 1
      if (ensureTwinReady() || ticks > 600) clearInterval(poll)
    }, 100)

    window.setTwin = setTwin
    window.__pawlinkTwinReady = ensureTwinReady
  } catch (err) {
    console.error('[pawlink twin]', err)
    document.querySelector('.twin-stage')?.classList.add('is-ready')
  }
})()
