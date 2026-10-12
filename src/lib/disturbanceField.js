

export function createDisturbanceField({
  stageEl,
  nodes,
  onEnergy,
  onSettled,
}) {
  let waves = []
  let raf = 0
  let running = false
  let settledFired = false
  let impactAt = 0

  const SPEED = 520
  const WAVELENGTH = 90
  const DECAY = 1.25
  const SETTLE = 0.045
  const MIN_LIFE_MS = 640
  const MAX_SHIFT = 7.5
  const MAX_SKEW = 1.1

  function sample(wave, x, y, now) {
    const age = (now - wave.born) / 1000
    const energy = Math.exp(-DECAY * age)
    wave.energy = energy
    if (energy < 0.002) {
      return { h: 0, energy, nx: 0, ny: 0 }
    }

    const dx = x - wave.x
    const dy = y - wave.y
    const r = Math.hypot(dx, dy)
    const front = SPEED * age
    const dist = r - front

    const sigma = 18 + age * 10
    const envelope = Math.exp(-(dist * dist) / (2 * sigma * sigma))
    const phase = (2 * Math.PI * dist) / WAVELENGTH
    const h = Math.sin(phase) * envelope * energy

    const len = r || 1
    return { h, energy, nx: dx / len, ny: dy / len }
  }

  function applyNode(node, now) {
    const box = stageEl.getBoundingClientRect()
    const elBox = node.el.getBoundingClientRect()
    const x = elBox.left + elBox.width / 2 - box.left
    const y = elBox.top + elBox.height / 2 - box.top

    let hx = 0
    let hy = 0
    let skew = 0

    for (const wave of waves) {
      const s = sample(wave, x, y, now)
      hx += s.nx * s.h
      hy += s.ny * s.h
      skew += s.h * s.nx
    }

    const tx = hx * MAX_SHIFT
    const ty = hy * MAX_SHIFT
    const sk = skew * MAX_SKEW

    if (Math.abs(tx) < 0.05 && Math.abs(ty) < 0.05 && Math.abs(sk) < 0.02) {
      node.el.style.transform = ''
      return 0
    }

    const weight = node.weight ?? 1
    node.el.style.transform = `translate(${tx * weight}px, ${ty * weight}px) skewX(${sk * weight}deg)`
    return Math.hypot(tx, ty)
  }

  function tick(now) {
    let peak = 0
    let energy = 0

    for (const wave of waves) {
      const age = (now - wave.born) / 1000
      wave.energy = Math.exp(-DECAY * age)
      energy += wave.energy
    }

    for (const node of nodes) {
      if (!node.el?.isConnected) continue
      peak = Math.max(peak, applyNode(node, now))
    }

    onEnergy?.(energy, peak)

    waves = waves.filter((w) => w.energy > 0.012)

    const ready =
      now - impactAt >= MIN_LIFE_MS && energy < SETTLE && waves.length === 0

    if (ready) {
      for (const node of nodes) {
        if (node.el) node.el.style.transform = ''
      }
      running = false
      if (!settledFired) {
        settledFired = true
        onSettled?.()
      }
      return
    }

    raf = requestAnimationFrame(tick)
  }

  function impact({ x, y, kind = 'heart' }) {
    waves.push({ x, y, born: performance.now(), energy: 1, kind })
    impactAt = performance.now()
    settledFired = false
    if (!running) {
      running = true
      raf = requestAnimationFrame(tick)
    }
  }

  function reset() {
    cancelAnimationFrame(raf)
    running = false
    waves = []
    settledFired = false
    for (const node of nodes) {
      if (node.el) node.el.style.transform = ''
    }
  }

  function setNodes(next) {
    nodes = next
  }

  return { impact, reset, setNodes }
}
