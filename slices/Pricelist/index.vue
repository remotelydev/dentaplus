<script setup lang="ts">
import { type Content } from "@prismicio/client";

const CATEGORY_LINKS: Record<string, string> = {
  implantologia: '/implanty/',
  implanty: '/implanty/',
  endodoncja: '/endodoncja/',
  ortodoncja: '/invisalign/',
  invisalign: '/invisalign/',
  radiologia: '/tomografia/',
  tomografia: '/tomografia/',
}

const props = defineProps(
  getSliceComponentProps<Content.PricelistSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);
const prismic = usePrismic()
const categoryName = computed(() => prismic.asText(props.slice.primary.name).trim())
const categoryHref = computed(() => {
  const fromCms = (props.slice.primary as { service_link?: { url?: string } }).service_link?.url
  if (fromCms) return fromCms
  const key = categoryName.value.toLowerCase()
  return CATEGORY_LINKS[key]
})

const categoryId = computed(() => categoryAnchorId(categoryName.value))

const pricelistCategories = computed(() =>
  (props.slices ?? [])
    .filter((slice): slice is Content.PricelistSlice => slice.slice_type === 'pricelist')
    .map((slice) => {
      const name = prismic.asText(slice.primary.name).trim()
      return { name, id: categoryAnchorId(name) }
    })
    .filter((item) => item.name && item.id)
)

const isFirstPricelist = computed(() => {
  const firstIndex = (props.slices ?? []).findIndex((slice) => slice.slice_type === 'pricelist')
  return firstIndex !== -1 && props.index === firstIndex
})

const showJumpNav = computed(() => isFirstPricelist.value && pricelistCategories.value.length > 1)

function categoryAnchorId(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug ? `cennik-${slug}` : ''
}
</script>

<template>
  <nav
    v-if="showJumpNav"
    class="sticky top-0 z-30 border-b border-slate-200 bg-white sm:top-14"
    aria-label="Kategorie cennika"
  >
    <ul class="container mx-auto flex max-w-[1280px] gap-x-4 overflow-x-auto px-2 py-3 text-sm font-semibold">
      <li
        v-for="item in pricelistCategories"
        :key="item.id"
      >
        <a
          class="whitespace-nowrap hover:underline"
          :href="`#${item.id}`"
        >{{ item.name }}</a>
      </li>
    </ul>
  </nav>
  <section
    :id="categoryId || undefined"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="container mx-auto max-w-[1280px] scroll-mt-16 last-of-type:mb-16 sm:scroll-mt-32"
  >
    <h2
      v-if="categoryName"
      class="mt-8 mb-2 px-2 font-semibold text-2xl"
    >
      <NuxtLink
        v-if="categoryHref"
        class="underline"
        :to="categoryHref"
      >
        {{ categoryName }}
      </NuxtLink>
      <template v-else>{{ categoryName }}</template>
    </h2>
    <div
      v-for="(item, i) in slice.items"
      :key="`${item.name}-price`"
      class="w-full flex flex-col items-start p-2 hover:bg-denta-green hover:text-slate-800 sm:flex-row sm:items-center sm:justify-between"
      :class="i % 2 === 1 ? 'bg-slate-100' : ''"
    >
      <div class="sm:basis-3/4">
        {{ item.name }}
      </div>
      <div class="sm:basis-1/4 sm:flex sm:justify-end sm:items-center text-no-wrap">
        {{ item.price?.trim() || 'cena po konsultacji' }}
      </div>
    </div>
  </section>
</template>
