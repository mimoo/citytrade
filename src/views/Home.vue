<script setup>

import { storeToRefs } from 'pinia'
import { useStore } from '@/stores/cities'

const store = useStore();
const { pending_desc } = storeToRefs(store);

</script>

<template>
  <h1>Pending offers</h1>
  <ul>
    <li
      v-for="offer in pending_desc"
    >#{{ offer.offer_id }}: {{ offer.from_ens }} is offering {{ offer.price_str }} for {{ offer.name }}</li>
  </ul>
</template>
