<script setup lang="ts">
const error = useError()
const isNotFound = computed(() => error.value?.statusCode === 404)

useSeoMeta({
  title: () => isNotFound.value ? 'Nie znaleziono strony | DentaPlus+' : 'Wystąpił błąd | DentaPlus+',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <main class="px-6 py-16 max-w-3xl mx-auto">
    <h1 class="text-4xl font-semibold mb-4">
      {{ isNotFound ? 'Nie znaleziono strony' : 'Wystąpił błąd' }}
    </h1>
    <p class="mb-6">
      {{ isNotFound
        ? 'Ten adres nie istnieje. Wróć do strony głównej DentaPlus+ albo sprawdź cennik i kontakt.'
        : 'Spróbuj ponownie za chwilę.' }}
    </p>
    <p>
      <NuxtLink class="underline" to="/">Strona główna</NuxtLink>
      ·
      <NuxtLink class="underline" to="/kontakt/">Kontakt</NuxtLink>
    </p>
  </main>
</template>
