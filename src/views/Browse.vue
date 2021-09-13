<script setup>
import { storeToRefs } from 'pinia'
import { computed, getCurrentInstance, ref, onMounted, watch, toRefs } from 'vue'
import { useStore } from '@/stores/cities'
import { useRoute } from 'vue-router'

// route
const route = useRoute()

// store
const store = useStore();

// cities + pagination
const page = computed(() => Number.parseInt(route.params.page || "1", 10) - 1);
const per_page = 20;
const pages = computed(() => Math.ceil(store.num_cities / per_page));
const cities = computed(() => store.get_priciest_cities.slice(page.value * per_page, (page.value + 1) * per_page));
</script>

<template>
  hotest cities | priciest cities | alphabetic order |
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
      <router-link
        class="h-8 w-8 mr-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer"
        :to="{ name: 'browse', params: { page: page } }"
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
      </router-link>
      <div class="flex h-8 font-medium rounded-full bg-gray-200">
        <router-link
          v-for="p in pages"
          :class="(p == page + 1) ? 'w-8 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in rounded-full bg-pink-600 text-white disabled' : 'w-8 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in rounded-full'"
          :to="{ name: 'browse', params: { page: p } }"
        >{{ p }}</router-link>
      </div>

      <router-link
        class="h-8 w-8 ml-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer"
        :to="{ name: 'browse', params: { page: page + 2 } }"
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
      </router-link>
    </div>
  </div>
</template>
