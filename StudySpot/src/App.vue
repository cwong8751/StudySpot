<script setup>

</script>

<template>
  <header>
    <h1>StudySpot</h1>
    <i>A campus table solution</i>
  </header>

  <main>
    <div class="wrapper">
      <!-- this is how different contents get rendered-->
      <router-view></router-view>
    </div>

    <footer>
      &copy; 2024 StudySpot by green.
    </footer>
  </main>
</template>