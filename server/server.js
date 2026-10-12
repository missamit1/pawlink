import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import {
  SAFE_ZONE_CENTER_LAT,
  SAFE_ZONE_CENTER_LNG,
  SAFE_ZONE_RADIUS,
} from '../safeZoneConfig.js'
import { isUuid, loadRootEnv } from '../lib/loadRootEnv.js'
import { startLiveCollar } from '../simulator/simulator.js'

loadRootEnv(import.meta.url)

export const app = express()
const PORT = Number(process.env.PORT) || 3001

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
)

app.use(express.json())

function distanceFromCenter(latitude, longitude, centerLat, centerLng) {
  const latDiff = latitude - centerLat
  const lngDiff = longitude - centerLng
  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff)
}

function resolveDogId(raw) {
  if (raw == null || raw === '') return null
  const id = String(raw).trim()
  return isUuid(id) ? id : null
}

function mean(rows, field) {
  if (!rows?.length) return null
  const sum = rows.reduce((acc, row) => acc + Number(row[field] || 0), 0)
  return sum / rows.length
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'pawlink' })
})

app.get('/api/dogs', async (req, res) => {
  const owner_user_id = String(req.query.owner_user_id || '').trim()
  if (!isUuid(owner_user_id)) {
    return res.status(400).json({ error: 'Invalid owner_user_id' })
  }

  const { data, error } = await supabase
    .from('dogs')
    .select('id, name, breed, sex, avatar_url, model_url, owner_user_id')
    .eq('owner_user_id', owner_user_id)

  if (error) {
    return res.status(500).json({
      error: 'Failed to load dogs for owner',
      details: error.message,
    })
  }

  res.json(data ?? [])
})

