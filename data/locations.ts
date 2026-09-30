const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

type HoursRow =
  | { days: string, dayOfWeek: string[], opens: string, closes: string, closed?: false }
  | { days: string, closed: true }

// Saturday is appointment-only, so it is shown as closed and never emitted as open hours in JSON-LD.
export const CLINIC_HOURS: Record<'turek' | 'poddebice', HoursRow[]> = {
  turek: [
    { days: 'Pn–Pt', dayOfWeek: WEEKDAYS, opens: '8:00', closes: '20:00' },
    { days: 'Sb', closed: true },
  ],
  poddebice: [
    { days: 'Pn–Pt', dayOfWeek: WEEKDAYS, opens: '10:00', closes: '18:00' },
    { days: 'Sb', closed: true },
  ],
}

export const SATURDAY_NOTE = 'Sobota: po wcześniejszym umówieniu'

export const openingHoursSpecification = (uid: keyof typeof CLINIC_HOURS) =>
  CLINIC_HOURS[uid].flatMap((row) =>
    row.closed
      ? []
      : [{
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: row.dayOfWeek,
          opens: row.opens.padStart(5, '0'),
          closes: row.closes.padStart(5, '0'),
        }],
  )

export const locations = {
  turek: {
    uid: 'turek',
    city: 'Turek',
    cityLocative: 'Turku',
    name: 'DentaPlus+ Klinika Stomatologii Turek',
    streetAddress: 'ul. Łąkowa 10',
    postalCode: '62-700',
    addressLocality: 'Turek',
    phoneSetting: 'phone_turek' as const,
    emailSetting: 'email_turek' as const,
    facebook: 'https://www.facebook.com/dentaplusturek',
    mapSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2960.499578331064!2d18.49203025168515!3d52.010363023104674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471b1f53660b39ff%3A0x78e72c385ad3a531!2sDentaPlus%2B%20Klinika%20Stomatologii%20Turek!5e0!3m2!1spl!2spl!4v1708106259185!5m2!1spl!2spl',
    mapTitle: 'Mapa gabinetu DentaPlus+ w Turku, ul. Łąkowa 10',
    h1: 'Gabinet stomatologiczny w Turku',
    title: 'Stomatolog Turek — gabinet DentaPlus+ | DentaPlus+',
    description:
      'Gabinet stomatologiczny DentaPlus+ w Turku, ul. Łąkowa 10. Implanty, Invisalign, leczenie kanałowe i tomografia 3D. Umów wizytę.',
    intro:
      'DentaPlus+ w Turku to pełnoprofilowy gabinet stomatologiczny przy ul. Łąkowej 10. Leczymy dorosłych i dzieci: od higienizacji i stomatologii zachowawczej po implanty, leczenie kanałowe pod mikroskopem i nakładki Invisalign.',
  },
  poddebice: {
    uid: 'poddebice',
    city: 'Poddębice',
    cityLocative: 'Poddębicach',
    name: 'DentaPlus+ Klinika Stomatologii Poddębice',
    streetAddress: 'ul. Krasickiego 1C',
    postalCode: '99-200',
    addressLocality: 'Poddębice',
    phoneSetting: 'phone_poddebice' as const,
    emailSetting: 'email_poddebice' as const,
    facebook: 'https://www.facebook.com/dentapluspoddebice',
    mapSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4923.822194283992!2d18.954593433374907!3d51.89908649999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471babfad2d2912f%3A0xa355d5eb51cc0533!2sDentaPlus%2B%20Klinika%20Stomatologii%20Podd%C4%99bice!5e0!3m2!1spl!2spl!4v1708106558963!5m2!1spl!2spl',
    mapTitle: 'Mapa gabinetu DentaPlus+ w Poddębicach, ul. Krasickiego 1C',
    h1: 'Gabinet stomatologiczny w Poddębicach',
    title: 'Stomatolog Poddębice — gabinet DentaPlus+ | DentaPlus+',
    description:
      'Gabinet stomatologiczny DentaPlus+ w Poddębicach, ul. Krasickiego 1C. Implanty, Invisalign, leczenie kanałowe. Sprawdź godziny i umów wizytę.',
    intro:
      'DentaPlus+ w Poddębicach przy ul. Krasickiego 1C to drugi gabinet sieci. Oferujemy leczenie zachowawcze, protetykę, implantologię, Invisalign i diagnostykę, w ścisłej współpracy z kliniką w Turku.',
  },
} as const
