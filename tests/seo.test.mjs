import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { withImageAlt, DEFAULT_IMAGE_ALT } from '../composables/useImageAlt.ts'
import { formatPageTitle } from '../composables/usePageSeo.ts'
import { normalizeTelHref } from '../composables/usePhoneLink.ts'
import { openingHoursSpecification, locations } from '../data/locations.ts'
import { firstSentence, serviceCardBlurb, servicePages } from '../data/services.ts'
import { buildResponsiveImage } from '../utils/responsiveImage.mjs'
import { preloadCriticalFonts } from '../utils/preloadFonts.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const siteOrigin = 'https://www.dentaplus.pl'

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const sourceFiles = (directory) => {
  const directoryPath = path.join(root, directory)
  const files = []

  const visit = (currentPath) => {
    for (const entry of fs.readdirSync(currentPath, { withFileTypes: true })) {
      const entryPath = path.join(currentPath, entry.name)

      if (entry.isDirectory()) {
        visit(entryPath)
        continue
      }

      if (/\.(?:vue|ts|js|mjs)$/.test(entry.name)) {
        files.push(entryPath)
      }
    }
  }

  visit(directoryPath)
  return files
}

test('robots.txt points crawlers to the sitemap and protects the simulator', () => {
  const robots = read('public/robots.txt')

  assert.match(robots, /^User-agent: \*$/m)
  assert.match(robots, /^Allow: \/$/m)
  assert.match(robots, /^Disallow: \/slice-simulator$/m)
  assert.match(robots, /^Sitemap: https:\/\/www\.dentaplus\.pl\/sitemap\.xml$/m)
})

test('sitemap contains unique canonical URLs from the SEO route map', () => {
  const sitemap = read('public/sitemap.xml')
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])

  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  assert.match(sitemap, /<urlset[^>]+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/)
  assert.ok(urls.length > 0)
  assert.equal(new Set(urls).size, urls.length)

  for (const rawUrl of urls) {
    const url = new URL(rawUrl)

    assert.equal(url.origin, siteOrigin)
    assert.equal(url.search, '')
    assert.equal(url.hash, '')
    assert.equal(url.pathname === '/' || url.pathname.endsWith('/'), true)
  }

  const seoSource = read('composables/usePageSeo.ts')
  const describedPaths = [...seoSource.matchAll(/^  '([^']+)':/gm)].map((match) => match[1])
  const sitemapPaths = new Set(urls.map((url) => new URL(url).pathname.replace(/\/$/, '') || '/'))

  for (const describedPath of describedPaths) {
    assert.equal(sitemapPaths.has(describedPath), true, `${describedPath} is missing from sitemap.xml`)
  }
})

