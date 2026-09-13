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
  for (const file of ['pages/index.vue', 'pages/[uid].vue', 'pages/zespol/[uid].vue', 'pages/turek.vue', 'pages/poddebice.vue']) {
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

  for (const pathKey of ['/cennik', '/kontakt', '/zespol', '/implanty', '/invisalign', '/endodoncja', '/itero', '/tomografia']) {
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
  assert.match(layout, /\/turek\//)
  assert.match(layout, /\/poddebice\//)
  assert.match(layout, /ul\. Łąkowa 10/)
  assert.match(layout, /Krasickiego 1C/)
  assert.match(hero, /heading1:[\s\S]*?<h1 /)
  assert.match(read('slices/Contact/index.vue'), /locations\.turek\.streetAddress/)
  assert.match(read('slices/Contact/index.vue'), /locations\.poddebice\.streetAddress/)
})

test('service pages expose extra copy and Usługi navigation', () => {
  const services = read('data/services.ts')
  const header = read('components/Header.vue')
  const extras = read('pages/[uid].vue')

  for (const uid of ['implanty', 'invisalign', 'endodoncja', 'itero', 'tomografia']) {
    assert.match(services, new RegExp(`${uid}:`))
  }
  assert.match(header, /Usługi/)
  assert.match(header, /SERVICE_NAV/)
  assert.match(extras, /ServiceExtras/)
  assert.match(read('customtypes/navigation/index.json'), /service_links/)
})

test('telephone hrefs are normalized without spaces', () => {
  assert.match(read('composables/usePhoneLink.ts'), /export const normalizeTelHref/)
  assert.match(read('slices/Contact/index.vue'), /normalizeTelHref/)
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
  assert.match(sitemap, /monika-maciejewska/)
  assert.doesNotMatch(sitemap, /maciejeweska/)
  assert.match(sitemap, /piotr-pietryka/)
  assert.match(netlify, /monika-maciejeweska/)
  assert.match(doctors, /DOCTOR_UID_ALIASES/)
  assert.match(read('pages/zespol/[uid].vue'), /stub/)
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
