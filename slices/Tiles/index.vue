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
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="w-full flex flex-wrap">
    <div
      v-for="(item, i) in slice.items"
      class="flex-1 basis-1/2"
      :key="`tile-${i}`">
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
        :index="i" />
      <TileText
        v-else
        :header="item.header"
        :description="item.description"
        :index="i" />
    </div>
  </section>
</template>
