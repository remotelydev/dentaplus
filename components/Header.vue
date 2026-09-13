<script setup lang="ts">
import { ref, watch } from 'vue';
import BurgerIcon from '../public/burger.svg';
import CloseIcon from '../public/close.svg';
import FacebookIcon from '../public/facebook.svg';
import InstagramIcon from '../public/instagram.svg';
import { SERVICE_NAV } from '~/data/services'
import { normalizeTelHref } from '~/composables/usePhoneLink'

const navigation = useNavigation();
const settings = useSettings();
const turekTel = computed(() => normalizeTelHref(settings.value?.data.phone_turek))
const poddebiceTel = computed(() => normalizeTelHref(settings.value?.data.phone_poddebice))

const isMobileMenuOpen = ref(false);
const isServicesOpen = ref(false);

watch(isMobileMenuOpen, (nextIsMobileMenuOpen) => {
  if (nextIsMobileMenuOpen) {
    document?.body.classList.add('overflow-hidden')
  } else {
    document?.body.classList.remove('overflow-hidden')
    isServicesOpen.value = false
  }
})
</script>

<template>
  <Bounded
    class="relative"
    as="header"
    y-padding="sm"
  >
    <div class="flex items-center justify-between gap-4 leading-none">
      <NuxtLink
        to="/"
        class="shrink-0"
        @click="isMobileMenuOpen = false"
      >
        <img
          v-if="settings?.data?.logo"
          class="h-16 md:h-16"
          :src="$prismic.asImageSrc(settings.data.logo)"
          alt="DentaPlus+"
        >
        <span v-else class="text-xl font-semibold tracking-tight text-slate-800">DentaPlus+</span>
      </NuxtLink>
      <button
        type="button"
        class="shrink-0 md:hidden"
        :aria-label="isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'"
        :aria-expanded="isMobileMenuOpen"
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
          <li class="relative font-semibold tracking-tight text-slate-800 group">
            <span class="hover:underline">Usługi</span>
            <ul class="absolute left-0 top-full hidden group-hover:block bg-white shadow-md py-2 min-w-[12rem] z-20">
              <li v-for="item in SERVICE_NAV" :key="item.uid">
                <NuxtLink class="block px-4 py-2 hover:bg-slate-100" :to="item.to">{{ item.label }}</NuxtLink>
              </li>
            </ul>
          </li>
          <li class="font-semibold tracking-tight text-slate-800 hover:underline">
            <NuxtLink to="/turek/">Turek</NuxtLink>
          </li>
          <li class="font-semibold tracking-tight text-slate-800 hover:underline">
            <NuxtLink to="/poddebice/">Poddębice</NuxtLink>
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
      <div
        v-if="turekTel || poddebiceTel"
        class="hidden md:flex shrink-0 items-center gap-2"
      >
        <span class="text-sm font-semibold text-denta-ink">Umów wizytę</span>
        <a
          v-if="turekTel"
          :href="turekTel"
          class="rounded-full bg-denta-lime px-3 py-2 text-sm font-semibold text-denta-ink"
        >
          Turek
        </a>
        <a
          v-if="poddebiceTel"
          :href="poddebiceTel"
          class="rounded-full bg-denta-lime px-3 py-2 text-sm font-semibold text-denta-ink"
        >
          Poddębice
        </a>
      </div>
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
        <button
          type="button"
          class="px-6 py-4 font-bold text-center bg-white"
          @click.stop="isServicesOpen = !isServicesOpen"
        >
          Usługi
        </button>
        <NuxtLink
          v-for="item in SERVICE_NAV"
          v-show="isServicesOpen"
          :key="`mobile-service-${item.uid}`"
          class="px-6 py-3 font-semibold text-center bg-slate-50"
          :to="item.to"
        >
          {{ item.label }}
        </NuxtLink>
        <NuxtLink class="px-6 py-4 font-bold text-center bg-slate-100" to="/turek/">Turek</NuxtLink>
        <NuxtLink class="px-6 py-4 font-bold text-center" to="/poddebice/">Poddębice</NuxtLink>
        <div class="flex justify-center gap-8 p-8">
          <a
            href="https://www.facebook.com/dentaplusturek"
            target="_blank"
            aria-label="Facebook DentaPlus+ Turek"
          >
            <FacebookIcon class="w-8 h-8" />
          </a>
          <a
            href="https://www.instagram.com/klinika.dentaplus"
            target="_blank"
            aria-label="Instagram DentaPlus+"
          >
            <InstagramIcon class="w-8 h-8" />
          </a>
        </div>
      </nav>
    </div>
  </Bounded>
</template>
