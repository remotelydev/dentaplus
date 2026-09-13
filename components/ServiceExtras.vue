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
        class="mb-6 overflow-hidden"
      >
        <h2 class="border-l-4 border-denta-green bg-slate-800 px-5 py-3 font-semibold text-2xl text-white md:px-6 md:py-4 md:text-3xl">
          {{ block.heading }}
        </h2>
        <div class="border-l-4 border-denta-green bg-slate-50 px-5 py-5 leading-relaxed text-slate-700 md:px-6 md:py-6">
          <ol
            v-if="block.steps?.length"
            class="mb-4 space-y-3"
          >
            <li
              v-for="(step, stepIndex) in block.steps"
              :key="step"
              class="flex gap-3"
            >
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-denta-green font-semibold text-slate-800">
                {{ stepIndex + 1 }}
              </span>
              <span class="pt-1">{{ step }}</span>
            </li>
          </ol>
          <p v-if="block.body">
            {{ block.body }}
          </p>
        </div>
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
