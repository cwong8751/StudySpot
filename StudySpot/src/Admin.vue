<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// visit map page
const visitMap = () => {
  router.push('/map');
};
</script>

<template>
<main>
  <div class="wrapper">
    <!-- account controls-->
    <div>
      <button>Log out</button>
      <button @click="visitMap">Map</button>
    </div>

    <div style="display: flex;">
      <div style="width: 50%;">
        <h2>Admin centre</h2>
      </div>
      <div style="width: 50%;">
        <h2>Database control</h2>

      </div>
    </div>

  </div>
</main>
</template>

<style scoped>

</style>