import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

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

  const seoSource = read('composables/usePageSeo.ts')
  assert.match(seoSource, /export const formatPageTitle/)
  assert.match(seoSource, /export const TITLE_FALLBACKS/)

  for (const pathKey of ['/cennik', '/kontakt', '/zespol', '/implanty', '/invisalign', '/endodoncja', '/itero', '/tomografia', '/uslugi']) {
    assert.ok(seoSource.includes(`'${pathKey}':`), `${pathKey} is missing a unique title fallback`)
  }
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
  const hero = read('slices/Hero/index.vue')

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
  assert.match(read('components/ClinicCard.vue'), /location\.streetAddress/)
})

test('location service headings use locative city names', () => {
  const component = read('components/ClinicLocation.vue')
  const data = read('data/locations.ts')
  assert.match(component, /Usługi w \{\{ location\.cityLocative \}\}/)
  assert.doesNotMatch(component, /Usługi w \{\{ location\.city \}\}/)
  assert.match(data, /cityLocative: 'Turku'/)
  assert.match(data, /cityLocative: 'Poddębicach'/)
})

test('service pages expose extra copy and Usługi navigation', () => {
  const services = read('data/services.ts')
  const header = read('components/Header.vue')
  const extras = read('pages/[uid].vue')
  const uslugi = read('pages/uslugi.vue')

  for (const uid of ['implanty', 'invisalign', 'endodoncja', 'itero', 'tomografia']) {
    assert.match(services, new RegExp(`${uid}:`))
  }
  assert.match(header, /Usługi/)
  assert.match(header, /resolveServiceNav/)
  assert.match(header, /service_links/)
  assert.match(extras, /ServiceExtras/)
  assert.match(read('customtypes/navigation/index.json'), /service_links/)
  assert.match(uslugi, /SERVICE_NAV/)
  assert.match(uslugi, /serviceCardBlurb/)
  assert.match(uslugi, /text_with_image/)
  assert.match(uslugi, /PrismicImage/)
  assert.match(uslugi, /denta-green/)
  assert.match(services, /export const firstSentence/)
  assert.match(services, /export const serviceCardBlurb/)
  assert.match(read('nuxt.config.ts'), /["']\/uslugi\/["']/)
})

test('telephone hrefs are normalized without spaces', () => {
  assert.match(read('composables/usePhoneLink.ts'), /export const normalizeTelHref/)
  assert.match(read('components/ClinicCard.vue'), /normalizeTelHref/)
  assert.match(read('components/ContactBar.vue'), /normalizeTelHref/)
  assert.doesNotMatch(read('components/ContactBar.vue'), /tel:\+48\$\{/)
})

test('canonical URLs encode unicode slugs once', async () => {
  const { toCanonicalUrl } = await import('../utils/canonical.mjs')
  const once = toCanonicalUrl('https://www.dentaplus.pl', '/zespol/michał-trzos/')
  const encoded = toCanonicalUrl('https://www.dentaplus.pl', '/zespol/micha%C5%82-trzos/')
  const doubled = toCanonicalUrl('https://www.dentaplus.pl', '/zespol/micha%25C5%2582-trzos/')
  assert.equal(once, 'https://www.dentaplus.pl/zespol/micha%C5%82-trzos/')
  assert.equal(encoded, once)
  assert.equal(doubled, once)
  assert.match(read('netlify.toml'), /michal-trzos/)
  assert.match(read('netlify.toml'), /weronika-wlodarska/)
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
  assert.match(read('netlify.toml'), /from = "\/index\.html"/)
  assert.match(read('netlify.toml'), /to = "\/"/)
})

test('default Open Graph image is always set', () => {
  assert.match(read('composables/usePageSeo.ts'), /og-default\.png/)
  assert.equal(fs.existsSync(path.join(root, 'public/og-default.png')), true)
})

test('hero LCP image is width-constrained and Inter is latin subset', () => {
  assert.match(read('slices/Hero/index.vue'), /NuxtImg/)
  assert.match(read('slices/Hero/index.vue'), /w: 1400/)
  assert.match(read('nuxt.config.ts'), /latin-ext-400/)
  assert.doesNotMatch(read('nuxt.config.ts'), /@fontsource\/inter\/400\.css/)
})

test('hero fits phone widths: fluid H1, stacked photo, sane srcset', () => {
  const hero = read('slices/Hero/index.vue')

  assert.match(hero, /text-\[length:clamp\(/)
  assert.match(hero, /break-words/)
  assert.match(hero, /max-md:aspect-\[3\/2\]/)
  assert.match(hero, /max-md:max-h-\[40svh\]/)
  assert.match(hero, /md:absolute md:inset-0/)
  assert.doesNotMatch(hero, /sizes="100vw"/)
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

test('hero uses a tighter padding size without changing Bounded lg', () => {
  const hero = read('slices/Hero/index.vue')
  const bounded = read('components/Bounded.vue')

  assert.match(hero, /y-padding="hero"/)
  assert.doesNotMatch(hero, /y-padding="lg"/)
  assert.match(bounded, /yPadding === 'lg'/)
  assert.match(bounded, /md:pb-96/)
  assert.match(bounded, /yPadding === 'hero'/)
  assert.match(bounded, /py-12 sm:py-16 md:py-24/)
})

test('images get a Polish alt fallback', () => {
  assert.match(read('composables/useImageAlt.ts'), /withImageAlt/)
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

test('Metamorfozy grid shares the Header slice content column and keeps 4:3 frames', () => {
  const source = read('slices/Metamorphoses/index.vue')

  assert.match(source, /class="mt-8 mb-20 px-4"/)
  assert.match(source, /class="container mx-auto"/)
  assert.match(source, /mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3/)
  assert.doesNotMatch(source, /justify-items-center/)
  assert.doesNotMatch(source, /max-w-sm/)
  assert.match(source, /aspect-\[4\/3\] w-full bg-slate-100 \[&>\*\]:!h-full/)
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

test('service pages include FAQ copy', () => {
  assert.match(read('data/services.ts'), /serviceFaqs/)
  assert.match(read('components/ServiceExtras.vue'), /Najczęstsze pytania/)
  assert.match(read('pages/[uid].vue'), /FAQPage/)
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
