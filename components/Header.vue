<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import BurgerIcon from '../public/burger.svg';
import ChevronIcon from '../public/chevron.svg';
import CloseIcon from '../public/close.svg';
import FacebookIcon from '../public/facebook.svg';
import InstagramIcon from '../public/instagram.svg';
import { resolveServiceNav } from '~/data/services'
import { locations } from '~/data/locations'

const navigation = useNavigation();
const settings = useSettings();
const prismic = usePrismic()

const isMobileMenuOpen = ref(false);
const isServicesOpen = ref(false);
const isKontaktOpen = ref(false);
const desktopServices = ref<HTMLElement | null>(null);
const desktopKontakt = ref<HTMLElement | null>(null);

const clinics = [locations.turek, locations.poddebice].map(location => ({
  to: `/${location.uid}/`,
  city: location.city,
  address: location.streetAddress,
}))

type DesktopMenu = 'services' | 'kontakt'

const HOVER_OPEN_DELAY = 120
const HOVER_CLOSE_DELAY = 220

const openDesktopMenu = ref<DesktopMenu | null>(null)
// A menu opened by click or keyboard stays open when the pointer leaves it.
const isDesktopMenuPinned = ref(false)
const isDesktopServicesOpen = computed(() => openDesktopMenu.value === 'services')
const isDesktopKontaktOpen = computed(() => openDesktopMenu.value === 'kontakt')
let hoverTimer: ReturnType<typeof setTimeout> | undefined

const clearHoverTimer = () => {
  clearTimeout(hoverTimer)
  hoverTimer = undefined
}

const closeDesktopMenu = () => {
  clearHoverTimer()
  openDesktopMenu.value = null
  isDesktopMenuPinned.value = false
}

const closeDesktopServices = () => {
  if (isDesktopServicesOpen.value) closeDesktopMenu()
}

const closeDesktopKontakt = () => {
  if (isDesktopKontaktOpen.value) closeDesktopMenu()
}

const onDesktopMenuPointerEnter = (menu: DesktopMenu, event: PointerEvent) => {
  if (event.pointerType !== 'mouse') return
  clearHoverTimer()
  if (openDesktopMenu.value === menu) return
  const delay = openDesktopMenu.value ? 0 : HOVER_OPEN_DELAY
  hoverTimer = setTimeout(() => {
    openDesktopMenu.value = menu
    isDesktopMenuPinned.value = false
  }, delay)
}

const onDesktopMenuPointerLeave = (menu: DesktopMenu, event: PointerEvent) => {
  if (event.pointerType !== 'mouse') return
  clearHoverTimer()
  if (isDesktopMenuPinned.value) return
  hoverTimer = setTimeout(() => {
    if (openDesktopMenu.value === menu) closeDesktopMenu()
  }, HOVER_CLOSE_DELAY)
}

const toggleDesktopMenu = (menu: DesktopMenu) => {
  clearHoverTimer()
  if (openDesktopMenu.value === menu && isDesktopMenuPinned.value) {
    closeDesktopMenu()
    return
  }
  openDesktopMenu.value = menu
  isDesktopMenuPinned.value = true
}

const menuLinks = (container: EventTarget | null) =>
  Array.from((container as HTMLElement | null)?.querySelectorAll<HTMLElement>('[data-submenu] a') || [])

const onDesktopMenuKeydown = (menu: DesktopMenu, event: KeyboardEvent) => {
  const container = event.currentTarget as HTMLElement | null
  if (event.key === 'Escape' && openDesktopMenu.value === menu) {
    closeDesktopMenu()
    container?.querySelector('button')?.focus()
    return
  }
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()
  if (openDesktopMenu.value !== menu) {
    openDesktopMenu.value = menu
    isDesktopMenuPinned.value = true
  }
  nextTick(() => {
    const links = menuLinks(container)
    if (!links.length) return
    const current = links.indexOf(document.activeElement as HTMLElement)
    const step = event.key === 'ArrowDown' ? 1 : -1
    const next = current === -1
      ? (step === 1 ? 0 : links.length - 1)
      : (current + step + links.length) % links.length
    links[next]?.focus()
  })
}

const onDesktopMenuFocusout = (menu: DesktopMenu, event: FocusEvent) => {
  const container = event.currentTarget as HTMLElement | null
  if (container?.contains(event.relatedTarget as Node | null)) return
  if (openDesktopMenu.value === menu) closeDesktopMenu()
}

onBeforeUnmount(clearHoverTimer)

const navLinkPath = (link: unknown) => {
  const href = prismic.asLink(link as never) || ''
  try {
    const path = href.startsWith('http') ? new URL(href).pathname : href
    return path.replace(/\/$/, '') || '/'
  } catch {
    return href
  }
}

const isKontaktItem = (item: { label?: unknown, link?: unknown }) => {
  const label = String(prismic.asText(item.label as never) || '').toLowerCase()
  return label.includes('kontakt') || navLinkPath(item.link) === '/kontakt'
}

