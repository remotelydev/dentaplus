<template>
  <div class="flex justify-center">
    <img
      class="max-h-96 md:h-96 md:object-cover"
      :class="`${
        fit === 'cover' ? 'w-full' : ''
      } max-w-1/2 object-${fit}`"
      :src="src"
      :alt="alt || ''"
      loading="lazy"
      decoding="async"
      fetchpriority="low"
    />
  </div>
</template>
<script setup>
const props = defineProps({
  image: Object,
  alt: String,
  fit: String,
});

const prismic = usePrismic()
const src = computed(() => {
  const field = props.image
  if (!field?.url) return ''
  const cap = 1400
  const intrinsic = field.dimensions?.width || cap
  const width = Math.min(cap, intrinsic)
  const height = field.dimensions?.width
    ? Math.round(width * (field.dimensions.height / field.dimensions.width))
    : undefined
  return prismic.asImageSrc(field, {
    auto: ['format', 'compress'],
    w: width,
    ...(height ? { h: height } : {}),
  }) || field.url
})
</script>
