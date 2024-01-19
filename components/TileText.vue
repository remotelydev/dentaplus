<template>
  <div
    class="h-96 flex flex-col justify-center items-center py-12 px-20"
    :class="`bg-gray-${(index % 3) + 1}00`"
  >
    <h2 class="uppercase text-2xl mb-5 mt-0">{{ header }}</h2>
    <div class="w-24 h-1 border-2 border-denta-green">&nbsp</div>
    <p class="text-sm mt-5">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  header: String,
  description: String,
  index: Number,
});
</script>
