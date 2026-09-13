<script setup lang="ts">
import { CLINIC_HOURS, SERVICE_LINKS, type locations } from '~/data/locations'

const props = defineProps<{
  location: (typeof locations)[keyof typeof locations]
}>()

const settings = useSettings()
const phone = computed(() => settings.value?.data[props.location.phoneSetting] as string | undefined)
const email = computed(() => settings.value?.data[props.location.emailSetting] as string | undefined)
const telHref = computed(() => {
  const digits = phone.value?.replace(/[^\d+]/g, '') || ''
  const withCountry = digits.startsWith('+') ? digits : digits ? `+48${digits}` : ''
  return withCountry ? `tel:${withCountry}` : undefined
})
</script>

<template>
  <Bounded as="section" y-padding="base">
    <h1 class="font-semibold leading-tight tracking-tight text-4xl md:text-5xl mb-6">
      {{ location.h1 }}
    </h1>
    <p class="text-lg mb-6">
      {{ location.intro }}
    </p>
    <p
      v-for="paragraph in location.paragraphs"
      :key="paragraph"
      class="mb-4"
    >
      {{ paragraph }}
    </p>

    <h2 class="font-semibold text-2xl md:text-3xl mt-12 mb-4">Adres i godziny</h2>
    <address class="not-italic mb-4">
      <strong>{{ location.name }}</strong><br>
      {{ location.streetAddress }}, {{ location.postalCode }} {{ location.addressLocality }}
    </address>
    <p v-if="telHref" class="mb-1">
      <a class="underline" :href="telHref">+48 {{ phone }}</a>
    </p>
    <p v-if="email" class="mb-4">
      <a class="underline" :href="`mailto:${email}`">{{ email }}</a>
    </p>
    <ul class="mb-8">
      <li v-for="row in CLINIC_HOURS" :key="row.days">
        {{ row.days }}: {{ row.opens }}–{{ row.closes }}
      </li>
    </ul>

    <iframe
      :src="location.mapSrc"
      :title="location.mapTitle"
      width="100%"
      height="360"
      class="border-0 mb-12"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    />

    <h2 class="font-semibold text-2xl md:text-3xl mb-4">Usługi w {{ location.city }}</h2>
    <ul class="list-disc pl-5 mb-8">
      <li v-for="item in SERVICE_LINKS" :key="item.to" class="mb-1">
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
</template>
