export const normalizePhoneDigits = (phone?: string | null) => {
  const digits = phone?.replace(/[^\d+]/g, '') || ''
  if (!digits) return undefined
  return digits.startsWith('+') ? digits : `+48${digits}`
}

export const normalizeTelHref = (phone?: string | null) => {
  const digits = normalizePhoneDigits(phone)
  return digits ? `tel:${digits}` : undefined
}
