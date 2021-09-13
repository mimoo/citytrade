<script setup>

import { computed, ref, onMounted, watch, toRefs } from 'vue'
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

//
// Map stuff
//

const zoom = ref(2);

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

//
//
//

// store


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     </script>

<template>
    <div style="height: 75vh; width: vw">
        <l-map
            v-model="zoom"
            v-model:zoom="zoom"
            :center="[47.41322, -1.219482]"
            @move="log('move')"
        >
            <l-tile-layer url="http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.png"></l-tile-layer>

            <l-marker :lat-lng="[0, 0]" draggable @moveend="log('moveend')">
                <l-tooltip>lol</l-tooltip>
            </l-marker>

            <l-marker :lat-lng="[50, 50]" draggable @moveend="log('moveend')">
                <l-popup>lol</l-popup>
            </l-marker>
        </l-map>
    </div>
</template>
