<script setup lang="ts">
import { computed } from 'vue'
import { formatPageTitle, type SeoDocumentData } from '~/composables/usePageSeo'
import { components } from '~/slices'
import { DOCTOR_UID_ALIASES, doctors } from '~/data/doctors'

const prismic = usePrismic()
const route = useRoute()
const uid = computed(() => {
  try {
    return decodeURIComponent(String(route.params.uid || ''))
  } catch {
    return String(route.params.uid || '')
  }
})
const prismicUid = computed(() => DOCTOR_UID_ALIASES[uid.value] || uid.value)
const stub = computed(() => doctors[uid.value] || doctors[prismicUid.value])

const { data: page } = useAsyncData(() => `bio-${prismicUid.value}`, async () => {
  try {
    return await prismic.client.getByUID('bio', prismicUid.value)
  } catch {
    return null
  }
})
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
const hasSlices = computed(() => Boolean(page.value?.data.slices?.length))

usePageSeo({
  title,
  description,
  image,
})
</script>


<template>
  <SliceZone
    v-if="hasSlices"
    wrapper="main"
    class="slice-zone"
    :slices="page?.data.slices ?? []"
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
