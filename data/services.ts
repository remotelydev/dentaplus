export const SERVICE_NAV = [
  { uid: 'implanty', to: '/implanty/', label: 'Implanty' },
  { uid: 'invisalign', to: '/invisalign/', label: 'Invisalign' },
  { uid: 'endodoncja', to: '/endodoncja/', label: 'Endodoncja' },
  { uid: 'itero', to: '/itero/', label: 'iTero' },
  { uid: 'tomografia', to: '/tomografia/', label: 'Tomografia 3D' },
] as const

export type ServiceNavItem = {
  uid: string
  to: string
  label: string
}

const withTrailingSlash = (path: string) => {
  if (!path || path === '/') return path || '/'
  return path.endsWith('/') ? path : `${path}/`
}

export const resolveServiceNav = (
  cmsLinks: Array<{ label?: unknown, link?: unknown }> | null | undefined,
  asText: (field: unknown) => string,
  asLink: (field: unknown) => string | null | undefined,
): ServiceNavItem[] => {
  const items = (cmsLinks || []).flatMap((item, index) => {
    const href = asLink(item.link) || ''
    let path = href
    try {
      path = href.startsWith('http') ? new URL(href).pathname : href
    } catch {
      path = href
    }
    const normalized = path.replace(/\/+$/, '') || path
    const to = withTrailingSlash(normalized)
    const label = asText(item.label).trim()
    if (!to || to === '/' || !label) return []
    const uid = to.replace(/^\/|\/$/g, '') || `service-${index}`
    return [{ uid, to, label }]
  })

  return items.length ? items : SERVICE_NAV.map(item => ({ ...item }))
}

