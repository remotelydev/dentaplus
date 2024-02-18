<script setup>
import StarIcon from '../public/star.svg'
defineProps(['name', 'stars', 'review'])
</script>

<template>
  <div class="min-w-0 w-full max-w-[360px] bg-white rounded-3xl lg:w-[32%]">
    <div class="flex justify-between items-center px-6 py-4 font-bold bg-slate-100 rounded-t-3xl">
      <h3 class="xs:text-lg">{{ name }}</h3>
      <div class="flex text-amber-300">
        <StarIcon
          v-for="star in Number(stars)"
          :key="star"
          class="w-4 h-4 xs:w-6 xs:h-6"
        />
      </div>
    </div>
    <PrismicRichText class="p-6 text-sm xs:text-base" :field="review" />
  </div>
</template>