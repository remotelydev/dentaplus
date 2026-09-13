<script setup lang="ts">
import { locations } from '~/data/locations'

const prismic = usePrismic()
const settings = useSettings()
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const siteUrl = String(runtimeConfig.public.siteUrl || 'https://www.dentaplus.pl').replace(/\/$/, '')
const rasterImage = `${siteUrl}/denta-mark.png`

const dentistNode = (
  location: (typeof locations)['turek'] | (typeof locations)['poddebice'],
  organizationId: string,
  phone?: string,
  coords: { lat: number, lng: number },
) => ({
  '@type': 'Dentist',
  '@id': `${siteUrl}/${location.uid}/#clinic`,
  name: location.name,
  url: `${siteUrl}/${location.uid}/`,
  image: rasterImage,
  telephone: normalizePhoneDigits(phone),
  priceRange: '$$',
  parentOrganization: { '@id': organizationId },
  areaServed: {
    '@type': 'City',
    name: location.addressLocality,
  },
  hasMap: location.mapSrc.replace('/maps/embed?', '/maps?'),
  geo: {
    '@type': 'GeoCoordinates',
    latitude: coords.lat,
    longitude: coords.lng,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: location.streetAddress,
    postalCode: location.postalCode,
    addressLocality: location.addressLocality,
    addressCountry: 'PL',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '15:00',
    },
  ],
})

const breadcrumbSchema = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Strona główna',
      item: `${siteUrl}/`,
    },
    ...segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}/`
      return {
        '@type': 'ListItem',
        position: index + 2,
        name: decodeURIComponent(segment).replace(/-/g, ' '),
        item: `${siteUrl}${path}`,
      }
    }),
  ]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
})

const businessSchema = computed(() => {
  const organizationId = `${siteUrl}/#organization`
  const logo = settings.value?.data.logo
    ? prismic.asImageSrc(settings.value.data.logo)
    : rasterImage

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'DentaPlus+',
        url: `${siteUrl}/`,
        logo,
        image: rasterImage,
        sameAs: [
          'https://www.facebook.com/dentaplusturek',
          'https://www.facebook.com/dentapluspoddebice',
          'https://www.instagram.com/klinika.dentaplus',
        ],
      },
      dentistNode(locations.turek, organizationId, settings.value?.data.phone_turek, {
        lat: 52.010363,
        lng: 18.49203,
      }),
      dentistNode(locations.poddebice, organizationId, settings.value?.data.phone_poddebice, {
        lat: 51.899086,
        lng: 18.954593,
      }),
    ],
  }
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify(businessSchema.value)),
    },
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify(breadcrumbSchema.value)),
    },
  ],
})
</script>

<template>
  <div class="text-slate-800">
    <!-- TODO: Remove the following element once you have read the documentation.
    <DevOnly>
      <div
        :style="{
          background: '#5163ba',
          padding: '1rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#fff'
        }"
      >
        <p>
          <strong>👋 Welcome to your new website!</strong> To customize the code
          and content of this site,&nbsp;<a
            href="https://github.com/prismicio-community/nuxt-starter-prismic-multi-page/tree/master/docs"
            target="_blank"
            rel="noreferrer"
            :style="{
              textDecoration: 'underline'
            }"
          >see the documentation</a>. Remove this bar in <code>layouts/default.vue</code>.
        </p>
      </div>
    </DevOnly> -->
    <ContactBar />
    <Header />
    <slot />
    <Footer />
  </div>
</template>
