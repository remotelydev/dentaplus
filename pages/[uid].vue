<script setup lang="ts">
import type { SeoDocumentData } from '~/composables/usePageSeo'
import { components } from '~/slices'

const prismic = usePrismic()
const route = useRoute()
const { data: page } = useAsyncData(route.params.uid as string, () =>
  prismic.client.getByUID('page', route.params.uid as string || 'home')
)
const settings = useSettings()

const seoData = computed(() => page.value?.data as unknown as SeoDocumentData | undefined)
const siteTitle = computed(() => settings.value?.data.siteTitle || 'DentaPlus+')
const contentTitle = computed(() => prismic.asText(page.value?.data.title) || 'DentaPlus+')
const title = computed(() =>
  seoData.value?.meta_title?.trim() || `${contentTitle.value} | ${siteTitle.value}`
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
  <SliceZone
    wrapper="main"
    class="slice-zone"
    :slices="page?.data.slices ?? []"
    :components="components"
  />
</template>

<style scoped>
.slice-zone {
  min-height: calc(100vh - 204px);
}
</style>
