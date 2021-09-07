<script setup>
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores/cities'

const store = useStore();
const { pending_desc, sold } = storeToRefs(store);

</script>

<template>
  <section class="container mx-auto p-6 font-mono">
    <div class="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
      <div class="w-full overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr
              class="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600"
            >
              <th class="px-4 py-3">City</th>
              <th class="px-4 py-3">Price</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Date</th>
            </tr>
          </thead>

          <tbody class="bg-white">
            <!-- pending first -->
            <tr class="text-gray-700" v-for="offer in pending_desc">
              <td class="px-4 py-3 border">
                <div class="flex items-center text-sm">
                  <div class="relative w-8 h-8 mr-3 rounded-full md:block">
                    <img
                      class="object-cover w-full h-full rounded-full"
                      :src="'https://source.unsplash.com/random/50x50/?city,' + offer.name"
                      alt
                      loading="lazy"
                    />
                    <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                  </div>
                  <div>
                    <p class="font-semibold text-black">{{ offer.name }}</p>
                    <p class="text-xs text-gray-600">by {{ offer.from_ens }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-ms font-semibold border">{{ offer.price_str }} ETH</td>
              <td class="px-4 py-3 text-xs border">
                <span
                  class="px-2 py-1 font-semibold leading-tight text-orange-700 bg-gray-100 rounded-sm"
                >Pending</span>
              </td>
              <td class="px-4 py-3 text-sm border">6/4/2000</td>
            </tr>

            <!-- sold -->
            <tr class="text-gray-700" v-for="offer in sold">
              <td class="px-4 py-3 border">
                <div class="flex items-center text-sm">
                  <div class="relative w-8 h-8 mr-3 rounded-full md:block">
                    <img
                      class="object-cover w-full h-full rounded-full"
                      :src="'https://source.unsplash.com/random/50x50/?city,' + offer.name"
                      alt
                      loading="lazy"
                    />
                    <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                  </div>
                  <div>
                    <p class="font-semibold text-black">{{ offer.name }}</p>
                    <p class="text-xs text-gray-600">bought by {{ offer.new_owner }}</p>
                    <p class="text-xs text-gray-600">sold by {{ offer.previous_owner }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-ms font-semibold border">{{ offer.price_str }} ETH</td>
              <td class="px-4 py-3 text-xs border">
                <span
                  class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"
                >Sold</span>
              </td>
              <td class="px-4 py-3 text-sm border">6/4/2000</td>
            </tr>

            <tr class="text-gray-700">
              <td class="px-4 py-3 border">
                <div class="flex items-center text-sm">
                  <div class="relative w-8 h-8 mr-3 rounded-full">
                    <img
                      class="object-cover w-full h-full rounded-full"
                      src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                      alt
                      loading="lazy"
                    />
                    <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                  </div>
                  <div>
                    <p class="font-semibold">Nora</p>
                    <p class="text-xs text-gray-600">Designer</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-md font-semibold border">17</td>
              <td class="px-4 py-3 text-xs border">
                <span
                  class="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm"
                >Cancelled (by owner)</span>
              </td>
              <td class="px-4 py-3 text-sm border">6/10/2020</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="px-5 py-5 bg-white flex flex-col xs:flex-row items-center xs:justify-between">
      <span class="text-xs xs:text-sm text-gray-900">Showing 1 to 4 of 50 Entries</span>
      <div class="inline-flex mt-2 xs:mt-0">
        <button
          class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
        >Prev</button>
        <button
          class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
        >Next</button>
      </div>
    </div>
  </section>
</template>
