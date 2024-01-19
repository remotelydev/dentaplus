<script setup>
const navigation = useNavigation();
</script>

<template>
  <footer class="py-6 px-4 text-gray-200 bg-slate-700">
    <div
      class="container mx-auto flex flex-col-reverse justify-between md:flex-row"
    >
      <div class="mt-6 md:m-0">
        Developed with ❤️ by&nbsp;
        <a href="http://www.trzos.dev" target="_blank"> Bartosz Trzos </a>.
      </div>
      <nav class="flex flex-wrap gap-4 order-1">
        <PrismicLink
          v-for="item in navigation?.data.links"
          class="basis-1/3 md:basis-1 whitespace-nowrap"
          :field="item.link"
          :key="$prismic.asText(item.label) || ''"
        >
          {{ $prismic.asText(item.label) }}
        </PrismicLink>
      </nav>
    </div>
  </footer>
</template>
