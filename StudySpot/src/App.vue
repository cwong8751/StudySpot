<script setup>

</script>

<template>
  <header>
    <h1>StudySpot</h1>
    <i>A campus table solution</i>
    <hr>
  </header>

  <main>
    <div class="wrapper">
      <!-- this is how different contents get rendered-->
      <router-view></router-view>
    </div>

    <footer>
      <hr>
      &copy; 2024 StudySpot by green. <i>In the memory of Freetalk and friends.</i>
    </footer>
  </main>
</template>