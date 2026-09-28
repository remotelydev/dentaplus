import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const header = fs.readFileSync(path.join(root, 'components/Header.vue'), 'utf8')

test('primary header keeps city pages under Kontakt, not as top-level items', () => {
  assert.match(header, /id="desktop-kontakt-menu"/)
  assert.match(header, /aria-label="Pokaż gabinety"/)
  assert.match(header, /to="\/turek\/"/)
  assert.match(header, /to="\/poddebice\/"/)
  assert.match(header, /isKontaktItem/)
  assert.doesNotMatch(
    header,
    /<li class="font-semibold tracking-tight text-slate-800 hover:underline">\s*<NuxtLink to="\/turek\/">Turek<\/NuxtLink>/
  )
})
