<script setup lang="ts">
import { type Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.ContactSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);
</script>

<template>
  <section
    id="#kontakt"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="bg-gray-100">
    <div class="container mx-auto py-12 px-4">
      <PrismicRichText :field="slice.primary.header" />
      <div class="flex mt-6">
        <div
          class="flex-1 basis-1/2"
          v-for="(item, i) in slice.items"
          :key="`address-${i}`">
          <PrismicRichText :field="item.place" />
          <PrismicRichText :field="item.address" wrapper="address" />
          <a class="block" :href="`tel:${item.phone}`">
            Tel.:{{ item.phone }}
          </a>
          <a
            class="block underline decoration-denta-green"
            :href="`http://www.google.com/maps/place/${item.location.latitude},${item.location.longitude}`"
            target="_blank">
            Jak dojechać »
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
