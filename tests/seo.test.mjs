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
  for (const file of ['pages/index.vue', 'pages/[uid].vue', 'pages/zespol/[uid].vue']) {
    assert.match(read(file), /usePageSeo\(/, `${file} does not use usePageSeo`)
  }

  const seoSource = read('composables/usePageSeo.ts')
  assert.ok(seoSource.includes("rel: 'canonical'"))
  assert.ok(seoSource.includes("name: 'robots'"))
  assert.match(seoSource, /ogTitle:/)
  assert.match(seoSource, /twitterCard:/)
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

  assert.match(nuxtConfig, /siteUrl:\s*["']https:\/\/www\.dentaplus\.pl["']/)
  assert.match(nuxtConfig, /lang:\s*["']pl["']/)
  assert.match(layout, /application\/ld\+json/)
  assert.match(layout, /'@type': 'Organization'/)
  assert.match(layout, /'@type': 'Dentist'/)
  assert.match(hero, /heading1:[\s\S]*?<h1 /)
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
