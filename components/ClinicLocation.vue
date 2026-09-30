<script setup lang="ts">
import type { ImageField } from '@prismicio/client'
import { SERVICE_LINKS, type locations } from '~/data/locations'
import PhoneIcon from '../public/phone.svg'

const props = defineProps<{
  location: (typeof locations)[keyof typeof locations]
}>()

const prismic = usePrismic()
const settings = useSettings()
const phone = computed(() => settings.value?.data[props.location.phoneSetting] as string | undefined)
const telHref = computed(() => normalizeTelHref(phone.value))

// Galeria groups photos under a "Gabinety {city}" text slice followed by that clinic's gallery slice.
const { data: photo } = await useAsyncData(`city-photo-${props.location.uid}`, async () => {
  const galeria = await prismic.client.getByUID('page', 'galeria').catch(() => null)
  const slices = galeria?.data.slices ?? []
  let inCity = false
  for (const slice of slices) {
    if (slice.slice_type === 'text') {
      inCity = prismic.asText(slice.primary.text).includes(props.location.city)
      continue
    }
    if (inCity && slice.slice_type === 'gallery') {
      const image = slice.items.find((item) => item.image?.url)?.image
      if (image) return image as ImageField
    }
  }
  return null
})
</script>

<template>
  <div>
    <section class="bg-slate-800 text-white">
      <Bounded y-padding="hero" class="max-md:py-8">
        <div class="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <div>
            <h1 class="font-semibold leading-tight tracking-tight text-[length:clamp(1.75rem,0.75rem+5vw,3rem)] mb-6 break-words hyphens-auto">
              {{ location.h1 }}
            </h1>
            <p class="text-lg mb-6 text-slate-100">
              {{ location.intro }}
            </p>
            <address class="not-italic mb-6 border-l-4 border-denta-green pl-4">
              <strong>{{ location.name }}</strong><br>
              {{ location.streetAddress }}, {{ location.postalCode }} {{ location.addressLocality }}
            </address>
            <div class="flex flex-wrap gap-3">
              <a
                v-if="telHref"
                :href="telHref"
                class="inline-flex items-center gap-2 rounded-full bg-denta-green px-5 py-3 font-semibold text-slate-900 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <PhoneIcon class="w-5 h-5" aria-hidden="true" />
                +48 {{ phone }}
              </a>
              <a
                href="#adres"
                class="inline-flex items-center rounded-full border border-white/70 px-5 py-3 font-semibold transition hover:border-denta-green hover:text-denta-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Adres i godziny
              </a>
            </div>
          </div>
          <figure
            v-if="photo?.url"
            class="aspect-[4/3] overflow-hidden bg-slate-700"
          >
            <PrismicImage
              :field="photo"
              class="h-full w-full object-cover"
              :imgix-params="{ w: 1000, auto: ['compress', 'format'] }"
              fetchpriority="high"
            />
          </figure>
        </div>
      </Bounded>
    </section>

    <Bounded as="section" y-padding="base">
      <div class="max-w-prose">
        <p
          v-for="paragraph in location.paragraphs"
          :key="paragraph"
          class="mb-4 leading-relaxed"
        >
          {{ paragraph }}
        </p>
      </div>

      <h2 id="adres" class="font-semibold text-2xl md:text-3xl mt-12 mb-4 scroll-mt-16">Adres i godziny</h2>
      <ClinicCard :location="location" />

      <h2 class="font-semibold text-2xl md:text-3xl mb-4">Usługi w {{ location.cityLocative }}</h2>
      <ul class="list-disc pl-5 mb-8">
        <li
          v-for="item in SERVICE_LINKS"
          :key="item.to"
          class="mb-1"
        >
          <NuxtLink class="underline" :to="item.to">{{ item.label }}</NuxtLink>
        </li>
      </ul>

      <p>
        Zespół lekarzy obu gabinetów: <NuxtLink class="underline" to="/zespol/">Zespół DentaPlus+</NuxtLink>.
        Druga lokalizacja:
        <NuxtLink
          v-if="location.uid === 'turek'"
          class="underline"
          to="/poddebice/"
        >
          gabinet w Poddębicach
        </NuxtLink>
        <NuxtLink
          v-else
          class="underline"
          to="/turek/"
        >
          gabinet w Turku
        </NuxtLink>.
      </p>
    </Bounded>
  </div>
</template>
