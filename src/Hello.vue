<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// visit login/signup page
const visitLogin = () => {
  router.push('/login');
};
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="d-flex align-center justify-center" style="height: 100vh;">
        <v-card class="pa-4" elevation="3" max-width="400">
          <v-card-title class="text-h5 text-center">StudySpot</v-card-title>
          <v-card-text>
            <p class="text-center mb-4">
              StudySpot is a hotdesking solution, find the next desk near you.
            </p>
            <v-btn block color="primary" @click="visitLogin">
              LOG IN/ SIGN UP
            </v-btn>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>