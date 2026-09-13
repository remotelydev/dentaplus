<script setup lang="ts">
import { servicePages } from '~/data/services'

defineProps<{
  uid: string
}>()
</script>

<template>
  <Bounded
    v-if="servicePages[uid]"
    as="section"
    y-padding="base"
  >
    <article>
      <section
        v-for="block in servicePages[uid].h2s"
        :key="block.heading"
        class="mb-8"
      >
        <h2 class="font-semibold text-2xl md:text-3xl mb-3">{{ block.heading }}</h2>
        <p>{{ block.body }}</p>
      </section>
      <p class="mb-4">
        {{ servicePages[uid].cta }}
      </p>
      <p>
        <NuxtLink class="underline font-semibold" to="/cennik/">Cennik DentaPlus+</NuxtLink>
        ·
        <NuxtLink class="underline" to="/turek/">Gabinet Turek</NuxtLink>
        ·
        <NuxtLink class="underline" to="/poddebice/">Gabinet Poddębice</NuxtLink>
        ·
        <NuxtLink class="underline" to="/kontakt/">Kontakt</NuxtLink>
      </p>
    </article>
  </Bounded>
</template>
