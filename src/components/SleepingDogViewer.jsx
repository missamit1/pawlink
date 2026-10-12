import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  OrbitControls,
  useGLTF,
  useAnimations
} from '@react-three/drei'
import { LoopRepeat } from 'three'
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js'
import './SleepingDogViewer.css'

const MODELS = {
  sleeping: '/models/dalmatian-sleeping-breath.glb',
  resting: '/models/dalmatian-resting-breath.glb',
  walking: '/models/dalmatian-walk.glb'
}

const WALK_CAMERA_KEY = 'pawlink-walk-camera'

const VIEW = {
  sleeping: {
    position: [0.2, 0.82, 2.4],
    target: [0, 0.21, 0],
    scale: 1.35,
    yaw: 0,
    fov: 30
  },
  resting: {
    position: [0.2, 0.82, 2.4],
    target: [0, 0.21, 0],
    scale: 1.35,
    yaw: 0,
    fov: 30
  },
  walking: {
    position: [2.2, 1.35, 2.4],
    target: [0, 0.45, 0],
    scale: 1.1,
    yaw: 0,
    fov: 30,
    allowOrbit: true
  }
}

function loadWalkCamera() {
  try {
    const raw = localStorage.getItem(WALK_CAMERA_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function pickModelState(status) {
  if (status === 'sleeping') return 'sleeping'
  if (status === 'resting') return 'resting'
  
  if (status === 'walking' || status === 'running') return 'walking'
  return 'resting'
}

function CameraCapture({ positionRef }) {
  const { camera } = useThree()
  useFrame(() => {
    positionRef.current = [
      camera.position.x,
      camera.position.y,
      camera.position.z
    ]
  })
  return null
}

function TwinDalmatian({ modelUrl, scale, yaw = 0 }) {
  const group = useRef(null)
  const { scene, animations } = useGLTF(modelUrl)
  const cloned = useMemo(() => cloneSkinned(scene), [scene])
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const names = Object.keys(actions)
    if (names.length === 0) return undefined

    const walkName = names.find((name) => name.toLowerCase().includes('walk'))
    const action = actions[walkName ?? names[0]]
    action.reset().fadeIn(0.4).play()
    action.setLoop(LoopRepeat, Infinity)

    return () => {
      action.fadeOut(0.3)
    }
  }, [actions, modelUrl])

  return (
    <group ref={group} scale={scale} rotation={[0, yaw, 0]}>
      <primitive object={cloned} />
    </group>
  )
}

function SleepingDogViewer({ dogName = 'Ray', status = 'sleeping' }) {
  const modelState = pickModelState(status)
  const modelUrl = MODELS[modelState]
  const view = VIEW[modelState]
  const isWalking = modelState === 'walking'

  const savedWalk = useMemo(() => loadWalkCamera(), [])
  const positionRef = useRef(savedWalk?.position ?? view.position)
  const [walkLocked, setWalkLocked] = useState(Boolean(savedWalk?.position))
  const [walkPosition, setWalkPosition] = useState(
    savedWalk?.position ?? view.position
  )

  const canOrbit = isWalking && view.allowOrbit && !walkLocked
  const cameraPosition = isWalking ? walkPosition : view.position

  function lockWalkAngle() {
    const position = positionRef.current ?? walkPosition
    localStorage.setItem(
      WALK_CAMERA_KEY,
      JSON.stringify({ position, target: view.target })
    )
    setWalkPosition(position)
    setWalkLocked(true)
  }

  function unlockWalkAngle() {
    localStorage.removeItem(WALK_CAMERA_KEY)
    setWalkLocked(false)
  }

  return (
    <section className="sleeping-dog-viewer">
      <h2>Digital Twin</h2>
      <p className="sleeping-dog-viewer__label">
        {dogName} the dog · status: {status}
      </p>

      {isWalking && (
        <div className="sleeping-dog-viewer__actions">
          {canOrbit && (
            <button type="button" onClick={lockWalkAngle}>
              Lock this angle
            </button>
          )}
          {walkLocked && (
            <button type="button" onClick={unlockWalkAngle}>
              Unlock angle
            </button>
          )}
        </div>
      )}

      <div className="sleeping-dog-viewer__stage">
        <Canvas
          key={`${modelState}-${walkLocked ? 'locked' : 'orbit'}`}
          camera={{ position: cameraPosition, fov: view.fov ?? 30 }}
          onCreated={({ camera }) => {
            camera.lookAt(...view.target)
          }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[2, 5, 3]} intensity={1.25} />
          <hemisphereLight intensity={0.4} groundColor="#e8e4de" />

          <TwinDalmatian
            modelUrl={modelUrl}
            scale={view.scale}
            yaw={view.yaw ?? 0}
          />

          {isWalking && (
            <ContactShadows
              position={[0, 0.01, 0]}
              opacity={0.4}
              scale={12}
              blur={2.2}
              far={5}
            />
          )}

          {canOrbit && (
            <>
              <CameraCapture positionRef={positionRef} />
              <OrbitControls
                target={view.target}
                enablePan={false}
                minDistance={2}
                maxDistance={6}
                maxPolarAngle={Math.PI / 2.05}
              />
            </>
          )}
        </Canvas>
      </div>
    </section>
  )
}

useGLTF.preload(MODELS.sleeping)
useGLTF.preload(MODELS.resting)
useGLTF.preload(MODELS.walking)

export default SleepingDogViewer
