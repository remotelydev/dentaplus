<script setup lang="ts">
usePageSeo({
  title: computed(() => 'Polityka prywatności | DentaPlus+'),
  description: computed(() => 'Polityka prywatności gabinetów stomatologicznych DentaPlus+ w Turku i Poddębicach. Informacje o przetwarzaniu danych osobowych (RODO).'),
})
</script>

<template>
  <Bounded as="main" y-padding="base">
    <h1 class="text-4xl font-semibold mb-6">Polityka prywatności</h1>
    <p class="mb-4">Administratorem danych osobowych pacjentów i użytkowników strony dentaplus.pl jest DentaPlus+ (gabinety w Turku, ul. Łąkowa 10 oraz w Poddębicach, ul. Krasickiego 1C).</p>
    <h2 class="text-2xl font-semibold mt-8 mb-3">Jakie dane przetwarzamy</h2>
    <p class="mb-4">Dane podane przy umawianiu wizyty (imię, nazwisko, telefon, e-mail, informacje medyczne niezbędne do leczenia) oraz dane techniczne z serwera (adres IP, logi) w zakresie wymaganym przepisami.</p>
    <h2 class="text-2xl font-semibold mt-8 mb-3">Cele i podstawy</h2>
    <p class="mb-4">Leczenie i dokumentacja medyczna (obowiązek prawny i umowa), kontakt w sprawie wizyty, rozliczenia oraz — za zgodą — marketing. Nie sprzedajemy danych.</p>
    <h2 class="text-2xl font-semibold mt-8 mb-3">Prawa</h2>
    <p class="mb-4">Przysługuje Ci dostęp, sprostowanie, ograniczenie, sprzeciw, przenoszenie danych oraz skarga do Prezesa UODO. W sprawach RODO napisz na adres e-mail gabinetu z zakładki Kontakt.</p>
    <p class="text-sm text-slate-600">To szkic do akceptacji prawnej przed publikacją jako ostateczna treść.</p>
  </Bounded>
</template>
