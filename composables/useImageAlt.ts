export const DEFAULT_IMAGE_ALT = 'Gabinet stomatologiczny DentaPlus+ w Turku i Poddębicach'

export const withImageAlt = <T extends { url?: string | null, alt?: string | null }>(
  field: T | null | undefined,
  fallback = DEFAULT_IMAGE_ALT,
) => {
  if (!field?.url) return field
  const alt = field.alt?.trim()
  if (alt) return field
  return { ...field, alt: fallback }
}
