import { createApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { ethers } from 'ethers'
import { provider } from './contract/eth_provider'

// detect change of metamask account
window.ethereum.on('accountsChanged', function (accounts) {
  location.reload();
})

window.ethereum.on('chainChanged', function (networkId) {
  location.reload();
})

// router config
const router_config = {
  history: createWebHistory(),
  routes,
};

const router = createRouter(
  (!import.meta.env.PROD) ? router_config : { base: "/citytrade/", ...router_config }
)

// create app
const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
