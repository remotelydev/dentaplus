<script setup lang="ts">
usePageSeo({
  title: computed(() => 'Polityka cookies | DentaPlus+'),
  description: computed(() => 'Informacja o plikach cookies na stronie DentaPlus+ — gabinety stomatologiczne w Turku i Poddębicach.'),
})
</script>

<template>
  <Bounded as="main" y-padding="base">
    <h1 class="text-4xl font-semibold mb-6">Polityka cookies</h1>
    <p class="mb-4">Strona dentaplus.pl może zapisywać pliki cookies niezbędne do działania (sesja, bezpieczeństwo) oraz — po zgodzie — analityczne.</p>
    <h2 class="text-2xl font-semibold mt-8 mb-3">Zarządzanie</h2>
    <p class="mb-4">Cookies możesz wyłączyć w ustawieniach przeglądarki. Więcej o danych osobowych: <NuxtLink class="underline" to="/polityka-prywatnosci/">Polityka prywatności</NuxtLink>.</p>
    <p class="text-sm text-slate-600">Szkic do akceptacji prawnej.</p>
  </Bounded>
</template>
