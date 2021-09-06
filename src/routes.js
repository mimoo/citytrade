import Browse from './views/Browse.vue'
import Buy from './views/Buy.vue'
import HowTo from './views/HowTo.vue'
import NotFound from './views/NotFound.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { path: '/', component: Browse, meta: { title: 'Browse' } },
  {
    path: '/Buy',
    meta: { title: 'Buy' },
    component: Buy,
    // example of route level code-splitting
    // this generates a separate chunk (Buy.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import('./views/Buy.vue')
  },
  {
    path: '/HowTo',
    meta: { title: 'HowTo' },
    component: HowTo,
  },
  { path: '/:path(.*)', component: NotFound },
]
