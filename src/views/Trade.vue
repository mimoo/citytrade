<script setup>
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores/cities'

// store
const store = useStore();

// offers
const { best_offers, get_sold } = storeToRefs(store);

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
            <tr class="text-gray-700" v-for="offer in best_offers">
              <td class="px-4 py-3 border">
                <div class="flex items-center text-sm">
                  <div class="relative w-8 h-8 mr-3 rounded-full md:block">
                    <img
                      class="object-cover w-full h-full rounded-full"
                      :src="'https://source.unsplash.com/random/50x50/?city,' + offer.city + ',' + offer.country"
                      alt
                      loading="lazy"
                    />
                    <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                  </div>
                  <div>
                    <p class="font-semibold text-black">
                      {{ offer.city }} ({{ offer.country }})
                      <small>owned by {{ offer.to }}</small>
                    </p>
                    <p class="text-xs text-gray-600">by {{ offer.from }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-ms font-semibold border">{{ offer.price }} ETH</td>
              <td class="px-4 py-3 text-xs border">
                <span
                  class="px-2 py-1 font-semibold leading-tight text-orange-700 bg-gray-100 rounded-sm"
                >Pending</span>
              </td>
              <td class="px-4 py-3 text-sm border">
                <a
                  :href="'https://etherscan.io/tx/' + offer.transactionHash"
                >{{ offer.blockNumber }}</a>
              </td>
            </tr>

            <!-- sold -->
            <tr class="text-gray-700" v-for="offer in get_sold">
              <td class="px-4 py-3 border">
                <div class="flex items-center text-sm">
                  <div class="relative w-8 h-8 mr-3 rounded-full md:block">
                    <img
                      class="object-cover w-full h-full rounded-full"
                      :src="'https://source.unsplash.com/random/50x50/?city,' + offer.city + ',' + offer.country"
                      alt
                      loading="lazy"
                    />
                    <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                  </div>
                  <div>
                    <p class="font-semibold text-black">{{ offer.city }} ({{ offer.country }})</p>
                    <p class="text-xs text-gray-600">bought by {{ offer.new }}</p>
                    <p class="text-xs text-gray-600">
                      <span v-if="offer.previous == '0x00000000...'">acquired for the first time</span>
                      <span v-else>sold by {{ offer.previous }}</span>
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-ms font-semibold border">{{ offer.price }} ETH</td>
              <td class="px-4 py-3 text-xs border">
                <span
                  class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"
                >Sold</span>
              </td>
              <td class="px-4 py-3 text-sm border">
                <a
                  :href="'https://etherscan.io/tx/' + offer.transactionHash"
                >{{ offer.blockNumber }}</a>
              </td>
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
