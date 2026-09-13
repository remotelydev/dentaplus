export function portraitsFromSlices(slices) {
  if (!Array.isArray(slices)) return []

  const slice = slices.find((item) => item?.slice_type === 'portraits')
  if (!Array.isArray(slice?.items)) return []

  return slice.items.filter((item) => Boolean(item?.portrait?.url))
}

export function splitSlicesAfterFirstHero(slices) {
  if (!Array.isArray(slices)) return { before: [], after: [] }

  const heroIndex = slices.findIndex((slice) => slice?.slice_type === 'hero')
  if (heroIndex === -1) return { before: [], after: slices }

  return {
    before: slices.slice(0, heroIndex + 1),
    after: slices.slice(heroIndex + 1),
  }
}