const isGaleriaItem = (item: { label?: unknown, link?: unknown }) => {
  const label = String(prismic.asText(item.label as never) || '').toLowerCase()
  return label.includes('galeria') || navLinkPath(item.link) === '/galeria'
}

const kontaktItem = computed(() =>
  (navigation.value?.data.links || []).find(item => isKontaktItem(item))
)
const desktopNavLinks = computed(() =>
  (navigation.value?.data.links || []).filter(item => !isKontaktItem(item) && !isGaleriaItem(item))
)
const serviceNavItems = computed(() =>
  resolveServiceNav(
    navigation.value?.data.service_links,
    (field) => String(prismic.asText(field as never) || ''),
    (field) => prismic.asLink(field as never),
  )
)

onClickOutside(desktopServices, closeDesktopServices)
onClickOutside(desktopKontakt, closeDesktopKontakt)

watch(isMobileMenuOpen, (nextIsMobileMenuOpen) => {
  if (nextIsMobileMenuOpen) {
    document?.body.classList.add('overflow-hidden')
  } else {
    document?.body.classList.remove('overflow-hidden')
    isServicesOpen.value = false
    isKontaktOpen.value = false
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
            v-for="link, i in desktopNavLinks"
            :key="`desktop-link-${i}`"
            class="font-semibold tracking-tight text-slate-800 hover:underline"
          >
            <PrismicLink :field="link.link">
              {{ $prismic.asText(link.label) }}
            </PrismicLink>
          </li>
          <li
            ref="desktopServices"
            class="relative font-semibold tracking-tight text-slate-800"
            @pointerenter="onDesktopMenuPointerEnter('services', $event)"
            @pointerleave="onDesktopMenuPointerLeave('services', $event)"
            @keydown="onDesktopMenuKeydown('services', $event)"
            @focusout="onDesktopMenuFocusout('services', $event)"
          >
            <div class="flex items-center gap-1">
              <NuxtLink
                class="hover:underline"
                to="/uslugi/"
              >
                Usługi
              </NuxtLink>
              <button
                type="button"
                class="p-1 rounded-full hover:bg-slate-100"
                :aria-expanded="isDesktopServicesOpen"
                aria-controls="desktop-services-menu"
                aria-haspopup="true"
                aria-label="Pokaż listę usług"
                @click="toggleDesktopMenu('services')"
              >
                <ChevronIcon
                  aria-hidden="true"
                  class="w-4 h-4 transition-transform duration-200"
                  :class="isDesktopServicesOpen ? '-rotate-90' : 'rotate-90'"
                />
              </button>
            </div>
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              leave-active-class="transition duration-100 ease-in"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div
                v-show="isDesktopServicesOpen"
                class="absolute -right-4 top-full z-20 pt-3 xl:right-auto xl:-left-4"
              >
                <ul
                  id="desktop-services-menu"
                  data-submenu
                  class="min-w-[16rem] rounded-2xl bg-white p-2 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5"
                >
                  <li
                    v-for="item in serviceNavItems"
                    :key="item.uid"
                  >
                    <NuxtLink
                      class="group flex items-center justify-between gap-6 rounded-xl border-l-4 border-transparent px-4 py-3 text-base transition-colors hover:border-denta-green hover:bg-slate-50 focus-visible:border-denta-green focus-visible:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-800"
                      exact-active-class="border-denta-green bg-slate-50"
                      :to="item.to"
                      @click="closeDesktopMenu"
                    >
                      {{ item.label }}
                      <ChevronIcon
                        aria-hidden="true"
                        class="w-3 h-3 text-slate-400 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0"
                      />
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </Transition>
          </li>
          <li
            ref="desktopKontakt"
            class="relative font-semibold tracking-tight text-slate-800"
            @pointerenter="onDesktopMenuPointerEnter('kontakt', $event)"
            @pointerleave="onDesktopMenuPointerLeave('kontakt', $event)"
            @keydown="onDesktopMenuKeydown('kontakt', $event)"
            @focusout="onDesktopMenuFocusout('kontakt', $event)"
          >
            <div class="flex items-center gap-1">
              <PrismicLink
                v-if="kontaktItem"
                class="hover:underline"
                :field="kontaktItem.link"
              >
                {{ $prismic.asText(kontaktItem.label) }}
              </PrismicLink>
              <NuxtLink
                v-else
                class="hover:underline"
                to="/kontakt/"
              >
                Kontakt
              </NuxtLink>
              <button
                type="button"
                class="p-1 rounded-full hover:bg-slate-100"
                :aria-expanded="isDesktopKontaktOpen"
                aria-controls="desktop-kontakt-menu"
                aria-haspopup="true"
                aria-label="Pokaż gabinety"
                @click="toggleDesktopMenu('kontakt')"
              >
                <ChevronIcon
                  aria-hidden="true"
                  class="w-4 h-4 transition-transform duration-200"
                  :class="isDesktopKontaktOpen ? '-rotate-90' : 'rotate-90'"
                />
              </button>
            </div>
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              leave-active-class="transition duration-100 ease-in"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div
                v-show="isDesktopKontaktOpen"
                class="absolute -right-4 top-full z-20 pt-3"
              >
                <ul
                  id="desktop-kontakt-menu"
                  data-submenu
                  class="min-w-[16rem] rounded-2xl bg-white p-2 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5"
                >
                  <li
                    v-for="clinic in clinics"
                    :key="clinic.to"
                  >
                    <NuxtLink
                      class="group flex items-center justify-between gap-6 rounded-xl border-l-4 border-transparent px-4 py-3 transition-colors hover:border-denta-green hover:bg-slate-50 focus-visible:border-denta-green focus-visible:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-800"
                      exact-active-class="border-denta-green bg-slate-50"
                      :to="clinic.to"
                      @click="closeDesktopMenu"
                    >
                      <span class="flex flex-col gap-1">
                        <span class="text-base">{{ clinic.city }}</span>
                        <span class="text-sm font-normal tracking-normal text-slate-500">{{ clinic.address }}</span>
                      </span>
                      <ChevronIcon
                        aria-hidden="true"
                        class="w-3 h-3 text-slate-400 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0"
                      />
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </Transition>
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
        class="absolute right-0 top-full w-screen h-screen flex flex-col z-10 overflow-y-auto overscroll-contain bg-white pb-48"
        @click="isMobileMenuOpen = false"
      >
        <PrismicLink
          v-for="link, i in desktopNavLinks"
          :key="`mobile-link-${i}`"
          class="px-6 py-4 font-bold text-center"
          :class="i % 2 === 0 ? 'bg-slate-100' : ''"
          :field="link.link"
        >
          {{ $prismic.asText(link.label) }}
        </PrismicLink>
        <div class="flex items-center bg-white">
          <NuxtLink
            class="flex-1 py-4 pl-16 font-bold text-center"
            to="/uslugi/"
          >
            Usługi
          </NuxtLink>
          <button
            type="button"
            class="flex h-14 w-16 items-center justify-center"
            :aria-expanded="isServicesOpen"
            aria-controls="mobile-services-menu"
            aria-label="Pokaż listę usług"
            @click.stop="isServicesOpen = !isServicesOpen"
          >
            <span
              class="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
              :class="isServicesOpen ? 'bg-denta-green' : 'bg-slate-100'"
            >
              <ChevronIcon
                aria-hidden="true"
                class="w-4 h-4 transition-transform duration-200"
                :class="isServicesOpen ? '-rotate-90' : 'rotate-90'"
              />
            </span>
          </button>
        </div>
        <div
          v-show="isServicesOpen"
          id="mobile-services-menu"
          class="mx-4 mb-3 rounded-2xl bg-slate-50 p-2"
        >
          <NuxtLink
            v-for="item in serviceNavItems"
            :key="`mobile-service-${item.uid}`"
            class="block rounded-xl px-4 py-3.5 text-base font-semibold text-center active:bg-white"
            exact-active-class="bg-white ring-1 ring-denta-green"
            :to="item.to"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
        <div class="flex items-center bg-slate-100">
          <PrismicLink
            v-if="kontaktItem"
            class="flex-1 py-4 pl-16 font-bold text-center"
            :field="kontaktItem.link"
          >
            {{ $prismic.asText(kontaktItem.label) }}
          </PrismicLink>
          <NuxtLink
            v-else
            class="flex-1 py-4 pl-16 font-bold text-center"
            to="/kontakt/"
          >
            Kontakt
          </NuxtLink>
          <button
            type="button"
            class="flex h-14 w-16 items-center justify-center"
            :aria-expanded="isKontaktOpen"
            aria-controls="mobile-kontakt-menu"
            aria-label="Pokaż gabinety"
            @click.stop="isKontaktOpen = !isKontaktOpen"
          >
            <span
              class="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
              :class="isKontaktOpen ? 'bg-denta-green' : 'bg-white'"
            >
              <ChevronIcon
                aria-hidden="true"
                class="w-4 h-4 transition-transform duration-200"
                :class="isKontaktOpen ? '-rotate-90' : 'rotate-90'"
              />
            </span>
          </button>
        </div>
        <div
          v-show="isKontaktOpen"
          id="mobile-kontakt-menu"
          class="mx-4 my-3 rounded-2xl bg-slate-50 p-2"
        >
          <NuxtLink
            v-for="clinic in clinics"
            :key="`mobile-clinic-${clinic.to}`"
            class="flex flex-col items-center gap-1 rounded-xl px-4 py-3.5 text-center active:bg-white"
            exact-active-class="bg-white ring-1 ring-denta-green"
            :to="clinic.to"
          >
            <span class="text-base font-semibold">{{ clinic.city }}</span>
            <span class="text-sm text-slate-500">{{ clinic.address }}</span>
          </NuxtLink>
        </div>
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
