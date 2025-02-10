<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Router instance
const router = useRouter();

// Form fields
const username = ref('');
const password = ref('');
const email = ref('');

// Function to navigate to "/"
const visitHello = () => {
  router.push('/');
};

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
  fetch('http://localhost:3000/api/users/login', {
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
    router.push('/map'); // ✅ This should now work
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

  fetch('http://localhost:3000/api/users/signup', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username.value, password: password.value }),
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
  const type = document.querySelector('input[name="account"]:checked');
  if (type) {
    type.value === "login" ? handleLogin() : handleSignup();
  } else {
    alert("Please choose login or signup");
  }
};
</script>

<template>
  <main>
    <div class="wrapper">
      <button @click="visitHello">Go back</button>
      <div style="display: flex;">
        <div style="width: 50%">
          <h2>Log in/Sign up</h2>
          <p>If you haven't signed up yet, we will sign you up; otherwise, you will be logged in.</p>
        </div>
        <div style="width: 50%">
          <form @submit.prevent="handleAccount">
            <label for="login">Login: </label>
            <input type="radio" id="login" name="account" value="login" required>
            
            <label for="signup">Sign Up: </label>
            <input type="radio" id="signup" name="account" value="signup">
            
            <br><br>
            <label for="username">Username*: </label>
            <div><input type="text" id="username" v-model="username" placeholder="John" required></div>
            
            <label for="password">Password*: </label>
            <div><input type="password" id="password" v-model="password" placeholder="Smith" required></div>
            
            <label for="email">Email*: </label>
            <div><input type="email" id="email" v-model="email" placeholder="someone@wustl.edu" required></div>

            <button type="submit">Go</button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
