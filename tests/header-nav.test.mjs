import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const header = fs.readFileSync(path.join(root, 'components/Header.vue'), 'utf8')

test('primary header does not link to city landing pages', () => {
  assert.doesNotMatch(header, /to="\/turek\/"/)
  assert.doesNotMatch(header, /to="\/poddebice\/"/)
})
