<script setup lang="ts">
import { DEFAULT_IMAGE_ALT } from '~/composables/useImageAlt'

const props = defineProps<{
  people: Array<{
    name?: string | null
    role?: string | null
    portrait: { url: string, alt?: string | null }
  }>
}>()

const prismic = usePrismic()

const faces = computed(() =>
  props.people.map((person) => {
    const name = String(person.name || '').trim()
    const src =
      prismic.asImageSrc(person.portrait, {
        auto: ['format', 'compress'],
        w: 160,
        h: 160,
        fit: 'crop',
      }) || person.portrait.url
    const alt =
      person.portrait.alt?.trim() ||
      name ||
      DEFAULT_IMAGE_ALT

    return { name, src, alt }
  }),
)
</script>

<template>
  <section
    v-if="faces.length"
    aria-labelledby="home-team-heading"
    class="border-b border-slate-200 bg-white"
    data-home-team-strip
  >
    <NuxtLink
      to="/zespol/"
      class="block container mx-auto px-4 py-6 md:py-8 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-denta-green"
    >
      <div class="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h2
          id="home-team-heading"
          class="font-semibold text-xl md:text-2xl text-slate-800"
        >
          Poznaj zespół
        </h2>
        <span class="text-sm font-medium text-slate-700 underline decoration-denta-green underline-offset-4">
          Zobacz cały zespół
        </span>
      </div>
      <ul
        aria-hidden="true"
        class="flex gap-4 overflow-x-auto pb-1 scroll-smooth snap-x snap-mandatory"
      >
        <li
          v-for="person in faces"
          :key="`${person.src}-${person.name}`"
          class="snap-start shrink-0 w-20 sm:w-24"
        >
          <span class="flex flex-col items-center text-center">
            <NuxtImg
              :src="person.src"
              :alt="person.alt"
              width="96"
              height="96"
              sizes="96px"
              class="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover object-top bg-slate-100"
            />
            <span
              v-if="person.name"
              class="mt-2 text-xs font-medium leading-tight text-slate-800 line-clamp-2"
            >
              {{ person.name }}
            </span>
          </span>
        </li>
      </ul>
    </NuxtLink>
  </section>
</template>
