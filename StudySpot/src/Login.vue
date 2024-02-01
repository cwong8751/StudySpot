<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// visit / page
const visitHello = () => {
  router.push('/');
};
</script>

<template>
  <main>
    <div class="wrapper">
      <button @click="visitHello">Go back</button>
      <div style="display: flex;">
        <div style="width: 50%">
          <h2>Log in/Sign up</h2>
          <p>If you haven't signed up yet we will sign you up, else you will get logged in.</p>
        </div>
        <div style="width: 50%">
          <form>
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