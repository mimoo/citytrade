import Browse from './views/Browse.vue'
import Buy from './views/Buy.vue'
import HowTo from './views/HowTo.vue'
import Map from './views/Map.vue'
import NotFound from './views/NotFound.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  {
    name: 'browse',
    path: '/:page(\\d+)?',
    component: Browse,
    meta: { title: 'Browse' }
  },
  {
    name: 'buy',
    path: '/Buy',
    meta: { title: 'Buy' },
    component: Buy,
    // example of route level code-splitting
    // this generates a separate chunk (Buy.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import('./views/Buy.vue')
  },
  {
    name: 'sell',
    path: '/HowTo',
    meta: { title: 'HowTo' },
    component: HowTo,
  },
  {
    name: 'wallet',
    path: '/HowTo',
    meta: { title: 'HowTo' },
    component: HowTo,
  },
  {
    name: 'howto',
    path: '/HowTo',
    meta: { title: 'HowTo' },
    component: HowTo,
  },
  {
    name: 'map',
    path: '/Map',
    meta: { title: 'Map' },
    component: Map,
  },
  { path: '/:path(.*)', component: NotFound },
]
