

const DOGS_API =
  import.meta.env.VITE_PAWLINK_API_URL?.replace(/\/$/, '') || ''

export function createSelectedDog({
  id,
  name,
  breed = null,
  sex = null,
  avatarUrl = null,
  modelUrl = null,
} = {}) {
  if (!id || !name) {
    throw new Error('[PawLink] selectedDog requires id and name')
  }
  return {
    id,
    name,
    breed: breed ?? null,
    sex: sex ?? null,
    avatarUrl: avatarUrl ?? null,
    modelUrl: modelUrl ?? null,
  }
}

export function getViteDemoDogId() {
  const id = import.meta.env.VITE_DEMO_DOG_ID?.trim()
  return id || null
}

export function mapDogsRowToSelectedDog(row) {
  if (!row?.id || !row?.name) return null
  return createSelectedDog({
    id: row.id,
    name: row.name,
    breed: row.breed ?? null,
    sex: row.sex ?? null,
    avatarUrl: row.avatar_url ?? null,
    modelUrl: row.model_url ?? null,
  })
}

export async function fetchOwnedDogs(ownerUserId) {
  if (!ownerUserId) {
    return []
  }

  const res = await fetch(
    `${DOGS_API}/api/dogs?owner_user_id=${encodeURIComponent(ownerUserId)}`,
  )
  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(
      body.error ||
        `Failed to load owned dogs (${res.status}). Is the PawLink server running on 3001?`,
    )
  }

  if (!Array.isArray(body)) {
    throw new Error('Owned dogs API did not return a list')
  }

  return body
    .map(mapDogsRowToSelectedDog)
    .filter(Boolean)
}

export async function createOwnedDog({
  name,
  ownerUserId,
  breed = null,
  avatarUrl = null,
}) {
  if (!name?.trim()) {
    throw new Error('Dog name is required')
  }
  if (!ownerUserId) {
    throw new Error('ownerUserId is required')
  }

  const res = await fetch(`${DOGS_API}/api/dogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name.trim(),
      owner_user_id: ownerUserId,
      breed,
      avatar_url: avatarUrl,
    }),
  })
  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(body.error || `Failed to create dog (${res.status})`)
  }

  const dog = mapDogsRowToSelectedDog(body)
  if (!dog) {
    throw new Error('Create dog API returned an invalid dog')
  }
  return dog
}
