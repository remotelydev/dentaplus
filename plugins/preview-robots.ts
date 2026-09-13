export default defineNuxtPlugin(() => {
  const route = useRoute()

  if (!route.path.startsWith('/api/preview')) {
    return
  }

  useSeoMeta({
    robots: 'noindex, nofollow',
  })
})
