<script setup lang="ts">
import { type Content } from "@prismicio/client";
import { VueCompareImage } from 'vue3-compare-image'

defineProps(
  getSliceComponentProps<Content.MetamorphosisSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);

const imageAlt = (field: { alt?: string | null } | null | undefined) =>
  field?.alt?.trim() || DEFAULT_IMAGE_ALT
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="container mx-auto mt-8 mb-20 grid justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3"
  >
    <article
      v-for="item in slice.items"
      :key="item.title"
      class="flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      <div class="aspect-[4/3] w-full bg-slate-100">
        <ClientOnly>
          <VueCompareImage
            :left-image="item.before.url"
            :right-image="item.after.url"
            :left-image-alt="imageAlt(item.before)"
            :right-image-alt="imageAlt(item.after)"
          />
          <template #fallback>
            <div class="grid h-full grid-cols-2">
              <img
                v-if="item.before.url"
                class="h-full w-full object-cover"
                :src="item.before.url"
                :alt="imageAlt(item.before)"
                :width="item.before.dimensions?.width || undefined"
                :height="item.before.dimensions?.height || undefined"
              >
              <img
                v-if="item.after.url"
                class="h-full w-full object-cover"
                :src="item.after.url"
                :alt="imageAlt(item.after)"
                :width="item.after.dimensions?.width || undefined"
                :height="item.after.dimensions?.height || undefined"
              >
            </div>
          </template>
        </ClientOnly>
      </div>
      <div class="px-6 py-4">
        <PrismicRichText :field="item.title" />
        <PrismicRichText
          class="mt-3 text-sm sm:text-base"
          :field="item.description"
        />
      </div>
    </article>
  </section>
</template>
