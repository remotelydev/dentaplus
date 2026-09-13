<script setup lang="ts">
import { serviceFaqs, servicePages } from '~/data/services'

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
      <section v-if="serviceFaqs[uid]?.length" class="mt-12">
        <h2 class="font-semibold text-2xl md:text-3xl mb-4">Najczęstsze pytania</h2>
        <div v-for="item in serviceFaqs[uid]" :key="item.q" class="mb-6">
          <h3 class="font-semibold text-xl mb-2">{{ item.q }}</h3>
          <p>{{ item.a }}</p>
        </div>
      </section>
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
