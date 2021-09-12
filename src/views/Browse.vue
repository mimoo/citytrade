<script setup>

import { storeToRefs } from 'pinia'
import { getCurrentInstance, ref, onMounted, watch, toRefs } from 'vue'
import { useStore } from '@/stores/cities'

// store
const store = useStore();

// cities
//const { get_priciest_cities } = storeToRefs(store);

// pagination of cities
const page = ref(0);
const per_page = 20;
const pages = ref(Math.ceil(store.get_priciest_cities.length / per_page));
console.log(pages.value);
const cities = ref(store.get_priciest_cities.slice(page.value, page.value + per_page));
</script>

<template>
  all cities | largest offers |
  <router-link :to="{ name: 'map' }" class="mr-5 hover:text-gray-900">map</router-link>
  <div class="h-1 bg-gray-200 rounded overflow-hidden mt-3">
    <div class="w-24 h-full bg-indigo-500"></div>
  </div>

  <div class="flex flex-wrap -m-4 mt-2">
    <div class="lg:w-1/4 md:w-1/2 p-4 w-full" v-for="c in cities">
      <a class="block relative h-48 rounded overflow-hidden">
        <img
          :alt="c.name"
          class="object-cover object-center w-full h-full block"
          :src="'https://source.unsplash.com/random/?city,' + c.name"
        />
      </a>
      <div class="mt-4">
        <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">
          <span v-if="c.owner">{{ c.owner }}</span>
          <span v-else>no owner yet</span>
        </h3>
        <h2 class="text-gray-900 title-font text-lg font-medium">{{ c.name }} ({{ c.country }})</h2>
        <p class="mt-1" v-if="c.buy_for">{{ c.buy_for }} ETH</p>
        <p class="mt-1" v-else>make an offer</p>
      </div>
    </div>
  </div>

  <!-- pagination -->
  <div class="flex flex-col items-center my-12">
    <div class="flex text-gray-700">
      <div
        class="h-8 w-8 mr-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-chevron-left w-4 h-4"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </div>
      <div class="flex h-8 font-medium rounded-full bg-gray-200">
        <div
          v-for="p in pages"
          class="w-8 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in rounded-full"
        >
          <span v-if="p == page + 1" class="bg-pink-600 text-white">{{ p }}</span>
          <span v-else>{{ p }}</span>
        </div>
        <!--
        <div
          class="w-8 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in rounded-full"
        >...</div>
        <div
          class="w-8 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in rounded-full"
        >3</div>
        <div
          class="w-8 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in rounded-full bg-pink-600 text-white"
        >4</div>
        <div
          class="w-8 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in rounded-full"
        >5</div>
        <div
          class="w-8 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in rounded-full"
        >...</div>
        <div
          class="w-8 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in rounded-full"
        >15</div>
        <div
          class="w-8 h-8 md:hidden flex justify-center items-center cursor-pointer leading-5 transition duration-150 ease-in rounded-full bg-pink-600 text-white"
        >4</div>
        -->
      </div>
      <div
        class="h-8 w-8 ml-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-chevron-right w-4 h-4"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  </div>
</template>
