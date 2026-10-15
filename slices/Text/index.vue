<script setup lang="ts">
import { type Content } from '@prismicio/client'

defineProps(getSliceComponentProps<Content.TextSlice>(
  ['slice', 'index', 'slices', 'context']
));
</script>

<template>
  <Bounded
    as="section"
    class="bg-white leading-relaxed"
  >
    <PrismicRichText
      :field="slice.primary.text"
      :class="{
        'md:columns-2 md:gap-6': slice.variation === 'twoColumns'
      }"
      wrapper="div"
    />
  </Bounded>
</template>
