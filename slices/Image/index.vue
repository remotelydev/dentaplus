<script setup lang="ts">
import { type Content } from '@prismicio/client'

const props = defineProps(getSliceComponentProps<Content.ImageSlice>(
  ['slice', 'index', 'slices', 'context']
));
const image = computed(() => withImageAlt(props.slice.primary.image))
</script>

<template>
  <Bounded
    as="section"
    class="bg-white"
    :class="{
      'pt-0 md:pt-0': index === 0
    }"
  >
    <div
      v-if="image?.url"
      class="bg-gray-100"
    >
      <PrismicImage :field="image" :imgix-params="{ w: 1200, auto: ['compress', 'format'] }" />
    </div>
  </Bounded>
</template>
