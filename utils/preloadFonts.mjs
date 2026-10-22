const CRITICAL_FONT = /\/_nuxt\/inter-latin(?:-ext)?-(?:400|600)-normal\.[A-Za-z0-9_-]+\.woff2/g

export function preloadCriticalFonts(html) {
  if (!html || html.includes('rel="preload" as="font"')) return html

  const unique = [...new Set(html.match(CRITICAL_FONT) || [])]
  if (!unique.length) return html

  const links = unique
    .map((href) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="${href}" fetchpriority="low">`)
    .join('')
  const imagePreload = /<link\b[^>]*rel="preload"[^>]*as="image"[^>]*>/
  if (imagePreload.test(html)) {
    return html.replace(imagePreload, (tag) => `${tag}${links}`)
  }
  return html.replace('<head>', `<head>${links}`)
}
