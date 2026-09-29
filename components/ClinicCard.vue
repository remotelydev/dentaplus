<script setup lang="ts">
import { CLINIC_HOURS, type locations } from '~/data/locations'

const props = defineProps<{
  location: (typeof locations)[keyof typeof locations]
  split?: boolean
}>()

const settings = useSettings()
const phone = computed(() => settings.value?.data[props.location.phoneSetting] as string | undefined)
const email = computed(() => settings.value?.data[props.location.emailSetting] as string | undefined)
const telHref = computed(() => normalizeTelHref(phone.value))
</script>

<template>
  <div v-if="split" class="grid overflow-hidden border border-slate-200 bg-white md:grid-cols-2">
    <div class="p-6 md:p-8">
      <address class="not-italic mb-6 border-l-4 border-denta-green pl-4">
        <strong>{{ location.name }}</strong><br>
        {{ location.streetAddress }}, {{ location.postalCode }} {{ location.addressLocality }}
      </address>
      <p v-if="telHref" class="mb-1">
        <a class="font-semibold underline" :href="telHref">+48 {{ phone }}</a>
      </p>
      <p v-if="email" class="mb-6">
        <a class="underline" :href="`mailto:${email}`">{{ email }}</a>
      </p>
      <dl class="divide-y divide-slate-200 border-y border-slate-200">
        <div
          v-for="row in CLINIC_HOURS"
          :key="row.days"
          class="flex justify-between gap-4 py-2"
        >
          <dt class="font-semibold">{{ row.days }}</dt>
          <dd>{{ row.opens }}–{{ row.closes }}</dd>
        </div>
      </dl>
    </div>
    <iframe
      :src="location.mapSrc"
      :title="location.mapTitle"
      width="100%"
      height="360"
      class="h-[360px] w-full border-0 md:h-full md:min-h-[360px]"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    />
  </div>
  <div v-else>
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
      <li
        v-for="row in CLINIC_HOURS"
        :key="row.days"
      >
        {{ row.days }}: {{ row.opens }}–{{ row.closes }}
      </li>
    </ul>
    <iframe
      :src="location.mapSrc"
      :title="location.mapTitle"
      width="100%"
      height="360"
      class="mb-12 border-0"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    />
  </div>
</template>
