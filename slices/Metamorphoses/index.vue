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
    class="container mx-auto">
    <div
      v-for="item in slice.items"
      :key="item.title"
      class="flex flex-col-reverse items-center my-10 lg:flex-row lg:items-start lg:gap-8 lg:my-14 xl:my-20"
    >
      <div class="min-w-0 w-full lg:w-1/2 p-4 lg:p-8">
        <PrismicRichText :field="item.title" />
        <PrismicRichText class="mt-4 text-sm sm:text-base" :field="item.description" />
      </div>
      <div class="flex justify-center items-center min-w-0 w-full md:w-4/5 lg:w-1/2">
        <ClientOnly>
          <VueCompareImage :leftImage="item.before.url" :rightImage="item.after.url"/>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>
