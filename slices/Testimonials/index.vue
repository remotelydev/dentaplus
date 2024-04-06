<script setup lang="ts">
import { type Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.TestimonialsSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);
</script>

<template>
  <section
    class="bg-slate-200 pt-6 pb-16"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <PrismicRichText
      class="font-bold text-center text-3xl my-4 px-4 md:my-8"
      :field="slice?.primary.header"
    />
    <div class="lg:container mx-auto relative flex gap-4 overflow-x-auto scroll-smooth snap-proximity snap-x scroll-px-4 p-4 lg:justify-center lg:gap-8">
      <Testimonial
        v-for="review in slice.items"
        :key="`${review.name}`"
        class="snap-center shrink-0"
        :name="review.name"
        :stars="review.stars"
        :review="review.review"
      />
    </div>
  </section>
</template>
