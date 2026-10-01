import { copyFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const outputDirectory = new URL('../.output/public/', import.meta.url)

const generatedNotFound = new URL('404/index.html', outputDirectory)
const netlifyNotFound = new URL('404.html', outputDirectory)

if (!existsSync(generatedNotFound)) {
  throw new Error('Generated /404/index.html is missing.')
}

await copyFile(generatedNotFound, netlifyNotFound)

const [html, payload, notFoundHtml] = await Promise.all([
  readFile(new URL('index.html', outputDirectory), 'utf8'),
  readFile(new URL('_payload.json', outputDirectory), 'utf8'),
  readFile(netlifyNotFound, 'utf8'),
])

const main = html.match(/<main(?:\s[^>]*)?>([\s\S]*?)<\/main>/i)?.[1]
const generatedOutput = `${html}\n${payload}`
const dataErrors = [
  '"NuxtError"',
  'Cannot read properties of undefined',
  '"fetch failed"',
]

if (!main) {
  throw new Error('Generated homepage has no content inside <main>.')
}

const visibleMainText = main
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

if (visibleMainText.length < 100) {
  throw new Error('Generated homepage does not contain enough visible content.')
}

for (const error of dataErrors) {
  if (generatedOutput.includes(error)) {
    throw new Error(`Generated homepage contains a data error: ${error}`)
  }
}

console.log('Generated homepage contains Prismic content.')

const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0])
if (images.length < 5) {
  throw new Error(`Generated homepage has too few images (${images.length}).`)
}
for (const image of images) {
  if (!/\swidth="\d+"/.test(image) || !/\sheight="\d+"/.test(image)) {
    throw new Error(`Generated homepage image is missing width and height: ${image.slice(0, 220)}`)
  }
}
if (!/rel="preload" as="font"[^>]*fetchpriority="low"/.test(html)) {
  throw new Error('Generated homepage is missing low-priority font preloads.')
}
const preloadedFonts = html.match(/rel="preload" as="font"[^>]*>/g) || []
if (preloadedFonts.some((link) => link.includes('-500-'))) {
  throw new Error('Weight 500 Inter was preloaded; it is not on the first-paint chain.')
}
if (!preloadedFonts.some((link) => link.includes('latin-ext-600'))) {
  throw new Error('latin-ext 600 was not preloaded.')
}

console.log('Generated homepage images have dimensions and critical fonts are preloaded.')

if (!/noindex/.test(notFoundHtml) || !/Nie znaleziono strony/.test(notFoundHtml)) {
  throw new Error('Generated 404.html is missing noindex or the not-found title.')
}

if (!/<h1\b[^>]*>\s*Nie znaleziono strony\s*<\/h1>/i.test(notFoundHtml)) {
  throw new Error('Generated 404.html is missing the not-found H1.')
}

console.log('Generated 404.html is noindexed with a distinct title.')

if (existsSync(new URL('zespol/monika-maciejeweska/index.html', outputDirectory))) {
  throw new Error('Typo slug HTML was prerendered; Netlify would serve it as 200 without force.')
}

const previewHtml = existsSync(new URL('api/preview/index.html', outputDirectory))
  ? await readFile(new URL('api/preview/index.html', outputDirectory), 'utf8')
  : existsSync(new URL('api/preview.html', outputDirectory))
    ? await readFile(new URL('api/preview.html', outputDirectory), 'utf8')
    : null

if (!previewHtml) {
  throw new Error('Generated /api/preview HTML is missing.')
}

if (!/noindex/.test(previewHtml)) {
  throw new Error('Generated /api/preview HTML is missing robots noindex.')
}

console.log('Generated preview route is noindexed.')
