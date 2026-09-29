<script setup lang="ts">
import { computed } from 'vue'
import { formatPageTitle, type SeoDocumentData } from '~/composables/usePageSeo'
import { components } from '~/slices'
import { doctors } from '~/data/doctors'
import { fullyDecode, toCanonicalUrl } from '~/utils/canonical.mjs'

const prismic = usePrismic()
const route = useRoute()
const uid = computed(() => fullyDecode(String(route.params.uid || '')))
const stub = computed(() => doctors[uid.value])

const { data: page } = await useAsyncData(`bio-${uid.value}`, async () => {
  try {
    return await prismic.client.getByUID('bio', uid.value)
  } catch {
    return null
  }
})

if (!page.value?.data && !stub.value) {
  throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono strony' })
}
const settings = useSettings()

const seoData = computed(() => page.value?.data as unknown as SeoDocumentData | undefined)
const siteTitle = computed(() => settings.value?.data.siteTitle || 'DentaPlus+')
const contentTitle = computed(() => prismic.asText(page.value?.data.title) || stub.value?.name || '')
const title = computed(() =>
  formatPageTitle({
    metaTitle: seoData.value?.meta_title,
    contentTitle: contentTitle.value,
    siteTitle: siteTitle.value,
    uid: uid.value,
    path: route.path,
  })
)
const description = computed(() =>
  seoData.value?.meta_description ||
  (stub.value ? `${stub.value.name} — ${stub.value.role} w DentaPlus+ (${stub.value.city}).` : undefined)
)
const image = computed(() => seoData.value?.meta_image?.url || undefined)
const slices = computed(() => page.value?.data?.slices ?? [])
const hasSlices = computed(() => slices.value.length > 0)
const runtimeConfig = useRuntimeConfig()

const personSchema = computed(() => {
  if (!contentTitle.value) return null
  const origin = String(runtimeConfig.public.siteUrl || 'https://www.dentaplus.pl').replace(/\/$/, '')
  return {
    '@context': 'https://schema.org',
    '@type': ['Person', 'Dentist'],
    name: contentTitle.value,
    jobTitle: stub.value?.role || 'Lekarz dentysta',
    worksFor: {
      '@type': 'Organization',
      name: 'DentaPlus+',
      url: `${origin}/`,
    },
    url: toCanonicalUrl(origin, `/zespol/${uid.value}/`),
  }
})

usePageSeo({
  title,
  description,
  image,
})

useHead({
  script: computed(() =>
    personSchema.value
      ? [{ type: 'application/ld+json', children: JSON.stringify(personSchema.value) }]
      : []
  ),
})
</script>


<template>
  <SliceZone
    v-if="hasSlices"
    wrapper="main"
    class="slice-zone"
    :slices="slices"
    :components="components"
  />
  <Bounded
    v-else-if="stub"
    as="main"
    class="slice-zone"
    y-padding="base"
  >
    <h1 class="font-semibold text-4xl md:text-5xl mb-4">{{ stub.name }}</h1>
    <p class="text-lg mb-2">{{ stub.role }}</p>
    <p class="mb-6">{{ stub.city }}</p>
    <p>{{ stub.bio }}</p>
    <p class="mt-8">
      <NuxtLink class="underline" to="/zespol/">Wszyscy lekarze DentaPlus+</NuxtLink>
    </p>
  </Bounded>
</template>

<style scoped>
.slice-zone {
  min-height: calc(100vh - 204px);
}
</style>
