<script setup lang="ts">
import { type Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.HeaderSlice>([
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
    class="bg-slate-100 py-8 px-4"
  >
    <div class="container mx-auto">
      <PrismicRichText
        class="max-w-6xl mx-auto"
        :field="slice.primary.header"
      />
    </div>
  </section>
</template>
