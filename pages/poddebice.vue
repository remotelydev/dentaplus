<script setup lang="ts">
import { locations } from '~/data/locations'

const location = locations.poddebice

usePageSeo({
  title: computed(() => location.title),
  description: computed(() => location.description),
})
</script>

<template>
  <main>
    <ClinicLocation :location="location" />
  </main>
</template>
