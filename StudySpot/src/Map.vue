<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// visit me page
const visitMe = () => {
  router.push('/me');
};
</script>

<template>
  <main>
    <div class="wrapper">
      <!--account controls-->
      <button>Log out</button>
      <button @click="visitMe">Me</button>
      <!--search bar-->
      <div style="float: right;">
        <form>
          <input type="text" id="search" placeholder="Search for tables" required>
          <button type="submit">Go</button>
        </form>
      </div>
      <!-- flex box controls the layout-->
      <div style="display: flex">
        <!-- display map information -->
        <div style="width: 50%;">
          <h2>Map</h2>
          <!-- initialize map -->
          <div style="height: 400px; width: 95%;" id="map"></div>
          <button>Center</button>
        </div>

        <!-- get list of tables -->
        <div style="width: 50%;">
          <h2>Tabling information</h2>
          <!-- what the individual tabling should look like-->
          <div style="border: black 1px solid;">
            <h3>Table</h3>
            <b>Details: </b>
            <ul>
              <li>Table number: 533</li>
              <li>Location: Lopata hall 1st floor, near Stanley's</li>
              <li>Number of chairs: 1</li>
              <li>Power outlet nearby? Yes</li>
              <li>Toilet nearby? Yes</li>
            </ul>
            <!-- tabling controls -->
            <div>
              <button>I am here</button>
              <button>Report</button>
            </div>
            <!-- vacancy indicator-->
            <img style="margin-left: 5%; transform: rotate(90deg);" height="100" width="auto" src="./assets/traffic_green.png" alt="traffic_light_green"/>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet"
import { latLng } from "leaflet"
export default {
  mounted() {
    // declare map
    let map = L.map('map').setView([38.648987, -90.312553], 16.2)

    // set title layer for map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  }
}
</script>