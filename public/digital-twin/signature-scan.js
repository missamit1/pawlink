

import * as T from 'three'

export const SIGNATURE_SCAN =
  new URLSearchParams(location.search).get('scan') === 'signature'

export function createScanSignals() {
  return {
    mode: {value: SIGNATURE_SCAN ? 1 : 0},
    plane: {value: new T.Vector4(1, 0, 0, -10)},
    discover: {value: 0},
    active: {value: 0},
  }
}

const _box = new T.Box3()
const _size = new T.Vector3()
const _heart = new T.Vector3()

export function updateScanPlane(signals, progress, dog, heart) {
  if (!SIGNATURE_SCAN || !dog) {
    signals.active.value = 0
    signals.discover.value = 0
    return
  }

  const p = T.MathUtils.clamp(progress, 0, 1)
  signals.active.value = p > 0.001 ? 1 : 0

  _box.setFromObject(dog)
  _box.getSize(_size)
  const pad = Math.max(0.06, _size.x * 0.08)
  const minX = _box.min.x - pad
  const maxX = _box.max.x + pad
  
  const eased = p * p * (3 - 2 * p)
  const planeX = T.MathUtils.lerp(minX, maxX, eased)
  signals.plane.value.set(1, 0, 0, planeX)

  if (heart) {
    heart.getWorldPosition(_heart)
    const dist = Math.abs(_heart.x - planeX)
    
    signals.discover.value =
      T.MathUtils.smoothstep(0.18, 0.0, dist) *
      T.MathUtils.smoothstep(0.2, 0.45, p) *
      (1 - T.MathUtils.smoothstep(0.85, 1.0, p))
  } else {
    signals.discover.value = 0
  }
}

export const scanGLSL = `
uniform vec4 uScanPlane;
uniform float uSignatureMode;
uniform float uScanActive;
uniform float uHeartDiscover;
varying vec3 vScanWorld;

float scanSide(vec3 worldPos){
  return dot(worldPos, uScanPlane.xyz) - uScanPlane.w;
}
float scanCut(vec3 worldPos){
  if(uSignatureMode < .5 || uScanActive < .001) return 0.;
  return smoothstep(-.006, .006, -scanSide(worldPos));
}
float scanHash(vec3 p){
  p = fract(p * vec3(.1031, .1030, .0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}
`

export const scanVertexInject = `
vScanWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
`
