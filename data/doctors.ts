export const DOCTOR_UID_ALIASES: Record<string, string> = {
  'monika-maciejewska': 'monika-maciejeweska',
}

export const DOCTOR_TYPO_UIDS: Record<string, string> = Object.fromEntries(
  Object.entries(DOCTOR_UID_ALIASES).map(([canonical, typo]) => [typo, canonical]),
)

export const doctors: Record<string, {
  name: string
  role: string
  city: string
  bio: string
}> = {
  'aleksandra-kowalska': { name: 'Aleksandra Kowalska', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+.' },
  'aleksandra-stasiak-trzos': { name: 'Aleksandra Stasiak-Trzos', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+.' },
  'aneta-winnicka': { name: 'Aneta Winnicka', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+.' },
  'bartosz-matusiak': { name: 'Bartosz Matusiak', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+.' },
  'mariusz-proniak': { name: 'Mariusz Proniak', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+.' },
  'marta-szczesniak-szumska': { name: 'Marta Szcześniak-Szumska', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+.' },
  'michał-trzos': { name: 'Michał Trzos', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+.' },
  'michal-trzos': { name: 'Michał Trzos', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+.' },
  'monika-maciejewska': { name: 'Monika Maciejewska', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+.' },
  'natalia-ruszczynska': { name: 'Natalia Ruszczyńska', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+.' },
  'paulina-wilmont': { name: 'Paulina Wilmont', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+.' },
  'pawel-trumpus': { name: 'Paweł Trumpus', role: 'Implantolog', city: 'Turek i Poddębice', bio: 'Implantolog w zespole DentaPlus+ w Turku i Poddębicach.' },
  'weronika-włodarska': { name: 'Weronika Włodarska', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+.' },
  'weronika-wlodarska': { name: 'Weronika Włodarska', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+.' },
  'piotr-pietryka': { name: 'Piotr Pietryka', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+. Pełny biogram uzupełnimy w Prismic.' },
  'aleksandra-matusiak': { name: 'Aleksandra Matusiak', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+. Pełny biogram uzupełnimy w Prismic.' },
  'karolina-paliniewicz': { name: 'Karolina Paliniewicz', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+. Pełny biogram uzupełnimy w Prismic.' },
  'agata-rybka': { name: 'Agata Rybka', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+. Pełny biogram uzupełnimy w Prismic.' },
  'jaroslaw-ciach': { name: 'Jarosław Ciach', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+. Pełny biogram uzupełnimy w Prismic.' },
  'natalia-podgorska': { name: 'Natalia Podgórska', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+. Pełny biogram uzupełnimy w Prismic.' },
  'anna-bednarek': { name: 'Anna Bednarek', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+. Pełny biogram uzupełnimy w Prismic.' },
  'aleksandra-stefaniak': { name: 'Aleksandra Stefaniak', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+. Pełny biogram uzupełnimy w Prismic.' },
  'wojciech-markowski': { name: 'Wojciech Markowski', role: 'Lekarz dentysta', city: 'Turek i Poddębice', bio: 'Lekarz dentysta w zespole DentaPlus+. Pełny biogram uzupełnimy w Prismic.' },
}

export const sitemapDoctorUids = [
  'aleksandra-kowalska',
  'aleksandra-stasiak-trzos',
  'aneta-winnicka',
  'bartosz-matusiak',
  'mariusz-proniak',
  'marta-szczesniak-szumska',
  'michał-trzos',
  'monika-maciejewska',
  'natalia-ruszczynska',
  'paulina-wilmont',
  'pawel-trumpus',
  'weronika-włodarska',
  'piotr-pietryka',
  'aleksandra-matusiak',
  'karolina-paliniewicz',
  'agata-rybka',
  'jaroslaw-ciach',
  'natalia-podgorska',
  'anna-bednarek',
  'aleksandra-stefaniak',
  'wojciech-markowski',
]