test('every public page uses the shared SEO metadata composable', () => {
  for (const file of ['pages/index.vue', 'pages/[uid].vue', 'pages/zespol/[uid].vue', 'pages/turek.vue', 'pages/poddebice.vue', 'pages/polityka-prywatnosci.vue', 'pages/cookies.vue', 'pages/uslugi.vue']) {
    assert.match(read(file), /usePageSeo\(/, `${file} does not use usePageSeo`)
  }

  const seoSource = read('composables/usePageSeo.ts')
  assert.ok(seoSource.includes("rel: 'canonical'"))
  assert.ok(seoSource.includes("name: 'robots'"))
  assert.match(seoSource, /ogTitle:/)
  assert.match(seoSource, /twitterCard:/)
})

test('inner pages never fall back to a duplicated brand title', () => {
  for (const file of ['pages/[uid].vue', 'pages/zespol/[uid].vue']) {
    const source = read(file)
    assert.match(source, /formatPageTitle\(/)
    assert.doesNotMatch(source, /contentTitle\.value\} \| \$\{siteTitle\.value\}/)
  }

  assert.match(read('pages/turek.vue'), /location\.title/)
  assert.match(read('pages/poddebice.vue'), /location\.title/)
  for (const location of [locations.turek, locations.poddebice]) {
    assert.notEqual(location.title, 'DentaPlus+ | DentaPlus+')
    assert.match(location.title, /\| DentaPlus\+$/)
  }
})

test('page titles use the meta title, a unique path fallback, or a single brand suffix', () => {
  assert.equal(
    formatPageTitle({ metaTitle: '  Meta cennik  ', contentTitle: 'Cennik', siteTitle: 'DentaPlus+', path: '/cennik' }),
    'Meta cennik',
  )

  const paths = ['/cennik', '/kontakt', '/zespol', '/implanty', '/invisalign', '/endodoncja', '/itero', '/tomografia', '/uslugi']
  const titles = paths.map((path) => formatPageTitle({
    contentTitle: 'DentaPlus+',
    siteTitle: 'DentaPlus+',
    path: `${path}/`,
  }))

  assert.equal(new Set(titles).size, titles.length)
  for (const title of titles) {
    assert.notEqual(title, 'DentaPlus+ | DentaPlus+')
    assert.match(title, /\| DentaPlus\+$/)
  }

  assert.equal(
    formatPageTitle({ contentTitle: 'Inny nagłówek', siteTitle: 'DentaPlus+', path: '/cennik' }),
    titles[0],
  )
  assert.equal(
    formatPageTitle({ contentTitle: 'Leczenie', siteTitle: 'DentaPlus+', path: '/nowa-usluga' }),
    'Leczenie | DentaPlus+',
  )
  assert.equal(
    formatPageTitle({ contentTitle: 'Leczenie | DentaPlus+', siteTitle: 'DentaPlus+', path: '/nowa-usluga' }),
    'Leczenie | DentaPlus+',
  )
  assert.equal(
    formatPageTitle({ contentTitle: 'DentaPlus', siteTitle: 'DentaPlus+', uid: 'nowa-usluga', path: '/nowa-usluga' }),
    'Nowa Usluga | DentaPlus+',
  )
  assert.equal(
    formatPageTitle({ contentTitle: 'DentaPlus+', siteTitle: 'DentaPlus+', path: '/' }),
    'DentaPlus+',
  )
})

test('SEO models expose editable metadata fields in Prismic', () => {
  for (const file of ['customtypes/page/index.json', 'customtypes/bio/index.json']) {
    const model = JSON.parse(read(file))
    const seo = model.json['SEO & Metadata']

    assert.ok(seo, `${file} is missing the SEO & Metadata group`)
    assert.ok(seo.meta_title)
    assert.ok(seo.meta_description)
    assert.ok(seo.meta_image)
  }
})

test('global SEO configuration includes Polish language and local business schema', () => {
  const nuxtConfig = read('nuxt.config.ts')
  const layout = read('layouts/default.vue')

  assert.match(nuxtConfig, /https:\/\/www\.dentaplus\.pl/)
  assert.match(nuxtConfig, /lang:\s*["']pl["']/)
  assert.match(layout, /application\/ld\+json/)
  assert.match(layout, /'@type': 'Organization'/)
  assert.match(layout, /'@type': 'Dentist'/)
  assert.match(layout, /locations\.turek/)
  assert.match(layout, /locations\.poddebice/)
  assert.match(read('data/locations.ts'), /ul\. Łąkowa 10/)
  assert.match(read('data/locations.ts'), /Krasickiego 1C/)
  assert.match(layout, /geo/)
  assert.match(layout, /BreadcrumbList/)
  assert.match(layout, /dentapluspoddebice/)
  assert.match(layout, /priceRange/)
  assert.match(read('pages/zespol/[uid].vue'), /Person/)
  assert.match(read('slices/Contact/index.vue'), /ClinicCard/)
  assert.match(read('slices/Contact/index.vue'), /locations\.turek/)
  assert.match(read('slices/Contact/index.vue'), /locations\.poddebice/)
})

test('clinic hours are per clinic and Saturday is appointment-only', () => {
  const data = read('data/locations.ts')
  const layout = read('layouts/default.vue')
  assert.match(data, /turek: \[\n\s+\{ days: 'Pn–Pt', dayOfWeek: WEEKDAYS, opens: '8:00', closes: '20:00' \}/)
  assert.match(data, /poddebice: \[\n\s+\{ days: 'Pn–Pt', dayOfWeek: WEEKDAYS, opens: '10:00', closes: '18:00' \}/)
  assert.match(data, /\{ days: 'Sb', closed: true \}/)
  assert.match(data, /Sobota: po wcześniejszym umówieniu/)
  assert.doesNotMatch(data, /sobota 10:00–15:00/)
  assert.match(layout, /openingHoursSpecification: openingHoursSpecification\(location\.uid\)/)
  assert.doesNotMatch(layout, /Saturday/)
  assert.match(read('components/ClinicCard.vue'), /SATURDAY_NOTE/)

  const turekHours = openingHoursSpecification('turek')
  const poddebiceHours = openingHoursSpecification('poddebice')
  assert.equal(turekHours.length, 1)
  assert.equal(poddebiceHours.length, 1)
  assert.deepEqual(turekHours[0].dayOfWeek, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
  assert.deepEqual(poddebiceHours[0].dayOfWeek, turekHours[0].dayOfWeek)
  assert.equal(turekHours[0].opens, '08:00')
  assert.equal(turekHours[0].closes, '20:00')
  assert.equal(poddebiceHours[0].opens, '10:00')
  assert.equal(poddebiceHours[0].closes, '18:00')
  assert.equal(JSON.stringify(turekHours).includes('Saturday'), false)
  assert.equal(JSON.stringify(poddebiceHours).includes('Saturday'), false)
})

test('city pages do not repeat the service nav and keep locative city names', () => {
  const component = read('components/ClinicLocation.vue')
  const data = read('data/locations.ts')
  assert.doesNotMatch(component, /Usługi w/)
  assert.doesNotMatch(component, /SERVICE_LINKS|SERVICE_NAV/)
  assert.doesNotMatch(component, /location\.paragraphs/)
  assert.doesNotMatch(data, /paragraphs:/)
  assert.doesNotMatch(read('slices/Contact/index.vue'), /SERVICE_LINKS|SERVICE_NAV/)
  assert.match(data, /cityLocative: 'Turku'/)
  assert.match(data, /cityLocative: 'Poddębicach'/)
})

test('service pages expose extra copy and Usługi navigation', () => {
  const services = read('data/services.ts')
  const header = read('components/Header.vue')
  const uslugi = read('pages/uslugi.vue')

  for (const uid of ['implanty', 'invisalign', 'endodoncja', 'itero', 'tomografia']) {
    assert.match(services, new RegExp(`${uid}:`))
  }
  assert.match(header, /Usługi/)
  assert.match(read('customtypes/navigation/index.json'), /service_links/)
  assert.match(uslugi, /SERVICE_NAV/)
  assert.match(uslugi, /serviceCardBlurb/)
  assert.match(uslugi, /text_with_image/)
  assert.match(uslugi, /PrismicImage/)
  assert.match(read('nuxt.config.ts'), /["']\/uslugi\/["']/)

  assert.equal(firstSentence('Pierwsze zdanie. Drugie.'), 'Pierwsze zdanie.')
  assert.equal(firstSentence('  Bez kropki  '), 'Bez kropki')
  assert.equal(serviceCardBlurb('brak-takiej-uslugi'), '')
  const implantBody = servicePages.implanty.h2s[0].body
  const implantBlurb = serviceCardBlurb('implanty')
  assert.ok(implantBlurb.length > 0)
  assert.ok(implantBlurb.length < implantBody.length)
  assert.equal(implantBody.startsWith(implantBlurb), true)
})

test('telephone hrefs are normalized without spaces', () => {
  assert.equal(normalizeTelHref('123 456 789'), 'tel:+48123456789')
  assert.equal(normalizeTelHref('+48 123 456 789'), 'tel:+48123456789')
  assert.equal(normalizeTelHref(''), undefined)
  assert.equal(normalizeTelHref(null), undefined)
  assert.match(read('components/ClinicCard.vue'), /normalizeTelHref/)
  assert.match(read('components/ClinicLocation.vue'), /normalizeTelHref/)
  assert.match(read('components/ContactBar.vue'), /normalizeTelHref/)
  assert.doesNotMatch(read('components/ContactBar.vue'), /tel:\+48\$\{/)
  assert.doesNotMatch(read('components/ClinicLocation.vue'), /tel:\+48\$\{/)
})

test('canonical URLs encode unicode slugs once', async () => {
  const { toCanonicalUrl } = await import('../utils/canonical.mjs')
  const once = toCanonicalUrl('https://www.dentaplus.pl', '/zespol/michał-trzos/')
  const encoded = toCanonicalUrl('https://www.dentaplus.pl', '/zespol/micha%C5%82-trzos/')
  const doubled = toCanonicalUrl('https://www.dentaplus.pl', '/zespol/micha%25C5%2582-trzos/')
  assert.equal(once, 'https://www.dentaplus.pl/zespol/micha%C5%82-trzos/')
  assert.equal(encoded, once)
  assert.equal(doubled, once)
})

test('retired unicode doctor slugs redirect to the ascii Prismic uids', () => {
  const netlify = read('netlify.toml')
  const blocks = netlify.split('[[redirects]]').slice(1)
  const targets = {
    michal: '/zespol/michal-trzos/',
    weronika: '/zespol/weronika-wlodarska/',
  }
  const sources = {
    michal: [
      '/zespol/michał-trzos',
      '/zespol/michał-trzos/',
      '/zespol/micha%C5%82-trzos',
      '/zespol/micha%C5%82-trzos/',
      '/zespol/micha%c5%82-trzos',
      '/zespol/micha%c5%82-trzos/',
      '/zespol/micha%25C5%2582-trzos',
      '/zespol/micha%25C5%2582-trzos/',
      '/zespol/micha%25c5%2582-trzos',
      '/zespol/micha%25c5%2582-trzos/',
    ],
    weronika: [
      '/zespol/weronika-włodarska',
      '/zespol/weronika-włodarska/',
      '/zespol/weronika-w%C5%82odarska',
      '/zespol/weronika-w%C5%82odarska/',
      '/zespol/weronika-w%c5%82odarska',
      '/zespol/weronika-w%c5%82odarska/',
      '/zespol/weronika-w%25C5%2582odarska',
      '/zespol/weronika-w%25C5%2582odarska/',
      '/zespol/weronika-w%25c5%2582odarska',
      '/zespol/weronika-w%25c5%2582odarska/',
    ],
  }

  for (const [doctor, paths] of Object.entries(sources)) {
    for (const from of paths) {
      const matches = blocks.filter((block) => block.includes(`from = "${from}"`))
      assert.equal(matches.length, 1, from)
      assert.match(matches[0], /status = 301/)
      assert.match(matches[0], /force = true/)
      assert.equal(matches[0].includes(`to = "${targets[doctor]}"`), true, from)
    }
  }

  for (const slug of ['michal-trzos', 'weronika-wlodarska']) {
    assert.equal(blocks.some((block) => block.includes(`from = "/zespol/${slug}"`)), false, slug)
    assert.equal(blocks.some((block) => block.includes(`from = "/zespol/${slug}/"`)), false, slug)
  }

  const sitemap = read('public/sitemap.xml')
  const doctors = read('data/doctors.ts')
  assert.match(sitemap, /https:\/\/www\.dentaplus\.pl\/zespol\/michal-trzos\/</)
  assert.match(sitemap, /https:\/\/www\.dentaplus\.pl\/zespol\/weronika-wlodarska\/</)
  assert.doesNotMatch(sitemap, /micha(?:%C5%82|%c5%82|ł)-trzos|weronika-w(?:%C5%82|%c5%82|ł)odarska/)
  assert.match(doctors, /'michal-trzos': \{/)
  assert.match(doctors, /'weronika-wlodarska': \{/)
  assert.match(doctors, /'michal-trzos',/)
  assert.match(doctors, /'weronika-wlodarska',/)
  assert.doesNotMatch(doctors, /'michał-trzos'|'weronika-włodarska'/)
})

test('doctor stubs and slug typo redirect are wired', () => {
  const sitemap = read('public/sitemap.xml')
  const netlify = read('netlify.toml')
  const doctors = read('data/doctors.ts')
  const nuxtConfig = read('nuxt.config.ts')
  const bioPage = read('pages/zespol/[uid].vue')
  assert.match(sitemap, /monika-maciejewska/)
  assert.doesNotMatch(sitemap, /maciejeweska/)
  assert.match(sitemap, /piotr-pietryka/)
  assert.match(doctors, /'monika-maciejewska': \{/)
  assert.doesNotMatch(doctors, /maciejeweska/)
  assert.match(bioPage, /stub/)
  assert.doesNotMatch(bioPage, /maciejeweska|DOCTOR_UID_ALIASES|DOCTOR_TYPO_UIDS/)
  assert.doesNotMatch(nuxtConfig, /maciejeweska/)

  const typoRedirects = netlify.split('[[redirects]]').filter((block) => block.includes('maciejeweska'))
  assert.equal(typoRedirects.length, 2)
  for (const block of typoRedirects) {
    assert.match(block, /force = true/)
    assert.match(block, /status = 301/)
    assert.match(block, /to = "\/zespol\/monika-maciejewska\/"/)
  }
})

test('Prismic route resolver emits trailing slashes', () => {
  const client = read('app/prismic/client.ts')
  assert.match(client, /path: '\/:uid\/'/)
  assert.match(client, /path: '\/zespol\/:uid\/'/)
})

test('index.html redirects to the homepage', () => {
  const blocks = read('netlify.toml').split('[[redirects]]').filter((block) => block.includes('from = "/index.html"'))
  assert.equal(blocks.length, 1)
  assert.match(blocks[0], /^  to = "\/"$/m)
  assert.match(blocks[0], /status = 301/)
  assert.match(blocks[0], /force = true/)
})

test('default Open Graph image is always set', () => {
  assert.match(read('composables/usePageSeo.ts'), /og-default\.png/)
  assert.equal(fs.existsSync(path.join(root, 'public/og-default.png')), true)
})

test('hero LCP image is width-constrained and Inter is latin subset', () => {
  const hero = read('slices/Hero/index.vue')
  assert.match(hero, /HERO_WIDTHS = \[800, 1200, 1400\]/)
  assert.match(hero, /imageSrcset/)
  assert.match(hero, /fetchpriority="high"/)
  assert.match(hero, /sizes="100vw"/)
  assert.doesNotMatch(hero, /NuxtImg/)
  assert.doesNotMatch(hero, /\b1w\b/)
  assert.match(read('nuxt.config.ts'), /latin-ext-400/)
  assert.doesNotMatch(read('nuxt.config.ts'), /@fontsource\/inter\/400\.css/)
})

test('homepage tiles stay off the hero download', () => {
  const tile = read('components/TileImage.vue')
  const tiles = read('slices/Tiles/index.vue')
  assert.match(tile, /loading="lazy"/)
  assert.match(tile, /fetchpriority="low"/)
  assert.match(tile, /buildResponsiveImage/)
  assert.match(tile, /:width="tile\.width"/)
  assert.match(tile, /:height="tile\.height"/)
  assert.match(tile, /:srcset="tile\.srcset"/)
  assert.match(tiles, /:image="item\.image"/)
  assert.doesNotMatch(tiles, /:image="item\.image\.url"/)
})

test('shared images declare dimensions and capped srcsets', () => {
  assert.match(read('components/Header.vue'), /logo\.dimensions\?\.width/)
  assert.match(read('components/Header.vue'), /logo\.dimensions\?\.height/)
  assert.match(read('components/Portrait.vue'), /:width="image\.width"/)
  assert.match(read('components/Portrait.vue'), /:height="image\.height"/)
  assert.match(read('components/ClinicLocation.vue'), /:width="cityImage\.width"/)
  assert.match(read('components/ClinicLocation.vue'), /:height="cityImage\.height"/)
  assert.match(read('components/ClinicLocation.vue'), /:srcset="cityImage\.srcset"/)
  assert.match(read('slices/Image/index.vue'), /image\.dimensions\?\.width/)
  assert.match(read('slices/TextWithImage/index.vue'), /image\.dimensions\?\.height/)
  assert.doesNotMatch(read('slices/Portraits/index.vue'), /portrait\.url/)
})

test('critical Inter files are preloaded off the font chain', () => {
  assert.match(read('nuxt.config.ts'), /preloadCriticalFonts/)

  const html = '<head><link rel="icon" href="/denta.ico"><link rel="preload" as="image" href="/hero.jpg"><style>@font-face{src:url(/_nuxt/inter-latin-400-normal.aaa.woff2)}@font-face{src:url(/_nuxt/inter-latin-ext-600-normal.bbb.woff2)}@font-face{src:url(/_nuxt/inter-latin-500-normal.ccc.woff2)}</style></head>'
  const preloaded = preloadCriticalFonts(html)
  assert.match(preloaded, /href="\/_nuxt\/inter-latin-400-normal\.aaa\.woff2"/)
  assert.match(preloaded, /href="\/_nuxt\/inter-latin-ext-600-normal\.bbb\.woff2"/)
  assert.doesNotMatch(preloaded, /inter-latin-500-normal\.ccc\.woff2" fetchpriority/)
  assert.ok(preloaded.indexOf('as="image"') < preloaded.indexOf('as="font"'))
})

test('404 and preview are noindexed', () => {
  assert.match(read('error.vue'), /noindex/)
  assert.match(read('error.vue'), /Nie znaleziono strony/)
  assert.match(read('pages/404.vue'), /noindex/)
  assert.match(read('pages/404.vue'), /Nie znaleziono strony/)
  assert.match(read('pages/404.vue'), /layout:\s*false/)
  assert.match(read('components/ErrorScreen.vue'), /Nie znaleziono strony/)
  assert.match(read('pages/[uid].vue'), /createError/)
  assert.match(read('nuxt.config.ts'), /X-Robots-Tag/)
  assert.match(read('nuxt.config.ts'), /["']\/404\/["']/)
  assert.match(read('nuxt.config.ts'), /prerender:done/)
  assert.match(read('nuxt.config.ts'), /["']\/api\/preview\/["']/)
  assert.match(read('scripts/verify-generated-site.mjs'), /404\.html/)
  assert.match(read('scripts/verify-generated-site.mjs'), /api\/preview/)
  assert.match(read('plugins/preview-robots.ts'), /noindex/)
  assert.match(read('public/robots.txt'), /Disallow: \/api\/preview/)

  const previewHeaders = read('netlify.toml').split('[[headers]]').filter((block) => block.includes('/api/preview'))
  assert.ok(previewHeaders.length >= 2)
  for (const block of previewHeaders) {
    assert.match(block, /X-Robots-Tag = "noindex, nofollow"/)
  }
})

test('prerender fetches use a string useAsyncData key and guard missing slices', () => {
  const uidPage = read('pages/[uid].vue')
  const bioPage = read('pages/zespol/[uid].vue')
  const homePage = read('pages/index.vue')
  const uslugiPage = read('pages/uslugi.vue')

  assert.doesNotMatch(uidPage, /useAsyncData\(\(\)\s*=>/)
  assert.doesNotMatch(bioPage, /useAsyncData\(\(\)\s*=>/)
  assert.doesNotMatch(uslugiPage, /useAsyncData\(\(\)\s*=>/)
  assert.match(uidPage, /useAsyncData\(`page-\$\{uid\.value\}`/)
  assert.match(bioPage, /useAsyncData\(`bio-\$\{uid\.value\}`/)
  assert.match(uslugiPage, /useAsyncData\('uslugi-cards'/)
  assert.match(uidPage, /data\?\.slices/)
  assert.match(bioPage, /data\?\.slices/)
  assert.match(homePage, /data\?\.slices/)
  assert.match(bioPage, /createError/)
  assert.match(bioPage, /^const runtimeConfig = useRuntimeConfig\(\)$/m)
  assert.match(bioPage, /fullyDecode/)
  assert.doesNotMatch(read('nuxt.config.ts'), /encodeURI\(uid\)/)
})

test('hero does not rewrite a DentaPlus H1', () => {
  const hero = read('slices/Hero/index.vue')

  assert.match(hero, /heading1:/)
  assert.doesNotMatch(hero, /Gabinety stomatologiczne w Turku i Poddębicach/)
  assert.doesNotMatch(hero, /\^DentaPlus/)
})

test('hero hides description when it repeats the H1', () => {
  const hero = read('slices/Hero/index.vue')

  assert.match(hero, /showDescription/)
  assert.match(hero, /localeCompare/)
  assert.match(hero, /v-if="showDescription"/)
  assert.doesNotMatch(hero, /v-if="slice\.primary\.description"/)
})

test('hero CTA uses a Polish button fallback', () => {
  const hero = read('slices/Hero/index.vue')

  assert.match(hero, /<PrismicLink/)
  assert.match(hero, /slice\.primary\.buttonLink/)
  assert.match(hero, /Umów wizytę/)
  assert.doesNotMatch(hero, /Learn More/)
  assert.doesNotMatch(hero, /<!-- <PrismicLink/)
})

test('images get a Polish alt fallback', () => {
  assert.equal(DEFAULT_IMAGE_ALT, 'Gabinet stomatologiczny DentaPlus+ w Turku i Poddębicach')
  assert.equal(withImageAlt({ url: 'https://img.example/a.jpg', alt: '  ' }).alt, DEFAULT_IMAGE_ALT)
  assert.equal(withImageAlt({ url: 'https://img.example/a.jpg', alt: 'Zespół' }).alt, 'Zespół')
  assert.equal(withImageAlt(null), null)
  assert.match(read('slices/Image/index.vue'), /withImageAlt/)
  assert.match(read('slices/Hero/index.vue'), /DEFAULT_IMAGE_ALT/)
})

test('Metamorfozy SSR HTML can render przed/po images before the slider hydrates', () => {
  const source = read('slices/Metamorphoses/index.vue')

  assert.match(source, /<ClientOnly>/)
  assert.match(source, /VueCompareImage/)
  assert.match(source, /#fallback/)
  assert.match(source, /item\.before\.url/)
  assert.match(source, /item\.after\.url/)
  assert.match(source, /:alt="imageAlt\(item\.before\)"/)
  assert.match(source, /:alt="imageAlt\(item\.after\)"/)
  assert.match(source, /<img/)
})

test('maps use Polish locale and controls have accessible names', () => {
  assert.doesNotMatch(read('data/locations.ts'), /1sen!2spl/)
  assert.match(read('data/locations.ts'), /1spl!2spl/)
  assert.match(read('components/ClinicCard.vue'), /location\.mapSrc/)
  const mapSlice = read('slices/Map/index.vue')
  assert.match(mapSlice, /from '~\/data\/locations'/)
  assert.match(mapSlice, /locations\.turek/)
  assert.match(mapSlice, /locations\.poddebice/)
  assert.match(mapSlice, /Mapa gabinetu/)
  assert.match(mapSlice, /hl=pl/)
  assert.match(mapSlice, /!1spl!2spl/)
  assert.doesNotMatch(mapSlice, /title="Mapa gabinetu DentaPlus\+ w Turku"/)
  assert.doesNotMatch(mapSlice, /Klinika%20Stomatologii%20Turek/)
  assert.match(read('components/Header.vue'), /Otwórz menu/)
  assert.match(read('components/Footer.vue'), /aria-label="Facebook DentaPlus\+ Turek"/)
})

test('Kontakt uses shared clinic cards that link to city pages', () => {
  const contact = read('slices/Contact/index.vue')

  assert.match(contact, /id="kontakt"/)
  assert.doesNotMatch(contact, /id="#kontakt"/)
  assert.match(contact, /<ClinicCard :location="locations\.turek" \/>/)
  assert.match(contact, /<ClinicCard :location="locations\.poddebice" \/>/)
  assert.match(contact, /to="\/turek\/"/)
  assert.match(contact, /to="\/poddebice\/"/)
  assert.doesNotMatch(contact, /ul\. Łąkowa 10/)
  assert.doesNotMatch(contact, /Krasickiego 1C/)
  assert.doesNotMatch(contact, /google\.com\/maps\/embed/)
  assert.match(read('components/ClinicCard.vue'), /location\.streetAddress/)
  assert.match(read('components/ClinicCard.vue'), /CLINIC_HOURS/)
  assert.match(read('components/ClinicCard.vue'), /location\.mapSrc/)
})

test('responsive images cap at the source width and keep its ratio', () => {
  const calls = []
  const asImageSrc = (field, params) => {
    calls.push(params)
    return `${field.url}?w=${params.w}&h=${params.h || ''}`
  }
  const field = {
    url: 'https://images.example/tile.jpg',
    dimensions: { width: 720, height: 360 },
  }
  const image = buildResponsiveImage(asImageSrc, field, {
    widths: [480, 800, 1200],
    cap: 1400,
    sizes: '(min-width: 768px) 50vw, 100vw',
  })

  assert.deepEqual(calls.map((params) => params.w), [480, 720])
  assert.equal(image.width, 720)
  assert.equal(image.height, 360)
  assert.match(image.srcset, /480w/)
  assert.match(image.srcset, /720w/)
  assert.doesNotMatch(image.srcset, /800w/)
  assert.equal(image.sizes, '(min-width: 768px) 50vw, 100vw')

  const undimensioned = buildResponsiveImage(asImageSrc, {
    url: 'https://images.example/plain.jpg',
  }, {
    widths: [480, 800],
    cap: 1400,
    sizes: '100vw',
  })
  assert.equal(undimensioned.srcset, undefined)
  assert.equal(undimensioned.width, undefined)
  assert.match(undimensioned.src, /[?&]w=1400/)
})

test('source files do not contain debug console calls', () => {
  const files = ['app', 'components', 'composables', 'layouts', 'pages', 'server', 'slices']
    .flatMap(sourceFiles)
  const debugCalls = []

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    const matches = source.match(/console\.(?:log|debug|info|warn|error)\s*\(/g) || []

    debugCalls.push(...matches.map((match) => `${path.relative(root, file)}: ${match}`))
  }

  assert.deepEqual(debugCalls, [])
})
