<script setup>
defineProps({
  name: String,
  role: String,
  portrait: String,
  alt: String,
  index: Number,
});
const isLeader = (i) => i <= 1;
</script>

<template>
  <div
    class="shrink text-center border-0 border-slate-900 hover:scale-110 transition"
  >
    <NuxtImg :src="portrait" :alt="alt" />
    <div :class="isLeader(index) ? 'p-2 mb-8' : 'p-1'">
      <h3
        class="font-bold"
        :class="isLeader(index) ? 'm-2 text-xl' : 'm-1 text-lg'"
      >
        {{ name }}
      </h3>
      <p class="text-sm">{{ role }}</p>
    </div>
  </div>
</template>
