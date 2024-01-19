<template>
  <img
    class="w-full h-full max-w-1/2 max-h-96 object-cover"
    :src="image"
    :alt="alt"
  />
</template>
<script setup>
defineProps({
  image: String,
  alt: String,
});
</script>
