<script setup lang="ts">
defineProps({
  as: {
    type: [String, Object, Function],
    default: "div",
  },
  yPadding: {
    type: String,
    default: "base",
  },
  collapsible: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <Component
    :is="as"
    :data-collapsible="collapsible || null"
    class="px-6"
    :class="{
      'py-2 md:py-4': yPadding === 'sm',
      'py-4 md:py-8': yPadding === 'base',
      'pt-4 pb-48 sm:pt-16 sm:pb-60 md:pb-96': yPadding === 'lg',
    }"
  >
    <div class="mx-auto w-full max-w-6xl">
      <slot />
    </div>
  </Component>
</template>
