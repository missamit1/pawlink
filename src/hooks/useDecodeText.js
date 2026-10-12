import { useCallback, useEffect, useRef } from 'react'

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789·'

export function useDecodeText(text, { active = true, durationMs = 700 } = {}) {
  const ref = useRef(null)
  const frameRef = useRef(0)

  const play = useCallback(() => {
    const el = ref.current
    if (!el || !text) return

    cancelAnimationFrame(frameRef.current)
    const start = performance.now()
    const target = String(text)

    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs)
      const reveal = Math.floor(t * target.length)
      let out = ''
      for (let i = 0; i < target.length; i += 1) {
        if (target[i] === ' ') {
          out += ' '
        } else if (i < reveal) {
          out += target[i]
        } else {
          out += GLYPHS[(Math.random() * GLYPHS.length) | 0]
        }
      }
      el.textContent = out
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        el.textContent = target
      }
    }

    frameRef.current = requestAnimationFrame(tick)
  }, [text, durationMs])

  useEffect(() => {
    if (!ref.current) return
    if (!active) {
      ref.current.textContent = text ?? ''
      return
    }
    play()
    return () => cancelAnimationFrame(frameRef.current)
  }, [text, active, play])

  return { ref, replay: play }
}
