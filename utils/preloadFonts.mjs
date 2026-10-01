const CRITICAL_FONT = /\/_nuxt\/inter-latin(?:-ext)?-(?:400|600)-normal\.[a-z0-9]+\.woff2/g

// Document → font is the network-dependency chain. Preload the files the
// first paint actually uses so they are no longer a late-discovered chain.
// Weight 500 is left for the stylesheet. Low priority keeps them behind the LCP image.
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
