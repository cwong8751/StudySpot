<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Router instance
const router = useRouter();

// Form fields
const username = ref('');
const password = ref('');
const email = ref('');
const accountType = ref('login'); // Tracks selected account type

// Function to handle login
const handleLogin = () => {
  console.log(username.value, password.value, email.value);

  // Validate fields
  if (!username.value || !password.value || !email.value) {
    alert("Username, password, or email empty");
    return;
  }

  // Validate email format
  const regex = /^[a-zA-Z0-9._-]+@wustl\.edu$/;
  if (!regex.test(email.value)) {
    alert("Email invalid.");
    return;
  }

  // Fetch request to login user
  fetch('http://localhost:5001/users/login', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username.value, password: password.value }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid username and password.');
      }
      return response.json();
    })
    .then(data => {
      console.log("Login success", data);
      alert("Login success");

      // Set user details into session
      sessionStorage.setItem('user', username.value); // TODO: might want to change this later
      router.push('/map');
    })
    .catch(error => {
      console.error(error);
    });
};

// Function to handle signup
const handleSignup = () => {
  if (!username.value || !password.value) {
    alert("Username or password empty");
    return;
  }

  // Signup
  fetch('http://localhost:5001/users/signup', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username.value, password: password.value, email: email.value }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Something went wrong.');
      }
      return response.json();
    })
    .then(data => {
      console.log("Signup success", data);
      alert("Signup success");
    })
    .catch(error => {
      console.error(error);
    });
};

// Function to handle account selection
const handleAccount = () => {
  if (accountType.value === "login") {
    handleLogin();
  } else {
    handleSignup();
  }
};
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="d-flex justify-center align-center" style="height: 100vh;">
        <v-card class="pa-6" elevation="3" max-width="500" width="100%">
          <v-card-title class="text-h5 text-center mb-4">
            Log in / Sign Up
          </v-card-title>

          <v-card-text>
            <v-radio-group v-model="accountType" row class="mb-4 justify-center">
              <v-radio label="Login" value="login"></v-radio>
              <v-radio label="Sign Up" value="signup"></v-radio>
            </v-radio-group>

            <v-text-field v-model="username" label="Username*" required outlined class="mb-3"></v-text-field>

            <v-text-field v-model="password" label="Password*" type="password" required outlined
              class="mb-3"></v-text-field>

            <v-text-field v-model="email" label="Email*" type="email" required outlined></v-text-field>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn color="primary" @click="handleAccount" size="large">
              Go
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>


<style>
/* Optional: Add custom styles if needed */
</style>
