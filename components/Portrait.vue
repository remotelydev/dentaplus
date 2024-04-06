<script setup>
defineProps([
  'name',
  'role',
  'portrait',
  'alt',
  'index',
  'link',
  'isLeader'
]);
</script>

<template>
  <PrismicLink
    class="shrink text-center border-0 border-slate-900 hover:scale-110 transition"
    :field="link"
  >
    <NuxtImg
      :src="portrait"
      :alt="alt"
    />
    <div :class="isLeader ? 'p-2 mb-8' : 'p-1'">
      <h3
        class="font-bold"
        :class="isLeader ? 'm-2 text-xl' : 'm-1 text-lg'"
        style="text-wrap: balance;"
      >
        {{ name }}
      </h3>
      <p class="text-sm">
        {{ role }}
      </p>
    </div>
  </PrismicLink>
</template>
