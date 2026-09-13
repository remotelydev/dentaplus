<script setup lang="ts">
definePageMeta({
  layout: false,
})

useSeoMeta({
  title: 'Nie znaleziono strony | DentaPlus+',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <ErrorScreen is-not-found />
</template>
