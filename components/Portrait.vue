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
    class="shrink text-center border-0 border-slate-900 hover:scale-110 transition outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-denta-green focus-visible:ring-offset-2"
    :field="link"
  >
    <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden">
      <NuxtImg
        class="object-cover object-top"
        :src="portrait"
        :alt="alt"
      />
    </div>
    <div :class="isLeader ? 'p-2 mb-8' : 'p-1'">
      <h3
        class="font-bold"
        :class="isLeader ? 'm-2 text-xl' : 'm-1 text-lg'"
        style="text-wrap: balance;"
      >
        {{ name }}
      </h3>
      <p class="">
        {{ role }}
      </p>
    </div>
  </PrismicLink>
</template>
