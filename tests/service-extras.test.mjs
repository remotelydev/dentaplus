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

test('process steps come from existing jak wygląda / przebieg copy', () => {
  const extras = read('components/ServiceExtras.vue')
  const services = read('data/services.ts')

  assert.match(extras, /block\.steps\?\.length/)
  assert.match(extras, /rounded-full bg-denta-green/)
  assert.match(extras, /stepIndex \+ 1/)

  const originalProcessCopy = [
    'Najpierw konsultacja i plan: zdjęcie, skan i w razie potrzeby tomograf. Następnie wszczepiamy implant, odczekujemy na osteointegrację i odbudowujemy koronę. Czas zależy od liczby implantów i tego, czy potrzebna jest augmentacja kości. Prowadzimy Cię przez każdy etap — od ekstrakcji po cementowanie korony.',
    'Konsultacja, skan iTero, akceptacja planu, seria nakładek wymienianych co 1–2 tygodnie i wizyty kontrolne. Higiena jest prostsza niż przy zamkach, bo nakładki zdejmujesz do jedzenia. Po leczeniu stosujemy retainery, żeby efekt został.',
    'Po znieczuleniu otwieramy ząb, opracowujemy kanały, dezynfekujemy i wypełniamy. Często wystarcza jedna wizyta, trudniejsze przypadki wymagają dwóch. Potem ząb wzmacniamy wypełnieniem albo koroną — zwłaszcza zęby boczne po leczeniu kanałowym.',
    'Stoisz lub siedzisz przy aparacie, badanie trwa kilkanaście sekund, dawka jest znacznie niższa niż w tomografii szpitalnej. Wynik omawiamy od razu albo na zaplanowanej konsultacji implantologicznej / endodontycznej.',
  ].join(' ').toLowerCase()

  const steps = [...services.matchAll(/steps: \[([\s\S]*?)\]/g)]
    .flatMap((block) => [...block[1].matchAll(/'([^']+)'/g)].map((match) => match[1]))

  assert.ok(steps.length >= 16, `expected extracted process steps, got ${steps.length}`)

  for (const step of steps) {
    assert.ok(
      originalProcessCopy.includes(step.toLowerCase()),
      `invented process step: ${step}`,
    )
  }

  const iteroBlock = services.match(/itero: \{[\s\S]*?\n {2}\},\n {2}tomografia:/)?.[0] || ''
  assert.match(iteroBlock, /itero:/)
  assert.doesNotMatch(iteroBlock, /steps:/)
})

test('FAQ copy stays in extras and JSON-LD stays on the page', () => {
  const extras = read('components/ServiceExtras.vue')
  const uidPage = read('pages/[uid].vue')

  assert.match(extras, /Najczęstsze pytania/)
  assert.match(extras, /serviceFaqs/)
  assert.match(extras, /<details/)
  assert.match(extras, /<summary/)
  assert.match(uidPage, /FAQPage/)
  assert.match(uidPage, /serviceFaqs/)
  assert.match(uidPage, /application\/ld\+json/)
  assert.match(uidPage, /<ServiceExtras :uid="uid" \/>/)
  assert.doesNotMatch(uidPage, /<details/)
})
