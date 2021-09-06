<script setup>

import { storeToRefs } from 'pinia'
import { useStore } from '@/stores/cities'

const store = useStore();
const { cities } = storeToRefs(store);

</script>

<template>
  <section class="text-gray-600 body-font">
    <div class="container px-5 py-24 mx-auto">
      all cities | largest offers |
      <router-link to="/map" class="mr-5 hover:text-gray-900">map</router-link>
      <div class="h-1 bg-gray-200 rounded overflow-hidden mt-3">
        <div class="w-24 h-full bg-indigo-500"></div>
      </div>

      <div class="flex flex-wrap -m-4 mt-2">
        <div class="lg:w-1/4 md:w-1/2 p-4 w-full" v-for="c in cities">
          <a class="block relative h-48 rounded overflow-hidden">
            <img
              alt="ecommerce"
              class="object-cover object-center w-full h-full block"
              :src="'https://source.unsplash.com/random/?city,' + c.name"
            />
          </a>
          <div class="mt-4">
            <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">{{ c.owner }}</h3>
            <h2 class="text-gray-900 title-font text-lg font-medium">{{ c.name }}</h2>
            <p class="mt-1" v-if="c.buyable">{{ c.buyable }} ETH</p>
            <p class="mt-1" v-else>make an offer</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <ul>
    <li v-for="city in cities">{{ city }}</li>
  </ul>
</template>
