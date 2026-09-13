<script setup lang="ts">
import { formatPageTitle, type SeoDocumentData } from '~/composables/usePageSeo'
import { components } from '~/slices'

const prismic = usePrismic()
const route = useRoute()
const uid = computed(() => String(route.params.uid || ''))
const { data: page } = await useAsyncData(() => `page-${uid.value}`, async () => {
  try {
    return await prismic.client.getByUID('page', uid.value || 'home')
  } catch {
    return null
  }
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono strony' })
}
const settings = useSettings()

const seoData = computed(() => page.value?.data as unknown as SeoDocumentData | undefined)
const siteTitle = computed(() => settings.value?.data.siteTitle || 'DentaPlus+')
const contentTitle = computed(() => prismic.asText(page.value?.data.title) || '')
const title = computed(() =>
  formatPageTitle({
    metaTitle: seoData.value?.meta_title,
    contentTitle: contentTitle.value,
    siteTitle: siteTitle.value,
    uid: uid.value,
    path: route.path,
  })
)
const description = computed(() => seoData.value?.meta_description || undefined)
const image = computed(() => seoData.value?.meta_image?.url || undefined)

usePageSeo({
  title,
  description,
  image,
})
</script>


<template>
  <div>
    <SliceZone
      wrapper="main"
      class="slice-zone"
      :slices="page?.data.slices ?? []"
      :components="components"
    />
    <ServiceExtras :uid="uid" />
  </div>
</template>

<style scoped>
.slice-zone {
  min-height: calc(100vh - 204px);
}
</style>
