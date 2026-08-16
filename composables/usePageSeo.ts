import type { ComputedRef, Ref } from 'vue'

type SeoValue<T> = Ref<T> | ComputedRef<T>

export type SeoDocumentData = {
  meta_title?: string | null
  meta_description?: string | null
  meta_image?: {
    url?: string | null
  } | null
}

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
}

const normalizePath = (path: string) => {
  if (path === '/') return '/'
  return `/${path.replace(/^\/+|\/+$/g, '')}/`
}

export const usePageSeo = (options: {
  title: SeoValue<string>
  description?: SeoValue<string | undefined>
  image?: SeoValue<string | undefined>
}) => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = String(runtimeConfig.public.siteUrl || 'https://www.dentaplus.pl').replace(/\/$/, '')
  const canonicalUrl = computed(() => new URL(normalizePath(route.path), `${siteUrl}/`).toString())
  const descriptionPath = computed(() => route.path === '/' ? '/' : route.path.replace(/\/+$/, ''))
  const description = computed(() => {
    const value = options.description?.value?.trim()
    return value || descriptions[descriptionPath.value] || `${options.title.value} — DentaPlus+ w Turku i Poddębicach.`
  })

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
    ogImage: () => options.image?.value,
    ogImageAlt: () => options.title.value,
    twitterCard: 'summary_large_image',
    twitterTitle: () => options.title.value,
    twitterDescription: () => description.value,
    twitterImage: () => options.image?.value,
  })
}
