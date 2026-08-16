import { readFile } from 'node:fs/promises'

const outputDirectory = new URL('../.output/public/', import.meta.url)

const [html, payload] = await Promise.all([
  readFile(new URL('index.html', outputDirectory), 'utf8'),
  readFile(new URL('_payload.json', outputDirectory), 'utf8'),
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
