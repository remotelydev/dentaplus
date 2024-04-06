<script setup lang="ts">
import { ref, watch } from 'vue';
import BurgerIcon from '../public/burger.svg';
import CloseIcon from '../public/close.svg';
import FacebookIcon from '../public/facebook.svg';
import InstagramIcon from '../public/instagram.svg';

const navigation = useNavigation();
const settings = useSettings();

const isMobileMenuOpen = ref(false);

watch(isMobileMenuOpen, (nextIsMobileMenuOpen) => {
  if (nextIsMobileMenuOpen) {
    document?.body.classList.add('overflow-hidden')
  } else {
    document?.body.classList.remove('overflow-hidden')
  }
})
</script>

<template>
  <Bounded
    class="relative"
    as="header"
    y-padding="sm"
  >
    <div class="flex items-center justify-between leading-none">
      <div class="dummy invisible basis-8 md:hidden" />
      <NuxtLink
        to="/"
        @click="isMobileMenuOpen = false"
      >
        <img
          class="h-16 md:h-16"
          :src="$prismic.asImageSrc(settings?.data.logo)"
          alt="Logo"
        >
      </NuxtLink>
      <button
        type="button"
        class="md:hidden"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <BurgerIcon
          v-if="!isMobileMenuOpen"
          class="w-8 h-8"
        />
        <CloseIcon
          v-else
          class="w-8 h-8"
        />
      </button>
      <nav class="hidden md:block">
        <ul class="flex flex-wrap items-center gap-8 lg:gap-10">
          <li
            v-for="link, i in navigation?.data.links"
            :key="`desktop-link-${i}`"
            class="font-semibold tracking-tight text-slate-800 hover:underline"
          >
            <PrismicLink :field="link.link">
              {{ $prismic.asText(link.label) }}
            </PrismicLink>
          </li>
          <!-- <li>
            <a href="https://www.facebook.com/dentaplusturek" target="_blank">
              <FacebookIcon class="w-6 h-6" />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/klinika.dentaplus" target="_blank">
              <InstagramIcon class="w-6 h-6" />
            </a>
          </li> -->
        </ul>
      </nav>
      <nav
        :class="isMobileMenuOpen ? 'block' : 'hidden'"
        class="absolute right-0 top-full w-screen h-screen flex flex-col z-10 bg-white"
        @click="isMobileMenuOpen = false"
      >
        <PrismicLink
          v-for="link, i in navigation?.data.links"
          :key="`mobile-link-${i}`"
          class="px-6 py-4 font-bold text-center"
          :class="i % 2 === 0 ? 'bg-slate-100' : ''"
          :field="link.link"
        >
          {{ $prismic.asText(link.label) }}
        </PrismicLink>
        <div class="flex justify-center gap-8 p-8">
          <a
            href="https://www.facebook.com/dentaplusturek"
            target="_blank"
          >
            <FacebookIcon class="w-8 h-8" />
          </a>
          <a
            href="https://www.instagram.com/klinika.dentaplus"
            target="_blank"
          >
            <InstagramIcon class="w-8 h-8" />
          </a>
        </div>
      </nav>
    </div>
  </Bounded>
</template>
