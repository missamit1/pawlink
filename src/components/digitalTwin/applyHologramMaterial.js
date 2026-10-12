

export function updateHologramLook(root, reveal) {
  if (!root) return

  const t = Math.min(Math.max(reveal, 0), 1)

  root.traverse((obj) => {
    if (!obj.isMesh || !obj.material) return

    const mats = Array.isArray(obj.material) ? obj.material : [obj.material]

    mats.forEach((mat) => {
      if (!mat.userData.holoBase) {
        mat.userData.holoBase = {
          color: mat.color ? mat.color.clone() : null,
          emissive: mat.emissive ? mat.emissive.clone() : null,
          opacity: mat.opacity ?? 1,
          roughness: mat.roughness ?? 0.5,
          metalness: mat.metalness ?? 0,
          transparent: mat.transparent,
          depthWrite: mat.depthWrite
        }
      }

      const base = mat.userData.holoBase

      
      if (t < 0.01) {
        if (base.color && mat.color) mat.color.copy(base.color)
        if (base.emissive && mat.emissive) {
          mat.emissive.copy(base.emissive)
          mat.emissiveIntensity = 0
        }
        mat.opacity = base.opacity
        mat.transparent = base.transparent
        mat.depthWrite = base.depthWrite
        mat.roughness = base.roughness
        mat.metalness = base.metalness
        return
      }

      
      if (mat.color && base.color) {
        mat.color.setRGB(
          base.color.r * (1 - t * 0.15) + 0.72 * t,
          base.color.g * (1 - t * 0.1) + 0.88 * t,
          base.color.b * (1 - t * 0.05) + 0.92 * t
        )
      }

      if (mat.emissive) {
        mat.emissive.setRGB(0.25 * t, 0.55 * t, 0.6 * t)
        mat.emissiveIntensity = 0.15 + t * 0.35
      }

      mat.transparent = true
      mat.depthWrite = t < 0.85
      mat.opacity = 1 - t * 0.38
      mat.roughness = Math.max(0.2, (base.roughness ?? 0.5) - t * 0.25)
      mat.metalness = Math.min(0.35, (base.metalness ?? 0) + t * 0.2)
      mat.needsUpdate = true
    })
  })
}
