<script setup>

import { useStore } from '@/stores/cities'
import { storeToRefs } from 'pinia'
import { getCurrentInstance, ref, onMounted, watch, toRefs } from 'vue'
import { get_provider, check_network, get_signer, user_address } from '@/contract/eth_provider'
import { init_contract } from '@/contract/citymayor'

// store
const store = useStore();
const { initialized } = storeToRefs(store);

// vars
let state = ref("not_initialized");
let user = ref(null);

// connect metamask
function connect_metamask() {
  if (window.ethereum) {
    window.ethereum.request({ method: 'eth_requestAccounts' });
  }
}

onMounted(async () => {
  // init provider
  const provider = await get_provider();
  if (!provider) {
    state.value = "could not connect to the blockchain";
    return;
  }
  window.provider = provider;

  // check network
  if (!await check_network(provider)) {
    state.value = "you are on the wrong network. Citytrade is on the ethereum main network"
    return;
  }

  // init contract
  const contract = await init_contract(provider);

  // initialized
  state.value = "initialized";

  // init store
  store.init(provider, contract);

  // init signer
  if (provider.getSigner) {
    const { signer, contract_signer } = get_signer(provider, contract);
    window.signer = signer;
    window.contract_signer = contract_signer;

    // get user address
    const res = await user_address(signer)
    user.value = res.substr(0, 10) + "...";
  }
});
</script>

<template>
  <header class="text-gray-600 body-font">
    <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
      <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
          viewBox="0 0 24 24"
        >
          <path d="M5 5L5 5l5 10 10-5-10-5zM2 15l20 0" />
        </svg>
        <router-link :to="{ name: 'browse' }" class="ml-3 text-xl">
          City
          <span class="text-indigo-600">Trade</span>
        </router-link>
      </a>
      <nav
        class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center"
      >
        <router-link :to="{ name: 'browse' }" class="mr-5 hover:text-gray-900">Browse</router-link>

        <router-link :to="{ name: 'buy' }" class="mr-5 hover:text-gray-900">Trade</router-link>
        <router-link :to="{ name: 'howto' }" class="mr-5 hover:text-gray-900">How to?</router-link>
      </nav>
      <button
        class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
      >
        <span v-if="user">{{ user }}</span>
        <span v-else>
          <a href="#" @click="connect_metamask">Connect Metamask</a>
        </span>
      </button>
    </div>
  </header>

  <div class="text-center py-4 lg:px-4">
    <div
      class="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
      role="alert"
    >
      <span class="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">info</span>
      <span class="mr-2 text-left flex-auto text-sm">
        This is a non-official interface for the
        <a
          href="https://www.citymayor.co"
          target="_blank"
        >citymayor smart contract</a>
      </span>
      <a href="https://www.citymayor.co" target="_blank">
        <svg
          class="fill-current opacity-75 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"
          />
        </svg>
      </a>
    </div>
  </div>

  <!-- main -->
  <main>
    <section class="text-gray-600 body-font">
      <div class="container px-5 mx-auto">
        <div v-if="state == 'not_initialized' || !initialized">
          <div
            style="border-top-color:transparent"
            class="w-16 h-16 border-4 border-blue-400 border-dotted rounded-full animate-spin m-auto"
          ></div>
        </div>
        <div v-else-if="state == 'initialized'">
          <router-view />
        </div>
        <div v-else>
          **Error**: {{ state }}. You need to install
          <a href="https://metamask.io/">Metamask</a>.
        </div>
      </div>
    </section>
  </main>

  <!-- footer -->
  <footer class="text-gray-600 body-font">
    <div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
      <a
        class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
          viewBox="0 0 24 24"
        >
          <path d="M5 5L5 5l5 10 10-5-10-5zM2 15l20 0" />
        </svg>
        <span class="ml-3 text-xl">CityTrade</span>
      </a>
      <p
        class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4"
      >
        © 2021 CityTrade —
        <a
          href="https://twitter.com/mimoo"
          class="text-gray-600 ml-1"
          rel="noopener noreferrer"
          target="_blank"
        >@mimoo</a>
      </p>
      <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
        <a class="text-gray-500">
          <svg
            fill="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="w-5 h-5"
            viewBox="0 0 24 24"
          >
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg
            fill="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="w-5 h-5"
            viewBox="0 0 24 24"
          >
            <path
              d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
            />
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="w-5 h-5"
            viewBox="0 0 24 24"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg
            fill="currentColor"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="0"
            class="w-5 h-5"
            viewBox="0 0 24 24"
          >
            <path
              stroke="none"
              d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
            />
            <circle cx="4" cy="4" r="2" stroke="none" />
          </svg>
        </a>
      </span>
    </div>
  </footer>
</template>
