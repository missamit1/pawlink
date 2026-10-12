

const PORTRAIT_URL = new URL('./assets/ray-presence.png', import.meta.url).href

export async function buildRayPresenceIcon() {
  const img = new Image()
  img.decoding = 'async'
  img.src = PORTRAIT_URL
  await img.decode()

  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const cx = size / 2
  const cy = size / 2
  const outerR = 56
  const ivory = 3.5
  const photoR = outerR - ivory

  
  ctx.save()
  ctx.shadowColor = 'rgba(42, 32, 24, 0.2)'
  ctx.shadowBlur = 12
  ctx.shadowOffsetY = 4
  ctx.beginPath()
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
  ctx.fillStyle = '#f4efe6'
  ctx.fill()
  ctx.restore()

  
  ctx.beginPath()
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
  ctx.fillStyle = '#f4efe6'
  ctx.fill()

  
  ctx.beginPath()
  ctx.arc(cx, cy, outerR - 0.5, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(201, 160, 144, 0.35)'
  ctx.lineWidth = 1
  ctx.stroke()

  
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, photoR, 0, Math.PI * 2)
  ctx.clip()

  
  const scale = Math.min((photoR * 2) / img.width, (photoR * 2) / img.height)
  const iw = img.width * scale
  const ih = img.height * scale
  ctx.fillStyle = '#ebe4d8'
  ctx.fillRect(cx - photoR, cy - photoR, photoR * 2, photoR * 2)
  ctx.drawImage(img, cx - iw / 2, cy - ih / 2, iw, ih)
  ctx.restore()

  return { url: canvas.toDataURL('image/png'), width: size, height: size }
}

export function presenceByZoom(zoom) {
  if (zoom < 14.7) {
    return { showPortrait: false, sizePx: 0, opacity: 0 }
  }
  if (zoom < 15.3) {
    const t = (zoom - 14.7) / 0.6
    return {
      showPortrait: true,
      sizePx: 34 + t * 14,
      opacity: 0.5 + t * 0.4,
    }
  }
  const t = Math.min(1, (zoom - 15.3) / 0.7)
  return {
    showPortrait: true,
    sizePx: 48 + t * 10,
    opacity: 0.96,
  }
}
