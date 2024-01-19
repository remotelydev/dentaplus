<script setup lang="ts">
import { type Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.PricelistSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="container mx-auto last-of-type:mb-16"
  >
    <PrismicRichText
      v-if="slice.primary.name"
      class="mt-8 mb-2 px-2"
      :field="slice.primary.name"
    />
    <div
      class="w-full flex justify-between p-2 hover:bg-slate-800 hover:text-slate-100"
      :class="i % 2 === 1 ? 'bg-slate-100' : ''"
      v-for="(item, i) in slice.items"
      :key="`${item.name}-price`"
    >
      <div class="basis-3/4">{{ item.name }}</div>
      <div class="basis-1/4 flex justify-end items-center text-no-wrap">
        {{ item.price }}
      </div>
    </div>
  </section>
</template>
