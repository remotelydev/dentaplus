import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const SERVICE_HEADINGS = [
  'Dla kogo są implanty zębów?',
  'Jak wygląda leczenie implantologiczne?',
  'Implanty w Turku i Poddębicach',
  'Czym jest Invisalign?',
  'Dla kogo nakładki, a kiedy aparat?',
  'Przebieg leczenia Invisalign w DentaPlus+',
  'Kiedy potrzebne jest leczenie kanałowe?',
  'Jak przebiega wizyta?',
  'Leczenie kanałowe Turek i Poddębice',
  'Co daje skaner iTero?',
  'Kiedy korzystamy ze skanu?',
  'Diagnostyka cyfrowa na miejscu',
  'Po co tomografia 3D zębów?',
  'Jak wygląda badanie?',
  'Tomografia 3D w Turku',
]

test('service H2s render as visual bands', () => {
  const extras = read('components/ServiceExtras.vue')

  assert.match(extras, /servicePages\[uid\]\.h2s/)
  assert.match(extras, /block\.heading/)
  assert.match(extras, /block\.body/)
  assert.match(extras, /border-l-4 border-denta-green/)
  assert.match(extras, /bg-slate-800/)
  assert.match(extras, /bg-slate-50/)
  assert.doesNotMatch(extras, /\d+\s*zł/i)
  assert.doesNotMatch(extras, /PLN/)
})

test('servicePages keep existing headings and invent no PLN', () => {
  const services = read('data/services.ts')

  for (const heading of SERVICE_HEADINGS) {
    assert.ok(services.includes(heading), `missing heading: ${heading}`)
  }

  assert.doesNotMatch(services, /\d+\s*zł/i)
  assert.doesNotMatch(services, /PLN/)
})

test('FAQ copy stays in extras and JSON-LD stays on the page', () => {
  assert.match(read('components/ServiceExtras.vue'), /Najczęstsze pytania/)
  assert.match(read('components/ServiceExtras.vue'), /serviceFaqs/)
  assert.match(read('pages/[uid].vue'), /FAQPage/)
  assert.match(read('pages/[uid].vue'), /serviceFaqs/)
  assert.match(read('pages/[uid].vue'), /<ServiceExtras :uid="uid" \/>/)
})
