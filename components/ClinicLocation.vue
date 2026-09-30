<script setup lang="ts">
import type { ImageField } from '@prismicio/client'
import { locations } from '~/data/locations'
import PhoneIcon from '../public/phone.svg'

const props = defineProps<{
  location: (typeof locations)[keyof typeof locations]
}>()

const prismic = usePrismic()
const settings = useSettings()
const phone = computed(() => settings.value?.data[props.location.phoneSetting] as string | undefined)
const telHref = computed(() => normalizeTelHref(phone.value))
const otherLocation = computed(() => (props.location.uid === 'turek' ? locations.poddebice : locations.turek))

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
    </Bounded>

    <section class="bg-slate-50 py-8 md:py-12">
      <Bounded y-padding="sm">
        <h2 id="adres" class="font-semibold text-2xl md:text-3xl mb-6 scroll-mt-16">Adres i godziny</h2>
        <ClinicCard :location="location" split />

        <ul class="mt-6 grid gap-6 md:grid-cols-2">
          <li>
            <NuxtLink
              class="group flex h-full flex-col border border-slate-200 bg-white p-6 transition hover:border-denta-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-denta-green"
              :to="`/${otherLocation.uid}/`"
            >
              <span class="text-sm text-slate-600">Druga lokalizacja</span>
              <span class="mt-1 text-xl font-semibold text-slate-800 group-hover:underline">
                Gabinet w {{ otherLocation.cityLocative }}
              </span>
              <span class="mt-3 block h-1 w-10 bg-denta-green" aria-hidden="true" />
              <span class="mt-3 text-slate-600">
                {{ otherLocation.streetAddress }}, {{ otherLocation.postalCode }} {{ otherLocation.addressLocality }}
              </span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="group flex h-full flex-col border border-slate-200 bg-white p-6 transition hover:border-denta-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-denta-green"
              to="/zespol/"
            >
              <span class="text-sm text-slate-600">Zespół lekarzy obu gabinetów</span>
              <span class="mt-1 text-xl font-semibold text-slate-800 group-hover:underline">
                Zespół DentaPlus+
              </span>
              <span class="mt-3 block h-1 w-10 bg-denta-green" aria-hidden="true" />
            </NuxtLink>
          </li>
        </ul>
      </Bounded>
    </section>
  </div>
</template>
