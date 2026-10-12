

export const BREED_PORTRAITS = [
  {
    key: 'dalmatian',
    breedLabel: 'Dalmatian',
    avatar: '/dogs/avatars/dalmatian.jpg',
    hero: '/dogs/heroes/dalmatian.jpg',
  },
  {
    key: 'shiba-inu',
    breedLabel: 'Shiba Inu',
    avatar: '/dogs/avatars/shiba-inu.jpg',
    hero: '/dogs/avatars/shiba-inu.jpg',
  },
  {
    key: 'dachshund',
    breedLabel: 'Dachshund',
    avatar: '/dogs/avatars/dachshund.jpg',
    hero: '/dogs/avatars/dachshund.jpg',
  },
  {
    key: 'toy-poodle',
    breedLabel: 'Toy Poodle',
    avatar: '/dogs/avatars/poodle.jpg',
    hero: '/dogs/avatars/poodle.jpg',
  },
  {
    key: 'golden-retriever',
    breedLabel: 'Golden Retriever',
    avatar: '/dogs/avatars/golden-retriever.jpg',
    hero: '/dogs/avatars/golden-retriever.jpg',
  },
]

function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

export function findPortraitForDog(dog) {
  if (!dog) return BREED_PORTRAITS[0]

  const breed = normalize(dog.breed)
  const name = normalize(dog.name)

  const match = BREED_PORTRAITS.find((portrait) => {
    const label = normalize(portrait.breedLabel)
    const key = portrait.key

    if (breed.includes(label) || breed.includes(key)) return true

    if (key === 'dalmatian' && name === 'ray') return true

    return false
  })

  return match || BREED_PORTRAITS[0]
}

export function resolveDogVisuals(dog) {
  const portrait = findPortraitForDog(dog)
  return {
    avatar: dog?.avatarUrl || portrait.avatar,
    hero: portrait.hero,
    breedLabel: dog?.breed || portrait.breedLabel,
  }
}
