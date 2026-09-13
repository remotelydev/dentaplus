<script setup lang="ts">
import { SERVICE_NAV } from '~/data/services'

usePageSeo({
  title: computed(() => 'Usługi stomatologiczne Turek i Poddębice | DentaPlus+'),
  description: computed(() => 'Implanty, Invisalign, leczenie kanałowe, iTero i tomografia 3D w gabinetach DentaPlus+ w Turku i Poddębicach.'),
})
</script>

<template>
  <Bounded as="main" y-padding="base">
    <h1 class="mb-8 text-4xl font-semibold md:text-5xl">Usługi</h1>
    <ul class="space-y-3">
      <li
        v-for="item in SERVICE_NAV"
        :key="item.uid"
      >
        <NuxtLink
          class="text-xl font-semibold underline hover:no-underline"
          :to="item.to"
        >
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </Bounded>
</template>
