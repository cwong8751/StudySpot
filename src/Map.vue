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


// handles the search bar
const handleSearch = computed(() => {
  const searchLower = searchTerm.value.toLowerCase();
  return tables.value.filter(table => {
    return (
      table.tableNumber.toString().includes(searchLower) ||
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

      // map markers onto leaflet map
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
  <main>
    <!-- ✅ Sticky top header -->
    <div class="header-toolbar">
      <div class="header-controls">
        <button class="danger" @click="handleLogout">Log out</button>
        <button @click="visitMe">Me</button>
      </div>
      <h1>StudySpot</h1>
    </div>

    <!-- ✅ Full-width search bar -->
    <div class="search-bar-container">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="🔍 Search tables by number or location..."
      />
    </div>

    <!-- ✅ Two-column main layout -->
    <div class="map-layout">
      <!-- LEFT: Map -->
      <div class="left-pane">
        <h2>Map</h2>
        <div id="map"></div>
      </div>

      <!-- RIGHT: Table list -->
      <div class="right-pane">
        <h2>Tables near me</h2>

        <div v-for="table in handleSearch" :key="table._id" class="table-card">
          <h3>Table {{ table.tableNumber }}</h3>
          <ul>
            <li>Location: {{ table.location }}</li>
            <li>Number of chairs: {{ table.numberOfChairs }}</li>
            <li>Outlet nearby: {{ table.outletNearby ? 'Yes' : 'No' }}</li>
            <li>Toilet nearby: {{ table.toiletNearby ? 'Yes' : 'No' }}</li>
            <li>Capacity: {{ table.capacity }}</li>
            <li>
              Occupancy:
              {{ ((table.utilization / table.capacity) * 100).toFixed(0) }}%
            </li>
          </ul>
          <div class="table-actions">
            <button @click="handleIamHere(table._id)">I am here</button>
          </div>
        </div>

        <p v-show="tables.length === 0">There are no tables available.</p>
      </div>
    </div>
  </main>
</template>