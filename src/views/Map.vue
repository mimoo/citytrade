<script setup>

import { ref, onMounted, watch, toRefs } from 'vue'
import axios from 'axios';
import {
    LMap,
    LIcon,
    LTileLayer,
    LMarker,
    LControlLayers,
    LTooltip,
    LPopup,
    LPolyline,
    LPolygon,
    LRectangle,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

const zoom = ref(2);
const iconWidth = ref(25);
const iconHeight = ref(40);

function
    iconUrl() {
    return `https://placekitten.com/${this.iconWidth}/${this.iconHeight}`;
}

function iconSize() {
    return [this.iconWidth, this.iconHeight];
}

function
    log(a) {
    console.log(a);
}

function changeIcon() {
    this.iconWidth += 2;
    if (this.iconWidth > this.iconHeight) {
        this.iconWidth = Math.floor(this.iconHeight / 2);
    }
}

async function get_city_coords(city, country) {
    // 
    const resp = await axios
        .get(`https://nominatim.openstreetmap.org/search?q=${city},${country}&format=json`);
    const data = resp.data;
    if (data.length == 0) {
        return null;
    }

    return {
        lat: data[0].lat,
        lon: data[0].lon
    };
}

window.get_city_coords = get_city_coords;

</script>

<template>
    <div style="height: 75vh; width: 50vw;">
        <l-map
            v-model="zoom"
            v-model:zoom="zoom"
            :center="[47.41322, -1.219482]"
            @move="log('move')"
        />
    </div>
</template>
