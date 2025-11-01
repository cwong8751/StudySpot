<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const router = useRouter();
const tables = ref([]); // array to hold table data
const searchTerm = ref(''); // search term for filtering tables
const hovered = ref(null);

const visitMe = () => {
  router.push('/me');
};

const handleLogout = () => {
  console.log("User logged out");
  sessionStorage.clear();
  alert("Bye bye");
  router.push('/login');
};

const handleIamHere = async (tableId) => {
  try {
    const response = await fetch('http://localhost:5001/tables/iAmHere', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tableId }),
    });
    if (!response.ok) throw new Error('Failed to update table');
    const data = await response.json();
    alert('✅ You are here! Utilization updated.');
    console.log('Updated table:', data);
  } catch (error) {
    console.error(error);
    alert('❌ Error updating utilization');
  }
};

const handleSearch = computed(() => {
  const searchLower = searchTerm.value.toLowerCase();
  return tables.value.filter(table => {
    return (
      table.tableNumber.toString().includes(searchLower) ||
      table.location.toLowerCase().includes(searchLower)
    );
  });
});

const handleScan = () => {

}

onMounted(() => {
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

  fetch('http://localhost:5001/tables', {
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
      tables.value = data;

      data.forEach(table => {
        if (table.latitude && table.longitude) {
          const marker = L.marker([table.latitude, table.longitude]).addTo(map);
          marker.bindPopup(`
          <b>Table ${table.tableNumber}</b><br>
          Location: ${table.location}<br>
          Chairs: ${table.numberOfChairs}<br>
          Capacity: ${table.capacity}<br>
          Utilization: ${table.utilization}<br>
          Outlet nearby: ${table.outletNearby ? 'Yes' : 'No'}<br>
          Toilet nearby: ${table.toiletNearby ? 'Yes' : 'No'}
        `);
        }
      });
    })
    .catch(error => {
      console.error(error);
    });
});
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <!-- Header -->
        <v-app-bar app color="primary" dark>
          <v-toolbar-title>StudySpot</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-2 text-white" @click="handleLogout">Log out</v-btn>
          <v-btn color="text-white" @click="visitMe">Me</v-btn>
          <v-btn class="bg-green-darken-2 text-white" @click="handleScan">Scan</v-btn>
        </v-app-bar>

        <!-- Search Bar -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-text-field v-model="searchTerm" label="Search tables by number or location"
              prepend-inner-icon="mdi-magnify" outlined dense></v-text-field>
          </v-col>
        </v-row>

        <!-- Main Layout -->
        <v-row>
          <!-- Map Section -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Map</v-card-title>
              <v-card-text>
                <div id="map" style="height: 400px;"></div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Table List Section -->
          <v-col cols="12" md="6">
            <v-card class="mb-4">
              <v-card-title>Tables near me</v-card-title>
            </v-card>

            <v-card-text>
              <v-alert v-if="tables.length === 0" type="info">
                There are no tables available.
              </v-alert>
            </v-card-text>

            <v-row>
              <v-col v-for="table in handleSearch" :key="table._id" cols="12" md="6">
                <v-card class="hoverable bg-surface mb-4" elevation="2" @mouseenter="hovered = table._id"
                  @mouseleave="hovered = null" :class="hovered === table._id ? 'bg-blue-lighten-5' : 'bg-surface'">
                  <v-card-title>Table {{ table.tableNumber }}</v-card-title>

                  <v-card-text>
                    <ul class="ml-2">
                      <li><strong>Location:</strong> {{ table.location }}</li>
                      <li><strong>Number of chairs:</strong> {{ table.numberOfChairs }}</li>
                      <li><strong>Outlet nearby:</strong> {{ table.outletNearby ? 'Yes' : 'No' }}</li>
                      <li><strong>Toilet nearby:</strong> {{ table.toiletNearby ? 'Yes' : 'No' }}</li>
                      <li><strong>Capacity:</strong> {{ table.capacity }}</li>
                      <li>
                        <strong>Occupancy:</strong>
                        {{ ((table.utilization / table.capacity) * 100).toFixed(0) }}%
                      </li>
                    </ul>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn color="primary" @click="handleIamHere(table._id)">
                      I am here
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
#map {
  height: 400px;
}
</style>

<style scoped>
.v-card {
  transition: background-color 0.25s ease;
}
</style>
