<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

const router = useRouter();
const tables = ref([]); // array to hold table data
const searchTerm = ref(''); // search term for filtering tables
var selectedTableId = ref(null); // selected table id, used to set color change

// variables to add table
var tableNumber = ref(null);
var tableLocation = ref(null);
var numChairs = ref(null);
var powerOutlet = ref(null);
var toiletNearby = ref(null);
var lat = ref(null);
var long = ref(null);

// visit map page
const visitMap = () => {
  router.push('/map');
};

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

// handle the click table btn 
//TODO: for some reason this isn't working 
const handleTableClicked = (table) => {
  selectedTableId.value = table.id;
  console.log("table clicked: ", table.id);
}

// handle add table button 
const handleAddTable = () => {
   const debugStr = `Table Number: ${tableNumber.value}, Location: ${tableLocation.value}, Number of Chairs: ${numChairs.value}, Power Outlet Nearby: ${powerOutlet.value}, Toilet Nearby: ${toiletNearby.value}, Latitude: ${lat.value}, Longitude: ${long.value}`;
   alert(debugStr);

  // check table number singleton
  if (tables.value.some(table => table.table_number === tableNumber.value)) {
    alert("Table number already exists");
    return;
  }

  const reqBody = {
    tableNumber: tableNumber.value,
    location: tableLocation.value,
    numChairs: numChairs.value,
    poNearby: powerOutlet.value,
    tNearby: toiletNearby.value,
    lat: lat.value,
    lon: long.value
  }

  fetch('http://localhost:3000/api/tables/addTable', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reqBody),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to add table');
    }
    return response.json();
  })
  .then(data => {
    console.log("Add table success", data);
    alert("Add table OK");
  })
  .catch(error => {
    console.error(error);
  });
}

// handle moidify btn
const handleModifyTableButton = () => {
  if(selectedTableId.value === null) {
    alert("Please select a table to modify");
    return;
  }

  //TODO: finish this method 
}

// handle delete btn
const handleDeleteTableButton = () => {
  if(selectedTableId.value === null) {
    alert("Please select a table to delete");
    return;
  }
}

onMounted(() => {
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
    })
    .catch(error => {
      console.error(error);
    });
});

</script>

<template>
  <main>
    <div class="wrapper">
      <!-- account controls-->
      <div class="header-toolbar">
        <button class="danger">Log out</button>
        <button @click="visitMap">Map</button>
      </div>

      <div style="display: flex; margin-left: .5em; margin-right: .5em;">
        <div class="left-subcontainer">
          <h2>Administrator</h2>
          <div style="display: inline;">
            <button @click="handleModifyTableButton" >Modify a table</button>
            <button @click="handleDeleteTableButton">Delete a table</button>
            <form @submit.prevent>
              <input v-model="searchTerm" type="text" id="search" placeholder="Search for tables" required>
            </form>
          </div>
          <div>

            <div v-for="table in handleSearch" :key="table.id" @click="handleTableClicked(table)"
              :class="['table-card', selectedTableId === table.id ? 'selected' : '']">
              <h3>Table {{ table.table_number }}</h3>
              <ul>
                <li>Location: {{ table.location }}</li>
                <li>Number of chairs: {{ table.num_chairs }}</li>
                <li>Power outlet nearby? {{ table.power_outlet_nearby > 0 ? 'Yes' : 'No' }}</li>
                <li>Toilet nearby? {{ table.toilet_nearby > 0 ? 'Yes' : 'No' }}</li>
              </ul>
              <!-- <div>
                <button @click="handleIamHere(table.capacity, table.id)">I am here</button>
              </div> -->
              <img v-if="table.capacity > 50" style="margin-left: 5%; transform: rotate(90deg);" height="100"
                width="auto" src="./assets/traffic_green.png" alt="traffic_light_green" />
              <img v-else-if="table.capacity > 20" style="margin-left: 5%; transform: rotate(90deg);" height="100"
                width="auto" src="./assets/traffic_yellow.png" alt="traffic_light_yellow" />
              <img v-else style="margin-left: 5%; transform: rotate(90deg);" height="100" width="auto"
                src="./assets/traffic_red.png" alt="traffic_light_red" />
            </div>
            <p v-show="tables.length == 0">There are no tables available</p>
          </div>
        </div>
        <div class="right-subcontainer">
          <h2>Add a new table</h2>
            <form @submit.prevent="handleAddTable" class="add-table-form">
              <div>
                <label for="tableNumber">Table Number:</label>
                <input id="tableNumber" type="number" required placeholder="Table number..." v-model="tableNumber"/>

                <label for="tableLocation">Location:</label>
                <input id="tableLocation"  type="text" required placeholder="Brief description of location..." v-model="tableLocation"/>

                <label for="numChairs">Number of Chairs:</label>
                <input id="numChairs"  type="number" required placeholder="Number of chairs..." v-model="numChairs" />

                <label for="powerOutlet">Power Outlet Nearby:</label>
                <select id="powerOutlet" required v-model="powerOutlet">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>

                <label for="toiletNearby">Toilet Nearby:</label>
                <select id="toiletNearby" required v-model="toiletNearby">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>

                <label for="latitude">Latitude:</label>
                <input id="latitude" type="number" step="any" required placeholder="Latitude..." v-model="lat"/>

                <label for="longitude">Longitude:</label>
                <input id="longitude" type="number" step="any" required placeholder="Longitude..." v-model="long" />

                <button type="submit">Add Table</button>
              </div>
              <h2>Table QR Code</h2>
            </form>
        </div>
      </div>

    </div>
  </main>
</template>