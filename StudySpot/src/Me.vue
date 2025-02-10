<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const userInfo = ref(null);

// visit map page
const visitMap = () => {
  router.push('/map');
};

// get user details on load
const getUserDetails = async () => {
  let user = sessionStorage.getItem('user');
  if (!user) {
    router.push('/');
  }

  console.log("user", user);

  // let parsedUser;
  // try {
  //   parsedUser = JSON.parse(user); // 🔥 FIX: Parse JSON string
  // } catch (error) {
  //   console.error("Error parsing stored user:", error);
  //   router.push('/');
  //   return;
  // }

  fetch('http://localhost:3000/api/users/getOne', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user.toString() }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Something went wrong.');
      }
      return response.json();
    })
    .then(data => {
      console.log("got user details success", data);
      console.log("data.row", data.row);
      userInfo.value = data.row;
    })
    .catch(error => {
      console.error(error);
    });
}

// on load
onMounted(() => {
  getUserDetails();
});
</script>

<template>
  <main>
    <div class="wrapper">
      <!-- account controls-->
      <div>
        <button>Log out</button>
        <button @click="visitMap">Map</button>
      </div>
      <div style="display: flex">
        <!-- account information -->
        <div style="width: 50%;">
          <h2>Me</h2>

          <b>Details: </b>
          <ul v-if="userInfo">
            <li>Name: {{ userInfo.username }}</li>
            <!-- <li>Email: someone@wustl.edu</li> -->
            <li>Password: {{ userInfo.password }}</li>
            <li>Organization: Washington University in St. Louis</li>
          </ul>
          <p v-else>Loading...</p>

        </div>
        <!-- account controls -->
        <div style="width: 50%;">
          <h2>Actions</h2>
          <b>Delete account: </b>
          <button>Goodbye</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>