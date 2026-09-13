<script setup>
import FacebookIcon from '../public/facebook.svg';
import InstagramIcon from '../public/instagram.svg';
import { resolveServiceNav } from '~/data/services'
import { locations } from '~/data/locations'

const navigation = useNavigation();
const settings = useSettings();
const prismic = usePrismic()
const turek = locations.turek
const poddebice = locations.poddebice
const serviceNavItems = computed(() =>
  resolveServiceNav(
    navigation.value?.data.service_links,
    (field) => String(prismic.asText(field) || ''),
    (field) => prismic.asLink(field),
  )
)
</script>

<template>
  <footer class="bg-slate-700 px-4 py-10 mb-16 text-gray-100 sm:mb-0">
    <div class="container mx-auto grid gap-10 md:grid-cols-3">
      <nav aria-label="Usługi">
        <p class="mb-3 font-semibold tracking-tight">Usługi</p>
        <ul class="space-y-2">
          <li
            v-for="item in serviceNavItems"
            :key="item.uid"
          >
            <NuxtLink
              class="hover:underline"
              :to="item.to"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <nav aria-label="Gabinety">
        <p class="mb-3 font-semibold tracking-tight">Gabinety</p>
        <ul class="space-y-4">
          <li>
            <NuxtLink
              class="font-semibold hover:underline"
              to="/turek/"
            >
              {{ turek.city }}
            </NuxtLink>
            <p class="text-sm text-gray-200">
              {{ turek.streetAddress }}, {{ turek.postalCode }} {{ turek.addressLocality }}
            </p>
            <p
              v-if="settings?.data?.phone_turek"
              class="text-sm"
            >
              {{ settings.data.phone_turek }}
            </p>
          </li>
          <li>
            <NuxtLink
              class="font-semibold hover:underline"
              to="/poddebice/"
            >
              {{ poddebice.city }}
            </NuxtLink>
            <p class="text-sm text-gray-200">
              {{ poddebice.streetAddress }}, {{ poddebice.postalCode }} {{ poddebice.addressLocality }}
            </p>
            <p
              v-if="settings?.data?.phone_poddebice"
              class="text-sm"
            >
              {{ settings.data.phone_poddebice }}
            </p>
          </li>
        </ul>
      </nav>
      <nav aria-label="O nas">
        <p class="mb-3 font-semibold tracking-tight">O nas</p>
        <ul class="space-y-2">
          <li
            v-for="item in navigation?.data.links"
            :key="$prismic.asText(item.label) || ''"
          >
            <PrismicLink
              class="hover:underline"
              :field="item.link"
            >
              {{ $prismic.asText(item.label) }}
            </PrismicLink>
          </li>
          <li>
            <NuxtLink
              class="hover:underline"
              to="/polityka-prywatnosci/"
            >
              Prywatność
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="hover:underline"
              to="/cookies/"
            >
              Cookies
            </NuxtLink>
          </li>
        </ul>
        <div class="mt-4 flex items-center gap-3">
          <a
            href="https://www.instagram.com/klinika.dentaplus"
            target="_blank"
            aria-label="Instagram DentaPlus+"
          >
            <InstagramIcon class="w-6 h-6" />
          </a>
          <a
            href="https://www.facebook.com/dentaplusturek"
            target="_blank"
            aria-label="Facebook DentaPlus+ Turek"
          >
            <FacebookIcon class="w-6 h-6" />
          </a>
        </div>
      </nav>
    </div>
    <p class="container mx-auto mt-10 text-sm text-gray-200">
      Developed with ❤️ by&nbsp;
      <a
        href="https://www.trzos.dev"
        class="hover:underline"
        target="_blank"
      > Bartosz Trzos </a>.
    </p>
  </footer>
</template>