export const servicePages: Record<string, {
  h2s: { heading: string, body: string, steps?: string[] }[]
  cta: string
}> = {
  implanty: {
    h2s: [
      {
        heading: 'Dla kogo są implanty zębów?',
        body: 'Implant to tytanowa śruba zastępująca korzeń zęba. W DentaPlus+ w Turku i Poddębicach polecamy je osobom, którym brakuje jednego zęba, kilku zębów albo które rozważają protezę opartą na implantach. Warunkiem jest zdrowie ogólne pozwalające na zabieg i wystarczająca ilość kości — to oceniamy na tomografii 3D w Turku.',
      },
      {
        heading: 'Jak wygląda leczenie implantologiczne?',
        steps: [
          'Konsultacja i plan: zdjęcie, skan i w razie potrzeby tomograf',
          'Wszczepiamy implant',
          'Odczekujemy na osteointegrację',
          'Odbudowujemy koronę',
        ],
        body: 'Czas zależy od liczby implantów i tego, czy potrzebna jest augmentacja kości. Prowadzimy Cię przez każdy etap — od ekstrakcji po cementowanie korony.',
      },
      {
        heading: 'Implanty w Turku i Poddębicach',
        body: 'Zabiegi implantologiczne realizujemy w obu gabinetach DentaPlus+, ze wsparciem diagnostyki 3D w Turku. Dojazd jest prosty z Władysławowa, Dobrej, Uniejowa i Łęczycy. Aktualne widełki cenowe znajdziesz w cenniku — po badaniu podajemy indywidualną wycenę na piśmie.',
      },
    ],
    cta: 'Sprawdź ceny implantów i umów konsultację w Turku lub Poddębicach.',
  },
  invisalign: {
    h2s: [
      {
        heading: 'Czym jest Invisalign?',
        body: 'Invisalign to przezroczyste nakładki prostujące zęby bez klasycznego aparatu. W DentaPlus+ skanujemy łuki skanerem iTero, dzięki czemu plan leczenia i wizualizacja efektu powstają cyfrowo — bez wycisków masą.',
      },
      {
        heading: 'Dla kogo nakładki, a kiedy aparat?',
        body: 'Nakładki sprawdzają się przy stłoczeniach, szparach i wielu wadach zgryzu u nastolatków i dorosłych. Ciężkie wady szkieletowe mogą wymagać innego protokołu — to rozstrzygamy na konsultacji ortodontycznej w Turku lub Poddębicach.',
      },
      {
        heading: 'Przebieg leczenia Invisalign w DentaPlus+',
        steps: [
          'Konsultacja',
          'Skan iTero',
          'Akceptacja planu',
          'Seria nakładek wymienianych co 1–2 tygodnie',
          'Wizyty kontrolne',
        ],
        body: 'Higiena jest prostsza niż przy zamkach, bo nakładki zdejmujesz do jedzenia. Po leczeniu stosujemy retainery, żeby efekt został.',
      },
    ],
    cta: 'Zobacz cennik ortodoncji i zapytaj o Invisalign w Turku lub Poddębicach.',
  },
  endodoncja: {
    h2s: [
      {
        heading: 'Kiedy potrzebne jest leczenie kanałowe?',
        body: 'Do endodoncji kierujemy, gdy miazga zęba jest zapalna lub martwa: silny ból, reakcja na ciepło, obrzęk, zmiana na zdjęciu RTG. Celem jest uratować ząb zamiast go usuwać. W DentaPlus+ leczymy kanałowo pod mikroskopem, co zwiększa szansę na odnalezienie wszystkich kanałów.',
      },
      {
        heading: 'Jak przebiega wizyta?',
        steps: [
          'Po znieczuleniu otwieramy ząb',
          'Opracowujemy kanały',
          'Dezynfekujemy',
          'Wypełniamy',
        ],
        body: 'Często wystarcza jedna wizyta, trudniejsze przypadki wymagają dwóch. Potem ząb wzmacniamy wypełnieniem albo koroną — zwłaszcza zęby boczne po leczeniu kanałowym.',
      },
      {
        heading: 'Leczenie kanałowe Turek i Poddębice',
        body: 'Mikroskop i diagnostyka obrazowa są dostępne w naszych gabinetach. Pacjenci z Turku, Poddębic i okolic nie muszą jechać do dużego miasta na powtórne leczenie kanałowe. Orientacyjne ceny są w cenniku; rewizja i usuwanie złamanych narzędzi wyceniane są po oględzinach.',
      },
    ],
    cta: 'Umów leczenie kanałowe — sprawdź cennik endodoncji.',
  },
  itero: {
    h2s: [
      {
        heading: 'Co daje skaner iTero?',
        body: 'iTero to skaner wewnątrzustny: zamiast wycisku masy robimy trójwymiarowy model zębów w kilka minut. Służy do planowania Invisalign, koron, mostów i kontroli zgryzu. Jest wygodniejszy przy odruchu wymiotnym i dokładniejszy niż klasyczna łyżka.',
      },
      {
        heading: 'Kiedy korzystamy ze skanu?',
        body: 'Przy starcie Invisalign, przed pracami protetycznymi i implantologicznymi oraz gdy chcemy pokazać pacjentowi stan uzębienia na ekranie. Skan z Turku lub Poddębic można wykorzystać w dalszym leczeniu w drugim gabinecie DentaPlus+.',
      },
      {
        heading: 'Diagnostyka cyfrowa na miejscu',
        body: 'Łączymy iTero z tomografią 3D, żeby plan implantu albo nakładek opierał się na kości i na zębach. To skraca liczbę wizyt i ogranicza poprawki w laboratorium.',
      },
    ],
    cta: 'Zapytaj o skan iTero przy umawianiu konsultacji — cennik diagnostyki jest na stronie Cennik.',
  },
  tomografia: {
    h2s: [
      {
        heading: 'Po co tomografia 3D zębów?',
        body: 'Tomografia stożkowa (CBCT) pokazuje kość, korzenie i zatoki w trzech wymiarach. Jest standardem przed implantami, trudnym leczeniem kanałowym i oceną ósemek. Zdjęcie pantomograficzne tego nie zastąpi, gdy planujemy nawiert w kości.',
      },
      {
        heading: 'Jak wygląda badanie?',
        steps: [
          'Stoisz lub siedzisz przy aparacie',
          'Badanie trwa kilkanaście sekund',
          'Wynik omawiamy od razu albo na zaplanowanej konsultacji implantologicznej / endodontycznej',
        ],
        body: 'Dawka jest znacznie niższa niż w tomografii szpitalnej.',
      },
      {
        heading: 'Tomografia 3D w Turku',
        body: 'Aparat CBCT pracuje w gabinecie DentaPlus+ w Turku przy ul. Łąkowej 10. Pacjenci z Poddębic korzystają z tej diagnostyki w ramach tej samej sieci — nie wysyłamy Cię do obcej pracowni. Cena badania jest w cenniku radiologii.',
      },
    ],
    cta: 'Umów tomografię 3D w Turku i zobacz cennik radiologii.',
  },
}

