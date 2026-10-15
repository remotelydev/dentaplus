<script setup lang="ts">
import { type Content } from "@prismicio/client";

defineProps(
  getSliceComponentProps<Content.AnchorSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const anchorId = computed(() => {
  return "anchor-id";
});
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    Placeholder component for anchor (variation: {{ slice.variation }}) Slices
    <pre>{{ slice }}</pre>
    <h3 :id="anchorId">
      {{ slice.primary.anchor }}
    </h3>
  </section>
</template>
