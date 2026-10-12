

import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function loadRootEnv(fromMetaUrl) {
  const here = dirname(fileURLToPath(fromMetaUrl))
  const candidates = [
    resolve(here, '../.env'), 
    resolve(here, '../../.env'), 
  ]
  const envPath = candidates.find((p) => existsSync(p))
  if (!envPath) return { path: candidates[0], loaded: false }

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const s = line.trim()
    if (!s || s.startsWith('#') || !s.includes('=')) continue
    const i = s.indexOf('=')
    const key = s.slice(0, i).trim()
    let val = s.slice(i + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
  return { path: envPath, loaded: true }
}

export function isUuid(value) {
  if (typeof value !== 'string') return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim(),
  )
}

export function requireDemoDogId(label = 'process') {
  const id = process.env.DEMO_DOG_ID?.trim()
  if (!id || !isUuid(id)) {
    throw new Error(
      `[PawLink] ${label}: DEMO_DOG_ID missing or invalid in .env.`,
    )
  }
  return id
}
