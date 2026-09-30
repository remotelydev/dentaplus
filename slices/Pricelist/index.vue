<script setup lang="ts">
import { type Content } from "@prismicio/client";

const CATEGORY_LINKS: Record<string, string> = {
  implantologia: '/implanty/',
  implanty: '/implanty/',
  endodoncja: '/endodoncja/',
  ortodoncja: '/invisalign/',
  invisalign: '/invisalign/',
  radiologia: '/tomografia/',
  tomografia: '/tomografia/',
}

const props = defineProps(
  getSliceComponentProps<Content.PricelistSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);
const prismic = usePrismic()
const categoryName = computed(() => prismic.asText(props.slice.primary.name).trim())
const categoryHref = computed(() => {
  const fromCms = (props.slice.primary as { service_link?: { url?: string } }).service_link?.url
  if (fromCms) return fromCms
  const key = categoryName.value.toLowerCase()
  return CATEGORY_LINKS[key]
})

const categoryId = computed(() => categoryAnchorId(categoryName.value))

const pricelistCategories = computed(() =>
  (props.slices ?? [])
    .filter((slice): slice is Content.PricelistSlice => slice.slice_type === 'pricelist')
    .map((slice) => {
      const name = prismic.asText(slice.primary.name).trim()
      return { name, id: categoryAnchorId(name) }
    })
    .filter((item) => item.name && item.id)
)

const isFirstPricelist = computed(() => {
  const firstIndex = (props.slices ?? []).findIndex((slice) => slice.slice_type === 'pricelist')
  return firstIndex !== -1 && props.index === firstIndex
})

const showJumpNav = computed(() => isFirstPricelist.value && pricelistCategories.value.length > 1)

const jumpNav = ref<HTMLElement | null>(null)
const activeCategoryId = ref('')
let frame = 0

function updateActiveCategory() {
  frame = 0
  const navBottom = jumpNav.value?.getBoundingClientRect().bottom ?? 0
  let current = pricelistCategories.value[0]?.id ?? ''
  for (const item of pricelistCategories.value) {
    const section = document.getElementById(item.id)
    if (!section) continue
    const threshold = Math.max(navBottom, parseFloat(getComputedStyle(section).scrollMarginTop) || 0)
    if (section.getBoundingClientRect().top <= threshold + 1) current = item.id
  }
  const atPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
  const lastId = pricelistCategories.value.at(-1)?.id
  if (atPageEnd && lastId && location.hash === `#${lastId}`) current = lastId
  activeCategoryId.value = current
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(updateActiveCategory)
}

const JUMP_OFFSET_VAR = '--cennik-jump-offset'
const JUMP_GAP_PX = 16
let navObserver: ResizeObserver | null = null

function updateJumpOffset() {
  const nav = jumpNav.value
  if (!nav) return
  const stickyTop = parseFloat(getComputedStyle(nav).top) || 0
  document.documentElement.style.setProperty(JUMP_OFFSET_VAR, `${Math.ceil(stickyTop + nav.offsetHeight + JUMP_GAP_PX)}px`)
}

onMounted(() => {
  if (!showJumpNav.value) return
  updateJumpOffset()
  if (jumpNav.value) {
    navObserver = new ResizeObserver(updateJumpOffset)
    navObserver.observe(jumpNav.value)
  }
  window.addEventListener('resize', updateJumpOffset, { passive: true })
  const hashTarget = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null
  if (hashTarget?.id.startsWith('cennik-')) hashTarget.scrollIntoView()
  updateActiveCategory()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', updateJumpOffset)
  navObserver?.disconnect()
  if (showJumpNav.value) document.documentElement.style.removeProperty(JUMP_OFFSET_VAR)
  if (frame) cancelAnimationFrame(frame)
})

function categoryAnchorId(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug ? `cennik-${slug}` : ''
}
</script>

<template>
  <nav
    v-if="showJumpNav"
    ref="jumpNav"
    class="sticky top-0 z-30 border-b border-slate-200 bg-white sm:top-14"
    aria-label="Kategorie cennika"
  >
    <ul class="container mx-auto flex max-w-[1280px] flex-wrap gap-1.5 overflow-hidden px-2 py-2 text-[13px] font-semibold leading-5 sm:gap-2 sm:py-3 sm:text-sm">
      <li
        v-for="item in pricelistCategories"
        :key="item.id"
        class="min-w-0 max-w-full"
      >
        <a
          class="inline-flex max-w-full items-center rounded-full border px-3 py-1 text-slate-900 transition-colors hover:border-denta-green hover:bg-denta-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-denta-green"
          :class="activeCategoryId === item.id ? 'border-denta-green bg-denta-green' : 'border-slate-200 bg-slate-100'"
          :aria-current="activeCategoryId === item.id ? 'true' : undefined"
          :href="`#${item.id}`"
        >{{ item.name }}</a>
      </li>
    </ul>
  </nav>
  <section
    :id="categoryId || undefined"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    class="container mx-auto max-w-[1280px] scroll-mt-[var(--cennik-jump-offset,16rem)] last-of-type:mb-16 sm:scroll-mt-[var(--cennik-jump-offset,15rem)] lg:scroll-mt-[var(--cennik-jump-offset,11rem)]"
  >
    <h2
      v-if="categoryName"
      class="mt-8 mb-2 px-2 font-semibold text-2xl"
    >
      <NuxtLink
        v-if="categoryHref"
        class="underline"
        :to="categoryHref"
      >
        {{ categoryName }}
      </NuxtLink>
      <template v-else>{{ categoryName }}</template>
    </h2>
    <div
      v-for="(item, i) in slice.items"
      :key="`${item.name}-price`"
      class="w-full flex justify-between p-2 hover:bg-slate-800 hover:text-slate-100"
      :class="i % 2 === 1 ? 'bg-slate-100' : ''"
    >
      <div class="basis-3/4">
        {{ item.name }}
      </div>
      <div class="basis-1/4 flex justify-end items-center text-no-wrap">
        {{ item.price?.trim() || 'cena po konsultacji' }}
      </div>
    </div>
  </section>
</template>
