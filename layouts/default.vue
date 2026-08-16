<script setup lang="ts">
const prismic = usePrismic()
const settings = useSettings()
const runtimeConfig = useRuntimeConfig()
const siteUrl = String(runtimeConfig.public.siteUrl || 'https://www.dentaplus.pl').replace(/\/$/, '')

const normalizePhone = (phone?: string | null) => phone?.replace(/[^\d+]/g, '') || undefined

const businessSchema = computed(() => {
  const organizationId = `${siteUrl}/#organization`
  const logo = settings.value?.data.logo
    ? prismic.asImageSrc(settings.value.data.logo)
    : undefined

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'DentaPlus+',
        url: `${siteUrl}/`,
        ...(logo ? { logo } : {}),
        sameAs: [
          'https://www.facebook.com/dentaplusturek',
          'https://www.instagram.com/klinika.dentaplus',
        ],
      },
      {
        '@type': 'Dentist',
        '@id': `${siteUrl}/kontakt/#turek`,
        name: 'DentaPlus+ Turek',
        url: `${siteUrl}/kontakt/`,
        telephone: normalizePhone(settings.value?.data.phone_turek),
        parentOrganization: { '@id': organizationId },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ul. Łąkowa 10',
          postalCode: '62-700',
          addressLocality: 'Turek',
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
      },
      {
        '@type': 'Dentist',
        '@id': `${siteUrl}/kontakt/#poddebice`,
        name: 'DentaPlus+ Poddębice',
        url: `${siteUrl}/kontakt/`,
        telephone: normalizePhone(settings.value?.data.phone_poddebice),
        parentOrganization: { '@id': organizationId },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Krasickiego 1C',
          postalCode: '99-200',
          addressLocality: 'Poddębice',
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
      },
    ],
  }
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify(businessSchema.value)),
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
