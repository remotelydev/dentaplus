<template>
  <a
    class="min-h-0 h-80 min-w-0 w-dvw flex flex-col justify-center items-center py-6 px-6 border-2 border-transparent hover:border-denta-green sm:h-96 sm:px-10 lg:px-20"
    :class="tileBackground()"
    :href="link">
    <h2 class="mb-5 mt-0 text-center text-2xl uppercase">{{ header }}</h2>
    <div class="w-24 h-1 border-2 border-denta-green">&nbsp</div>
    <p v-if="description" class="mt-5 max-w-prose line-clamp-6 text-sm text-pretty">{{ description }}</p>
    <p v-if="link_label" class="my-5 max-w-prose text-sm">{{ link_label }}</p>
    <span class="hidden bg-zinc-50 bg-zinc-100 bg-zinc-200"></span>
  </a>
</template>

<script setup>
const props = defineProps({
  header: String | null,
  description: String | null,
  link_label: String | null,
  link: String | null,
  index: Number,
});

const tileBackground = () => {
  console.log(props.index % 3)
  switch (props.index % 3) {
    case 0: return 'bg-slate-100'
    case 1: return 'bg-slate-50'
    case 2: return 'bg-slate-100'
  }
}

</script>
