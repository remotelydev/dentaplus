<script setup lang="ts">
import type { SeoDocumentData } from '~/composables/usePageSeo'
import { components } from '~/slices'

const prismic = usePrismic()
const { data: page } = useAsyncData('index', () =>
  prismic.client.getByUID('page', 'home')
)

const seoData = computed(() => page.value?.data as unknown as SeoDocumentData | undefined)
const title = computed(() =>
  seoData.value?.meta_title?.trim() || 'DentaPlus+ | Gabinety stomatologiczne w Turku i Poddębicach'
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
    :slices="page?.data.slices ?? []"
    :components="components"
  />
</template>
