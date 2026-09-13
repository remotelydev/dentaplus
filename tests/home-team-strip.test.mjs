import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { portraitsFromSlices, splitSlicesAfterFirstHero } from '../utils/teamPortraits.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

test('portraitsFromSlices keeps only real portrait URLs from the zespol slice', () => {
  const items = portraitsFromSlices([
    { slice_type: 'header' },
    {
      slice_type: 'portraits',
      items: [
        { name: 'Paweł Trumpus', role: 'Implantolog', portrait: { url: 'https://images.prismic.io/a.jpg', alt: 'portret Pawła' } },
        { name: 'Missing photo', role: 'Lekarz dentysta', portrait: {} },
        { name: 'Aleksandra Kowalska', role: 'Lekarz dentysta', portrait: { url: 'https://images.prismic.io/b.jpg' } },
      ],
    },
  ])

  assert.equal(items.length, 2)
  assert.equal(items[0].name, 'Paweł Trumpus')
  assert.equal(items[1].name, 'Aleksandra Kowalska')
  assert.equal(portraitsFromSlices(undefined).length, 0)
  assert.equal(portraitsFromSlices([{ slice_type: 'tiles', items: [] }]).length, 0)
})

test('splitSlicesAfterFirstHero places later slices after the hero', () => {
  const slices = [
    { slice_type: 'hero' },
    { slice_type: 'testimonials' },
    { slice_type: 'tiles' },
  ]
  const split = splitSlicesAfterFirstHero(slices)

  assert.deepEqual(split.before.map((slice) => slice.slice_type), ['hero'])
  assert.deepEqual(split.after.map((slice) => slice.slice_type), ['testimonials', 'tiles'])
  assert.deepEqual(splitSlicesAfterFirstHero([{ slice_type: 'tiles' }]).before, [])
  assert.deepEqual(splitSlicesAfterFirstHero(null), { before: [], after: [] })
})

test('homepage reads zespol portraits after hero and links to /zespol/', () => {
  const home = read('pages/index.vue')
  const strip = read('components/HomeTeamStrip.vue')
  const portraits = read('slices/Portraits/index.vue')
  const portrait = read('components/Portrait.vue')

  assert.match(home, /useAsyncData\('index-zespol'/)
  assert.match(home, /getByUID\('page', 'zespol'\)/)
  assert.match(home, /HomeTeamStrip/)
  assert.match(home, /split\.before/)
  assert.match(home, /split\.after/)
  assert.match(home, /data\?\.slices/)
  assert.match(home, /return null/)
  assert.match(strip, /to="\/zespol\/"/)
  assert.match(strip, /Poznaj zespół/)
  assert.doesNotMatch(strip, /Portrait/)
  assert.doesNotMatch(strip, /4\.9|gwiazd|rating/i)
  assert.doesNotMatch(home, /4\.9|gwiazd|rating/i)
  assert.doesNotMatch(strip, /from ['"]~\/components\/Portrait/)
  assert.match(portraits, /Portrait/)
  assert.match(portrait, /PrismicLink/)
})
