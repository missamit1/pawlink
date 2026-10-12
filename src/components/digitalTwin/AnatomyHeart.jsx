import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function AnatomyHeart({
  heartRate = 72,
  reveal = 0,
  selected = false,
  scale = 0.08
}) {
  const group = useRef(null)
  const phase = useRef(0)
  const { scene } = useGLTF('/models/anatomy/heart.glb')

  const heart = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = false
        const mat = obj.material?.clone?.() ?? new THREE.MeshStandardMaterial()
        mat.transparent = true
        mat.opacity = 0.9
        mat.emissive = new THREE.Color('#5a1520')
        mat.emissiveIntensity = 0.4
        mat.roughness = 0.45
        obj.material = mat
      }
    })
    return cloned
  }, [scene])

  useFrame((_, delta) => {
    if (!group.current) return

    const bpm = Number.isFinite(heartRate) && heartRate > 0 ? heartRate : 72
    phase.current += delta * (bpm / 60) * Math.PI * 2

    const wave = 0.5 + 0.5 * Math.sin(phase.current)
    const systole = Math.pow(wave, 2.4)
    const compress = systole * (selected ? 0.12 : 0.08)

    const t = Math.min(Math.max(reveal, 0), 1)
    const s = t < 0.05 ? 0 : scale * Math.max(t, 0.7)
    group.current.scale.set(
      s * (1 - compress * 0.55),
      s * (1 - compress),
      s * (1 - compress * 0.4)
    )
    group.current.visible = t >= 0.05
  })

  return (
    <group ref={group} position={[0.04, 0.08, 0.12]} rotation={[0.2, 0.5, -0.15]}>
      <primitive object={heart} />
    </group>
  )
}

useGLTF.preload('/models/anatomy/heart.glb')
