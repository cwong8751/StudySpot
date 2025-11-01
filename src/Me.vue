<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userInfo = ref(null);

// 🔹 Navigate to map
const visitMap = () => {
  router.push('/map');
};

// 🔹 Log out (clear session)
const handleLogout = () => {
  sessionStorage.removeItem('user');
  router.push('/');
};

// 🔹 Delete account
const handleDeleteAccount = async () => {
  if (!userInfo.value) return;

  const confirmDelete = confirm("Are you sure you want to delete your account?");
  if (!confirmDelete) return;

  try {
    const response = await fetch('http://localhost:5001/users/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userInfo.value.username }),
    });

    if (!response.ok) throw new Error('Failed to delete account');

    alert("Your account has been deleted.");
    handleLogout();
  } catch (error) {
    console.error(error);
    alert("Error deleting account.");
  }
};

// 🔹 Get user details from MongoDB
const getUserDetails = async () => {
  const username = sessionStorage.getItem('user');

  if (!username) {
    router.push('/');
    return;
  }

  try {
    const response = await fetch('http://localhost:5001/users/getOne', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) throw new Error('Failed to fetch user details');

    const data = await response.json();
    console.log('✅ User details fetched:', data.user);
    userInfo.value = data.user;
  } catch (error) {
    console.error(error);
  }
};

// 🔹 Load user info when page loads
onMounted(() => {
  getUserDetails();
});
</script>

<template>
  <v-app>
    <v-main>
      <v-container>

        <v-app-bar app color="primary" dark>
          <v-toolbar-title>StudySpot</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="bg-red-darken-2 text-white" @click="handleLogout">Log out</v-btn>
          <v-btn @click="visitMap">Map</v-btn>
        </v-app-bar>

        <v-row>
          <v-col cols="12">
            <v-card class="mb-4">
              <v-card-title>My Account</v-card-title>
              <v-card-text>
                <b>Details:</b>
                <v-list v-if="userInfo">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title><b>Username:</b> {{ userInfo.username }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title><b>Email:</b> {{ userInfo.email }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title><b>Account ID:</b> {{ userInfo._id }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
              </v-card-text>
            </v-card>

            <v-card class="mb-4">
              <v-card-title>Tabling history</v-card-title>
              <v-card-text>
                <p>Feature coming soon!</p>
              </v-card-text>
            </v-card>

            <v-card class="mb-4">
              <v-card-title>Actions</v-card-title>
              <v-card-text>
                <b>Delete Account:</b>
                <v-btn color="error" @click="handleDeleteAccount">Goodbye</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
/* Add any custom styles if needed */
</style>
