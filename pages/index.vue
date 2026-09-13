<script setup lang="ts">
import type { SeoDocumentData } from '~/composables/usePageSeo'
import { components } from '~/slices'
import { portraitsFromSlices, splitSlicesAfterFirstHero } from '~/utils/teamPortraits.mjs'

const prismic = usePrismic()
const { data: page } = useAsyncData('index', () =>
  prismic.client.getByUID('page', 'home')
)
const { data: zespol } = useAsyncData('index-zespol', async () => {
  try {
    return await prismic.client.getByUID('page', 'zespol')
  } catch {
    return null
  }
})

const slices = computed(() => page.value?.data?.slices ?? [])
const split = computed(() => splitSlicesAfterFirstHero(slices.value))
const teamPeople = computed(() => portraitsFromSlices(zespol.value?.data?.slices))

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
  <main>
    <SliceZone
      :slices="split.before"
      :components="components"
    />
    <HomeTeamStrip :people="teamPeople" />
    <SliceZone
      :slices="split.after"
      :components="components"
    />
  </main>
</template>
