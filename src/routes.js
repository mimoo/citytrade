import Browse from './views/Browse.vue'
import Trade from './views/Trade.vue'
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
    path: '/trade',
    meta: { title: 'Buy' },
    component: Trade,
    // example of route level code-splitting
    // this generates a separate chunk (Buy.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import('./views/Buy.vue')
  },
  {
    name: 'howto',
    path: '/hotwo',
    meta: { title: 'HowTo' },
    component: HowTo,
  },
  {
    name: 'map',
    path: '/map',
    meta: { title: 'Map' },
    component: Map,
  },
  { path: '/:path(.*)', component: NotFound },
]
