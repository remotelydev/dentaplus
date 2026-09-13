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
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="container mx-auto max-w-[1280px] last-of-type:mb-16"
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
      class="w-full flex justify-between p-2 hover:bg-slate-800 hover:text-slate-100"
      :class="i % 2 === 1 ? 'bg-slate-100' : ''"
    >
      <div class="basis-3/4">
        {{ item.name }}
      </div>
      <div class="basis-1/4 flex justify-end items-center text-no-wrap">
        {{ item.price?.trim() || 'cena po konsultacji' }}
      </div>
    </div>
  </section>
</template>
