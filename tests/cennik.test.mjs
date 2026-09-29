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
