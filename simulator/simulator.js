import { loadRootEnv, requireDemoDogId } from '../lib/loadRootEnv.js'

loadRootEnv(import.meta.url)

let DEMO_DOG_ID
try {
  DEMO_DOG_ID = requireDemoDogId('simulator')
  console.log('[simulator] DEMO_DOG_ID loaded (prefix)', DEMO_DOG_ID.slice(0, 8))
} catch (err) {
  console.error(err.message)
  process.exit(1)
}

// Same process as the API — use live PORT (3001 local, 8080 on Railway).
const API_PORT = Number(process.env.PORT) || 3001
const API_BASE = `http://127.0.0.1:${API_PORT}`

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Demo Day: full pose loop — walk → run (brief exit) → rest → sleep → walk…
let activityState = 'walking'

let stateStartedAt = Date.now()

// Hold times — short enough that employers see all 4 poses within ~1 minute
const HOLD_MS = {
  walking: 18 * 1000,
  running: 12 * 1000,
  resting: 16 * 1000,
  sleeping: 16 * 1000,
}

const injectAnomaly = false

// Must visit every pose — old graph was stuck on walking ↔ running only.
const allowedNext = {
  walking: ['running'],
  running: ['resting'],
  resting: ['sleeping'],
  sleeping: ['walking'],
}

let runDirLat = 1
let runDirLng = -1
let walkDirLat = 1
let walkDirLng = 1

function maybeChangeState() {
  const elapsed = Date.now() - stateStartedAt
  const holdMs = HOLD_MS[activityState] ?? 25 * 1000

  if (elapsed < holdMs) {
    return
  }

  const options = allowedNext[activityState]
  const nextState = options[0]

  if (nextState === 'running' || nextState === 'walking') {
    runDirLat = randomBetween(0, 1) === 0 ? -1 : 1
    runDirLng = randomBetween(0, 1) === 0 ? -1 : 1
    walkDirLat = runDirLat
    walkDirLng = runDirLng
  }

  activityState = nextState
  stateStartedAt = Date.now()

  // Snap toward the new state's GPS target so the map pin moves immediately
  const radius = Math.max(HOME_RADIUS_UNITS, 12)
  if (activityState === 'walking') {
    currentLatitude = HOME_LAT + walkDirLat * Math.round(radius * 0.35)
    currentLongitude = HOME_LNG + walkDirLng * Math.round(radius * 0.35)
  } else if (activityState === 'running') {
    currentLatitude = HOME_LAT + runDirLat * Math.round(radius * 1.12)
    currentLongitude = HOME_LNG + runDirLng * Math.round(radius * 1.12)
  } else {
    currentLatitude = HOME_LAT
    currentLongitude = HOME_LNG
  }

  console.log('🔄 State changed to:', activityState)
}


// טווח מספרים לכל מצב (מינימום, מקסימום)
const stateRanges = {
  sleeping: {
    heart_rate: [50, 65],
    activity: [0, 10],
    temperature: [378, 382],
    hydration: [72, 80]
  },
  resting: {
    heart_rate: [65, 85],
    activity: [0, 30],
    temperature: [380, 386],
    hydration: [70, 78]
  },
  walking: {
    heart_rate: [85, 110],
    activity: [80, 150],
    temperature: [381, 387],
    hydration: [68, 76]
  },
  running: {
    heart_rate: [110, 150],
    activity: [180, 300],
    temperature: [383, 390],
    hydration: [65, 74]
  }
}

// הערכים החיים — מתחילים בהליכה בתוך האזור
let currentHeartRate = 95
let currentActivity = 110
let currentTemperature = 383
let currentHydration = 72

// בית דמו — מתחיל בתל אביב, ואז מתעדכן מ־safe_zone שנשמר ב־SET
// יחידות × 10000 כדי להשתמש ב־takeSmallStep
// 32.0853 → 320853 | 34.7818 → 347818
let HOME_LAT = 320853
let HOME_LNG = 347818
let HOME_RADIUS_UNITS = 26
// תמיד מתחילים במרכז הבית — לא מחוץ לעיגול
let currentLatitude = HOME_LAT
let currentLongitude = HOME_LNG

function toHomeUnits(degrees) {
  return Math.round(Number(degrees) * 10000)
}

