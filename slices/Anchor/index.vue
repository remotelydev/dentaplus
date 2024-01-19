<script setup lang="ts">
import { type Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.AnchorSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

onMounted(() => {
  console.log("anchor slice", slice);
});
const anchorId = computed(() => {
  console.log("c", this);
  return "anchor-id";
  // return slice.primary.anchor.replace(/\s+/g, "-").toLowerCase();
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
