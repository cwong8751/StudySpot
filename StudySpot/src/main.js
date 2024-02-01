//import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Login from './Login.vue'
import Hello from './Hello.vue'
import { createRouter, createWebHistory } from 'vue-router'

// build routes
const routes = [
    {path: '/', component: Hello},
    {path: '/login', component: Login}
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