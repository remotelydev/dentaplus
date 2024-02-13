<script setup lang="ts">
import { type Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.TilesSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);

const tilesOrder = (idx: number) => {
  if ((idx + 2) % 4 === 0) {
    return `order-${idx + 2}`
  }
  if ((idx + 1) % 4 === 0) {
    return `order-${idx}`
  }

  return `order-${idx + 1}`
}
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="w-full flex flex-wrap order-12 order-11 order-10 order-9 order-8 order-7 order-6 order-5 order-4 order-3 order-2 order-1 order-none">
    <div
      v-for="(item, i) in slice.items"
      class="min-h-0 w-full md:w-1/2"
      :class="[tilesOrder(i), 'md:order-none']"
      :key="`tile-${item.header}`">
      <TileImage
        v-if="item.image.url"
        :image="item.image.url"
        :fit="item.image_fit"
        :alt="item.image.alt" />
      <TileLink
        v-else-if="item.link.url"
        :header="item.header"
        :description="item.description"
        :link="item.link.url"
        :link_label="item.link_label"
        :index="i" />
      <TileText
        v-else
        :header="item.header"
        :description="item.description"
        :index="i" />
    </div>
  </section>
</template>
