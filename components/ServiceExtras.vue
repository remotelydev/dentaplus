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
      <section
        v-if="serviceFaqs[uid]?.length"
        class="mt-12"
      >
        <h2 class="mb-4 font-semibold text-2xl md:text-3xl">
          Najczęstsze pytania
        </h2>
        <div class="divide-y divide-slate-200 border-y border-slate-200">
          <details
            v-for="item in serviceFaqs[uid]"
            :key="item.q"
            class="group py-4"
          >
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-xl text-slate-800">
              <span>{{ item.q }}</span>
              <span
                class="faq-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-denta-green text-slate-800"
                aria-hidden="true"
              />
            </summary>
            <p class="mt-3 leading-relaxed text-slate-700">
              {{ item.a }}
            </p>
          </details>
        </div>
      </section>
      <nav
        class="mt-8 flex flex-wrap gap-3"
        aria-label="Powiązane strony"
      >
        <NuxtLink
          class="inline-flex items-center justify-center rounded-full bg-denta-green px-5 py-2.5 font-semibold text-slate-800"
          to="/cennik/"
        >
          Cennik
        </NuxtLink>
        <NuxtLink
          class="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-800"
          to="/turek/"
        >
          Turek
        </NuxtLink>
        <NuxtLink
          class="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-800"
          to="/poddebice/"
        >
          Poddębice
        </NuxtLink>
        <NuxtLink
          class="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-800"
          to="/kontakt/"
        >
          Kontakt
        </NuxtLink>
      </nav>
    </article>
  </Bounded>
</template>

<style scoped>
summary {
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

.faq-icon::before {
  content: '+';
  font-weight: 600;
  line-height: 1;
}

details[open] .faq-icon::before {
  content: '−';
}
</style>
