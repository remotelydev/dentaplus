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

if (!/noindex/.test(notFoundHtml) || !/Nie znaleziono strony/.test(notFoundHtml)) {
  throw new Error('Generated 404.html is missing noindex or the not-found title.')
}

if (!/<h1\b[^>]*>\s*Nie znaleziono strony\s*<\/h1>/i.test(notFoundHtml)) {
  throw new Error('Generated 404.html is missing the not-found H1.')
}

console.log('Generated 404.html is noindexed with a distinct title.')
