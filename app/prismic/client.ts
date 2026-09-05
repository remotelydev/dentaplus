import { createClient } from '@prismicio/client'

export default createClient(process.env.NUXT_PUBLIC_PRISMIC_ENDPOINT || 'dentaplus', {
  routes: [
    {
      type: 'page',
      path: '/:uid',
    },
    {
      type: 'bio',
      path: '/zespol/:uid',
    },
    {
      type: 'page',
      uid: 'home',
      path: '/',
    },
  ],
})
