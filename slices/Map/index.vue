<script setup lang="ts">
import { type Content } from "@prismicio/client";
import { locations } from '~/data/locations'

const props = defineProps(
  getSliceComponentProps<Content.MapSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);

type Clinic = (typeof locations)[keyof typeof locations]
type ClinicMap = { src: string; title: string }

const CLINICS: Clinic[] = [locations.turek, locations.poddebice]

function fold(value: string) {
  let decoded = value
  try {
    decoded = decodeURIComponent(value)
  } catch {
    decoded = value
  }

  return decoded
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function polishMapsUrl(src: string) {
  let next = src
    .replace(/!1sen!2s[a-z]{2}/gi, '!1spl!2spl')
    .replace(/!5m2!1sen!2s[a-z]{2}/gi, '!5m2!1spl!2spl')
    .replace(/([?&])hl=[a-z-]{2,5}/gi, '$1hl=pl')

  if (/google\.[^/\s]*\/maps/i.test(next) && !/[?&]hl=/i.test(next)) {
    next += `${next.includes('?') ? '&' : '?'}hl=pl`
  }

  return next
}

function parseLatLng(value: string) {
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/)
  if (!match) return null
  return { lat: Number(match[1]), lng: Number(match[2]) }
}

function coordsFromEmbed(src: string) {
  const match = src.match(/!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/)
  if (!match) return null
  return { lng: Number(match[1]), lat: Number(match[2]) }
}

function near(a: number, b: number) {
  return Math.abs(a - b) < 0.01
}

function locativesFor(clinic: Clinic) {
  if (clinic.uid === 'turek') return ['turku']
  if (clinic.uid === 'poddebice') return ['poddebicach']
  return []
}

function isMapsUrl(value: string) {
  return /^https?:\/\//i.test(value) && /google\.[^\s/]*\/maps/i.test(value)
}

function titleFromName(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return 'Mapa gabinetu DentaPlus+'
  if (fold(trimmed).startsWith('mapa ')) return trimmed
  return `Mapa gabinetu ${trimmed}`
}

function embedFromUrl(raw: string, name: string): ClinicMap {
  let src = raw.trim()
  if (!/output=embed/i.test(src) && !/\/embed/i.test(src)) {
    src += `${src.includes('?') ? '&' : '?'}output=embed`
  }
  return { src: polishMapsUrl(src), title: titleFromName(name) }
}

function matchesClinic(clinic: Clinic, name: string, coordinates: string) {
  const hay = fold(`${name} ${coordinates}`).trim()
  if (!hay) return false

  const street = fold(clinic.streetAddress).replace(/^ul\.?\s+/, '')
  const needles = [
    fold(clinic.uid),
    fold(clinic.city),
    fold(clinic.addressLocality),
    street,
    fold(clinic.name),
    ...locativesFor(clinic),
  ].filter(Boolean)

  if (needles.some((needle) => hay.includes(needle))) return true
  if (coordinates.includes(clinic.mapSrc)) return true

  const trimmed = coordinates.trim()
  if (trimmed.length > 32 && clinic.mapSrc.includes(trimmed)) return true

  const placeId = clinic.mapSrc.match(/!1s(0x[0-9a-f]+:0x[0-9a-f]+)/i)
  if (placeId && coordinates.includes(placeId[1])) return true

  const parsed = parseLatLng(coordinates)
  const known = coordsFromEmbed(clinic.mapSrc)
  if (parsed && known) {
    if (near(parsed.lat, known.lat) && near(parsed.lng, known.lng)) return true
    if (near(parsed.lat, known.lng) && near(parsed.lng, known.lat)) return true
  }

  return false
}

function mapsFromSlice(name: string, coordinates: string): ClinicMap[] {
  const trimmedCoords = coordinates.trim()
  const matched = CLINICS.filter((clinic) => matchesClinic(clinic, name, trimmedCoords))

  if (matched.length === 1) {
    return [{ src: matched[0].mapSrc, title: matched[0].mapTitle }]
  }
  if (matched.length > 1) {
    return matched.map((clinic) => ({ src: clinic.mapSrc, title: clinic.mapTitle }))
  }

  if (isMapsUrl(trimmedCoords)) {
    return [embedFromUrl(trimmedCoords, name)]
  }

  const parsed = parseLatLng(trimmedCoords)
  if (parsed) {
    return [{
      src: polishMapsUrl(
        `https://maps.google.com/maps?q=${parsed.lat},${parsed.lng}&hl=pl&z=16&output=embed`,
      ),
      title: titleFromName(name),
    }]
  }

  return CLINICS.map((clinic) => ({ src: clinic.mapSrc, title: clinic.mapTitle }))
}

const maps = computed(() =>
  mapsFromSlice(props.slice.primary.name || '', props.slice.primary.coordinates || ''),
)
</script>

<template>
  <section
    id="map"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation">
    <div
      class="grid"
      :class="{ 'md:grid-cols-2': maps.length > 1 }">
      <iframe
        v-for="map in maps"
        :key="map.src"
        :src="map.src"
        :title="map.title"
        width="100%"
        height="450"
        style="border: 0"
        allowfullscreen="false"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade" />
    </div>
  </section>
</template>
