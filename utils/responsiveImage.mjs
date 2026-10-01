// Build a width-capped Prismic srcset. Callers pass the widths a layout
// actually needs; the largest candidate stays at the image's own width so
// Imgix is not asked to upscale.
export function buildResponsiveImage(asImageSrc, field, { widths, cap, sizes }) {
  if (!field?.url || typeof asImageSrc !== 'function') return undefined

  const intrinsicWidth = Number(field.dimensions?.width) || 0
  const intrinsicHeight = Number(field.dimensions?.height) || 0
  if (!intrinsicWidth || !intrinsicHeight) {
    return {
      src: asImageSrc(field, { auto: ['format', 'compress'], w: cap }) || field.url,
      srcset: undefined,
      sizes: undefined,
      width: undefined,
      height: undefined,
    }
  }

  const ratio = intrinsicHeight / intrinsicWidth
  const maxWidth = Math.max(1, Math.min(cap, intrinsicWidth))
  const chosen = [...new Set(
    widths.filter((width) => width > 0 && width < maxWidth).concat(maxWidth),
  )].sort((a, b) => a - b)

  const sources = chosen.map((width) => {
    const height = Math.max(1, Math.round(width * ratio))
    const src = asImageSrc(field, {
      auto: ['format', 'compress'],
      w: width,
      h: height,
    }) || field.url
    return { width, height, src }
  })
  const largest = sources[sources.length - 1]

  return {
    src: largest.src,
    srcset: sources.map((source) => `${source.src} ${source.width}w`).join(', '),
    sizes,
    width: largest.width,
    height: largest.height,
  }
}
