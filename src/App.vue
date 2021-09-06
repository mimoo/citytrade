<script setup>
import { useStore } from '@/stores/cities'
import { ref, onMounted, watch, toRefs } from 'vue'


const store = useStore();
store.init();

let counter = ref(0)
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
        <span class="ml-3 text-xl">
          City
          <span class="text-indigo-600">Trade</span>
        </span>
      </a>
      <nav
        class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center"
      >
        <router-link to="/" class="mr-5 hover:text-gray-900">Browse</router-link>

        <router-link to="/buy" class="mr-5 hover:text-gray-900">Buy</router-link>
        <router-link to="/sell" class="mr-5 hover:text-gray-900">Sell</router-link>
        <router-link to="/wallet" class="mr-5 hover:text-gray-900">CITY wallet</router-link>
        <router-link to="/howto" class="mr-5 hover:text-gray-900">How to?</router-link>
      </nav>
      <button
        class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
      >Register</button>
    </div>
  </header>

  <main>
    <router-view />
  </main>
</template>
