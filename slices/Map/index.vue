<script setup lang="ts">
import { type Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.MapSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);
</script>

<template>
  <section
    id="map"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2455.809289520057!2d18.49426037782488!3d52.010352971932086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471b1f53660b39ff%3A0x78e72c385ad3a531!2sDentaPlus%2B%20Klinika%20Stomatologii%20Turek!5e0!3m2!1sen!2spl!4v1701608303009!5m2!1sen!2spl"
      width="100%"
      height="450"
      style="border: 0"
      allowfullscreen="false"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade" />
  </section>
</template>
