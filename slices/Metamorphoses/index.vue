<script setup lang="ts">
import { type Content } from "@prismicio/client";
import { VueCompareImage } from 'vue3-compare-image'
// import VueCompareImage from 'vue-compare-image';


// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.MetamorphosisSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="container mx-auto flex flex-wrap gap-x-4 gap-y-8 items-start justify-center mt-8 mb-20"
  >
    <div
      v-for="item in slice.items"
      :key="item.title"
      class="flex flex-col-reverse items-center"
    > 
      <div class="min-w-0 w-full max-w-sm px-6 py-4 lg:p-8 border border-t-0">
        <PrismicRichText :field="item.title" />
        <PrismicRichText
          class="mt-4 text-sm sm:text-base"
          :field="item.description"
        />
      </div>
      <div class="flex justify-center items-center min-w-0 w-full max-w-sm">
        <ClientOnly>
          <VueCompareImage
            :left-image="item.before.url"
            :right-image="item.after.url"
          />
        </ClientOnly>
      </div>
    </div>
  </section>
</template>
