import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

test('cennik keeps zebra rows and consultation-price fallback', () => {
  const source = read('slices/Pricelist/index.vue')

  assert.match(source, /i % 2 === 1 \? 'bg-slate-100'/)
  assert.match(source, /cena po konsultacji/)
  assert.doesNotMatch(source, /\d+\s*zł/i)
})

test('cennik has a sticky category jump-nav', () => {
  const source = read('slices/Pricelist/index.vue')

  assert.match(source, /showJumpNav/)
  assert.match(source, /sticky top-0/)
  assert.match(source, /sm:top-14/)
  assert.match(source, /aria-label="Kategorie cennika"/)
  assert.match(source, /cennik-\$\{/)
  assert.match(source, /#\$\{item\.id\}/)
  assert.match(source, /slice_type === ['"]pricelist['"]/)
  assert.match(source, /:id="categoryId \|\| undefined"/)
})

test('cennik jump-nav renders as lime-active chips', () => {
  const source = read('slices/Pricelist/index.vue')

  assert.match(source, /rounded-full border px-3 py-1/)
  assert.match(source, /hover:bg-denta-green/)
  assert.match(source, /'border-denta-green bg-denta-green' : 'border-slate-300 bg-white'/)
  assert.match(source, /:aria-current=/)
  assert.match(source, /focus-visible:outline-denta-green/)
  assert.doesNotMatch(source, /serviceChips|SERVICE_NAV/)
})

test('cennik rows keep main layout and hover', () => {
  const source = read('slices/Pricelist/index.vue')

  assert.match(source, /class="w-full flex justify-between p-2 hover:bg-slate-800 hover:text-slate-100"/)
  assert.match(source, /class="basis-3\/4"/)
  assert.doesNotMatch(source, /flex-col items-start/)
})
