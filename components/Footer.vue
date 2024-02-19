<script setup>
import FacebookIcon from '../public/facebook.svg';
import InstagramIcon from '../public/instagram.svg';
const navigation = useNavigation();
</script>

<template>
  <footer class="py-6 px-4 mb-16 text-gray-100 bg-slate-700 sm:mb-0">
    <div
      class="container mx-auto flex flex-col-reverse justify-between md:flex-row"
    >
      <div class="mt-6 md:m-0">
        Developed with ❤️ by&nbsp;
        <a href="http://www.trzos.dev" target="_blank"> Bartosz Trzos </a>.
      </div>
      <nav class="flex justify-between items-center flex-wrap gap-4 order-1">
        <PrismicLink
          v-for="item in navigation?.data.links"
          :key="$prismic.asText(item.label) || ''"
          class="basis-1/3 md:basis-1 whitespace-nowrap"
          :field="item.link"
        >
          {{ $prismic.asText(item.label) }}
        </PrismicLink>
        <div class="flex items-center basis-1/3 gap-2 md:basis-1">
          <a href="https://www.instagram.com/klinika.dentaplus" target="_blank">
            <InstagramIcon class="w-6 h-6" />
          </a>
          <a href="https://www.facebook.com/dentaplusturek" target="_blank">
            <FacebookIcon class="w-6 h-6" />
          </a>
        </div>
      </nav>
    </div>
  </footer>
</template>
