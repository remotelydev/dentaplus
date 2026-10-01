<script setup lang="ts">
import { type Content } from '@prismicio/client'

const props = defineProps(getSliceComponentProps<Content.TextWithImageSlice>(
  ['slice', 'index', 'slices', 'context']
));
const image = computed(() => withImageAlt(props.slice.primary.image))
</script>

<template>
  <Bounded
    as="section"
    class="bg-white"
  >
    <div class="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
      <PrismicRichText :field="slice.primary.text" />
      <div>
        <div
          v-if="image?.url"
          class="bg-gray-100"
        >
          <PrismicImage
            :field="image"
            :width="image.dimensions?.width"
            :height="image.dimensions?.height"
            :imgix-params="{ w: 1000, auto: ['compress', 'format'] }"
          />
        </div>
      </div>
    </div>
  </Bounded>
</template>
