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
  <main>
    <div class="wrapper">
      <!-- Header -->
      <div class="header-toolbar">
        <button class="danger" @click="handleLogout">Log out</button>
        <button @click="visitMap">Map</button>
      </div>

      <div style="display: flex; margin-left: .5em; margin-right: .5em;">
        <!-- LEFT: Account Info -->
        <div style="width: 50%;">
          <h2>My Account</h2>

          <b>Details:</b>
          <ul v-if="userInfo">
            <li><b>Username:</b> {{ userInfo.username }}</li>
            <li><b>Email:</b> {{ userInfo.email }}</li>
            <li><b>Account ID:</b> {{ userInfo._id }}</li>
          </ul>
          <p v-else>Loading user info...</p>
        </div>

        <!-- RIGHT: Account Actions -->
        <div style="width: 50%;">
          <h2>Actions</h2>
          <b>Delete Account:</b>
          <button class="danger" @click="handleDeleteAccount">Goodbye</button>
        </div>
      </div>
    </div>
  </main>
</template>
