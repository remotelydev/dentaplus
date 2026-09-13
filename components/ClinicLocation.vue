<script setup lang="ts">
import { SERVICE_LINKS, type locations } from '~/data/locations'

defineProps<{
  location: (typeof locations)[keyof typeof locations]
}>()
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
</template>
