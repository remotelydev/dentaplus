import { createClient } from '@prismicio/client'

export default createClient('dentaplus', {
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
