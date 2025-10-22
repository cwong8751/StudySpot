<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// visit login/signup page
const visitLogin = () => {
  router.push('/login');
};
</script>

<template>
  <main>
    <div class="wrapper">
      <h2>StudySpot</h2>
      <p style="padding-bottom: 10px;" >StudySpot is a hotdesking solution, find the next desk near you.</p>
       <button @click="visitLogin">
        LOG IN/ SIGN UP
      </button>
    </div>
  </main>
</template>