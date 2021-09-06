import { createApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

/* debug */
import { ethers } from "ethers";

// get metamask provider
window.provider = new ethers.providers.Web3Provider(window.ethereum);



/* end debug */

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(router)
app.use(createPinia())
app.mount('#app')
