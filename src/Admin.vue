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
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <v-btn color="error" class="mr-2">Log out</v-btn>
        <v-btn color="primary" @click="visitMap">Map</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <!-- LEFT: Table list -->
      <v-col cols="12" md="6">
        <h2>Administrator</h2>
        <v-btn color="primary" class="mr-2" @click="handleModifyTableButton">Modify Table</v-btn>
        <v-btn color="error" @click="handleDeleteTableButton">Delete Table</v-btn>
        <v-text-field v-model="searchTerm" label="Search for tables" class="mt-4" outlined></v-text-field>

        <v-list>
          <v-list-item v-for="table in handleSearch" :key="table._id" @click="handleTableClicked(table)"
            :class="selectedTableId === table._id ? 'selected' : ''">
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                Table {{ table.tableNumber }}
              </v-list-item-title>

              <div class="text-body-2 mt-2">
                <ul class="pl-4">
                  <li><strong>Location:</strong> {{ table.location }}</li>
                  <li><strong>Chairs:</strong> {{ table.numberOfChairs }}</li>
                  <li><strong>Outlet nearby:</strong> {{ table.outletNearby ? 'Yes' : 'No' }}</li>
                  <li><strong>Toilet nearby:</strong> {{ table.toiletNearby ? 'Yes' : 'No' }}</li>
                  <li><strong>Latitude:</strong> {{ table.latitude }}</li>
                  <li><strong>Longitude:</strong> {{ table.longitude }}</li>
                </ul>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-alert v-show="tables.length === 0" type="info" class="mt-4">
          No tables available
        </v-alert>
      </v-col>

      <!-- RIGHT: Add table form -->
      <v-col cols="12" md="6">
        <h2>Add a new table</h2>
        <v-form @submit.prevent="handleAddTable">
          <v-text-field v-model="tableNumber" label="Table Number" type="number" outlined required></v-text-field>
          <v-text-field v-model="tableLocation" label="Location" outlined required></v-text-field>
          <v-text-field v-model="numChairs" label="Number of Chairs" type="number" outlined required></v-text-field>
          <v-select v-model="powerOutlet" :items="[{ title: 'Yes', value: '1' }, { title: 'No', value: '0' }]"
            label="Power Outlet Nearby" outlined required></v-select>
          <v-select v-model="toiletNearby" :items="[{ title: 'Yes', value: '1' }, { title: 'No', value: '0' }]"
            label="Toilet Nearby" outlined required></v-select>
          <v-text-field v-model="capacity" label="Capacity" type="number" outlined required></v-text-field>
          <v-text-field v-model="lat" label="Latitude" type="number" step="any" outlined required></v-text-field>
          <v-text-field v-model="long" label="Longitude" type="number" step="any" outlined required></v-text-field>
          <v-btn type="submit" color="success" class="mt-4">Add Table</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
