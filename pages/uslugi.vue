<script setup lang="ts">
import type { Content, ImageField } from '@prismicio/client'
import { SERVICE_NAV, serviceCardBlurb } from '~/data/services'

usePageSeo({
  title: computed(() => 'Usługi stomatologiczne Turek i Poddębice | DentaPlus+'),
  description: computed(() => 'Implanty, Invisalign, leczenie kanałowe, iTero i tomografia 3D w gabinetach DentaPlus+ w Turku i Poddębicach.'),
})

const prismic = usePrismic()

const firstServiceImage = (page: Content.PageDocument | null): ImageField | undefined => {
  if (!page) return undefined

  for (const slice of page.data.slices) {
    if (slice.slice_type !== 'text_with_image') continue
    const image = slice.primary.image
    if (image?.url) return image
  }

  return undefined
}

const { data: cards } = await useAsyncData('uslugi-cards', async () => {
  const pages = await Promise.all(
    SERVICE_NAV.map((item) =>
      prismic.client.getByUID('page', item.uid).catch(() => null),
    ),
  )

  return SERVICE_NAV.map((item, index) => {
    const image = firstServiceImage(pages[index] ?? null)
    return {
      ...item,
      blurb: serviceCardBlurb(item.uid),
      image: image ? withImageAlt(image, item.label) : undefined,
    }
  })
})
</script>

<template>
  <Bounded as="main" y-padding="base">
    <h1 class="mb-8 text-4xl font-semibold md:text-5xl">Usługi</h1>
    <ul class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="card in cards"
        :key="card.uid"
      >
        <NuxtLink
          class="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white transition hover:border-denta-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-denta-green"
          :to="card.to"
        >
          <div
            v-if="card.image?.url"
            class="aspect-[4/3] overflow-hidden bg-slate-100"
          >
            <PrismicImage
              :field="card.image"
              class="h-full w-full object-cover"
              :imgix-params="{ w: 800, auto: ['compress', 'format'] }"
            />
          </div>
          <div class="flex flex-1 flex-col p-5">
            <h2 class="text-xl font-semibold text-slate-800 group-hover:underline">
              {{ card.label }}
            </h2>
            <span
              class="mt-3 block h-1 w-10 bg-denta-green"
              aria-hidden="true"
            />
            <p class="mt-3 text-slate-600 leading-relaxed">
              {{ card.blurb }}
            </p>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </Bounded>
</template>
