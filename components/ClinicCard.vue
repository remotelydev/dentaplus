<script setup lang="ts">
import { CLINIC_HOURS, type locations } from '~/data/locations'

const props = defineProps<{
  location: (typeof locations)[keyof typeof locations]
}>()

const settings = useSettings()
const phone = computed(() => settings.value?.data[props.location.phoneSetting] as string | undefined)
const email = computed(() => settings.value?.data[props.location.emailSetting] as string | undefined)
const telHref = computed(() => normalizeTelHref(phone.value))
</script>

<template>
  <div>
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
