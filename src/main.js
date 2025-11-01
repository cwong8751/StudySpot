import 'leaflet/dist/leaflet.css';
import '@mdi/font/css/materialdesignicons.css';
import '@/assets/base.css';
import '@/assets/main.css';

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Login from './Login.vue'
import Hello from './Hello.vue'
import Map from './Map.vue'
import Oops from './404.vue'
import Me from './Me.vue'
import Admin from './Admin.vue'

import vuetify from './plugins/vuetify'

// Build routes
const routes = [
  { path: '/', component: Hello },
  { path: '/login', component: Login },
  { path: '/map', component: Map },
  { path: '/me', component: Me },
  { path: '/admin', component: Admin },
  { path: '/:catchAll(.*)', component: Oops },
]

// Build router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Build app
const app = createApp(App)
app.use(router)
app.use(vuetify) // 👈 Add Vuetify here
app.mount('#app')
