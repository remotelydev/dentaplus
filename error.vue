<script setup lang="ts">
const error = useError()
const isNotFound = computed(() => error.value?.statusCode === 404)

useSeoMeta({
  title: () => isNotFound.value ? 'Nie znaleziono strony | DentaPlus+' : 'Wystąpił błąd | DentaPlus+',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <ErrorScreen :is-not-found="isNotFound" />
</template>
