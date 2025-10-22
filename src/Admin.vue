<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const tables = ref([]);
const searchTerm = ref('');
const selectedTableId = ref(null);

// Add Table Form fields
const tableNumber = ref('');
const tableLocation = ref('');
const numChairs = ref('');
const powerOutlet = ref('0');
const toiletNearby = ref('0');
const lat = ref('');
const long = ref('');
const capacity = ref('');

// 🔹 Go back to map
const visitMap = () => {
  router.push('/map');
};

// 🔹 Search filter
const handleSearch = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return tables.value.filter((table) =>
    table.tableNumber.toString().includes(term) ||
    table.location.toLowerCase().includes(term)
  );
});

// 🔹 Handle selecting a table
const handleTableClicked = (table) => {
  selectedTableId.value = table._id;
  console.log('Table clicked:', table._id);
};

// 🔹 Add table to MongoDB
const handleAddTable = async () => {
  if (!tableNumber.value || !tableLocation.value || !numChairs.value || !lat.value || !long.value) {
    alert('Please fill in all required fields');
    return;
  }

  const reqBody = {
    tableNumber: Number(tableNumber.value),
    location: tableLocation.value,
    numberOfChairs: Number(numChairs.value),
    outletNearby: powerOutlet.value === '1',
    toiletNearby: toiletNearby.value === '1',
    capacity: Number(capacity.value),
    utilization: 0,
    latitude: Number(lat.value),
    longitude: Number(long.value)
  };

  try {
    const response = await fetch('http://localhost:5001/tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) throw new Error('Failed to add table');

    const data = await response.json();
    alert('✅ Table added successfully');
    tables.value.push(data); // Add new table to list
  } catch (error) {
    console.error(error);
    alert('❌ Error adding table');
  }
};

// 🔹 Fetch all tables from MongoDB
const fetchTables = async () => {
  try {
    const response = await fetch('http://localhost:5001/tables');
    if (!response.ok) throw new Error('Failed to fetch tables');

    const data = await response.json();
    tables.value = data;
    console.log('✅ Loaded tables:', data);
  } catch (error) {
    console.error(error);
  }
};

// 🔹 Placeholder modify/delete handlers
const handleModifyTableButton = () => {
  if (!selectedTableId.value) {
    alert('Please select a table to modify');
    return;
  }
  alert('Modify feature coming soon!');
};

const handleDeleteTableButton = () => {
  if (!selectedTableId.value) {
    alert('Please select a table to delete');
    return;
  }
  alert('Delete feature coming soon!');
};

// 🔹 Load tables on mount
onMounted(fetchTables);
</script>

<template>
  <main>
    <div class="wrapper">
      <!-- Header -->
      <div class="header-toolbar">
        <button class="danger">Log out</button>
        <button @click="visitMap">Map</button>
      </div>

      <div style="display: flex; margin-left: .5em; margin-right: .5em;">
        <!-- LEFT: Table list -->
        <div class="left-subcontainer">
          <h2>Administrator</h2>
          <div>
            <button @click="handleModifyTableButton">Modify Table</button>
            <button @click="handleDeleteTableButton">Delete Table</button>
            <form @submit.prevent>
              <input v-model="searchTerm" type="text" placeholder="Search for tables" />
            </form>
          </div>

          <!-- Tables -->
          <div>
            <div v-for="table in handleSearch" :key="table._id" @click="handleTableClicked(table)"
              :class="['table-card', selectedTableId === table._id ? 'selected' : '']">
              <h3>Table {{ table.tableNumber }}</h3>
              <ul>
                <li>Location: {{ table.location }}</li>
                <li>Chairs: {{ table.numberOfChairs }}</li>
                <li>Outlet nearby: {{ table.outletNearby ? 'Yes' : 'No' }}</li>
                <li>Toilet nearby: {{ table.toiletNearby ? 'Yes' : 'No' }}</li>
                <li>Latitude: {{ table.latitude }}</li>
                <li>Longitude: {{ table.longitude }}</li>
              </ul>
            </div>
            <p v-show="tables.length === 0">No tables available</p>
          </div>
        </div>

        <!-- RIGHT: Add table form -->
        <div class="right-subcontainer">
          <h2>Add a new table</h2>
          <form @submit.prevent="handleAddTable" class="add-table-form">
            <div>
              <label for="tableNumber">Table Number:</label>
              <input id="tableNumber" type="number" v-model="tableNumber" required />

              <label for="tableLocation">Location:</label>
              <input id="tableLocation" type="text" v-model="tableLocation" required />

              <label for="numChairs">Number of Chairs:</label>
              <input id="numChairs" type="number" v-model="numChairs" required />

              <label for="powerOutlet">Power Outlet Nearby:</label>
              <select id="powerOutlet" v-model="powerOutlet" required>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>

              <label for="toiletNearby">Toilet Nearby:</label>
              <select id="toiletNearby" v-model="toiletNearby" required>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>

              <label for="capacity">Capacity:</label>
              <input id="capacity" type="number" required placeholder="Max capacity..." v-model="capacity" />

              <label for="latitude">Latitude:</label>
              <input id="latitude" type="number" step="any" v-model="lat" required />

              <label for="longitude">Longitude:</label>
              <input id="longitude" type="number" step="any" v-model="long" required />

              <button type="submit">Add Table</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
