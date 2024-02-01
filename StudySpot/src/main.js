import 'leaflet/dist/leaflet.css';

import { createApp } from 'vue'
import App from './App.vue'
import Login from './Login.vue'
import Hello from './Hello.vue'
import Map from './Map.vue'
import Oops from './404.vue'
import Me from './Me.vue'
import { createRouter, createWebHistory } from 'vue-router'

// build routes
const routes = [
    {path: '/', component: Hello},
    {path: '/login', component: Login},
    {path: '/map', component: Map},
    {path: '/me', component: Me},
    {path: '/:catchAll(.*)', component: Oops}
]

// build router
const router = createRouter({
    history: createWebHistory(),
    routes
})

// build app
const app = createApp(App);
app.use(router)
app.mount('#app');