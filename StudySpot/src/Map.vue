<script setup>
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet"
import { latLng } from "leaflet"

// declare map variables
const zoom = 16.2
const center = latLng(38.648987, -90.312553);
const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
</script>

<template>
  <main>
    <div class="wrapper">
      <!-- initialize map -->
      <l-map style="height: 400px" :center="center" :zoom="zoom">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      </l-map>

      <!-- get list of tables -->
      <h2>Tabling information</h2>
      <p>I am a placeholder</p>
    </div>
  </main>
</template>