app.post('/api/dogs', async (req, res) => {
  const name = String(req.body?.name || '').trim()
  const owner_user_id = String(req.body?.owner_user_id || '').trim()
  const breed =
    req.body?.breed == null ? null : String(req.body.breed).trim() || null
  const avatar_url =
    req.body?.avatar_url == null
      ? null
      : String(req.body.avatar_url).trim() || null

  if (!name) {
    return res.status(400).json({ error: 'name is required' })
  }
  if (!isUuid(owner_user_id)) {
    return res.status(400).json({ error: 'Invalid owner_user_id' })
  }

  const { data: latestLegacy, error: legacyError } = await supabase
    .from('dogs')
    .select('legacy_bigint_id')
    .order('legacy_bigint_id', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (legacyError) {
    return res.status(500).json({
      error: 'Failed to allocate legacy_bigint_id',
      details: legacyError.message,
    })
  }

  const legacy_bigint_id = Number(latestLegacy?.legacy_bigint_id || 0) + 1

  const row = {
    name,
    owner_user_id,
    breed,
    avatar_url,
    legacy_bigint_id,
  }

  const { data, error } = await supabase
    .from('dogs')
    .insert(row)
    .select('id, name, breed, sex, avatar_url, model_url, owner_user_id')
    .maybeSingle()

  if (error) {
    return res.status(500).json({
      error: 'Failed to create dog',
      details: error.message,
    })
  }

  res.status(201).json(data)
})

app.get('/api/dogs/:id', async (req, res) => {
  const dog_id = resolveDogId(req.params.id)
  if (!dog_id) {
    return res.status(400).json({ error: 'Invalid dog id' })
  }

  const { data, error } = await supabase
    .from('dogs')
    .select('id, name, breed, sex, avatar_url, model_url')
    .eq('id', dog_id)
    .maybeSingle()

  if (error) {
    return res.status(500).json({ error: 'Failed to load dog', details: error.message })
  }
  if (!data) {
    return res.status(404).json({ error: 'Dog not found', dog_id })
  }

  res.json(data)
})

app.post('/api/telemetry', async (req, res) => {
  console.log(req.body)

  const {
    dog_id: rawDogId,
    heart_rate,
    activity,
    temperature,
    activity_state,
    hydration,
    latitude,
    longitude,
  } = req.body

  const dog_id = resolveDogId(rawDogId)
  if (!dog_id) {
    return res.status(400).json({
      error: 'Missing or invalid dog_id. Every telemetry row must belong to a dog.',
    })
  }

  if (
    heart_rate === undefined ||
    activity === undefined ||
    temperature === undefined
  ) {
    return res.status(400).json({
      error: 'Missing telemetry data',
    })
  }

  const { data: history, error: historyError } = await supabase
    .from('telemetry')
    .select('heart_rate, activity, temperature')
    .eq('dog_id', dog_id)

  if (historyError) {
    console.log('HISTORY ERROR:', historyError)
    return res.status(500).json({ error: 'Failed to load dog telemetry history' })
  }

  const rows = history ?? []
  const heartRateBaseline = mean(rows, 'heart_rate')
  const activityBaseline = mean(rows, 'activity')
  const temperatureBaseline = mean(rows, 'temperature')

  
  const ALERT_COOLDOWN_MS = {
    heart_rate: 2 * 60 * 1000,
    activity: 2 * 60 * 1000,
    temperature: 5 * 60 * 1000,
    safe_zone: 3 * 60 * 1000,
  }

  async function recentlyAlerted(anomaly_type) {
    const cooldown = ALERT_COOLDOWN_MS[anomaly_type] ?? 2 * 60 * 1000
    const since = new Date(Date.now() - cooldown).toISOString()
    const { data, error } = await supabase
      .from('alerts')
      .select('id')
      .eq('dog_id', dog_id)
      .eq('anomaly_type', anomaly_type)
      .gte('created_at', since)
      .limit(1)
    if (error) {
      console.log('ALERT COOLDOWN CHECK ERROR:', error.message)
      return false
    }
    return Boolean(data?.length)
  }

  async function insertAlert(payload) {
    if (await recentlyAlerted(payload.anomaly_type)) {
      console.log('ALERT COOLDOWN SKIP:', payload.anomaly_type)
      return
    }
    const { error } = await supabase.from('alerts').insert([
      {
        ...payload,
        dog_id,
      },
    ])
    if (error) console.log('ALERT INSERT ERROR:', error)
  }

  if (heartRateBaseline != null) {
    const heartRateDistance = Math.abs(heart_rate - heartRateBaseline)
    console.log('HEART RATE DISTANCE:', heartRateDistance)
    if (heartRateDistance > 20) {
      await insertAlert({
        anomaly_type: 'heart_rate',
        value: heart_rate,
        baseline: heartRateBaseline,
        severity: heartRateDistance > 40 ? 'Significant' : 'Attention',
      })
    }
  }

  if (activityBaseline != null) {
    const activityDistance = Math.abs(activity - activityBaseline)
    console.log('ACTIVITY DISTANCE:', activityDistance)
    if (activityDistance > 80) {
      await insertAlert({
        anomaly_type: 'activity',
        value: activity,
        baseline: activityBaseline,
        severity: activityDistance > 160 ? 'Significant' : 'Attention',
      })
    }
  }

  if (temperatureBaseline != null) {
    const temperatureDistance = Math.abs(temperature - temperatureBaseline)
    console.log('TEMPERATURE DISTANCE:', temperatureDistance)
    if (temperatureDistance > 1) {
      await insertAlert({
        anomaly_type: 'temperature',
        value: temperature,
        baseline: temperatureBaseline,
        severity: temperatureDistance > 2 ? 'Significant' : 'Attention',
      })
    }
  }

  if (latitude !== undefined && longitude !== undefined) {
    const { data: zones } = await supabase
      .from('safe_zone')
      .select('center_lat, center_lng, radius')
      .eq('dog_id', dog_id)
      .order('created_at', { ascending: false })
      .limit(1)

    const zone = zones?.[0]
    const centerLat = zone?.center_lat ?? SAFE_ZONE_CENTER_LAT
    const centerLng = zone?.center_lng ?? SAFE_ZONE_CENTER_LNG
    const radius = zone?.radius ?? SAFE_ZONE_RADIUS

    const distance = distanceFromCenter(
      latitude,
      longitude,
      centerLat,
      centerLng,
    )
    console.log('SAFE ZONE DISTANCE:', distance)

    const isOutside = distance > radius
    
    if (isOutside) {
      const { data: prevRows } = await supabase
        .from('telemetry')
        .select('latitude, longitude')
        .eq('dog_id', dog_id)
        .order('created_at', { ascending: false })
        .limit(1)
      const prev = prevRows?.[0]
      const wasOutside =
        Number.isFinite(prev?.latitude) && Number.isFinite(prev?.longitude)
          ? distanceFromCenter(
              prev.latitude,
              prev.longitude,
              centerLat,
              centerLng,
            ) > radius
          : false

      if (!wasOutside) {
        await insertAlert({
          anomaly_type: 'safe_zone',
          value: distance,
          baseline: radius,
          severity: 'Attention',
        })
      } else {
        console.log('SAFE ZONE SKIP: still outside')
      }
    }
  }

  const { data, error } = await supabase.from('telemetry').insert([
    {
      dog_id,
      heart_rate,
      activity,
      temperature,
      activity_state,
      hydration,
      latitude,
      longitude,
    },
  ])

  console.log('SUPABASE DATA:', data)
  console.log('SUPABASE ERROR:', error)

  if (error) {
    return res.status(500).json({
      error: 'Telemetry insert failed',
      details: error.message,
    })
  }

  res.json({
    message: 'Telemetry received',
    dog_id,
  })
})

app.get('/api/telemetry/latest', async (req, res) => {
  const dog_id = resolveDogId(req.query.dog_id)
  if (!dog_id) {
    return res.status(400).json({
      error: 'Missing or invalid dog_id query param',
    })
  }

  const { data, error } = await supabase
    .from('telemetry')
    .select('*')
    .eq('dog_id', dog_id)
    .order('created_at', { ascending: false })
    .limit(1)

  console.log('LATEST TELEMETRY:', data)
  console.log('LATEST ERROR:', error)

  if (error) {
    return res.status(500).json({ error: 'Failed to load latest telemetry' })
  }

  res.json(data)
})

app.get('/api/safe-zone', async (req, res) => {
  const dog_id = resolveDogId(req.query.dog_id)
  if (!dog_id) {
    return res.status(400).json({
      error: 'Missing or invalid dog_id. Use GET /api/safe-zone?dog_id=<uuid>',
    })
  }

  const { data, error } = await supabase
    .from('safe_zone')
    .select('center_lat, center_lng, radius, dog_id')
    .eq('dog_id', dog_id)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    return res.status(500).json({
      error: 'Failed to load safe zone',
      details: error.message,
    })
  }

  res.json(data?.[0] ?? null)
})

app.get('/api/baseline', async (req, res) => {
  const dog_id = resolveDogId(req.query.dog_id)
  if (!dog_id) {
    return res.status(400).json({
      error: 'Missing or invalid dog_id. Use GET /api/baseline?dog_id=<uuid>',
    })
  }

  const { data, error } = await supabase
    .from('telemetry')
    .select('heart_rate, activity, temperature')
    .eq('dog_id', dog_id)

  if (error) {
    return res.status(500).json({
      error: 'Failed to calculate baseline',
    })
  }

  if (!data?.length) {
    return res.status(404).json({
      error: 'No telemetry for this dog',
      dog_id,
    })
  }

  res.json({
    dog_id,
    heart_rate: mean(data, 'heart_rate'),
    activity: mean(data, 'activity'),
    temperature: mean(data, 'temperature'),
  })
})

const isDirectRun =
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`PawLink server running on port ${PORT}`)
    startLiveCollar()
  })
}
