

import * as THREE from 'three'

const SEGMENTS = 192
const HEIGHT_M = 52
const WALL_THICKNESS = 0.018 

export function createMembraneLayer(MercatorCoordinate, opts) {
  const {
    getHome,
    getRadiusM,
    getStretch,
    getProximity,
    getCrossing,
    getCrossingTravel,
    getRayLocal,
    getVisible = () => true,
    getAuthoring = () => false,
  } = opts

  return {
    id: 'pawlink-membrane',
    type: 'custom',
    renderingMode: '3d',

    onAdd(map, gl) {
      this.map = map
      this.MercatorCoordinate = MercatorCoordinate
      this.camera = new THREE.Camera()
      this.scene = new THREE.Scene()

      this.renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      })
      this.renderer.autoClear = false

      this.modelTransform = {
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        scale: 1,
      }

      this.uniforms = {
        uTime: { value: 0 },
        uRadius: { value: 40 },
        uStretch: { value: 0 },
        uAuthoring: { value: 0 },
        uProximity: { value: 0 },
        uCrossing: { value: 0 },
        uCrossingTravel: { value: 0 },
        uRayAngle: { value: 0 },
        uRayDist: { value: 0 },
        uIvory: { value: new THREE.Color('#f4efe6') },
        uStone: { value: new THREE.Color('#c4b8a8') },
        uBurgundy: { value: new THREE.Color('#6b2c2e') },
        uRose: { value: new THREE.Color('#c9a090') },
      }

      this.scene.add(this.buildGroundField())
      this.scene.add(this.buildPerimeterLip())
      this.scene.add(this.buildVerticalMembrane())
      this.homeGroup = this.buildHome()
      this.scene.add(this.homeGroup)
      this.scene.visible = false
    },

    buildGroundField() {
      const geo = new THREE.CircleGeometry(0.992, 96)
      geo.rotateX(-Math.PI / 2)
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: this.uniforms,
        vertexShader:  `
          uniform float uRadius;
          varying vec3 vPos;
          void main() {
            vec3 p = position;
            p.xz *= uRadius;
            vPos = p;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader:  `
          uniform float uProximity;
          uniform float uCrossing;
          uniform float uStretch;
          uniform float uAuthoring;
          uniform float uRayAngle;
          uniform float uRadius;
          uniform vec3 uStone;
          uniform vec3 uBurgundy;
          uniform vec3 uRose;
          varying vec3 vPos;

          void main() {
            float r = length(vPos.xz) / max(uRadius, 1.0);
            float ang = atan(vPos.z, vPos.x);
            float dAng = atan(sin(ang - uRayAngle), cos(ang - uRayAngle));
            float local = exp(-dAng * dAng * 7.0);
            float near = clamp(uProximity, 0.0, 1.0);
            float stretch = clamp(uStretch, 0.0, 1.0);
            float author = clamp(uAuthoring, 0.0, 1.0);

            float wash = (1.0 - smoothstep(0.15, 1.0, r)) * (0.05 + stretch * 0.04 + author * 0.04);
            wash += local * near * 0.05;
            float rim = smoothstep(0.88, 0.98, r) * (1.0 - smoothstep(0.98, 1.03, r));
            rim *= mix(0.1, 0.45, author) + local * near * 0.18 + stretch * 0.12;

            float alpha = wash + rim;
            vec3 col = mix(uStone, uRose, 0.35 + stretch * 0.15);
            col = mix(col, uBurgundy, author * 0.4 + local * near * 0.35 + stretch * 0.12);
            gl_FragColor = vec4(col, alpha);
          }
        `,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.y = 0.15
      return mesh
    },

    buildPerimeterLip() {
      
      const geo = new THREE.RingGeometry(0.965, 1.04, SEGMENTS)
      geo.rotateX(-Math.PI / 2)
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: this.uniforms,
        vertexShader:  `
          uniform float uRadius;
          varying vec3 vPos;
          void main() {
            vec3 p = position;
            p.xz *= uRadius;
            vPos = p;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader:  `
          uniform float uProximity;
          uniform float uStretch;
          uniform float uAuthoring;
          uniform float uRayAngle;
          uniform vec3 uIvory;
          uniform vec3 uRose;
          uniform vec3 uBurgundy;
          varying vec3 vPos;

          void main() {
            float ang = atan(vPos.z, vPos.x);
            float dAng = atan(sin(ang - uRayAngle), cos(ang - uRayAngle));
            float local = exp(-dAng * dAng * 8.0);
            float near = clamp(uProximity, 0.0, 1.0);
            float stretch = clamp(uStretch, 0.0, 1.0);
            float author = clamp(uAuthoring, 0.0, 1.0);

            float base = mix(0.28, 0.88, author) + stretch * 0.12;
            float alpha = base + local * near * 0.25;
            vec3 col = mix(uIvory, uRose, 0.35 + stretch * 0.15);
            col = mix(col, uBurgundy, author * 0.75 + local * near * 0.25 + stretch * 0.15);
            gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.95));
          }
        `,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.y = 0.45
      return mesh
    },

    buildVerticalMembrane() {
      const positions = []
      const angles = []
      const uvs = []
      const indices = []
      const rIn = 1 - WALL_THICKNESS * 0.5
      const rOut = 1 + WALL_THICKNESS * 0.5

      for (let i = 0; i <= SEGMENTS; i += 1) {
        const t = i / SEGMENTS
        const a = t * Math.PI * 2
        const organic =
          1 + 0.028 * Math.sin(a * 3.0) + 0.015 * Math.cos(a * 5.0 + 0.6)
        const xi = Math.cos(a) * rIn * organic
        const zi = Math.sin(a) * rIn * organic
        const xo = Math.cos(a) * rOut * organic
        const zo = Math.sin(a) * rOut * organic
        positions.push(xi, 0, zi, xi, HEIGHT_M, zi, xo, 0, zo, xo, HEIGHT_M, zo)
        angles.push(a, a, a, a)
        uvs.push(t, 0, t, 1, t, 0, t, 1)
      }

      for (let i = 0; i < SEGMENTS; i += 1) {
        const b = i * 4
        const n = b + 4
        indices.push(b, b + 1, n, b + 1, n + 1, n)
        indices.push(b + 2, n + 2, b + 3, b + 3, n + 2, n + 3)
        indices.push(b + 1, b + 3, n + 1, b + 3, n + 3, n + 1)
        indices.push(b, n, b + 2, b + 2, n, n + 2)
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
      geo.setAttribute('aAngle', new THREE.Float32BufferAttribute(angles, 1))
      geo.setIndex(indices)

      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: this.uniforms,
        vertexShader:  `
          attribute float aAngle;
          uniform float uTime;
          uniform float uRadius;
          uniform float uStretch;
          uniform float uProximity;
          uniform float uCrossing;
          uniform float uCrossingTravel;
          uniform float uRayAngle;
          varying vec2 vUv;
          varying float vLocal;
          varying float vWave;
          varying float vStretch;

          void main() {
            vUv = uv;
            float near = clamp(uProximity, 0.0, 1.0);
            float cross = clamp(uCrossing, 0.0, 1.0);
            float stretch = clamp(uStretch, 0.0, 1.0);
            vStretch = stretch;

            float dAng = atan(sin(aAngle - uRayAngle), cos(aAngle - uRayAngle));
            float local = exp(-dAng * dAng * 6.5);
            vLocal = local;

            float waveAng = uRayAngle + uCrossingTravel * 6.2831853;
            float dWave = atan(sin(aAngle - waveAng), cos(aAngle - waveAng));
            float wave = exp(-dWave * dWave * 28.0) * cross;
            vWave = wave;

            float heightScale =
              0.7 +
              stretch * 0.55 +
              local * near * 0.55 +
              wave * 0.45;

            vec3 p = position;
            p.xz *= uRadius;
            p.y *= heightScale;

            float radial = length(p.xz);
            if (radial > 0.001) {
              vec2 dir = p.xz / radial;
              float breathe =
                sin(uTime * (1.8 + stretch * 3.5 + near * 2.0) + aAngle * 10.0) *
                (stretch * 3.2 + local * near * 2.0);
              float swell = wave * 5.5;
              float groundBias = 1.0 - uv.y * 0.5;
              p.xz += dir * (breathe + swell) * groundBias;
            }

            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader:  `
          uniform float uProximity;
          uniform vec3 uIvory;
          uniform vec3 uStone;
          uniform vec3 uRose;
          uniform vec3 uBurgundy;
          varying vec2 vUv;
          varying float vLocal;
          varying float vWave;
          varying float vStretch;

          void main() {
            float near = clamp(uProximity, 0.0, 1.0);
            float stretch = clamp(vStretch, 0.0, 1.0);

            float groundLip = exp(-pow((vUv.y - 0.03) / 0.055, 2.0));
            float body = pow(1.0 - vUv.y, 1.25);
            float air = 1.0 - smoothstep(0.45, 1.0, vUv.y);

            float quiet = groundLip * 0.4 + body * 0.17 * air;
            float tension =
              (vLocal * near + stretch * 0.85) *
              (groundLip * 0.35 + body * 0.26 * air);
            float strike = vWave * (0.45 * (1.0 - vUv.y) + groundLip * 0.25);

            float alpha = clamp(quiet + tension + strike, 0.0, 0.85);

            vec3 col = mix(uStone, uRose, 0.4 + stretch * 0.2);
            col = mix(col, uIvory, groundLip * 0.25);
            col = mix(col, uBurgundy, vLocal * near * 0.35 + stretch * 0.2 + vWave * 0.3);

            gl_FragColor = vec4(col, alpha);
          }
        `,
      })

      return new THREE.Mesh(geo, mat)
    },

    buildHome() {
      const g = new THREE.Group()
      
      
      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(7.5, 40),
        new THREE.MeshBasicMaterial({
          color: '#f4efe6',
          transparent: true,
          opacity: 0.94,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      )
      disc.rotation.x = -Math.PI / 2
      disc.position.y = 0.5
      g.add(disc)

      const ring = new THREE.Mesh(
        (() => {
          const geo = new THREE.RingGeometry(7.5, 9.6, 48)
          geo.rotateX(-Math.PI / 2)
          return geo
        })(),
        new THREE.MeshBasicMaterial({
          color: '#b8897a',
          transparent: true,
          opacity: 0.88,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      )
      ring.position.y = 0.55
      g.add(ring)

      const gem = new THREE.Mesh(
        new THREE.SphereGeometry(3.4, 24, 24),
        new THREE.MeshBasicMaterial({
          color: '#6b2c2e',
          transparent: true,
          opacity: 0.95,
        }),
      )
      gem.position.y = 4.2
      g.add(gem)
      return g
    },

    updateOrigin(home) {
      if (!home) return
      const origin = this.MercatorCoordinate.fromLngLat(
        { lng: home.lng, lat: home.lat },
        0,
      )
      this.modelTransform = {
        translateX: origin.x,
        translateY: origin.y,
        translateZ: origin.z,
        scale: origin.meterInMercatorCoordinateUnits,
      }
    },

    render(_gl, args) {
      const visible = getVisible()
      this.scene.visible = visible
      if (!visible) {
        this.map.triggerRepaint()
        return
      }

      const home = getHome()
      this.updateOrigin(home)

      const ray = getRayLocal()
      this.uniforms.uTime.value = performance.now() * 0.001
      this.uniforms.uRadius.value = Math.max(1, getRadiusM())
      this.uniforms.uStretch.value = getStretch()
      this.uniforms.uAuthoring.value = getAuthoring() ? 1 : 0
      this.uniforms.uProximity.value = getProximity()
      this.uniforms.uCrossing.value = getCrossing()
      this.uniforms.uCrossingTravel.value = getCrossingTravel()
      this.uniforms.uRayAngle.value = ray.angle
      this.uniforms.uRayDist.value = Math.hypot(ray.east, ray.north)

      const mt = this.modelTransform
      const rotationX = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        Math.PI / 2,
      )

      const l = new THREE.Matrix4()
        .makeTranslation(mt.translateX, mt.translateY, mt.translateZ)
        .scale(new THREE.Vector3(mt.scale, -mt.scale, mt.scale))
        .multiply(rotationX)

      const m = new THREE.Matrix4().fromArray(args.defaultProjectionData.mainMatrix)
      this.camera.projectionMatrix = m.multiply(l)

      this.renderer.resetState()
      this.renderer.render(this.scene, this.camera)
      this.map.triggerRepaint()
    },
  }
}