async function refreshHomeFromSafeZone() {
  const response = await fetch(
    `${API_BASE}/api/safe-zone?dog_id=${DEMO_DOG_ID}`,
  )
  if (!response.ok) return
  const zone = await response.json()
  const nextLat = toHomeUnits(zone?.center_lat)
  const nextLng = toHomeUnits(zone?.center_lng)
  if (!Number.isFinite(nextLat) || !Number.isFinite(nextLng)) return
  const nextRadius = Math.round(Number(zone.radius) * 10000)
  if (Number.isFinite(nextRadius) && nextRadius > 0) {
    HOME_RADIUS_UNITS = nextRadius
  }
  if (nextLat === HOME_LAT && nextLng === HOME_LNG) return
  const farFromNewHome =
    Math.hypot(currentLatitude - nextLat, currentLongitude - nextLng) >
    HOME_RADIUS_UNITS * 8
  HOME_LAT = nextLat
  HOME_LNG = nextLng
  if (farFromNewHome) {
    currentLatitude = HOME_LAT
    currentLongitude = HOME_LNG
  }
  console.log('🏠 Home synced from safe_zone:', HOME_LAT, HOME_LNG)
}

// צעד קטן לכיוון יעד — לא קפיצה גדולה
function takeSmallStep(current, min, max, stepSize) {
  const goal = randomBetween(min, max)

  if (current < goal) {
    return Math.min(current + stepSize, goal)
  }

  if (current > goal) {
    return Math.max(current - stepSize, goal)
  }

  return current
}

function stepToward(current, target, stepSize) {
  if (current < target) return Math.min(current + stepSize, target)
  if (current > target) return Math.max(current - stepSize, target)
  return current
}

function updateLocationForState() {
  const radius = Math.max(HOME_RADIUS_UNITS, 12)

  // Sleep / rest: settle near home center (map pin calm)
  if (activityState === 'sleeping' || activityState === 'resting') {
    currentLatitude = stepToward(currentLatitude, HOME_LAT, 5)
    currentLongitude = stepToward(currentLongitude, HOME_LNG, 5)
    return
  }

  // Walking: patrol inside so trail + pin clearly move on the live map
  if (activityState === 'walking') {
    const inside = radius * 0.55
    const targetLat = HOME_LAT + walkDirLat * inside
    const targetLng = HOME_LNG + walkDirLng * inside
    if (Math.hypot(currentLatitude - targetLat, currentLongitude - targetLng) < 4) {
      walkDirLat *= -1
      walkDirLng *= randomBetween(0, 1) === 0 ? -1 : 1
    }
    currentLatitude = stepToward(currentLatitude, targetLat, 12)
    currentLongitude = stepToward(currentLongitude, targetLng, 12)
    return
  }

  // Running: just past the boundary (safe-zone alert)
  const outside = radius * 1.12
  currentLatitude = stepToward(
    currentLatitude,
    HOME_LAT + runDirLat * outside,
    14,
  )
  currentLongitude = stepToward(
    currentLongitude,
    HOME_LNG + runDirLng * outside,
    14,
  )
}

function generateTelemetry() {
  updateLocationForState()

  const latitude = currentLatitude / 10000
  const longitude = currentLongitude / 10000

  if (injectAnomaly) {
    return {
      dog_id: DEMO_DOG_ID,
      heart_rate: 200,
      activity: 200,
      temperature: 38.5,
      activity_state: activityState,
      hydration: 55,
      latitude,
      longitude
    }
  }

  const range = stateRanges[activityState]

  currentHeartRate = takeSmallStep(
    currentHeartRate,
    range.heart_rate[0],
    range.heart_rate[1],
    5
  )

  currentActivity = takeSmallStep(
    currentActivity,
    range.activity[0],
    range.activity[1],
    20
  )

  currentTemperature = takeSmallStep(
    currentTemperature,
    range.temperature[0],
    range.temperature[1],
    1
  )

  currentHydration = takeSmallStep(
    currentHydration,
    range.hydration[0],
    range.hydration[1],
    1
  )

  return {
    dog_id: DEMO_DOG_ID,
    heart_rate: currentHeartRate,
    activity: currentActivity,
    temperature: currentTemperature / 10,
    activity_state: activityState,
    hydration: currentHydration,
    latitude,
    longitude
  }
}

async function sendTelemetry() {
  try {
    await refreshHomeFromSafeZone()
  } catch (err) {
    console.log('HOME SYNC SKIP:', err.message)
  }
  maybeChangeState()
  const telemetry = generateTelemetry()

  console.log('🐕 Sending telemetry:', telemetry)

  try {
    const response = await fetch(`${API_BASE}/api/telemetry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(telemetry)
    })

    const result = await response.json()

    console.log('📡 Server response:', result)
  } catch (err) {
    console.log('TELEMETRY SKIP:', err.message)
  }
}

let liveTimer = null

export function startLiveCollar() {
  if (liveTimer) return
  console.log('[simulator] live collar on')
  sendTelemetry()
  liveTimer = setInterval(sendTelemetry, 4000)
}

const startedDirectly = process.argv[1]?.includes('simulator.js')
if (startedDirectly) {
  startLiveCollar()
}
