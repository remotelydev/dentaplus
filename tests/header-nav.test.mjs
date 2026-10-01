import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { resolveServiceNav, SERVICE_NAV } from '../data/services.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const header = fs.readFileSync(path.join(root, 'components/Header.vue'), 'utf8')

test('primary header keeps city pages under Kontakt, not as top-level items', () => {
  assert.match(header, /id="desktop-kontakt-menu"/)
  assert.match(header, /aria-label="Pokaż gabinety"/)
  assert.match(header, /\[locations\.turek, locations\.poddebice\]/)
  assert.match(header, /to: `\/\$\{location\.uid\}\/`/)
  assert.match(header, /v-for="clinic in clinics"/)
  assert.match(header, /isKontaktItem/)
  assert.doesNotMatch(
    header,
    /<li class="font-semibold tracking-tight text-slate-800 hover:underline">\s*<NuxtLink to="\/turek\/">Turek<\/NuxtLink>/
  )
})

test('desktop submenus open on mouse hover with intent delay and keep click/keyboard control', () => {
  for (const menu of ['services', 'kontakt']) {
    assert.match(header, new RegExp(`@pointerenter="onDesktopMenuPointerEnter\\('${menu}', \\$event\\)"`))
    assert.match(header, new RegExp(`@pointerleave="onDesktopMenuPointerLeave\\('${menu}', \\$event\\)"`))
    assert.match(header, new RegExp(`@click="toggleDesktopMenu\\('${menu}'\\)"`))
    assert.match(header, new RegExp(`@keydown="onDesktopMenuKeydown\\('${menu}', \\$event\\)"`))
    assert.match(header, new RegExp(`@focusout="onDesktopMenuFocusout\\('${menu}', \\$event\\)"`))
  }
  assert.match(header, /event\.pointerType !== 'mouse'/)
  assert.match(header, /HOVER_OPEN_DELAY = \d+/)
  assert.match(header, /HOVER_CLOSE_DELAY = \d+/)
  assert.match(header, /event\.key === 'Escape'/)
  assert.match(header, /:aria-expanded="isDesktopServicesOpen"/)
  assert.match(header, /:aria-expanded="isDesktopKontaktOpen"/)
})

test('mobile submenus stay tap-to-expand without hover handlers', () => {
  const mobileNav = header.slice(header.lastIndexOf('<nav'))
  assert.match(mobileNav, /@click\.stop="isServicesOpen = !isServicesOpen"/)
  assert.match(mobileNav, /@click\.stop="isKontaktOpen = !isKontaktOpen"/)
  assert.doesNotMatch(mobileNav, /@pointerenter|@mouseenter/)
})

test('Galeria is filtered out of the primary header', () => {
  assert.match(header, /isGaleriaItem/)
  assert.match(header, /!isGaleriaItem\(item\)/)
})

test('service dropdown uses resolveServiceNav from Prismic or SERVICE_NAV', () => {
  assert.match(header, /resolveServiceNav/)
  assert.match(header, /service_links/)
  assert.match(header, /serviceNavItems/)
})

test('service nav falls back to SERVICE_NAV and normalizes CMS links', () => {
  const fallback = resolveServiceNav(null, () => '', () => null)
  assert.deepEqual(fallback.map((item) => item.to), SERVICE_NAV.map((item) => item.to))

  const cms = resolveServiceNav(
    [{ label: 'Implanty', link: 'https://www.dentaplus.pl/implanty' }],
    (field) => field,
    (field) => field,
  )
  assert.deepEqual(cms, [{ uid: 'implanty', to: '/implanty/', label: 'Implanty' }])

  const blank = resolveServiceNav(
    [{ label: '  ', link: '/implanty' }],
    (field) => field,
    (field) => field,
  )
  assert.deepEqual(blank.map((item) => item.to), SERVICE_NAV.map((item) => item.to))
})
