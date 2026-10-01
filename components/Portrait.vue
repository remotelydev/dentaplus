<script setup>
import { buildResponsiveImage } from '~/utils/responsiveImage.mjs'

const props = defineProps([
  'name',
  'role',
  'portrait',
  'alt',
  'index',
  'link',
  'isLeader'
]);

const prismic = usePrismic()
// Mobile portraits are full width; leaders stay larger, the rest shrink from sm up.
const image = computed(() => buildResponsiveImage(prismic.asImageSrc, props.portrait, {
  widths: props.isLeader ? [480, 800, 1200] : [320, 480, 800],
  cap: props.isLeader ? 1200 : 800,
  sizes: props.isLeader
    ? '(min-width: 640px) 33vw, 100vw'
    : '(min-width: 1024px) 16vw, (min-width: 768px) 20vw, (min-width: 640px) 25vw, 100vw',
}))
</script>

<template>
  <PrismicLink
    class="shrink text-center border-0 border-slate-900 hover:scale-110 transition outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-denta-green focus-visible:ring-offset-2"
    :field="link"
  >
    <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden">
      <img
        v-if="image"
        class="object-cover object-top"
        :src="image.src"
        :srcset="image.srcset"
        :sizes="image.sizes"
        :width="image.width"
        :height="image.height"
        :alt="alt || ''"
        :loading="isLeader ? 'eager' : 'lazy'"
        decoding="async"
      />
    </div>
    <div :class="isLeader ? 'p-2 mb-8' : 'p-1'">
      <h3
        class="font-bold"
        :class="isLeader ? 'm-2 text-xl' : 'm-1 text-lg'"
        style="text-wrap: balance;"
      >
        {{ name }}
      </h3>
      <p class="">
        {{ role }}
      </p>
    </div>
  </PrismicLink>
</template>
