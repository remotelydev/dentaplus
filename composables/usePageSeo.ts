import type { ComputedRef, Ref } from 'vue'
import { toCanonicalUrl } from '../utils/canonical.mjs'

type SeoValue<T> = Ref<T> | ComputedRef<T>

export type SeoDocumentData = {
  meta_title?: string | null
  meta_description?: string | null
  meta_image?: {
    url?: string | null
  } | null
}

export const BRAND_NAME = 'DentaPlus+'

const descriptions: Record<string, string> = {
  '/': 'DentaPlus+ to gabinety stomatologiczne w Turku i Poddębicach. Poznaj naszych specjalistów i sprawdź zakres leczenia.',
  '/cennik': 'Sprawdź cennik usług stomatologicznych DentaPlus+ w Turku i Poddębicach.',
  '/kontakt': 'Skontaktuj się z gabinetami DentaPlus+ w Turku i Poddębicach. Sprawdź adresy, telefony i godziny otwarcia.',
  '/zespol': 'Poznaj zespół lekarzy dentystów i specjalistów DentaPlus+ w Turku i Poddębicach.',
  '/metamorfozy': 'Zobacz metamorfozy uśmiechu i efekty leczenia stomatologicznego w DentaPlus+.',
  '/galeria': 'Zobacz galerię gabinetów stomatologicznych DentaPlus+ w Turku i Poddębicach.',
  '/invisalign': 'Leczenie nakładkowe Invisalign w DentaPlus+. Poznaj możliwości estetycznej ortodoncji.',
  '/implanty': 'Implantologia w DentaPlus+. Sprawdź możliwości odbudowy brakujących zębów.',
  '/itero': 'Skaner iTero w DentaPlus+. Cyfrowa diagnostyka i planowanie leczenia stomatologicznego.',
  '/tomografia': 'Tomografia 3D w DentaPlus+. Precyzyjna diagnostyka i planowanie leczenia stomatologicznego.',
  '/endodoncja': 'Endodoncja pod mikroskopem w DentaPlus+. Precyzyjne leczenie kanałowe.',
  '/uslugi': 'Implanty, Invisalign, leczenie kanałowe, iTero i tomografia 3D w gabinetach DentaPlus+ w Turku i Poddębicach.',
  '/turek': 'Gabinet stomatologiczny DentaPlus+ w Turku, ul. Łąkowa 10. Implanty, Invisalign, leczenie kanałowe i tomografia 3D.',
  '/poddebice': 'Gabinet stomatologiczny DentaPlus+ w Poddębicach, ul. Krasickiego 1C. Sprawdź adres, telefon i godziny otwarcia.',
  '/polityka-prywatnosci': 'Polityka prywatności gabinetów stomatologicznych DentaPlus+ w Turku i Poddębicach.',
  '/cookies': 'Informacja o plikach cookies na stronie DentaPlus+.',
}

export const TITLE_FALLBACKS: Record<string, string> = {
  '/cennik': 'Cennik stomatologiczny Turek i Poddębice | DentaPlus+',
  '/kontakt': 'Kontakt — gabinety w Turku i Poddębicach | DentaPlus+',
  '/zespol': 'Zespół stomatologów Turek i Poddębice | DentaPlus+',
  '/metamorfozy': 'Metamorfozy uśmiechu | DentaPlus+',
  '/galeria': 'Galeria gabinetów Turek i Poddębice | DentaPlus+',
  '/invisalign': 'Invisalign Turek i Poddębice | DentaPlus+',
  '/implanty': 'Implanty zębów Turek i Poddębice | DentaPlus+',
  '/itero': 'Skaner iTero Turek i Poddębice | DentaPlus+',
  '/tomografia': 'Tomografia 3D Turek i Poddębice | DentaPlus+',
  '/endodoncja': 'Leczenie kanałowe Turek i Poddębice | DentaPlus+',
  '/turek': 'Stomatolog Turek — gabinet DentaPlus+ | DentaPlus+',
  '/poddebice': 'Stomatolog Poddębice — gabinet DentaPlus+ | DentaPlus+',
  '/polityka-prywatnosci': 'Polityka prywatności | DentaPlus+',
  '/cookies': 'Polityka cookies | DentaPlus+',
  '/uslugi': 'Usługi stomatologiczne Turek i Poddębice | DentaPlus+',
}

const isBrandName = (value?: string | null) => {
  const normalized = value?.replace(/\s+/g, ' ').trim()
  return !normalized || normalized === BRAND_NAME || /^DentaPlus\s*\+?$/.test(normalized)
}

export const humanizeUid = (uid: string) =>
  uid
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())

export const formatPageTitle = ({
  metaTitle,
  contentTitle,
  siteTitle,
  uid,
  path,
}: {
  metaTitle?: string | null
  contentTitle?: string | null
  siteTitle?: string | null
  uid?: string | null
  path?: string | null
}) => {
  const meta = metaTitle?.trim()
  if (meta) return meta

  const brand = siteTitle?.trim() || BRAND_NAME
  const pathKey = !path || path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`
  if (TITLE_FALLBACKS[pathKey]) return TITLE_FALLBACKS[pathKey]

  if (!isBrandName(contentTitle)) {
    const page = contentTitle!.trim()
    if (page.includes(brand) && page.includes('|')) return page
    return `${page} | ${brand}`
  }

  if (uid) return `${humanizeUid(uid)} | ${brand}`
  return brand
}

export const usePageSeo = (options: {
  title: SeoValue<string>
  description?: SeoValue<string | undefined>
  image?: SeoValue<string | undefined>
}) => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = String(runtimeConfig.public.siteUrl || 'https://www.dentaplus.pl').replace(/\/$/, '')
  const canonicalUrl = computed(() => toCanonicalUrl(siteUrl, route.path))
  const descriptionPath = computed(() => route.path === '/' ? '/' : route.path.replace(/\/+$/, ''))
  const description = computed(() => {
    const value = options.description?.value?.trim()
    return value || descriptions[descriptionPath.value] || `${options.title.value} — DentaPlus+ w Turku i Poddębicach.`
  })

  const defaultOgImage = `${siteUrl}/og-default.png`
  const ogImage = computed(() => options.image?.value || defaultOgImage)

  useHead({
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl,
      },
    ],
    meta: [
      {
        name: 'robots',
        content: 'index,follow',
      },
    ],
  })

  useSeoMeta({
    title: () => options.title.value,
    description: () => description.value,
    ogTitle: () => options.title.value,
    ogDescription: () => description.value,
    ogUrl: () => canonicalUrl.value,
    ogType: 'website',
    ogLocale: 'pl_PL',
    ogSiteName: 'DentaPlus+',
    ogImage: () => ogImage.value,
    ogImageAlt: () => options.title.value,
    twitterCard: 'summary_large_image',
    twitterTitle: () => options.title.value,
    twitterDescription: () => description.value,
    twitterImage: () => ogImage.value,
  })
}
