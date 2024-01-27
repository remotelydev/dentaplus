<template>
  <div class="flex justify-center">
    <img
      :class="`${
        fit === 'cover' ? 'w-full' : ''
      } max-w-1/2 max-h-96 object-${fit}`"
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
