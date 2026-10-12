import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function AnatomyRibs({ reveal = 0, heartSelected = false, scale = 0.1 }) {
  const group = useRef(null)
  const { scene } = useGLTF('/models/anatomy/rib-cage.glb')

  const ribs = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((obj) => {
      if (obj.isMesh) {
        obj.material = new THREE.MeshStandardMaterial({
          color: '#d5e8ec',
          metalness: 0.2,
          roughness: 0.4,
          transparent: true,
          opacity: 0.35,
          emissive: new THREE.Color('#6db8c4'),
          emissiveIntensity: 0.15
        })
      }
    })
    return cloned
  }, [scene])

  useFrame(() => {
    if (!group.current) return
    const t = Math.min(Math.max(reveal, 0), 1)
    group.current.visible = t >= 0.05
    const s = t < 0.05 ? 0 : scale * Math.max(t, 0.7)
    group.current.scale.setScalar(s)

    group.current.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        obj.material.opacity = heartSelected ? 0.12 * t : 0.4 * t
        obj.material.emissiveIntensity = heartSelected ? 0.05 : 0.18 * t
      }
    })
  })

  return (
    <group ref={group} position={[0, 0.05, 0.05]} rotation={[0.08, 0, 0]}>
      <primitive object={ribs} />
    </group>
  )
}

useGLTF.preload('/models/anatomy/rib-cage.glb')
