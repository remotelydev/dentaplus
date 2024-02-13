<template>
  <div class="flex justify-center">
    <img
      class="max-h-96 md:h-96 md:object-cover"
      :class="`${
        fit === 'cover' ? 'w-full' : ''
      } max-w-1/2 object-${fit}`"
      :src="image"
      :alt="alt" />
  </div>
</template>
<script setup>
defineProps({
  image: String | null,
  alt: String | null,
  fit: String,
});
</script>
