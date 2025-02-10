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
      <div class="left-right-container">
        <div class="left-subcontainer">
          <!--login-->
          <h2>Log in/Sign up</h2>
          <button @click="visitLogin">
            Go
          </button>
        </div>
        <div class="right-subcontainer">
          <h2>Hello</h2>
          <p>StudySpot is a campus table solution. Check out vacant study tables all around campus.</p>
        </div>

      </div>
    </div>
  </main>
</template>