export const firstSentence = (text: string) => {
  const normalized = text.replace(/\s+/g, ' ').trim()
  const match = normalized.match(/^(.+?[.!?])(?:\s|$)/)
  return (match?.[1] || normalized).trim()
}

export const serviceCardBlurb = (uid: string) => {
  const body = servicePages[uid]?.h2s[0]?.body
  return body ? firstSentence(body) : ''
}

export const serviceFaqs: Record<string, { q: string, a: string }[]> = {
  implanty: [
    { q: 'Ile kosztuje implant zęba w Turku?', a: 'Cena zależy od systemu implantu, korony i ewentualnej regeneracji kości. Orientacyjne pozycje są w cenniku; dokładną wycenę podajemy po tomografii 3D.' },
    { q: 'Czy implanty robicie też w Poddębicach?', a: 'Tak. Konsultacje i część zabiegów odbywają się w Poddębicach, diagnostyka 3D w Turku.' },
    { q: 'Jak długo goi się implant?', a: 'Osteointegracja trwa zwykle kilka miesięcy. Harmonogram ustalamy indywidualnie.' },
  ],
  invisalign: [
    { q: 'Czy Invisalign jest w Poddębicach?', a: 'Tak, konsultacje i skan iTero robimy w Turku i Poddębicach.' },
    { q: 'Ile trwa leczenie nakładkami?', a: 'Proste przypadki to kilka miesięcy, bardziej złożone nawet powyżej roku — plan widać po skanie.' },
    { q: 'Czy nakładki bolą?', a: 'Nacisk przy wymianie serii bywa odczuwalny przez 1–2 dni, bez klasycznych otarć od zamków.' },
  ],
  endodoncja: [
    { q: 'Czy leczenie kanałowe w Turku robicie pod mikroskopem?', a: 'Tak. Mikroskop pomaga znaleźć dodatkowe kanały i ogranicza ryzyko pozostawienia zakażenia.' },
    { q: 'Ile trwa leczenie kanałowe?', a: 'Często jedną wizytę; rewizje i zęby wielokanałowe mogą wymagać dwóch.' },
    { q: 'Czy ząb po kanale trzeba koronować?', a: 'Zęby boczne zwykle tak, żeby nie pękły. Decyzję podejmujemy po odbudowie.' },
  ],
  itero: [
    { q: 'Czy skan iTero zastępuje wycisk?', a: 'W większości prac protetycznych i przy Invisalign — tak.' },
    { q: 'Czy skan jest dostępny w obu gabinetach?', a: 'Tak, korzystamy z cyfrowego modelu w Turku i Poddębicach.' },
    { q: 'Czy skan boli?', a: 'Nie. Końcówka skanera jest w ustach kilka minut.' },
  ],
  tomografia: [
    { q: 'Gdzie jest tomografia 3D DentaPlus+?', a: 'W gabinecie w Turku przy ul. Łąkowej 10. Pacjenci z Poddębic są na to badanie umawiani w Turku.' },
    { q: 'Czy potrzebuję skierowania?', a: 'Na potrzeby leczenia w DentaPlus+ kwalifikuje lekarz po konsultacji.' },
    { q: 'Jaka jest dawka promieniowania?', a: 'CBCT ma istotnie niższą dawkę niż tomografia szpitalna; i tak robimy je tylko gdy zmienia plan leczenia.' },
  ],
}
