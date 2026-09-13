export const fullyDecode = (segment) => {
  let current = segment
  for (let i = 0; i < 5; i += 1) {
    try {
      const next = decodeURIComponent(current)
      if (next === current) break
      current = next
    } catch {
      break
    }
  }
  return current
}

export const toCanonicalUrl = (siteUrl, path) => {
  const origin = String(siteUrl || 'https://www.dentaplus.pl').replace(/\/$/, '')
  if (!path || path === '/') return `${origin}/`

  const pathname = `/${path.replace(/^\/+|\/+$/g, '')}/`
    .split('/')
    .map((segment) => (segment ? encodeURIComponent(fullyDecode(segment)) : ''))
    .join('/')

  return `${origin}${pathname}`
}
