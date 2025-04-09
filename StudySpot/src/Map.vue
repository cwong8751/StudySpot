<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const router = useRouter();
const tables = ref([]); // array to hold table data
const searchTerm = ref(''); // search term for filtering tables

const visitMe = () => {
  router.push('/me');
};

const handleLogout = () => {
  // Handle logout logic here
  console.log("User logged out");
  sessionStorage.clear();
  alert("Bye bye");
  router.push('/login');
};

// handles the i am here btn 
const handleIamHere = (curCapacity, tableId) => {
  console.log("user reported they are at table id: ", tableId);
  console.log("user reported they are at table with capacity: ", curCapacity);

  fetch('http://localhost:3000/api/tables/iAmHere', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ curCapacity ,tableId }),
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(err => {
          throw new Error(`Something went wrong: ${err}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log("capacity updated", data);
      alert("Ok, you are here");
    })
    .catch(error => {
      console.error(error);
    });
}

// handles the search bar
const handleSearch = computed(() => {
  return tables.value.filter(table => {
    // Filter based on table number, location, or any other field
    const searchLower = searchTerm.value.toLowerCase();
    return (
      table.table_number.toString().includes(searchLower) ||
      table.location.toLowerCase().includes(searchLower)
    );
  });
});

onMounted(() => {

  // check if user is logged in
  const user = sessionStorage.getItem('user');
  if (!user) {
    alert("Please log in");
    router.push('/login');
    return;
  }

  let map = L.map('map').setView([38.648987, -90.312553], 16.2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  fetch('http://localhost:3000/api/tables/getAll', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(err => {
          throw new Error(`Something went wrong: ${err}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log("Table data", data);
      tables.value = data.data;

      // map markers onto leaflet map
      data.data.forEach(table => {
        if (table.latitude && table.longitude) { // check if coordinates exist
          const marker = L.marker([table.latitude, table.longitude]).addTo(map);
          marker.bindPopup(`Table ${table.table_number}`);
        }
      });
    })
    .catch(error => {
      console.error(error);
    });
});
</script>

<template>
  <main>
    <div class="wrapper">
      <div class="header-toolbar">
        <!--account controls-->
        <div>
          <button class="danger" @click="handleLogout">Log out</button>
          <button @click="visitMe">Me</button>
        </div>
        <form @submit.prevent>
          <input v-model="searchTerm" type="text" id="search" placeholder="Search for tables" required>
        </form>
      </div>
      <!-- flex box controls the layout-->
      <div style="display: flex; margin-left: .5em; margin-right: .5em;">
        <!-- display map information -->
        <div style="width: 50%;">
          <h2>Map</h2>
          <!-- initialize map -->
          <div style="height: 400px; width: 95%;" id="map"></div>
          <!-- <button>Center</button> -->
        </div>

        <!-- get list of tables -->
        <div style="width: 50%;">
          <h2>Tabling information</h2>
          <!-- populate all tables -->
          <div v-for="table in handleSearch" :key="table.id" class="table-card">
            <h3>Table {{ table.table_number }}</h3>
            <ul>
              <li>Location: {{ table.location }}</li>
              <li>Number of chairs: {{ table.num_chairs }}</li>
              <li>Power outlet nearby? {{ table.power_outlet_nearby > 0 ? 'Yes' : 'No' }}</li>
              <li>Toilet nearby? {{ table.toilet_nearby > 0 ? 'Yes' : 'No' }}</li>
            </ul>
            <div>
              <button @click="handleIamHere(table.capacity ,table.id)">I am here</button>
              <!-- <button>Report</button> -->
            </div>
            <img v-if="table.capacity > 50" style="margin-left: 5%; transform: rotate(90deg);" height="100" width="auto"
              src="./assets/traffic_green.png" alt="traffic_light_green" />
            <img v-else-if="table.capacity > 20" style="margin-left: 5%; transform: rotate(90deg);" height="100"
              width="auto" src="./assets/traffic_yellow.png" alt="traffic_light_yellow" />
            <img v-else style="margin-left: 5%; transform: rotate(90deg);" height="100" width="auto"
              src="./assets/traffic_red.png" alt="traffic_light_red" />
          </div>
          <p v-show="tables.length == 0">There are no tables available</p>
        </div>
      </div>
    </div>
  </main>
</template>