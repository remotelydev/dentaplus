<template>
  <div class="flex justify-center">
    <img
      v-if="tile"
      class="max-h-96 md:h-96 md:object-cover"
      :class="`${
        fit === 'cover' ? 'w-full' : ''
      } max-w-1/2 object-${fit}`"
      :src="tile.src"
      :srcset="tile.srcset"
      :sizes="tile.sizes"
      :width="tile.width"
      :height="tile.height"
      :alt="alt || ''"
      loading="lazy"
      decoding="async"
      fetchpriority="low"
    />
  </div>
</template>
<script setup>
import { buildResponsiveImage } from '~/utils/responsiveImage.mjs'

const props = defineProps({
  image: Object,
  alt: String,
  fit: String,
});

const prismic = usePrismic()
// Tiles are full width on phones and half the viewport from md up.
const tile = computed(() => buildResponsiveImage(prismic.asImageSrc, props.image, {
  widths: [480, 800, 1200],
  cap: 1400,
  sizes: '(min-width: 768px) 50vw, 100vw',
}))
</script>
